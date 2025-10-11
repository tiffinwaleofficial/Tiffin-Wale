import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { validatePassword, getPasswordStrength } from '@/utils/validation';
import { RegisterRequest } from '@/types/api';

export default function Login() {
  const router = useRouter();
  const authHook = useAuth();
  const { login, register, isLoading, error, clearError, isAuthenticated } = authHook;
  
  // Refs for form field navigation
  const loginPasswordRef = useRef<TextInput>(null);
  const signupLastNameRef = useRef<TextInput>(null);
  const signupEmailRef = useRef<TextInput>(null);
  const signupPhoneRef = useRef<TextInput>(null);
  const signupPasswordRef = useRef<TextInput>(null);
  const signupConfirmPasswordRef = useRef<TextInput>(null);
  
  // Debug: Log the auth hook functions
  console.log('🔍 Auth hook functions:', { 
    login: typeof login, 
    register: typeof register,
    authHookKeys: Object.keys(authHook)
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupPasswordStrength, setSignupPasswordStrength] = useState({ score: 0, message: '' });
  const [passwordMatchError, setPasswordMatchError] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleSignupPasswordChange = (text: string) => {
    setSignupPassword(text);
    const strength = getPasswordStrength(text);
    setSignupPasswordStrength(strength);
    
    // Check password match
    if (confirmPassword && text !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text !== signupPassword) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  };

  const handleLogin = async () => {
    clearError();
    
    if (!loginEmail || !loginPassword) {
      return;
    }
    
    await login(loginEmail, loginPassword);
  };

  const handleSignup = async () => {
    console.log('🚀 Signup button clicked in login.tsx!');
    console.log('📝 Form data:', { signupEmail, signupPassword, confirmPassword, firstName, lastName, phoneNumber });
    
    clearError();
    setPasswordMatchError('');
    
    // Check for missing required fields
    if (!signupEmail || !signupPassword || !confirmPassword || !firstName || !lastName || !phoneNumber) {
      console.log('❌ Missing required fields in signup');
      return;
    }

    // Check password validation with detailed feedback
    if (!validatePassword(signupPassword)) {
      console.log('❌ Password validation failed - Password requirements not met');
      setPasswordMatchError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)');
      return;
    }

    // Check password match
    if (signupPassword !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      console.log('❌ Passwords do not match');
      return;
    }

    const userData: RegisterRequest = {
      email: signupEmail,
      password: signupPassword,
      firstName,
      lastName,
      phoneNumber,
      role: 'customer'
    };

    console.log('📤 Sending registration request from login.tsx:', userData);
    
    try {
      await register(userData);
      console.log('✅ Registration successful from login.tsx');
    } catch (err) {
      console.error('❌ Registration failed from login.tsx:', err);
    }
  };

  // Password strength color
  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return '#ff4444';
      case 1: return '#ffbb33';
      case 2: return '#ffbb33';
      case 3: return '#00C851';
      case 4: return '#007E33';
      default: return '#ff4444';
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/5836429/pexels-photo-5836429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.backgroundImage} 
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>TiffinWale</Text>
            <Text style={styles.logoSubtitle}>Delicious meals for bachelors</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'login' && styles.activeTabButton]} 
              onPress={() => setActiveTab('login')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'login' && styles.activeTabButtonText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'signup' && styles.activeTabButton]} 
              onPress={() => setActiveTab('signup')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'signup' && styles.activeTabButtonText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={styles.dismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'login' ? (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  onSubmitEditing={() => {
                    // Focus on password field when Enter is pressed
                    loginPasswordRef.current?.focus();
                  }}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={loginPasswordRef}
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#AAAAAA"
                    secureTextEntry={!showLoginPassword}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    onSubmitEditing={handleLogin}
                    returnKeyType="done"
                  />
                  <TouchableOpacity onPress={() => setShowLoginPassword(!showLoginPassword)} style={styles.eyeIcon}>
                    {showLoginPassword ? (
                      <EyeOff size={20} color="#666666" />
                    ) : (
                      <Eye size={20} color="#666666" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  (!loginEmail || !loginPassword) && styles.actionButtonDisabled
                ]} 
                onPress={handleLogin}
                disabled={!loginEmail || !loginPassword || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor="#AAAAAA"
                  value={firstName}
                  onChangeText={setFirstName}
                  onSubmitEditing={() => {
                    signupLastNameRef.current?.focus();
                  }}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  ref={signupLastNameRef}
                  style={styles.input}
                  placeholder="Enter your last name"
                  placeholderTextColor="#AAAAAA"
                  value={lastName}
                  onChangeText={setLastName}
                  onSubmitEditing={() => {
                    signupEmailRef.current?.focus();
                  }}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  ref={signupEmailRef}
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  onSubmitEditing={() => {
                    signupPhoneRef.current?.focus();
                  }}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  ref={signupPhoneRef}
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onSubmitEditing={() => {
                    signupPasswordRef.current?.focus();
                  }}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={signupPasswordRef}
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#AAAAAA"
                    secureTextEntry={!showSignupPassword}
                    value={signupPassword}
                    onChangeText={handleSignupPasswordChange}
                    onSubmitEditing={() => {
                      signupConfirmPasswordRef.current?.focus();
                    }}
                    returnKeyType="next"
                  />
                  <TouchableOpacity onPress={() => setShowSignupPassword(!showSignupPassword)} style={styles.eyeIcon}>
                    {showSignupPassword ? (
                      <EyeOff size={20} color="#666666" />
                    ) : (
                      <Eye size={20} color="#666666" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.passwordRequirements}>
                  Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)
                </Text>
                {signupPassword && (
                  <View style={styles.strengthContainer}>
                    <View style={[styles.strengthBar, { backgroundColor: getStrengthColor(signupPasswordStrength.score), width: `${(signupPasswordStrength.score / 4) * 100}%` }]} />
                    <Text style={[styles.strengthText, { color: getStrengthColor(signupPasswordStrength.score) }]}>
                      {signupPasswordStrength.message}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={signupConfirmPasswordRef}
                    style={styles.passwordInput}
                    placeholder="Confirm your password"
                    placeholderTextColor="#AAAAAA"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    onSubmitEditing={handleSignup}
                    returnKeyType="done"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#666666" />
                    ) : (
                      <Eye size={20} color="#666666" />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordMatchError && (
                  <Text style={styles.errorText}>{passwordMatchError}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  (!signupEmail || !signupPassword || !confirmPassword || !firstName || !lastName || !phoneNumber) && styles.actionButtonDisabled
                ]}
                onPress={handleSignup}
                disabled={!signupEmail || !signupPassword || !confirmPassword || !firstName || !lastName || !phoneNumber || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  logoTextContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  logoTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  logoSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    opacity: 0.9,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#FFFAF0',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  activeTabButton: {
    borderBottomColor: '#FF9B42',
  },
  tabButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  activeTabButtonText: {
    color: '#FF9B42',
  },
  errorContainer: {
    backgroundColor: '#FFE8E8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  dismissText: {
    color: '#D32F2F',
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
  },
  eyeIcon: {
    padding: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 4,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  passwordRequirements: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginTop: 4,
    lineHeight: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#FF9B42',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  actionButton: {
    backgroundColor: '#FF9B42',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#FFCCA5',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});