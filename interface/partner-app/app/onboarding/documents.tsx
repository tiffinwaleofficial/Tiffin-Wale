import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet } from 'react-native';
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
import { useOnboardingStore, DocumentsData } from '../../store/onboardingStore';
import { UploadType } from '../../services/cloudinaryUploadService';

export default function Documents() {
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
    (formData.step7 as unknown as DocumentsData) || {
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
    
    // For now, validation is optional - don't show errors
    // Clear any existing errors for this field
    setLocalErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    clearError(field);
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
    // For now, validation is optional - allow proceeding without fields
    // Save data and proceed
    updateFormData('step7', localData);
    setCurrentStep(8);
    router.push('./payment-setup');
  };

  // For now, make validations optional - component internally
  const isFormValid = true; // Allow proceeding without fields filled


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
                Verify your business
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Upload required documents to verify your business
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              {/* License Numbers */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                License Information
              </Text>

              <Input
                label="FSSAI License Number"
                value={localData.fssaiLicense}
                onChangeText={(value: string) => handleFieldChange('fssaiLicense', value.replace(/\D/g, '').slice(0, 14))}
                placeholder="Enter 14-digit FSSAI license number"
                error={errors.fssaiLicense}
                containerStyle={styles.inputMargin}
              />

              <Input
                label="GST Number"
                value={localData.gstNumber}
                onChangeText={(value: string) => handleFieldChange('gstNumber', value.toUpperCase())}
                placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                error={errors.gstNumber}
                containerStyle={styles.inputMargin}
              />

              <Input
                label="PAN Number"
                value={localData.panNumber}
                onChangeText={(value: string) => handleFieldChange('panNumber', value.toUpperCase())}
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                error={errors.panNumber}
                containerStyle={styles.inputMargin}
              />

              <Input
                label="Business License Number"
                value={localData.licenseNumber}
                onChangeText={(value: string) => handleFieldChange('licenseNumber', value)}
                placeholder="Enter business license number"
                error={errors.licenseNumber}
                containerStyle={styles.inputMargin}
              />

              {/* Document Uploads */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
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
                files={localData.documents?.licenseDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false, status: 'completed' as const, progress: 100 })) || []}
                folder="partner-documents/licenses"
              />

              <UploadComponent
                title="Certification Documents"
                description="Upload your GST certificate and other certifications"
                uploadType={UploadType.DOCUMENT}
                maxFiles={3}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('certificationDocuments', files)}
                files={localData.documents?.certificationDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false, status: 'completed' as const, progress: 100 })) || []}
                folder="partner-documents/certifications"
              />

              <UploadComponent
                title="Identity Documents"
                description="Upload your PAN card and other identity documents"
                uploadType={UploadType.DOCUMENT}
                maxFiles={3}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('identityDocuments', files)}
                files={localData.documents?.identityDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false, status: 'completed' as const, progress: 100 })) || []}
                folder="partner-documents/identity"
              />

              <UploadComponent
                title="Other Documents"
                description="Upload bank statements, cancelled cheques, or other required documents"
                uploadType={UploadType.DOCUMENT}
                maxFiles={5}
                allowedTypes={['image', 'document']}
                onFilesChange={(files) => handleDocumentChange('otherDocuments', files)}
                files={localData.documents?.otherDocuments?.map(url => ({ uri: url, cloudinaryUrl: url, uploading: false, status: 'completed' as const, progress: 100 })) || []}
                folder="partner-documents/other"
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
  inputMargin: {
    marginBottom: 16,
  },
  buttonMargin: {
    marginBottom: 16,
  },
});
