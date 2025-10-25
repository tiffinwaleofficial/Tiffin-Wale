# Partner App Component Library

## 🎨 Design System Overview

### **Color Palette**
```typescript
export const colors = {
  // Primary Colors
  primary: '#FF9B42',        // Orange - Main brand color
  primaryDark: '#E8852A',    // Darker orange for pressed states
  primaryLight: '#FFB366',   // Lighter orange for backgrounds
  
  // Secondary Colors
  secondary: '#FEF6E9',      // Light cream - Background
  secondaryDark: '#F5E6D3',  // Darker cream for borders
  
  // Neutral Colors
  background: '#FFFFFF',     // White - Main background
  surface: '#F9FAFB',       // Light gray - Card backgrounds
  surfaceDark: '#F3F4F6',   // Darker gray for elevated surfaces
  
  // Text Colors
  text: {
    primary: '#1F2937',      // Dark gray - Primary text
    secondary: '#6B7280',    // Medium gray - Secondary text
    light: '#9CA3AF',        // Light gray - Disabled text
    inverse: '#FFFFFF',     // White - Text on dark backgrounds
  },
  
  // Status Colors
  status: {
    success: '#10B981',      // Green - Success states
    warning: '#F59E0B',      // Yellow - Warning states
    error: '#EF4444',        // Red - Error states
    info: '#3B82F6',        // Blue - Info states
  },
  
  // Border Colors
  border: {
    light: '#E5E7EB',       // Light border
    medium: '#D1D5DB',       // Medium border
    dark: '#9CA3AF',        // Dark border
  },
};
```

### **Typography**
```typescript
export const typography = {
  // Font Families
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};
```

### **Spacing System**
```typescript
export const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  '2xl': 48, // 48px
  '3xl': 64, // 64px
};
```

### **Border Radius**
```typescript
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
```

### **Shadows**
```typescript
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

---

## 🧩 Core UI Components

### **Button Component**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : colors.primary} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[styles.text, styles[`${variant}Text`]]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
});
```

### **Input Component**
```typescript
// components/ui/Input.tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
    multiline && styles.multiline,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={colors.text.light}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
```

### **Card Component**
```typescript
// components/layout/Card.tsx
interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  shadow?: keyof typeof shadows;
  borderRadius?: keyof typeof borderRadius;
  backgroundColor?: string;
  onPress?: () => void;
}

export function Card({
  children,
  padding = 'md',
  margin = 'sm',
  shadow = 'medium',
  borderRadius: radius = 'md',
  backgroundColor = colors.background,
  onPress,
}: CardProps) {
  const cardStyle = [
    styles.card,
    {
      padding: spacing[padding],
      margin: spacing[margin],
      borderRadius: borderRadius[radius],
      backgroundColor,
      ...shadows[shadow],
    },
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.95}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
```

---

## 🏢 Business-Specific Components

### **OrderCard Component**
```typescript
// components/business/OrderCard.tsx
interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onStatusChange?: (status: OrderStatus) => void;
  showActions?: boolean;
}

export function OrderCard({ 
  order, 
  onPress, 
  onStatusChange, 
  showActions = true 
}: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return colors.status.warning;
      case 'CONFIRMED': return colors.status.info;
      case 'PREPARING': return colors.primary;
      case 'READY': return colors.status.success;
      case 'DELIVERED': return colors.text.secondary;
      case 'CANCELLED': return colors.status.error;
      default: return colors.text.light;
    }
  };

  const getStatusActions = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return [
          { label: 'Accept', onPress: () => onStatusChange?.('CONFIRMED') },
          { label: 'Reject', onPress: () => onStatusChange?.('CANCELLED') },
        ];
      case 'CONFIRMED':
        return [
          { label: 'Start Preparing', onPress: () => onStatusChange?.('PREPARING') },
        ];
      case 'PREPARING':
        return [
          { label: 'Mark Ready', onPress: () => onStatusChange?.('READY') },
        ];
      default:
        return [];
    }
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <StatusBadge 
            status={order.status} 
            color={getStatusColor(order.status)} 
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
        <Text style={styles.itemCount}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          {getStatusActions(order.status).map((action, index) => (
            <Button
              key={index}
              title={action.label}
              onPress={action.onPress}
              variant="outline"
              size="small"
            />
          ))}
        </View>
      )}
    </Card>
  );
}
```

### **StatsCard Component**
```typescript
// components/business/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = colors.primary,
}: StatsCardProps) {
  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {icon && <View style={styles.icon}>{icon}</View>}
        </View>
        
        <Text style={[styles.value, { color }]}>{value}</Text>
        
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        
        {trend && (
          <View style={styles.trend}>
            <Icon
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend.isPositive ? colors.status.success : colors.status.error}
            />
            <Text style={[
              styles.trendText,
              { color: trend.isPositive ? colors.status.success : colors.status.error }
            ]}>
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}
```

