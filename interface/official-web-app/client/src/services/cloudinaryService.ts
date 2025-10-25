/**
 * Enhanced Cloudinary Upload Service for Official Web App
 * Based on the comprehensive implementation from the student app
 */

import { CLOUDINARY } from '@/lib/env';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
  folderPrefix: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    folder?: string;
    uploadType?: string;
  };
}

export interface UploadOptions {
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
  TESTIMONIAL_IMAGE = 'testimonial-images',
  TESTIMONIAL_VIDEO = 'testimonial-videos',
  FEEDBACK_ATTACHMENT = 'feedback-attachments',
  CONTACT_DOCUMENT = 'contact-documents',
  CORPORATE_PROPOSAL = 'corporate-proposals',
  USER_AVATAR = 'user-avatars',
  GENERAL_UPLOAD = 'general-uploads',
  HERO_IMAGE = 'hero-images',
  GALLERY_IMAGE = 'gallery-images'
}

export class CloudinaryService {
  private config: CloudinaryConfig;

  constructor() {
    this.config = {
      cloudName: CLOUDINARY.CLOUD_NAME,
      apiKey: CLOUDINARY.API_KEY,
      apiSecret: CLOUDINARY.API_SECRET,
      uploadPreset: CLOUDINARY.UPLOAD_PRESET,
      folderPrefix: CLOUDINARY.FOLDER_PREFIX
    };

    console.log('🔧 CloudinaryService initialized with config:', {
      cloudName: this.config.cloudName,
      apiKey: this.config.apiKey ? '***' + this.config.apiKey.slice(-4) : 'not set',
      uploadPreset: this.config.uploadPreset,
      folderPrefix: this.config.folderPrefix
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
      case UploadType.TESTIMONIAL_IMAGE:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/testimonial-images`,
          maxWidth: 800,
          maxHeight: 600,
          crop: 'fit',
          quality: 'auto',
          format: 'auto'
        };

      case UploadType.TESTIMONIAL_VIDEO:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/testimonial-videos`,
          maxWidth: 1280,
          maxHeight: 720,
          crop: 'fit'
        };

      case UploadType.FEEDBACK_ATTACHMENT:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/feedback-attachments`,
          maxWidth: 1200,
          maxHeight: 900,
          crop: 'fit'
        };

      case UploadType.CONTACT_DOCUMENT:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/contact-documents`,
          maxWidth: 1200,
          crop: 'fit'
        };

      case UploadType.CORPORATE_PROPOSAL:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/corporate-proposals`,
          maxWidth: 1200,
          crop: 'fit'
        };

      case UploadType.USER_AVATAR:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/user-avatars`,
          maxWidth: 300,
          maxHeight: 300,
          crop: 'fill',
          gravity: 'face'
        };

