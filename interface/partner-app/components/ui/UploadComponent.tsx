import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cloudinaryUploadService, UploadType } from '../../services/cloudinaryUploadService';

export interface UploadedFile {
  uri: string;
  cloudinaryUrl?: string;
  publicId?: string;
  status: 'pending' | 'optimizing' | 'uploading' | 'completed' | 'error';
  error?: string;
  progress: number;
  fileType?: 'image' | 'video' | 'document'; // Track file type explicitly
}

interface UploadComponentProps {
  title: string;
  description?: string;
  uploadType: UploadType;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video' | 'document')[];
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  folder?: string;
  disabled?: boolean;
}

// Helper to determine file type label
const getFileTypeLabel = (allowedTypes: string[]): string => {
  if (allowedTypes.includes('image')) {
    if (allowedTypes.length === 1) return 'Image';
    return 'Image, Video, Document';
  }
  if (allowedTypes.includes('video')) {
    if (allowedTypes.length === 1) return 'Video';
    return 'Video';
  }
  if (allowedTypes.includes('document')) {
    if (allowedTypes.length === 1) return 'PDF/Document';
    return 'Document';
  }
  return 'File';
};

export const UploadComponent: React.FC<UploadComponentProps> = ({
  title,
  description,
  uploadType,
  maxFiles = 5,
  allowedTypes = ['image'],
  onFilesChange,
  files: externalFiles = [],
  folder,
  disabled = false,
}) => {
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>(externalFiles);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const isInitialMount = useRef(true);

  // Only sync external files on initial mount or when they significantly change
  useEffect(() => {
    if (isInitialMount.current) {
      setInternalFiles(externalFiles);
      isInitialMount.current = false;
    }
  }, []);

  const updateFileStatus = (uri: string, updates: Partial<UploadedFile>) => {
    setInternalFiles((currentFiles) => {
      const updated = currentFiles.map((f) => (f.uri === uri ? { ...f, ...updates } : f));
      // Notify parent of changes
      setTimeout(() => onFilesChange(updated), 0);
      return updated;
    });
  };

  const handleFilePreview = (file: UploadedFile) => {
    if (file.status === 'completed' || file.status === 'pending') {
      setPreviewFile(file);
      setPreviewModalVisible(true);
    }
  };

  const handleFileSelection = async () => {
    if (disabled || internalFiles.length >= maxFiles) {
      Alert.alert('Maximum Files Reached', `You can only upload up to ${maxFiles} files.`);
      return;
    }

    try {
      const configStatus = cloudinaryUploadService.getConfigStatus();
      if (!configStatus.configured) {
        Alert.alert(
          'Configuration Error', 
          `Cloudinary not configured. Missing: ${configStatus.missing.join(', ')}`,
        );
        return;
      }

      // Create hidden file input for web to intercept file selection
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        
        // Set accept attribute based on allowed types
        if (allowedTypes.includes('image')) {
          input.accept = 'image/*';
        } else if (allowedTypes.includes('video')) {
          input.accept = 'video/*';
        } else if (allowedTypes.includes('document')) {
          input.accept = '.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx';
        }
        
        if (maxFiles > 1) {
          input.multiple = true;
        }

        // Wrap file picker in a Promise with error handling
        let result: any;
        try {
          result = await new Promise<any>((resolve, reject) => {
          input.onchange = (e: any) => {
            const files = e.target.files;
            
            if (!files || files.length === 0) {
              resolve({ canceled: true });
              return;
            }

            // PRE-CHECK: Validate each file immediately
            const validFiles: File[] = [];
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const fileName = file.name;
              const mimeType = file.type;

              // Check if file matches allowed types
              let isValid = false;
              
              if (allowedTypes.includes('image')) {
                isValid = mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName);
              }
              if (!isValid && allowedTypes.includes('video')) {
                isValid = mimeType.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(fileName);
              }
              if (!isValid && allowedTypes.includes('document')) {
                isValid = /\.(pdf|doc|docx|txt|rtf|xls|xlsx|ppt|pptx)$/i.test(fileName);
              }

              if (!isValid) {
                Alert.alert(
                  'Wrong File Type',
                  `${fileName || 'This file'} is not a ${getFileTypeLabel(allowedTypes)} file. Please upload ${getFileTypeLabel(allowedTypes)} files only.`,
                );
                reject(new Error(`UNSUPPORTED_FILE: ${fileName}`));
                return;
              }

              validFiles.push(file);
            }

            // Convert files to URI format for processing
            const assets = validFiles.map((file) => ({
              uri: URL.createObjectURL(file),
              type: file.type,
              name: file.name,
              mimeType: file.type,
              fileName: file.name,
            }));

            resolve({ canceled: false, assets });
          };

          input.oncancel = () => {
            resolve({ canceled: true });
          };

          // Trigger file picker
          input.click();
        });
        } catch (error: any) {
          // Handle UNSUPPORTED_FILE error - alert already shown in validation
          if (error?.message?.includes('UNSUPPORTED_FILE')) {
            return; // Already shown alert to user
          }
          Alert.alert('Error', 'Failed to select files. Please try again.');
          return;
        }

        if (result.canceled || !result.assets) {
          return;
        }

        // Files already validated above, create newFiles directly
        const newFiles: UploadedFile[] = result.assets.map((asset: any) => ({
          uri: asset.uri,
          status: 'pending',
          progress: 0,
          fileType: allowedTypes[0] as 'image' | 'video' | 'document',
        }));

        const updatedFiles = [...internalFiles, ...newFiles].slice(0, maxFiles);
        setInternalFiles(updatedFiles);
        onFilesChange(updatedFiles);

        // Upload each new file
        for (const file of newFiles) {
          try {
            updateFileStatus(file.uri, { status: 'optimizing' });

            const uploadResult = await cloudinaryUploadService.uploadFile(
              file.uri,
              uploadType,
              { folder },
              (progress) => {
                updateFileStatus(file.uri, {
                  status: 'uploading',
                  progress: progress * 100,
                });
              },
            );

            if (uploadResult.success && uploadResult.url) {
              updateFileStatus(file.uri, {
                status: 'completed',
                cloudinaryUrl: uploadResult.url,
                publicId: uploadResult.publicId,
                progress: 100,
              });
            } else {
              throw new Error(uploadResult.error || 'Upload failed');
            }
          } catch (error: any) {
            updateFileStatus(file.uri, {
              status: 'error',
              error: error.message,
            });
          }
        }
      } else {
        // Mobile fallback - use Expo pickers
        try {
          const result = await (allowedTypes.includes('document')
        ? cloudinaryUploadService.pickDocuments({ allowsMultipleSelection: maxFiles > 1 })
            : allowedTypes.includes('video')
            ? cloudinaryUploadService.pickVideos({ allowsMultipleSelection: maxFiles > 1 })
        : cloudinaryUploadService.pickImage({
            allowsMultipleSelection: maxFiles > 1,
            allowsEditing: false,
          }));

      if (result.canceled || !result.assets) {
        return;
      }
      
      const newFiles: UploadedFile[] = result.assets.map((asset: any) => ({
            uri: asset.uri || asset.fileUri,
        status: 'pending',
        progress: 0,
            fileType: allowedTypes[0] as 'image' | 'video' | 'document',
      }));

          const updatedFiles = [...internalFiles, ...newFiles].slice(0, maxFiles);
          setInternalFiles(updatedFiles);
      onFilesChange(updatedFiles);

      // Upload each new file
          for (const file of newFiles) {
        try {
          updateFileStatus(file.uri, { status: 'optimizing' });

          const uploadResult = await cloudinaryUploadService.uploadFile(
            file.uri,
            uploadType,
            { folder },
            (progress) => {
              updateFileStatus(file.uri, {
                status: 'uploading',
                progress: progress * 100,
              });
            },
          );

          if (uploadResult.success && uploadResult.url) {
            updateFileStatus(file.uri, {
              status: 'completed',
              cloudinaryUrl: uploadResult.url,
                  publicId: uploadResult.publicId,
              progress: 100,
            });
          } else {
            throw new Error(uploadResult.error || 'Upload failed');
          }
        } catch (error: any) {
          updateFileStatus(file.uri, {
            status: 'error',
            error: error.message,
          });
        }
          }
        } catch (pickerError: any) {
          if (pickerError?.message?.includes('UNSUPPORTED_FILE')) {
            // Already handled by alert in web path
            return;
          }
          Alert.alert('Error', 'Failed to select files. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('File selection error:', error);
      
      if (error?.message?.includes('UNSUPPORTED_FILE')) {
        // Already handled by alert in web path
        return;
      }
      
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const removeFile = async (file: UploadedFile) => {
    if (disabled) return;

    Alert.alert(
      'Delete Asset',
      'Are you sure you want to delete this asset?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (file.publicId && file.status === 'completed') {
              try {
                await cloudinaryUploadService.deleteImage(file.publicId);
              } catch (error) {
                console.error('Delete error:', error);
              }
            }

            setInternalFiles((currentFiles) => {
              const updated = currentFiles.filter((f) => f.uri !== file.uri);
              onFilesChange(updated);
              return updated;
            });
          },
        },
      ],
    );
  };

  const renderFilePreview = (file: UploadedFile, index: number) => {
    const isImage = file.fileType === 'image' || allowedTypes.includes('image');
    const isVideo = file.fileType === 'video' || allowedTypes.includes('video');
    const hasValidUrl = file.cloudinaryUrl || file.uri;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleFilePreview(file)}
        style={styles.previewContainer}
      >
        {isImage && hasValidUrl ? (
          <Image
            source={{ uri: file.cloudinaryUrl || file.uri }}
            style={styles.previewImage}
            onError={() => console.log('Image load error:', file.uri)}
          />
        ) : isVideo && hasValidUrl ? (
          <View style={styles.videoPreview}>
            <Image source={{ uri: file.cloudinaryUrl || file.uri }} style={styles.previewImage} />
            <View style={styles.playButtonOverlay}>
              <Ionicons name="play-circle" size={32} color="white" />
            </View>
          </View>
        ) : (
          <View style={styles.documentPreview}>
            <Ionicons name="document-text-outline" size={24} color="#FF9B42" />
          </View>
        )}

        {file.status === 'uploading' && (
          <View style={styles.progressOverlay}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.progressText}>{Math.round(file.progress)}%</Text>
          </View>
        )}
        
        {file.status === 'optimizing' && (
          <View style={styles.statusOverlay}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
        
        {file.status === 'error' && (
          <View style={styles.errorOverlay}>
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
          </View>
        )}

        {!disabled && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFile(file)}
          >
            <Ionicons name="close" size={12} color="white" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const canAddMore = internalFiles.length < maxFiles && !disabled;
  const displayFiles = maxFiles === 1 ? internalFiles.slice(0, 1) : internalFiles;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}

      {/* Initial Upload Button */}
      {internalFiles.length === 0 && canAddMore && (
        <TouchableOpacity onPress={handleFileSelection} style={styles.uploadButton}>
          <Ionicons name="cloud-upload-outline" size={48} color="#FF9B42" />
          <Text style={styles.uploadButtonText}>{`Tap to upload ${title.toLowerCase()}`}</Text>
            <Text style={styles.uploadButtonSubText}>
            {getFileTypeLabel(allowedTypes)} up to 5MB
            </Text>
        </TouchableOpacity>
      )}

      {/* Existing Files Display */}
      {internalFiles.length > 0 && (
        <View style={styles.filesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filesRow}>
              {displayFiles.map(renderFilePreview)}

              {/* Add More Button */}
              {canAddMore && (
                <TouchableOpacity
                  onPress={handleFileSelection}
                  style={styles.addMoreButton}
                >
                  <Ionicons name="add" size={24} color="#FF9B42" />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Preview Modal */}
      <Modal
        visible={previewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPreviewModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {previewFile && (
            <View style={styles.modalContent}>
              {previewFile.fileType === 'image' && previewFile.cloudinaryUrl ? (
                <Image
                  source={{ uri: previewFile.cloudinaryUrl }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : previewFile.fileType === 'video' ? (
                <View style={styles.modalDocumentView}>
                  <Ionicons name="videocam" size={64} color="#FF9B42" />
                  <Text style={styles.modalDocumentTitle}>Video</Text>
                  <Text style={styles.modalDocumentStatus}>
                    {previewFile.status === 'completed' ? 'Uploaded successfully' : 'Processing...'}
                  </Text>
                </View>
              ) : (
                <View style={styles.modalDocumentView}>
                  <Ionicons name="document-text" size={64} color="#FF9B42" />
                  <Text style={styles.modalDocumentTitle}>
                    {previewFile.uri.split('/').pop() || 'Document'}
                  </Text>
                  <Text style={styles.modalDocumentStatus}>
                    {previewFile.status === 'completed' ? 'Uploaded successfully' : 'Processing...'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#FF9B42',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9B42',
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  uploadButtonSubText: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  filesContainer: {
    marginTop: 16,
  },
  filesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  documentPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9f5ff',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF9B42',
    borderStyle: 'dashed',
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalDocumentView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    maxWidth: '80%',
  },
  modalDocumentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  modalDocumentStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
});

export default UploadComponent;
