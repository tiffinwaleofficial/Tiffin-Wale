import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, User, CreditCard, Ban as Bank } from 'lucide-react-native';

export default function BankAccountScreen() {
  const router = useRouter();
  const [accountName, setAccountName] = useState('Spice Garden Foods');
  const [accountNumber, setAccountNumber] = useState('XXXX XXXX XXXX 4321');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Account</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Your bank account details for receiving payments
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Holder Name</Text>
            <View style={styles.inputWithIcon}>
              <User size={20} color="#666" />
              <TextInput
                style={[styles.iconInput, !isEditing && styles.disabledInput]}
                value={accountName}
                onChangeText={setAccountName}
                editable={isEditing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Number</Text>
            <View style={styles.inputWithIcon}>
              <CreditCard size={20} color="#666" />
              <TextInput
                style={[styles.iconInput, !isEditing && styles.disabledInput]}
                value={accountNumber}
                onChangeText={setAccountNumber}
                editable={isEditing}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bank Name</Text>
            <View style={styles.inputWithIcon}>
              <Bank size={20} color="#666" />
              <TextInput
                style={[styles.iconInput, !isEditing && styles.disabledInput]}
                value={bankName}
                onChangeText={setBankName}
                editable={isEditing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>IFSC Code</Text>
            <View style={styles.inputWithIcon}>
              <Building2 size={20} color="#666" />
              <TextInput
                style={[styles.iconInput, !isEditing && styles.disabledInput]}
                value={ifscCode}
                onChangeText={setIfscCode}
                editable={isEditing}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • Ensure all bank details are accurate to avoid payment delays{'\n'}
            • Account holder name should match your business name{'\n'}
            • Double-check IFSC code for correct bank branch identification{'\n'}
            • Weekly payments are processed every Monday
          </Text>
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
  },
  editButton: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FF9F43',
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});