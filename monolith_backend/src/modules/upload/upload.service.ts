import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File, type: string) {
    // TODO integrate Cloudinary later
    return {
      url: `https://fake-cloudinary.com/${file.originalname}`,
      public_id: `demo_${Date.now()}`,
      type,
    };
  }

  async deleteImage(publicId: string) {
    return { deleted: true, publicId };
  }
}
