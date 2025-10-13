/**
 * Comprehensive Image Upload Service
 * Handles all types of image uploads for the TiffinWale app
 */

import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  metadata?: any;
}

interface UploadOptions {
  folder?: string;
  transformation?: any[];
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  maxWidth?: number;
  maxHeight?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  gravity?: 'face' | 'center' | 'auto';
}

export enum UploadType {
  PROFILE_IMAGE = 'profile-images',
  REVIEW_IMAGE = 'review-images', 
  REVIEW_VIDEO = 'review-videos',
  REPORT_IMAGE = 'report-images',
  MEAL_IMAGE = 'meal-images',
  DOCUMENT = 'documents',
  GENERAL = 'uploads'
}

export class ImageUploadService {
  private config: CloudinaryConfig;

  constructor() {
    const extra = Constants.expoConfig?.extra;
    
    // For web, we need to use EXPO_PUBLIC_ prefixed variables
    const isWeb = typeof window !== 'undefined';
    
    this.config = {
      cloudName: extra?.cloudinary?.cloudName || 
                 (isWeb ? process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME) || '',
      apiKey: extra?.cloudinary?.apiKey || 
              (isWeb ? process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY) || '',
      apiSecret: extra?.cloudinary?.apiSecret || 
                 (isWeb ? process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET) || '',
      uploadPreset: extra?.cloudinary?.uploadPreset || 
                    (isWeb ? process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET : process.env.CLOUDINARY_UPLOAD_PRESET) || '',
    };

    console.log('🔧 ImageUploadService initialized with config:', {
      platform: isWeb ? 'web' : 'mobile',
      cloudName: this.config.cloudName,
      apiKey: this.config.apiKey ? '***' + this.config.apiKey.slice(-4) : 'not set',
      uploadPreset: this.config.uploadPreset,
      extraConfig: extra?.cloudinary,
      envVars: {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      }
    });
  }

