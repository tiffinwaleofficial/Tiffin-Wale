// Note: Image picker functionality will be added when expo-image-picker is installed
import { Alert } from 'react-native';
import api from './apiClient';

interface CloudinaryResponse {
  url: string;
  public_id: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  bytes?: number;
}

interface UploadOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  folder?: string;
  transformation?: string;
}

export class CloudinaryService {

  // Upload image to Cloudinary via backend
  static async uploadImage(
    imageUri: string, 
    type: 'profile' | 'menu' | 'banner',
    options: UploadOptions = {}
  ): Promise<CloudinaryResponse> {
    try {
      // Create form data
      const formData = new FormData();
      
      // Add the image file
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const fileType = filename.split('.').pop() || 'jpg';
      
      formData.append('file', {
        uri: imageUri,
        type: `image/${fileType}`,
        name: filename,
      } as any);
      
      // Add upload type
      formData.append('type', type);
      
      // Add folder if specified
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      // Add transformation if specified
      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }
      
      // Upload via backend API
      const response = await api.upload.uploadImage(formData, type);
      
      // Transform response to match CloudinaryResponse interface
      return {
        url: response.url,
        public_id: response.public_id,
        secure_url: response.url, // Use url as secure_url if not provided
        width: 800, // Default values - will be actual values from backend
        height: 600,
        format: 'jpg',
        resource_type: 'image',
        bytes: 0,
      };
    } catch (error: any) {
      console.error('Upload image error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to upload image. Please try again.'
      );
    }
  }

  // Delete image from Cloudinary via backend
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await api.upload.deleteImage(publicId);
    } catch (error: any) {
      console.error('Delete image error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to delete image. Please try again.'
      );
    }
  }

  // Get optimized image URL with transformations
  static getOptimizedImageUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
      quality?: 'auto' | number;
      format?: 'auto' | 'jpg' | 'png' | 'webp';
      gravity?: 'auto' | 'face' | 'center';
    } = {}
  ): string {
    // Base Cloudinary URL - this would come from environment
    const cloudName = 'your-cloud-name'; // This will be replaced with actual cloud name from env
    
    // Build transformation string
    const transforms = [];
    
    if (transformations.width) transforms.push(`w_${transformations.width}`);
    if (transformations.height) transforms.push(`h_${transformations.height}`);
    if (transformations.crop) transforms.push(`c_${transformations.crop}`);
    if (transformations.quality) transforms.push(`q_${transformations.quality}`);
    if (transformations.format) transforms.push(`f_${transformations.format}`);
    if (transformations.gravity) transforms.push(`g_${transformations.gravity}`);
    
    const transformString = transforms.length > 0 ? `${transforms.join(',')}/` : '';
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
  }

  // Upload profile image with specific settings
  static async uploadProfileImage(imageUri: string): Promise<CloudinaryResponse> {
    return this.uploadImage(imageUri, 'profile', {
      folder: 'partner_profiles',
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.9,
    });
  }

  // Upload menu item image with specific settings
  static async uploadMenuImage(imageUri: string): Promise<CloudinaryResponse> {
    return this.uploadImage(imageUri, 'menu', {
      folder: 'menu_items',
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8,
    });
  }

  // Upload banner image with specific settings
  static async uploadBannerImage(imageUri: string): Promise<CloudinaryResponse> {
    return this.uploadImage(imageUri, 'banner', {
      folder: 'partner_banners',
      maxWidth: 1200,
      maxHeight: 400,
      quality: 0.8,
    });
  }

  // Utility function to get thumbnail URL
  static getThumbnailUrl(publicId: string, size: number = 150): string {
    return this.getOptimizedImageUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }

  // Utility function to get responsive image URLs
  static getResponsiveImageUrls(publicId: string): {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
  } {
    return {
      thumbnail: this.getOptimizedImageUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
      small: this.getOptimizedImageUrl(publicId, { width: 300, height: 200, crop: 'fill' }),
      medium: this.getOptimizedImageUrl(publicId, { width: 600, height: 400, crop: 'fill' }),
      large: this.getOptimizedImageUrl(publicId, { width: 1200, height: 800, crop: 'fill' }),
    };
  }
}

export default CloudinaryService; 