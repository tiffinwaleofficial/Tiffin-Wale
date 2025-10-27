import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import UploadComponent from '../../components/ui/UploadComponent';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, ImagesBrandingData } from '../../store/onboardingStore';
import { UploadType, cloudinaryUploadService } from '../../services/cloudinaryUploadService';

export default function ImagesBranding() {
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<ImagesBrandingData>(
    (formData.step6 as unknown as ImagesBrandingData) || {
      logoUrl: '',
      bannerUrl: '',
      socialMedia: {
        instagram: '',
        facebook: '',
        twitter: '',
      },
    }
  );

  const [logoFiles, setLogoFiles] = useState<any[]>([]);
  const [bannerFiles, setBannerFiles] = useState<any[]>([]);

  const handleLogoFilesChange = (files: any[]) => {
    if (files.length > 0 && files[0].cloudinaryUrl) {
      const newData = { ...localData, logoUrl: files[0].cloudinaryUrl };
      setLocalData(newData);
      updateFormData('step6', newData);
    }
  };

  const handleBannerFilesChange = (files: any[]) => {
    if (files.length > 0 && files[0].cloudinaryUrl) {
      const newData = { ...localData, bannerUrl: files[0].cloudinaryUrl };
      setLocalData(newData);
      updateFormData('step6', newData);
    }
  };

  const handleFieldChange = (field: keyof ImagesBrandingData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('step6', newData);
  };

  const handleSocialMediaChange = (platform: keyof ImagesBrandingData['socialMedia'], value: string) => {
    const newSocialMedia = { ...localData.socialMedia, [platform]: value };
    const newData = { ...localData, socialMedia: newSocialMedia };
    setLocalData(newData);
    updateFormData('step6', newData);
  };

  const handleBack = () => {
    setCurrentStep(5);
    router.back();
  };

  const handleContinue = () => {
    // Images are optional, so we can proceed without validation
    updateFormData('step6', localData);
    setCurrentStep(7);
    router.push('./documents');
  };

  const isFormValid = true; // Images are optional

  return (
    <Screen backgroundColor="#FFFAF0">
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button */}
        <BackButton 
          onPress={handleBack} 
          style={styles.backButton}
        />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Container padding="lg">
            {/* Header */}
            <View style={styles.header}>
              <Text 
                variant="title" 
                style={styles.title}
              >
                Showcase your business
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Add images and social media links to make your business stand out
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              {/* Business Logo */}
              <UploadComponent
                title="Business Logo"
                description="Upload your business logo (Square image, 300x300px recommended)"
                uploadType={UploadType.MEAL_IMAGE}
                maxFiles={1}
                allowedTypes={['image']}
                onFilesChange={handleLogoFilesChange}
                files={logoFiles}
                folder="partner-images/logos"
              />

              {/* Business Banner */}
              <UploadComponent
                title="Business Banner"
                description="Upload a banner image (16:9 ratio, 800x450px recommended)"
                uploadType={UploadType.MEAL_IMAGE}
                maxFiles={1}
                allowedTypes={['image']}
                onFilesChange={handleBannerFilesChange}
                files={bannerFiles}
                folder="partner-images/banners"
              />

              {/* Social Media Links */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Social Media Links (Optional)
              </Text>

              {/* Instagram */}
              <View style={styles.socialSection}>
                <View style={styles.socialHeader}>
                  <Text style={styles.socialIcon}>📷</Text>
                  <Text variant="body" style={styles.socialLabel}>Instagram</Text>
                </View>
                <Input
                  value={localData.socialMedia.instagram || ''}
                  onChangeText={(value: string) => handleSocialMediaChange('instagram', value)}
                  placeholder="@your_instagram_handle"
                  containerStyle={styles.inputMargin}
                />
              </View>

              {/* Facebook */}
              <View style={styles.socialSection}>
                <View style={styles.socialHeader}>
                  <Text style={styles.socialIcon}>📘</Text>
                  <Text variant="body" style={styles.socialLabel}>Facebook</Text>
                </View>
                <Input
                  value={localData.socialMedia.facebook || ''}
                  onChangeText={(value: string) => handleSocialMediaChange('facebook', value)}
                  placeholder="facebook.com/your-page"
                  containerStyle={styles.inputMargin}
                />
              </View>

              {/* Twitter */}
              <View style={styles.socialSectionLast}>
                <View style={styles.socialHeader}>
                  <Text style={styles.socialIcon}>🐦</Text>
                  <Text variant="body" style={styles.socialLabel}>Twitter</Text>
                </View>
                <Input
                  value={localData.socialMedia.twitter || ''}
                  onChangeText={(value: string) => handleSocialMediaChange('twitter', value)}
                  placeholder="@your_twitter_handle"
                  containerStyle={styles.inputMargin}
                />
              </View>

              {/* Continue Button */}
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isFormValid}
                fullWidth
                style={styles.buttonMargin}
              />
            </Card>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 22,
  },
  card: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  socialSection: {
    marginBottom: 16,
  },
  socialSectionLast: {
    marginBottom: 24,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  socialLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
  },
  inputMargin: {
    marginBottom: 8,
  },
  buttonMargin: {
    marginBottom: 16,
  },
});