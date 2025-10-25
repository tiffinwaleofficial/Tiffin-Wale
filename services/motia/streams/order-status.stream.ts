import { StreamConfig } from 'motia'
import { z } from 'zod'

// Order status stream schema for real-time order updates
export const orderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
  userId: z.string(),
  partnerId: z.string(),
  timestamp: z.string(),
  message: z.string().optional(),
  estimatedTime: z.number().optional(), // minutes
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
})

export type OrderStatus = z.infer<typeof orderStatusSchema>

export const config: StreamConfig = {
  name: 'orderStatus',
  schema: orderStatusSchema,
  baseConfig: { storageType: 'default' },
}


