import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { SeederManager } from "./seeder-manager.service";
import { SeederConfig } from "./interfaces/seeder-phase.interface";
import {
  SeederStatusDto,
  SeederPhaseResultDto,
  SeederSummaryDto,
  ValidationResultDto,
  CollectionStatsDto,
  SeederConfigDto,
  PhaseInfoDto,
  ProfileInfoDto,
} from "./dto/seeder.dto";

@ApiTags("seeder")
@Controller("seeder")
export class SeederController {
  constructor(private readonly seederManager: SeederManager) {}

  // Legacy endpoint for backward compatibility
  @Post("/seedDummyData")
  @ApiOperation({ summary: "Seed all dummy data (legacy endpoint)" })
  @ApiResponse({ status: 200, description: "Seeding completed" })
  seedDummyData() {
    return this.seederManager.seedDummyData();
  }

  // New comprehensive seeding endpoint
  @Post("/seed")
  @ApiOperation({
    summary: "Seed all data with configuration",
    description:
      "Execute all seeding phases with optional configuration. Supports different profiles and incremental seeding.",
  })
  @ApiBody({
    required: false,
    description: "Optional seeding configuration",
    schema: {
      type: "object",
      properties: {
        profile: {
          type: "string",
          enum: ["minimal", "standard", "extensive"],
          description: "Predefined data volume profile",
          example: "standard",
        },
        incremental: {
          type: "boolean",
          description: "Add data without cleaning existing collections",
          example: false,
        },
        skipCleanup: {
          type: "boolean",
          description: "Skip cleanup phase entirely",
          example: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Comprehensive seeding completed successfully",
    type: SeederSummaryDto,
    schema: {
      example: {
        success: true,
        totalDuration: 120000,
        phasesCompleted: 3,
        totalRecords: 487,
        phaseResults: [
          {
            phase: "core",
            success: true,
            collectionsSeeded: ["users"],
            recordCounts: { users: 67 },
            duration: 15000,
          },
        ],
        errors: [],
        validation: {
          isValid: true,
          errors: [],
          warnings: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid configuration provided",
  })
  @ApiResponse({
    status: 500,
    description: "Seeding failed with errors",
  })
  async seedAll(@Body() config?: Partial<SeederConfig>) {
    return this.seederManager.seedAll(config);
  }

  // Phase-specific seeding
  @Post("/phase/:phaseName")
  @ApiOperation({ summary: "Seed specific phase" })
  @ApiParam({
    name: "phaseName",
    description: "Phase name",
    enum: [
      "core",
      "partner",
      "customer",
      "transaction",
      "communication",
      "marketing",
      "support",
    ],
  })
  @ApiBody({ required: false })
  @ApiResponse({ status: 200, description: "Phase seeding completed" })
  async seedPhase(
    @Param("phaseName") phaseName: string,
    @Body() config?: Partial<SeederConfig>,
  ) {
    return this.seederManager.seedPhase(phaseName, config);
  }

  // Profile-based seeding
  @Post("/profile/:profileName")
  @ApiOperation({ summary: "Seed data using predefined profile" })
  @ApiParam({
    name: "profileName",
    description: "Profile name",
    enum: ["minimal", "standard", "extensive"],
  })
  @ApiResponse({ status: 200, description: "Profile seeding completed" })
  async seedProfile(@Param("profileName") profileName: string) {
    return this.seederManager.seedProfile(profileName);
  }

  // Status endpoint
  @Get("/status")
  @ApiOperation({
    summary: "Get current seeding status",
    description:
      "Monitor real-time seeding progress, current phase, and completion estimates",
  })
  @ApiResponse({
    status: 200,
    description: "Current seeding status with progress information",
    type: SeederStatusDto,
    schema: {
      example: {
        isRunning: true,
        currentPhase: "partner",
        progress: 65,
        totalPhases: 3,
        completedPhases: ["core"],
        errors: [],
        startTime: "2025-01-11T10:30:00Z",
        estimatedCompletion: "~2m",
      },
    },
  })
  getStatus() {
    return this.seederManager.getStatus();
  }

  // Configuration endpoints
  @Get("/config")
  @ApiOperation({ summary: "Get current seeder configuration" })
  @ApiResponse({ status: 200, description: "Current configuration" })
  getConfig() {
    return this.seederManager.getConfig();
  }

  @Post("/config")
  @ApiOperation({ summary: "Update seeder configuration" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        profile: { type: "string" },
        imageStrategy: { type: "object" },
        geographic: { type: "object" },
        volumes: { type: "object" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Configuration updated" })
  updateConfig(@Body() updates: Partial<SeederConfig>) {
    this.seederManager.updateConfig(updates);
    return { message: "Configuration updated successfully" };
  }

  // Validation endpoint
  @Get("/validate")
  @ApiOperation({
    summary: "Validate seeded data integrity",
    description:
      "Comprehensive validation of data relationships, business logic, and integrity constraints",
  })
  @ApiResponse({
    status: 200,
    description: "Data validation results with errors and warnings",
    type: ValidationResultDto,
    schema: {
      example: {
        isValid: true,
        errors: [],
        warnings: [
          "Orders: 5 orders with total amount mismatch",
          "Subscriptions: 2 subscriptions with invalid date ranges",
        ],
      },
    },
  })
  async validateData() {
    return this.seederManager.validateData();
  }

  // Statistics endpoint
  @Get("/stats")
  @ApiOperation({ summary: "Get collection statistics" })
  @ApiResponse({ status: 200, description: "Collection statistics" })
  async getStats() {
    return this.seederManager.getCollectionStats();
  }

  // Cleanup endpoints
  @Delete("/phase/:phaseName")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Clean specific phase data" })
  @ApiParam({ name: "phaseName", description: "Phase name to clean" })
  @ApiResponse({ status: 204, description: "Phase data cleaned" })
  async cleanPhase(@Param("phaseName") phaseName: string) {
    await this.seederManager.cleanPhase(phaseName);
  }

  @Delete("/all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Clean all seeded data" })
  @ApiResponse({ status: 204, description: "All data cleaned" })
  async cleanAll() {
    await this.seederManager.cleanAll();
  }

  // Utility endpoints for development
  @Get("/phases")
  @ApiOperation({ summary: "Get available seeding phases" })
  @ApiResponse({ status: 200, description: "List of available phases" })
  getAvailablePhases() {
    return {
      phases: [
        {
          name: "core",
          description: "Users, authentication, basic setup",
          dependencies: [],
        },
        {
          name: "partner",
          description: "Restaurants, menus, categories with images",
          dependencies: ["core"],
        },
        {
          name: "customer",
          description: "Customer profiles, addresses, preferences",
          dependencies: ["core"],
        },
        {
          name: "transaction",
          description: "Orders, payments, subscriptions",
          dependencies: ["core", "partner", "customer"],
        },
        {
          name: "communication",
          description: "Chat conversations, messages, notifications",
          dependencies: ["core", "partner"],
        },
        {
          name: "marketing",
          description: "Testimonials, referrals, analytics data",
          dependencies: ["core", "customer"],
        },
        {
          name: "support",
          description: "Feedback, tickets, corporate quotes",
          dependencies: ["core", "customer"],
        },
      ],
    };
  }

  @Get("/profiles")
  @ApiOperation({ summary: "Get available seeding profiles" })
  @ApiResponse({ status: 200, description: "List of available profiles" })
  getAvailableProfiles() {
    return {
      profiles: [
        {
          name: "minimal",
          description: "Minimal data for quick testing",
          estimatedRecords: "~100 records",
          estimatedTime: "~30 seconds",
        },
        {
          name: "standard",
          description: "Standard data for realistic testing",
          estimatedRecords: "~500 records",
          estimatedTime: "~2 minutes",
        },
        {
          name: "extensive",
          description: "Extensive data for performance testing",
          estimatedRecords: "~1500 records",
          estimatedTime: "~5 minutes",
        },
      ],
    };
  }
}
