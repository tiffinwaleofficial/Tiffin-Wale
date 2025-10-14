/**
 * Cloudinary Asset Deletion Service
 * Handles deletion of Cloudinary assets when reviews are deleted or edited
 */

import { Platform } from 'react-native';

interface CloudinaryDeleteConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

class CloudinaryDeleteService {
  private config: CloudinaryDeleteConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      this.config = {
        cloudName,
        apiKey,
        apiSecret,
      };
      console.log('✅ CloudinaryDeleteService: Configuration loaded');
    } else {
      console.warn('⚠️ CloudinaryDeleteService: Missing configuration');
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param cloudinaryUrl - Full Cloudinary URL
   * @returns Public ID or null if invalid URL
   */
  private extractPublicId(cloudinaryUrl: string): string | null {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
      const urlParts = cloudinaryUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex === -1) {
        console.warn('⚠️ CloudinaryDeleteService: Invalid Cloudinary URL format:', cloudinaryUrl);
        return null;
      }

      // Get the last part after upload (which includes transformations and public_id)
      const afterUpload = urlParts.slice(uploadIndex + 1).join('/');
      
      // Remove file extension
      const publicId = afterUpload.replace(/\.[^/.]+$/, '');
      
      console.log('🔍 CloudinaryDeleteService: Extracted public ID:', publicId, 'from URL:', cloudinaryUrl);
      return publicId;
    } catch (error) {
      console.error('❌ CloudinaryDeleteService: Error extracting public ID:', error);
      return null;
    }
  }

  /**
   * Generate authentication signature for Cloudinary API
   * @param publicId - Public ID of the asset
   * @param timestamp - Current timestamp
   * @returns Authentication signature
   */
  private generateSignature(publicId: string, timestamp: number): string {
    if (!this.config) {
      throw new Error('Cloudinary configuration not available');
    }

    const crypto = require('crypto');
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${this.config.apiSecret}`;
    return crypto.createHash('sha1').update(stringToSign).digest('hex');
  }

  /**
   * Delete a single Cloudinary asset
   * @param cloudinaryUrl - Full Cloudinary URL of the asset
   * @returns Promise<boolean> - Success status
   */
  async deleteAsset(cloudinaryUrl: string): Promise<boolean> {
    if (!this.config) {
      console.warn('⚠️ CloudinaryDeleteService: Cannot delete asset - configuration not available');
      return false;
    }

    const publicId = this.extractPublicId(cloudinaryUrl);
    if (!publicId) {
      console.warn('⚠️ CloudinaryDeleteService: Cannot delete asset - invalid public ID');
      return false;
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = this.generateSignature(publicId, timestamp);

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.config.apiKey);
      formData.append('signature', signature);

      console.log('🗑️ CloudinaryDeleteService: Deleting asset:', publicId);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      
      if (result.result === 'ok') {
        console.log('✅ CloudinaryDeleteService: Asset deleted successfully:', publicId);
        return true;
      } else {
        console.warn('⚠️ CloudinaryDeleteService: Asset deletion failed:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ CloudinaryDeleteService: Error deleting asset:', error);
      return false;
    }
  }

  /**
   * Delete multiple Cloudinary assets
   * @param cloudinaryUrls - Array of Cloudinary URLs
   * @returns Promise<{success: number, failed: number}> - Deletion results
   */
  async deleteMultipleAssets(cloudinaryUrls: string[]): Promise<{success: number, failed: number}> {
    if (!cloudinaryUrls || cloudinaryUrls.length === 0) {
      return { success: 0, failed: 0 };
    }

    console.log('🗑️ CloudinaryDeleteService: Deleting', cloudinaryUrls.length, 'assets');

    const results = await Promise.allSettled(
      cloudinaryUrls.map(url => this.deleteAsset(url))
    );

    const success = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    const failed = results.length - success;

    console.log(`📊 CloudinaryDeleteService: Deletion complete - ${success} successful, ${failed} failed`);

    return { success, failed };
  }

  /**
   * Check if service is properly configured
   * @returns boolean - Configuration status
   */
  isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Get configuration status for debugging
   * @returns object - Configuration details
   */
  getConfigStatus() {
    return {
      configured: this.isConfigured(),
      hasCloudName: !!process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET,
    };
  }
}

// Export singleton instance
export const cloudinaryDeleteService = new CloudinaryDeleteService();
export default cloudinaryDeleteService;





