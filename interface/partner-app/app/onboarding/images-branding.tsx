import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Image } from '../../components/ui/Image';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, ImagesBrandingData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

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
      socialMedia: {},
    }
  );

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const requestImagePermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need camera roll permissions to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async (type: 'logo' | 'banner') => {
    const hasPermission = await requestImagePermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Image',
      'Choose how you want to select your image',
      [
        { text: 'Camera', onPress: () => openCamera(type) },
        { text: 'Photo Library', onPress: () => openImageLibrary(type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async (type: 'logo' | 'banner') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0], type);
    }
  };

  const openImageLibrary = async (type: 'logo' | 'banner') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0], type);
    }
  };

  const uploadImage = async (asset: ImagePicker.ImagePickerAsset, type: 'logo' | 'banner') => {
    try {
      if (type === 'logo') {
        setIsUploadingLogo(true);
      } else {
        setIsUploadingBanner(true);
      }

      // TODO: Implement actual image upload to Cloudinary
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const imageUrl = `https://via.placeholder.com/${type === 'logo' ? '300x300' : '800x450'}/FF9F43/FFFFFF?text=${type === 'logo' ? 'LOGO' : 'BANNER'}`;
      
      if (type === 'logo') {
        setLocalData({ ...localData, logoUrl: imageUrl });
        setIsUploadingLogo(false);
      } else {
        setLocalData({ ...localData, bannerUrl: imageUrl });
        setIsUploadingBanner(false);
      }

      Alert.alert('Success', `${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
    } catch (error) {
      if (type === 'logo') {
        setIsUploadingLogo(false);
      } else {
        setIsUploadingBanner(false);
      }
      Alert.alert('Error', `Failed to upload ${type}. Please try again.`);
    }
  };

  const handleSocialMediaChange = (platform: keyof ImagesBrandingData['socialMedia'], value: string) => {
    const newSocialMedia = { ...localData.socialMedia, [platform]: value };
    setLocalData({ ...localData, socialMedia: newSocialMedia });
  };

  const handleBack = () => {
    setCurrentStep(5);
    router.back();
  };

  const handleContinue = () => {
    // Save data and proceed (this step is optional)
    updateFormData('step6', localData);
    setCurrentStep(7);
    router.push('./documents');
  };

  const handleSkip = () => {
    // Skip this step and proceed
    updateFormData('step6', localData);
    setCurrentStep(7);
    router.push('./documents');
  };

  return (
    <Screen backgroundColor={theme.colors.background}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button */}
        <BackButton 
          onPress={() => router.back()} 
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
              {/* Logo Upload */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Business Logo
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.textSecondary 
                }}
              >
                Upload your business logo (Square image, 300x300px recommended)
              </Text>

              <TouchableOpacity
                onPress={() => pickImage('logo')}
                disabled={isUploadingLogo}
                style={{
                  borderWidth: 2,
                  borderColor: theme.colors.border,
                  borderStyle: 'dashed',
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.lg,
                  backgroundColor: theme.colors.background,
                  minHeight: 120,
                }}
              >
                {localData.logoUrl ? (
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={localData.logoUrl}
                      width={80}
                      height={80}
                      borderRadius={40}
                      style={{ marginBottom: theme.spacing.sm }}
                    />
                    <Text variant="caption" style={{ color: theme.colors.primary }}>
                      Tap to change logo
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    {isUploadingLogo ? (
                      <>
                        <Icon name="loading" size={32} color={theme.colors.primary} />
                        <Text variant="caption" style={{ color: theme.colors.primary, marginTop: theme.spacing.sm }}>
                          Uploading...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Icon name="camera" size={32} color={theme.colors.textSecondary} />
                        <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                          Tap to upload logo
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </TouchableOpacity>

              {/* Banner Upload */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Business Banner
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.textSecondary 
                }}
              >
                Upload a banner image (16:9 ratio, 800x450px recommended)
              </Text>

              <TouchableOpacity
                onPress={() => pickImage('banner')}
                disabled={isUploadingBanner}
                style={{
                  borderWidth: 2,
                  borderColor: theme.colors.border,
                  borderStyle: 'dashed',
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.lg,
                  backgroundColor: theme.colors.background,
                  minHeight: 120,
                }}
              >
                {localData.bannerUrl ? (
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={localData.bannerUrl}
                      width={120}
                      height={68}
                      borderRadius={8}
                      style={{ marginBottom: theme.spacing.sm }}
                    />
                    <Text variant="caption" style={{ color: theme.colors.primary }}>
                      Tap to change banner
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    {isUploadingBanner ? (
                      <>
                        <Icon name="loading" size={32} color={theme.colors.primary} />
                        <Text variant="caption" style={{ color: theme.colors.primary, marginTop: theme.spacing.sm }}>
                          Uploading...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Icon name="image" size={32} color={theme.colors.textSecondary} />
                        <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                          Tap to upload banner
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </TouchableOpacity>

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

              <Input
                label="Instagram"
                value={localData.socialMedia.instagram || ''}
                onChangeText={(value) => handleSocialMediaChange('instagram', value)}
                placeholder="@your_instagram_handle"
                leftIcon="📷"
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="Facebook"
                value={localData.socialMedia.facebook || ''}
                onChangeText={(value) => handleSocialMediaChange('facebook', value)}
                placeholder="facebook.com/your-page"
                leftIcon="📘"
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="Twitter"
                value={localData.socialMedia.twitter || ''}
                onChangeText={(value) => handleSocialMediaChange('twitter', value)}
                placeholder="@your_twitter_handle"
                leftIcon="🐦"
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
                <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                  <Button
                    title="Skip"
                    variant="outline"
                    onPress={handleSkip}
                    fullWidth
                  />
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Button
                    title="Continue"
                    onPress={handleContinue}
                    fullWidth
                  />
                </View>
              </View>
            </Card>

            {/* Back Button */}
            <View style={{ alignItems: 'center' }}>
              <Button
                title="Back"
                variant="outline"
                onPress={handleBack}
                style={{ minWidth: 120 }}
              />
            </View>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ImagesBranding;
