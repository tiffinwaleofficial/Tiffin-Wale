# 🎨 Component Library Reference

**Last Updated:** December 2024  
**Total Components:** ~50+ reusable components  
**Pattern:** Atomic Design (Atoms → Molecules → Organisms)

---

## 📂 Component Organization

```
components/
├── auth/          # Authentication components
├── business/      # Business-specific components
├── feedback/      # Loading/Error/Empty states
├── forms/         # Form input components
├── layout/        # Layout components
├── navigation/    # Navigation components
├── onboarding/    # Onboarding components
├── policies/      # Policy/legal components
└── ui/            # UI primitives
```

---

## 🔐 Auth Components

### ProtectedRoute
**Location:** `components/auth/ProtectedRoute.tsx`  
**Purpose:** Protect routes from unauthenticated users

```typescript
<ProtectedRoute>
  <AuthenticatedContent />
</ProtectedRoute>
```

### AuthGuard
**Location:** `components/auth/AuthGuard.tsx`  
**Purpose:** Guard routes by user role

```typescript
<AuthGuard role="PARTNER">
  <PartnerOnlyContent />
</AuthGuard>
```

### RoleGuard
**Location:** `components/auth/RoleGuard.tsx`  
**Purpose:** Check user permissions

```typescript
<RoleGuard permissions={['UPDATE_PROFILE']}>
  <EditButton />
</RoleGuard>
```

---

## 🏢 Business Components

### OrderCard
**Location:** `components/business/OrderCard.tsx`  
**Purpose:** Display order information

```typescript
<OrderCard 
  order={order}
  onAccept={() => {}}
  onReject={() => {}}
/>
```

### MenuItemCard
**Location:** `components/business/MenuItemCard.tsx`  
**Purpose:** Display menu item

```typescript
<MenuItemCard
  item={menuItem}
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

### StatsCard
**Location:** `components/business/StatsCard.tsx`  
**Purpose:** Display statistics

```typescript
<StatsCard
  title="Today's Orders"
  value={stats.todayOrders}
  icon={<OrderIcon />}
/>
```

### CustomerCard
**Location:** `components/business/CustomerCard.tsx`  
**Purpose:** Display customer information

```typescript
<CustomerCard
  customer={customer}
  onContact={() => {}}
/>
```

### ReviewCard
**Location:** `components/business/ReviewCard.tsx`  
**Purpose:** Display customer review

```typescript
<ReviewCard
  review={review}
  onRespond={() => {}}
/>
```

### NotificationCard
**Location:** `components/business/NotificationCard.tsx`  
**Purpose:** Display notification

```typescript
<NotificationCard
  notification={notification}
  onPress={() => {}}
/>
```

### EarningsCard
**Location:** `components/business/EarningsCard.tsx`  
**Purpose:** Display earnings information

```typescript
<EarningsCard
  period="today"
  earnings={earnings}
/>
```

### QuickAction
**Location:** `components/business/QuickAction.tsx`  
**Purpose:** Quick action button

```typescript
<QuickAction
  icon={<Icon />}
  label="Accept Order"
  onPress={() => {}}
/>
```

### StatusBadge
**Location:** `components/business/StatusBadge.tsx`  
**Purpose:** Display status badge

```typescript
<StatusBadge status="PENDING" />
```

---

## 💬 Feedback Components

### Loader
**Location:** `components/feedback/Loader.tsx`  
**Purpose:** Loading spinner

```typescript
if (isLoading) return <Loader />;
```

### ErrorState
**Location:** `components/feedback/ErrorState.tsx`  
**Purpose:** Error display

```typescript
if (error) return <ErrorState message={error} onRetry={retry} />;
```

### EmptyState
**Location:** `components/feedback/EmptyState.tsx`  
**Purpose:** Empty state display

```typescript
if (!items.length) return <EmptyState message="No orders yet" />;
```

### Skeleton
**Location:** `components/feedback/Skeleton.tsx`  
**Purpose:** Loading skeleton

```typescript
<Skeleton width="100%" height={20} />
```

### Toast
**Location:** `components/feedback/Toast.tsx`  
**Purpose:** Toast notifications

```typescript
Toast.show({
  type: 'success',
  text1: 'Order accepted',
});
```

### Alert
**Location:** `components/feedback/Alert.tsx`  
**Purpose:** Alert dialog

```typescript
<Alert
  type="warning"
  title="Confirm"
  message="Are you sure?"
  onConfirm={() => {}}