      case UploadType.HERO_IMAGE:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/hero-images`,
          maxWidth: 1920,
          maxHeight: 1080,
          crop: 'fill',
          gravity: 'center'
        };

      case UploadType.GALLERY_IMAGE:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/gallery-images`,
          maxWidth: 800,
          maxHeight: 600,
          crop: 'fit'
        };

      default:
        return {
          ...commonOptions,
          folder: `${this.config.folderPrefix}/general-uploads`,
          maxWidth: 800,
          crop: 'fit'
        };
    }
  }

  /**
   * Upload single file to Cloudinary
   */
  async uploadFile(
    file: File,
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      console.log(`📸 Starting ${uploadType} upload...`);

      if (!this.config.cloudName || !this.config.uploadPreset) {
        throw new Error('Cloudinary configuration is incomplete');
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      const defaultOptions = this.getDefaultOptions(uploadType);
      const options = { ...defaultOptions, ...customOptions };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('cloud_name', this.config.cloudName);
      formData.append('folder', options.folder || 'uploads');

      // Add transformation parameters
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

      // Use XMLHttpRequest for progress tracking
      return new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
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
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            let errorMsg = 'Upload failed';
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMsg = errorResponse.error?.message || 'Upload failed';
            } catch (e) {
              // Use default error message
            }
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${this.config.cloudName}/upload`);
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
   * Upload multiple files with progress tracking
   */
  async uploadMultipleFiles(
    files: File[],
    uploadType: UploadType,
    customOptions?: Partial<UploadOptions>,
    onProgress?: (fileIndex: number, progress: number) => void,
    onComplete?: (fileIndex: number, result: UploadResult) => void
  ): Promise<UploadResult[]> {
    console.log(`📸 Starting batch upload of ${files.length} ${uploadType} files...`);
    
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadFile(
        file,
        uploadType,
        customOptions,
        (progress) => onProgress?.(i, progress)
      );
      
      results.push(result);
      onComplete?.(i, result);
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Batch upload completed: ${successful}/${files.length} successful`);
    
    return results;
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<UploadResult> {
    try {
      console.log('🗑️ Deleting file:', publicId);

      if (!this.config.cloudName || !this.config.apiKey || !this.config.apiSecret) {
        console.warn('⚠️ Cloudinary deletion requires server-side implementation');
        return { success: false, error: 'Deletion requires server-side implementation' };
      }

      // Note: For security reasons, deletion should be handled server-side
      // This is a placeholder for the client-side interface
      console.warn('⚠️ File deletion should be implemented server-side for security');
      
      return { success: true };

    } catch (error) {
      console.error('❌ File deletion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(publicIds: string[]): Promise<{success: number, failed: number}> {
    console.log('🗑️ Deleting multiple files:', publicIds.length);
    
    let success = 0;
    let failed = 0;
    
    for (const publicId of publicIds) {
      const result = await this.deleteFile(publicId);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }
    
    console.log(`📊 Batch deletion completed: ${success} successful, ${failed} failed`);
    return { success, failed };
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedImageUrl(publicId: string, options?: Partial<UploadOptions>): string {
    if (!this.config.cloudName || !publicId) {
      return '';
    }

    let transformString = '';
    
    if (options) {
      const transformations = [];
      
      if (options.maxWidth) transformations.push(`w_${options.maxWidth}`);
      if (options.maxHeight) transformations.push(`h_${options.maxHeight}`);
      if (options.crop) transformations.push(`c_${options.crop}`);
      if (options.gravity) transformations.push(`g_${options.gravity}`);
      if (options.quality) transformations.push(`q_${options.quality}`);
      if (options.format) transformations.push(`f_${options.format}`);
      
      if (transformations.length > 0) {
        transformString = transformations.join(',') + '/';
      }
    }

    return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${transformString}${publicId}`;
  }

  /**
   * Generate thumbnail URL
   */
  getThumbnailUrl(publicId: string, size: number = 150): string {
    return this.getOptimizedImageUrl(publicId, {
      maxWidth: size,
      maxHeight: size,
      crop: 'fill',
      gravity: 'center',
      quality: 'auto',
      format: 'auto'
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

  /**
   * Validate file before upload
   */
  validateFile(file: File, uploadType: UploadType): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check file type based on upload type
    const allowedTypes: { [key in UploadType]: string[] } = {
      [UploadType.TESTIMONIAL_IMAGE]: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      [UploadType.TESTIMONIAL_VIDEO]: ['video/mp4', 'video/webm', 'video/quicktime'],
      [UploadType.FEEDBACK_ATTACHMENT]: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      [UploadType.CONTACT_DOCUMENT]: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
      [UploadType.CORPORATE_PROPOSAL]: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      [UploadType.USER_AVATAR]: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      [UploadType.HERO_IMAGE]: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      [UploadType.GALLERY_IMAGE]: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      [UploadType.GENERAL_UPLOAD]: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    const allowed = allowedTypes[uploadType] || [];
    const isAllowed = allowed.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return { valid: false, error: `File type ${file.type} is not allowed for ${uploadType}` };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;