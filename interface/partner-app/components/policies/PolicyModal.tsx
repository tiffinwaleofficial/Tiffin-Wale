import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { useTheme } from '../../store/themeStore';

interface PolicyModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PolicyModal: React.FC<PolicyModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerContent}>
            <Text 
              variant="title" 
              style={{
                fontSize: 20,
                fontWeight: '600',
                flex: 1,
                marginRight: 16,
                color: theme.colors.text
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: theme.colors.background + '20' }]}
              activeOpacity={0.7}
            >
              <Icon 
                name="x" 
                size={20} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeFooterButton, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF'
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50, // Account for status bar
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  closeFooterButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default PolicyModal;
