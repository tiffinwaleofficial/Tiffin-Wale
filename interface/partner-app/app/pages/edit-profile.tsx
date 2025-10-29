import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Save, CheckCircle } from 'lucide-react-native';
import { usePartnerStore } from '../../store/partnerStore';
import { api } from '../../lib/api';
import * as ImagePicker from 'expo-image-picker';
import { cloudinaryUploadService, UploadType } from '../../services/cloudinaryUploadService';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, fetchProfile, updateProfile } = usePartnerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || '');
      setDescription(profile.description || '');
      setContactEmail(profile.contactEmail || profile.email || '');
      setContactPhone(profile.contactPhone || profile.phoneNumber || '');
      setProfileImageUrl(profile.logoUrl || null);
    } else {
      fetchProfile();
    }
  }, [profile]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfileImage = async (uri: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      const uploadResult = await cloudinaryUploadService.uploadFile(uri, UploadType.PROFILE_IMAGE);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }
      return uploadResult.url || null;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!businessName.trim()) {
        Alert.alert('Validation Error', 'Business name is required');
        setIsLoading(false);
        return;
      }

      const updateData: any = {
        businessName: businessName.trim(),
        description: description.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
      };

      // Upload profile image if new one was selected
      if (profileImageUri) {
        try {
          console.log('📤 Uploading profile image to Cloudinary...');
          const uploadedUrl = await uploadProfileImage(profileImageUri);
          if (uploadedUrl) {
            updateData.logoUrl = uploadedUrl;
            setProfileImageUrl(uploadedUrl);
            setProfileImageUri(null);
            console.log('✅ Profile image uploaded successfully:', uploadedUrl);
          } else {
            throw new Error('Failed to upload image');
          }
        } catch (uploadError: any) {
          console.error('❌ Image upload failed:', uploadError);
          Alert.alert('Upload Error', uploadError.message || 'Failed to upload image. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      // Save to API
      console.log('💾 Saving profile updates to API...');
      await updateProfile(updateData);
      await fetchProfile();
      
      console.log('✅ Profile updated successfully!');
      // Navigate back immediately after success
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      console.error('❌ Failed to update profile:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isLoading || isUploading}
        >
          {isLoading || isUploading ? (
            <ActivityIndicator size="small" color="#FF9F43" />
          ) : (
            <CheckCircle size={24} color="#10B981" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={styles.profileImage}
              />
            ) : profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                <Camera size={40} color="#CCC" />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickImage}
              disabled={isUploading}
            >
              <Camera size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileImageHint}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Enter business name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your business"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput
              style={styles.input}
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="business@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="+91 1234567890"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButtonFull, (isLoading || isUploading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading || isUploading}
        >
          {isLoading || isUploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.saveButtonText}>
                {isUploading ? 'Uploading Image...' : 'Saving Changes...'}
              </Text>
            </View>
          ) : (
            <>
              <Save size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: For detailed business settings like address, hours, delivery settings, 
            cuisine types, etc., please visit the Business Profile page.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF9F43',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImageHint: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
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
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  saveButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteContainer: {
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  noteText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

