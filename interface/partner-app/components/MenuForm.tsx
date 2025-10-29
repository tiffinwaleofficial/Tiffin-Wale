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
import { X } from 'lucide-react-native';
import { useTheme } from '../store/themeStore';
import { api, MenuItem, Menu } from '../lib/api';
import { UploadComponent, UploadedFile } from './ui/UploadComponent';
import { UploadType } from '../services/cloudinaryUploadService';

interface MenuFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  menuItem: MenuItem | null;
  menus?: Menu[]; // Available menus to select from
}

const MenuForm: React.FC<MenuFormProps> = ({ isVisible, onClose, menuItem, menus = [], onSave }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [tags, setTags] = useState('');
  const [allergens, setAllergens] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setDescription(menuItem.description || '');
      setPrice(menuItem.price?.toString() || '');
      // Set menu if provided (for both new items with pre-selected menu and existing items)
      if (menuItem.menu) {
        setSelectedMenu(menuItem.menu);
      }
      setIsAvailable(menuItem.isAvailable ?? true);
      setTags((menuItem.tags || []).join(', '));
      setAllergens((menuItem.allergens || []).join(', '));
      setSpiceLevel(menuItem.spiceLevel || '');
      setIsVegetarian(menuItem.isVegetarian || false);
      setIsVegan(menuItem.isVegan || false);
      setIsGlutenFree(menuItem.isGlutenFree || false);

      // Load images
      if (menuItem.images && menuItem.images.length > 0) {
        setImages(menuItem.images.map(url => ({
          uri: url,
          status: 'completed' as const,
          progress: 100,
          cloudinaryUrl: url,
        })));
      } else if (menuItem.imageUrl) {
        setImages([{
          uri: menuItem.imageUrl,
          status: 'completed' as const,
          progress: 100,
          cloudinaryUrl: menuItem.imageUrl,
        }]);
      } else {
        setImages([]);
      }
    } else {
      // Reset form for new item
      setName('');
      setDescription('');
      setPrice('');
      // Only reset selectedMenu if menuItem is completely null (not just a partial object with menu)
      // If menuItem exists with a menu property, it will be handled in the if branch above
      setSelectedMenu('');
      setIsAvailable(true);
      setImages([]);
      setTags('');
      setAllergens('');
      setSpiceLevel('');
      setIsVegetarian(false);
      setIsVegan(false);
      setIsGlutenFree(false);
    }
  }, [menuItem, isVisible]);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Collect uploaded image URLs
      const imageUrls = images
        .filter(img => img.cloudinaryUrl)
        .map(img => img.cloudinaryUrl!);

      const menuItemData: any = {
      name,
      description,
      price: parseFloat(price),
        isAvailable,
        menu: selectedMenu || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : undefined, // For backward compatibility
      };

      // Add optional fields
      if (tags.trim()) {
        menuItemData.tags = tags.split(',').map(t => t.trim()).filter(t => t);
      }
      if (allergens.trim()) {
        menuItemData.allergens = allergens.split(',').map(a => a.trim()).filter(a => a);
      }
      if (spiceLevel.trim()) {
        menuItemData.spiceLevel = spiceLevel.trim();
      }
      menuItemData.isVegetarian = isVegetarian;
      menuItemData.isVegan = isVegan;
      menuItemData.isGlutenFree = isGlutenFree;

      if (menuItem?._id || menuItem?.id) {
        await api.menu.updateMenuItem(menuItem._id || menuItem.id || '', menuItemData);
    } else {
        await api.menu.createMenuItem(menuItemData);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      alert('Failed to save menu item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: '#FEF6E9' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#333' }]}>
            {menuItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Basic Information</Text>
            
            <Text style={[styles.inputLabel, { color: '#666' }]}>Item Name *</Text>
          <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Enter item name"
              placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

            <Text style={[styles.inputLabel, { color: '#666' }]}>Description</Text>
          <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Describe your menu item"
              placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
          />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>Price (₹) *</Text>
          <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="0.00"
                  placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>Menu</Text>
                {menus.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuPicker}>
                    {menus.map((menu) => (
                      <TouchableOpacity
                        key={menu._id || menu.id}
                        style={[
                          styles.menuOption,
                          selectedMenu === (menu._id || menu.id) && styles.menuOptionActive,
                        ]}
                        onPress={() => setSelectedMenu(menu._id || menu.id || '')}
                      >
                        <Text
                          style={[
                            styles.menuOptionText,
                            selectedMenu === (menu._id || menu.id) && styles.menuOptionTextActive,
                          ]}
                        >
                          {menu.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={[styles.helperText, { color: '#999' }]}>
                    No menus created. Create a menu first.
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: '#666' }]}>Item Available</Text>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#DDD', true: '#FF9F43' }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Item Images</Text>
            <Text style={[styles.sectionSubtitle, { color: '#666' }]}>
              Upload multiple photos of your menu item (Max 10 images)
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

          {/* Dietary Preferences */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Dietary Information</Text>
            
            <View style={styles.switchGrid}>
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: '#666' }]}>Vegetarian</Text>
                <Switch
                  value={isVegetarian}
                  onValueChange={setIsVegetarian}
                  trackColor={{ false: '#DDD', true: '#10B981' }}
                  thumbColor="#FFF"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: '#666' }]}>Vegan</Text>
                <Switch
                  value={isVegan}
                  onValueChange={setIsVegan}
                  trackColor={{ false: '#DDD', true: '#10B981' }}
                  thumbColor="#FFF"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: '#666' }]}>Gluten Free</Text>
                <Switch
                  value={isGlutenFree}
                  onValueChange={setIsGlutenFree}
                  trackColor={{ false: '#DDD', true: '#10B981' }}
                  thumbColor="#FFF"
                />
              </View>
            </View>

            <Text style={[styles.inputLabel, { color: '#666' }]}>Spice Level</Text>
          <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="e.g., Mild, Medium, Hot, Extra Hot"
              placeholderTextColor="#999"
              value={spiceLevel}
              onChangeText={setSpiceLevel}
            />

            <Text style={[styles.inputLabel, { color: '#666' }]}>Tags (comma separated)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="e.g., popular, recommended, spicy"
              placeholderTextColor="#999"
              value={tags}
              onChangeText={setTags}
            />

            <Text style={[styles.inputLabel, { color: '#666' }]}>Allergens (comma separated)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="e.g., dairy, nuts, gluten"
              placeholderTextColor="#999"
              value={allergens}
              onChangeText={setAllergens}
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
                <Text style={styles.buttonText}>Save Item</Text>
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
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginBottom: 6,
  },
  menuPicker: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  menuOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuOptionActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  menuOptionText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  menuOptionTextActive: {
    color: '#FF9F43',
    fontFamily: 'Poppins-SemiBold',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchGrid: {
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
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

export default MenuForm;
