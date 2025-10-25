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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cloudinaryUploadService, UploadType } from '../../services/cloudinaryUploadService';
import { useTheme } from '../../store/themeStore';

interface UploadedFile {
  uri: string;
  cloudinaryUrl?: string;
  uploading: boolean;
  error?: string;
  progress?: number;
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
  const { theme } = useTheme();
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const handleFilePreview = (file: UploadedFile) => {
    setPreviewFile(file);
    setPreviewModalVisible(true);
  };

  const handleFileSelection = async () => {
    if (disabled) return;
    
    if (files.length >= maxFiles) {
      Alert.alert('Maximum Files Reached', `You can only upload up to ${maxFiles} files.`);
      return;
    }

    try {
      // Check if cloudinaryUploadService is configured
      const configStatus = cloudinaryUploadService.getConfigStatus();
      if (!configStatus.configured) {
        Alert.alert(
          'Configuration Error', 
          `Cloudinary not configured. Missing: ${configStatus.missing.join(', ')}`
        );
        return;
      }

      // Pick files based on allowed types
      let result: any;
      if (allowedTypes.includes('document') && !allowedTypes.includes('image')) {
        // Documents only
        result = await cloudinaryUploadService.pickDocuments({
          allowsMultipleSelection: maxFiles > 1,
        });
      } else if (allowedTypes.includes('image') && allowedTypes.includes('document')) {
        // Both images and documents - default to images for now
        result = await cloudinaryUploadService.pickImage({
          allowsMultipleSelection: maxFiles > 1,
          allowsEditing: false,
        });
      } else {
        // Images only (default)
        result = await cloudinaryUploadService.pickImage({
          allowsMultipleSelection: maxFiles > 1,
          allowsEditing: false,
        });
      }

      // Handle different result structures
      let newFiles: UploadedFile[] = [];
      
      if (allowedTypes.includes('document') && !allowedTypes.includes('image')) {
        // Document picker result
        if (result && !(result as any).canceled) {
          if ((result as any).assets && Array.isArray((result as any).assets)) {
            newFiles = (result as any).assets.map((asset: any) => ({
              uri: asset.uri,
              uploading: false,
              progress: 0,
            }));
          } else if ((result as any).uri) {
            newFiles = [{
              uri: (result as any).uri,
              uploading: false,
              progress: 0,
            }];
          }
        }
      } else {
        // Image picker result
        if (!result.canceled && result.assets) {
          newFiles = result.assets.map((asset: any) => ({
            uri: asset.uri,
            uploading: false,
            progress: 0,
          }));
        }
      }
      
      if (newFiles.length === 0) {
        return; // No files selected
      }

      // Add new files to the list
      const updatedFiles = [...files, ...newFiles];
      onFilesChange(updatedFiles);

      // Upload each file to Cloudinary with progress tracking
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        try {
          console.log('🚀 UploadComponent: Starting upload for', file.uri.substring(0, 50) + '...');
          
          // Mark as uploading and show initial progress
          let currentFiles = [...updatedFiles];
          currentFiles = currentFiles.map(f => 
            f.uri === file.uri 
              ? { ...f, uploading: true, progress: 0 }
              : f
          );
          onFilesChange(currentFiles);
          console.log('📊 UploadComponent: Started upload for', file.uri.substring(0, 50) + '...', 'Progress: 0%');

            // Upload to Cloudinary using the enhanced uploadFile method
            const uploadResult = await cloudinaryUploadService.uploadFile(
              file.uri,
              uploadType,
              {
                folder,
              },
              (progress) => {
                const progressFiles = currentFiles.map(f =>
                  f.uri === file.uri
                    ? { ...f, progress: progress * 100 }
                    : f
                );
                onFilesChange(progressFiles);
              }
            );

          if (uploadResult.success && uploadResult.url) {
            // Update progress to 100% and mark as complete
            const completedFiles = currentFiles.map(f => 
              f.uri === file.uri 
                ? { ...f, cloudinaryUrl: uploadResult.url, uploading: false, progress: 100 }
                : f
            );
            onFilesChange(completedFiles);
            console.log('✅ UploadComponent: Upload completed for', file.uri.substring(0, 50) + '...', 'URL:', uploadResult.url);
          } else {
            // Mark upload as failed
            const failedFiles = currentFiles.map(f => 
              f.uri === file.uri 
                ? { ...f, uploading: false, error: uploadResult.error, progress: 0 }
                : f
            );
            onFilesChange(failedFiles);
            Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload file');
          }
        } catch (error) {
          console.error('Upload error:', error);
          const errorFiles = updatedFiles.map(f => 
            f.uri === file.uri 
              ? { ...f, uploading: false, error: 'Upload failed', progress: 0 }
              : f
          );
          onFilesChange(errorFiles);
        }
      }
    } catch (error) {
      console.error('File selection error:', error);
      Alert.alert('Error', 'Failed to select files');
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    const updatedFiles = files.filter((_: UploadedFile, i: number) => i !== index);
    onFilesChange(updatedFiles);
  };

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
      }}>
        {title}
      </Text>

      {description && (
        <Text style={{
          fontSize: 14,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.md,
          lineHeight: 20,
        }}>
          {description}
        </Text>
      )}

      {/* Upload Button */}
      {files.length === 0 ? (
        <TouchableOpacity
          onPress={handleFileSelection}
          disabled={disabled}
          style={{
            borderWidth: 2,
            borderColor: theme.colors.primary,
            borderStyle: 'dashed',
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.xl,
            alignItems: 'center',
            backgroundColor: disabled ? theme.colors.surface : 'transparent',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <Ionicons 
            name="cloud-upload-outline" 
            size={48} 
            color={disabled ? theme.colors.textSecondary : theme.colors.primary} 
          />
          <View style={{ alignItems: 'center', marginTop: theme.spacing.md }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: disabled ? theme.colors.textSecondary : theme.colors.primary,
              textAlign: 'center',
            }}>
              {`Tap to upload ${title.toLowerCase()}`}
            </Text>
            <Text style={{
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs,
              fontSize: 12,
            }}>
              PNG, JPG up to 5MB
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{
          borderWidth: 1,
          borderColor: theme.colors.success,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.success + '10',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
          <Text style={{
            color: theme.colors.success,
            marginLeft: theme.spacing.sm,
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
          }}>
            {title} uploaded successfully
          </Text>
          {!disabled && (
            <TouchableOpacity onPress={handleFileSelection}>
              <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* File Previews with Progress Overlay */}
      {files.length > 0 && (
        <View style={{ marginTop: theme.spacing.md }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {files.map((file, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleFilePreview(file)}
                  style={{
                    width: 80,
                    height: 80,
                    margin: 4,
                    borderRadius: 8,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  {file.uploading ? (
                    <View style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: theme.colors.surface,
                    }}>
                      {/* Animated Progress Bar */}
                      <View style={{
                        width: '80%',
                        height: 4,
                        backgroundColor: theme.colors.border,
                        borderRadius: 2,
                        overflow: 'hidden',
                        marginBottom: 8,
                      }}>
                        <View style={{
                          width: `${file.progress || 0}%`,
                          height: '100%',
                          backgroundColor: theme.colors.primary,
                          borderRadius: 2,
                        }} />
                      </View>
                      <Text style={{
                        fontSize: 12,
                        color: theme.colors.primary,
                        fontWeight: '600',
                      }}>
                        {Math.round(file.progress || 0)}%
                      </Text>
                      <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 4 }} />
                    </View>
                  ) : file.error ? (
                    <View style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: theme.colors.error + '10',
                    }}>
                      <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
                      <Text style={{
                        fontSize: 10,
                        color: theme.colors.error,
                        textAlign: 'center',
                        marginTop: 4,
                      }}>
                        Failed
                      </Text>
                    </View>
                  ) : (
                    // Show file preview
                    <View style={{ flex: 1 }}>
                      {file.uri && file.uri.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                        <Image
                          source={{ uri: file.cloudinaryUrl || file.uri }}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                        />
                      ) : (
                        // Document icon
                        <View style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: theme.colors.primary + '10',
                        }}>
                          <Ionicons 
                            name={file.uri.match(/\.pdf$/i) ? 'document-text' : 
                                  file.uri.match(/\.(doc|docx)$/i) ? 'document' :
                                  file.uri.match(/\.(xls|xlsx)$/i) ? 'grid' :
                                  file.uri.match(/\.(ppt|pptx)$/i) ? 'easel' :
                                  'document'} 
                            size={24} 
                            color={theme.colors.primary} 
                          />
                        </View>
                      )}
                    </View>
                  )}

                  {/* Remove button */}
                  {!disabled && (
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: theme.colors.error,
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => removeFile(index)}
                    >
                      <Ionicons name="close" size={12} color="white" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Upload Status Messages */}
      {files.some(f => f.uploading) && (
        <Text style={{
          fontSize: 12,
          color: theme.colors.primary,
          marginTop: theme.spacing.sm,
          textAlign: 'center',
          fontWeight: '500',
        }}>
          Uploading files... Please wait
        </Text>
      )}

      {files.some(f => f.error) && (
        <Text style={{
          fontSize: 12,
          color: theme.colors.error,
          marginTop: theme.spacing.sm,
          textAlign: 'center',
          fontWeight: '500',
        }}>
          Some files failed to upload. Please try again.
        </Text>
      )}

      {/* File Preview Modal */}
      <Modal
        visible={previewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Close Button */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setPreviewModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {/* Preview Content */}
          {previewFile && (
            <View style={{
              width: Dimensions.get('window').width * 0.9,
              height: Dimensions.get('window').height * 0.8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {/* Check if it's an image */}
              {previewFile.uri && (
                previewFile.uri.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                  <Image
                    source={{ uri: previewFile.cloudinaryUrl || previewFile.uri }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                ) : (
                  // For documents and other files, show file info
                  <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 20,
                    alignItems: 'center',
                    maxWidth: '80%',
                  }}>
                    <Ionicons 
                      name={previewFile.uri.match(/\.pdf$/i) ? 'document-text' : 
                            previewFile.uri.match(/\.(doc|docx)$/i) ? 'document' :
                            previewFile.uri.match(/\.(xls|xlsx)$/i) ? 'grid' :
                            previewFile.uri.match(/\.(ppt|pptx)$/i) ? 'easel' :
                            'document'} 
                      size={64} 
                      color={theme.colors.primary} 
                    />
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: theme.colors.text,
                      marginTop: 16,
                      textAlign: 'center',
                    }}>
                      {previewFile.uri.split('/').pop() || 'Document'}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginTop: 8,
                      textAlign: 'center',
                    }}>
                      {previewFile.uploading ? 'Uploading...' : 'Uploaded successfully'}
                    </Text>
                    {previewFile.cloudinaryUrl && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: theme.colors.primary,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          marginTop: 16,
                        }}
                        onPress={() => {
                          // Open the file URL (this would work better in a real app with proper linking)
                          Alert.alert('File URL', previewFile.cloudinaryUrl);
                        }}
                      >
                        <Text style={{ color: 'white', fontWeight: '600' }}>
                          View Full File
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default UploadComponent;