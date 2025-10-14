import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import UploadComponent from '../../components/ui/UploadComponent';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, ImagesBrandingData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';
import { UploadType, cloudinaryUploadService } from '../../services/cloudinaryUploadService';

const ImagesBranding: React.FC = () => {
  const { theme } = useTheme();
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<ImagesBrandingData>(
    formData.step6 || {
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
    <Screen backgroundColor={theme.colors.background}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button */}
        <BackButton 
          onPress={handleBack} 
          style={{ marginTop: 16, marginLeft: 16 }}
        />
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Container padding="lg">
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
              <Text 
                variant="title" 
                style={{ 
                  textAlign: 'center', 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text 
                }}
              >
                Showcase your business
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Add images and social media links to make your business stand out
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
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
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Social Media Links (Optional)
              </Text>

              {/* Instagram */}
              <View style={{ marginBottom: theme.spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>📷</Text>
                  <Text variant="body" style={{ color: theme.colors.text }}>Instagram</Text>
                </View>
                <Input
                  value={localData.socialMedia.instagram || ''}
                  onChangeText={(value) => handleSocialMediaChange('instagram', value)}
                  placeholder="@your_instagram_handle"
                  style={{ marginBottom: theme.spacing.sm }}
                />
              </View>

              {/* Facebook */}
              <View style={{ marginBottom: theme.spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>📘</Text>
                  <Text variant="body" style={{ color: theme.colors.text }}>Facebook</Text>
                </View>
                <Input
                  value={localData.socialMedia.facebook || ''}
                  onChangeText={(value) => handleSocialMediaChange('facebook', value)}
                  placeholder="facebook.com/your-page"
                  style={{ marginBottom: theme.spacing.sm }}
                />
              </View>

              {/* Twitter */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>🐦</Text>
                  <Text variant="body" style={{ color: theme.colors.text }}>Twitter</Text>
                </View>
                <Input
                  value={localData.socialMedia.twitter || ''}
                  onChangeText={(value) => handleSocialMediaChange('twitter', value)}
                  placeholder="@your_twitter_handle"
                  style={{ marginBottom: theme.spacing.sm }}
                />
              </View>

              {/* Continue Button */}
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isFormValid}
                fullWidth
                style={{ marginBottom: theme.spacing.md }}
              />
            </Card>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ImagesBranding;