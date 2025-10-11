// Mock data for testing
export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student',
  avatar: 'https://example.com/avatar.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockRestaurant = {
  _id: '507f1f77bcf86cd799439012',
  name: 'Test Restaurant',
  description: 'A test restaurant',
  imageUrl: 'https://example.com/restaurant.jpg',
  rating: 4.5,
  deliveryTime: '30-45 min',
  deliveryFee: 2.99,
  isOpen: true,
  categories: ['Indian', 'Vegetarian'],
  location: {
    address: '123 Test Street',
    city: 'Test City',
    coordinates: [0, 0],
  },
};

export const mockOrder = {
  _id: '507f1f77bcf86cd799439013',
  userId: mockUser._id,
  restaurantId: mockRestaurant._id,
  items: [
    {
      menuItemId: '507f1f77bcf86cd799439014',
      name: 'Test Item',
      price: 12.99,
      quantity: 2,
      total: 25.98,
    },
  ],
  totalAmount: 28.97,
  deliveryFee: 2.99,
  status: 'pending',
  paymentStatus: 'pending',
  deliveryAddress: {
    street: '123 Test Street',
    city: 'Test City',
    zipCode: '12345',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockMenuItems = [
  {
    _id: '507f1f77bcf86cd799439014',
    name: 'Test Item 1',
    description: 'A test menu item',
    price: 12.99,
    imageUrl: 'https://example.com/item1.jpg',
    category: 'Main Course',
    isAvailable: true,
    nutritionalInfo: {
      calories: 450,
      protein: 20,
      carbs: 50,
      fat: 15,
    },
  },
  {
    _id: '507f1f77bcf86cd799439015',
    name: 'Test Item 2',
    description: 'Another test menu item',
    price: 8.99,
    imageUrl: 'https://example.com/item2.jpg',
    category: 'Appetizer',
    isAvailable: true,
    nutritionalInfo: {
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 8,
    },
  },
];

export const mockConversation = {
  id: '507f1f77bcf86cd799439016',
  type: 'support',
  participants: [
    {
      userId: mockUser._id,
      role: 'user',
      joinedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      userId: '507f1f77bcf86cd799439017',
      role: 'admin',
      joinedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  lastMessage: 'Hello, how can I help you?',
  lastActivityAt: '2024-01-01T00:00:00.000Z',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockMessage = {
  id: '507f1f77bcf86cd799439018',
  conversationId: mockConversation.id,
  senderId: mockUser._id,
  content: 'Hello, I need help with my order',
  messageType: 'text',
  status: 'sent',
  readBy: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockPayment = {
  _id: '507f1f77bcf86cd799439019',
  orderId: mockOrder._id,
  userId: mockUser._id,
  amount: 28.97,
  currency: 'USD',
  status: 'pending',
  paymentMethod: 'razorpay',
  razorpayOrderId: 'order_test123',
  razorpayPaymentId: 'pay_test123',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockNotification = {
  _id: '507f1f77bcf86cd799439020',
  userId: mockUser._id,
  title: 'Order Update',
  message: 'Your order has been confirmed',
  type: 'order_update',
  data: {
    orderId: mockOrder._id,
    status: 'confirmed',
  },
  isRead: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Mock API responses
export const mockApiResponses = {
  login: {
    success: true,
    accessToken: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
  },
  restaurants: {
    success: true,
    data: [mockRestaurant],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      pages: 1,
    },
  },
  orders: {
    success: true,
    data: [mockOrder],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      pages: 1,
    },
  },
};
