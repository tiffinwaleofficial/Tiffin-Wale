/**
 * Comprehensive Cloudinary Upload Service
 * Handles all types of file uploads for the TiffinWale Partner app
 * Supports: Images, Videos, Documents (PDF, DOC, DOCX, TXT, etc.)
 */

import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { api } from '@/lib/api';

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
  BUSINESS_DOCUMENT = 'business-documents',
  LICENSE_DOCUMENT = 'license-documents',
  CERTIFICATE_DOCUMENT = 'certificate-documents',
  GENERAL = 'uploads'
}

export class CloudinaryUploadService {
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

    if (!this.config.cloudName) {
      console.warn('Cloudinary cloudName is not configured. Uploads will fail.');
    }
  }

  private async optimizeAsset(fileUri: string): Promise<string> {
    const fileExtension = fileUri.split('.').pop()?.toLowerCase() || '';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'webp'];
    const videoExtensions = ['mp4', 'mov'];

    try {
      if (imageExtensions.includes(fileExtension)) {
        console.log('🖼️  Optimizing image:', fileUri);
        const manipResult = await ImageManipulator.manipulateAsync(
          fileUri,
          [{ resize: { width: 2000 } }], // Resize longest edge to 2000px
          { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
        );
        console.log('✅ Image optimized:', manipResult.uri);
        return manipResult.uri;
      }
      
      console.log('🎥  Skipping video optimization for now:', fileUri);
      return fileUri;

    } catch (error) {
      console.error('Asset optimization failed:', error);
      // Return original URI if optimization fails
      return fileUri;
    }
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
   * Get MIME type from file extension
   */
  private getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'rtf': 'application/rtf',
      
      // Spreadsheets
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'csv': 'text/csv',
      
      // Presentations
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'ico': 'image/x-icon',
      
      // Videos
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska',
      'webm': 'video/webm',
      'flv': 'video/x-flv',
      'wmv': 'video/x-ms-wmv',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'flac': 'audio/flac',
      
      // Archives
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
    };
    
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  async uploadFile(
    fileUri: string,
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>,
    onProgress?: (progress: number) => void,
  ): Promise<UploadResult> {
    try {
      console.log(`🚀 Starting optimized ${uploadType} file upload...`);

      if (!this.config.cloudName) {
        throw new Error('Cloudinary configuration is incomplete.');
      }

      // 1. Optimize the asset
      const optimizedUri = await this.optimizeAsset(fileUri);

      // 2. Get signature from backend
      const folder = customOptions?.folder || 'uploads';
      console.log(`✍️  Requesting signature for folder: ${folder}`);
      const { signature, timestamp, api_key } = await api.upload.getUploadSignature({
        folder,
      });

      // 3. Prepare FormData for direct Cloudinary upload
      const formData = new FormData();
      const fileExtension = optimizedUri.split('.').pop()?.toLowerCase() || '';
      const mimeType = this.getMimeTypeFromExtension(fileExtension);
      const fileName = `${uploadType}_${Date.now()}.${fileExtension}`;

      const fileDetails = {
        uri: optimizedUri,
        type: mimeType,
        name: fileName,
      };

      formData.append('file', fileDetails as any);
      formData.append('folder', folder);
      formData.append('signature', signature);
      formData.append('timestamp', String(timestamp));
      formData.append('api_key', api_key);

      console.log(`📤 Uploading ${fileName} to Cloudinary...`);

      // 4. Perform the upload using XMLHttpRequest for progress tracking
      return new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/auto/upload`;

        xhr.open('POST', url);

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result = JSON.parse(xhr.responseText);
            console.log(`✅ ${uploadType} uploaded successfully:`, {
              url: result.secure_url,
              publicId: result.public_id,
            });
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              metadata: { ...result },
            });
          } else {
            const errorText = xhr.responseText || 'Unknown upload error';
            console.error(`❌ Cloudinary ${uploadType} upload failed:`, errorText);
            reject(new Error(`Upload failed: ${xhr.status} - ${errorText}`));
          }
        };

        xhr.onerror = () => {
          console.error(`❌ Network error during ${uploadType} upload`);
          reject(new Error('Network request failed'));
        };

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = event.loaded / event.total;
              onProgress(progress);
            }
          };
        }

        xhr.send(formData);
      });
    } catch (error: any) {
      console.error(`❌ ${uploadType} upload error:`, error.message);
      return {
        success: false,
        error: error.message || 'An unknown error occurred during upload',
      };
    }
  }

  /**
   * Upload image (backward compatibility method)
   */
  async uploadImage(
    imageUri: string, 
    uploadType: UploadType, 
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult> {
    return this.uploadFile(imageUri, uploadType, customOptions);
  }

  /**
   * Upload document
   */
  async uploadDocument(
    documentUri: string, 
    uploadType: UploadType, 
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult> {
    return this.uploadFile(documentUri, uploadType, customOptions);
  }

  /**
   * Upload video
   */
  async uploadVideo(
    videoUri: string, 
    uploadType: UploadType, 
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult> {
    return this.uploadFile(videoUri, uploadType, customOptions);
  }

  async uploadMultipleFiles(
    fileUris: string[],
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>,
    onFileProgress?: (index: number, progress: number) => void,
  ): Promise<UploadResult[]> {
    console.log(`📤 Starting batch upload of ${fileUris.length} ${uploadType} files...`);

    const uploadPromises = fileUris.map((uri, index) =>
      this.uploadFile(uri, uploadType, customOptions, (progress) => {
        if (onFileProgress) {
          onFileProgress(index, progress);
        }
      }),
    );

    const results = await Promise.all(uploadPromises);

    const successful = results.filter((r) => r.success).length;
    console.log(`✅ Batch upload completed: ${successful}/${fileUris.length} successful`);

    return results;
  }

  /**
   * Upload multiple images (backward compatibility method)
   */
  async uploadMultipleImages(
    imageUris: string[],
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult[]> {
    return this.uploadMultipleFiles(imageUris, uploadType, customOptions);
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<UploadResult> {
    try {
      console.log('🗑️  Deleting image via backend:', publicId);
      await api.upload.deleteImage(publicId);
      console.log('✅ Image deleted successfully via backend');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Image deletion error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred during deletion',
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
   * Pick documents (PDF, DOC, DOCX, TXT, etc.)
   */
  async pickDocuments(options?: {
    allowsMultipleSelection?: boolean;
    type?: string[];
  }): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: options?.type || [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ],
        multiple: options?.allowsMultipleSelection || false,
        copyToCacheDirectory: true,
      });

      return result;
    } catch (error) {
      console.error('Document picker error:', error);
      throw new Error('Failed to pick documents');
    }
  }

  /**
   * Pick videos
   */
  async pickVideos(options?: {
    allowsMultipleSelection?: boolean;
    quality?: number;
    allowsEditing?: boolean;
  }): Promise<ImagePicker.ImagePickerResult> {
    // Check permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera roll is required');
    }

    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: options?.allowsEditing ?? false,
      quality: options?.quality || 0.8,
      allowsMultipleSelection: options?.allowsMultipleSelection || false,
    });
  }

  /**
   * Pick any media (images, videos, documents)
   */
  async pickAnyMedia(options?: {
    allowsMultipleSelection?: boolean;
    mediaTypes?: ('image' | 'video' | 'document')[];
    aspect?: [number, number];
    quality?: number;
    allowsEditing?: boolean;
  }): Promise<{
    type: 'image' | 'video' | 'document';
    result: any;
  }> {
    const mediaTypes = options?.mediaTypes || ['image', 'video', 'document'];
    
    // This logic should be improved to allow user to choose
    if (mediaTypes.includes('image')) {
      const result = await this.pickImage({
        allowsMultipleSelection: options?.allowsMultipleSelection,
        aspect: options?.aspect,
        quality: options?.quality,
        allowsEditing: options?.allowsEditing,
      });
      return { type: 'image', result };
    } else if (mediaTypes.includes('video')) {
      const result = await this.pickVideos({
        allowsMultipleSelection: options?.allowsMultipleSelection,
        quality: options?.quality,
        allowsEditing: options?.allowsEditing,
      });
      return { type: 'video', result };
    } else if (mediaTypes.includes('document')) {
      const result = await this.pickDocuments({
        allowsMultipleSelection: options?.allowsMultipleSelection,
      });
      return { type: 'document', result };
    }
    
    throw new Error('No valid media types specified');
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
    return !!this.config.cloudName;
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = [];
    
    if (!this.config.cloudName) missing.push('cloudName');
    
    return {
      configured: missing.length === 0,
      missing,
    };
  }
}

// Export singleton instance
export const cloudinaryUploadService = new CloudinaryUploadService();
export default cloudinaryUploadService;
