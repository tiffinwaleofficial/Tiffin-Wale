import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { } from 'lucide-react-native';
import api from '@/utils/apiClient';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const response = await api.auth.forgotPassword(email);
      setMessage(response.message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instructions}>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {message ? (
          <Text style={styles.successMessage}>{message}</Text>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleResetRequest} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Send Reset Link</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  backButton: { padding: 8, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  instructions: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 30,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#FF9B42',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginTop: 20,
  },
}); 