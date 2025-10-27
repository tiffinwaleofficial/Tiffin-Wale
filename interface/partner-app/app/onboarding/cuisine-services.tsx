import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Switch } from '../../components/ui/Switch';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, CuisineServicesData } from '../../store/onboardingStore';

const cuisineTypes = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'American',
  'Continental', 'South Indian', 'North Indian', 'Gujarati', 'Punjabi',
  'Bengali', 'Rajasthani', 'Maharashtrian', 'Street Food', 'Fast Food',
  'Healthy', 'Vegan', 'Keto', 'Gluten Free', 'Desserts', 'Beverages'
];

export default function CuisineServices() {
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setError, 
    clearError, 
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<CuisineServicesData>(
    (formData.step5 as unknown as CuisineServicesData) || {
      cuisineTypes: [],
      isVegetarian: false,
      hasDelivery: true,
      hasPickup: true,
      acceptsCash: true,
      acceptsCard: true,
      minimumOrderAmount: 100,
      deliveryFee: 0,
      estimatedDeliveryTime: 30,
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'cuisineTypes':
        if (!localData.cuisineTypes.length) return 'Please select at least one cuisine type';
        return '';
      case 'services':
        if (!localData.hasDelivery && !localData.hasPickup) return 'Please select at least one service option';
        return '';
      case 'paymentMethods':
        if (!localData.acceptsCash && !localData.acceptsCard) return 'Please select at least one payment method';
        return '';
      case 'minimumOrderAmount':
        if (value < 50) return 'Minimum order amount must be at least ₹50';
        if (value > 1000) return 'Minimum order amount cannot exceed ₹1000';
        return '';
      case 'deliveryFee':
        if (value < 0) return 'Delivery fee cannot be negative';
        if (value > 200) return 'Delivery fee cannot exceed ₹200';
        return '';
      case 'estimatedDeliveryTime':
        if (value < 15) return 'Estimated delivery time must be at least 15 minutes';
        if (value > 120) return 'Estimated delivery time cannot exceed 120 minutes';
        return '';
      default:
        return '';
    }
  };

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisineTypes = localData.cuisineTypes.includes(cuisine)
      ? localData.cuisineTypes.filter(c => c !== cuisine)
      : [...localData.cuisineTypes, cuisine];
    
    const newData = { ...localData, cuisineTypes: newCuisineTypes };
    setLocalData(newData);
    updateFormData('step5', newData);
    
    // Validate cuisine types with new data
    const error = !newCuisineTypes.length ? 'Please select at least one cuisine type' : '';
    if (error) {
      setLocalErrors(prev => ({ ...prev, cuisineTypes: error }));
      setError('cuisineTypes', error);
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cuisineTypes;
        return newErrors;
      });
      clearError('cuisineTypes');
    }
  };

  const handleServiceToggle = (service: 'hasDelivery' | 'hasPickup', value: boolean) => {
    const newData = { ...localData, [service]: value };
    setLocalData(newData);
    
    // Validate services
    const error = validateField('services', '');
    if (error) {
      setLocalErrors(prev => ({ ...prev, services: error }));
      setError('services', error);
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });
      clearError('services');
    }
  };

  const handlePaymentToggle = (method: 'acceptsCash' | 'acceptsCard', value: boolean) => {
    const newData = { ...localData, [method]: value };
    setLocalData(newData);
    
    // Validate payment methods
    const error = validateField('paymentMethods', '');
    if (error) {
      setLocalErrors(prev => ({ ...prev, paymentMethods: error }));
      setError('paymentMethods', error);
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentMethods;
        return newErrors;
      });
      clearError('paymentMethods');
    }
  };

  const handleNumericChange = (field: 'minimumOrderAmount' | 'deliveryFee' | 'estimatedDeliveryTime', value: string) => {
    const numValue = parseInt(value.replace(/\D/g, '')) || 0;
    const newData = { ...localData, [field]: numValue };
    setLocalData(newData);
    
    // Validate field
    const error = validateField(field, numValue);
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

  const handleBack = () => {
    setCurrentStep(4);
    router.back();
  };

  const handleContinue = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    // Validate cuisine types
    const cuisineError = validateField('cuisineTypes', '');
    if (cuisineError) {
      newErrors.cuisineTypes = cuisineError;
      hasErrors = true;
    }

    // Validate services
    const servicesError = validateField('services', '');
    if (servicesError) {
      newErrors.services = servicesError;
      hasErrors = true;
    }

    // Validate payment methods
    const paymentError = validateField('paymentMethods', '');
    if (paymentError) {
      newErrors.paymentMethods = paymentError;
      hasErrors = true;
    }

    // Validate numeric fields
    ['minimumOrderAmount', 'deliveryFee', 'estimatedDeliveryTime'].forEach((field) => {
      const error = validateField(field, localData[field as keyof CuisineServicesData]);
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
    updateFormData('step5', localData);
    setCurrentStep(6);
    router.push('./images-branding');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.cuisineTypes.length > 0 && 
    (localData.hasDelivery || localData.hasPickup) && 
    (localData.acceptsCash || localData.acceptsCard);

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
                What do you serve?
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Tell us about your cuisine and service options
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              {/* Cuisine Types */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Cuisine Types
              </Text>
              <Text 
                variant="body" 
                style={styles.sectionDescription}
              >
                Select all that apply
              </Text>
              <View style={styles.cuisineContainer}>
                {cuisineTypes.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    onPress={() => handleCuisineToggle(cuisine)}
                    style={localData.cuisineTypes.includes(cuisine) ? styles.cuisineTagSelected : styles.cuisineTagUnselected}
                  >
                    <Text 
                      style={{ 
                        ...styles.cuisineTagText,
                        ...(localData.cuisineTypes.includes(cuisine) ? styles.cuisineTagTextSelected : styles.cuisineTagTextUnselected)
                      }}
                    >
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.cuisineTypes && (
                <Text variant="caption" style={styles.errorText}>
                  {errors.cuisineTypes}
                </Text>
              )}

              {/* Vegetarian Option */}
              <View style={styles.switchContainer}>
                <View style={styles.switchContent}>
                  <Text variant="subtitle" style={styles.switchLabel}>
                    Vegetarian Only
                  </Text>
                  <Text variant="caption" style={styles.switchDescription}>
                    Check if you serve only vegetarian food
                  </Text>
                </View>
                <Switch
                  value={localData.isVegetarian}
                  onValueChange={(value) => setLocalData({ ...localData, isVegetarian: value })}
                />
              </View>

              {/* Service Options */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Service Options
              </Text>
              
              <View style={styles.switchRow}>
                <View style={styles.switchContent}>
                  <Text variant="body" style={styles.switchLabel}>
                    🚚 Delivery
                  </Text>
                  <Text variant="caption" style={styles.switchDescription}>
                    Deliver food to customers
                  </Text>
                </View>
                <Switch
                  value={localData.hasDelivery}
                  onValueChange={(value) => handleServiceToggle('hasDelivery', value)}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchContent}>
                  <Text variant="body" style={styles.switchLabel}>
                    🏪 Pickup
                  </Text>
                  <Text variant="caption" style={styles.switchDescription}>
                    Allow customers to pick up orders
                  </Text>
                </View>
                <Switch
                  value={localData.hasPickup}
                  onValueChange={(value) => handleServiceToggle('hasPickup', value)}
                />
              </View>
              {errors.services && (
                <Text variant="caption" style={styles.errorText}>
                  {errors.services}
                </Text>
              )}

              {/* Payment Methods */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Payment Methods
              </Text>
              
              <View style={styles.switchRow}>
                <View style={styles.switchContent}>
                  <Text variant="body" style={styles.switchLabel}>
                    💵 Cash
                  </Text>
                  <Text variant="caption" style={styles.switchDescription}>
                    Accept cash payments
                  </Text>
                </View>
                <Switch
                  value={localData.acceptsCash}
                  onValueChange={(value) => handlePaymentToggle('acceptsCash', value)}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchContent}>
                  <Text variant="body" style={styles.switchLabel}>
                    💳 Card/UPI
                  </Text>
                  <Text variant="caption" style={styles.switchDescription}>
                    Accept digital payments
                  </Text>
                </View>
                <Switch
                  value={localData.acceptsCard}
                  onValueChange={(value) => handlePaymentToggle('acceptsCard', value)}
                />
              </View>
              {errors.paymentMethods && (
                <Text variant="caption" style={styles.errorText}>
                  {errors.paymentMethods}
                </Text>
              )}

              {/* Pricing & Delivery */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Pricing & Delivery
              </Text>

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Input
                    label="Minimum Order (₹)"
                    value={localData.minimumOrderAmount.toString()}
                    onChangeText={(value: string) => handleNumericChange('minimumOrderAmount', value)}
                    placeholder="100"
                    keyboardType="numeric"
                    error={errors.minimumOrderAmount}
                  />
                </View>
                <View style={styles.inputHalfLast}>
                  <Input
                    label="Delivery Fee (₹)"
                    value={localData.deliveryFee.toString()}
                    onChangeText={(value: string) => handleNumericChange('deliveryFee', value)}
                    placeholder="0"
                    keyboardType="numeric"
                    error={errors.deliveryFee}
                  />
                </View>
              </View>

              <Input
                label="Estimated Delivery Time (minutes)"
                value={localData.estimatedDeliveryTime.toString()}
                onChangeText={(value: string) => handleNumericChange('estimatedDeliveryTime', value)}
                placeholder="30"
                keyboardType="numeric"
                error={errors.estimatedDeliveryTime}
                containerStyle={styles.inputMargin}
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
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  cuisineTagSelected: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF9B42',
    borderRadius: 12,
    backgroundColor: '#FFF8F0',
  },
  cuisineTagUnselected: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFAF0',
  },
  cuisineTagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  cuisineTagTextSelected: {
    color: '#FF9B42',
  },
  cuisineTagTextUnselected: {
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchContent: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
    marginRight: 8,
  },
  inputHalfLast: {
    marginRight: 0,
    marginLeft: 8,
  },
  inputMargin: {
    marginBottom: 24,
  },
  buttonMargin: {
    marginBottom: 16,
  },
});
