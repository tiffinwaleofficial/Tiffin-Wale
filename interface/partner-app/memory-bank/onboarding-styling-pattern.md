# Onboarding Screens Styling Pattern

## Overview

All onboarding screens in the partner app must use the **StyleSheet.create** pattern with hardcoded theme colors instead of the dynamic theme system. This ensures consistent styling and prevents hydration errors.

## Reference Pattern

Use `otp-verification.tsx` and `welcome.tsx` as references for the correct pattern.

## Required Changes for Each Screen

### 1. Import Statement

Add `StyleSheet` to React Native imports:

```typescript
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
```

### 2. Remove Theme Hook

**Remove:**
```typescript
import { useTheme } from '../../store/themeStore';

const MyComponent: React.FC = () => {
  const { theme } = useTheme();
```

**Replace with:**
```typescript
export default function MyComponent() {
```

### 3. Fix Component Exports

**Remove:**
```typescript
export default MyComponent;
```

**Add export to function definition:**
```typescript
export default function MyComponent() {
```

### 4. Replace Inline Styles

Replace ALL inline styles that use `theme` with hardcoded values or stylesheet references:

**Before:**
```typescript
<View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
  <Text style={{ color: theme.colors.text }}>
```

**After:**
```typescript
<View style={styles.header}>
  <Text style={styles.title}>
```

### 5. Replace Theme Values

Replace all theme references with hardcoded values:

| Theme Reference | Hardcoded Value |
|----------------|-----------------|
| `theme.colors.background` | `'#FFFAF0'` |
| `theme.colors.text` | `'#1A1A1A'` |
| `theme.colors.textSecondary` | `'#666'` |
| `theme.colors.primary` | `'#FF9B42'` |
| `theme.colors.border` | `'#E5E7EB'` |
| `theme.colors.error` | `'#EF4444'` |
| `theme.colors.success` | `'#10B981'` |
| `theme.colors.warning` | `'#F59E0B'` |
| `theme.colors.info` | `'#3B82F6'` |
| `theme.spacing.xs` | `8` |
| `theme.spacing.sm` | `8` |
| `theme.spacing.md` | `16` |
| `theme.spacing.lg` | `24` |
| `theme.spacing.xl` | `32` |
| `theme.borderRadius.sm` | `8` |
| `theme.borderRadius.md` | `12` |
| `theme.borderRadius.lg` | `16` |

### 6. Fix Input Component Props

Replace `style` prop with `containerStyle`:

**Before:**
```typescript
<Input
  label="Email"
  style={{ marginBottom: theme.spacing.md }}
/>
```

**After:**
```typescript
<Input
  label="Email"
  containerStyle={styles.inputMargin}
/>
```

Also, add explicit type annotation to `onChangeText`:
```typescript
onChangeText={(value: string) => handleFieldChange('email', value)}
```

### 7. Add StyleSheet.create Block

Add this at the **very end** of your component file, before the closing:

```typescript
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 22,
  },
  card: {
    marginBottom: 24,
  },
  inputMargin: {
    marginBottom: 16,
  },
  buttonMargin: {
    marginBottom: 16,
  },
  // Add additional styles as needed for your specific screen
});
```

### 8. Update Screen Background

**Before:**
```typescript
<Screen backgroundColor={theme.colors.background}>
```

**After:**
```typescript
<Screen backgroundColor="#FFFAF0">
```

## Common Issues and Solutions

### Issue: "Cannot read properties of undefined (reading 'input')"

**Cause:** Component is trying to access `theme.components.input` before theme is loaded.

**Solution:** Remove all theme references and use hardcoded values in the component's internal logic.

### Issue: TypeScript errors on conditional styles

**Cause:** Using arrays for conditional styles with `false` values.

**Solution:** Use ternary operators instead:

**Before:**
```typescript
style={[styles.base, isSelected && styles.selected]}
```

**After:**
```typescript
style={isSelected ? styles.selected : styles.base}
```

### Issue: Input component showing unstyled

**Cause:** Using `style` prop instead of `containerStyle`.

**Solution:** Always use `containerStyle` for Input components.

## Files That Need Fixing

- [x] `welcome.tsx` - COMPLETED
- [x] `business-profile.tsx` - COMPLETED  
- [x] `account-setup.tsx` - DELETED (no longer needed with OTP login)
- [x] `cuisine-services.tsx` - COMPLETED
- [x] `location-hours.tsx` - COMPLETED
- [x] `images-branding.tsx` - COMPLETED
- [x] `documents.tsx` - COMPLETED
- [x] `payment-setup.tsx` - COMPLETED
- [x] `review-submit.tsx` - COMPLETED

## Testing Checklist

After applying the pattern to a screen:

- [ ] No linter errors
- [ ] Screen renders with proper styling
- [ ] All inputs are styled correctly
- [ ] Buttons are styled correctly
- [ ] Text is readable with correct fonts
- [ ] Background color is consistent (#FFFAF0)
- [ ] No "Cannot read properties of undefined" errors

## Key Takeaways

1. **Always use StyleSheet.create** at the end of the file
2. **Never use `useTheme` hook** in onboarding screens
3. **Always use hardcoded colors** from the table above
4. **Export function directly** with `export default function ComponentName()`
5. **Replace all inline styles** with stylesheet references
6. **Use `containerStyle` not `style`** for Input components

## When Another AI Takes Over

Refer to this document and apply the same pattern to all remaining onboarding screens. Use `welcome.tsx` as the primary reference for structure and `otp-verification.tsx` for styling examples.

