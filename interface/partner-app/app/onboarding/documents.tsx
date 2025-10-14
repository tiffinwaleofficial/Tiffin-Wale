import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, DocumentsData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

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
        fssaiDocument: '',
        gstDocument: '',
        panDocument: '',
        bankDocument: '',
      },
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});

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

  const pickDocument = async (docType: keyof DocumentsData['documents']) => {
    try {
      setUploadingDocs(prev => ({ ...prev, [docType]: true }));

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        // TODO: Implement actual document upload to Cloudinary
        // For now, we'll simulate the upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const documentUrl = `https://via.placeholder.com/300x400/FF9F43/FFFFFF?text=${docType.toUpperCase()}`;
        
        const newDocuments = { ...localData.documents, [docType]: documentUrl };
        setLocalData({ ...localData, documents: newDocuments });
        
        Alert.alert('Success', `${docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} uploaded successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to upload ${docType}. Please try again.`);
    } finally {
      setUploadingDocs(prev => ({ ...prev, [docType]: false }));
    }
  };

  const removeDocument = (docType: keyof DocumentsData['documents']) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newDocuments = { ...localData.documents, [docType]: '' };
            setLocalData({ ...localData, documents: newDocuments });
          },
        },
      ]
    );
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

  const renderDocumentUpload = (
    title: string,
    description: string,
    docType: keyof DocumentsData['documents'],
    required: boolean = true
  ) => (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text variant="subtitle" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
        {title} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
        {description}
      </Text>
      
      {localData.documents[docType] ? (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.success,
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.success + '10',
        }}>
          <Icon name="check-circle" size={20} color={theme.colors.success} />
          <Text variant="body" style={{ color: theme.colors.success, marginLeft: theme.spacing.sm, flex: 1 }}>
            Document uploaded successfully
          </Text>
          <TouchableOpacity onPress={() => removeDocument(docType)}>
            <Icon name="trash" size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => pickDocument(docType)}
          disabled={uploadingDocs[docType]}
          style={{
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderStyle: 'dashed',
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background,
            minHeight: 80,
          }}
        >
          {uploadingDocs[docType] ? (
            <View style={{ alignItems: 'center' }}>
              <Icon name="loading" size={24} color={theme.colors.primary} />
              <Text variant="caption" style={{ color: theme.colors.primary, marginTop: theme.spacing.sm }}>
                Uploading...
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Icon name="upload" size={24} color={theme.colors.textSecondary} />
              <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                Tap to upload {title.toLowerCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

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

              {renderDocumentUpload(
                'FSSAI License Document',
                'Upload your FSSAI license certificate (PDF or Image)',
                'fssaiDocument'
              )}

              {renderDocumentUpload(
                'GST Certificate',
                'Upload your GST registration certificate (PDF or Image)',
                'gstDocument'
              )}

              {renderDocumentUpload(
                'PAN Card',
                'Upload your PAN card (PDF or Image)',
                'panDocument'
              )}

              {renderDocumentUpload(
                'Bank Account Proof',
                'Upload bank statement or cancelled cheque (PDF or Image)',
                'bankDocument'
              )}

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

export default Documents;
