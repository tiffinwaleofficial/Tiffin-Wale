import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Home,
  Map,
  Navigation,
  Edit,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { usePartnerStore } from '../../store/partnerStore';
import { api } from '../../lib/api';

const AddressScreen = () => {
  const router = useRouter();
  const { profile, fetchProfile } = usePartnerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Address Fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (profile?.address && typeof profile.address === 'object') {
      setStreet(profile.address.street || '');
      setCity(profile.address.city || '');
      setState(profile.address.state || '');
      setPostalCode(profile.address.postalCode || '');
      setCountry(profile.address.country || 'India');
    }
  }, [profile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleSave = async () => {
    if (!street || !city || !state || !postalCode) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      const updateData = {
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      };

      await api.partner.updateProfile(updateData);
      await fetchProfile();
      setIsEditing(false);
      alert('Address updated successfully!');
    } catch (error) {
      console.error('Failed to update address:', error);
      alert('Failed to update address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  const hasAddress = profile.address && typeof profile.address === 'object' && profile.address?.street && profile.address?.city;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Address</Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          style={styles.editButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF9F43" />
          ) : isEditing ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Edit size={24} color="#FF9F43" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9F43']} />
        }
      >
        {/* Address Status */}
        {!isEditing && (
          <View style={styles.section}>
            {hasAddress ? (
              <View style={styles.statusBanner}>
                <CheckCircle size={20} color="#10B981" />
                <View style={styles.statusContent}>
                  <Text style={styles.statusTitle}>Address Verified</Text>
                  <Text style={styles.statusText}>
                    Your business address is set and visible to customers
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.statusBanner, styles.warningBanner]}>
                <AlertCircle size={20} color="#F59E0B" />
                <View style={styles.statusContent}>
                  <Text style={[styles.statusTitle, { color: '#F59E0B' }]}>
                    Address Not Complete
                  </Text>
                  <Text style={styles.statusText}>
                    Please add your complete business address
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Current Address Display */}
        {!isEditing && hasAddress && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#FF9F43" />
              <Text style={styles.sectionTitle}>Current Address</Text>
            </View>

            <View style={styles.addressCard}>
              <View style={styles.addressIconContainer}>
                <Home size={32} color="#FF9F43" />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressText}>
                  {typeof profile.address === 'object' && profile.address.street}
                </Text>
                <Text style={styles.addressText}>
                  {typeof profile.address === 'object' && profile.address.city}, {typeof profile.address === 'object' && profile.address.state} - {typeof profile.address === 'object' && profile.address.postalCode}
                </Text>
                <Text style={styles.addressText}>
                  {typeof profile.address === 'object' && profile.address.country}
                </Text>
              </View>
            </View>

            <View style={styles.addressDetailsGrid}>
              <View style={styles.detailCard}>
                <Map size={20} color="#3B82F6" />
                <Text style={styles.detailLabel}>City</Text>
                <Text style={styles.detailValue}>{typeof profile.address === 'object' && profile.address.city}</Text>
              </View>
              <View style={styles.detailCard}>
                <Navigation size={20} color="#10B981" />
                <Text style={styles.detailLabel}>State</Text>
                <Text style={styles.detailValue}>{typeof profile.address === 'object' && profile.address.state}</Text>
              </View>
              <View style={styles.detailCard}>
                <MapPin size={20} color="#F59E0B" />
                <Text style={styles.detailLabel}>Postal Code</Text>
                <Text style={styles.detailValue}>{typeof profile.address === 'object' && profile.address.postalCode}</Text>
              </View>
              <View style={styles.detailCard}>
                <Home size={20} color="#EC4899" />
                <Text style={styles.detailLabel}>Country</Text>
                <Text style={styles.detailValue}>{typeof profile.address === 'object' && profile.address.country}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Edit Address Form */}
        {isEditing && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Edit size={20} color="#FF9F43" />
              <Text style={styles.sectionTitle}>Edit Address</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street Address *</Text>
                <TextInput
                  style={styles.input}
                  value={street}
                  onChangeText={setStreet}
                  placeholder="Street, building, apartment number"
                  placeholderTextColor="#999"
                  multiline
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City name"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>State *</Text>
                  <TextInput
                    style={styles.input}
                    value={state}
                    onChangeText={setState}
                    placeholder="State name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Postal Code *</Text>
                  <TextInput
                    style={styles.input}
                    value={postalCode}
                    onChangeText={setPostalCode}
                    placeholder="123456"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput
                    style={styles.input}
                    value={country}
                    onChangeText={setCountry}
                    placeholder="India"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.helpNote}>
                <AlertCircle size={16} color="#F59E0B" />
                <Text style={styles.helpNoteText}>
                  Please provide your accurate business address. This will be shown to customers
                  and used for delivery calculations.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Delivery Coverage */}
        {!isEditing && hasAddress && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Navigation size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Delivery Coverage</Text>
            </View>

            <View style={styles.deliveryCard}>
              <View style={styles.deliveryIconContainer}>
                <Navigation size={28} color="#8B5CF6" />
              </View>
              <View style={styles.deliveryContent}>
                <Text style={styles.deliveryLabel}>Delivery Radius</Text>
                <Text style={styles.deliveryValue}>
                  {profile.deliveryRadius || 5} km
                </Text>
                <Text style={styles.deliveryHint}>
                  From your business location
                </Text>
              </View>
            </View>

            <View style={styles.coverageNote}>
              <AlertCircle size={16} color="#666" />
              <Text style={styles.coverageNoteText}>
                Customers within {profile.deliveryRadius || 5} km of your address can place orders.
                You can update delivery radius in Business Profile.
              </Text>
            </View>
          </View>
        )}

        {/* Map Preview Placeholder */}
        {!isEditing && hasAddress && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Map size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Location on Map</Text>
            </View>

            <View style={styles.mapPlaceholder}>
              <MapPin size={40} color="#999" />
              <Text style={styles.mapPlaceholderText}>
                Map integration coming soon
              </Text>
              {typeof profile.address === 'object' && (
                <Text style={styles.mapPlaceholderSubtext}>
                  {profile.address.city}, {profile.address.state}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Important Notes */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.notesTitle}>Important Notes</Text>
            <View style={styles.noteItem}>
              <Text style={styles.noteBullet}>•</Text>
              <Text style={styles.noteText}>
                Your business address is shown to customers when they search for tiffin services
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteBullet}>•</Text>
              <Text style={styles.noteText}>
                Delivery radius is calculated from this address
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteBullet}>•</Text>
              <Text style={styles.noteText}>
                Make sure your address is accurate for proper order routing
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  warningBanner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContent: {
    flex: 1,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    lineHeight: 20,
  },
  addressDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  form: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  helpNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginTop: 8,
  },
  helpNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#92400E',
    lineHeight: 16,
  },
  deliveryCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 12,
  },
  deliveryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  deliveryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 4,
  },
  deliveryValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#8B5CF6',
    marginBottom: 2,
  },
  deliveryHint: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  coverageNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  coverageNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 16,
  },
  mapPlaceholder: {
    backgroundColor: '#F5F5F5',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#999',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#CCC',
    marginTop: 4,
  },
  notesTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  noteBullet: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FF9F43',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 18,
  },
});

export default AddressScreen;

