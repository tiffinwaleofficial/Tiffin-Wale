import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
} from "class-validator";

export class CollectionStatsDto {
  @ApiProperty({
    description: "Name of the collection",
    example: "users",
  })
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty({
    description: "Number of documents in the collection",
    example: 150,
  })
  @IsNumber()
  documentCount: number;
}

export class DatabaseStatsResponseDto {
  @ApiProperty({
    description: "Array of collection statistics",
    type: [CollectionStatsDto],
  })
  @IsArray()
  collections: CollectionStatsDto[];

  @ApiProperty({
    description: "Total number of collections",
    example: 25,
  })
  @IsNumber()
  totalCollections: number;

  @ApiProperty({
    description: "Total number of documents across all collections",
    example: 5420,
  })
  @IsNumber()
  totalDocuments: number;

  @ApiProperty({
    description: "Timestamp when stats were generated",
    example: "2024-01-15T10:30:00.000Z",
  })
  timestamp: Date;
}

export class CleanCollectionDto {
  @ApiProperty({
    description: "Confirmation text to prevent accidental deletion",
    example: "YES_DELETE_COLLECTION",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  confirmDelete: string;

  @ApiProperty({
    description: "Optional reason for cleaning the collection",
    example: "Testing data cleanup",
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CleanCollectionResponseDto {
  @ApiProperty({
    description: "Name of the cleaned collection",
    example: "users",
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: "Number of documents deleted",
    example: 150,
  })
  @IsNumber()
  deletedCount: number;

  @ApiProperty({
    description: "Success message",
    example: "Collection 'users' cleaned successfully",
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: "Timestamp when operation was performed",
    example: "2024-01-15T10:30:00.000Z",
  })
  timestamp: Date;
}

export class CleanDatabaseDto {
  @ApiProperty({
    description: "Confirmation text to prevent accidental database wipe",
    example: "YES_DELETE_ALL",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  confirmDestroy: string;

  @ApiProperty({
    description: "Environment confirmation (must match NODE_ENV)",
    example: "development",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  environment: string;

  @ApiProperty({
    description: "Reason for cleaning entire database",
    example: "Full system reset for testing",
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CleanDatabaseResponseDto {
  @ApiProperty({
    description: "Summary of cleaned collections",
    type: [CleanCollectionResponseDto],
  })
  @IsArray()
  cleanedCollections: CleanCollectionResponseDto[];

  @ApiProperty({
    description: "Total number of collections cleaned",
    example: 25,
  })
  @IsNumber()
  totalCollectionsCleaned: number;

  @ApiProperty({
    description: "Total number of documents deleted",
    example: 5420,
  })
  @IsNumber()
  totalDocumentsDeleted: number;

  @ApiProperty({
    description: "Success message",
    example: "Database cleaned successfully",
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: "Timestamp when operation was performed",
    example: "2024-01-15T10:30:00.000Z",
  })
  timestamp: Date;
}
