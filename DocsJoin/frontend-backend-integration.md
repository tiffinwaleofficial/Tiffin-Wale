# TiffinWale Student App - Frontend-Backend Integration Guide

*Last Updated: July 20, 2023*

This document provides a comprehensive guide for connecting the TiffinWale Student App (React Native/Expo) to the monolith backend (NestJS).

## Table of Contents
1. [Integration Architecture](#1-integration-architecture)
2. [API Client Setup](#2-api-client-setup)
3. [Authentication Integration](#3-authentication-integration)
4. [State Management Integration](#4-state-management-integration)
5. [Module-by-Module Integration](#5-module-by-module-integration)
6. [Error Handling](#6-error-handling)
7. [Testing & Validation](#7-testing--validation)
8. [Implementation Roadmap](#8-implementation-roadmap)

## 1. Integration Architecture

### Current Architecture
- **Frontend**: React Native with Expo, using Zustand for state management
- **Backend**: NestJS with MongoDB, providing RESTful APIs
- **Current State**: Frontend uses mock data with simulated API calls

### Target Architecture
- **API Communication**: Direct REST API calls from frontend to backend
- **Authentication**: JWT token-based authentication
- **Data Flow**: Backend as the single source of truth for all data
- **Real-time Updates**: WebSocket connection for real-time status updates

![Architecture Diagram](https://via.placeholder.com/800x400?text=TiffinWale+Integration+Architecture)

## 2. API Client Setup

### Setting Up Axios Client

Create a centralized API client in the Student App:

```typescript
// interface/student-app/utils/apiClient.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.tiffinwale.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (token expired)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login or refresh token logic here
      // For example:
      // await store.dispatch(logout());
      // navigation.navigate('Login');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Environment Configuration

Add configuration for different environments:

```
# interface/student-app/.env.development
API_BASE_URL=http://localhost:3000

# interface/student-app/.env.production
API_BASE_URL=https://api.tiffinwale.com
```

Install required packages:

```bash
cd interface/student-app
npm install axios @react-native-async-storage/async-storage react-native-dotenv
```

## 3. Authentication Integration

Replace the mock authentication in `authStore.ts` with real API calls:

```typescript
// interface/student-app/store/authStore.ts
import { create } from 'zustand';
import apiClient from '../utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token securely
      await AsyncStorage.setItem('auth_token', token);
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed. Please try again.', 
        isLoading: false 
      });
    }
  },

  register: async (userData: Partial<User>, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', {
        ...userData,
        password
      });
      
      const { token, user } = response.data;
      await AsyncStorage.setItem('auth_token', token);
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed. Please try again.', 
        isLoading: false 
      });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => {
    set({ error: null });
  }
}));
```

## 4. State Management Integration

### Updating Meal Store

Replace mock data in the meal store with actual API calls:

```typescript
// interface/student-app/store/mealStore.ts
import { create } from 'zustand';
import apiClient from '../utils/apiClient';
import { Meal } from '@/types';

interface MealState {
  todayMeals: Meal[];
  mealHistory: Meal[];
  isLoading: boolean;
  error: string | null;
  fetchTodayMeals: () => Promise<void>;
  fetchMealHistory: () => Promise<void>;
}

export const useMealStore = create<MealState>((set, get) => ({
  todayMeals: [],
  mealHistory: [],
  isLoading: false,
  error: null,

  fetchTodayMeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // This API endpoint needs to be implemented in the backend
      const response = await apiClient.get('/meals/today');
      set({ todayMeals: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch today\'s meals', 
        isLoading: false 
      });
    }
  },

  fetchMealHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      // This API endpoint needs to be implemented in the backend
      const response = await apiClient.get('/meals/history');
      set({ mealHistory: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch meal history', 
        isLoading: false 
      });
    }
  }
}));
```

### Creating a Subscription Store

Add a new store for subscription management with the actual API endpoints:

```typescript
// interface/student-app/store/subscriptionStore.ts
import { create } from 'zustand';
import apiClient from '../utils/apiClient';
import { SubscriptionPlan, Subscription } from '@/types';

