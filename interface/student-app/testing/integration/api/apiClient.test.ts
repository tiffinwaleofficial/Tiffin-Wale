// Integration test for API client
import { apiClient } from '../../../utils/apiClient';
import { mockApiResponses, mockFetch, mockErrorResponse } from '../../mocks/testUtils';

describe('API Client Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication API', () => {
    it('should login successfully', async () => {
      mockFetch(mockApiResponses.login);

      const response = await apiClient.auth.login('test@example.com', 'password123');

      expect(response.accessToken).toBe('mock-jwt-token');
      expect(response.user.email).toBe('test@example.com');
    });

    it('should register successfully', async () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890',
      };

      mockFetch({ success: true, data: mockApiResponses.login });

      const response = await apiClient.auth.register(registerData);

      expect(response.accessToken).toBe('mock-jwt-token');
    });

    it('should handle authentication errors', async () => {
      mockErrorResponse('Invalid credentials');

      await expect(apiClient.auth.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow();
    });
  });

  describe('Restaurant API', () => {
    it('should fetch restaurants successfully', async () => {
      mockFetch(mockApiResponses.restaurants);

      const response = await apiClient.restaurants.getAll();

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(1);
      expect(response.data[0].name).toBe('Test Restaurant');
    });

    it('should fetch restaurant by ID', async () => {
      const restaurantId = '507f1f77bcf86cd799439012';
      mockFetch({ success: true, data: mockApiResponses.restaurants.data[0] });

      const response = await apiClient.restaurants.getById(restaurantId);

      expect(response.success).toBe(true);
      expect(response.data._id).toBe(restaurantId);
    });

    it('should search restaurants', async () => {
      const searchQuery = 'Indian food';
      mockFetch(mockApiResponses.restaurants);

      const response = await apiClient.restaurants.search(searchQuery);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(1);
    });
  });

  describe('Order API', () => {
    it('should create order successfully', async () => {
      const orderData = {
        restaurantId: '507f1f77bcf86cd799439012',
        items: [
          {
            menuItemId: '507f1f77bcf86cd799439014',
            quantity: 2,
          },
        ],
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          zipCode: '12345',
        },
      };

      mockFetch({ success: true, data: { orderId: 'new-order-id' } });

      const response = await apiClient.orders.create(orderData);

      expect(response.success).toBe(true);
      expect(response.data.orderId).toBe('new-order-id');
    });

    it('should fetch user orders', async () => {
      mockFetch(mockApiResponses.orders);

      const response = await apiClient.orders.getUserOrders();

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(1);
    });

    it('should update order status', async () => {
      const orderId = '507f1f77bcf86cd799439013';
      const status = 'confirmed';
      mockFetch({ success: true, data: { orderId, status } });

      const response = await apiClient.orders.updateStatus(orderId, status);

      expect(response.success).toBe(true);
      expect(response.data.status).toBe(status);
    });
  });

  describe('Payment API', () => {
    it('should create payment order', async () => {
      const paymentData = {
        amount: 100,
        currency: 'USD',
        orderId: '507f1f77bcf86cd799439013',
      };

      mockFetch({ success: true, data: { razorpayOrderId: 'order_123' } });

      const response = await apiClient.payments.createOrder(paymentData);

      expect(response.success).toBe(true);
      expect(response.data.razorpayOrderId).toBe('order_123');
    });

    it('should verify payment', async () => {
      const verificationData = {
        razorpayOrderId: 'order_123',
        razorpayPaymentId: 'pay_123',
        razorpaySignature: 'signature_123',
      };

      mockFetch({ success: true, data: { verified: true } });

      const response = await apiClient.payments.verifyPayment(verificationData);

      expect(response.success).toBe(true);
      expect(response.data.verified).toBe(true);
    });
  });

  describe('Chat API', () => {
    it('should create conversation', async () => {
      const conversationData = {
        type: 'support',
        participants: ['user1', 'admin1'],
      };

      mockFetch({ success: true, data: { conversationId: 'conv_123' } });

      const response = await apiClient.chat.createConversation(conversationData);

      expect(response.success).toBe(true);
      expect(response.data.conversationId).toBe('conv_123');
    });

    it('should send message', async () => {
      const messageData = {
        conversationId: 'conv_123',
        content: 'Hello',
        messageType: 'text',
      };

      mockFetch({ success: true, data: { messageId: 'msg_123' } });

      const response = await apiClient.chat.sendMessage(messageData);

      expect(response.success).toBe(true);
      expect(response.data.messageId).toBe('msg_123');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(apiClient.restaurants.getAll()).rejects.toThrow('Network error');
    });

    it('should handle server errors', async () => {
      mockFetch({ success: false, error: 'Internal server error' }, false);

      const response = await apiClient.restaurants.getAll();

      expect(response.success).toBe(false);
      expect(response.error).toBe('Internal server error');
    });

    it('should handle timeout errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Request timeout'));

      await expect(apiClient.restaurants.getAll()).rejects.toThrow('Request timeout');
    });
  });
});