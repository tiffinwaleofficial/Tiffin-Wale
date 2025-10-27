/**
 * Onboarding Layout Component
 * Provides consistent layout with navigation buttons and progress bar for all onboarding screens
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  showBackButton?: boolean;
  showNextButton?: boolean;
}

export default function OnboardingLayout({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  nextDisabled = false,
  showBackButton = true,
  showNextButton = true,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
    canGoBack,
    canGoForward,
    goToPreviousStep,
  } = useOnboardingStore();

  // Calculate progress percentage (starting from step 2)
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack()) {
      goToPreviousStep();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Navigation */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* Back Button */}
            {showBackButton && canGoBack() && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleBack}
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={24} color="#FF9B42" />
              </TouchableOpacity>
            )}
            
            {!showBackButton || !canGoBack() ? <View style={styles.navButton} /> : null}

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.stepText}>
                Step {currentStep} of {totalSteps}
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
            </View>

            {/* Forward Button (placeholder for symmetry) */}
            <View style={styles.navButton} />
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {/* Next Button */}
        {showNextButton && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                nextDisabled && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={nextDisabled}
              accessibilityLabel="Continue to next step"
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <ArrowRight size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9B42',
    borderRadius: 3,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  nextButton: {
    backgroundColor: '#FF9B42',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FF9B42',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