### **MenuItemCard Component**
```typescript
// components/business/MenuItemCard.tsx
interface MenuItemCardProps {
  item: MenuItem;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleAvailability?: () => void;
  showActions?: boolean;
}

export function MenuItemCard({
  item,
  onPress,
  onEdit,
  onDelete,
  onToggleAvailability,
  showActions = true,
}: MenuItemCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="image" size={32} color={colors.text.light} />
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            <Switch
              value={item.isAvailable}
              onValueChange={onToggleAvailability}
              trackColor={{ false: colors.border.medium, true: colors.primary }}
              thumbColor={item.isAvailable ? colors.background : colors.text.light}
            />
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.footer}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </View>
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          <Button
            title="Edit"
            onPress={onEdit}
            variant="outline"
            size="small"
            icon={<Icon name="edit" size={16} color={colors.primary} />}
          />
          <Button
            title="Delete"
            onPress={onDelete}
            variant="outline"
            size="small"
            icon={<Icon name="trash" size={16} color={colors.status.error} />}
          />
        </View>
      )}
    </Card>
  );
}
```

---

## 📱 Layout Components

### **Screen Component**
```typescript
// components/layout/Screen.tsx
interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: keyof typeof spacing;
  scrollable?: boolean;
  refreshControl?: React.ReactElement;
  safeArea?: boolean;
}

export function Screen({
  children,
  backgroundColor = colors.background,
  padding = 'md',
  scrollable = false,
  refreshControl,
  safeArea = true,
}: ScreenProps) {
  const content = (
    <View style={[styles.container, { backgroundColor, padding: spacing[padding] }]}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  if (safeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
}
```

### **Header Component**
```typescript
// components/navigation/Header.tsx
interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBackButton?: boolean;
}

export function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = true,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBackButton && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        {leftIcon && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            {leftIcon}
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.right}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
```

---

## 🔄 Feedback Components

### **LoadingSpinner Component**
```typescript
// components/feedback/Loader.tsx
interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

export function Loader({
  size = 'medium',
  color = colors.primary,
  text,
  overlay = false,
}: LoaderProps) {
  const sizeMap = {
    small: 20,
    medium: 30,
    large: 40,
  };

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={sizeMap[size]} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlay}>
        {content}
      </View>
    );
  }

  return content;
}
```

### **EmptyState Component**
```typescript
// components/feedback/EmptyState.tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          variant="primary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}
```

### **ErrorState Component**
```typescript
// components/feedback/ErrorState.tsx
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Icon name="alert-circle" size={48} color={colors.status.error} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {showRetry && onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          icon={<Icon name="refresh" size={16} color={colors.primary} />}
        />
      )}
    </View>
  );
}
```

---

## 📝 Form Components

### **FormInput Component**
```typescript
// components/forms/FormInput.tsx
interface FormInputProps extends InputProps {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
}

export function FormInput({
  name,
  control,
  rules,
  ...inputProps
}: FormInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          {...inputProps}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}
```

### **FormSelect Component**
```typescript
// components/forms/FormSelect.tsx
interface FormSelectProps {
  name: string;
  control: Control<any>;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  rules?: RegisterOptions;
}

export function FormSelect({
  name,
  control,
  options,
  placeholder = 'Select an option',
  rules,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setIsOpen(true)}
          >
            <Text style={[
              styles.selectText,
              !value && styles.placeholderText
            ]}>
              {value ? options.find(opt => opt.value === value)?.label : placeholder}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <Modal visible={isOpen} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setIsOpen(false)}
            >
              <View style={styles.modalContent}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.option}
                    onPress={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                    {value === option.value && (
                      <Icon name="check" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}
```

---

## 🎯 Component Usage Guidelines

### **When to Create New Components**
1. **Reusability**: Component will be used in 3+ places
2. **Complexity**: Component has multiple responsibilities
3. **Consistency**: Component needs consistent styling/behavior
4. **Testing**: Component needs isolated testing

### **Component Naming Conventions**
- Use PascalCase for component names
- Use descriptive names that indicate purpose
- Prefix with category when appropriate (e.g., `BusinessOrderCard`)
- Use consistent suffixes (e.g., `Card`, `Button`, `Input`)

### **Props Interface Guidelines**
- Always define TypeScript interfaces for props
- Use optional props with default values when appropriate
- Group related props together
- Use union types for variant props
- Include JSDoc comments for complex props

### **Styling Guidelines**
- Use StyleSheet.create for performance
- Follow the design system spacing and colors
- Use consistent naming for style objects
- Group related styles together
- Use conditional styling for variants

---

*Last Updated: December 2024*
*Status: Component Library Documented*
*Next Review: When new components are added*