interface SubscriptionState {
  availablePlans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  fetchAvailablePlans: () => Promise<void>;
  fetchActivePlans: () => Promise<void>;
  fetchPlanById: (planId: string) => Promise<SubscriptionPlan | null>;
  fetchCurrentSubscription: () => Promise<void>;
  fetchSubscriptionById: (subscriptionId: string) => Promise<Subscription | null>;
  subscribeToPlan: (planId: string, paymentDetails: any) => Promise<void>;
  updateSubscription: (subscriptionId: string, updateData: any) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  availablePlans: [],
  currentSubscription: null,
  isLoading: false,
  error: null,

  fetchAvailablePlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/subscription-plans');
      set({ availablePlans: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch subscription plans', 
        isLoading: false 
      });
    }
  },

  fetchActivePlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/subscription-plans/active');
      set({ availablePlans: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch active subscription plans', 
        isLoading: false 
      });
    }
  },

  fetchPlanById: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/subscription-plans/${planId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch subscription plan', 
        isLoading: false 
      });
      return null;
    }
  },

  fetchCurrentSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      // Assuming the user ID is available from the auth store
      const userId = useAuthStore.getState().user?.id;
      const response = await apiClient.get(`/subscriptions/customer/${userId}`);
      const activeSubscription = response.data.find((sub: Subscription) => 
        sub.status === 'active' || sub.status === 'paused'
      );
      set({ currentSubscription: activeSubscription || null, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch current subscription', 
        isLoading: false 
      });
    }
  },

  fetchSubscriptionById: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/subscriptions/${subscriptionId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch subscription', 
        isLoading: false 
      });
      return null;
    }
  },

  subscribeToPlan: async (planId: string, paymentDetails: any) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      const response = await apiClient.post('/subscriptions', {
        customerId: userId,
        planId,
        paymentDetails
      });
      set({ currentSubscription: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to subscribe to plan', 
        isLoading: false 
      });
    }
  },

  updateSubscription: async (subscriptionId: string, updateData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/subscriptions/${subscriptionId}`, updateData);
      set({ 
        currentSubscription: response.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update subscription', 
        isLoading: false 
      });
    }
  },

  cancelSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch(`/subscriptions/${subscriptionId}/cancel`);
      set({ currentSubscription: null, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to cancel subscription', 
        isLoading: false 
      });
    }
  },

  pauseSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/subscriptions/${subscriptionId}/pause`);
      set({ currentSubscription: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to pause subscription', 
        isLoading: false 
      });
    }
  },

  resumeSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/subscriptions/${subscriptionId}/resume`);
      set({ currentSubscription: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to resume subscription', 
        isLoading: false 
      });
    }
  }
}));
```

### Creating a Payment Store

Add a new store for payment management with the actual API endpoints:

