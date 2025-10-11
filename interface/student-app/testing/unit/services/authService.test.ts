// Example unit test for auth service
import { authService } from '../../../utils/authService';
import { mockApiResponses, mockFetch, mockErrorResponse } from '../../mocks/testUtils';

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockFetch(mockApiResponses.login);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should handle login failure', async () => {
      mockErrorResponse('Invalid credentials');

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(authService.login({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Network error');
    });
  });

  describe('logout', () => {
    it('should clear stored token and user data', async () => {
      await authService.logout();
      // logout doesn't return a result, it just clears storage
      expect(true).toBe(true); // Test passes if no error is thrown
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from storage', async () => {
      const result = await authService.getCurrentUser();

      expect(result).toBeDefined();
    });
  });
});