/>
```

---

## 📝 Form Components

### FormInput
**Location:** `components/forms/FormInput.tsx`  
**Purpose:** Text input with label

```typescript
<FormInput
  label="Business Name"
  value={name}
  onChangeText={setName}
  error={errors.name}
/>
```

### FormCheckbox
**Location:** `components/forms/FormCheckbox.tsx`  
**Purpose:** Checkbox input

```typescript
<FormCheckbox
  label="Accept terms"
  checked={accepted}
  onToggle={setAccepted}
/>
```

### FormSelect
**Location:** `components/forms/FormSelect.tsx`  
**Purpose:** Select dropdown

```typescript
<FormSelect
  label="Category"
  value={category}
  options={categories}
  onChange={setCategory}
/>
```

### FormDatePicker
**Location:** `components/forms/FormDatePicker.tsx`  
**Purpose:** Date picker

```typescript
<FormDatePicker
  label="Start Date"
  value={date}
  onChange={setDate}
/>
```

### FormRadio
**Location:** `components/forms/FormRadio.tsx`  
**Purpose:** Radio button group

```typescript
<FormRadio
  options={options}
  selectedValue={value}
  onSelect={setValue}
/>
```

---

## 📐 Layout Components

### Screen
**Location:** `components/layout/Screen.tsx`  
**Purpose:** Full screen container

```typescript
<Screen>
  <Content />
</Screen>
```

### Container
**Location:** `components/layout/Container.tsx`  
**Purpose:** Page container with padding

```typescript
<Container>
  <Content />
</Container>
```

### Card
**Location:** `components/layout/Card.tsx`  
**Purpose:** Card container

```typescript
<Card>
  <Card.Content>
    <Text>Content</Text>
  </Card.Content>
</Card>
```

### Modal
**Location:** `components/layout/Modal.tsx`  
**Purpose:** Modal dialog

```typescript
<Modal visible={visible} onClose={close}>
  <Modal.Content>
    <Text>Modal Content</Text>
  </Modal.Content>
</Modal>
```

### Sheet
**Location:** `components/layout/Sheet.tsx`  
**Purpose:** Bottom sheet

```typescript
<Sheet visible={visible} onClose={close}>
  <Sheet.Content>
    <Text>Sheet Content</Text>
  </Sheet.Content>
</Sheet>
```

### ScrollView
**Location:** `components/layout/ScrollView.tsx`  
**Purpose:** Scrollable container

```typescript
<ScrollView onRefresh={refresh} refreshing={isRefreshing}>
  <Content />
</ScrollView>
```

### Stack
**Location:** `components/layout/Stack.tsx`  
**Purpose:** Stack layout

```typescript
<Stack spacing={16}>
  <Item1 />
  <Item2 />
</Stack>
```

### Divider
**Location:** `components/layout/Divider.tsx`  
**Purpose:** Divider line

```typescript
<Divider />
```

---

## 🧭 Navigation Components

### Header
**Location:** `components/navigation/Header.tsx`  
**Purpose:** Page header with title

```typescript
<Header 
  title="Orders" 
  showBack 
  rightActions={<Icon />}
/>
```

### BackButton
**Location:** `components/navigation/BackButton.tsx`  
**Purpose:** Back navigation button

```typescript
<BackButton onPress={() => router.back()} />
```

### Breadcrumb
**Location:** `components/navigation/Breadcrumb.tsx`  
**Purpose:** Breadcrumb navigation

```typescript
<Breadcrumb items={['Home', 'Orders', 'Details']} />
```

### TabBar
**Location:** `components/navigation/TabBar.tsx`  
**Purpose:** Tab bar navigation

```typescript
<TabBar activeTab={active} onTabChange={setActive} />
```

### DrawerMenu
**Location:** `components/navigation/DrawerMenu.tsx`  
**Purpose:** Drawer menu

```typescript
<DrawerMenu 
  items={menuItems} 
  currentRoute={route} 
  onItemPress={navigate}
/>
```

---

## 🎨 UI Primitives

### Button
**Location:** `components/ui/Button.tsx`  
**Purpose:** Button component

```typescript
<Button
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
  loading={isLoading}
