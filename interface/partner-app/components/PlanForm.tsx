import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { api, SubscriptionPlan, MealSpecification, DurationType, MealFrequency } from '../lib/api';
import { useTheme } from '../store/themeStore';
import { UploadComponent, UploadedFile } from './ui/UploadComponent';
import { UploadType } from '../services/cloudinaryUploadService';

interface PlanFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  plan: SubscriptionPlan | null;
}

const PlanForm: React.FC<PlanFormProps> = ({ isVisible, onClose, plan, onSave }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic plan fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [durationValue, setDurationValue] = useState('30');
  const [durationType, setDurationType] = useState<DurationType>(DurationType.DAY);
  const [mealFrequency, setMealFrequency] = useState<MealFrequency>(MealFrequency.DAILY);
  const [mealsPerDay, setMealsPerDay] = useState('2');
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [termsAndConditions, setTermsAndConditions] = useState('');

  // Meal specification fields
  const [rotis, setRotis] = useState('');
  const [sabzis, setSabzis] = useState<Array<{ name: string; quantity: string }>>([]);
  const [dalType, setDalType] = useState('');
  const [dalQuantity, setDalQuantity] = useState('');
  const [riceQuantity, setRiceQuantity] = useState('');
  const [riceType, setRiceType] = useState('Plain Rice');
  const [extras, setExtras] = useState<Array<{ name: string; included: boolean; cost: number }>>([]);
  const [hasSalad, setHasSalad] = useState(false);
  const [hasCurd, setHasCurd] = useState(false);
  
  // Image upload
  const [images, setImages] = useState<UploadedFile[]>([]);
  
  // Additional preferences
  const [maxPauseCount, setMaxPauseCount] = useState('0');
  const [maxSkipCount, setMaxSkipCount] = useState('0');
  const [maxCustomizationsPerDay, setMaxCustomizationsPerDay] = useState('0');
  
  // Weekly menu & scheduling
  const [operationalDays, setOperationalDays] = useState<string[]>([
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ]);
  const [weeklyMenu, setWeeklyMenu] = useState<any>({});
  const [monthlyMenuVariation, setMonthlyMenuVariation] = useState(false);
  
  // Delivery slots
  const [deliverySlots, setDeliverySlots] = useState({
    morning: { enabled: true, timeRange: '8-10 AM' },
    afternoon: { enabled: true, timeRange: '12-2 PM' },
    evening: { enabled: true, timeRange: '6-8 PM' },
  });

  useEffect(() => {
    if (plan) {
      // Load plan data
      setName(plan.name || '');
      setDescription(plan.description || '');
      setPrice(plan.price?.toString() || '');
      setDiscountedPrice(plan.discountedPrice?.toString() || '');
      setDurationValue(plan.durationValue?.toString() || '30');
      setDurationType(plan.durationType || DurationType.DAY);
      setMealFrequency(plan.mealFrequency || MealFrequency.DAILY);
      setMealsPerDay(plan.mealsPerDay?.toString() || '2');
      setDeliveryFee(plan.deliveryFee?.toString() || '0');
      setIsActive(plan.isActive ?? true);
      setTermsAndConditions(plan.termsAndConditions || '');
      setMaxPauseCount(plan.maxPauseCount?.toString() || '0');
      setMaxSkipCount(plan.maxSkipCount?.toString() || '0');
      setMaxCustomizationsPerDay(plan.maxCustomizationsPerDay?.toString() || '0');

      // Load images
      if (plan.images && plan.images.length > 0) {
        setImages(plan.images.map(url => ({
          uri: url,
          status: 'completed' as const,
          progress: 100,
          cloudinaryUrl: url,
        })));
      } else if (plan.imageUrl) {
        setImages([{
          uri: plan.imageUrl,
          status: 'completed' as const,
          progress: 100,
          cloudinaryUrl: plan.imageUrl,
        }]);
      } else {
        setImages([]);
      }

      // Parse meal specification
      const mealSpec = api.plans.parseMealSpecification(plan);
      if (mealSpec) {
        setRotis(mealSpec.rotis?.toString() || '');
        setSabzis(mealSpec.sabzis || []);
        setDalType(mealSpec.dal?.type || '');
        setDalQuantity(mealSpec.dal?.quantity || '');
        setRiceQuantity(mealSpec.rice?.quantity || '');
        setRiceType(mealSpec.rice?.type || 'Plain Rice');
        setExtras((mealSpec.extras || []).map(e => ({ ...e, cost: e.cost || 0 })));
        setHasSalad(mealSpec.salad || false);
        setHasCurd(mealSpec.curd || false);
      }
    } else {
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setDiscountedPrice('');
      setDurationValue('30');
      setDurationType(DurationType.DAY);
      setMealFrequency(MealFrequency.DAILY);
      setMealsPerDay('2');
      setDeliveryFee('0');
      setIsActive(true);
      setTermsAndConditions('');
      setRotis('');
      setSabzis([]);
      setDalType('');
      setDalQuantity('');
      setRiceQuantity('');
      setRiceType('Plain Rice');
      setExtras([]);
      setHasSalad(false);
      setHasCurd(false);
      setImages([]);
      setMaxPauseCount('0');
      setMaxSkipCount('0');
      setMaxCustomizationsPerDay('0');
    }
  }, [plan, isVisible]);

  const handleAddSabzi = () => {
    setSabzis([...sabzis, { name: '', quantity: '1 bowl' }]);
  };

  const handleRemoveSabzi = (index: number) => {
    setSabzis(sabzis.filter((_, i) => i !== index));
  };

  const handleUpdateSabzi = (index: number, field: 'name' | 'quantity', value: string) => {
    const updated = [...sabzis];
    updated[index] = { ...updated[index], [field]: value };
    setSabzis(updated);
  };

  const handleAddExtra = () => {
    setExtras([...extras, { name: '', included: true, cost: 0 }]);
  };

  const handleRemoveExtra = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const handleUpdateExtra = (
    index: number,
    field: 'name' | 'included' | 'cost',
    value: string | boolean | number
  ) => {
    const updated = [...extras];
    updated[index] = { ...updated[index], [field]: value };
    setExtras(updated);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const mealSpecification: MealSpecification = {
        rotis: rotis ? parseInt(rotis) : undefined,
        sabzis: sabzis.length > 0 ? sabzis : undefined,
        dal: dalType ? { type: dalType, quantity: dalQuantity || '1 bowl' } : undefined,
        rice: riceQuantity ? { quantity: riceQuantity, type: riceType } : undefined,
        extras: extras.length > 0 ? extras.map(e => ({ ...e, cost: e.cost || 0 })) : undefined,
        salad: hasSalad || undefined,
        curd: hasCurd || undefined,
      };

      // Collect uploaded image URLs
      const imageUrls = images
        .filter(img => img.cloudinaryUrl)
        .map(img => img.cloudinaryUrl!);

      const planData = {
        name,
        description,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
        durationValue: parseInt(durationValue),
        durationType,
        mealFrequency,
        mealsPerDay: parseInt(mealsPerDay),
        deliveryFee: parseFloat(deliveryFee) || 0,
        isActive,
        termsAndConditions,
        mealSpecification,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : undefined, // For backward compatibility
        maxPauseCount: parseInt(maxPauseCount) || 0,
        maxSkipCount: parseInt(maxSkipCount) || 0,
        maxCustomizationsPerDay: parseInt(maxCustomizationsPerDay) || 0,
        weeklyMenu: Object.keys(weeklyMenu).length > 0 ? weeklyMenu : undefined,
        operationalDays,
        deliverySlots,
        monthlyMenuVariation,
      };

      if (plan?._id || plan?.id) {
        await api.plans.updatePlan(plan._id || plan.id || '', planData);
      } else {
        await api.plans.createPlan(planData);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('Failed to save plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const durationTypes = [
    { label: 'Day(s)', value: DurationType.DAY },
    { label: 'Week(s)', value: DurationType.WEEK },
    { label: 'Month(s)', value: DurationType.MONTH },
    { label: 'Year(s)', value: DurationType.YEAR },
  ];

  const mealFrequencies = [
    { label: 'Daily', value: MealFrequency.DAILY },
    { label: 'Weekdays', value: MealFrequency.WEEKDAYS },
    { label: 'Weekends', value: MealFrequency.WEEKENDS },
    { label: 'Custom', value: MealFrequency.CUSTOM },
  ];

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: '#FEF6E9' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#333' }]}>
            {plan ? 'Edit Plan' : 'Create New Plan'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Basic Information</Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Plan Name (e.g., ₹2500 Monthly Plan)"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Description"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="Price (₹)"
                  placeholderTextColor="#999"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="Discounted Price (₹)"
                  placeholderTextColor="#999"
                  value={discountedPrice}
                  onChangeText={setDiscountedPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Duration & Frequency */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Duration & Frequency</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="Duration (e.g., 30)"
                  placeholderTextColor="#999"
                  value={durationValue}
                  onChangeText={setDurationValue}
                  keyboardType="numeric"
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerContainer}>
                {durationTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.pickerOption,
                      durationType === type.value && styles.pickerOptionActive,
                    ]}
                    onPress={() => setDurationType(type.value)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        durationType === type.value && styles.pickerOptionTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="Meals per day"
                  placeholderTextColor="#999"
                  value={mealsPerDay}
                  onChangeText={setMealsPerDay}
                  keyboardType="numeric"
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerContainer}>
                {mealFrequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq.value}
                    style={[
                      styles.pickerOption,
                      mealFrequency === freq.value && styles.pickerOptionActive,
                    ]}
                    onPress={() => setMealFrequency(freq.value)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        mealFrequency === freq.value && styles.pickerOptionTextActive,
                      ]}
                    >
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Delivery Fee (₹)"
              placeholderTextColor="#999"
              value={deliveryFee}
              onChangeText={setDeliveryFee}
              keyboardType="numeric"
            />
          </View>

          {/* Meal Specification */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Meal Details</Text>
            <Text style={[styles.sectionSubtitle, { color: '#666' }]}>
              Specify what's included in each meal
            </Text>

            {/* Rotis */}
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Number of Rotis/Chapatis"
              placeholderTextColor="#999"
              value={rotis}
              onChangeText={setRotis}
              keyboardType="numeric"
            />

            {/* Sabzis */}
            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <Text style={[styles.subsectionTitle, { color: '#333' }]}>Sabzis (Vegetables)</Text>
                <TouchableOpacity onPress={handleAddSabzi} style={styles.addButton}>
                  <Plus size={18} color="#FF9F43" />
                  <Text style={[styles.addButtonText, { color: '#FF9F43' }]}>Add</Text>
                </TouchableOpacity>
              </View>
              {sabzis.map((sabzi, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.row}>
                    <View style={styles.flex2}>
                      <TextInput
                        style={[styles.input, styles.smallInput, { backgroundColor: '#FFF', color: '#333' }]}
                        placeholder="Sabzi name (e.g., Aloo Gobi)"
                        placeholderTextColor="#999"
                        value={sabzi.name}
                        onChangeText={(value) => handleUpdateSabzi(index, 'name', value)}
                      />
                    </View>
                    <View style={styles.flex1}>
                      <TextInput
                        style={[styles.input, styles.smallInput, { backgroundColor: '#FFF', color: '#333' }]}
                        placeholder="Quantity"
                        placeholderTextColor="#999"
                        value={sabzi.quantity}
                        onChangeText={(value) => handleUpdateSabzi(index, 'quantity', value)}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveSabzi(index)}
                      style={styles.removeButton}
                    >
                      <Trash2 size={18} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Dal */}
            <View style={styles.subsection}>
              <Text style={[styles.subsectionTitle, { color: '#333' }]}>Dal (Lentils)</Text>
              <View style={styles.row}>
                <View style={styles.flex2}>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                    placeholder="Dal type (e.g., Dal Fry, Dal Tadka)"
                    placeholderTextColor="#999"
                    value={dalType}
                    onChangeText={setDalType}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                    placeholder="Quantity"
                    placeholderTextColor="#999"
                    value={dalQuantity}
                    onChangeText={setDalQuantity}
                  />
                </View>
              </View>
            </View>

            {/* Rice */}
            <View style={styles.subsection}>
              <Text style={[styles.subsectionTitle, { color: '#333' }]}>Rice</Text>
              <View style={styles.row}>
                <View style={styles.flex2}>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                    placeholder="Rice type (e.g., Plain Rice, Jeera Rice)"
                    placeholderTextColor="#999"
                    value={riceType}
                    onChangeText={setRiceType}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                    placeholder="Quantity"
                    placeholderTextColor="#999"
                    value={riceQuantity}
                    onChangeText={setRiceQuantity}
                  />
                </View>
              </View>
            </View>

            {/* Extras */}
            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <Text style={[styles.subsectionTitle, { color: '#333' }]}>Extras</Text>
                <TouchableOpacity onPress={handleAddExtra} style={styles.addButton}>
                  <Plus size={18} color="#FF9F43" />
                  <Text style={[styles.addButtonText, { color: '#FF9F43' }]}>Add</Text>
                </TouchableOpacity>
              </View>
              {extras.map((extra, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.row}>
                    <View style={styles.flex2}>
                      <TextInput
                        style={[styles.input, styles.smallInput, { backgroundColor: '#FFF', color: '#333' }]}
                        placeholder="Extra name (e.g., Pickle, Papad)"
                        placeholderTextColor="#999"
                        value={extra.name}
                        onChangeText={(value) => handleUpdateExtra(index, 'name', value)}
                      />
                    </View>
                    <View style={styles.switchContainer}>
                      <Text style={[styles.switchLabel, { color: '#666' }]}>Included</Text>
                      <Switch
                        value={extra.included}
                        onValueChange={(value) => handleUpdateExtra(index, 'included', value)}
                        trackColor={{ false: '#DDD', true: '#FF9F43' }}
                        thumbColor="#FFF"
                      />
                    </View>
                    {!extra.included && (
                      <View style={styles.costInput}>
                        <TextInput
                          style={[styles.input, styles.tinyInput, { backgroundColor: '#FFF', color: '#333' }]}
                          placeholder="₹"
                          placeholderTextColor="#999"
                          value={extra.cost?.toString() || ''}
                          onChangeText={(value) => handleUpdateExtra(index, 'cost', parseFloat(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => handleRemoveExtra(index)}
                      style={styles.removeButton}
                    >
                      <Trash2 size={18} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Salad & Curd */}
            <View style={styles.subsection}>
              <View style={styles.row}>
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: '#666' }]}>Salad Included</Text>
                  <Switch
                    value={hasSalad}
                    onValueChange={setHasSalad}
                    trackColor={{ false: '#DDD', true: '#FF9F43' }}
                    thumbColor="#FFF"
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: '#666' }]}>Curd Included</Text>
                  <Switch
                    value={hasCurd}
                    onValueChange={setHasCurd}
                    trackColor={{ false: '#DDD', true: '#FF9F43' }}
                    thumbColor="#FFF"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={[styles.sectionSubtitle, { color: '#666', marginBottom: 12 }]}>
              Upload up to 10 photos of your tiffin meals (Max 10 images)
            </Text>
            <UploadComponent
              title=""
              description=""
              uploadType={UploadType.MEAL_IMAGE}
              maxFiles={10}
              allowedTypes={['image']}
              files={images}
              onFilesChange={setImages}
            />
          </View>

          {/* Plan Preferences */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Plan Preferences</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>Max Pause Count</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="0"
                  placeholderTextColor="#999"
                  value={maxPauseCount}
                  onChangeText={setMaxPauseCount}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>Max Skip Count</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="0"
                  placeholderTextColor="#999"
                  value={maxSkipCount}
                  onChangeText={setMaxSkipCount}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={[styles.inputLabel, { color: '#666' }]}>Max Customizations Per Day</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="0"
              placeholderTextColor="#999"
              value={maxCustomizationsPerDay}
              onChangeText={setMaxCustomizationsPerDay}
              keyboardType="numeric"
            />
          </View>

          {/* Additional Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Additional Settings</Text>
            
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: '#666' }]}>Plan Active</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#DDD', true: '#FF9F43' }}
                thumbColor="#FFF"
              />
            </View>

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Terms & Conditions (optional)"
              placeholderTextColor="#999"
              value={termsAndConditions}
              onChangeText={setTermsAndConditions}
              multiline
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={isLoading || !name || !price}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Save Plan</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    flexShrink: 1,
    maxWidth: '70%',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerOptionActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  pickerOptionText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  pickerOptionTextActive: {
    color: '#FF9F43',
    fontFamily: 'Poppins-SemiBold',
  },
  subsection: {
    marginTop: 8,
    marginBottom: 12,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF8E6',
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
  listItem: {
    marginBottom: 8,
  },
  smallInput: {
    height: 44,
    fontSize: 13,
  },
  tinyInput: {
    height: 40,
    fontSize: 12,
    width: 60,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  removeButton: {
    width: 36,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  costInput: {
    width: 80,
    marginLeft: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#FF9F43',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default PlanForm;

