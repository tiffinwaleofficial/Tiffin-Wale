import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import { BaseSeederPhase } from "./base.phase";
import { SeederConfig } from "../interfaces/seeder-phase.interface";
import { PerformanceMonitor } from "../utils/performance-monitor";
import { ImageUrlGenerator } from "../config/image-sources";

// Import schemas
import {
  Conversation,
  ConversationType,
  ParticipantType,
} from "../../chat/schemas/conversation.schema";
import {
  ChatMessage,
  MessageType,
  MessageStatus,
} from "../../chat/schemas/chat-message.schema";
import { TypingIndicator } from "../../chat/schemas/typing-indicator.schema";
import { UserRole } from "../../../common/interfaces/user.interface";

@Injectable()
export class CommunicationPhase extends BaseSeederPhase {
  name = "communication";
  description =
    "Chat conversations, messages, notifications, and real-time communication";
  dependencies = ["core", "partner"];
  collections = ["conversations", "chatmessages", "typingindicators"];

  private conversations: Conversation[] = [];
  private chatMessages: ChatMessage[] = [];
  private typingIndicators: TypingIndicator[] = [];

  constructor(
    models: Record<string, Model<any>>,
    performanceMonitor: PerformanceMonitor,
    imageGenerator: ImageUrlGenerator,
  ) {
    super(models, performanceMonitor, imageGenerator);
  }

  protected async seedData(
    config: SeederConfig,
  ): Promise<Record<string, number>> {
    const volumes = config.volumes;

    // Get users and partners from previous phases
    const users = await this.models.users.find();
    const partners = await this.models.partners.find();

    if (users.length === 0) {
      throw new Error("No users found. Core phase must be run first.");
    }

    // Seed conversations
    await this.seedConversations(
      users,
      partners,
      volumes.conversations,
      config,
    );

    // Seed chat messages
    await this.seedChatMessages(users, volumes.messagesPerConversation);

    // Seed typing indicators (current active typing)
    await this.seedTypingIndicators(users);

    return {
      conversations: this.conversations.length,
      chatmessages: this.chatMessages.length,
      typingindicators: this.typingIndicators.length,
    };
  }

