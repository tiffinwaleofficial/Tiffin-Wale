import { Injectable } from "@nestjs/common";
import {
  SeederConfig,
  VolumeConfig,
  ImageStrategy,
  GeographicConfig,
  SeederConfigService,
} from "../interfaces/seeder-config.interface";
import {
  DEFAULT_PROFILES,
  DEFAULT_IMAGE_STRATEGY,
  DEFAULT_GEOGRAPHIC_CONFIG,
} from "../interfaces/seeder-config.interface";

@Injectable()
export class SeederConfigManager implements SeederConfigService {
  private config: SeederConfig;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  getConfig(): SeederConfig {
    return { ...this.config };
  }

  getVolumeConfig(profile: string): VolumeConfig {
    const profiles = DEFAULT_PROFILES;
    if (profile in profiles) {
      return profiles[profile as keyof typeof profiles];
    }
    return profiles.standard;
  }

  getImageStrategy(): ImageStrategy {
    return { ...this.config.imageStrategy };
  }

  getGeographicConfig(): GeographicConfig {
    return { ...this.config.geographic };
  }

  updateConfig(updates: Partial<SeederConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  private getDefaultConfig(): SeederConfig {
    const profile = (process.env.SEEDER_PROFILE as any) || "standard";
    return {
      profile,
      volumes: this.getVolumeConfig(profile),
      imageStrategy: DEFAULT_IMAGE_STRATEGY,
      geographic: DEFAULT_GEOGRAPHIC_CONFIG,
      incremental: false,
      skipCleanup: false,
    };
  }

  // Environment-based configuration overrides
  applyEnvironmentOverrides(): void {
    const envOverrides: Partial<SeederConfig> = {};

    if (process.env.SEEDER_INCREMENTAL === "true") {
      envOverrides.incremental = true;
    }

    if (process.env.SEEDER_SKIP_CLEANUP === "true") {
      envOverrides.skipCleanup = true;
    }

    if (process.env.SEEDER_IMAGE_PROVIDER) {
      envOverrides.imageStrategy = {
        ...this.config.imageStrategy,
        provider: process.env.SEEDER_IMAGE_PROVIDER as any,
      };
    }

    if (Object.keys(envOverrides).length > 0) {
      this.updateConfig(envOverrides);
    }
  }

  // Get configuration for specific phase
  getPhaseConfig(phaseName: string): Partial<SeederConfig> {
    const baseConfig = this.getConfig();

    // Phase-specific overrides can be added here
    const phaseOverrides: Record<string, Partial<SeederConfig>> = {
      core: {
        volumes: {
          ...baseConfig.volumes,
          // Core phase might need fewer records
        },
      },
      communication: {
        volumes: {
          ...baseConfig.volumes,
          // Communication phase might need more conversations
          conversations: Math.max(baseConfig.volumes.conversations, 20),
        },
      },
    };

    return {
      ...baseConfig,
      ...(phaseOverrides[phaseName] || {}),
    };
  }
}
