import React from 'react';
import { View, ViewStyle, Modal as RNModal, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  animationType?: 'slide' | 'fade' | 'none';
  transparent?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  theme?: {
    backgroundColor?: string;
  };
}

const Modal: React.FC<ModalProps> = ({
  children,
  visible,
  onClose,
  animationType = 'slide',
  transparent = true,
  style,
  contentStyle,
  theme: customTheme,
}: ModalProps) => {
  const { theme } = useTheme();

  const modalStyles: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: customTheme?.backgroundColor || 'rgba(0, 0, 0, 0.5)',
    ...style,
  };

  const contentStyles: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
    ...contentStyle,
  };

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={modalStyles}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={contentStyles}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

export default Modal;