  private async seedConversations(
    users: any[],
    partners: any[],
    conversationCount: number,
    config: SeederConfig,
  ): Promise<void> {
    this.logger.log("💬 Seeding conversations...");

    const conversationsToCreate = [];
    const customerUsers = users.filter((u) => u.role === UserRole.CUSTOMER);
    const adminUsers = users.filter(
      (u) => u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN,
    );
    const businessUsers = users.filter((u) => u.role === UserRole.PARTNER);

    // Create different types of conversations
    const conversationTypes = [
      { type: ConversationType.SUPPORT, weight: 4 },
      { type: ConversationType.RESTAURANT, weight: 5 },
      { type: ConversationType.GROUP_ORDER, weight: 1 },
    ];

    for (let i = 0; i < conversationCount; i++) {
      const conversationType = faker.helpers.weightedArrayElement(
        conversationTypes.map((ct) => ({ weight: ct.weight, value: ct.type })),
      );

      let participants: any[] = [];
      let metadata: any = {};

      switch (conversationType) {
        case ConversationType.SUPPORT:
          // Customer + Admin support conversation
          const customer = this.getRandomElement(customerUsers);
          const admin = this.getRandomElement(adminUsers);

          participants = [
            {
              userId: customer._id,
              type: ParticipantType.USER,
              name: `${customer.firstName} ${customer.lastName}`,
              avatar: customer.profileImage,
              isOnline: faker.datatype.boolean(0.3),
              lastSeen: this.generateRealisticDate({ past: true, days: 7 }),
              joinedAt: this.generateRealisticDate({ past: true, days: 30 }),
            },
            {
              userId: admin._id,
              type: ParticipantType.ADMIN,
              name: `${admin.firstName} ${admin.lastName}`,
              avatar: admin.profileImage,
              isOnline: faker.datatype.boolean(0.6),
              lastSeen: this.generateRealisticDate({ past: true, days: 1 }),
              joinedAt: this.generateRealisticDate({ past: true, days: 30 }),
            },
          ];

          metadata = {
            supportTicketId: faker.string.alphanumeric(8),
            priority: faker.helpers.arrayElement(["low", "medium", "high"]),
            category: faker.helpers.arrayElement([
              "order_issue",
              "payment",
              "delivery",
              "account",
              "general",
            ]),
          };
          break;

        case ConversationType.RESTAURANT:
          // Customer + Restaurant conversation
          const restaurantCustomer = this.getRandomElement(customerUsers);
          const restaurant = this.getRandomElement(businessUsers);

          participants = [
            {
              userId: restaurantCustomer._id,
              type: ParticipantType.USER,
              name: `${restaurantCustomer.firstName} ${restaurantCustomer.lastName}`,
              avatar: restaurantCustomer.profileImage,
              isOnline: faker.datatype.boolean(0.4),
              lastSeen: this.generateRealisticDate({ past: true, days: 3 }),
              joinedAt: this.generateRealisticDate({ past: true, days: 60 }),
            },
            {
              userId: restaurant._id,
              type: ParticipantType.RESTAURANT,
              name:
                partners.find(
                  (p) => p.user.toString() === restaurant._id.toString(),
                )?.businessName || "Restaurant",
              avatar: partners.find(
                (p) => p.user.toString() === restaurant._id.toString(),
              )?.logo,
              isOnline: faker.datatype.boolean(0.7),
              lastSeen: this.generateRealisticDate({ past: true, days: 1 }),
              joinedAt: this.generateRealisticDate({ past: true, days: 60 }),
            },
          ];

          metadata = {
            restaurantId: partners.find(
              (p) => p.user.toString() === restaurant._id.toString(),
            )?._id,
            orderId: faker.helpers.maybe(() => faker.string.alphanumeric(12), {
              probability: 0.6,
            }),
          };
          break;

        case ConversationType.GROUP_ORDER:
          // Multiple customers group order conversation
          const groupSize = faker.number.int({ min: 3, max: 6 });
          const groupCustomers = this.getRandomElements(
            customerUsers,
            groupSize,
          );

          participants = groupCustomers.map((customer) => ({
            userId: customer._id,
            type: ParticipantType.USER,
            name: `${customer.firstName} ${customer.lastName}`,
            avatar: customer.profileImage,
            isOnline: faker.datatype.boolean(0.5),
            lastSeen: this.generateRealisticDate({ past: true, days: 2 }),
            joinedAt: this.generateRealisticDate({ past: true, days: 14 }),
          }));

          metadata = {
            groupName: `${faker.helpers.arrayElement(["Office", "College", "Friends", "Family"])} Group Order`,
            groupOrderId: faker.string.alphanumeric(10),
            targetDeliveryTime: faker.date.future({ years: 0.003 }), // ~1 day
          };
          break;
      }

      const conversation = {
        type: conversationType,
        participants,
        lastMessage: null, // Will be set after creating messages
        unreadCount: faker.number.int({ min: 0, max: 5 }),
        isActive: faker.datatype.boolean(0.8),
        metadata,
        lastActivityAt: this.generateRealisticDate({ past: true, days: 7 }),
        createdAt: this.generateRealisticDate({ past: true, days: 30 }),
        updatedAt: this.generateRealisticDate({ past: true, days: 1 }),
      };

      conversationsToCreate.push(conversation);
      this.logProgress(i + 1, conversationCount, "Conversations");
    }

    this.conversations = (await this.insertMany(
      this.models.conversations,
      conversationsToCreate,
      "conversations",
    )) as Conversation[];

    this.logConversationDistribution();
  }

