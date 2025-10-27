import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadService } from "./upload.service";

@ApiTags("upload")
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload image to Cloudinary" })
  @ApiConsumes("multipart/form-data")
  @ApiQuery({
    name: "type",
    required: false,
    description: "Image type (profile, menu, banner, general)",
    enum: ["profile", "menu", "banner", "general"],
  })
  @ApiResponse({ status: 201, description: "Image uploaded successfully" })
  @ApiResponse({
    status: 400,
    description: "Bad request - invalid file or type",
  })
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("type") type: string = "general",
  ) {
    return this.uploadService.uploadImage(file, type);
  }

  @Delete("image/:publicId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete uploaded image from Cloudinary" })
  @ApiResponse({ status: 200, description: "Image deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad request - invalid public ID" })
  @ApiResponse({ status: 404, description: "Image not found" })
  delete(@Param("publicId") publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }
}
