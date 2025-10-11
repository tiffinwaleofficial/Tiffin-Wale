import { create } from 'zustand';
import { DeliveryAddress } from '@/types/api';
import api from '@/utils/apiClient';

interface CustomerState {
  addresses: DeliveryAddress[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => Promise<void>;
  updateAddress: (address: DeliveryAddress) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await api.customer.getAddresses();
      set({ addresses, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch addresses',
        isLoading: false,
      });
    }
  },

  addAddress: async (address: Omit<DeliveryAddress, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newAddress = await api.customer.addAddress(address);
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add address',
        isLoading: false,
      });
    }
  },

  updateAddress: async (address: DeliveryAddress) => {
    set({ isLoading: true, error: null });
    if (!address.id) {
      set({ error: 'Address ID is missing for update', isLoading: false });
      return;
    }
    try {
      const updatedAddress = await api.customer.updateAddress(address.id, address);
      set((state) => ({
        addresses: state.addresses.map((a) => (a.id === address.id ? updatedAddress : a)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update address',
        isLoading: false,
      });
    }
  },

  deleteAddress: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.customer.deleteAddress(id);
      set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete address',
        isLoading: false,
      });
    }
  },
})); 