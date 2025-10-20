import { ApiProperty } from "@nestjs/swagger";

// Response DTOs for Swagger documentation
export class SeederStatusDto {
  @ApiProperty({ description: "Whether seeding is currently running" })
  isRunning: boolean;

  @ApiProperty({ description: "Current phase being executed", required: false })
  currentPhase?: string;

  @ApiProperty({ description: "Progress percentage (0-100)" })
  progress: number;

  @ApiProperty({ description: "Total number of phases to execute" })
  totalPhases: number;

  @ApiProperty({ description: "List of completed phases", type: [String] })
  completedPhases: string[];

  @ApiProperty({ description: "List of errors encountered", type: [String] })
  errors: string[];

  @ApiProperty({ description: "Seeding start time", required: false })
  startTime?: Date;

  @ApiProperty({ description: "Estimated completion time", required: false })
  estimatedCompletion?: string;
}

export class SeederPhaseResultDto {
  @ApiProperty({ description: "Phase name" })
  phase: string;

  @ApiProperty({ description: "Whether phase completed successfully" })
  success: boolean;

  @ApiProperty({ description: "Collections that were seeded", type: [String] })
  collectionsSeeded: string[];

  @ApiProperty({ description: "Record counts per collection", type: "object" })
  recordCounts: Record<string, number>;

  @ApiProperty({ description: "Phase execution duration in milliseconds" })
  duration: number;

  @ApiProperty({
    description: "Errors encountered during phase",
    type: [String],
    required: false,
  })
  errors?: string[];
}

export class ValidationResultDto {
  @ApiProperty({ description: "Whether data validation passed" })
  isValid: boolean;

  @ApiProperty({ description: "Validation errors found", type: [String] })
  errors: string[];

  @ApiProperty({ description: "Validation warnings", type: [String] })
  warnings: string[];
}

export class SeederSummaryDto {
  @ApiProperty({ description: "Whether seeding completed successfully" })
  success: boolean;

  @ApiProperty({ description: "Total seeding duration in milliseconds" })
  totalDuration: number;

  @ApiProperty({ description: "Number of phases completed successfully" })
  phasesCompleted: number;

  @ApiProperty({ description: "Total records created across all collections" })
  totalRecords: number;

  @ApiProperty({
    description: "Results from each phase",
    type: [SeederPhaseResultDto],
  })
  phaseResults: SeederPhaseResultDto[];

  @ApiProperty({ description: "All errors encountered", type: [String] })
  errors: string[];

  @ApiProperty({ description: "Data validation results" })
  validation: ValidationResultDto;
}

export class CollectionStatsDto {
  @ApiProperty({ description: "Collection name" })
  collection: string;

  @ApiProperty({ description: "Number of documents in collection" })
  count: number;

  @ApiProperty({
    description: "Sample document from collection",
    required: false,
  })
  sampleRecord?: any;

  @ApiProperty({ description: "Issues found with collection", type: [String] })
  issues: string[];
}

export class SeederConfigDto {
  @ApiProperty({
    description: "Data volume profile",
    enum: ["minimal", "standard", "extensive"],
    example: "standard",
  })
  profile: string;

  @ApiProperty({ description: "Data volume configuration", type: "object" })
  volumes: any;

  @ApiProperty({ description: "Image generation strategy", type: "object" })
  imageStrategy: any;

  @ApiProperty({ description: "Geographic configuration", type: "object" })
  geographic: any;

  @ApiProperty({
    description: "Whether to add data incrementally without cleanup",
  })
  incremental: boolean;

  @ApiProperty({ description: "Whether to skip cleanup phase" })
  skipCleanup: boolean;
}

export class PhaseInfoDto {
  @ApiProperty({ description: "Phase name" })
  name: string;

  @ApiProperty({ description: "Phase description" })
  description: string;

  @ApiProperty({ description: "Required dependency phases", type: [String] })
  dependencies: string[];
}

export class ProfileInfoDto {
  @ApiProperty({ description: "Profile name" })
  name: string;

  @ApiProperty({ description: "Profile description" })
  description: string;

  @ApiProperty({ description: "Estimated number of records" })
  estimatedRecords: string;

  @ApiProperty({ description: "Estimated completion time" })
  estimatedTime: string;
}
