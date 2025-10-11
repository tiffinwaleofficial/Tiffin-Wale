// Unit test for chat service
import { chatService } from '../../../services/chatService';
import { mockConversation, mockMessage, mockFetch } from '../../mocks/testUtils';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Cloudinary
jest.mock('cloudinary-react-native', () => ({
  Cloudinary: {
    upload: jest.fn(),
  },
}));

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send text message successfully', async () => {
      mockFetch({ ...mockMessage });

      const result = await chatService.sendMessage(
        mockConversation.id,
        'Hello, how are you?'
      );

      expect(result.content).toBe('Hello, how are you?');
      expect(result.messageType).toBe('text');
    });

    it('should send image message successfully', async () => {
      const imageUri = 'file://test-image.jpg';
      mockFetch({ ...mockMessage, messageType: 'image' });

      const result = await chatService.sendMediaMessage(
        mockConversation.id,
        imageUri,
        'image'
      );

      expect(result.messageType).toBe('image');
    });

    it('should handle send message error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to send message'));

      await expect(chatService.sendMessage(
        mockConversation.id,
        'Hello'
      )).rejects.toThrow('Failed to send message');
    });
  });

  describe('getConversations', () => {
    it('should get conversations successfully', async () => {
      mockFetch([mockConversation]);

      const result = await chatService.getConversations();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockConversation.id);
    });

    it('should handle get conversations error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to get conversations'));

      await expect(chatService.getConversations()).rejects.toThrow('Failed to get conversations');
    });
  });

  describe('getMessages', () => {
    it('should get messages successfully', async () => {
      mockFetch([mockMessage]);

      const result = await chatService.getMessages(mockConversation.id);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockMessage.id);
    });

    it('should handle get messages error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to get messages'));

      await expect(chatService.getMessages(mockConversation.id)).rejects.toThrow('Failed to get messages');
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read successfully', async () => {
      mockFetch({ messageIds: ['msg1', 'msg2'] });

      await chatService.markMessagesAsRead(mockConversation.id, ['msg1', 'msg2']);

      expect(true).toBe(true); // Test passes if no error is thrown
    });

    it('should handle mark as read error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to mark as read'));

      await expect(chatService.markMessagesAsRead(mockConversation.id, ['msg1'])).rejects.toThrow('Failed to mark as read');
    });
  });

  describe('deleteMessage', () => {
    it('should delete message successfully', async () => {
      mockFetch({ messageId: mockMessage.id });

      await chatService.deleteMessage(mockMessage.id);

      expect(true).toBe(true); // Test passes if no error is thrown
    });

    it('should handle delete message error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to delete message'));

      await expect(chatService.deleteMessage(mockMessage.id)).rejects.toThrow('Failed to delete message');
    });
  });

  describe('offline functionality', () => {
    it('should send message offline', async () => {
      const result = await chatService.sendMessageOffline(
        mockConversation.id,
        'Offline message'
      );

      expect(typeof result).toBe('string'); // Returns actionId
    });

    it('should sync offline data', async () => {
      mockFetch({ synced: true });

      await chatService.syncOfflineData();

      expect(true).toBe(true); // Test passes if no error is thrown
    });
  });
});