```typescript
// interface/student-app/store/paymentStore.ts
import { create } from 'zustand';
import apiClient from '../utils/apiClient';
import { PaymentMethod, Transaction } from '@/types';

interface PaymentState {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  defaultPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
  fetchPaymentMethods: () => Promise<void>;
  createPaymentMethod: (paymentMethodData: Partial<PaymentMethod>) => Promise<void>;
  updatePaymentMethod: (id: string, updateData: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchTransactionById: (id: string) => Promise<Transaction | null>;
  processPayment: (amount: number, paymentMethodId: string, description: string) => Promise<any>;
  createRazorpayOrder: (amount: number, currency: string, receipt: string) => Promise<any>;
  verifyRazorpayPayment: (paymentData: any) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentMethods: [],
  transactions: [],
  defaultPaymentMethod: null,
  isLoading: false,
  error: null,

  fetchPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/payment/methods');
      const methods = response.data;
      const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault);
      set({ 
        paymentMethods: methods, 
        defaultPaymentMethod: defaultMethod || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch payment methods', 
        isLoading: false 
      });
    }
  },

  createPaymentMethod: async (paymentMethodData: Partial<PaymentMethod>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/payment/methods', paymentMethodData);
      const methods = [...get().paymentMethods, response.data];
      const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault);
      set({ 
        paymentMethods: methods, 
        defaultPaymentMethod: defaultMethod || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create payment method', 
        isLoading: false 
      });
    }
  },

  updatePaymentMethod: async (id: string, updateData: Partial<PaymentMethod>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/payment/methods/${id}`, updateData);
      const updatedMethod = response.data;
      const methods = get().paymentMethods.map((method: PaymentMethod) => 
        method.id === id ? updatedMethod : method
      );
      const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault);
      set({ 
        paymentMethods: methods, 
        defaultPaymentMethod: defaultMethod || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update payment method', 
        isLoading: false 
      });
    }
  },

  deletePaymentMethod: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/payment/methods/${id}`);
      const methods = get().paymentMethods.filter((method: PaymentMethod) => method.id !== id);
      const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault);
      set({ 
        paymentMethods: methods, 
        defaultPaymentMethod: defaultMethod || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete payment method', 
        isLoading: false 
      });
    }
  },

  setDefaultPaymentMethod: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put(`/payment/methods/${id}/default`);
      const methods = get().paymentMethods.map((method: PaymentMethod) => ({
        ...method,
        isDefault: method.id === id
      }));
      const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault);
      set({ 
        paymentMethods: methods, 
        defaultPaymentMethod: defaultMethod || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to set default payment method', 
        isLoading: false 
      });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/payment/transactions');
      set({ transactions: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch transactions', 
        isLoading: false 
      });
    }
  },

  fetchTransactionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/payment/transactions/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch transaction', 
        isLoading: false 
      });
      return null;
    }
  },

  processPayment: async (amount: number, paymentMethodId: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/payment/process', {
        amount,
        paymentMethodId,
        description
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to process payment', 
        isLoading: false 
      });
      throw error;
    }
  },

  createRazorpayOrder: async (amount: number, currency: string, receipt: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/payment/razorpay/create-order', {
        amount,
        currency,
        receipt
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create Razorpay order', 
        isLoading: false 
      });
      throw error;
    }
  },

  verifyRazorpayPayment: async (paymentData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/payment/razorpay/verify', paymentData);
      set({ isLoading: false });
      return response.data.verified;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to verify payment', 
        isLoading: false 
      });
      return false;
    }
  }
}));
```

## 5. Module-by-Module Integration

### Dashboard Integration

Update the dashboard component to use real data:

```tsx
// interface/student-app/app/(tabs)/index.tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { ActiveSubscriptionDashboard } from '@/components/ActiveSubscriptionDashboard';
import { NoSubscriptionDashboard } from '@/components/NoSubscriptionDashboard';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { todayMeals, fetchTodayMeals, isLoading: mealsLoading } = useMealStore();
  const { currentSubscription, fetchCurrentSubscription, isLoading: subscriptionLoading } = useSubscriptionStore();

  useEffect(() => {
    fetchTodayMeals();
    fetchCurrentSubscription();
  }, []);

  const isLoading = mealsLoading || subscriptionLoading;
  const hasActiveSubscription = !!currentSubscription;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFAF0' }}>
      {hasActiveSubscription ? (
        <ActiveSubscriptionDashboard 
          user={user} 
          todayMeals={todayMeals} 
          subscription={currentSubscription}
          isLoading={isLoading} 
        />
      ) : (
        <NoSubscriptionDashboard 
          user={user}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
```

### Meal Plans Integration

Connect the subscription plans screen to real data:

```tsx
// interface/student-app/app/(tabs)/plans.tsx
import { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function PlansScreen() {
  const { availablePlans, fetchAvailablePlans, isLoading } = useSubscriptionStore();

  useEffect(() => {
    fetchAvailablePlans();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF9B42" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFAF0', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Subscription Plans
      </Text>
      <FlatList
        data={availablePlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlanCard plan={item} />
        )}
      />
    </View>
  );
}

// Implement PlanCard component here
```

Continue with similar integration patterns for all screens.

### Payment Integration

Create payment screens for managing payment methods and handling transactions:

