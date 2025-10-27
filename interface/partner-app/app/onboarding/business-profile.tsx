import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import CustomDateTimePicker from '../../components/ui/DateTimePicker';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, BusinessProfileData } from '../../store/onboardingStore';

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

export default function BusinessProfile() {
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
    
    return formData.step2 || {
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
    updateFormData('step2', newData);
    
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
    setCurrentStep(1);
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
    updateFormData('step2', localData);
    setCurrentStep(3);
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
    <Screen backgroundColor="#FFFAF0">
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button */}
        <BackButton 
          onPress={() => router.back()} 
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
                Tell us about your business
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Help us understand your business better to provide you with the best experience
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              {/* Business Name */}
              <Input
                label="Business Name"
                value={localData.businessName}
                onChangeText={(value: string) => handleFieldChange('businessName', value)}
                placeholder="Enter your business name"
                error={errors.businessName}
                containerStyle={styles.inputMargin}
              />

              {/* Business Type */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Business Type
              </Text>
              <Text 
                variant="caption" 
                style={styles.sectionDescription}
              >
                Select all that apply to your business
              </Text>
              <View style={styles.businessTypeContainer}>
                {businessTypes.map((type) => {
                  const isSelected = localData.businessType.includes(type.id as 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef');
                  return (
                    <TouchableOpacity
                      key={type.id}
                      onPress={() => handleBusinessTypeSelect(type.id as 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')}
                      style={[
                        styles.businessTypeCard,
                        isSelected && styles.businessTypeCardSelected
                      ]}
                    >
                      <Text style={styles.businessTypeIcon}>
                        {type.icon}
                      </Text>
                      <View style={styles.businessTypeContent}>
                        <Text 
                          style={isSelected ? styles.businessTypeTitleSelected : styles.businessTypeTitle}
                        >
                          {type.title}
                        </Text>
                        <Text 
                          style={isSelected ? styles.businessTypeDescriptionSelected : styles.businessTypeDescription}
                        >
                          {type.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <Icon name="check" size={20} color="#FF9B42" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Description */}
              <Input
                label="Business Description"
                value={localData.description}
                onChangeText={(value: string) => handleFieldChange('description', value)}
                placeholder="Describe your business, cuisine, specialties..."
                multiline
                numberOfLines={4}
                error={errors.description}
                containerStyle={styles.inputMargin}
              />
              
              {/* Character count */}
              <Text 
                variant="caption" 
                style={localData.description.length > 500 ? styles.characterCountError : styles.characterCount}
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
                style={styles.datePickerMargin}
              />

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
  inputMargin: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  sectionDescription: {
    marginBottom: 16,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  businessTypeContainer: {
    marginBottom: 24,
  },
  businessTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  businessTypeCardSelected: {
    borderColor: '#FF9B42',
    backgroundColor: '#FFF8F0',
  },
  businessTypeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  businessTypeContent: {
    flex: 1,
  },
  businessTypeTitle: {
    marginBottom: 4,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  businessTypeTitleSelected: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9B42',
  },
  businessTypeDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  businessTypeDescriptionSelected: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FF9B42',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 24,
  },
  characterCountError: {
    color: '#EF4444',
  },
  datePickerMargin: {
    marginBottom: 24,
  },
  buttonMargin: {
    marginBottom: 16,
  },
});
