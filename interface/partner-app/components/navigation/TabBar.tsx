import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface TabItem {
  key: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    activeColor?: string;
    inactiveColor?: string;
    borderColor?: string;
  };
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
  theme: customTheme,
}: TabBarProps) => {
  const { theme } = useTheme();

  const tabBarStyles: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: customTheme?.backgroundColor || theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: customTheme?.borderColor || theme.colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    ...style,
  };

  const tabStyles: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  };

  const activeTabStyles: ViewStyle = {
    ...tabStyles,
    backgroundColor: customTheme?.activeColor || theme.colors.primary + '20',
    borderRadius: 8,
    marginHorizontal: 4,
  };

  return (
    <View style={tabBarStyles}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const tabStyle = isActive ? activeTabStyles : tabStyles;
        const iconColor = isActive 
          ? (customTheme?.activeColor || theme.colors.primary)
          : (customTheme?.inactiveColor || theme.colors.textSecondary);
        const textColor = isActive 
          ? (customTheme?.activeColor || theme.colors.primary)
          : (customTheme?.inactiveColor || theme.colors.textSecondary);

        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyle}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative' }}>
              <Icon
                name={tab.icon}
                size={24}
                color={iconColor}
              />
              {tab.badge && tab.badge > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
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
                    {tab.badge > 99 ? '99+' : tab.badge.toString()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text
              variant="caption"
              style={{
                color: textColor,
                marginTop: 4,
                fontSize: 12,
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
