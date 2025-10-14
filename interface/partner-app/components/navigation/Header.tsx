import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showBack?: boolean;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightIcon,
  onRightPress,
  showBack = true,
  style,
  theme: customTheme,
}: HeaderProps) => {
  const { theme } = useTheme();

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: customTheme?.backgroundColor || theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    ...style,
  };

  return (
    <View style={headerStyles}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {showBack && onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={{
              padding: 8,
              marginRight: 8,
            }}
          >
            <Icon
              name="back"
              size={24}
              color={customTheme?.textColor || theme.colors.text}
            />
          </TouchableOpacity>
        )}
        
        <Text
          variant="title"
          style={{
            color: customTheme?.textColor || theme.colors.text,
            flex: 1,
          }}
        >
          {title}
        </Text>
      </View>

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            padding: 8,
          }}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;


