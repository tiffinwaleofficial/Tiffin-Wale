/**
 * Upload API Service
 * File upload endpoints (images, documents, etc.)
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  secure_url?: string;
}

export type UploadType = 'profile' | 'menu' | 'banner' | 'general';

/**
 * Upload API Methods
 */
export const uploadApi = {
  /**
   * Upload image to Cloudinary
   */
  uploadImage: async (file: File | Blob, type: UploadType = 'general'): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await retryRequest(() =>
        apiClient.post<UploadResponse>('/upload/image', formData, {
          params: { type },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'uploadImage');
    }
  },

  /**
   * Delete image from Cloudinary
   */
  deleteImage: async (publicId: string): Promise<{ message: string }> => {
    try {
      const response = await retryRequest(() =>
        apiClient.delete<{ message: string }>(`/upload/image/${publicId}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'deleteImage');
    }
  },

  /**
   * Upload multiple images
   */
  uploadMultipleImages: async (
    files: (File | Blob)[],
    type: UploadType = 'general'
  ): Promise<UploadResponse[]> => {
    try {
      const uploadPromises = files.map(file => uploadApi.uploadImage(file, type));
      return await Promise.all(uploadPromises);
    } catch (error) {
      return handleApiError(error, 'uploadMultipleImages');
    }
  },
};

export default uploadApi;

