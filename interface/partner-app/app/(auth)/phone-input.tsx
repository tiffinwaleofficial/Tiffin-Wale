import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { ArrowRight, Phone } from 'lucide-react-native';
import phoneAuthService from '../../services/phoneAuthService';

export default function PhoneInputScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    
    // Format as XXX XXX XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    return limited;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    // Valid Indian mobile number: 10 digits starting with 6, 7, 8, or 9
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handleSendOTP = async () => {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    
    console.log('Cleaned phone number:', cleanedPhone);
    console.log('Phone number length:', cleanedPhone.length);
    
    if (!validatePhoneNumber(cleanedPhone)) {
      Alert.alert(
        'Invalid Phone Number',
        `Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.\n\nYou entered: ${cleanedPhone} (${cleanedPhone.length} digits)`,
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await phoneAuthService.sendOTP(cleanedPhone);
      
      if (result.success) {
        // Navigate to OTP verification screen with phone number
        router.push({
          pathname: '/(auth)/otp-verification',
          params: { phoneNumber: cleanedPhone }
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const isValidPhone = validatePhoneNumber(phoneNumber.replace(/\D/g, ''));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Phone size={40} color="#FF9F43" />
          </View>
          <Text style={styles.title}>Enter Your Phone Number</Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code to confirm your number
          </Text>
        </View>

        {/* Phone Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>
            
            <TextInput
              style={styles.phoneInput}
              placeholder="987 654 3210"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="numeric"
              maxLength={13} // Formatted length: XXX XXX XXXX
              autoFocus
            />
          </View>
          
          {phoneNumber.length > 0 && !isValidPhone && (
            <Text style={styles.errorText}>
              Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9
            </Text>
          )}
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!isValidPhone || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={handleSendOTP}
          disabled={!isValidPhone || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Text style={styles.sendButtonText}>Send OTP</Text>
              <ArrowRight size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

        {/* reCAPTCHA container for web */}
        {Platform.OS === 'web' && <div id="recaptcha-container"></div>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FEF6E9',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FF4444',
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#FFB97C',
    opacity: 0.6,
  },
  sendButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    fontSize: 16,
    marginRight: 8,
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#FF9F43',
    fontFamily: 'Poppins-Medium',
  },
});
