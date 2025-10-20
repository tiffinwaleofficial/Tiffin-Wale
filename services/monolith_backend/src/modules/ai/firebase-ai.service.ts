import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { initializeApp, FirebaseApp } from "firebase/app";
import { RedisService } from "../redis/redis.service";

export interface AIPromptRequest {
  prompt: string;
  context?: Record<string, any>;
  temperature?: number;
  maxTokens?: number;
  cacheKey?: string;
  cacheTTL?: number;
}

export interface AIResponse {
  text: string;
  cached: boolean;
  tokensUsed?: number;
  model: string;
  timestamp: string;
}

export interface MenuRecommendationRequest {
  userId: string;
  userPreferences?: string[];
  dietaryRestrictions?: string[];
  budget?: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  location?: string;
}

export interface OrderAnalysisRequest {
  orderId: string;
  orderHistory: any[];
  userProfile: any;
  partnerData: any;
}

export interface NotificationOptimizationRequest {
  userId: string;
  notificationHistory: any[];
  userEngagement: any;
  targetAction: string;
}

@Injectable()
export class FirebaseAIService {
  private readonly logger = new Logger(FirebaseAIService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private firebaseApp: FirebaseApp;

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.initializeFirebaseAI();
  }

  private initializeFirebaseAI() {
    try {
      // Initialize Firebase app
      const firebaseConfig = {
        apiKey: this.configService.get<string>("FIREBASE_API_KEY"),
        authDomain: this.configService.get<string>("FIREBASE_AUTH_DOMAIN"),
        projectId: this.configService.get<string>("FIREBASE_PROJECT_ID"),
        storageBucket: this.configService.get<string>(
          "FIREBASE_STORAGE_BUCKET",
        ),
        messagingSenderId: this.configService.get<string>(
          "FIREBASE_MESSAGING_SENDER_ID",
        ),
        appId: this.configService.get<string>("FIREBASE_APP_ID"),
        measurementId: this.configService.get<string>(
          "FIREBASE_MEASUREMENT_ID",
        ),
      };

      this.firebaseApp = initializeApp(firebaseConfig, "tiffin-wale-ai");

      // Initialize Gemini AI
      const apiKey = this.configService.get<string>("FIREBASE_API_KEY");
      if (!apiKey) {
        throw new Error("Firebase API key not found");
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      this.logger.log(
        "Firebase AI Service initialized successfully with Gemini 1.5 Flash",
      );
    } catch (error) {
      this.logger.error("Failed to initialize Firebase AI Service:", error);
      throw error;
    }
  }

  /**
   * Generate AI response with caching
   */
  async generateResponse(request: AIPromptRequest): Promise<AIResponse> {
    try {
      // Check cache first
      if (request.cacheKey) {
        const cached = await this.redisService.get(
          `ai_response:${request.cacheKey}`,
        );
        if (cached) {
          this.logger.log(`AI response served from cache: ${request.cacheKey}`);
          return {
            text: cached as string,
            cached: true,
            model: "gemini-1.5-flash",
            timestamp: new Date().toISOString(),
          };
        }
      }

      // Generate new response
      const result = await this.model.generateContent(request.prompt);
      const response = await result.response;
      const text = response.text();

      // Cache the response
      if (request.cacheKey) {
        await this.redisService.set(`ai_response:${request.cacheKey}`, text, {
          ttl: request.cacheTTL || 3600,
        });
      }

      // Track AI usage analytics
      await this.trackAIUsage(
        "generate_response",
        request.prompt.length,
        text.length,
      );

      return {
        text,
        cached: false,
        tokensUsed: response.usageMetadata?.totalTokenCount,
        model: "gemini-1.5-flash",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to generate AI response:", error);
      throw error;
    }
  }

  /**
   * Generate personalized menu recommendations
   */
  async generateMenuRecommendations(
    request: MenuRecommendationRequest,
  ): Promise<AIResponse> {
    try {
      const cacheKey = `menu_rec:${request.userId}:${request.mealType}:${Date.now().toString().slice(0, -5)}`;

      const prompt = `
You are TiffinWale's AI food recommendation expert. Generate personalized meal recommendations.

User Context:
- User ID: ${request.userId}
- Meal Type: ${request.mealType}
- Budget: ₹${request.budget || "flexible"}
- Location: ${request.location || "not specified"}
- Dietary Preferences: ${request.userPreferences?.join(", ") || "none specified"}
- Dietary Restrictions: ${request.dietaryRestrictions?.join(", ") || "none"}

Task: Generate 3-5 personalized meal recommendations with:
1. Dish name and brief description
2. Estimated price range
3. Why it matches user preferences
4. Nutritional highlights
5. Best time to order

Format as JSON array with objects containing: name, description, priceRange, matchReason, nutrition, bestTime

Focus on Indian cuisine, healthy options, and value for money. Consider the meal type and time of day.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 1800, // 30 minutes
      });
    } catch (error) {
      this.logger.error("Failed to generate menu recommendations:", error);
      throw error;
    }
  }

  /**
   * Analyze order patterns and predict user behavior
   */
  async analyzeOrderPatterns(
    request: OrderAnalysisRequest,
  ): Promise<AIResponse> {
    try {
      const cacheKey = `order_analysis:${request.orderId}`;

      const prompt = `
You are TiffinWale's AI order analyst. Analyze user ordering patterns and provide insights.

Order Data:
- Current Order ID: ${request.orderId}
- Order History: ${JSON.stringify(request.orderHistory.slice(-10))} (last 10 orders)
- User Profile: ${JSON.stringify(request.userProfile)}
- Partner Data: ${JSON.stringify(request.partnerData)}

Analysis Tasks:
1. Identify ordering patterns (frequency, timing, preferences)
2. Predict next likely order (dish type, timing, partner)
3. Suggest upselling opportunities
4. Identify potential churn risk
5. Recommend retention strategies

Format as JSON with: patterns, nextOrderPrediction, upsellOpportunities, churnRisk, retentionStrategies

Provide actionable business insights for improving user experience and revenue.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 3600, // 1 hour
      });
    } catch (error) {
      this.logger.error("Failed to analyze order patterns:", error);
      throw error;
    }
  }

