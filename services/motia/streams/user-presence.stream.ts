import { StreamConfig } from 'motia'
import { z } from 'zod'

// User presence stream for online/offline status
export const userPresenceSchema = z.object({
  userId: z.string(),
  userType: z.enum(['student', 'partner', 'admin']),
  status: z.enum(['online', 'offline', 'away', 'busy']),
  lastSeen: z.string(),
  deviceInfo: z.object({
    platform: z.string().optional(),
    userAgent: z.string().optional(),
  }).optional(),
})

export type UserPresence = z.infer<typeof userPresenceSchema>

export const config: StreamConfig = {
  name: 'userPresence',
  schema: userPresenceSchema,
  baseConfig: { storageType: 'default' },
}