/>
```

### Text
**Location:** `components/ui/Text.tsx`  
**Purpose:** Typography component

```typescript
<Text variant="h1">Heading</Text>
<Text variant="body">Body text</Text>
```

### Input
**Location:** `components/ui/Input.tsx`  
**Purpose:** Text input

```typescript
<Input
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>
```

### Avatar
**Location:** `components/ui/Avatar.tsx`  
**Purpose:** User avatar

```typescript
<Avatar
  source={{ uri: imageUrl }}
  size={40}
/>
```

### Badge
**Location:** `components/ui/Badge.tsx`  
**Purpose:** Badge component

```typescript
<Badge variant="success">
  Active
</Badge>
```

### Icon
**Location:** `components/ui/Icon.tsx`  
**Purpose:** Icon wrapper

```typescript
<Icon name="check" size={24} color="#green" />
```

### Image
**Location:** `components/ui/Image.tsx`  
**Purpose:** Image component

```typescript
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
/>
```

### Checkbox
**Location:** `components/ui/Checkbox.tsx`  
**Purpose:** Checkbox

```typescript
<Checkbox
  checked={checked}
  onToggle={setChecked}
/>
```

### Radio
**Location:** `components/ui/Radio.tsx`  
**Purpose:** Radio button

```typescript
<Radio
  checked={checked}
  onSelect={() => {}}
/>
```

### Switch
**Location:** `components/ui/Switch.tsx`  
**Purpose:** Toggle switch

```typescript
<Switch
  value={enabled}
  onToggle={setEnabled}
/>
```

### DateTimePicker
**Location:** `components/ui/DateTimePicker.tsx`  
**Purpose:** Date/time picker

```typescript
<DateTimePicker
  value={date}
  onChange={setDate}
/>
```

### UploadComponent
**Location:** `components/ui/UploadComponent.tsx`  
**Purpose:** File upload

```typescript
<UploadComponent
  onUpload={handleUpload}
  accept="image/*"
/>
```

---

## 📊 Component Usage Patterns

### Composite Component Pattern
```typescript
// Build complex components from simple ones
function OrderList({ orders }) {
  return (
    <Screen>
      <Header title="Orders" />
      <ScrollView>
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </Screen>
  );
}
```

### Loading State Pattern
```typescript
function Component() {
  const { data, isLoading, error } = useStore();
  
  if (isLoading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return <EmptyState />;
  
  return <Content data={data} />;
}
```

### Form Validation Pattern
```typescript
function Form() {
  const [errors, setErrors] = useState({});
  
  return (
    <>
      <FormInput
        label="Name"
        value={name}
        error={errors.name}
        onChangeText={setName}
      />
      <Button onPress={validateAndSubmit} />
    </>
  );
}
```

---

## 🎯 Component Composition Examples

### Dashboard Card Composition
```typescript
<Card>
  <Card.Header>
    <Text variant="h3">Today's Stats</Text>
    <Badge variant="info">Live</Badge>
  </Card.Header>
  <Card.Content>
    <Stack spacing={12}>
      <StatsCard
        icon={<OrderIcon />}
        label="Orders"
        value={stats.orders}
      />
      <StatsCard
        icon={<DollarIcon />}
        label="Revenue"
        value={formatCurrency(stats.revenue)}
      />
    </Stack>
  </Card.Content>
</Card>
```

### Order Card Composition
```typescript
<Card pressable onPress={() => navigate(order.id)}>
  <Card.Content>
    <View style={styles.header}>
      <Avatar source={customer.avatar} />
      <View>
        <Text>{customer.name}</Text>
        <Text variant="caption">{order.id}</Text>
      </View>
      <StatusBadge status={order.status} />
    </View>
    <Divider />
    <Text>{order.items.length} items</Text>
    <Text>{formatCurrency(order.total)}</Text>
    <View style={styles.actions}>
      <Button size="sm" variant="success" onPress={acceptOrder}>
        Accept
      </Button>
      <Button size="sm" variant="danger" onPress={rejectOrder}>
        Reject
      </Button>
    </View>
  </Card.Content>
</Card>
```

---

## 🔗 Related Documentation

- [Folder Structure](./01_FOLDER_STRUCTURE.md)
- [Architecture Patterns](./03_ARCHITECTURE_PATTERNS.md)
- [Development Guide](./00_PROJECT_OVERVIEW.md)

