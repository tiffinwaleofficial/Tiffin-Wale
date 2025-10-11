import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, User, Mail, Phone, Calendar, Edit2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';

export default function AccountInformation() {
  const router = useRouter();
  const { user, updateUserProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 123-456-7890',
    dob: user?.dob || '01/01/1990'
  });

  const handleSaveChanges = async () => {
    const [firstName, ...lastName] = formData.name.split(' ');
    await updateUserProfile({
      firstName,
      lastName: lastName.join(' '),
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
    });
    
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Information</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Edit2 size={20} color="#FF9B42" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.userName}>{formData.name}</Text>
          {user?.subscriptionActive && (
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>Premium Member</Text>
            </View>
          )}
        </View>

        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.infoCard}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <User size={20} color="#FF9B42" />
              <Text style={styles.infoLabel}>Full Name</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            ) : (
              <Text style={styles.infoValue}>{formData.name}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Mail size={20} color="#FF9B42" />
              <Text style={styles.infoLabel}>Email Address</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoValue}>{formData.email}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Phone size={20} color="#FF9B42" />
              <Text style={styles.infoLabel}>Phone Number</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{formData.phone}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Calendar size={20} color="#FF9B42" />
              <Text style={styles.infoLabel}>Date of Birth</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.dob}
                onChangeText={(text) => setFormData({...formData, dob: text})}
              />
            ) : (
              <Text style={styles.infoValue}>{formData.dob}</Text>
            )}
          </View>
        </Animated.View>

        {isEditing && (
          <Animated.View 
            entering={FadeInDown.delay(200).duration(300)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                // Reset form data to user data
                setFormData({
                  name: user?.name || 'John Doe',
                  email: user?.email || 'john.doe@example.com',
                  phone: user?.phone || '+1 123-456-7890',
                  dob: user?.dob || '01/01/1990'
                });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.additionalInfoCard}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/change-password')}>
            <Text style={styles.actionButtonText}>Change Password</Text>
            <ArrowLeft size={20} color="#666666" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Two-Factor Authentication</Text>
            <ArrowLeft size={20} color="#666666" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFAF0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF9B42',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  subscriptionBadge: {
    backgroundColor: '#FFF5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  subscriptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9B42',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
    flex: 1,
  },
  infoInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333333',
    textAlign: 'right',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666666',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#FF9B42',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  additionalInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333333',
  },
  dangerButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  dangerButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#D32F2F',
  },
}); 