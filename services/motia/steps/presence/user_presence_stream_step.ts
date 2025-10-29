import { EventConfig, EventHandler } from 'motia'
import { z } from 'zod'
import { userPresenceSchema } from '../../streams/user-presence.stream'

export const config: EventConfig = {
  type: 'event',
  name: 'UserPresenceUpdateStream',
  emits: ['user_presence_updated'],
  subscribes: ['user_connected', 'user_disconnected', 'user_status_changed'],
  input: z.object({
    userId: z.string(),
    userType: z.enum(['student', 'partner', 'admin']),
    status: z.enum(['online', 'offline', 'away', 'busy']),
    deviceInfo: z.object({
      platform: z.string().optional(),
      userAgent: z.string().optional(),
    }).optional(),
  }),
}

export const handler: EventHandler<any, any> = async (event: any, context: any) => {
  const { streams, emit } = context
  const { userId, userType, status, deviceInfo } = event.data

  // Update user presence in Motia stream
  const userPresence = await streams.userPresence.set('online_users', userId, {
    userId,
    userType,
    status,
    lastSeen: new Date().toISOString(),
    deviceInfo,
  })

  // Emit event to trigger NestJS WebSocket broadcast
  await emit({
    topic: 'user_presence_updated',
    data: {
      userPresence,
      broadcastType: 'presence_update',
      targetUsers: 'all', // Broadcast to all connected users
    }
  })
}


