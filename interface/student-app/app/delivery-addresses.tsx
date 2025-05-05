import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, MapPin, Home, Briefcase, Navigation, Edit2, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Address {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
  type: 'home' | 'office' | 'other';
}

// Mock data for addresses
const initialAddresses: Address[] = [
  {
    id: '1',
    title: 'Home',
    address: '123 Main Street, Apartment 4B, New York, NY 10001',
    isDefault: true,
    type: 'home'
  },
  {
    id: '2',
    title: 'Office',
    address: '456 Park Avenue, Floor 8, New York, NY 10022',
    isDefault: false,
    type: 'office'
  }
];

type AddressFormData = Omit<Address, 'id'>;

export default function DeliveryAddresses() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<AddressFormData>({
    title: '',
    address: '',
    isDefault: false,
    type: 'home'
  });
  const [editAddress, setEditAddress] = useState<Address>({
    id: '',
    title: '',
    address: '',
    isDefault: false,
    type: 'home'
  });

  const handleAddAddress = () => {
    if (newAddress.title.trim() === '' || newAddress.address.trim() === '') {
      return; // Don't add empty addresses
    }
    
    const newId = (addresses.length + 1).toString();
    
    // If new address is set as default, update other addresses
    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    setAddresses([
      ...updatedAddresses,
      {
        ...newAddress,
        id: newId
      }
    ]);
    
    // Reset form
    setNewAddress({
      title: '',
      address: '',
      isDefault: false,
      type: 'home'
    });
    setShowAddForm(false);
  };

  const handleEditAddress = (id: string) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setEditAddress({ ...addressToEdit });
      setEditingAddressId(id);
    }
  };

  const handleSaveEdit = () => {
    if (editAddress.title.trim() === '' || editAddress.address.trim() === '') {
      return; // Don't save empty addresses
    }
    
    // If edited address is set as default, update other addresses
    let updatedAddresses = [...addresses];
    if (editAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editingAddressId ? true : false
      }));
    } else {
      // If we're removing default status, ensure there's still a default
      const hasAnotherDefault = updatedAddresses.some(addr => 
        addr.id !== editingAddressId && addr.isDefault
      );
      
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editingAddressId ? 
          (hasAnotherDefault ? false : addr.isDefault) : addr.isDefault
      }));
    }
    
    setAddresses(updatedAddresses.map(addr => 
      addr.id === editingAddressId ? { ...editAddress } : addr
    ));
    
    // Reset editing state
    setEditingAddressId(null);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
  };

  const handleMakeDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const getAddressIcon = (type: 'home' | 'office' | 'other') => {
    switch (type) {
      case 'home':
        return <Home size={20} color="#FF9B42" />;
      case 'office':
        return <Briefcase size={20} color="#FF9B42" />;
      default:
        return <MapPin size={20} color="#FF9B42" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Addresses</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Addresses List */}
        {addresses.map((address, index) => (
          <Animated.View 
            key={address.id} 
            entering={FadeInDown.delay(index * 100).duration(300)}
            style={[styles.addressCard, address.isDefault && styles.defaultAddressCard]}
          >
            {editingAddressId === address.id ? (
              // Edit Address Form
              <View>
                <Text style={styles.formTitle}>Edit Address</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Home, Office, etc."
                    value={editAddress.title}
                    onChangeText={(text) => setEditAddress({...editAddress, title: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter your full address"
                    multiline
                    numberOfLines={3}
                    value={editAddress.address}
                    onChangeText={(text) => setEditAddress({...editAddress, address: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address Type</Text>
                  <View style={styles.addressTypeContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.addressTypeButton, 
                        editAddress.type === 'home' && styles.addressTypeButtonActive
                      ]}
                      onPress={() => setEditAddress({...editAddress, type: 'home'})}
                    >
                      <Home size={16} color={editAddress.type === 'home' ? '#FF9B42' : '#666666'} />
                      <Text style={[
                        styles.addressTypeText,
                        editAddress.type === 'home' && styles.addressTypeTextActive
                      ]}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.addressTypeButton, 
                        editAddress.type === 'office' && styles.addressTypeButtonActive
                      ]}
                      onPress={() => setEditAddress({...editAddress, type: 'office'})}
                    >
                      <Briefcase size={16} color={editAddress.type === 'office' ? '#FF9B42' : '#666666'} />
                      <Text style={[
                        styles.addressTypeText,
                        editAddress.type === 'office' && styles.addressTypeTextActive
                      ]}>Office</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.addressTypeButton, 
                        editAddress.type === 'other' && styles.addressTypeButtonActive
                      ]}
                      onPress={() => setEditAddress({...editAddress, type: 'other'})}
                    >
                      <MapPin size={16} color={editAddress.type === 'other' ? '#FF9B42' : '#666666'} />
                      <Text style={[
                        styles.addressTypeText,
                        editAddress.type === 'other' && styles.addressTypeTextActive
                      ]}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.defaultSwitch}>
                  <Text style={styles.defaultSwitchText}>Set as default address</Text>
                  <Switch
                    value={editAddress.isDefault}
                    onValueChange={(value) => setEditAddress({...editAddress, isDefault: value})}
                    trackColor={{ false: '#E5E5E5', true: '#FFD3B0' }}
                    thumbColor={editAddress.isDefault ? '#FF9B42' : '#FFFFFF'}
                  />
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.saveButton,
                      (!editAddress.title.trim() || !editAddress.address.trim()) && styles.saveButtonDisabled
                    ]}
                    onPress={handleSaveEdit}
                    disabled={!editAddress.title.trim() || !editAddress.address.trim()}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Regular Address Display
              <>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTitleContainer}>
                    {getAddressIcon(address.type)}
                    <Text style={styles.addressTitle}>{address.title}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditAddress(address.id)}
                    >
                      <Edit2 size={16} color="#666666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 size={16} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.addressText}>{address.address}</Text>
                
                {!address.isDefault && (
                  <TouchableOpacity 
                    style={styles.makeDefaultButton}
                    onPress={() => handleMakeDefault(address.id)}
                  >
                    <Text style={styles.makeDefaultText}>Make Default</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </Animated.View>
        ))}

        {/* Add New Address Form */}
        {showAddForm ? (
          <Animated.View 
            entering={FadeInDown.duration(300)}
            style={styles.addAddressForm}
          >
            <Text style={styles.formTitle}>Add New Address</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Home, Office, etc."
                value={newAddress.title}
                onChangeText={(text) => setNewAddress({...newAddress, title: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your full address"
                multiline
                numberOfLines={3}
                value={newAddress.address}
                onChangeText={(text) => setNewAddress({...newAddress, address: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address Type</Text>
              <View style={styles.addressTypeContainer}>
                <TouchableOpacity 
                  style={[
                    styles.addressTypeButton, 
                    newAddress.type === 'home' && styles.addressTypeButtonActive
                  ]}
                  onPress={() => setNewAddress({...newAddress, type: 'home'})}
                >
                  <Home size={16} color={newAddress.type === 'home' ? '#FF9B42' : '#666666'} />
                  <Text style={[
                    styles.addressTypeText,
                    newAddress.type === 'home' && styles.addressTypeTextActive
                  ]}>Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.addressTypeButton, 
                    newAddress.type === 'office' && styles.addressTypeButtonActive
                  ]}
                  onPress={() => setNewAddress({...newAddress, type: 'office'})}
                >
                  <Briefcase size={16} color={newAddress.type === 'office' ? '#FF9B42' : '#666666'} />
                  <Text style={[
                    styles.addressTypeText,
                    newAddress.type === 'office' && styles.addressTypeTextActive
                  ]}>Office</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.addressTypeButton, 
                    newAddress.type === 'other' && styles.addressTypeButtonActive
                  ]}
                  onPress={() => setNewAddress({...newAddress, type: 'other'})}
                >
                  <MapPin size={16} color={newAddress.type === 'other' ? '#FF9B42' : '#666666'} />
                  <Text style={[
                    styles.addressTypeText,
                    newAddress.type === 'other' && styles.addressTypeTextActive
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.defaultSwitch}>
              <Text style={styles.defaultSwitchText}>Set as default address</Text>
              <Switch
                value={newAddress.isDefault}
                onValueChange={(value) => setNewAddress({...newAddress, isDefault: value})}
                trackColor={{ false: '#E5E5E5', true: '#FFD3B0' }}
                thumbColor={newAddress.isDefault ? '#FF9B42' : '#FFFFFF'}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!newAddress.title.trim() || !newAddress.address.trim()) && styles.saveButtonDisabled
                ]}
                onPress={handleAddAddress}
                disabled={!newAddress.title.trim() || !newAddress.address.trim()}
              >
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFAF0',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  defaultAddressCard: {
    borderWidth: 1,
    borderColor: '#FF9B42',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#FFF5E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9B42',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  makeDefaultButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FF9B42',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  makeDefaultText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9B42',
  },
  addButton: {
    backgroundColor: '#FF9B42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addAddressForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    flex: 1,
    marginRight: 8,
  },
  addressTypeButtonActive: {
    backgroundColor: '#FFF5E8',
  },
  addressTypeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  addressTypeTextActive: {
    color: '#FF9B42',
  },
  defaultSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  defaultSwitchText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333333',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666666',
  },
  saveButton: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FF9B42',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#FFD3B0',
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
}); 