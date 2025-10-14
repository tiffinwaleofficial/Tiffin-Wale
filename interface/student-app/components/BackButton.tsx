import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface BackButtonProps {
  onPress?: () => void;
  fallbackRoute?: any;
  color?: string;
  size?: number;
  style?: any;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  fallbackRoute = '/(tabs)/profile',
  color = '#333333',
  size = 24,
  style
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Use the same logic as account-information page
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push(fallbackRoute);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.backButton, style]}>
      <ArrowLeft size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
});
