import { StreamConfig } from 'motia'
import { z } from 'zod'

// Chat message stream schema for real-time chat
export const chatMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  userType: z.enum(['student', 'partner', 'admin']),
  content: z.string(),
  messageType: z.enum(['text', 'image', 'file', 'audio', 'video']),
  mediaUrl: z.string().optional(),
  mediaThumbnail: z.string().optional(),
  mediaSize: z.number().optional(),
  mediaDuration: z.number().optional(),
  replyTo: z.string().optional(),
  timestamp: z.string(),
  read: z.boolean().default(false),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

export const config: StreamConfig = {
  name: 'chatMessages',
  schema: chatMessageSchema,
  baseConfig: { storageType: 'default' },
}