  /**
   * Get default upload options for different upload types
   */
  private getDefaultOptions(uploadType: UploadType): UploadOptions {
    const commonOptions = {
      quality: 'auto' as const,
      format: 'auto' as const,
    };

    switch (uploadType) {
      case UploadType.PROFILE_IMAGE:
        return {
          ...commonOptions,
          folder: 'profile-images',
          maxWidth: 300,
          maxHeight: 300,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          format: 'auto'
        };

      case UploadType.REVIEW_IMAGE:
        return {
          ...commonOptions,
          folder: 'review-images',
          maxWidth: 800,
          maxHeight: 600,
          crop: 'fit',
          quality: 'auto',
          format: 'auto'
        };

      case UploadType.REVIEW_VIDEO:
        return {
          ...commonOptions,
          folder: 'review-videos',
          maxWidth: 800,
          maxHeight: 600,
          crop: 'fit',
          quality: 'auto',
          format: 'auto'
        };

      case UploadType.REPORT_IMAGE:
        return {
          ...commonOptions,
          folder: 'report-images',
          maxWidth: 1200,
          maxHeight: 900,
          crop: 'fit',
          transformation: [
            { width: 1200, height: 900, crop: 'fit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        };

      case UploadType.MEAL_IMAGE:
        return {
          ...commonOptions,
          folder: 'meal-images',
          maxWidth: 600,
          maxHeight: 400,
          crop: 'fill',
          gravity: 'center',
          transformation: [
            { width: 600, height: 400, crop: 'fill', gravity: 'center' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        };

      case UploadType.DOCUMENT:
        return {
          ...commonOptions,
          folder: 'documents',
          maxWidth: 1200,
          crop: 'fit',
          transformation: [
            { width: 1200, crop: 'fit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        };

      default:
        return {
          ...commonOptions,
          folder: 'uploads',
          maxWidth: 800,
          crop: 'fit',
        };
    }
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    imageUri: string, 
    uploadType: UploadType, 
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult> {
    try {
      console.log(`📸 Starting ${uploadType} image upload...`);

      if (!this.config.cloudName || !this.config.uploadPreset) {
        throw new Error('Cloudinary configuration is incomplete');
      }

      const defaultOptions = this.getDefaultOptions(uploadType);
      const options = { ...defaultOptions, ...customOptions };

      const formData = new FormData();
      
      // Create file object for upload
      const isVideo = uploadType === UploadType.REVIEW_VIDEO;
      const isWeb = typeof window !== 'undefined';
      
      let file;
      if (isWeb && imageUri.startsWith('data:')) {
        // For web, convert data URL to Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        file = new File([blob], `${uploadType}_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`, {
          type: isVideo ? 'video/mp4' : 'image/jpeg'
        });
      } else {
        // For mobile, use the original format
        file = {
          uri: imageUri,
          type: isVideo ? 'video/mp4' : 'image/jpeg',
          name: `${uploadType}_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`,
        } as any;
      }

      formData.append('file', file);
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('cloud_name', this.config.cloudName);
      formData.append('folder', options.folder || 'uploads');
      
      console.log('📤 FormData details:', {
        uploadPreset: this.config.uploadPreset,
        cloudName: this.config.cloudName,
        folder: options.folder || 'uploads',
        fileType: file.type,
        fileName: file.name
      });
      
      // Add individual transformation parameters instead of complex transformation array
      if (options.maxWidth) {
        formData.append('width', options.maxWidth.toString());
      }
      if (options.maxHeight) {
        formData.append('height', options.maxHeight.toString());
      }
      if (options.crop) {
        formData.append('crop', options.crop);
      }
      if (options.gravity) {
        formData.append('gravity', options.gravity);
      }
      if (options.quality) {
        formData.append('quality', options.quality.toString());
      }
      if (options.format) {
        formData.append('fetch_format', options.format);
      }

      console.log(`📤 Uploading ${uploadType} to Cloudinary...`);
      
      // For web, we need to handle FormData differently
      console.log('📤 Platform:', isWeb ? 'web' : 'mobile');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header for FormData - let browser set it with boundary
          ...(isWeb ? {} : { headers: { 'Content-Type': 'multipart/form-data' } }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Cloudinary ${uploadType} upload failed:`, errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log(`✅ ${uploadType} uploaded successfully:`, {
        url: result.secure_url,
        publicId: result.public_id,
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          folder: options.folder,
          uploadType,
        }
      };

    } catch (error) {
      console.error(`❌ ${uploadType} upload error:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    imageUris: string[],
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult[]> {
    console.log(`📸 Starting batch upload of ${imageUris.length} ${uploadType} images...`);
    
    const uploadPromises = imageUris.map(uri => 
      this.uploadImage(uri, uploadType, customOptions)
    );

    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Batch upload completed: ${successful}/${imageUris.length} successful`);
    
    return results;
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<UploadResult> {
    try {
      console.log('🗑️ Deleting image:', publicId);

      if (!this.config.cloudName || !this.config.apiKey || !this.config.apiSecret) {
        throw new Error('Cloudinary configuration is incomplete for deletion');
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            timestamp: timestamp,
            api_key: this.config.apiKey,
            // Note: For client-side deletion, you might need to implement server-side endpoint
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cloudinary deletion failed:', errorText);
        throw new Error(`Deletion failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Image deleted successfully:', result);

      return { success: true };

    } catch (error) {
      console.error('❌ Image deletion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedImageUrl(publicId: string, options?: Partial<UploadOptions>): string {
    if (!this.config.cloudName) {
      return '';
    }

    const transformations = options?.transformation || [
      { quality: 'auto', fetch_format: 'auto' }
    ];

    const transformString = transformations
      .map(t => Object.entries(t).map(([key, value]) => `${key}_${value}`).join(','))
      .join('/');

    return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${transformString}/${publicId}`;
  }

  /**
   * Launch image picker with options
   */
  async pickImage(options?: {
    allowsMultipleSelection?: boolean;
    aspect?: [number, number];
    quality?: number;
    allowsEditing?: boolean;
  }): Promise<ImagePicker.ImagePickerResult> {
    // Check permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera roll is required');
    }

    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options?.allowsEditing ?? true,
      aspect: options?.aspect || [1, 1],
      quality: options?.quality || 0.8,
      allowsMultipleSelection: options?.allowsMultipleSelection || false,
    });
  }

  /**
   * Launch camera with options
   */
  async takePicture(options?: {
    aspect?: [number, number];
    quality?: number;
    allowsEditing?: boolean;
  }): Promise<ImagePicker.ImagePickerResult> {
    // Check permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera is required');
    }

    return await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options?.allowsEditing ?? true,
      aspect: options?.aspect || [1, 1],
      quality: options?.quality || 0.8,
    });
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.cloudName && this.config.uploadPreset);
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = [];
    
    if (!this.config.cloudName) missing.push('cloudName');
    if (!this.config.uploadPreset) missing.push('uploadPreset');
    
    return {
      configured: missing.length === 0,
      missing,
    };
  }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();
export default imageUploadService;
