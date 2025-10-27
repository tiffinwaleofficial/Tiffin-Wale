import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class UploadService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, type: string = "general") {
    try {
      if (!file) {
        throw new BadRequestException("No file provided");
      }

      // Validate file type
      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        );
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException(
          "File size too large. Maximum size is 5MB.",
        );
      }

      // Generate folder path based on type
      const folderPath = this.getFolderPath(type);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: folderPath,
              resource_type: "image",
              transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1200, height: 1200, crop: "limit" }, // Limit max dimensions
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          )
          .end(file.buffer);
      });

      return {
        url: (result as any).secure_url,
        public_id: (result as any).public_id,
        type,
        width: (result as any).width,
        height: (result as any).height,
        format: (result as any).format,
        bytes: (result as any).bytes,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }


  async deleteImage(publicId: string) {
    try {
      if (!publicId) {
        throw new BadRequestException("Public ID is required");
      }

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "ok") {
        return {
          deleted: true,
          publicId,
          message: "Image deleted successfully",
        };
      } else {
        throw new BadRequestException(
          `Failed to delete image: ${result.result}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  private getFolderPath(type: string): string {
    const folderMap: Record<string, string> = {
      profile: "tiffinwale/partners/profiles",
      menu: "tiffinwale/partners/menu",
      banner: "tiffinwale/partners/banners",
      general: "tiffinwale/general",
    };

    return folderMap[type] || folderMap.general;
  }

  // Additional utility method for getting optimized image URLs
  getOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number,
    quality: string = "auto",
  ): string {
    if (!publicId) return "";

    const transformations = [
      `q_${quality}`,
      "f_auto", // Auto format
    ];

    if (width && height) {
      transformations.push(`w_${width},h_${height},c_fill`);
    } else if (width) {
      transformations.push(`w_${width},c_scale`);
    } else if (height) {
      transformations.push(`h_${height},c_scale`);
    }

    return cloudinary.url(publicId, {
      transformation: transformations.join(","),
    });
  }
}
