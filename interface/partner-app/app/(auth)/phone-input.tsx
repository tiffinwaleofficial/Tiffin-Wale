/**
 * Phone Input Screen
 * First step of authentication - enter phone number and receive OTP
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, ArrowRight } from 'lucide-react-native';
import phoneAuthService from '../../services/phoneAuthService';
import FirebaseRecaptchaContainer from '../../components/FirebaseRecaptchaContainer';
import { useAuthStore } from '../../store/authStore';
import { tokenManager } from '../../lib/auth/TokenManager';

export default function PhoneInputScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Redirect authenticated users
  useEffect(() => {
    const checkAuth = async () => {
      const token = await tokenManager.getAccessToken();
      if (isAuthenticated && token) {
        console.log('⚠️ Already authenticated, redirecting to dashboard');
        router.replace('/(tabs)/dashboard');
      }
    };
    checkAuth();
  }, [isAuthenticated]);

  /**
   * Validate Indian phone number
   */
  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    // Must be 10 digits and start with 6-9
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  /**
   * Format phone number for display
   */
  const formatPhoneNumber = (text: string): string => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Limit to 10 digits
    return cleaned.substring(0, 10);
  };

  /**
   * Handle send OTP
   */
  const handleSendOTP = async () => {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    try {
      if (__DEV__) console.log('📱 Sending OTP to:', phoneNumber);

      // Send OTP via Firebase
      const result = await phoneAuthService.sendOTP(phoneNumber);

      if (result.success) {
        // Navigate to OTP verification screen
        router.push({
          pathname: '/(auth)/otp-verification',
          params: { phoneNumber },
        });
      } else {
        Alert.alert(
          'Failed to Send OTP',
          result.error || 'Please try again',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('❌ Error sending OTP:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Firebase reCAPTCHA container for web */}
      <FirebaseRecaptchaContainer />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header with Icon */}
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Phone size={40} color="#FF9B42" />
          </View>
          <Text style={styles.title}>TiffinWale Partner</Text>
          <Text style={styles.subtitle}>Enter your phone number to continue</Text>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              editable={!isLoading}
              autoFocus
            />
          </View>
          
          {phoneNumber.length > 0 && !validatePhoneNumber(phoneNumber) && (
            <Text style={styles.errorText}>
              Please enter a valid 10-digit mobile number
            </Text>
          )}
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!validatePhoneNumber(phoneNumber) || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendOTP}
          disabled={!validatePhoneNumber(phoneNumber) || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.sendButtonText}>Send OTP</Text>
              <ArrowRight size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          We'll send you a One-Time Password (OTP) to verify your phone number
        </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 32,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#F8F8F8',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9B42',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#FF9B42',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#FFB97C',
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