  private async seedChatMessages(
    users: any[],
    messagesPerConversation: { min: number; max: number },
  ): Promise<void> {
    this.logger.log("💬 Seeding chat messages...");

    const messagesToCreate = [];
    let totalMessages = 0;

    for (const conversation of this.conversations) {
      const messageCount = faker.number.int(messagesPerConversation);
      const participants = conversation.participants;

      // Generate conversation flow
      for (let i = 0; i < messageCount; i++) {
        const sender = this.getRandomElement(participants);
        const messageType = faker.helpers.weightedArrayElement([
          { weight: 8, value: MessageType.TEXT },
          { weight: 1, value: MessageType.IMAGE },
          { weight: 0.5, value: MessageType.FILE },
          { weight: 0.5, value: MessageType.SYSTEM },
        ]);

        const message = {
          conversationId: (conversation as any)._id,
          senderId: sender.userId,
          senderName: sender.name,
          messageType,
          content: this.generateMessageContent(
            messageType,
            conversation.type,
            i === 0,
          ),
          mediaUrl: this.generateMediaUrl(messageType),
          mediaThumbnail:
            messageType === MessageType.IMAGE
              ? this.generateMediaUrl(MessageType.IMAGE)
              : undefined,
          mediaSize:
            messageType !== MessageType.TEXT
              ? faker.number.int({ min: 1024, max: 5242880 })
              : undefined,
          replyTo: faker.helpers.maybe(
            () =>
              messagesToCreate[
                messagesToCreate.length - faker.number.int({ min: 1, max: 3 })
              ]?._id,
            { probability: 0.15 },
          ),
          status: faker.helpers.weightedArrayElement([
            { weight: 7, value: MessageStatus.READ },
            { weight: 2, value: MessageStatus.DELIVERED },
            { weight: 1, value: MessageStatus.SENT },
          ]),
          readBy: this.generateReadByList(participants, sender),
          readAt: faker.helpers.maybe(
            () => this.generateRealisticDate({ past: true, days: 7 }),
            { probability: 0.8 },
          ),
          isDeleted: faker.datatype.boolean(0.05),
          deletedAt: faker.helpers.maybe(
            () => this.generateRealisticDate({ past: true, days: 3 }),
            { probability: 0.05 },
          ),
          isEdited: faker.datatype.boolean(0.1),
          editedAt: faker.helpers.maybe(
            () => this.generateRealisticDate({ past: true, days: 5 }),
            { probability: 0.1 },
          ),
          createdAt: this.generateRealisticDate({ past: true, days: 30 }),
          updatedAt: this.generateRealisticDate({ past: true, days: 1 }),
        };

        messagesToCreate.push(message);
        totalMessages++;
      }

      this.logProgress(
        totalMessages,
        this.conversations.length * 15,
        "Chat messages",
      );
    }

    this.chatMessages = (await this.insertMany(
      this.models.chatmessages,
      messagesToCreate,
      "chat messages",
    )) as ChatMessage[];

    // Update conversations with last message
    await this.updateConversationsWithLastMessage();
  }

  private generateMessageContent(
    messageType: MessageType,
    conversationType: ConversationType,
    isFirstMessage: boolean,
  ): string {
    if (messageType === MessageType.SYSTEM) {
      return faker.helpers.arrayElement([
        "User joined the conversation",
        "User left the conversation",
        "Order status updated",
        "Payment confirmed",
        "Delivery scheduled",
      ]);
    }

    if (messageType === MessageType.IMAGE) {
      return "Shared an image";
    }

    if (messageType === MessageType.FILE) {
      return "Shared a file";
    }

    // Generate contextual text messages
    const messageTemplates = this.getMessageTemplates(
      conversationType,
      isFirstMessage,
    );
    return this.getRandomElement(messageTemplates);
  }

  private getMessageTemplates(
    conversationType: ConversationType,
    isFirstMessage: boolean,
  ): string[] {
    const commonResponses = [
      "Thank you!",
      "Sure, no problem",
      "Okay",
      "Got it",
      "Thanks for the update",
      "Perfect!",
      "Sounds good",
      "Will do",
      "Understood",
      "Great!",
    ];

    if (conversationType === ConversationType.SUPPORT) {
      if (isFirstMessage) {
        return [
          "Hi, I need help with my recent order",
          "Hello, I have a payment issue",
          "Hi, my delivery was delayed",
          "I need to cancel my subscription",
          "Having trouble with my account login",
        ];
      }
      return [
        ...commonResponses,
        "Can you help me with this?",
        "When will this be resolved?",
        "I need a refund for this",
        "This is urgent, please help",
        "Thank you for your assistance",
      ];
    }

    if (conversationType === ConversationType.RESTAURANT) {
      if (isFirstMessage) {
        return [
          "Hi, I want to place an order",
          "Hello, is this item available?",
          "Can you make it less spicy?",
          "What time will my order be ready?",
          "Do you have any special offers today?",
        ];
      }
      return [
        ...commonResponses,
        "Can you add extra rice?",
        "Make it medium spicy please",
        "What are your delivery charges?",
        "How long will it take?",
        "Can I get this without onions?",
      ];
    }

    if (conversationType === ConversationType.GROUP_ORDER) {
      if (isFirstMessage) {
        return [
          "Hey everyone, let's order lunch together!",
          "Who wants to join the group order?",
          "Shall we order from the usual place?",
          "Group order for today's dinner?",
        ];
      }
      return [
        ...commonResponses,
        "I want the same as last time",
        "Add me to the order",
        "Can we order from somewhere else?",
        "I'll pay my share now",
        "Count me in!",
      ];
    }

    return commonResponses;
  }

