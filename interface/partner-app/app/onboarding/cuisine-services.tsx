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
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, CuisineServicesData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const cuisineTypes = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'American',
  'Continental', 'South Indian', 'North Indian', 'Gujarati', 'Punjabi',
  'Bengali', 'Rajasthani', 'Maharashtrian', 'Street Food', 'Fast Food',
  'Healthy', 'Vegan', 'Keto', 'Gluten Free', 'Desserts', 'Beverages'
];

const CuisineServices: React.FC = () => {
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

  const [localData, setLocalData] = useState<CuisineServicesData>(
    formData.step5 || {
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
    
    // Validate cuisine types
    const error = validateField('cuisineTypes', '');
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
                What do you serve?
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Tell us about your cuisine and service options
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              {/* Cuisine Types */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Cuisine Types
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.textSecondary 
                }}
              >
                Select all that apply
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                marginBottom: theme.spacing.md 
              }}>
                {cuisineTypes.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    onPress={() => handleCuisineToggle(cuisine)}
                    style={{
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                      marginRight: theme.spacing.sm,
                      marginBottom: theme.spacing.sm,
                      borderWidth: 1,
                      borderColor: localData.cuisineTypes.includes(cuisine) 
                        ? theme.colors.primary 
                        : theme.colors.border,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: localData.cuisineTypes.includes(cuisine) 
                        ? theme.colors.primary + '10' 
                        : theme.colors.background,
                    }}
                  >
                    <Text 
                      variant="caption" 
                      style={{ 
                        color: localData.cuisineTypes.includes(cuisine) 
                          ? theme.colors.primary 
                          : theme.colors.textSecondary 
                      }}
                    >
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.cuisineTypes && (
                <Text variant="caption" style={{ color: theme.colors.error, marginBottom: theme.spacing.lg }}>
                  {errors.cuisineTypes}
                </Text>
              )}

              {/* Vegetarian Option */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: theme.spacing.lg 
              }}>
                <View style={{ flex: 1 }}>
                  <Text variant="subtitle" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                    Vegetarian Only
                  </Text>
                  <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
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
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Service Options
              </Text>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: theme.spacing.md 
              }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                    🚚 Delivery
                  </Text>
                  <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                    Deliver food to customers
                  </Text>
                </View>
                <Switch
                  value={localData.hasDelivery}
                  onValueChange={(value) => handleServiceToggle('hasDelivery', value)}
                />
              </View>

              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: theme.spacing.lg 
              }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                    🏪 Pickup
                  </Text>
                  <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                    Allow customers to pick up orders
                  </Text>
                </View>
                <Switch
                  value={localData.hasPickup}
                  onValueChange={(value) => handleServiceToggle('hasPickup', value)}
                />
              </View>
              {errors.services && (
                <Text variant="caption" style={{ color: theme.colors.error, marginBottom: theme.spacing.lg }}>
                  {errors.services}
                </Text>
              )}

              {/* Payment Methods */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Payment Methods
              </Text>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: theme.spacing.md 
              }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                    💵 Cash
                  </Text>
                  <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                    Accept cash payments
                  </Text>
                </View>
                <Switch
                  value={localData.acceptsCash}
                  onValueChange={(value) => handlePaymentToggle('acceptsCash', value)}
                />
              </View>

              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: theme.spacing.lg 
              }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                    💳 Card/UPI
                  </Text>
                  <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                    Accept digital payments
                  </Text>
                </View>
                <Switch
                  value={localData.acceptsCard}
                  onValueChange={(value) => handlePaymentToggle('acceptsCard', value)}
                />
              </View>
              {errors.paymentMethods && (
                <Text variant="caption" style={{ color: theme.colors.error, marginBottom: theme.spacing.lg }}>
                  {errors.paymentMethods}
                </Text>
              )}

              {/* Pricing & Delivery */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Pricing & Delivery
              </Text>

              <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
                <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                  <Input
                    label="Minimum Order (₹)"
                    value={localData.minimumOrderAmount.toString()}
                    onChangeText={(value) => handleNumericChange('minimumOrderAmount', value)}
                    placeholder="100"
                    type="numeric"
                    error={errors.minimumOrderAmount}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Input
                    label="Delivery Fee (₹)"
                    value={localData.deliveryFee.toString()}
                    onChangeText={(value) => handleNumericChange('deliveryFee', value)}
                    placeholder="0"
                    type="numeric"
                    error={errors.deliveryFee}
                  />
                </View>
              </View>

              <Input
                label="Estimated Delivery Time (minutes)"
                value={localData.estimatedDeliveryTime.toString()}
                onChangeText={(value) => handleNumericChange('estimatedDeliveryTime', value)}
                placeholder="30"
                type="numeric"
                error={errors.estimatedDeliveryTime}
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

export default CuisineServices;
