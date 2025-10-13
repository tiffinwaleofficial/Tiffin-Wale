import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { Star, X, Camera, Image as ImageIcon, Trash2, Video, Play } from 'lucide-react-native';
import { useReviewStore } from '@/store/reviewStore';
import { imageUploadService, UploadType } from '@/services/imageUploadService';
import * as ImagePicker from 'expo-image-picker';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  restaurantId?: string;
  menuItemId?: string;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  restaurantId,
  menuItemId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState<Array<{uri: string, type: 'image' | 'video', duration?: number, cloudinaryUrl?: string, uploading?: boolean}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{uri: string, type: 'image' | 'video'} | null>(null);
  
  const { createReview } = useReviewStore();

  // Upload to Cloudinary immediately when file is selected
  const uploadToCloudinary = async (fileUri: string, mediaType: 'image' | 'video') => {
    try {
      console.log('☁️ Starting Cloudinary upload for:', mediaType);
      console.log('☁️ File URI:', fileUri);
      
      // Check if imageUploadService is configured
      const configStatus = imageUploadService.getConfigStatus();
      console.log('☁️ Cloudinary config status:', configStatus);
      
      if (!configStatus.configured) {
        console.error('❌ Cloudinary not configured:', configStatus.missing);
        Alert.alert('Configuration Error', `Cloudinary not configured. Missing: ${configStatus.missing.join(', ')}`);
        return;
      }
      
      const uploadType = mediaType === 'video' ? UploadType.REVIEW_VIDEO : UploadType.REVIEW_IMAGE;
      console.log('☁️ Upload type:', uploadType);
      
      const result = await imageUploadService.uploadImage(fileUri, uploadType);
      
      if (result.success && result.url) {
        console.log('✅ Cloudinary upload successful:', result.url);
        
        // Update the media file with Cloudinary URL
        setMediaFiles(prev => prev.map(file => 
          file.uri === fileUri 
            ? { ...file, cloudinaryUrl: result.url, uploading: false }
            : file
        ));
      } else {
        console.error('❌ Cloudinary upload failed:', result.error);
        
        // Mark upload as failed
        setMediaFiles(prev => prev.map(file => 
          file.uri === fileUri 
            ? { ...file, uploading: false }
            : file
        ));
        
        Alert.alert('Upload Failed', result.error || 'Failed to upload media');
      }
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      
      // Mark upload as failed
      setMediaFiles(prev => prev.map(file => 
        file.uri === fileUri 
          ? { ...file, uploading: false }
          : file
      ));
      
      Alert.alert('Upload Error', 'Failed to upload media to Cloudinary');
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if all media files are uploaded
      const uploadingFiles = mediaFiles.filter(file => file.uploading);
      if (uploadingFiles.length > 0) {
        Alert.alert('Uploading', 'Please wait for all media files to finish uploading.');
        setIsSubmitting(false);
        return;
      }
      
      // Use already uploaded Cloudinary URLs
      let uploadedMediaUrls: string[] = [];
      
      if (mediaFiles.length > 0) {
        uploadedMediaUrls = mediaFiles
          .filter(file => file.cloudinaryUrl)
          .map(file => file.cloudinaryUrl!);
        
        console.log('✅ Using uploaded media URLs:', uploadedMediaUrls);
      }
      
      // Create review with uploaded media URLs
      await createReview({
        rating,
        comment: comment.trim() || undefined,
        images: uploadedMediaUrls, // Backend expects 'images' field for all media
        restaurantId,
        menuItemId,
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setMediaFiles([]);
      
      onReviewSubmitted?.();
      onClose();
      
      Alert.alert('Success', 'Your review has been submitted successfully!');
    } catch (error) {
      console.error('❌ Review submission error:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploadingMedia(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={styles.starButton}
      >
        <Star
          size={32}
          color={index < rating ? "#FFD700" : "#E0E0E0"}
          fill={index < rating ? "#FFD700" : "transparent"}
        />
      </TouchableOpacity>
    ));
  };

  const handleAddMedia = async () => {
    try {
      console.log('🔍 ReviewModal: Add media button clicked');
      console.log('🔍 Platform.OS:', Platform.OS);
      console.log('🔍 imageUploadService configured:', imageUploadService.isConfigured());
      console.log('🔍 imageUploadService config:', imageUploadService.getConfigStatus());
      
      // For web, we'll use a simple file input approach
      if (Platform.OS === 'web') {
        console.log('🌐 Web platform detected, using file input');
        
        // Check if we're in a browser environment
        if (typeof document === 'undefined') {
          console.error('❌ Document not available - not in browser environment');
          Alert.alert('Error', 'File upload not available in this environment');
          return;
        }
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.multiple = true;
        input.style.display = 'none';
        
        input.onchange = (event: any) => {
          const files = Array.from(event.target.files) as File[];
          console.log('📁 Files selected:', files.length);
          
          if (files.length === 0) {
            console.log('📁 No files selected');
            return;
          }
          
          files.forEach(file => {
            console.log('📸 Processing file:', file.name, file.type, file.size);
            
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              console.log('📸 File loaded successfully:', file.name);
              
              const mediaType = file.type.startsWith('video/') ? 'video' as const : 'image' as const;
              
              // Add to media files with uploading state
              setMediaFiles(prev => {
                const newFiles = [...prev, {
                  uri: result,
                  type: mediaType,
                  duration: undefined,
                  uploading: true,
                }];
                console.log('📸 Updated mediaFiles:', newFiles.length);
                return newFiles;
              });
              
              // Start immediate Cloudinary upload
              uploadToCloudinary(result, mediaType);
            };
            
            reader.onerror = (error) => {
              console.error('❌ FileReader error:', error);
            };
            
            reader.readAsDataURL(file);
          });
        };
        
        // Add to DOM temporarily and trigger click
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
        
        console.log('📁 File input triggered');
        return;
      }
      
      // For mobile platforms, use Alert
      console.log('📱 Mobile platform detected, using Alert');
      Alert.alert(
        'Add Media',
        'Choose how you want to add photos or videos',
        [
          { text: 'Take Photo', onPress: () => takePicture() },
          { text: 'Record Video', onPress: () => takeVideo() },
          { text: 'Choose from Gallery', onPress: () => pickMedia() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('❌ Media picker error:', error);
      Alert.alert('Error', `Failed to open media picker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const takePicture = async () => {
    try {
      const result = await imageUploadService.takePicture({
        aspect: [4, 3],
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setMediaFiles(prev => [...prev, {
          uri: asset.uri,
          type: 'image' as const,
          uploading: true,
        }]);
        
        // Start immediate Cloudinary upload
        uploadToCloudinary(asset.uri, 'image');
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const takeVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setMediaFiles(prev => [...prev, {
          uri: asset.uri,
          type: 'video' as const,
          duration: asset.duration || undefined,
          uploading: true,
        }]);
        
        // Start immediate Cloudinary upload
        uploadToCloudinary(asset.uri, 'video');
      }
    } catch (error) {
      console.error('❌ Video recording error:', error);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsEditing: true,
        videoMaxDuration: 30,
      });

      if (!result.canceled && result.assets) {
        const newMediaFiles = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' as const : 'image' as const,
          duration: asset.duration || undefined,
          uploading: true,
        }));
        setMediaFiles(prev => [...prev, ...newMediaFiles]);
        
        // Start immediate Cloudinary uploads for all selected files
        result.assets.forEach(asset => {
          const mediaType = asset.type === 'video' ? 'video' as const : 'image' as const;
          uploadToCloudinary(asset.uri, mediaType);
        });
      }
    } catch (error) {
      console.error('❌ Media picker error:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Write a Review</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate your experience</Text>
            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
            </Text>
          </View>

          {/* Comment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Share your thoughts</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell others about your experience..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Media Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add photos & videos (optional)</Text>
            
            {/* Selected Media */}
            {mediaFiles.length > 0 && (
              <View style={styles.selectedMediaContainer}>
                <FlatList
                  data={mediaFiles}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.mediaPreviewContainer}>
                      <TouchableOpacity
                        onPress={() => setPreviewMedia({ uri: item.uri, type: item.type })}
                        style={styles.mediaPreviewTouchable}
                      >
                        {item.type === 'image' ? (
                          <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                        ) : (
                          <View style={styles.videoPreview}>
                            <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                            <View style={styles.videoOverlay}>
                              <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                            </View>
                            {item.duration && (
                              <Text style={styles.videoDuration}>
                                {Math.round(item.duration)}s
                              </Text>
                            )}
                          </View>
                        )}
                        
                        {/* Upload Progress Indicator */}
                        {item.uploading && (
                          <View style={styles.uploadingOverlay}>
                            <Text style={styles.uploadingText}>Uploading...</Text>
                          </View>
                        )}
                        
                        {/* Upload Success Indicator */}
                        {item.cloudinaryUrl && !item.uploading && (
                          <View style={styles.uploadSuccessOverlay}>
                            <Text style={styles.uploadSuccessText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.removeMediaButton}
                        onPress={() => removeMedia(index)}
                      >
                        <Trash2 size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
            
            {/* Add Media Button */}
            <TouchableOpacity 
              style={styles.addMediaButton} 
              onPress={() => {
                console.log('🔍 ReviewModal: TouchableOpacity pressed');
                handleAddMedia();
              }}
              disabled={isUploadingMedia}
            >
              <Camera size={24} color="#FF9B42" />
              <Text style={styles.addMediaText}>
                {isUploadingMedia ? 'Uploading...' : 'Add Photos & Videos'}
              </Text>
            </TouchableOpacity>
            
            
            {/* Media Count */}
            {mediaFiles.length > 0 && (
              <Text style={styles.mediaCountText}>
                {mediaFiles.length} file{mediaFiles.length > 1 ? 's' : ''} selected
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              rating === 0 && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            <Text style={[
              styles.submitButtonText,
              rating === 0 && styles.submitButtonTextDisabled,
            ]}>
              {isSubmitting ? (isUploadingMedia ? 'Uploading Media...' : 'Submitting...') : 'Submit Review'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Media Preview Modal */}
      {previewMedia && (
        <Modal
          visible={!!previewMedia}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setPreviewMedia(null)}
        >
          <View style={styles.previewModalContainer}>
            <TouchableOpacity 
              style={styles.previewModalBackground}
              onPress={() => setPreviewMedia(null)}
            >
              <View style={styles.previewModalContent}>
                <TouchableOpacity 
                  style={styles.previewCloseButton}
                  onPress={() => setPreviewMedia(null)}
                >
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                {previewMedia.type === 'image' ? (
                  <Image source={{ uri: previewMedia.uri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.previewVideoContainer}>
                    <Image source={{ uri: previewMedia.uri }} style={styles.previewImage} />
                    <View style={styles.previewVideoOverlay}>
                      <Play size={40} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins-Regular',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Poppins-Regular',
    minHeight: 100,
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF9B42',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  addMediaText: {
    fontSize: 14,
    color: '#FF9B42',
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
  mediaCountText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#FF9B42',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  submitButtonTextDisabled: {
    color: '#999999',
  },
  
  // Media Preview Styles
  selectedMediaContainer: {
    marginBottom: 16,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: 12,
  },
  mediaPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  videoPreview: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Poppins-Medium',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  // Media Preview Touchable
  mediaPreviewTouchable: {
    flex: 1,
  },
  
  // Upload Progress Overlay
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Upload Success Overlay
  uploadSuccessOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSuccessText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  
  // Preview Modal Styles
  previewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalContent: {
    width: '90%',
    height: '80%',
    position: 'relative',
  },
  previewCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'contain',
  },
  previewVideoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  previewVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
