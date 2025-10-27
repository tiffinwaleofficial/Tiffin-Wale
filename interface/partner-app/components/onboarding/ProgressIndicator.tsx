import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="caption" style={styles.text}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text variant="caption" style={styles.text}>
          {Math.round((currentStep / totalSteps) * 100)}%
        </Text>
      </View>
      
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFAF0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9B42',
    borderRadius: 2,
  },
});