  /**
   * Optimize notification content and timing
   */
  async optimizeNotification(
    request: NotificationOptimizationRequest,
  ): Promise<AIResponse> {
    try {
      const cacheKey = `notification_opt:${request.userId}:${request.targetAction}`;

      const prompt = `
You are TiffinWale's AI notification optimization expert. Create personalized, engaging notifications.

User Context:
- User ID: ${request.userId}
- Target Action: ${request.targetAction}
- Notification History: ${JSON.stringify(request.notificationHistory.slice(-5))}
- User Engagement: ${JSON.stringify(request.userEngagement)}

Optimization Goals:
1. Maximize click-through rate
2. Increase user engagement
3. Drive target action completion
4. Maintain user satisfaction

Generate:
1. Optimized notification title (max 50 chars)
2. Optimized message body (max 150 chars)
3. Best time to send (based on user patterns)
4. Personalization elements
5. A/B test variations (2 alternatives)

Format as JSON with: title, message, bestTime, personalization, variations

Use emojis, urgency (when appropriate), and personal touches. Consider Indian context and TiffinWale branding.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 900, // 15 minutes
      });
    } catch (error) {
      this.logger.error("Failed to optimize notification:", error);
      throw error;
    }
  }

  /**
   * Generate dynamic pricing recommendations
   */
  async generatePricingStrategy(
    partnerData: any,
    marketData: any,
  ): Promise<AIResponse> {
    try {
      const cacheKey = `pricing:${partnerData.partnerId}:${Date.now().toString().slice(0, -5)}`;

      const prompt = `
You are TiffinWale's AI pricing strategist. Optimize partner pricing for maximum revenue and competitiveness.

Partner Data:
- Partner ID: ${partnerData.partnerId}
- Current Menu: ${JSON.stringify(partnerData.menu)}
- Sales Performance: ${JSON.stringify(partnerData.salesData)}
- Customer Feedback: ${JSON.stringify(partnerData.feedback)}

Market Data:
- Competitor Pricing: ${JSON.stringify(marketData.competitors)}
- Demand Trends: ${JSON.stringify(marketData.demand)}
- Seasonal Factors: ${JSON.stringify(marketData.seasonal)}

Generate pricing recommendations:
1. Optimal price points for each menu item
2. Dynamic pricing rules (time-based, demand-based)
3. Promotional pricing strategies
4. Bundle recommendations
5. Revenue impact projections

Format as JSON with: itemPricing, dynamicRules, promotions, bundles, projections

Focus on maximizing partner revenue while maintaining customer satisfaction and market competitiveness.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 7200, // 2 hours
      });
    } catch (error) {
      this.logger.error("Failed to generate pricing strategy:", error);
      throw error;
    }
  }

  /**
   * Generate smart customer support responses
   */
  async generateSupportResponse(
    customerQuery: string,
    customerContext: any,
    orderContext?: any,
  ): Promise<AIResponse> {
    try {
      const cacheKey = `support:${Buffer.from(customerQuery).toString("base64").slice(0, 20)}`;

      const prompt = `
You are TiffinWale's AI customer support assistant. Provide helpful, empathetic, and solution-focused responses.

Customer Query: "${customerQuery}"

Customer Context:
- Profile: ${JSON.stringify(customerContext)}
- Order Context: ${JSON.stringify(orderContext || {})}

Guidelines:
1. Be empathetic and understanding
2. Provide clear, actionable solutions
3. Use TiffinWale's friendly tone
4. Offer alternatives when possible
5. Escalate to human agent if needed

Generate:
1. Primary response (conversational, helpful)
2. Follow-up actions (if any)
3. Escalation flag (true/false)
4. Suggested resolution time
5. Customer satisfaction prediction

Format as JSON with: response, followUpActions, needsEscalation, resolutionTime, satisfactionScore

Keep responses concise but comprehensive. Use Indian English and food delivery context.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 600, // 10 minutes
      });
    } catch (error) {
      this.logger.error("Failed to generate support response:", error);
      throw error;
    }
  }

  /**
   * Analyze and improve partner performance
   */
  async analyzePartnerPerformance(partnerData: any): Promise<AIResponse> {
    try {
      const cacheKey = `partner_analysis:${partnerData.partnerId}`;

      const prompt = `
You are TiffinWale's AI business analyst. Analyze partner performance and provide actionable insights.

Partner Performance Data:
- Partner ID: ${partnerData.partnerId}
- Sales Metrics: ${JSON.stringify(partnerData.sales)}
- Customer Reviews: ${JSON.stringify(partnerData.reviews)}
- Operational Data: ${JSON.stringify(partnerData.operations)}
- Menu Performance: ${JSON.stringify(partnerData.menuStats)}

Analysis Areas:
1. Revenue trends and growth opportunities
2. Customer satisfaction and retention
3. Operational efficiency improvements
4. Menu optimization suggestions
5. Competitive positioning

Generate comprehensive analysis:
1. Performance summary (strengths/weaknesses)
2. Growth opportunities (specific actions)
3. Risk factors (potential issues)
4. Recommendations (prioritized list)
5. Success metrics to track

Format as JSON with: summary, opportunities, risks, recommendations, metrics

Provide specific, actionable insights that partners can implement immediately.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 3600, // 1 hour
      });
    } catch (error) {
      this.logger.error("Failed to analyze partner performance:", error);
      throw error;
    }
  }

  /**
   * Generate content for marketing campaigns
   */
  async generateMarketingContent(
    campaignType: string,
    targetAudience: any,
    objectives: string[],
  ): Promise<AIResponse> {
    try {
      const cacheKey = `marketing:${campaignType}:${targetAudience.segment}`;

      const prompt = `
You are TiffinWale's AI marketing content creator. Generate compelling, culturally relevant marketing content.

Campaign Details:
- Type: ${campaignType}
- Target Audience: ${JSON.stringify(targetAudience)}
- Objectives: ${objectives.join(", ")}

Content Requirements:
1. Engaging headlines (3 variations)
2. Body content (social media, email, push notifications)
3. Call-to-action phrases (compelling, action-oriented)
4. Visual content suggestions
5. A/B testing variations

Generate content for:
- Social media posts (Instagram, Facebook, Twitter)
- Email campaigns
- Push notifications
- WhatsApp messages
- Website banners

Format as JSON with: headlines, socialMedia, email, pushNotifications, whatsapp, banners, cta, visuals

Use Indian context, food culture, and TiffinWale's brand voice. Include emojis and local language touches.
`;

      return await this.generateResponse({
        prompt,
        cacheKey,
        cacheTTL: 1800, // 30 minutes
      });
    } catch (error) {
      this.logger.error("Failed to generate marketing content:", error);
      throw error;
    }
  }

  /**
   * Track AI usage analytics
   */
  private async trackAIUsage(
    operation: string,
    inputTokens: number,
    outputTokens: number,
  ): Promise<void> {
    try {
      const date = new Date().toISOString().split("T")[0];

      // Track daily usage
      await this.redisService.increment(`ai_usage:daily:${date}:requests`, 1);
      await this.redisService.increment(
        `ai_usage:daily:${date}:input_tokens`,
        inputTokens,
      );
      await this.redisService.increment(
        `ai_usage:daily:${date}:output_tokens`,
        outputTokens,
      );

      // Track by operation
      await this.redisService.increment(
        `ai_usage:operation:${operation}:requests`,
        1,
      );
      await this.redisService.increment(
        `ai_usage:operation:${operation}:input_tokens`,
        inputTokens,
      );
      await this.redisService.increment(
        `ai_usage:operation:${operation}:output_tokens`,
        outputTokens,
      );

      this.logger.log(
        `AI usage tracked: ${operation} - ${inputTokens + outputTokens} tokens`,
      );
    } catch (error) {
      this.logger.error("Failed to track AI usage:", error);
    }
  }

  /**
   * Get AI usage statistics
   */
  async getAIUsageStats(): Promise<any> {
    try {
      const date = new Date().toISOString().split("T")[0];

      const dailyRequests =
        (await this.redisService.get(`ai_usage:daily:${date}:requests`)) || 0;
      const dailyInputTokens =
        (await this.redisService.get(`ai_usage:daily:${date}:input_tokens`)) ||
        0;
      const dailyOutputTokens =
        (await this.redisService.get(`ai_usage:daily:${date}:output_tokens`)) ||
        0;

      return {
        date,
        requests: parseInt(dailyRequests.toString()),
        inputTokens: parseInt(dailyInputTokens.toString()),
        outputTokens: parseInt(dailyOutputTokens.toString()),
        totalTokens:
          parseInt(dailyInputTokens.toString()) +
          parseInt(dailyOutputTokens.toString()),
        estimatedCost: this.calculateEstimatedCost(
          parseInt(dailyInputTokens.toString()),
          parseInt(dailyOutputTokens.toString()),
        ),
      };
    } catch (error) {
      this.logger.error("Failed to get AI usage stats:", error);
      return { error: "Failed to retrieve stats" };
    }
  }

  /**
   * Calculate estimated API cost
   */
  private calculateEstimatedCost(
    inputTokens: number,
    outputTokens: number,
  ): number {
    // Gemini 1.5 Flash pricing (approximate)
    const inputCostPer1K = 0.000075; // $0.000075 per 1K input tokens
    const outputCostPer1K = 0.0003; // $0.0003 per 1K output tokens

    const inputCost = (inputTokens / 1000) * inputCostPer1K;
    const outputCost = (outputTokens / 1000) * outputCostPer1K;

    return parseFloat((inputCost + outputCost).toFixed(6));
  }

  /**
   * Health check for AI service
   */
  async healthCheck(): Promise<any> {
    try {
      const testResponse = await this.generateResponse({
        prompt: 'Respond with "OK" if you can understand this message.',
        cacheKey: "health_check",
        cacheTTL: 60,
      });

      return {
        status: "healthy",
        model: "gemini-1.5-flash",
        responseTime: new Date().toISOString(),
        testResponse: testResponse.text.trim(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
