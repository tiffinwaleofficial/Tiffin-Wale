import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, X, Trash2, Edit, MapPin } from 'lucide-react-native';
import { useCustomerStore } from '@/store/customerStore';
import { DeliveryAddress } from '@/types/api';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DeliveryAddressesScreen() {
  const router = useRouter();
  const { addresses, isLoading, error, fetchAddresses, addAddress, updateAddress, deleteAddress } = useCustomerStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openModal = (address?: DeliveryAddress) => {
    setSelectedAddress(address || null);
    setModalVisible(true);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteAddress(id), style: 'destructive' },
      ]
    );
  };
  
  const AddressForm = ({ address, onSave, onCancel }: { address: DeliveryAddress | null, onSave: (addr: DeliveryAddress) => void, onCancel: () => void }) => {
    const [formState, setFormState] = useState({
      name: address?.name || '',
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'India',
      isDefault: address?.isDefault || false,
    });
  
    const handleSave = () => {
        const dataToSave = { ...formState, id: address?.id };
        onSave(dataToSave as DeliveryAddress);
    };
  
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{address ? 'Edit Address' : 'New Address'}</Text>
        <TextInput style={styles.input} placeholder="Name (e.g. Home, Work)" value={formState.name} onChangeText={t => setFormState({...formState, name: t})} />
        <TextInput style={styles.input} placeholder="Street" value={formState.street} onChangeText={t => setFormState({...formState, street: t})} />
        <TextInput style={styles.input} placeholder="City" value={formState.city} onChangeText={t => setFormState({...formState, city: t})} />
        <TextInput style={styles.input} placeholder="State" value={formState.state} onChangeText={t => setFormState({...formState, state: t})} />
        <TextInput style={styles.input} placeholder="Postal Code" value={formState.postalCode} onChangeText={t => setFormState({...formState, postalCode: t})} keyboardType="numeric" />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>Save</Text></TouchableOpacity>
        </View>
      </View>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
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
        {addresses.map((address, index) => (
            <Animated.View key={address.id || index} entering={FadeInDown.delay(index * 100).duration(400)}>
          <View style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{address.name}</Text>
              <Text style={styles.addressText}>{`${address.street}, ${address.city}, ${address.state} ${address.postalCode}`}</Text>
                  </View>
                  <View style={styles.addressActions}>
              <TouchableOpacity onPress={() => openModal(address)}><Edit size={20} color="#333" /></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(address.id)}><Trash2 size={20} color="#E53935" /></TouchableOpacity>
                  </View>
                </View>
          </Animated.View>
        ))}
      </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <AddressForm address={selectedAddress} onSave={handleSaveAddress} onCancel={() => setModalVisible(false)} />
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
    addressCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, marginBottom: 10 },
    addressInfo: { flex: 1 },
    addressName: { fontSize: 16, fontWeight: 'bold' },
    addressText: { color: '#666' },
    addressActions: { flexDirection: 'row', gap: 15 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, width: '90%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
    cancelButton: { padding: 10 },
    cancelButtonText: { color: '#666' },
    saveButton: { backgroundColor: '#FF9B42', padding: 10, borderRadius: 5, marginLeft: 10 },
    saveButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333' },
    emptyDescription: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
    errorText: { fontSize: 16, color: 'red' },
}); 