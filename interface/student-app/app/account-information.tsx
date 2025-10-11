import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, User, Mail, Phone, Calendar, Edit2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function AccountInformation() {
  const router = useRouter();
  const { user, updateUserProfile, isLoading } = useAuthStore();
  const { currentSubscription } = useSubscriptionStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state - initialize with real user data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: ''
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      console.log('🔍 AccountInformation: Updating form data with user:', user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || ''
      });
    }
  }, [user]);

  const handleSaveChanges = async () => {
    console.log('🔍 AccountInformation: Saving changes with data:', formData);
    await updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
    });
    
    setIsEditing(false);
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'User';
  };

  // Helper function to check if user has active subscription
  const hasActiveSubscription = () => {
    return currentSubscription && 
           (currentSubscription.status === 'active' || currentSubscription.status === 'pending');
  };

  // Show loading state while user data is being fetched
  if (isLoading && !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Information</Text>
          <View style={styles.editButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9B42" />
          <Text style={styles.loadingText}>Loading your information...</Text>
        </View>
      </View>
    );
  }

  // Show error state if no user data
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Information</Text>
          <View style={styles.editButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load account information</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          
          <Text style={styles.userName}>{getDisplayName()}</Text>
          {hasActiveSubscription() && (
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>
                {currentSubscription?.status === 'pending' ? 'Premium Member (Pending)' : 'Premium Member'}
              </Text>
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
                value={`${formData.firstName} ${formData.lastName}`.trim()}
                onChangeText={(text) => {
                  const [firstName, ...lastNameParts] = text.split(' ');
                  setFormData({
                    ...formData,
                    firstName: firstName || '',
                    lastName: lastNameParts.join(' ') || ''
                  });
                }}
                placeholder="Enter full name"
              />
            ) : (
              <Text style={styles.infoValue}>{getDisplayName()}</Text>
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
              <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
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
                placeholder="Enter phone number"
              />
            ) : (
              <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
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
                placeholder="MM/DD/YYYY"
              />
            ) : (
              <Text style={styles.infoValue}>{user?.dob || 'Not provided'}</Text>
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
                // Reset form data to current user data
                if (user) {
                  setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    dob: user.dob || ''
                  });
                }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
}); 