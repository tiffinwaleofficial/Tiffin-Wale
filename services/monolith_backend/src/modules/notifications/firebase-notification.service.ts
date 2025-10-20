import { Injectable, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ConfigService } from "@nestjs/config";

export interface FirebaseNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  clickAction?: string;
  sound?: string;
  badge?: number;
  priority?: "normal" | "high";
  ttl?: number;
  collapseKey?: string;
  channelId?: string;
}

export interface BatchNotificationPayload {
  tokens: string[];
  notification: FirebaseNotificationPayload;
  android?: {
    priority: "normal" | "high";
    ttl: number;
    collapseKey?: string;
    restrictedPackageName?: string;
    data?: Record<string, string>;
  };
  apns?: {
    headers?: Record<string, string>;
    payload?: {
      aps: {
        alert?: {
          title?: string;
          body?: string;
        };
        badge?: number;
        sound?: string;
        "content-available"?: number;
        "mutable-content"?: number;
      };
    };
  };
  webpush?: {
    headers?: Record<string, string>;
    data?: Record<string, string>;
    notification?: {
      title?: string;
      body?: string;
      icon?: string;
      image?: string;
      badge?: string;
      tag?: string;
      requireInteraction?: boolean;
    };
  };
}

@Injectable()
export class FirebaseNotificationService {
  private readonly logger = new Logger(FirebaseNotificationService.name);
  private app: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Check if Firebase Admin is already initialized
      if (admin.apps.length === 0) {
        const serviceAccountKey = this.configService.get<string>(
          "FIREBASE_SERVICE_ACCOUNT_KEY",
        );
        const projectId = this.configService.get<string>("FIREBASE_PROJECT_ID");

        if (serviceAccountKey) {
          // Initialize with service account key (production)
          const serviceAccount = JSON.parse(serviceAccountKey);
          this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: projectId,
          });
        } else {
          // Initialize with default credentials (development)
          this.app = admin.initializeApp({
            projectId: projectId,
          });
        }

        this.logger.log("Firebase Admin SDK initialized successfully");
      } else {
        this.app = admin.apps[0] as admin.app.App;
        this.logger.log("Using existing Firebase Admin SDK instance");
      }
    } catch (error) {
      this.logger.error("Failed to initialize Firebase Admin SDK:", error);
      throw error;
    }
  }

  /**
   * Send notification to a single device token
   */
  async sendToDevice(
    token: string,
    payload: FirebaseNotificationPayload,
  ): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          priority: payload.priority === "high" ? "high" : "normal",
          ttl: payload.ttl || 3600000, // 1 hour default
          collapseKey: payload.collapseKey,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.imageUrl,
            sound: payload.sound || "default",
            channelId: payload.channelId || "default",
            clickAction: payload.clickAction,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              badge: payload.badge,
              sound: payload.sound || "default",
              "content-available": 1,
            },
          },
        },
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.imageUrl,
            image: payload.imageUrl,
            requireInteraction: payload.priority === "high",
          },
          data: payload.data || {},
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Firebase notification sent successfully: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to send Firebase notification to ${token}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Send notifications to multiple devices (batch)
   */
  async sendToMultipleDevices(
    tokens: string[],
    payload: FirebaseNotificationPayload,
  ): Promise<admin.messaging.BatchResponse> {
    try {
      if (tokens.length === 0) {
        throw new Error("No tokens provided for batch notification");
      }

      // Firebase FCM supports up to 500 tokens per batch
      const batchSize = 500;
      const batches: string[][] = [];

      for (let i = 0; i < tokens.length; i += batchSize) {
        batches.push(tokens.slice(i, i + batchSize));
      }

      const allResponses: admin.messaging.BatchResponse[] = [];

      for (const batch of batches) {
        const message: admin.messaging.MulticastMessage = {
          tokens: batch,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.imageUrl,
          },
          data: payload.data || {},
          android: {
            priority: payload.priority === "high" ? "high" : "normal",
            ttl: payload.ttl || 3600000,
            collapseKey: payload.collapseKey,
            notification: {
              title: payload.title,
              body: payload.body,
              imageUrl: payload.imageUrl,
              sound: payload.sound || "default",
              channelId: payload.channelId || "default",
              clickAction: payload.clickAction,
            },
          },
          apns: {
            payload: {
              aps: {
                alert: {
                  title: payload.title,
                  body: payload.body,
                },
                badge: payload.badge,
                sound: payload.sound || "default",
                "content-available": 1,
              },
            },
          },
          webpush: {
            notification: {
              title: payload.title,
              body: payload.body,
              icon: payload.imageUrl,
              image: payload.imageUrl,
              requireInteraction: payload.priority === "high",
            },
            data: payload.data || {},
          },
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        allResponses.push(response);

        // Log batch results
        this.logger.log(
          `Firebase batch notification sent: ${response.successCount}/${batch.length} successful`,
        );

        // Handle failed tokens
        if (response.failureCount > 0) {
          const failedTokens: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(batch[idx]);
              this.logger.error(
                `Failed to send to token ${batch[idx]}: ${resp.error?.message}`,
              );
            }
          });

          // TODO: Handle failed tokens (remove invalid ones, retry temporary failures)
          await this.handleFailedTokens(failedTokens, response.responses);
        }

        // Add delay between batches to respect rate limits
        if (batches.length > 1) {
          await this.delay(100);
        }
      }

      // Combine all batch responses
      const combinedResponse: admin.messaging.BatchResponse = {
        responses: allResponses.flatMap((r) => r.responses),
        successCount: allResponses.reduce((sum, r) => sum + r.successCount, 0),
        failureCount: allResponses.reduce((sum, r) => sum + r.failureCount, 0),
      };

      return combinedResponse;
    } catch (error) {
      this.logger.error("Failed to send Firebase batch notifications:", error);
      throw error;
    }
  }

  /**
   * Send notification to a topic
   */
  async sendToTopic(
    topic: string,
    payload: FirebaseNotificationPayload,
  ): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          priority: payload.priority === "high" ? "high" : "normal",
          ttl: payload.ttl || 3600000,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.imageUrl,
            sound: payload.sound || "default",
            channelId: payload.channelId || "default",
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              badge: payload.badge,
              sound: payload.sound || "default",
            },
          },
        },
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.imageUrl,
            requireInteraction: payload.priority === "high",
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(
        `Firebase topic notification sent to ${topic}: ${response}`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to send Firebase topic notification to ${topic}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Subscribe tokens to a topic
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    try {
      const response = await admin.messaging().subscribeToTopic(tokens, topic);
      this.logger.log(
        `Subscribed ${response.successCount}/${tokens.length} tokens to topic ${topic}`,
      );

      if (response.failureCount > 0) {
        response.errors.forEach((error, idx) => {
          this.logger.error(
            `Failed to subscribe token ${tokens[idx]} to topic ${topic}: ${error.error.message}`,
          );
        });
      }
    } catch (error) {
      this.logger.error(`Failed to subscribe tokens to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe tokens from a topic
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    try {
      const response = await admin
        .messaging()
        .unsubscribeFromTopic(tokens, topic);
      this.logger.log(
        `Unsubscribed ${response.successCount}/${tokens.length} tokens from topic ${topic}`,
      );

      if (response.failureCount > 0) {
        response.errors.forEach((error, idx) => {
          this.logger.error(
            `Failed to unsubscribe token ${tokens[idx]} from topic ${topic}: ${error.error.message}`,
          );
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to unsubscribe tokens from topic ${topic}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Validate Firebase token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Send a dry-run message to validate the token
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: "Test",
          body: "Test",
        },
      };

      await admin.messaging().send(message, true); // dry-run = true
      return true;
    } catch (error) {
      this.logger.warn(`Invalid Firebase token: ${token} - ${error.message}`);
      return false;
    }
  }

  /**
   * Get Firebase messaging instance
   */
  getMessaging(): admin.messaging.Messaging {
    return admin.messaging(this.app);
  }

  /**
   * Handle failed tokens (remove invalid ones, retry temporary failures)
   */
  private async handleFailedTokens(
    failedTokens: string[],
    responses: admin.messaging.SendResponse[],
  ): Promise<void> {
    const invalidTokens: string[] = [];
    const retryableTokens: string[] = [];

    responses.forEach((response, idx) => {
      if (!response.success && response.error) {
        const errorCode = response.error.code;

        // Categorize errors
        if (
          errorCode === "messaging/registration-token-not-registered" ||
          errorCode === "messaging/invalid-registration-token"
        ) {
          invalidTokens.push(failedTokens[idx]);
        } else if (
          errorCode === "messaging/server-unavailable" ||
          errorCode === "messaging/internal-error"
        ) {
          retryableTokens.push(failedTokens[idx]);
        }
      }
    });

    // Log invalid tokens for cleanup
    if (invalidTokens.length > 0) {
      this.logger.warn(
        `Found ${invalidTokens.length} invalid tokens for cleanup`,
      );
      // TODO: Emit event to clean up invalid tokens from database
    }

    // Log retryable tokens
    if (retryableTokens.length > 0) {
      this.logger.warn(`Found ${retryableTokens.length} tokens for retry`);
      // TODO: Implement retry mechanism
    }
  }

  /**
   * Utility method to add delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
