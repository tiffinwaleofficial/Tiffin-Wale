import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Switch } from '../../components/ui/Switch';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, LocationHoursData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30', '00:00'
];

const LocationHours: React.FC = () => {
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

  const [localData, setLocalData] = useState<LocationHoursData>(
    formData.step4 || {
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
      businessHours: {
        open: '09:00',
        close: '22:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      deliveryRadius: 5,
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string | number): string => {
    switch (field) {
      case 'street':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Street address is required';
        return '';
      case 'city':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'City is required';
        return '';
      case 'state':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'State is required';
        return '';
      case 'postalCode':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Postal code is required';
        if (typeof value === 'string' && !/^[0-9]{6}$/.test(value.replace(/\D/g, ''))) return 'Please enter a valid 6-digit postal code';
        return '';
      case 'days':
        if (!localData.businessHours.days.length) return 'Please select at least one operating day';
        return '';
      default:
        return '';
    }
  };

  const handleAddressChange = (field: keyof LocationHoursData['address'], value: string) => {
    const newAddress = { ...localData.address, [field]: value };
    const newData = { ...localData, address: newAddress };
    setLocalData(newData);
    
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

  const handleDayToggle = (day: string) => {
    const newDays = localData.businessHours.days.includes(day)
      ? localData.businessHours.days.filter(d => d !== day)
      : [...localData.businessHours.days, day];
    
    const newBusinessHours = { ...localData.businessHours, days: newDays };
    const newData = { ...localData, businessHours: newBusinessHours };
    setLocalData(newData);
    
    // Validate days
    const error = validateField('days', '');
    if (error) {
      setLocalErrors(prev => ({ ...prev, days: error }));
      setError('days', error);
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.days;
        return newErrors;
      });
      clearError('days');
    }
  };

  const handleTimeChange = (type: 'open' | 'close', time: string) => {
    const newBusinessHours = { ...localData.businessHours, [type]: time };
    const newData = { ...localData, businessHours: newBusinessHours };
    setLocalData(newData);
  };

  const handleDeliveryRadiusChange = (radius: number) => {
    const newData = { ...localData, deliveryRadius: radius };
    setLocalData(newData);
  };

  const handleBack = () => {
    setCurrentStep(3);
    router.back();
  };

  const handleContinue = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    // Validate address fields
    Object.keys(localData.address).forEach((field) => {
      if (field !== 'country') { // Country is pre-filled
        const error = validateField(field, localData.address[field as keyof typeof localData.address]);
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      }
    });

    // Validate business days
    const daysError = validateField('days', '');
    if (daysError) {
      newErrors.days = daysError;
      hasErrors = true;
    }

    if (hasErrors) {
      setLocalErrors(newErrors);
      return;
    }

    // Save data and proceed
    updateFormData('step4', localData);
    setCurrentStep(5);
    router.push('./cuisine-services');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.address.street.trim() && 
    localData.address.city.trim() && 
    localData.address.state.trim() && 
    localData.address.postalCode.trim() && 
    localData.businessHours.days.length > 0;

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
                Where is your business located?
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Tell us your business address and operating hours
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              {/* Address Section */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Business Address
              </Text>

              <Input
                label="Street Address"
                value={localData.address.street}
                onChangeText={(value) => handleAddressChange('street', value)}
                placeholder="Enter your street address"
                error={errors.street}
                style={{ marginBottom: theme.spacing.md }}
              />

              <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
                <View style={{ flex: 2, marginRight: theme.spacing.sm }}>
                  <Input
                    label="City"
                    value={localData.address.city}
                    onChangeText={(value) => handleAddressChange('city', value)}
                    placeholder="Enter city"
                    error={errors.city}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Input
                    label="State"
                    value={localData.address.state}
                    onChangeText={(value) => handleAddressChange('state', value)}
                    placeholder="Enter state"
                    error={errors.state}
                  />
                </View>
              </View>

              <Input
                label="Postal Code"
                value={localData.address.postalCode}
                onChangeText={(value) => handleAddressChange('postalCode', value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit postal code"
                type="numeric"
                error={errors.postalCode}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Business Hours Section */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Operating Hours
              </Text>

              {/* Operating Days */}
              <Text 
                variant="body" 
                style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.textSecondary 
                }}
              >
                Select operating days
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                marginBottom: theme.spacing.md 
              }}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() => handleDayToggle(day.id)}
                    style={{
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                      marginRight: theme.spacing.sm,
                      marginBottom: theme.spacing.sm,
                      borderWidth: 1,
                      borderColor: localData.businessHours.days.includes(day.id) 
                        ? theme.colors.primary 
                        : theme.colors.border,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: localData.businessHours.days.includes(day.id) 
                        ? theme.colors.primary + '10' 
                        : theme.colors.background,
                    }}
                  >
                    <Text 
                      variant="caption" 
                      style={{ 
                        color: localData.businessHours.days.includes(day.id) 
                          ? theme.colors.primary 
                          : theme.colors.textSecondary 
                      }}
                    >
                      {day.label.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.days && (
                <Text variant="caption" style={{ color: theme.colors.error, marginBottom: theme.spacing.md }}>
                  {errors.days}
                </Text>
              )}

              {/* Operating Times */}
              <View style={{ flexDirection: 'row', marginBottom: theme.spacing.lg }}>
                <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                  <Text 
                    variant="body" 
                    style={{ 
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.textSecondary 
                    }}
                  >
                    Opening Time
                  </Text>
                  <View style={{ 
                    borderWidth: 1, 
                    borderColor: theme.colors.border, 
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.sm 
                  }}>
                    <Text variant="body" style={{ color: theme.colors.text }}>
                      {localData.businessHours.open}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Text 
                    variant="body" 
                    style={{ 
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.textSecondary 
                    }}
                  >
                    Closing Time
                  </Text>
                  <View style={{ 
                    borderWidth: 1, 
                    borderColor: theme.colors.border, 
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.sm 
                  }}>
                    <Text variant="body" style={{ color: theme.colors.text }}>
                      {localData.businessHours.close}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Delivery Radius */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Delivery Radius
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.textSecondary 
                }}
              >
                {localData.deliveryRadius} km
              </Text>
              <View style={{ 
                height: 4, 
                backgroundColor: theme.colors.border, 
                borderRadius: 2,
                marginBottom: theme.spacing.lg 
              }}>
                <View style={{ 
                  height: '100%', 
                  backgroundColor: theme.colors.primary, 
                  borderRadius: 2,
                  width: `${(localData.deliveryRadius / 20) * 100}%`
                }} />
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

export default LocationHours;
