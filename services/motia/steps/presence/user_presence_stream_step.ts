import { EventStepConfig, Handlers } from 'motia'
import { userPresenceSchema } from '../streams/user-presence.stream'

export const config: EventStepConfig = {
  type: 'event',
  name: 'UserPresenceUpdateStream',
  emits: ['user_presence_updated'],
  listens: ['user_connected', 'user_disconnected', 'user_status_changed'],
}

export const handler: Handlers.EventHandler = async (event, { streams, emit }) => {
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
  await emit('user_presence_updated', {
    userPresence,
    broadcastType: 'presence_update',
    targetUsers: 'all', // Broadcast to all connected users
  })

  return { success: true, userPresence }
}


