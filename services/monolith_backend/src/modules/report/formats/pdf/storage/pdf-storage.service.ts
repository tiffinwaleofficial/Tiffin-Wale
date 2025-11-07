import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

/**
 * PDF Storage Service
 * Handles saving generated PDFs to local storage for review
 */
@Injectable()
export class PdfStorageService {
  private readonly logger = new Logger(PdfStorageService.name);
  private readonly baseStoragePath: string;

  constructor() {
    // Storage path relative to the module
    // Use process.cwd() for more reliable path resolution
    this.baseStoragePath = path.join(
      process.cwd(),
      "src/modules/report/formats/pdf/storage/generated",
    );
    this.ensureDirectoriesExist();
  }

  /**
   * Ensure all storage directories exist
   */
  private ensureDirectoriesExist(): void {
    const directories = [
      "order-receipts",
      "subscriptions",
      "contracts",
      "invoices",
      "legal-documents",
    ];

    directories.forEach((dir) => {
      const dirPath = path.join(this.baseStoragePath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        this.logger.log(`Created storage directory: ${dirPath}`);
      }
    });
  }

  /**
   * Save PDF buffer to storage
   * @param buffer PDF buffer
   * @param filename Filename
   * @param category Category folder (order-receipts, subscriptions, etc.)
   * @returns Full path to saved file
   */
  async savePdf(
    buffer: Buffer,
    filename: string,
    category: string,
  ): Promise<string> {
    try {
      const categoryPath = path.join(this.baseStoragePath, category);

      // Ensure category directory exists
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
      }

      // Sanitize filename
      const sanitizedFilename = this.sanitizeFilename(filename);
      const filePath = path.join(categoryPath, sanitizedFilename);

      // Write file
      fs.writeFileSync(filePath, buffer);
      this.logger.log(`PDF saved to: ${filePath}`);

      return filePath;
    } catch (error) {
      this.logger.error(`Error saving PDF: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sanitize filename to remove invalid characters
   */
  private sanitizeFilename(filename: string): string {
    // Remove invalid characters and replace with underscore
    return filename
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_{2,}/g, "_");
  }

  /**
   * Get storage path for a category
   */
  getStoragePath(category: string): string {
    return path.join(this.baseStoragePath, category);
  }

  /**
   * Check if a file exists
   */
  fileExists(filename: string, category: string): boolean {
    const filePath = path.join(this.baseStoragePath, category, filename);
    return fs.existsSync(filePath);
  }

  /**
   * Read a saved PDF file
   */
  readPdf(filename: string, category: string): Buffer | null {
    try {
      const filePath = path.join(this.baseStoragePath, category, filename);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath);
      }
      return null;
    } catch (error) {
      this.logger.error(`Error reading PDF: ${error.message}`, error.stack);
      return null;
    }
  }
}
