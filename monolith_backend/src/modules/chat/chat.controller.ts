import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import {
  ChatService,
  CreateConversationDto,
  SendMessageDto,
  UpdateMessageStatusDto,
} from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { Conversation } from "./schemas/conversation.schema";
import { ChatMessage } from "./schemas/chat-message.schema";
import { TypingIndicator } from "./schemas/typing-indicator.schema";

@ApiTags("chat")
@Controller("chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Conversation Endpoints
  @Post("conversations")
  @ApiOperation({ summary: "Create a new conversation" })
  @ApiBody({ type: CreateConversationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Conversation created successfully",
    type: Conversation,
  })
  async createConversation(
    @GetCurrentUser("_id") userId: string,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return await this.chatService.createConversation(
      userId,
      createConversationDto,
    );
  }

  @Get("conversations")
  @ApiOperation({ summary: "Get all conversations for the current user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns all conversations for the user",
    type: [Conversation],
  })
  async getConversations(
    @GetCurrentUser("_id") userId: string,
  ): Promise<Conversation[]> {
    return await this.chatService.getConversations(userId);
  }

  @Get("conversations/:id")
  @ApiOperation({ summary: "Get conversation by ID" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the conversation",
    type: Conversation,
  })
  async getConversationById(
    @GetCurrentUser("_id") userId: string,
    @Param("id") conversationId: string,
  ): Promise<Conversation> {
    return await this.chatService.getConversationById(conversationId, userId);
  }

  // Message Endpoints
  @Post("messages")
  @ApiOperation({ summary: "Send a new message" })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Message sent successfully",
    type: ChatMessage,
  })
  async sendMessage(
    @GetCurrentUser("_id") userId: string,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ChatMessage> {
    return await this.chatService.sendMessage(userId, sendMessageDto);
  }

  @Get("conversations/:id/messages")
  @ApiOperation({ summary: "Get messages for a conversation" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Messages per page",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns messages for the conversation",
    type: [ChatMessage],
  })
  async getMessages(
    @GetCurrentUser("_id") userId: string,
    @Param("id") conversationId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 50,
  ): Promise<ChatMessage[]> {
    return await this.chatService.getMessages(
      conversationId,
      userId,
      page,
      limit,
    );
  }

  @Put("messages/read")
  @ApiOperation({ summary: "Mark messages as read" })
  @ApiBody({ type: UpdateMessageStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Messages marked as read successfully",
  })
  async markMessagesAsRead(
    @GetCurrentUser("_id") userId: string,
    @Body() updateMessageStatusDto: UpdateMessageStatusDto,
  ): Promise<void> {
    const { messageIds } = updateMessageStatusDto;
    // Get conversation ID from first message
    const firstMessage = await this.chatService.getMessages("", userId, 1, 1);
    if (firstMessage.length > 0) {
      await this.chatService.markMessagesAsRead(
        firstMessage[0].conversationId,
        userId,
        messageIds,
      );
    }
  }

  @Delete("messages/:id")
  @ApiOperation({ summary: "Delete a message" })
  @ApiParam({ name: "id", description: "Message ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message deleted successfully",
  })
  async deleteMessage(
    @GetCurrentUser("_id") userId: string,
    @Param("id") messageId: string,
  ): Promise<void> {
    await this.chatService.deleteMessage(messageId, userId);
  }

  @Put("messages/:id")
  @ApiOperation({ summary: "Edit a message" })
  @ApiParam({ name: "id", description: "Message ID" })
  @ApiBody({
    schema: { type: "object", properties: { content: { type: "string" } } },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message edited successfully",
    type: ChatMessage,
  })
  async editMessage(
    @GetCurrentUser("_id") userId: string,
    @Param("id") messageId: string,
    @Body("content") newContent: string,
  ): Promise<ChatMessage> {
    return await this.chatService.editMessage(messageId, userId, newContent);
  }

  // Typing Indicators
  @Post("typing")
  @ApiOperation({ summary: "Set typing indicator" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        conversationId: { type: "string" },
        isTyping: { type: "boolean" },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Typing indicator set successfully",
  })
  async setTypingIndicator(
    @GetCurrentUser("_id") userId: string,
    @Body("conversationId") conversationId: string,
    @Body("isTyping") isTyping: boolean,
  ): Promise<void> {
    await this.chatService.setTypingIndicator(conversationId, userId, isTyping);
  }

  @Get("conversations/:id/typing")
  @ApiOperation({ summary: "Get typing indicators for a conversation" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns typing indicators",
    type: [TypingIndicator],
  })
  async getTypingIndicators(
    @Param("id") conversationId: string,
  ): Promise<TypingIndicator[]> {
    return await this.chatService.getTypingIndicators(conversationId);
  }

  // Offline Support
  @Get("offline/messages")
  @ApiOperation({ summary: "Get offline messages for sync" })
  @ApiQuery({
    name: "lastSyncTime",
    required: true,
    description: "Last sync timestamp",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns offline messages",
    type: [ChatMessage],
  })
  async getOfflineMessages(
    @GetCurrentUser("_id") userId: string,
    @Query("lastSyncTime") lastSyncTime: string,
  ): Promise<ChatMessage[]> {
    const syncTime = new Date(lastSyncTime);
    return await this.chatService.getOfflineMessages(userId, syncTime);
  }

  @Post("offline/sync")
  @ApiOperation({ summary: "Sync offline messages" })
  @ApiBody({ type: [ChatMessage] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Messages synced successfully",
    type: [ChatMessage],
  })
  async syncOfflineMessages(
    @GetCurrentUser("_id") userId: string,
    @Body() messages: Partial<ChatMessage>[],
  ): Promise<ChatMessage[]> {
    return await this.chatService.syncOfflineMessages(messages);
  }

  // Analytics
  @Get("conversations/:id/stats")
  @ApiOperation({ summary: "Get conversation statistics" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns conversation statistics",
    schema: {
      type: "object",
      properties: {
        totalMessages: { type: "number" },
        unreadCount: { type: "number" },
        lastActivity: { type: "string", format: "date-time" },
        participants: { type: "number" },
      },
    },
  })
  async getConversationStats(@Param("id") conversationId: string) {
    return await this.chatService.getConversationStats(conversationId);
  }
}
