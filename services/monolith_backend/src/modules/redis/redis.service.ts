import { Injectable, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ConfigService } from "@nestjs/config";

export interface CacheOptions {
  ttl?: number;
  category?:
    | "auth"
    | "user"
    | "menu"
    | "order"
    | "analytics"
    | "ml"
    | "default";
}

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  // TTL configurations based on category (in seconds)
  private readonly ttlConfig = {
    auth: 900, // 15 minutes - user sessions, tokens
    user: 1800, // 30 minutes - user profiles, preferences
    menu: 3600, // 1 hour - menu items, restaurant data
    order: 7200, // 2 hours - active orders, order status
    analytics: 600, // 10 minutes - dashboard data, metrics
    ml: 1800, // 30 minutes - ML predictions, recommendations
    default: 300, // 5 minutes - general cache
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  /**
   * Set cache with automatic TTL based on category
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<void> {
    try {
      const ttl = options.ttl || this.ttlConfig[options.category || "default"];
      await this.cacheManager.set(key, value, ttl * 1000); // Convert to milliseconds

      this.logger.debug(
        `Cache SET: ${key} (TTL: ${ttl}s, Category: ${options.category || "default"})`,
      );
    } catch (error) {
      this.logger.error(`Cache SET error for key ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Get cache value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);

      if (value !== undefined) {
        this.logger.debug(`Cache HIT: ${key}`);
        return value;
      }

      this.logger.debug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      this.logger.error(`Cache GET error for key ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Delete cache key
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DEL: ${key}`);
    } catch (error) {
      this.logger.error(`Cache DEL error for key ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.cacheManager.get(key);
      return value !== undefined;
    } catch (error) {
      this.logger.error(`Cache EXISTS error for key ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
      this.logger.warn("Cache RESET: All cache cleared");
    } catch (error) {
      this.logger.error("Cache RESET error:", error.message);
      throw error;
    }
  }

  // ============ USER MANAGEMENT CACHE ============

  /**
   * Cache user profile data
   */
  async cacheUserProfile(userId: string, profile: any): Promise<void> {
    const key = `user:profile:${userId}`;
    await this.set(key, profile, { category: "user" });
  }

  /**
   * Get cached user profile
   */
  async getUserProfile(userId: string): Promise<any> {
    const key = `user:profile:${userId}`;
    return this.get(key);
  }

  /**
   * Cache user preferences
   */
  async cacheUserPreferences(userId: string, preferences: any): Promise<void> {
    const key = `user:preferences:${userId}`;
    await this.set(key, preferences, { category: "user" });
  }

  /**
   * Get cached user preferences
   */
  async getUserPreferences(userId: string): Promise<any> {
    const key = `user:preferences:${userId}`;
    return this.get(key);
  }

  // ============ AUTHENTICATION CACHE ============

  /**
   * Cache user session
   */
  async cacheUserSession(userId: string, sessionData: any): Promise<void> {
    const key = `session:${userId}`;
    await this.set(key, sessionData, { category: "auth" });
  }

  /**
   * Get cached user session
   */
  async getUserSession(userId: string): Promise<any> {
    const key = `session:${userId}`;
    return this.get(key);
  }

  /**
   * Invalidate user session
   */
  async invalidateUserSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await this.del(key);
  }

  /**
   * Cache JWT token blacklist
   */
  async blacklistToken(tokenId: string, expiresAt: Date): Promise<void> {
    const key = `blacklist:${tokenId}`;
    const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    await this.set(key, true, { ttl: Math.max(ttl, 60) }); // Minimum 1 minute
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(tokenId: string): Promise<boolean> {
    const key = `blacklist:${tokenId}`;
    const result = await this.get(key);
    return !!result;
  }

  // ============ MENU & RESTAURANT CACHE ============

  /**
   * Cache menu items for a partner
   */
  async cachePartnerMenu(partnerId: string, menuItems: any[]): Promise<void> {
    const key = `menu:partner:${partnerId}`;
    await this.set(key, menuItems, { category: "menu" });
  }

  /**
   * Get cached partner menu
   */
  async getPartnerMenu(partnerId: string): Promise<any[]> {
    const key = `menu:partner:${partnerId}`;
    return this.get(key);
  }

  /**
   * Cache single menu item
   */
  async cacheMenuItem(itemId: string, item: any): Promise<void> {
    const key = `menu:item:${itemId}`;
    await this.set(key, item, { category: "menu" });
  }

  /**
   * Get cached menu item
   */
  async getMenuItem(itemId: string): Promise<any> {
    const key = `menu:item:${itemId}`;
    return this.get(key);
  }

  // ============ ORDER MANAGEMENT CACHE ============

  /**
   * Cache order data
   */
  async cacheOrder(orderId: string, orderData: any): Promise<void> {
    const key = `order:${orderId}`;
    await this.set(key, orderData, { category: "order" });
  }

  /**
   * Get cached order
   */
  async getOrder(orderId: string): Promise<any> {
    const key = `order:${orderId}`;
    return this.get(key);
  }

  /**
   * Cache user's recent orders
   */
  async cacheUserOrders(userId: string, orders: any[]): Promise<void> {
    const key = `orders:user:${userId}`;
    await this.set(key, orders, { category: "order" });
  }

  /**
   * Get cached user orders
   */
  async getUserOrders(userId: string): Promise<any[]> {
    const key = `orders:user:${userId}`;
    return this.get(key);
  }

  // ============ ANALYTICS CACHE ============

  /**
   * Cache analytics data
   */
  async cacheAnalytics(
    metric: string,
    data: any,
    timeframe?: string,
  ): Promise<void> {
    const key = timeframe
      ? `analytics:${metric}:${timeframe}`
      : `analytics:${metric}`;
    await this.set(key, data, { category: "analytics" });
  }

  /**
   * Get cached analytics
   */
  async getAnalytics(metric: string, timeframe?: string): Promise<any> {
    const key = timeframe
      ? `analytics:${metric}:${timeframe}`
      : `analytics:${metric}`;
    return this.get(key);
  }

  /**
   * Cache dashboard stats
   */
  async cacheDashboardStats(userId: string, stats: any): Promise<void> {
    const key = `dashboard:${userId}`;
    await this.set(key, stats, { category: "analytics" });
  }

  /**
   * Get cached dashboard stats
   */
  async getDashboardStats(userId: string): Promise<any> {
    const key = `dashboard:${userId}`;
    return this.get(key);
  }

  // ============ ML PREDICTIONS CACHE ============

  /**
   * Cache ML prediction
   */
  async cacheMlPrediction(
    modelName: string,
    inputHash: string,
    prediction: any,
  ): Promise<void> {
    const key = `ml:${modelName}:${inputHash}`;
    await this.set(key, prediction, { category: "ml" });
  }

  /**
   * Get cached ML prediction
   */
  async getMlPrediction(modelName: string, inputHash: string): Promise<any> {
    const key = `ml:${modelName}:${inputHash}`;
    return this.get(key);
  }

  // ============ UTILITY METHODS ============

  /**
   * Generate cache key with prefix
   */
  generateKey(prefix: string, ...parts: string[]): string {
    return [prefix, ...parts].join(":");
  }

  /**
   * Get cache statistics (if supported by the store)
   */
  async getStats(): Promise<any> {
    try {
      // This depends on the cache store implementation
      return {
        status: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Error getting cache stats:", error.message);
      return {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async increment(
    key: string,
    amount: number = 1,
    ttl?: number,
  ): Promise<number> {
    try {
      // Get current value
      const current = (await this.get<number>(key)) || 0;
      const newValue = current + amount;

      // Set new value with TTL
      await this.set(key, newValue, { ttl });

      this.logger.debug(
        `Incremented cache key: ${key} by ${amount} to ${newValue}`,
      );
      return newValue;
    } catch (error) {
      this.logger.error(`Failed to increment cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Add item to a list (keeping max length)
   */
  async add_to_list(
    key: string,
    value: string,
    maxLength?: number,
  ): Promise<void> {
    try {
      // Get current list
      const currentList = (await this.get<string[]>(key)) || [];

      // Add new item to the beginning
      currentList.unshift(value);

      // Trim to max length if specified
      if (maxLength && currentList.length > maxLength) {
        currentList.splice(maxLength);
      }

      // Save updated list
      await this.set(key, currentList);

      this.logger.debug(
        `Added item to list ${key}, new length: ${currentList.length}`,
      );
    } catch (error) {
      this.logger.error(`Failed to add to list ${key}:`, error);
      throw error;
    }
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<{
    status: string;
    latency?: number;
    error?: string;
  }> {
    const start = Date.now();

    try {
      const testKey = `health:${Date.now()}`;
      await this.set(testKey, "test", { ttl: 10 });
      const value = await this.get(testKey);
      await this.del(testKey);

      const latency = Date.now() - start;

      if (value === "test") {
        return { status: "healthy", latency };
      } else {
        return { status: "unhealthy", error: "Test value mismatch" };
      }
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
        latency: Date.now() - start,
      };
    }
  }
}
