import React from 'react';
import { Switch as RNSwitch, SwitchProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface SwitchComponentProps extends SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const Switch: React.FC<SwitchComponentProps> = ({
  value,
  onValueChange,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: theme.colors.border,
        true: theme.colors.primary + '40',
      }}
      thumbColor={value ? theme.colors.primary : theme.colors.textTertiary}
      {...props}
    />
  );
};