import { StreamConfig } from 'motia'
import { z } from 'zod'

// Notification stream schema matching NestJS notification structure
export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userType: z.enum(['student', 'partner', 'admin']),
  type: z.enum(['order_status', 'general', 'promotion', 'system']),
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).optional(),
  read: z.boolean().default(false),
  timestamp: z.string(),
  expiresAt: z.string().optional(),
})

export type Notification = z.infer<typeof notificationSchema>

export const config: StreamConfig = {
  name: 'notifications',
  schema: notificationSchema,
  baseConfig: { storageType: 'default' },
}


