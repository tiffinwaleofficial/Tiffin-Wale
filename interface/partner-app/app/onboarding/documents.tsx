import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
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
import { useOnboardingStore, DocumentsData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';
import { UploadType } from '../../services/cloudinaryUploadService';

const Documents: React.FC = () => {
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

  const [localData, setLocalData] = useState<DocumentsData>(
    formData.step7 || {
      fssaiLicense: '',
      gstNumber: '',
      panNumber: '',
      licenseNumber: '',
      documents: {
        licenseDocuments: [],
        certificationDocuments: [],
        identityDocuments: [],
        otherDocuments: [],
      },
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'fssaiLicense':
        if (!value.trim()) return 'FSSAI License number is required';
        if (!/^[0-9]{14}$/.test(value.replace(/\D/g, ''))) return 'FSSAI License must be 14 digits';
        return '';
      case 'gstNumber':
        if (!value.trim()) return 'GST Number is required';
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.toUpperCase())) return 'Please enter a valid GST number';
        return '';
      case 'panNumber':
        if (!value.trim()) return 'PAN Number is required';
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) return 'Please enter a valid PAN number';
        return '';
      case 'licenseNumber':
        if (!value.trim()) return 'Business License number is required';
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof Omit<DocumentsData, 'documents'>, value: string) => {
    const newData = { ...localData, [field]: value.toUpperCase() };
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

  const handleDocumentChange = (docType: keyof DocumentsData['documents'], files: any[]) => {
    const urls = files
      .filter(file => file.cloudinaryUrl)
      .map(file => file.cloudinaryUrl);
    
    const newDocuments = { ...localData.documents, [docType]: urls };
    setLocalData({ ...localData, documents: newDocuments });
  };

  const handleBack = () => {
    setCurrentStep(6);
    router.back();
  };

  const handleContinue = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(localData).forEach((field) => {
      if (field !== 'documents') {
        const error = validateField(field, localData[field as keyof Omit<DocumentsData, 'documents'>]);
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setLocalErrors(newErrors);
      return;
    }

    // Save data and proceed
    updateFormData('step7', localData);
    setCurrentStep(8);
    router.push('./payment-setup');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.fssaiLicense.trim() && 
    localData.gstNumber.trim() && 
    localData.panNumber.trim() && 
    localData.licenseNumber.trim();


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
                Verify your business
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Upload required documents to verify your business
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              {/* License Numbers */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                License Information
              </Text>

              <Input
                label="FSSAI License Number"
                value={localData.fssaiLicense}
                onChangeText={(value) => handleFieldChange('fssaiLicense', value.replace(/\D/g, '').slice(0, 14))}
                placeholder="Enter 14-digit FSSAI license number"
                error={errors.fssaiLicense}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="GST Number"
                value={localData.gstNumber}
                onChangeText={(value) => handleFieldChange('gstNumber', value.toUpperCase())}
                placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                error={errors.gstNumber}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="PAN Number"
                value={localData.panNumber}
                onChangeText={(value) => handleFieldChange('panNumber', value.toUpperCase())}
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                error={errors.panNumber}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="Business License Number"
                value={localData.licenseNumber}
                onChangeText={(value) => handleFieldChange('licenseNumber', value)}
                placeholder="Enter business license number"
                error={errors.licenseNumber}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Document Uploads */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Document Uploads
              </Text>

              <UploadComponent
                title="License Documents"
                description="Upload your FSSAI license certificate and other business licenses"
                uploadType={UploadType.DOCUMENT}
                maxFiles={3}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('licenseDocuments', files)}
                files={localData.documents?.licenseDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false })) || []}
                folder="partner-documents/licenses"
              />

              <UploadComponent
                title="Certification Documents"
                description="Upload your GST certificate and other certifications"
                uploadType={UploadType.DOCUMENT}
                maxFiles={3}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('certificationDocuments', files)}
                files={localData.documents?.certificationDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false })) || []}
                folder="partner-documents/certifications"
              />

              <UploadComponent
                title="Identity Documents"
                description="Upload your PAN card and other identity documents"
                uploadType={UploadType.DOCUMENT}
                maxFiles={3}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('identityDocuments', files)}
                files={localData.documents?.identityDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false })) || []}
                folder="partner-documents/identity"
              />

              <UploadComponent
                title="Other Documents"
                description="Upload bank statements, cancelled cheques, or other required documents"
                uploadType={UploadType.DOCUMENT}
                maxFiles={5}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('otherDocuments', files)}
                files={localData.documents?.otherDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false })) || []}
                folder="partner-documents/other"
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

export default Documents;
