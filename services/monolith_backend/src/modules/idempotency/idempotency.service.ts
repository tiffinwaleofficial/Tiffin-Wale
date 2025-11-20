import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createHash } from "crypto";
import { RedisService } from "../redis/redis.service";
import { IdempotencyKey } from "./schemas/idempotency-key.schema";

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly LOCK_TTL = 30; // 30 seconds lock timeout
  private readonly IDEMPOTENCY_TTL_HOURS = 24; // 24 hours

  constructor(
    @InjectModel(IdempotencyKey.name)
    private readonly idempotencyKeyModel: Model<IdempotencyKey>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Generate SHA-256 hash of request for validation
   */
  generateRequestHash(method: string, path: string, body: any): string {
    const bodyStr = body ? JSON.stringify(body) : "";
    const combined = `${method.toUpperCase()}:${path}:${bodyStr}`;
    return createHash("sha256").update(combined).digest("hex");
  }

  /**
   * Check if idempotency key exists and return cached response
   */
  async checkKey(
    key: string,
    requestHash: string,
  ): Promise<{ exists: boolean; response?: any; statusCode?: number }> {
    try {
      const existing = await this.idempotencyKeyModel.findOne({ key });

      if (!existing) {
        return { exists: false };
      }

      // Validate request hash matches
      if (existing.requestHash !== requestHash) {
        throw new ConflictException(
          `Idempotency key already used with different request payload`,
        );
      }

      // Check if request is still processing
      if (existing.status === "pending") {
        this.logger.warn(
          `Idempotency key ${key} is still pending. Request may be processing.`,
        );
        // Return a 202 Accepted or wait - for now, we'll return the existing record
        // In production, you might want to implement a polling mechanism
      }

      return {
        exists: true,
        response: existing.response,
        statusCode: existing.statusCode,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error checking idempotency key ${key}:`, error);
      return { exists: false };
    }
  }

  /**
   * Acquire distributed lock for concurrent request handling
   */
  private async acquireLock(key: string): Promise<boolean> {
    const lockKey = `idempotency:lock:${key}`;
    try {
      // Try to set lock with TTL
      const lockValue = Date.now().toString();
      const existing = await this.redisService.get(lockKey);

      if (existing) {
        // Lock exists, check if it's stale (older than LOCK_TTL)
        const lockTime = parseInt(String(existing));
        const age = Date.now() - lockTime;

        if (age < this.LOCK_TTL * 1000) {
          // Lock is still valid
          return false;
        }
        // Lock is stale, remove it
        await this.redisService.del(lockKey);
      }

      // Set new lock
      await this.redisService.set(lockKey, lockValue, {
        ttl: this.LOCK_TTL,
      });
      return true;
    } catch (error) {
      this.logger.error(`Error acquiring lock for key ${key}:`, error);
      // If Redis fails, allow request to proceed (fail open)
      return true;
    }
  }

  /**
   * Release distributed lock
   */
  private async releaseLock(key: string): Promise<void> {
    const lockKey = `idempotency:lock:${key}`;
    try {
      await this.redisService.del(lockKey);
    } catch (error) {
      this.logger.error(`Error releasing lock for key ${key}:`, error);
    }
  }

  /**
   * Store idempotency key with request/response data
   */
  async storeKey(
    key: string,
    data: {
      userId?: string;
      userRole?: string;
      method: string;
      path: string;
      requestHash: string;
      response: any;
      statusCode: number;
      metadata?: any;
    },
  ): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.IDEMPOTENCY_TTL_HOURS);

      await this.idempotencyKeyModel.create({
        key,
        userId: data.userId,
        userRole: data.userRole,
        method: data.method,
        path: data.path,
        requestHash: data.requestHash,
        response: data.response,
        statusCode: data.statusCode,
        status: "completed",
        expiresAt,
        metadata: data.metadata || {},
      });

      this.logger.debug(`Stored idempotency key: ${key}`);
    } catch (error) {
      // If key already exists (race condition), that's okay
      if (error.code === 11000) {
        this.logger.warn(
          `Idempotency key ${key} already exists (race condition)`,
        );
        return;
      }
      this.logger.error(`Error storing idempotency key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Create pending idempotency key entry (for concurrent request handling)
   */
  async createPendingKey(
    key: string,
    data: {
      userId?: string;
      userRole?: string;
      method: string;
      path: string;
      requestHash: string;
      metadata?: any;
    },
  ): Promise<boolean> {
    try {
      // Try to acquire lock first
      const lockAcquired = await this.acquireLock(key);
      if (!lockAcquired) {
        return false; // Another request is processing
      }

      // Check if key already exists
      const existing = await this.idempotencyKeyModel.findOne({ key });
      if (existing) {
        await this.releaseLock(key);
        return false; // Key already processed
      }

      // Create pending entry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.IDEMPOTENCY_TTL_HOURS);

      await this.idempotencyKeyModel.create({
        key,
        userId: data.userId,
        userRole: data.userRole,
        method: data.method,
        path: data.path,
        requestHash: data.requestHash,
        status: "pending",
        expiresAt,
        metadata: data.metadata || {},
      });

      return true; // Successfully created pending entry
    } catch (error) {
      await this.releaseLock(key);
      if (error.code === 11000) {
        // Duplicate key - another request created it first
        return false;
      }
      this.logger.error(
        `Error creating pending idempotency key ${key}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update pending key with response
   */
  async updatePendingKey(
    key: string,
    response: any,
    statusCode: number,
  ): Promise<void> {
    try {
      await this.idempotencyKeyModel.findOneAndUpdate(
        { key },
        {
          response,
          statusCode,
          status: "completed",
        },
      );
      await this.releaseLock(key);
    } catch (error) {
      this.logger.error(
        `Error updating pending idempotency key ${key}:`,
        error,
      );
      await this.releaseLock(key);
      throw error;
    }
  }

  /**
   * Mark key as failed
   */
  async markKeyAsFailed(key: string, error?: any): Promise<void> {
    try {
      await this.idempotencyKeyModel.findOneAndUpdate(
        { key },
        {
          status: "failed",
          response: error ? { error: error.message } : null,
        },
      );
      await this.releaseLock(key);
    } catch (err) {
      this.logger.error(`Error marking idempotency key ${key} as failed:`, err);
      await this.releaseLock(key);
    }
  }

  /**
   * Validate request hash matches existing key
   */
  async validateRequest(key: string, requestHash: string): Promise<boolean> {
    try {
      const existing = await this.idempotencyKeyModel.findOne({ key });
      if (!existing) {
        return true; // No existing key, validation passes
      }

      if (existing.requestHash !== requestHash) {
        throw new ConflictException(
          `Idempotency key already used with different request payload`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error validating request for key ${key}:`, error);
      return false;
    }
  }
}
