import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { chatMessageSchema } from '../../streams/chat-messages.stream'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'SendChatMessage',
  method: 'POST',
  path: '/chat/send-message',
  bodySchema: z.object({
    conversationId: z.string(),
    userId: z.string(),
    userType: z.enum(['student', 'partner', 'admin']),
    content: z.string(),
    messageType: z.enum(['text', 'image', 'file', 'audio', 'video']).default('text'),
    mediaUrl: z.string().optional(),
    mediaThumbnail: z.string().optional(),
    mediaSize: z.number().optional(),
    mediaDuration: z.number().optional(),
    replyTo: z.string().optional(),
  }),
  emits: ['chat_message_sent'],
  responseSchema: {
    201: chatMessageSchema
  }
}

export const handler: ApiRouteHandler<any, any, any> = async (req: any, context: any) => {
  const { streams, emit } = context
  const { 
    conversationId, 
    userId, 
    userType, 
    content, 
    messageType, 
    mediaUrl, 
    mediaThumbnail, 
    mediaSize, 
    mediaDuration, 
    replyTo 
  } = req.body

  // Create chat message in Motia stream
  const messageId = crypto.randomUUID()
  const chatMessage = await streams.chatMessages.set(conversationId, messageId, {
    id: messageId,
    conversationId,
    userId,
    userType,
    content,
    messageType,
    mediaUrl,
    mediaThumbnail,
    mediaSize,
    mediaDuration,
    replyTo,
    timestamp: new Date().toISOString(),
    read: false,
  })

  // Emit event to trigger NestJS WebSocket broadcast
  await emit({
    topic: 'chat_message_sent',
    data: {
      chatMessage,
      conversationId,
      targetUsers: [userId], // Will be expanded by NestJS based on conversation participants
    }
  })

  return { status: 201, body: chatMessage }
}


