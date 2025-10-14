import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, X, Trash2, Edit, MapPin, Home, Building, MapPin as OtherIcon } from 'lucide-react-native';
import { useCustomerStore } from '@/store/customerStore';
import { DeliveryAddress } from '@/types/api';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { showNotification } from '@/utils/notificationService';

export default function DeliveryAddressesScreen() {
  const router = useRouter();
  const { addresses, isLoading, error, fetchAddresses, addAddress, updateAddress, deleteAddress } = useCustomerStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('add');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<DeliveryAddress | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openModal = (address?: DeliveryAddress, mode: 'view' | 'edit' | 'add' = 'add') => {
    setSelectedAddress(address || null);
    setModalMode(mode);
    setModalVisible(true);
  };

  const handleDelete = (address: DeliveryAddress) => {
    console.log('🗑️ handleDelete called for address:', address);
    setAddressToDelete(address);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (addressToDelete?.id) {
      console.log('🗑️ Delete confirmed, calling deleteAddress with id:', addressToDelete.id);
      await deleteAddress(addressToDelete.id);
      setDeleteModalVisible(false);
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    console.log('🗑️ Delete cancelled');
    setDeleteModalVisible(false);
    setAddressToDelete(null);
  };
  
  const AddressForm = ({ address, mode, onSave, onCancel, onEdit }: { 
    address: DeliveryAddress | null, 
    mode: 'view' | 'edit' | 'add',
    onSave: (addr: DeliveryAddress) => void, 
    onCancel: () => void,
    onEdit: () => void
  }) => {
    const [formState, setFormState] = useState({
      address: address?.address || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      landmark: address?.landmark || '',
      phoneNumber: address?.phoneNumber || '',
      type: address?.type || 'Other' as 'Home' | 'Office' | 'Other',
      isDefault: address?.isDefault || false,
    });

    const addressTypes = [
      { value: 'Home', label: 'Home', icon: Home },
      { value: 'Office', label: 'Office', icon: Building },
      { value: 'Other', label: 'Other', icon: OtherIcon },
    ];

    const getTypeIcon = (type?: string) => {
      switch (type) {
        case 'Home': return <Home size={20} color="#FF9B42" />;
        case 'Office': return <Building size={20} color="#FF9B42" />;
        default: return <OtherIcon size={20} color="#FF9B42" />;
      }
    };
  
    const handleSave = () => {
        if (!formState.type) {
          alert('Please select an address type');
          return;
        }
        
        const dataToSave = { 
          ...formState, 
          id: address?.id,
          displayName: formState.type, // Use type as display name for UI
        };
        onSave(dataToSave as DeliveryAddress);
    };
  
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';
  
    return (
      <ScrollView style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {isViewMode ? 'Address Details' : isEditMode ? 'Edit Address' : 'New Address'}
          </Text>
          {isViewMode && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Edit size={20} color="#FF9B42" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {isViewMode ? (
          // Read-only view
          <View style={styles.viewContainer}>
            <View style={styles.viewField}>
              <Text style={styles.viewLabel}>Address Type</Text>
              <View style={styles.viewTypeContainer}>
                {getTypeIcon(formState.type)}
                <Text style={styles.viewTypeText}>{formState.type}</Text>
              </View>
            </View>
            
            <View style={styles.viewField}>
              <Text style={styles.viewLabel}>Full Address</Text>
              <Text style={styles.viewValue}>{formState.address}</Text>
            </View>
            
            <View style={styles.viewField}>
              <Text style={styles.viewLabel}>City</Text>
              <Text style={styles.viewValue}>{formState.city}</Text>
            </View>
            
            <View style={styles.viewField}>
              <Text style={styles.viewLabel}>State</Text>
              <Text style={styles.viewValue}>{formState.state}</Text>
            </View>
            
            <View style={styles.viewField}>
              <Text style={styles.viewLabel}>Zip Code</Text>
              <Text style={styles.viewValue}>{formState.zipCode}</Text>
            </View>
            
            {formState.phoneNumber && (
              <View style={styles.viewField}>
                <Text style={styles.viewLabel}>Phone Number</Text>
                <Text style={styles.viewValue}>{formState.phoneNumber}</Text>
              </View>
            )}
            
            {formState.landmark && (
              <View style={styles.viewField}>
                <Text style={styles.viewLabel}>Landmark</Text>
                <Text style={styles.viewValue}>{formState.landmark}</Text>
              </View>
            )}
            
            <View style={styles.viewField}>
              <Text style={styles.viewLabel}>Default Address</Text>
              <Text style={styles.viewValue}>{formState.isDefault ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        ) : (
          // Edit/Add mode
          <>
            <TextInput 
              style={styles.input} 
              placeholder="Full Address" 
              value={formState.address} 
              onChangeText={t => setFormState({...formState, address: t})} 
              multiline
              numberOfLines={3}
            />
        <TextInput style={styles.input} placeholder="City" value={formState.city} onChangeText={t => setFormState({...formState, city: t})} />
        <TextInput style={styles.input} placeholder="State" value={formState.state} onChangeText={t => setFormState({...formState, state: t})} />
            <TextInput style={styles.input} placeholder="Zip Code" value={formState.zipCode} onChangeText={t => setFormState({...formState, zipCode: t})} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Phone Number (optional)" value={formState.phoneNumber} onChangeText={t => setFormState({...formState, phoneNumber: t})} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Landmark (optional)" value={formState.landmark} onChangeText={t => setFormState({...formState, landmark: t})} />
            
            {/* Default Address Toggle */}
            <View style={styles.defaultContainer}>
              <Text style={styles.defaultLabel}>Set as Default Address</Text>
              <Switch
                value={formState.isDefault}
                onValueChange={(value) => setFormState({...formState, isDefault: value})}
                trackColor={{ false: '#E5E5E5', true: '#FF9B42' }}
                thumbColor={formState.isDefault ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            {/* Address Type Selection - Small Tags */}
            <Text style={styles.fieldLabel}>Address Type *</Text>
            <View style={styles.tagContainer}>
              {addressTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.tagButton,
                      formState.type === type.value && styles.tagButtonActive
                    ]}
                    onPress={() => setFormState({...formState, type: type.value as 'Home' | 'Office' | 'Other'})}
                  >
                    <IconComponent size={16} color={formState.type === type.value ? '#FFFFFF' : '#FF9B42'} />
                    <Text style={[
                      styles.tagButtonText,
                      formState.type === type.value && styles.tagButtonTextActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.modalButtons}>
          {isViewMode ? (
            <>
              <TouchableOpacity style={styles.deleteButton} onPress={() => {
                console.log('🗑️ Modal delete button clicked for address:', address);
                if (address) {
                  handleDelete(address);
                }
              }}>
                <Trash2 size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  const handleSaveAddress = async (address: DeliveryAddress) => {
    if (address.id) {
        await updateAddress(address);
    } else {
        const { id, ...rest } = address;
        await addAddress(rest);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Delivery Addresses</Text>
        <TouchableOpacity onPress={() => openModal()} style={styles.addButton}>
          <Plus size={24} color="#FF9B42" />
        </TouchableOpacity>
      </View>
      {isLoading && addresses.length === 0 ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#FF9B42" />
      ) : error ? (
        <View style={styles.centerContainer}><Text style={styles.errorText}>{error}</Text></View>
      ) : addresses.length === 0 ? (
        <View style={styles.centerContainer}>
            <MapPin size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No addresses found</Text>
            <Text style={styles.emptyDescription}>Add a new address to get started</Text>
        </View>
      ) : (
      <ScrollView style={styles.content}>
        {addresses.map((address, index) => {
          console.log('📍 Rendering address:', address);
          console.log('📍 Address ID:', address.id);
          const getTypeIcon = (type?: string) => {
            switch (type) {
              case 'Home': return <Home size={20} color="#FF9B42" />;
              case 'Office': return <Building size={20} color="#FF9B42" />;
              default: return <OtherIcon size={20} color="#FF9B42" />;
            }
          };

          return (
            <Animated.View key={address.id || index} entering={FadeInDown.delay(index * 100).duration(400)}>
              <View style={[
                styles.addressCard,
                address.isDefault && styles.defaultAddressCard
              ]}>
                <TouchableOpacity 
                  style={styles.addressInfo}
                  onPress={() => openModal(address, 'view')}
                >
                  <View style={styles.addressHeader}>
                    <View style={styles.addressTypeContainer}>
                      {getTypeIcon(address.type)}
                      <Text style={styles.addressName}>
                        {address.displayName || address.type || 'Address'}
                      </Text>
                    </View>
                    <View style={styles.headerActions}>
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                        </View>
                      )}
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            openModal(address, 'edit');
                          }}
                        >
                          <Edit size={20} color="#FF9B42" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            console.log('🗑️ Delete button clicked for address:', address);
                            handleDelete(address);
                          }}
                        >
                          <Trash2 size={20} color="#E53935" />
                        </TouchableOpacity>
                      </View>
                  </View>
                  </View>
                  <Text style={styles.addressText}>
                    {address.address}
                  </Text>
                  <Text style={styles.addressDetails}>
                    {`${address.city}, ${address.state} ${address.zipCode || ''}`}
                  </Text>
                  {address.phoneNumber && (
                    <Text style={styles.addressPhone}>Phone: {address.phoneNumber}</Text>
                  )}
                  {address.landmark && (
                    <Text style={styles.addressLandmark}>Near: {address.landmark}</Text>
                  )}
                </TouchableOpacity>
                </View>
          </Animated.View>
          );
        })}
      </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <AddressForm 
            address={selectedAddress} 
            mode={modalMode}
            onSave={handleSaveAddress} 
            onCancel={() => setModalVisible(false)}
            onEdit={() => setModalMode('edit')}
          />
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete Address</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete this address? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={styles.deleteModalCancelButton} onPress={cancelDelete}>
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirmButton} onPress={confirmDelete}>
                <Text style={styles.deleteModalConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, backgroundColor: '#FFFFFF' },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    addButton: { padding: 8 },
    content: { padding: 16 },
    addressCard: { 
      backgroundColor: '#FFFFFF', 
      padding: 16, 
      borderRadius: 12, 
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    defaultAddressCard: {
      borderWidth: 2,
      borderColor: '#FF9B42',
    },
    addressInfo: { flex: 1 },
    addressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    addressTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addressName: { 
      fontSize: 16, 
      fontWeight: 'bold', 
      marginLeft: 8,
      color: '#333',
    },
    defaultBadge: {
      backgroundColor: '#FF9B42',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    defaultBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
    addressText: { 
      color: '#333',
      fontSize: 14,
      marginBottom: 4,
    },
    addressDetails: {
      color: '#666',
      fontSize: 13,
      marginBottom: 2,
    },
    addressPhone: {
      color: '#666',
      fontSize: 13,
      marginBottom: 2,
    },
    addressLandmark: {
      color: '#999',
      fontSize: 12,
      fontStyle: 'italic',
    },
    modalContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    modalContent: { 
      backgroundColor: '#FFFFFF', 
      padding: 20, 
      borderRadius: 12, 
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: { 
      fontSize: 18, 
      fontWeight: 'bold',
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#FF9B42',
      backgroundColor: '#FFFFFF',
    },
    editButtonText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '500',
      color: '#FF9B42',
    },
    viewContainer: {
      marginBottom: 20,
    },
    viewField: {
      marginBottom: 16,
    },
    viewLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      marginBottom: 4,
    },
    viewValue: {
      fontSize: 16,
      color: '#666',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
    },
    viewTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
    },
    viewTypeText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#666',
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
      marginTop: 4,
    },
    tagContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      gap: 8,
      flexWrap: 'wrap',
    },
    tagButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#FF9B42',
      backgroundColor: '#FFFFFF',
    },
    tagButtonActive: {
      backgroundColor: '#FF9B42',
    },
    tagButtonText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '500',
      color: '#FF9B42',
    },
    tagButtonTextActive: {
      color: '#FFFFFF',
    },
    input: { 
      borderWidth: 1, 
      borderColor: '#ddd', 
      padding: 12, 
      borderRadius: 8, 
      marginBottom: 12,
      fontSize: 14,
    },
    defaultContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 8,
    },
    defaultLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
    },
    modalButtons: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginTop: 20,
      gap: 12,
    },
    cancelButton: { 
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
    },
    cancelButtonText: { 
      color: '#666',
      fontWeight: '500',
    },
    saveButton: { 
      flex: 2,
      backgroundColor: '#FF9B42', 
      padding: 12, 
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButtonText: { 
      color: '#FFFFFF', 
      fontWeight: 'bold',
    },
    closeButton: { 
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
    },
    closeButtonText: { 
      color: '#666',
      fontWeight: '500',
    },
    deleteButton: { 
      flex: 1,
      backgroundColor: '#E53935', 
      padding: 12, 
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginRight: 8,
    },
    deleteButtonText: { 
      color: '#FFFFFF', 
      fontWeight: 'bold',
      marginLeft: 4,
    },
    actionButton: {
      padding: 4,
      borderRadius: 4,
      backgroundColor: '#F8F8F8',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20 
    },
    emptyTitle: { 
      fontSize: 22, 
      fontWeight: 'bold', 
      marginTop: 20, 
      color: '#333' 
    },
    emptyDescription: { 
      fontSize: 16, 
      color: '#666', 
      marginTop: 10, 
      textAlign: 'center' 
    },
    errorText: { 
      fontSize: 16, 
      color: 'red' 
    },
    deleteModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteModalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 24,
      margin: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    deleteModalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    deleteModalMessage: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 24,
    },
    deleteModalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    deleteModalCancelButton: {
      backgroundColor: '#E5E5E5',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
    },
    deleteModalCancelText: {
      color: '#333',
      fontSize: 16,
      fontWeight: '500',
    },
    deleteModalConfirmButton: {
      backgroundColor: '#E53935',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
    },
    deleteModalConfirmText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
}); 