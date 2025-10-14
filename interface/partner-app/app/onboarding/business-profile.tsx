import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import CustomDateTimePicker from '../../components/ui/DateTimePicker';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, BusinessProfileData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const businessTypes = [
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'Traditional dine-in restaurant',
    icon: '🏪',
  },
  {
    id: 'cloud_kitchen',
    title: 'Cloud Kitchen',
    description: 'Delivery-only kitchen',
    icon: '🍳',
  },
  {
    id: 'catering',
    title: 'Catering Service',
    description: 'Event and party catering',
    icon: '🎉',
  },
  {
    id: 'home_chef',
    title: 'Home Chef',
    description: 'Home-based cooking service',
    icon: '👩‍🍳',
  },
];

const BusinessProfile: React.FC = () => {
  const { theme } = useTheme();
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setError, 
    clearError, 
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<BusinessProfileData>(() => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 1); // Default to 1 year ago
    
    return formData.step3 || {
      businessName: '',
      businessType: ['restaurant'],
      description: '',
      establishedDate: defaultDate.toISOString().split('T')[0], // YYYY-MM-DD format
    };
  });

  const [errors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof BusinessProfileData, value: string | number | ('restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')[]): string => {
    switch (field) {
      case 'businessName':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Business name is required';
        if (typeof value === 'string' && value.trim().length < 2) return 'Business name must be at least 2 characters';
        return '';
      case 'businessType':
        if (!Array.isArray(value) || value.length === 0) return 'Please select at least one business type';
        return '';
      case 'description':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Business description is required';
        if (typeof value === 'string' && value.trim().length < 10) return 'Description must be at least 10 characters';
        if (typeof value === 'string' && value.trim().length > 500) return 'Description must be less than 500 characters';
        return '';
      case 'establishedDate':
        if (!value || typeof value !== 'string') return 'Establishment date is required';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Please enter a valid date';
        if (date.getFullYear() < 1900) return 'Please enter a date after 1900';
        if (date > new Date()) return 'Date cannot be in the future';
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof BusinessProfileData, value: string | number | ('restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    
    // Immediately update store for real-time persistence
    updateFormData('step3', newData);
    
    // Validate field
    const error = validateField(field, value);
    if (error) {
      setLocalErrors(prev => ({ ...prev, [field]: error }));
      setError(field, error);
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      clearError(field);
    }
  };

  const handleDateChange = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    handleFieldChange('establishedDate', dateString);
  };

  const handleBusinessTypeSelect = (businessType: 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef') => {
    const currentTypes = localData.businessType;
    let newTypes: ('restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')[];
    
    if (currentTypes.includes(businessType)) {
      // Remove if already selected
      newTypes = currentTypes.filter(type => type !== businessType);
    } else {
      // Add if not selected
      newTypes = [...currentTypes, businessType];
    }
    
    // Ensure at least one business type is selected
    if (newTypes.length === 0) {
      newTypes = ['restaurant']; // Default to restaurant if none selected
    }
    
    handleFieldChange('businessType', newTypes);
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.back();
  };

  const handleContinue = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(localData).forEach((field) => {
      const error = validateField(field as keyof BusinessProfileData, localData[field as keyof BusinessProfileData]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setLocalErrors(newErrors);
      return;
    }

    // Save data and proceed
    updateFormData('step3', localData);
    setCurrentStep(4);
    router.push('./location-hours');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.businessName.trim() && 
    localData.businessType.length > 0 &&
    localData.description.trim() && 
    localData.establishedDate &&
    new Date(localData.establishedDate).getFullYear() >= 1900 &&
    new Date(localData.establishedDate) <= new Date();

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
                Tell us about your business
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Help us understand your business better to provide you with the best experience
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              {/* Business Name */}
              <Input
                label="Business Name"
                value={localData.businessName}
                onChangeText={(value) => handleFieldChange('businessName', value)}
                placeholder="Enter your business name"
                error={errors.businessName}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Business Type */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text 
                }}
              >
                Business Type
              </Text>
              <Text 
                variant="caption" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.textSecondary 
                }}
              >
                Select all that apply to your business
              </Text>
              <View style={{ marginBottom: theme.spacing.lg }}>
                {businessTypes.map((type) => {
                  const isSelected = localData.businessType.includes(type.id as 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef');
                  return (
                    <TouchableOpacity
                      key={type.id}
                      onPress={() => handleBusinessTypeSelect(type.id as 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: theme.spacing.md,
                        borderWidth: 2,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.background,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      <Text style={{ fontSize: 24, marginRight: theme.spacing.md }}>
                        {type.icon}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text 
                          variant="subtitle" 
                          style={{ 
                            color: isSelected ? theme.colors.primary : theme.colors.text,
                            marginBottom: theme.spacing.xs 
                          }}
                        >
                          {type.title}
                        </Text>
                        <Text 
                          variant="caption" 
                          style={{ 
                            color: isSelected ? theme.colors.primary : theme.colors.textSecondary 
                          }}
                        >
                          {type.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <Icon name="check" size={20} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Description */}
              <Input
                label="Business Description"
                value={localData.description}
                onChangeText={(value) => handleFieldChange('description', value)}
                placeholder="Describe your business, cuisine, specialties..."
                multiline
                numberOfLines={4}
                error={errors.description}
                style={{ marginBottom: theme.spacing.md }}
              />
              
              {/* Character count */}
              <Text 
                variant="caption" 
                style={{ 
                  textAlign: 'right',
                  color: localData.description.length > 500 ? theme.colors.error : theme.colors.textSecondary,
                  marginBottom: theme.spacing.lg 
                }}
              >
                {localData.description.length}/500 characters
              </Text>

              {/* Establishment Date */}
              <CustomDateTimePicker
                label="Establishment Date"
                mode="date"
                value={localData.establishedDate ? new Date(localData.establishedDate) : new Date()}
                onChange={handleDateChange}
                placeholder="Select establishment date"
                error={errors.establishedDate}
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
                style={{ marginBottom: theme.spacing.lg }}
              />

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

export default BusinessProfile;
