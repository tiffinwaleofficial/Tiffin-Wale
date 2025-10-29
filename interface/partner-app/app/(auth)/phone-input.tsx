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
  Image,
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
        {/* Logo and Header */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/5920773/pexels-photo-5920773.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.logo}
          />
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
              <Phone size={20} color="#FFF" style={styles.buttonIcon} />
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
    backgroundColor: '#FEF6E9',
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
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#F5F5F5',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  input: {
    flex: 1,
    padding: 18,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
    marginLeft: 4,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#FFB97C',
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  devNote: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  devNoteText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#856404',
    textAlign: 'center',
  },
});
