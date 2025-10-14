import React from 'react';
import { View, ViewStyle, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

export interface DrawerMenuItem {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
  badge?: number;
  disabled?: boolean;
  divider?: boolean;
}

export interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
  items: DrawerMenuItem[];
  header?: {
    title: string;
    subtitle?: string;
    avatar?: string;
  };
  footer?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    overlayColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = screenWidth * 0.8;

const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isVisible,
  onClose,
  items,
  header,
  footer,
  style,
  theme: customTheme,
}: DrawerMenuProps) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const drawerStyles: ViewStyle = {
    flex: 1,
    backgroundColor: customTheme?.backgroundColor || theme.colors.surface,
    width: DRAWER_WIDTH,
    ...style,
  };

  const overlayStyles: ViewStyle = {
    flex: 1,
    backgroundColor: customTheme?.overlayColor || 'rgba(0, 0, 0, 0.5)',
  };

  const itemStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: customTheme?.borderColor || theme.colors.border,
  };

  const disabledItemStyles: ViewStyle = {
    ...itemStyles,
    opacity: 0.5,
  };

  const dividerStyles: ViewStyle = {
    height: 1,
    backgroundColor: customTheme?.borderColor || theme.colors.border,
    marginVertical: 8,
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={overlayStyles}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            drawerStyles,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          {header && (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: customTheme?.borderColor || theme.colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {header.avatar && (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: theme.colors.primary,
                      marginRight: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      variant="title"
                      style={{
                        color: '#FFFFFF',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {header.avatar}
                    </Text>
                  </View>
                )}
                
                <View style={{ flex: 1 }}>
                  <Text
                    variant="title"
                    style={{
                      color: customTheme?.textColor || theme.colors.text,
                      fontSize: 18,
                      fontWeight: '600',
                    }}
                  >
                    {header.title}
                  </Text>
                  
                  {header.subtitle && (
                    <Text
                      variant="body"
                      style={{
                        color: customTheme?.textColor || theme.colors.textSecondary,
                        fontSize: 14,
                        marginTop: 2,
                      }}
                    >
                      {header.subtitle}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Menu Items */}
          <View style={{ flex: 1, paddingTop: 8 }}>
            {items.map((item, index) => {
              if (item.divider) {
                return <View key={`divider-${index}`} style={dividerStyles} />;
              }

              const itemStyle = item.disabled ? disabledItemStyles : itemStyles;

              return (
                <TouchableOpacity
                  key={item.key}
                  style={itemStyle}
                  onPress={item.disabled ? undefined : item.onPress}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={item.icon}
                    size={24}
                    color={
                      item.disabled
                        ? theme.colors.textSecondary
                        : (customTheme?.textColor || theme.colors.text)
                    }
                  />
                  
                  <Text
                    variant="body"
                    style={{
                      color: item.disabled
                        ? theme.colors.textSecondary
                        : (customTheme?.textColor || theme.colors.text),
                      marginLeft: 12,
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </Text>

                  {item.badge && item.badge > 0 && (
                    <View
                      style={{
                        backgroundColor: theme.colors.error,
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text
                        variant="caption"
                        style={{
                          color: '#FFFFFF',
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        {item.badge > 99 ? '99+' : item.badge.toString()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          {footer && (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderTopWidth: 1,
                borderTopColor: customTheme?.borderColor || theme.colors.border,
              }}
            >
              <Button
                variant="outline"
                onPress={footer.onPress}
                fullWidth
                title={footer.label}
              />
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DrawerMenu;
