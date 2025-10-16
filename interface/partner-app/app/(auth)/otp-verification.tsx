import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Shield, RotateCcw } from 'lucide-react-native';
import phoneAuthService from '../../services/phoneAuthService';
import { useAuthContext } from '../../context/AuthProvider';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const { checkUserExists, loginWithPhone } = useAuthContext();
  const { setVerifiedPhoneNumber } = useOnboardingStore();
  
  // Refs for OTP inputs
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    }
    return phone;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP with Firebase
      const result = await phoneAuthService.verifyOTP(otpCode);
      
      if (result.success && result.user) {
        // Check if user exists in our backend
        const userExists = await checkUserExists(phoneNumber!);
        
        if (userExists) {
          // Existing user - login directly
          await loginWithPhone(phoneNumber!, result.user.uid);
          router.replace('/(tabs)/dashboard');
        } else {
          // New user - set verified phone number and go to onboarding
          setVerifiedPhoneNumber(phoneNumber!);
          router.replace('/onboarding/welcome');
        }
      } else {
        Alert.alert('Verification Failed', result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !phoneNumber) return;

    setIsResending(true);
    
    try {
      const result = await phoneAuthService.resendOTP(phoneNumber);
      
      if (result.success) {
        // Reset timer and OTP
        setOtp(['', '', '', '', '', '']);
        setTimer(30);
        setCanResend(false);
        
        // Focus first input
        inputRefs.current[0]?.focus();
        
        Alert.alert('OTP Sent', 'A new verification code has been sent to your phone.');
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={40} color="#FF9F43" />
          </View>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.phoneText}>{formatPhoneNumber(phoneNumber || '')}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>Enter verification code</Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || isLoading) && styles.verifyButtonDisabled
          ]}
          onPress={handleVerifyOTP}
          disabled={!isOtpComplete || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendSection}>
          {!canResend ? (
            <Text style={styles.timerText}>
              Resend code in {timer}s
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              disabled={isResending}
            >
              {isResending ? (
                <ActivityIndicator size="small" color="#FF9F43" />
              ) : (
                <>
                  <RotateCcw size={16} color="#FF9F43" />
                  <Text style={styles.resendText}>Resend Code</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            Didn't receive the code? Check your network connection or try resending.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FEF6E9',
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9F43',
  },
  otpSection: {
    marginBottom: 32,
  },
  otpLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFF',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#FF9F43',
    backgroundColor: '#FFF9F0',
  },
  verifyButton: {
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: '#FFB97C',
    opacity: 0.6,
  },
  verifyButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    fontSize: 16,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
    marginLeft: 8,
  },
  helpSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  helpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
