import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Users,
  Award,
  Globe,
  Facebook,
  Instagram,
  Edit,
  Camera,
  CheckCircle,
} from 'lucide-react-native';
import { usePartnerStore } from '../../store/partnerStore';
import { api } from '../../lib/api';
import { UploadComponent, UploadedFile } from '../../components/ui/UploadComponent';
import { UploadType } from '../../services/cloudinaryUploadService';

const BusinessProfileScreen = () => {
  const router = useRouter();
  const { profile, fetchProfile } = usePartnerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Business Info
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [minimumOrderAmount, setMinimumOrderAmount] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  
  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Business Hours
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [workingDays, setWorkingDays] = useState('');

  // Images
  const [logoFiles, setLogoFiles] = useState<UploadedFile[]>([]);
  const [bannerFiles, setBannerFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || '');
      setDescription(profile.description || '');
      setCuisineTypes((profile.cuisineTypes || []).join(', '));
      setContactEmail(profile.contactEmail || '');
      setContactPhone(profile.contactPhone || '');
      setWhatsappNumber(profile.whatsappNumber || '');
      setGstNumber(profile.gstNumber || '');
      setLicenseNumber(profile.licenseNumber || '');
      setEstablishedYear(profile.establishedYear?.toString() || '');
      setIsAcceptingOrders(profile.isAcceptingOrders ?? true);
      setDeliveryRadius(profile.deliveryRadius?.toString() || '');
      setMinimumOrderAmount(profile.minimumOrderAmount?.toString() || '');
      setDeliveryFee(profile.deliveryFee?.toString() || '');
      setEstimatedDeliveryTime(profile.estimatedDeliveryTime?.toString() || '');

      // Address
      if (profile.address) {
        setStreet(profile.address.street || '');
        setCity(profile.address.city || '');
        setState(profile.address.state || '');
        setPostalCode(profile.address.postalCode || '');
        setCountry(profile.address.country || 'India');
      }

      // Business Hours
      if (profile.businessHours) {
        setOpenTime(profile.businessHours.open || '');
        setCloseTime(profile.businessHours.close || '');
        setWorkingDays((profile.businessHours.days || []).join(', '));
      }

      // Images
      if (profile.logoUrl) {
        setLogoFiles([{
          uri: profile.logoUrl,
          status: 'completed',
          progress: 100,
          cloudinaryUrl: profile.logoUrl,
        }]);
      }
      if (profile.bannerUrl) {
        setBannerFiles([{
          uri: profile.bannerUrl,
          status: 'completed',
          progress: 100,
          cloudinaryUrl: profile.bannerUrl,
        }]);
      }
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updateData: any = {
        businessName,
        description,
        cuisineTypes: cuisineTypes.split(',').map(c => c.trim()).filter(c => c),
        contactEmail,
        contactPhone,
        whatsappNumber,
        gstNumber,
        licenseNumber,
        establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
        isAcceptingOrders,
        deliveryRadius: deliveryRadius ? parseFloat(deliveryRadius) : undefined,
        minimumOrderAmount: minimumOrderAmount ? parseFloat(minimumOrderAmount) : undefined,
        deliveryFee: deliveryFee ? parseFloat(deliveryFee) : undefined,
        estimatedDeliveryTime: estimatedDeliveryTime ? parseInt(estimatedDeliveryTime) : undefined,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
        businessHours: {
          open: openTime,
          close: closeTime,
          days: workingDays.split(',').map(d => d.trim()).filter(d => d),
        },
      };

      if (logoFiles.length > 0 && logoFiles[0].cloudinaryUrl) {
        updateData.logoUrl = logoFiles[0].cloudinaryUrl;
      }
      if (bannerFiles.length > 0 && bannerFiles[0].cloudinaryUrl) {
        updateData.bannerUrl = bannerFiles[0].cloudinaryUrl;
      }

      await api.partner.updateProfile(updateData);
      await fetchProfile();
      setIsEditing(false);
      alert('Business profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
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
        <Text style={styles.headerTitle}>Business Profile</Text>
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Banner & Logo Section */}
        <View style={styles.bannerSection}>
          {!isEditing ? (
            <>
              <View style={styles.bannerImageContainer}>
                {profile.bannerUrl ? (
                  <Image
                    source={{ uri: profile.bannerUrl }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
                    <Camera size={32} color="#CCC" />
                  </View>
                )}
              </View>
              <View style={styles.logoContainer}>
                {profile.logoUrl ? (
                  <Image
                    source={{ uri: profile.logoUrl }}
                    style={styles.logoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.logoImage, styles.logoPlaceholder]}>
                    <Building2 size={32} color="#CCC" />
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.editImagesSection}>
              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Banner Image</Text>
                <UploadComponent
                  title=""
                  uploadType={UploadType.BANNER_IMAGE}
                  maxFiles={1}
                  allowedTypes={['image']}
                  files={bannerFiles}
                  onFilesChange={setBannerFiles}
                />
              </View>
              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Logo</Text>
                <UploadComponent
                  title=""
                  uploadType={UploadType.LOGO}
                  maxFiles={1}
                  allowedTypes={['image']}
                  files={logoFiles}
                  onFilesChange={setLogoFiles}
                />
              </View>
            </View>
          )}
        </View>

        {/* Business Name & Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building2 size={20} color="#FF9F43" />
            <Text style={styles.sectionTitle}>Business Information</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                  style={styles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="Enter business name"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Tell customers about your tiffin center"
                  placeholderTextColor="#999"
                  multiline
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cuisine Types (comma separated)</Text>
                <TextInput
                  style={styles.input}
                  value={cuisineTypes}
                  onChangeText={setCuisineTypes}
                  placeholder="e.g., North Indian, South Indian"
                  placeholderTextColor="#999"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.businessName}>{profile.businessName}</Text>
              <Text style={styles.description}>{profile.description}</Text>
              {profile.cuisineTypes && profile.cuisineTypes.length > 0 && (
                <View style={styles.cuisineTagsContainer}>
                  {profile.cuisineTypes.map((cuisine, index) => (
                    <View key={index} style={styles.cuisineTag}>
                      <Text style={styles.cuisineTagText}>{cuisine}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Currently Accepting Orders</Text>
            <Switch
              value={isAcceptingOrders}
              onValueChange={setIsAcceptingOrders}
              disabled={!isEditing}
              trackColor={{ false: '#DDD', true: '#FF9F43' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Phone size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Email</Text>
                <TextInput
                  style={styles.input}
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  placeholder="email@example.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Phone</Text>
                <TextInput
                  style={styles.input}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>WhatsApp Number</Text>
                <TextInput
                  style={styles.input}
                  value={whatsappNumber}
                  onChangeText={setWhatsappNumber}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Mail size={18} color="#666" />
                <Text style={styles.infoText}>{profile.contactEmail || 'Not provided'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Phone size={18} color="#666" />
                <Text style={styles.infoText}>{profile.contactPhone || 'Not provided'}</Text>
              </View>
              {profile.whatsappNumber && (
                <View style={styles.infoRow}>
                  <Phone size={18} color="#25D366" />
                  <Text style={styles.infoText}>{profile.whatsappNumber}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  style={styles.input}
                  value={street}
                  onChangeText={setStreet}
                  placeholder="Street, building, apartment"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={state}
                    onChangeText={setState}
                    placeholder="State"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Postal Code</Text>
                  <TextInput
                    style={styles.input}
                    value={postalCode}
                    onChangeText={setPostalCode}
                    placeholder="123456"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
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
            </>
          ) : (
            <View style={styles.addressContainer}>
              <Text style={styles.addressText}>
                {profile.address?.street},{'\n'}
                {profile.address?.city}, {profile.address?.state} - {profile.address?.postalCode},{'\n'}
                {profile.address?.country}
              </Text>
            </View>
          )}
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Business Hours</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Opening Time</Text>
                  <TextInput
                    style={styles.input}
                    value={openTime}
                    onChangeText={setOpenTime}
                    placeholder="09:00"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Closing Time</Text>
                  <TextInput
                    style={styles.input}
                    value={closeTime}
                    onChangeText={setCloseTime}
                    placeholder="21:00"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Working Days (comma separated)</Text>
                <TextInput
                  style={styles.input}
                  value={workingDays}
                  onChangeText={setWorkingDays}
                  placeholder="Monday, Tuesday, Wednesday, ..."
                  placeholderTextColor="#999"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Clock size={18} color="#666" />
                <Text style={styles.infoText}>
                  {profile.businessHours?.open} - {profile.businessHours?.close}
                </Text>
              </View>
              {profile.businessHours?.days && profile.businessHours.days.length > 0 && (
                <View style={styles.daysContainer}>
                  {profile.businessHours.days.map((day, index) => (
                    <View key={index} style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>{day}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Delivery Information</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Delivery Radius (km)</Text>
                  <TextInput
                    style={styles.input}
                    value={deliveryRadius}
                    onChangeText={setDeliveryRadius}
                    placeholder="5"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Delivery Fee (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={deliveryFee}
                    onChangeText={setDeliveryFee}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Min Order Amount (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={minimumOrderAmount}
                    onChangeText={setMinimumOrderAmount}
                    placeholder="100"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Delivery Time (min)</Text>
                  <TextInput
                    style={styles.input}
                    value={estimatedDeliveryTime}
                    onChangeText={setEstimatedDeliveryTime}
                    placeholder="30"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{profile.deliveryRadius} km</Text>
                  <Text style={styles.statLabel}>Delivery Radius</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>₹{profile.deliveryFee}</Text>
                  <Text style={styles.statLabel}>Delivery Fee</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>₹{profile.minimumOrderAmount}</Text>
                  <Text style={styles.statLabel}>Min Order</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{profile.estimatedDeliveryTime} min</Text>
                  <Text style={styles.statLabel}>Delivery Time</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Legal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color="#EC4899" />
            <Text style={styles.sectionTitle}>Legal & Business Details</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>GST Number</Text>
                  <TextInput
                    style={styles.input}
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    placeholder="GST Number"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>License Number</Text>
                  <TextInput
                    style={styles.input}
                    value={licenseNumber}
                    onChangeText={setLicenseNumber}
                    placeholder="License Number"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Established Year</Text>
                <TextInput
                  style={styles.input}
                  value={establishedYear}
                  onChangeText={setEstablishedYear}
                  placeholder="2020"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>GST Number:</Text>
                <Text style={styles.infoValue}>{profile.gstNumber || 'Not provided'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>License Number:</Text>
                <Text style={styles.infoValue}>{profile.licenseNumber || 'Not provided'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Established:</Text>
                <Text style={styles.infoValue}>{profile.establishedYear || 'Not provided'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Rating & Reviews */}
        {!isEditing && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Performance</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.performanceCard}>
                <Text style={styles.performanceValue}>
                  {profile.averageRating ? profile.averageRating.toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.performanceLabel}>Rating</Text>
              </View>
              <View style={styles.performanceCard}>
                <Text style={styles.performanceValue}>{profile.totalReviews || 0}</Text>
                <Text style={styles.performanceLabel}>Reviews</Text>
              </View>
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
  bannerSection: {
    position: 'relative',
    backgroundColor: '#FFF',
    marginBottom: 60,
    zIndex: 1,
  },
  bannerImageContainer: {
    width: '100%',
    height: 200,
    zIndex: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImagesSection: {
    padding: 16,
  },
  uploadSection: {
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 8,
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
  businessName: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cuisineTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cuisineTag: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cuisineTagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#FF9F43',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    minWidth: 120,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
  },
  addressContainer: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FF9F43',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  performanceCard: {
    backgroundColor: '#FFF8E6',
    padding: 16,
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  performanceValue: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FF9F43',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#3B82F6',
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
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 100,
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
});

export default BusinessProfileScreen;

