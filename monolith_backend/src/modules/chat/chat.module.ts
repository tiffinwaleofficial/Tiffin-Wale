import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./gateways/chat.gateway";
import {
  Conversation,
  ConversationSchema,
} from "./schemas/conversation.schema";
import { ChatMessage, ChatMessageSchema } from "./schemas/chat-message.schema";
import {
  TypingIndicator,
  TypingIndicatorSchema,
} from "./schemas/typing-indicator.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: TypingIndicator.name, schema: TypingIndicatorSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}






