import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Conversation,
  ConversationDocument,
  ConversationType,
  ParticipantType,
} from "./schemas/conversation.schema";
import {
  ChatMessage,
  ChatMessageDocument,
  MessageType,
  MessageStatus,
} from "./schemas/chat-message.schema";
import {
  TypingIndicator,
  TypingIndicatorDocument,
} from "./schemas/typing-indicator.schema";

export class CreateConversationDto {
  type: ConversationType;
  participants: string[];
  metadata?: Record<string, any>;
}

export class SendMessageDto {
  conversationId: string;
  content: string;
  messageType: MessageType;
  mediaUrl?: string;
  mediaThumbnail?: string;
  mediaSize?: number;
  mediaDuration?: number;
  replyTo?: string;
  metadata?: Record<string, any>;
}

export class UpdateMessageStatusDto {
  messageIds: string[];
  status: MessageStatus;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(ChatMessage.name)
    private messageModel: Model<ChatMessageDocument>,
    @InjectModel(TypingIndicator.name)
    private typingModel: Model<TypingIndicatorDocument>,
  ) {}

  // Conversation Management
  async createConversation(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { type, participants, metadata } = createConversationDto;

    // Add current user to participants
    const allParticipants = [userId, ...participants];
    const uniqueParticipants = [...new Set(allParticipants)];

    // Create participant objects
    const participantObjects = await Promise.all(
      uniqueParticipants.map(async (participantId) => {
        // Get user details (you might want to fetch from User service)
        const userDetails = await this.getUserDetails(participantId);
        return {
          userId: participantId,
          type: this.getParticipantType(participantId, type),
          name: userDetails.name,
          avatar: userDetails.avatar,
          isOnline: false,
          joinedAt: new Date(),
        };
      }),
    );

    const conversation = new this.conversationModel({
      type,
      participants: participantObjects,
      metadata,
      isActive: true,
      lastActivityAt: new Date(),
    });

    return await conversation.save();
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return await this.conversationModel
      .find({
        "participants.userId": userId,
        isActive: true,
      })
      .populate("lastMessage")
      .sort({ lastActivityAt: -1 })
      .exec();
  }

  async getConversationById(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findOne({
        _id: conversationId,
        "participants.userId": userId,
        isActive: true,
      })
      .populate("lastMessage")
      .exec();

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    return conversation;
  }

  // Message Management
  async sendMessage(
    userId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<ChatMessage> {
    const {
      conversationId,
      content,
      messageType,
      mediaUrl,
      mediaThumbnail,
      mediaSize,
      mediaDuration,
      replyTo,
      metadata,
    } = sendMessageDto;

    // Verify conversation exists and user is participant
    const conversation = await this.getConversationById(conversationId, userId);
    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    // Get sender details
    const senderDetails = await this.getUserDetails(userId);

    const message = new this.messageModel({
      conversationId,
      senderId: userId,
      senderName: senderDetails.name,
      messageType,
      content,
      mediaUrl,
      mediaThumbnail,
      mediaSize,
      mediaDuration,
      replyTo,
      metadata,
      status: MessageStatus.SENT,
      readBy: [userId], // Sender has read their own message
    });

    const savedMessage = await message.save();

    // Update conversation last message and activity
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: savedMessage._id,
      lastActivityAt: new Date(),
      $inc: { unreadCount: 1 },
    });

    return savedMessage;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<ChatMessage[]> {
    // Verify user has access to conversation
    await this.getConversationById(conversationId, userId);

    const skip = (page - 1) * limit;

    return await this.messageModel
      .find({
        conversationId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("replyTo")
      .exec();
  }

  async markMessagesAsRead(
    conversationId: string,
    userId: string,
    messageIds: string[],
  ): Promise<void> {
    // Verify user has access to conversation
    await this.getConversationById(conversationId, userId);

    // Update messages as read
    await this.messageModel.updateMany(
      {
        _id: { $in: messageIds },
        senderId: { $ne: userId }, // Don't mark own messages as read
        readBy: { $nin: [userId] }, // Only if not already read by user
      },
      {
        $addToSet: { readBy: userId },
        $set: { status: MessageStatus.READ, readAt: new Date() },
      },
    );

    // Reset unread count for conversation
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      unreadCount: 0,
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messageModel.findOne({
      _id: messageId,
      senderId: userId,
    });

    if (!message) {
      throw new NotFoundException("Message not found or not authorized");
    }

    await this.messageModel.findByIdAndUpdate(messageId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  async editMessage(
    messageId: string,
    userId: string,
    newContent: string,
  ): Promise<ChatMessage> {
    const message = await this.messageModel.findOne({
      _id: messageId,
      senderId: userId,
      messageType: MessageType.TEXT, // Only text messages can be edited
    });

    if (!message) {
      throw new NotFoundException("Message not found or not editable");
    }

    return await this.messageModel.findByIdAndUpdate(
      messageId,
      {
        content: newContent,
        editedContent: message.content,
        isEdited: true,
        editedAt: new Date(),
      },
      { new: true },
    );
  }

  // Typing Indicators
  async setTypingIndicator(
    conversationId: string,
    userId: string,
    isTyping: boolean,
  ): Promise<void> {
    // Verify user has access to conversation
    await this.getConversationById(conversationId, userId);

    const userDetails = await this.getUserDetails(userId);

    await this.typingModel.findOneAndUpdate(
      { conversationId, userId },
      {
        conversationId,
        userId,
        userName: userDetails.name,
        isTyping,
        lastTypingAt: new Date(),
      },
      { upsert: true, new: true },
    );
  }

  async getTypingIndicators(
    conversationId: string,
  ): Promise<TypingIndicator[]> {
    return await this.typingModel
      .find({
        conversationId,
        isTyping: true,
        lastTypingAt: { $gte: new Date(Date.now() - 30000) }, // Last 30 seconds
      })
      .exec();
  }

  // Utility Methods
  private async getUserDetails(
    userId: string,
  ): Promise<{ name: string; avatar?: string }> {
    // This should integrate with your User service
    // For now, returning mock data
    return {
      name: `User ${userId}`,
      avatar: undefined,
    };
  }

  private getParticipantType(
    userId: string,
    conversationType: ConversationType,
  ): ParticipantType {
    // This should integrate with your User service to get actual user roles
    // For now, returning mock logic
    switch (conversationType) {
      case ConversationType.SUPPORT:
        return ParticipantType.USER;
      case ConversationType.RESTAURANT:
        return ParticipantType.USER;
      case ConversationType.GROUP_ORDER:
        return ParticipantType.USER;
      default:
        return ParticipantType.USER;
    }
  }

  // Offline Support Methods
  async getOfflineMessages(
    userId: string,
    lastSyncTime: Date,
  ): Promise<ChatMessage[]> {
    return await this.messageModel
      .find({
        "participants.userId": userId,
        createdAt: { $gt: lastSyncTime },
        isDeleted: false,
      })
      .populate("conversationId")
      .sort({ createdAt: 1 })
      .exec();
  }

  async syncOfflineMessages(
    messages: Partial<ChatMessage>[],
  ): Promise<ChatMessage[]> {
    const savedMessages: ChatMessage[] = [];

    for (const messageData of messages) {
      try {
        const message = new this.messageModel(messageData);
        const savedMessage = await message.save();
        savedMessages.push(savedMessage);
      } catch (error) {
        console.error("Error syncing offline message:", error);
      }
    }

    return savedMessages;
  }

  // Analytics
  async getConversationStats(conversationId: string): Promise<{
    totalMessages: number;
    unreadCount: number;
    lastActivity: Date;
    participants: number;
  }> {
    const conversation = await this.conversationModel.findById(conversationId);
    const messageCount = await this.messageModel.countDocuments({
      conversationId,
      isDeleted: false,
    });

    return {
      totalMessages: messageCount,
      unreadCount: conversation?.unreadCount || 0,
      lastActivity: conversation?.lastActivityAt || new Date(),
      participants: conversation?.participants.length || 0,
    };
  }
}
