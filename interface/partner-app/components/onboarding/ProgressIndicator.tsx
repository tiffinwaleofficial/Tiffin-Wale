import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../ui/Text';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const { theme } = useTheme();

  return (
    <View style={{
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
          {Math.round((currentStep / totalSteps) * 100)}%
        </Text>
      </View>
      
      <View style={{
        height: 4,
        backgroundColor: theme.colors.border,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <View
          style={{
            height: '100%',
            width: `${(currentStep / totalSteps) * 100}%`,
            backgroundColor: theme.colors.primary,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
};

export default ProgressIndicator;