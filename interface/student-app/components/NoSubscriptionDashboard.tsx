import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const NoSubscriptionDashboard = () => {
  const router = useRouter();

  return (
    <View style={styles.noSubscriptionContainer}>
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
        style={styles.noSubscriptionImage}
      />
      <Text style={styles.noSubscriptionTitle}>No Active Subscription</Text>
      <Text style={styles.noSubscriptionText}>
        Subscribe to a meal plan to enjoy delicious food delivered daily to your doorstep.
      </Text>
      <TouchableOpacity 
        style={styles.subscribeButton}
        onPress={() => router.push('/plans')}
      >
        <Text style={styles.subscribeButtonText}>Browse Plans</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  noSubscriptionContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFAF0',
  },
  noSubscriptionImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginTop: 40,
    marginBottom: 32,
  },
  noSubscriptionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  noSubscriptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  subscribeButton: {
    backgroundColor: '#FF9B42',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subscribeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 