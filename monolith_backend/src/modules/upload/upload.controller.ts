import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";

@ApiTags("upload")
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload image" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param("type") type = "general",
  ) {
    return this.uploadService.uploadImage(file, type);
  }

  @Delete("image/:publicId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete uploaded image" })
  delete(@Param("publicId") publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }
}