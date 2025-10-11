// E2E test for authentication flow
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../../../utils/authService';
import { mockApiResponses, mockFetch } from '../../mocks/testUtils';

// Mock dependencies
jest.mock('expo-router');
jest.mock('../../store/authStore');
jest.mock('../../utils/authService');

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock Login Screen Component
const LoginScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const authStore = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await authStore.login(email, password);
      if (authStore.isAuthenticated) {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        testID="email-input"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        testID="password-input"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity testID="login-button" onPress={handleLogin} disabled={isLoading}>
        <Text>{isLoading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      {error ? <Text testID="error-message">{error}</Text> : null}
    </View>
  );
};

describe('Authentication Flow E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock router
    mockRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    } as any);

    // Mock auth store
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
      error: null,
    } as any);
  });

  it('should complete successful login flow', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    const mockReplace = jest.fn();
    
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    } as any);
    
    mockRouter.mockReturnValue({
      replace: mockReplace,
    } as any);

    const { getByTestId } = render(<LoginScreen />);

    // Fill in credentials
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');

    // Submit login
    fireEvent.press(getByTestId('login-button'));

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Verify navigation
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  it('should handle login error', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      isLoading: false,
      error: 'Invalid credentials',
    } as any);

    const { getByTestId } = render(<LoginScreen />);

    // Fill in credentials
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrongpassword');

    // Submit login
    fireEvent.press(getByTestId('login-button'));

    // Wait for error to appear
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });

    expect(getByTestId('error-message').props.children).toBe('Invalid credentials');
  });

  it('should show loading state during login', async () => {
    const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    } as any);

    const { getByTestId } = render(<LoginScreen />);

    // Fill in credentials
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');

    // Submit login
    fireEvent.press(getByTestId('login-button'));

    // Check loading state
    expect(getByTestId('login-button').props.children).toBe('Logging in...');
    expect(getByTestId('login-button').props.disabled).toBe(true);
  });
});
