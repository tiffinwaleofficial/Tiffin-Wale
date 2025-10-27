import React, { useState } from 'react';
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
  publicId?: string; // For Cloudinary deletion
  status: 'pending' | 'optimizing' | 'uploading' | 'completed' | 'error';
  error?: string;
  progress: number;
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

export const UploadComponent: React.FC<UploadComponentProps> = ({
  title,
  description,
  uploadType,
  maxFiles = 5,
  allowedTypes = ['image'],
  onFilesChange,
  files = [],
  folder,
  disabled = false,
}) => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const updateFileStatus = (uri: string, updates: Partial<UploadedFile>) => {
    onFilesChange(
      files.map((f) => (f.uri === uri ? { ...f, ...updates } : f)),
    );
  };

  const handleFilePreview = (file: UploadedFile) => {
    if (file.status === 'completed' || file.status === 'pending') {
      setPreviewFile(file);
      setPreviewModalVisible(true);
    }
  };

  const handleFileSelection = async () => {
    if (disabled || files.length >= maxFiles) {
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

      const result: any = await (allowedTypes.includes('document')
        ? cloudinaryUploadService.pickDocuments({ allowsMultipleSelection: maxFiles > 1 })
        : cloudinaryUploadService.pickImage({
            allowsMultipleSelection: maxFiles > 1,
            allowsEditing: false,
          }));

      if (result.canceled || !result.assets) {
        return;
      }
      
      const newFiles: UploadedFile[] = result.assets.map((asset: any) => ({
        uri: asset.uri,
        status: 'pending',
        progress: 0,
      }));

      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      onFilesChange(updatedFiles);

      // Upload each new file (using for...of for proper async handling)
      for (const file of newFiles) {
        try {
          console.log('🚀 Starting upload for file:', file.uri);
          console.log('📦 Upload type:', uploadType);
          console.log('📁 Folder:', folder);
          
          updateFileStatus(file.uri, { status: 'optimizing' });

          const uploadResult = await cloudinaryUploadService.uploadFile(
            file.uri,
            uploadType,
            { folder },
            (progress) => {
              console.log('📊 Upload progress:', progress * 100, '%');
              updateFileStatus(file.uri, {
                status: 'uploading',
                progress: progress * 100,
              });
            },
          );

          console.log('✅ Upload result:', uploadResult);

          if (uploadResult.success && uploadResult.url) {
            console.log('🎉 Upload completed successfully!', uploadResult.url);
            updateFileStatus(file.uri, {
              status: 'completed',
              cloudinaryUrl: uploadResult.url,
              publicId: uploadResult.publicId,
              progress: 100,
            });
          } else {
            console.error('❌ Upload failed:', uploadResult.error);
            throw new Error(uploadResult.error || 'Upload failed');
          }
        } catch (error: any) {
          console.error('❌ Upload error for', file.uri, error);
          updateFileStatus(file.uri, {
            status: 'error',
            error: error.message,
          });
        }
      }
    } catch (error) {
      console.error('File selection error:', error);
      Alert.alert('Error', 'Failed to select files.');
    }
  };

  const removeFile = async (file: UploadedFile) => {
    if (disabled) return;
    
    // Show confirmation dialog
    Alert.alert(
      'Delete Asset',
      'Are you sure you want to delete this asset? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // If file is uploaded to Cloudinary, delete it there first
            if (file.publicId && file.status === 'completed') {
              try {
                const deleteResult = await cloudinaryUploadService.deleteImage(file.publicId);
                if (!deleteResult.success) {
                  Alert.alert('Error', 'Failed to delete asset from server.');
                  return;
                }
              } catch (error) {
                console.error('Delete error:', error);
                Alert.alert('Error', 'Failed to delete asset from server.');
                return;
              }
            }
            
            // Remove from local state
            onFilesChange(files.filter((f) => f.uri !== file.uri));
          },
        },
      ],
    );
  };

  const renderFilePreview = (file: UploadedFile, index: number) => {
    const isImage = file.uri.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleFilePreview(file)}
        style={styles.previewContainer}
      >
        {isImage ? (
          <Image
            source={{ uri: file.cloudinaryUrl || file.uri }}
            style={styles.previewImage}
          />
        ) : (() => {
          const isVideo = file.uri.match(/\.(mp4|mov|avi|mkv|webm|flv|wmv)$/i);
          return isVideo ? (
            <View style={styles.videoPreview}>
              <Image
                source={{ uri: file.cloudinaryUrl || file.uri }}
                style={styles.previewImage}
              />
              <View style={styles.playButtonOverlay}>
                <Ionicons name="play-circle" size={32} color="white" />
              </View>
            </View>
          ) : (
            <View style={styles.documentPreview}>
              <Ionicons name="document-text-outline" size={24} color="#FF9B42" />
            </View>
          );
        })()}

        {file.status === 'uploading' && (
          <View style={styles.progressOverlay}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${file.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(file.progress)}%</Text>
          </View>
        )}
        
        {file.status === 'optimizing' && (
          <View style={styles.statusOverlay}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.statusText}>Optimizing...</Text>
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
  
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {files.length < maxFiles && !disabled ? (
        <TouchableOpacity
          onPress={handleFileSelection}
          style={styles.uploadButton}
        >
          <Ionicons 
            name="cloud-upload-outline" 
            size={48} 
            color="#FF9B42" 
          />
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={styles.uploadButtonText}>
              {`Tap to upload ${title.toLowerCase()}`}
            </Text>
            <Text style={styles.uploadButtonSubText}>
              {allowedTypes.join(', ').toUpperCase()} up to 5MB
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {files.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {files.map(renderFilePreview)}
            </View>
          </ScrollView>
        </View>
      )}

      {/* File Preview Modal */}
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
              {previewFile.uri.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                <Image
                  source={{ uri: previewFile.cloudinaryUrl || previewFile.uri }}
                  style={styles.modalImage}
                />
              ) : previewFile.uri.match(/\.(mp4|mov|avi|mkv|webm|flv|wmv)$/i) ? (
                <View style={styles.modalDocumentView}>
                  <Ionicons name="videocam" size={64} color="#FF9B42" />
                  <Text style={styles.modalDocumentTitle}>
                    {previewFile.uri.split('/').pop() || 'Video'}
                  </Text>
                  <Text style={styles.modalDocumentStatus}>
                    Video uploaded successfully
                  </Text>
                </View>
              ) : (
                <View style={styles.modalDocumentView}>
                  <Ionicons 
                    name="document-text" 
                    size={64} 
                    color="#FF9B42" 
                  />
                  <Text style={styles.modalDocumentTitle}>
                    {previewFile.uri.split('/').pop() || 'Document'}
                  </Text>
                  <Text style={styles.modalDocumentStatus}>
                    {previewFile.status === 'completed' ? 'Uploaded successfully' : 'Pending upload'}
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
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
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  uploadButtonSubText: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
  },
  previewContainer: {
    width: 80,
    height: 80,
    margin: 4,
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
    position: 'relative',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
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
    resizeMode: 'contain',
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
    textAlign: 'center',
  },
  modalDocumentStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default UploadComponent;