import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  FirebaseAIService,
  AIPromptRequest,
  MenuRecommendationRequest,
  OrderAnalysisRequest,
  NotificationOptimizationRequest,
} from "./firebase-ai.service";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("AI & Machine Learning")
@Controller("ai")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private readonly firebaseAIService: FirebaseAIService) {}

  @Post("generate")
  @ApiOperation({ summary: "Generate AI response using Gemini" })
  @ApiResponse({
    status: 201,
    description: "AI response generated successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string" },
        cached: { type: "boolean" },
        tokensUsed: { type: "number" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async generateResponse(@Body() request: AIPromptRequest) {
    return await this.firebaseAIService.generateResponse(request);
  }

  @Post("menu/recommendations")
  @ApiOperation({ summary: "Get AI-powered personalized menu recommendations" })
  @ApiResponse({
    status: 201,
    description: "Menu recommendations generated successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "JSON array of recommendations" },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async getMenuRecommendations(
    @Body() request: Omit<MenuRecommendationRequest, "userId">,
    @GetCurrentUser("_id") userId: string,
  ) {
    return await this.firebaseAIService.generateMenuRecommendations({
      ...request,
      userId,
    });
  }

  @Post("orders/:orderId/analysis")
  @ApiOperation({ summary: "AI analysis of order patterns and predictions" })
  @ApiResponse({
    status: 201,
    description: "Order analysis completed successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "JSON analysis results" },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async analyzeOrderPatterns(
    @Param("orderId") orderId: string,
    @Body() request: Omit<OrderAnalysisRequest, "orderId">,
  ) {
    return await this.firebaseAIService.analyzeOrderPatterns({
      ...request,
      orderId,
    });
  }

  @Post("notifications/optimize")
  @ApiOperation({
    summary: "AI optimization of notification content and timing",
  })
  @ApiResponse({
    status: 201,
    description: "Notification optimization completed successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "JSON optimization results" },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async optimizeNotification(
    @Body() request: Omit<NotificationOptimizationRequest, "userId">,
    @GetCurrentUser("_id") userId: string,
  ) {
    return await this.firebaseAIService.optimizeNotification({
      ...request,
      userId,
    });
  }

  @Post("pricing/strategy")
  @ApiOperation({ summary: "AI-powered dynamic pricing strategy for partners" })
  @ApiResponse({
    status: 201,
    description: "Pricing strategy generated successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "JSON pricing recommendations" },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async generatePricingStrategy(
    @Body() body: { partnerData: any; marketData: any },
  ) {
    return await this.firebaseAIService.generatePricingStrategy(
      body.partnerData,
      body.marketData,
    );
  }

  @Post("support/response")
  @ApiOperation({ summary: "AI-generated customer support responses" })
  @ApiResponse({
    status: 201,
    description: "Support response generated successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "JSON support response" },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async generateSupportResponse(
    @Body()
    body: {
      customerQuery: string;
      customerContext: any;
      orderContext?: any;
    },
  ) {
    return await this.firebaseAIService.generateSupportResponse(
      body.customerQuery,
      body.customerContext,
      body.orderContext,
    );
  }

  @Post("partners/:partnerId/analysis")
  @ApiOperation({
    summary: "AI analysis of partner performance and recommendations",
  })
  @ApiResponse({
    status: 201,
    description: "Partner analysis completed successfully",
    schema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "JSON analysis and recommendations",
        },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async analyzePartnerPerformance(
    @Param("partnerId") partnerId: string,
    @Body() partnerData: any,
  ) {
    return await this.firebaseAIService.analyzePartnerPerformance({
      ...partnerData,
      partnerId,
    });
  }

  @Post("marketing/content")
  @ApiOperation({ summary: "AI-generated marketing content for campaigns" })
  @ApiResponse({
    status: 201,
    description: "Marketing content generated successfully",
    schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "JSON marketing content" },
        cached: { type: "boolean" },
        model: { type: "string" },
        timestamp: { type: "string" },
      },
    },
  })
  async generateMarketingContent(
    @Body()
    body: {
      campaignType: string;
      targetAudience: any;
      objectives: string[];
    },
  ) {
    return await this.firebaseAIService.generateMarketingContent(
      body.campaignType,
      body.targetAudience,
      body.objectives,
    );
  }

  @Get("usage/stats")
  @ApiOperation({ summary: "Get AI usage statistics and costs" })
  @ApiResponse({
    status: 200,
    description: "AI usage statistics retrieved successfully",
    schema: {
      type: "object",
      properties: {
        date: { type: "string" },
        requests: { type: "number" },
        inputTokens: { type: "number" },
        outputTokens: { type: "number" },
        totalTokens: { type: "number" },
        estimatedCost: { type: "number" },
      },
    },
  })
  async getAIUsageStats() {
    return await this.firebaseAIService.getAIUsageStats();
  }

  @Get("health")
  @ApiOperation({ summary: "AI service health check" })
  @ApiResponse({
    status: 200,
    description: "AI service health status",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        model: { type: "string" },
        responseTime: { type: "string" },
        testResponse: { type: "string" },
      },
    },
  })
  async healthCheck() {
    return await this.firebaseAIService.healthCheck();
  }
}