  private generateMediaUrl(messageType: MessageType): string | undefined {
    switch (messageType) {
      case MessageType.IMAGE:
        return this.imageGenerator.generateFoodImage("food");
      case MessageType.FILE:
        return `https://example.com/files/${faker.string.alphanumeric(12)}.pdf`;
      default:
        return undefined;
    }
  }

  private generateReadByList(participants: any[], sender: any): string[] {
    const others = participants.filter((p) => p.userId !== sender.userId);
    const readCount = faker.number.int({ min: 0, max: others.length });
    return this.getRandomElements(others, readCount).map((p) => p.userId);
  }

  private async updateConversationsWithLastMessage(): Promise<void> {
    for (const conversation of this.conversations) {
      const lastMessage = this.chatMessages
        .filter(
          (m) =>
            m.conversationId.toString() ===
            (conversation as any)._id.toString(),
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

      if (lastMessage) {
        await this.models.conversations.findByIdAndUpdate(
          (conversation as any)._id,
          {
            lastMessage: (lastMessage as any)._id,
            lastActivityAt: lastMessage.createdAt,
          },
        );
      }
    }
  }

  private async seedTypingIndicators(users: any[]): Promise<void> {
    this.logger.log("⌨️ Seeding typing indicators...");

    const indicatorsToCreate = [];

    // Create some active typing indicators (5-10% of conversations)
    const activeConversations = this.getRandomElements(
      this.conversations.filter((c) => c.isActive),
      Math.ceil(this.conversations.length * 0.1),
    );

    for (const conversation of activeConversations) {
      const typingUser = this.getRandomElement(conversation.participants);

      indicatorsToCreate.push({
        conversationId: (conversation as any)._id,
        userId: typingUser.userId,
        userName: typingUser.name,
        isTyping: true,
        lastTypingAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    this.typingIndicators = (await this.insertMany(
      this.models.typingindicators,
      indicatorsToCreate,
      "typing indicators",
    )) as TypingIndicator[];
  }

  private logConversationDistribution(): void {
    const typeDistribution = this.conversations.reduce(
      (acc, conv) => {
        acc[conv.type] = (acc[conv.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const activeCount = this.conversations.filter((c) => c.isActive).length;

    this.logger.log("📊 Conversation distribution:");
    this.logger.log(`   Types: ${JSON.stringify(typeDistribution)}`);
    this.logger.log(`   Active: ${activeCount}/${this.conversations.length}`);
  }

  protected async validatePhaseData(
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    // Validate conversations
    const conversationCount = await this.models.conversations.countDocuments();
    if (conversationCount === 0) {
      errors.push("No conversations created");
      return;
    }

    // Check participant references
    const conversationsWithInvalidParticipants =
      await this.models.conversations.countDocuments({
        "participants.userId": { $exists: false },
      });
    if (conversationsWithInvalidParticipants > 0) {
      errors.push(
        `${conversationsWithInvalidParticipants} conversations with invalid participant references`,
      );
    }

    // Validate messages
    const messageCount = await this.models.chatmessages.countDocuments();
    if (messageCount === 0) {
      warnings.push("No chat messages created");
    }

    // Check message-conversation relationships
    const orphanedMessages = await this.models.chatmessages.countDocuments({
      conversationId: { $nin: this.conversations.map((c) => (c as any)._id) },
    });
    if (orphanedMessages > 0) {
      errors.push(`${orphanedMessages} orphaned chat messages found`);
    }

    // Check typing indicators
    const typingCount = await this.models.typingindicators.countDocuments();
    if (typingCount === 0) {
      warnings.push("No typing indicators created");
    }
  }

  // Getter methods for other phases
  getConversations(): Conversation[] {
    return [...this.conversations];
  }

  getChatMessages(): ChatMessage[] {
    return [...this.chatMessages];
  }

  getConversationsByType(type: ConversationType): Conversation[] {
    return this.conversations.filter((conv) => conv.type === type);
  }

  getMessagesByConversation(conversationId: string): ChatMessage[] {
    return this.chatMessages.filter(
      (msg) => msg.conversationId.toString() === conversationId,
    );
  }
}
