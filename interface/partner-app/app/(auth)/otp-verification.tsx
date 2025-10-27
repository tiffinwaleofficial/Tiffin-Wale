/**
 * OTP Verification Screen
 * Verify OTP, check if user exists, and route to appropriate screen
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, ArrowLeft } from 'lucide-react-native';
import phoneAuthService from '../../services/phoneAuthService';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  const { checkUserExists, loginWithPhone } = useAuthStore();

  /**
   * Countdown timer for resend OTP
   */
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (text && index === 5 && newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  /**
   * Handle backspace
   */
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Verify OTP and handle user authentication flow
   */
  const handleVerifyOTP = async (otpCode?: string) => {
    const otpValue = otpCode || otp.join('');
    
    if (otpValue.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP', [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);

    try {
      if (__DEV__) console.log('🔐 Verifying OTP:', otpValue);

      // Step 1: Verify OTP with Firebase
      const result = await phoneAuthService.verifyOTP(otpValue);

      if (!result.success || !result.user) {
        Alert.alert(
          'Invalid OTP',
          result.error || 'Please check the code and try again',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      const firebaseUid = result.user.uid;
      const formattedPhone = `+91${phoneNumber}`;

      if (__DEV__) console.log('✅ Firebase verification successful, Firebase UID:', firebaseUid);

      // Step 2: Check if user exists as partner in our backend
      if (__DEV__) console.log('🔍 Checking if partner exists for:', formattedPhone);
      const userExists = await checkUserExists(formattedPhone);
      if (__DEV__) console.log('🔍 checkUserExists returned:', userExists);

      if (userExists) {
        // Step 3a: User exists as partner → Login
        if (__DEV__) console.log('✅ Partner user exists, logging in...');
        
        try {
          await loginWithPhone(formattedPhone, firebaseUid);
          // Navigate to dashboard
          if (__DEV__) console.log('✅ Login successful, navigating to dashboard...');
          router.replace('/(tabs)/dashboard');
        } catch (loginError: any) {
          console.error('❌ Login error:', loginError);
          // If login fails, treat as new user
          if (__DEV__) console.log('⚠️ Login failed, treating as new user');
          useOnboardingStore.getState().setVerifiedPhoneNumber(formattedPhone, firebaseUid);
          router.replace('/onboarding/welcome');
        }
      } else {
        // Step 3b: User doesn't exist as partner - allow signup
        // Note: Same phone number can be both customer AND partner in different apps
        if (__DEV__) console.log('🆕 User does not exist as partner - allowing partner signup');
        
        const authError = useAuthStore.getState().error;
        if (authError) {
          if (__DEV__) console.log('ℹ️ User might exist in other app:', authError);
          // Clear the error since we're allowing multi-app registration
          useAuthStore.getState().clearError();
        }
        
        // Store verified phone number and Firebase UID in onboarding store
        useOnboardingStore.getState().setVerifiedPhoneNumber(formattedPhone, firebaseUid);
        if (__DEV__) console.log('✅ Phone and Firebase UID stored in onboarding store');
        
        // Navigate to welcome (step 2) since phone is already verified (step 1)
        if (__DEV__) console.log('🚀 Navigating to /onboarding/welcome');
        router.replace('/onboarding/welcome');
      }
    } catch (error: any) {
      console.error('❌ OTP verification failed:', error);
      
      let errorTitle = 'Verification Failed';
      let errorMessage = error.message || 'Unable to verify OTP. Please try again.';
      
      // Handle role-specific errors
      if (error.message && error.message.includes('registered as a')) {
        errorTitle = 'Wrong App';
        errorMessage = error.message + '\n\nPlease download the TiffinWale Student app to access your account.';
      } else if (error.message && error.message.includes('correct app')) {
        errorTitle = 'Wrong App';
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      
      const result = await phoneAuthService.resendOTP(phoneNumber);
      
      if (result.success) {
        // Reset timer and OTP
        setOtp(['', '', '', '', '', '']);
        setTimer(60);
        setCanResend(false);
        inputRefs.current[0]?.focus();
        
        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone', [{ text: 'OK' }]);
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP', [{ text: 'OK' }]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP', [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          disabled={isLoading}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={64} color="#FF9F43" />
        </View>

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              editable={!isLoading}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (otp.some(d => !d) || isLoading) && styles.verifyButtonDisabled,
          ]}
          onPress={() => handleVerifyOTP()}
          disabled={otp.some(d => !d) || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
              <Text style={styles.resendText}>
                Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend OTP in <Text style={styles.timerNumber}>{timer}s</Text>
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  phoneNumber: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9F43',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    backgroundColor: '#FFF',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#FF9F43',
    backgroundColor: '#FFF8F0',
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#FFB97C',
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  resendLink: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9F43',
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  timerNumber: {
    fontFamily: 'Poppins-Bold',
    color: '#FF9F43',
  },
});
