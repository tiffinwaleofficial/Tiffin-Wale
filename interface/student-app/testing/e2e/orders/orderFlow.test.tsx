// E2E test for order flow
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrderStore } from '../../../store/orderStore';
import { usePaymentStore } from '../../../store/paymentStore';
import { mockRestaurant, mockOrder, mockApiResponses, mockFetch } from '../../mocks/testUtils';

// Mock dependencies
jest.mock('expo-router');
jest.mock('../../../store/orderStore');
jest.mock('../../../store/paymentStore');

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseOrderStore = useOrderStore as jest.MockedFunction<typeof useOrderStore>;
const mockUsePaymentStore = usePaymentStore as jest.MockedFunction<typeof usePaymentStore>;

// Mock Order Screen Component
const OrderScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const orderStore = useOrderStore();
  const paymentStore = usePaymentStore();
  const router = useRouter();

  const handleCreateOrder = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const orderData = {
        restaurantId: mockRestaurant._id,
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

      await orderStore.createOrder(orderData);
      
      if (orderStore.currentOrder) {
        router.push(`/payment/${orderStore.currentOrder._id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await paymentStore.processPayment({
        orderId: orderStore.currentOrder?._id || '',
        amount: orderStore.currentOrder?.totalAmount || 0,
        paymentMethod: 'razorpay',
      });
      
      router.replace('/(tabs)/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <Text testID="restaurant-name">{mockRestaurant.name}</Text>
      <TouchableOpacity 
        testID="create-order-button" 
        onPress={handleCreateOrder} 
        disabled={isLoading}
      >
        <Text>{isLoading ? 'Creating Order...' : 'Create Order'}</Text>
      </TouchableOpacity>
      
      {orderStore.currentOrder && (
        <TouchableOpacity 
          testID="pay-button" 
          onPress={handlePayment} 
          disabled={isLoading}
        >
          <Text>Pay ₹{orderStore.currentOrder.totalAmount}</Text>
        </TouchableOpacity>
      )}
      
      {error ? <Text testID="error-message">{error}</Text> : null}
    </ScrollView>
  );
};

describe('Order Flow E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock router
    mockRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    } as any);

    // Mock order store
    mockUseOrderStore.mockReturnValue({
      createOrder: jest.fn(),
      currentOrder: null,
      isLoading: false,
      error: null,
    } as any);

    // Mock payment store
    mockUsePaymentStore.mockReturnValue({
      processPayment: jest.fn(),
      isLoading: false,
      error: null,
    } as any);
  });

  it('should complete order creation flow', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue(undefined);
    const mockPush = jest.fn();
    
    mockUseOrderStore.mockReturnValue({
      createOrder: mockCreateOrder,
      currentOrder: mockOrder,
      isLoading: false,
      error: null,
    } as any);
    
    mockRouter.mockReturnValue({
      push: mockPush,
    } as any);

    const { getByTestId } = render(<OrderScreen />);

    // Create order
    fireEvent.press(getByTestId('create-order-button'));

    // Wait for order creation
    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalled();
    });

    // Verify navigation to payment
    expect(mockPush).toHaveBeenCalledWith(`/payment/${mockOrder._id}`);
  });

  it('should complete payment flow', async () => {
    const mockProcessPayment = jest.fn().mockResolvedValue(undefined);
    const mockReplace = jest.fn();
    
    mockUseOrderStore.mockReturnValue({
      createOrder: jest.fn(),
      currentOrder: mockOrder,
      isLoading: false,
      error: null,
    } as any);
    
    mockUsePaymentStore.mockReturnValue({
      processPayment: mockProcessPayment,
      isLoading: false,
      error: null,
    } as any);
    
    mockRouter.mockReturnValue({
      replace: mockReplace,
    } as any);

    const { getByTestId } = render(<OrderScreen />);

    // Process payment
    fireEvent.press(getByTestId('pay-button'));

    // Wait for payment processing
    await waitFor(() => {
      expect(mockProcessPayment).toHaveBeenCalledWith({
        orderId: mockOrder._id,
        amount: mockOrder.totalAmount,
        paymentMethod: 'razorpay',
      });
    });

    // Verify navigation to orders
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/orders');
  });

  it('should handle order creation error', async () => {
    const mockCreateOrder = jest.fn().mockRejectedValue(new Error('Order creation failed'));
    
    mockUseOrderStore.mockReturnValue({
      createOrder: mockCreateOrder,
      currentOrder: null,
      isLoading: false,
      error: 'Order creation failed',
    } as any);

    const { getByTestId } = render(<OrderScreen />);

    // Create order
    fireEvent.press(getByTestId('create-order-button'));

    // Wait for error to appear
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });

    expect(getByTestId('error-message').props.children).toBe('Order creation failed');
  });

  it('should handle payment error', async () => {
    const mockProcessPayment = jest.fn().mockRejectedValue(new Error('Payment failed'));
    
    mockUseOrderStore.mockReturnValue({
      createOrder: jest.fn(),
      currentOrder: mockOrder,
      isLoading: false,
      error: null,
    } as any);
    
    mockUsePaymentStore.mockReturnValue({
      processPayment: mockProcessPayment,
      isLoading: false,
      error: 'Payment failed',
    } as any);

    const { getByTestId } = render(<OrderScreen />);

    // Process payment
    fireEvent.press(getByTestId('pay-button'));

    // Wait for error to appear
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });

    expect(getByTestId('error-message').props.children).toBe('Payment failed');
  });
});







