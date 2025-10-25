/**
 * Comprehensive Cloudinary Upload Service
 * Handles all types of file uploads for the TiffinWale Partner app
 * Supports: Images, Videos, Documents (PDF, DOC, DOCX, TXT, etc.)
 */

import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

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

  /**
   * Upload file to Cloudinary (supports images, videos, documents)
   */
  async uploadFile(
    fileUri: string, 
    uploadType: UploadType, 
    customOptions?: Partial<UploadOptions>,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      console.log(`📤 Starting ${uploadType} file upload...`);

      if (!this.config.cloudName || !this.config.uploadPreset) {
        throw new Error('Cloudinary configuration is incomplete');
      }

      const defaultOptions = this.getDefaultOptions(uploadType);
      const options = { ...defaultOptions, ...customOptions };

      const formData = new FormData();
      
      // Detect file type from URI
      const fileExtension = fileUri.split('.').pop()?.toLowerCase() || '';
      const isVideo = uploadType === UploadType.REVIEW_VIDEO || 
                     ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExtension);
      const isDocument = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension);
      
      console.log('🔍 File type detection:', { fileExtension, isVideo, isDocument });
      
      // Create file object for upload - use exact same approach as student app
      const isWeb = typeof window !== 'undefined';
      
      console.log('🔍 Platform detection:', { isWeb, fileUri: fileUri.substring(0, 50) + '...' });
      
      if (isWeb) {
        // For web, convert URI to Blob and create File
        const response = await fetch(fileUri);
        const blob = await response.blob();
        
        // Determine MIME type based on file extension
        let mimeType = 'application/octet-stream';
        if (isVideo) {
          mimeType = 'video/mp4';
        } else if (isDocument) {
          mimeType = this.getMimeTypeFromExtension(fileExtension);
        } else {
          mimeType = 'image/jpeg';
        }
        
        const file = new File([blob], `${uploadType}_${Date.now()}.${fileExtension}`, {
          type: mimeType
        });
        formData.append('file', file);
        console.log('📤 Web file created:', { name: file.name, type: file.type, size: file.size });
      } else {
        // For mobile platforms - create proper file object
        const mimeType = isVideo ? 'video/mp4' : (isDocument ? this.getMimeTypeFromExtension(fileExtension) : 'image/jpeg');
        const fileName = `${uploadType}_${Date.now()}.${fileExtension}`;
        
        // Create file object that works with React Native FormData
        // This is the exact structure that React Native expects
        const fileObject = {
          uri: fileUri,
          type: mimeType,
          name: fileName,
        };
        
        // For React Native, create the file object in the exact format expected
        // This avoids the blob.name error in Expo's FormData implementation
        const reactNativeFile = {
          uri: fileUri,
          type: mimeType,
          name: fileName,
        };
        
        // Special handling for Android to avoid FormData blob issues
        if (Platform.OS === 'android') {
          // Use a more direct approach for Android
          const androidFile = {
            uri: fileUri,
            type: mimeType,
            name: fileName,
          };
          
          // Append using the native FormData append method
          try {
            formData.append('file', androidFile as any);
            console.log('📤 Android file created:', { uri: androidFile.uri, type: androidFile.type, name: androidFile.name });
          } catch (androidError) {
            console.error('❌ Android FormData error:', androidError);
            // Last resort: try with minimal structure
            formData.append('file', {
              uri: fileUri,
              type: mimeType,
              name: fileName,
            } as any);
            console.log('📤 Android file created (minimal)');
          }
        } else {
          // For iOS and other platforms
          formData.append('file', reactNativeFile as any);
          console.log('📤 Mobile file created:', { uri: reactNativeFile.uri, type: reactNativeFile.type, name: reactNativeFile.name });
        }
      }
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('cloud_name', this.config.cloudName);
      formData.append('folder', options.folder || 'uploads');
      
      console.log('📤 FormData details:', {
        uploadPreset: this.config.uploadPreset,
        cloudName: this.config.cloudName,
        folder: options.folder || 'uploads',
        platform: isWeb ? 'web' : 'mobile',
        fileUri: fileUri,
        isVideo
      });
      
      // Debug: Log FormData contents
      console.log('📤 FormData entries:');

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
      
      return new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/upload`;

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
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          folder: options.folder,
          uploadType,
        }
            });
          } else {
            console.error(`❌ Cloudinary ${uploadType} upload failed:`, xhr.responseText);
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
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

    } catch (error) {
      console.error(`❌ ${uploadType} upload error:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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

  /**
   * Upload multiple files (supports images, videos, documents)
   */
  async uploadMultipleFiles(
    fileUris: string[],
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>
  ): Promise<UploadResult[]> {
    console.log(`📤 Starting batch upload of ${fileUris.length} ${uploadType} files...`);
    
    const uploadPromises = fileUris.map(uri => 
      this.uploadFile(uri, uploadType, customOptions)
    );

    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success).length;
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
    
    // For now, we'll use a simple approach - pick images by default
    // In a real app, you might want to show a picker to choose media type
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
export const cloudinaryUploadService = new CloudinaryUploadService();
export default cloudinaryUploadService;