```tsx
// interface/student-app/app/(tabs)/payments.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { usePaymentStore } from '@/store/paymentStore';
import { PaymentMethodCard } from '@/components/PaymentMethodCard';
import { AddPaymentMethodModal } from '@/components/AddPaymentMethodModal';

export default function PaymentsScreen() {
  const { 
    paymentMethods, 
    fetchPaymentMethods, 
    deletePaymentMethod,
    setDefaultPaymentMethod,
    isLoading, 
    error 
  } = usePaymentStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleDelete = async (id: string) => {
    await deletePaymentMethod(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultPaymentMethod(id);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9B42" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PaymentMethodCard
            method={item}
            onDelete={() => handleDelete(item.id)}
            onSetDefault={() => handleSetDefault(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No payment methods added yet.</Text>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
      
      <AddPaymentMethodModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
});
```

### Integration with Razorpay

Create a component for handling Razorpay payments:

```tsx
// interface/student-app/components/RazorpayCheckout.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePaymentStore } from '@/store/paymentStore';
import RazorpayCheckout from 'react-native-razorpay';

interface RazorpayPaymentProps {
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
}

export const RazorpayPayment = ({
  amount,
  description,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure
}: RazorpayPaymentProps) => {
  const { createRazorpayOrder, verifyRazorpayPayment, isLoading } = usePaymentStore();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      // Step 1: Create order on server
      const orderData = await createRazorpayOrder(
        amount * 100, // Amount in paise
        'INR',
        `receipt_${Date.now()}`
      );
      
      const options = {
        description,
        image: 'https://your-app-logo-url.png',
        currency: 'INR',
        key: 'YOUR_RAZORPAY_KEY_ID', // Get from environment variables in production
        amount: amount * 100,
        name: 'TiffinWale',
        order_id: orderData.id,
        prefill: {
          email: customerEmail,
          contact: customerPhone,
          name: customerName
        },
        theme: { color: '#FF9B42' }
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Step 3: Verify payment
          const verificationData = {
            orderId: orderData.id,
            paymentId: data.razorpay_payment_id,
            signature: data.razorpay_signature
          };
          
          const isVerified = await verifyRazorpayPayment(verificationData);
          
          if (isVerified) {
            onSuccess(data.razorpay_payment_id);
          } else {
            onFailure({ message: 'Payment verification failed' });
          }
          setProcessing(false);
        })
        .catch((error: any) => {
          onFailure(error);
          setProcessing(false);
        });
    } catch (error) {
      onFailure(error);
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={isLoading || processing}
      >
        <Text style={styles.payButtonText}>
          {isLoading || processing ? 'Processing...' : 'Pay with Razorpay'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
});
```

## 6. Error Handling

### Global Error Handling

Create a global error handler:

```typescript
// interface/student-app/utils/errorHandler.ts
import { Alert } from 'react-native';

export const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request';
      case 401:
        return 'Authentication required';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection';
  } else {
    // Something happened in setting up the request
    return error.message || 'An unexpected error occurred';
  }
};

export const showErrorAlert = (message: string) => {
  Alert.alert('Error', message);
};
```

## 7. Testing & Validation

### API Testing Checklist

For each API integration, verify:

1. **Authentication** is properly handled
2. **Data Fetching** works correctly
3. **Error Handling** is implemented
4. **Loading States** are displayed appropriately
5. **Data Updates** are reflected in the UI

### Mocking APIs for Development

While developing, create a mock API server:

```typescript
// tools/mock-api-server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom routes here
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'user@example.com' && password === 'password') {
    res.jsonp({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        // other user data
      }
    });
  } else {
    res.status(401).jsonp({ message: 'Invalid credentials' });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
```

## 8. Implementation Roadmap

### Phase 1: Basic Integration (Week 1-2)
- Set up API client and environment configuration
- Implement authentication integration
- Connect user profile to backend

### Phase 2: Core Features (Week 3-4)
- ✅ Integrate subscription plan management with backend APIs
- ✅ Connect payment processing with Razorpay integration
- ✅ Implement payment method management
- Integrate meal data fetching

### Phase 3: Advanced Features (Week 5-6)
- Implement real-time order tracking
- Connect order management and history
- Integrate notifications

### Phase 4: Polish & Optimization (Week 7-8)
- Implement offline support with data caching
- Add error recovery mechanisms
- Optimize performance and loading states

## Conclusion

This integration plan provides a structured approach to connecting the TiffinWale Student App frontend to the monolith backend. The subscription and payment modules are now fully implemented in the backend and ready for integration with the frontend. 