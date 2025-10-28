import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Switch } from '../../components/ui/Switch';
import CustomDateTimePicker from '../../components/ui/DateTimePicker';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, LocationHoursData } from '../../store/onboardingStore';

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

export default function LocationHours() {
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
    (formData.step3 as unknown as LocationHoursData) || {
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

  // Ensure we're on step 3 when this component loads
  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

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

  const handleTimeChange = (type: 'open' | 'close', date: Date) => {
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newBusinessHours = { ...localData.businessHours, [type]: timeString };
    const newData = { ...localData, businessHours: newBusinessHours };
    setLocalData(newData);
    updateFormData('step3', newData);
  };

  const handleDeliveryRadiusChange = (radius: number) => {
    const newData = { ...localData, deliveryRadius: radius };
    setLocalData(newData);
    updateFormData('step3', newData);
    
    // Validate delivery radius
    if (radius <= 0) {
      setLocalErrors(prev => ({ ...prev, deliveryRadius: 'Delivery radius must be at least 1 km' }));
      setError('deliveryRadius', 'Delivery radius must be at least 1 km');
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.deliveryRadius;
        return newErrors;
      });
      clearError('deliveryRadius');
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
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
    updateFormData('step3', localData);
    setCurrentStep(4);
    router.push('./cuisine-services');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.address.street.trim() && 
    localData.address.city.trim() && 
    localData.address.state.trim() && 
    localData.address.postalCode.trim() && 
    localData.businessHours.days.length > 0 &&
    localData.deliveryRadius > 0;

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
                Where is your business located?
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Tell us your business address and operating hours
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              {/* Address Section */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Business Address
              </Text>

              <Input
                label="Street Address"
                value={localData.address.street}
                onChangeText={(value: string) => handleAddressChange('street', value)}
                placeholder="Enter your street address"
                multiline
                numberOfLines={3}
                error={errors.street}
                containerStyle={styles.inputMargin}
              />

                  <Input
                    label="City"
                    value={localData.address.city}
                onChangeText={(value: string) => handleAddressChange('city', value)}
                    placeholder="Enter city"
                    error={errors.city}
                containerStyle={styles.inputMargin}
                  />

                  <Input
                    label="State"
                    value={localData.address.state}
                onChangeText={(value: string) => handleAddressChange('state', value)}
                    placeholder="Enter state"
                    error={errors.state}
                containerStyle={styles.inputMargin}
                  />

              <Input
                label="Postal Code"
                value={localData.address.postalCode}
                onChangeText={(value: string) => handleAddressChange('postalCode', value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit postal code"
                keyboardType="numeric"
                error={errors.postalCode}
                containerStyle={styles.inputMargin}
              />

              {/* Business Hours Section */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Operating Hours
              </Text>

              {/* Operating Days */}
              <Text 
                variant="body" 
                style={styles.sectionDescription}
              >
                Select operating days
              </Text>
              <View style={styles.dayContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() => handleDayToggle(day.id)}
                    style={[
                      styles.dayTag,
                      localData.businessHours.days.includes(day.id) ? styles.dayTagSelected : styles.dayTagUnselected
                    ]}
                  >
                    <Text 
                      style={{ 
                        ...styles.dayTagText,
                        ...(localData.businessHours.days.includes(day.id) ? styles.dayTagTextSelected : styles.dayTagTextUnselected)
                      }}
                    >
                      {day.label.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.days && (
                <Text variant="caption" style={styles.errorText}>
                  {errors.days}
                </Text>
              )}

              {/* Operating Times */}
              <View style={styles.timeRow}>
                <View style={styles.timePicker}>
                  <CustomDateTimePicker
                    label="Opening Time"
                    mode="time"
                    value={new Date(`2000-01-01T${localData.businessHours.open}:00`)}
                    onChange={(date) => handleTimeChange('open', date)}
                    placeholder="Select opening time"
                  />
                </View>
                <View style={styles.timePickerLast}>
                  <CustomDateTimePicker
                    label="Closing Time"
                    mode="time"
                    value={new Date(`2000-01-01T${localData.businessHours.close}:00`)}
                    onChange={(date) => handleTimeChange('close', date)}
                    placeholder="Select closing time"
                  />
                </View>
              </View>

              {/* Delivery Radius */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Delivery Radius
              </Text>
              
              <Input
                label={`Delivery Radius: ${localData.deliveryRadius || 0} km`}
                value={localData.deliveryRadius ? localData.deliveryRadius.toString() : ''}
                onChangeText={(value) => {
                  if (value === '') {
                    // Allow empty field
                    handleDeliveryRadiusChange(0);
                    return;
                  }
                  const radius = parseInt(value);
                  if (!isNaN(radius) && radius >= 0 && radius <= 50) {
                    handleDeliveryRadiusChange(radius);
                  }
                }}
                placeholder="Enter delivery radius (1-50 km)"
                keyboardType="numeric"
                error={errors.deliveryRadius}
                containerStyle={styles.inputMargin}
              />
              
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((localData.deliveryRadius / 50) * 100, 100)}%` }]} />
                <Text style={styles.progressText}>
                  Max: 50km
                </Text>
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
  sectionDescription: {
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  inputMargin: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
    marginRight: 8,
  },
  inputTwoThirds: {
    flex: 2,
  },
  inputHalfLast: {
    marginLeft: 8,
  },
  inputOneThird: {
    flex: 1,
  },
  dayTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  dayTagSelected: {
    borderColor: '#FF9B42',
    backgroundColor: '#FFF8F0',
  },
  dayTagUnselected: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFAF0',
  },
  dayTagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  dayTagTextSelected: {
    color: '#FF9B42',
  },
  dayTagTextUnselected: {
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timePicker: {
    flex: 1,
    marginRight: 8,
  },
  timePickerLast: {
    marginRight: 0,
    marginLeft: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 24,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9B42',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  buttonMargin: {
    marginBottom: 16,
  },
  dayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
});
