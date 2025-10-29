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
import { api, Menu } from '../lib/api';
import { UploadComponent, UploadedFile } from './ui/UploadComponent';
import { UploadType } from '../services/cloudinaryUploadService';

interface MenuGroupFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  menu: Menu | null;
}

const MenuGroupForm: React.FC<MenuGroupFormProps> = ({ isVisible, onClose, menu, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [availableFrom, setAvailableFrom] = useState('08:00');
  const [availableTo, setAvailableTo] = useState('22:00');
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (menu) {
      setName(menu.name || '');
      setDescription(menu.description || '');
      setAvailableFrom(menu.availableFrom || '08:00');
      setAvailableTo(menu.availableTo || '22:00');
      setIsActive(menu.isActive ?? true);

      // Load images
      if (menu.images && menu.images.length > 0) {
        setImages(menu.images.map(url => ({
          uri: url,
          status: 'completed' as const,
          progress: 100,
          cloudinaryUrl: url,
        })));
      } else {
        setImages([]);
      }
    } else {
      // Reset form
      setName('');
      setDescription('');
      setAvailableFrom('08:00');
      setAvailableTo('22:00');
      setIsActive(true);
      setImages([]);
    }
  }, [menu, isVisible]);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Collect uploaded image URLs
      const imageUrls = images
        .filter(img => img.cloudinaryUrl)
        .map(img => img.cloudinaryUrl!);

      const menuData = {
        name,
        description,
        availableFrom,
        availableTo,
        isActive,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (menu?._id || menu?.id) {
        await api.menu.updateMenu(menu._id || menu.id || '', menuData);
      } else {
        await api.menu.createMenu(menuData);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save menu:', error);
      alert('Failed to save menu. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: '#FEF6E9' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#333' }]}>
            {menu ? 'Edit Menu' : 'Create New Menu'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Menu Information</Text>
            
            <Text style={[styles.inputLabel, { color: '#666' }]}>Menu Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="e.g., Breakfast Menu, Lunch Special, Dinner Menu"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.inputLabel, { color: '#666' }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: '#FFF', color: '#333' }]}
              placeholder="Describe this menu"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>Available From</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="08:00"
                  placeholderTextColor="#999"
                  value={availableFrom}
                  onChangeText={setAvailableFrom}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>Available To</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#FFF', color: '#333' }]}
                  placeholder="22:00"
                  placeholderTextColor="#999"
                  value={availableTo}
                  onChangeText={setAvailableTo}
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: '#666' }]}>Menu Active</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#DDD', true: '#FF9F43' }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Menu Banner Images */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#333' }]}>Menu Banner Images</Text>
            <Text style={[styles.sectionSubtitle, { color: '#666' }]}>
              Upload banner images for this menu (Max 5 images)
            </Text>
            <UploadComponent
              title=""
              description=""
              uploadType={UploadType.MEAL_IMAGE}
              maxFiles={5}
              allowedTypes={['image']}
              files={images}
              onFilesChange={setImages}
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
              disabled={isLoading || !name}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Save Menu</Text>
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default MenuGroupForm;

