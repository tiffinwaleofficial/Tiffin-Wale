import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Check,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Heart,
  Share2,
  Leaf,
  Package,
  Info,
  MessageSquare,
} from 'lucide-react-native';
import { BackButton } from '../../components/BackButton';
import { PlanCard } from '../../components/PlanCard';
import { api, Partner, PartnerStats, SubscriptionPlan } from '@/lib/api';

const { width } = Dimensions.get('window');

export default function PartnerDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'about' | 'reviews'>('plans');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabScrollRef = useRef<FlatList>(null);

  const tabs = [
    { key: 'plans', label: 'Packages', icon: Package },
    { key: 'about', label: 'About', icon: Info },
    { key: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  const handleTabSwipe = (index: number) => {
    setActiveTabIndex(index);
    const tabKey = tabs[index].key as 'plans' | 'about' | 'reviews';
    setActiveTab(tabKey);
  };

  useEffect(() => {
    if (partnerId) {
      fetchPartnerDetails();
    }
  }, [partnerId]);

  const fetchPartnerDetails = async () => {
    try {
      setLoading(true);
      const [partnerData, plansData, statsData] = await Promise.all([
        api.partners.getPartnerById(partnerId),
        api.plans.getPartnerPlans(partnerId),
        api.partners.getPartnerStats(partnerId).catch(() => null),
      ]);
      
      setPartner(partnerData);
      setPlans(plansData.filter((p) => p.isActive));
      setStats(statsData);
    } catch (error: any) {
      console.error('Failed to fetch partner details:', error);
      Alert.alert('Error', error.message || 'Failed to load partner details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9F43" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!partner) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Partner not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner with Overlay */}
        <View style={styles.heroSection}>
          {partner.bannerUrl ? (
            <Image
              source={{ uri: partner.bannerUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <Text style={styles.bannerPlaceholderText}>
                {partner.businessName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          {/* Gradient Overlay */}
          <View style={styles.bannerOverlay} />
          
          {/* Back Button */}
          <View style={styles.floatingBackButton}>
            <BackButton />
          </View>
          
          {/* Verified Badge */}
          {partner.status === 'approved' && (
            <View style={styles.verifiedBadge}>
              <Check size={14} color="#FFF" strokeWidth={3} />
              <Text style={styles.verifiedText}>Verified Partner</Text>
            </View>
          )}
        </View>

        {/* Floating Info Card */}
        <View style={styles.floatingCard}>
          {/* Name & Status */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.businessName} numberOfLines={2}>
                {partner.businessName}
              </Text>
              {partner.isAcceptingOrders && (
                <View style={styles.openBadge}>
                  <View style={styles.openDot} />
                  <Text style={styles.openText}>Open</Text>
                </View>
              )}
            </View>

            {/* Rating Highlight */}
            {partner.averageRating && partner.averageRating > 0 ? (
              <View style={styles.ratingHighlight}>
                <View style={styles.ratingBadge}>
                  <Star size={16} color="#FFF" fill="#FFF" />
                  <Text style={styles.ratingValue}>{partner.averageRating.toFixed(1)}</Text>
                </View>
                <Text style={styles.reviewsText}>
                  Based on {partner.totalReviews || 0} reviews
                </Text>
              </View>
            ) : (
              <View style={styles.newPartnerHighlight}>
                <View style={styles.newBadge}>
                  <Text style={styles.newText}>New Partner</Text>
                </View>
                <Text style={styles.newSubtext}>Be the first to review!</Text>
              </View>
            )}
          </View>

          {/* Beautiful Info Grid */}
          <View style={styles.infoGrid}>
            {/* Location Card */}
            {partner.address && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardIconCircle}>
                  <MapPin size={20} color="#FF9B42" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Location</Text>
                  <Text style={styles.infoCardValue} numberOfLines={2}>
                    {partner.address.city}, {partner.address.state}
                  </Text>
                </View>
              </View>
            )}
            
            {/* Hours Card */}
            {partner.businessHours && (
              <View style={[styles.infoCard, styles.hoursInfoCard]}>
                <View style={[styles.infoCardIconCircle, styles.hoursIconCircle]}>
                  <Clock size={20} color="#10B981" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardLabel, styles.hoursLabel]}>Open Hours</Text>
                  <Text style={[styles.infoCardValue, styles.hoursValue]}>
                    {partner.businessHours.open} - {partner.businessHours.close}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Premium Dietary Highlight */}
          {partner.isVegetarian && (
            <View style={styles.vegPremiumCard}>
              <View style={styles.vegIconLarge}>
                <View style={styles.vegSquareLarge} />
              </View>
              <View style={styles.vegPremiumContent}>
                <Text style={styles.vegPremiumTitle}>100% Pure Vegetarian</Text>
                <Text style={styles.vegPremiumSubtitle}>All dishes are vegetarian</Text>
              </View>
              <Check size={24} color="#10B981" strokeWidth={3} />
            </View>
          )}

          {/* Additional Dietary Options */}
          {(partner.dietaryOptions?.includes('vegan') || partner.dietaryOptions?.includes('jain')) && (
            <View style={styles.additionalDietaryRow}>
              {partner.dietaryOptions?.includes('vegan') && (
                <View style={styles.veganMiniCard}>
                  <Leaf size={16} color="#10B981" />
                  <Text style={styles.veganMiniText}>Vegan</Text>
                </View>
              )}
              {partner.dietaryOptions?.includes('jain') && (
                <View style={styles.jainMiniCard}>
                  <Text style={styles.jainMiniText}>Jain Food</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Stats Cards - Eye-Catching */}
        {stats && (
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF5E6' }]}>
                <Users size={22} color="#FF9B42" />
              </View>
              <Text style={styles.statValue}>{stats.totalCustomers || 0}</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#ECFDF5' }]}>
                <TrendingUp size={22} color="#10B981" />
              </View>
              <Text style={styles.statValue}>{stats.totalOrders || 0}</Text>
              <Text style={styles.statLabel}>Orders Delivered</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#EEF2FF' }]}>
                <Award size={22} color="#6366F1" />
              </View>
              <Text style={styles.statValue}>{stats.activeSubscriptions || 0}</Text>
              <Text style={styles.statLabel}>Active Subscribers</Text>
            </View>
          </View>
        )}

        {/* Cuisines Highlight */}
        {partner.cuisineTypes && partner.cuisineTypes.length > 0 && (
          <View style={styles.cuisinesSection}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.cuisineGrid}>
              {partner.cuisineTypes.map((cuisine, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.cuisinePill,
                    index === 0 && styles.featuredCuisinePill
                  ]}
                >
                  <Text 
                    style={[
                      styles.cuisinePillText,
                      index === 0 && styles.featuredCuisinePillText
                    ]}
                  >
                    {cuisine}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Modern Tabs with Better Spacing */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.modernTab, activeTab === tab.key && styles.modernTabActive]}
              onPress={() => {
                setActiveTab(tab.key as 'plans' | 'about' | 'reviews');
                setActiveTabIndex(index);
                tabScrollRef.current?.scrollToOffset({ offset: width * index, animated: true });
              }}
            >
              <View style={styles.tabContent}>
                {tab.icon && (
                  <tab.icon 
                    size={18} 
                    color={activeTab === tab.key ? '#FFF' : '#9CA3AF'}
                    style={styles.tabIcon}
                  />
                )}
                <Text style={[styles.modernTabText, activeTab === tab.key && styles.modernTabTextActive]}>
                  {tab.label}
                  {tab.key === 'plans' && plans.length > 0 && ` (${plans.length})`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Swipeable Tab Content */}
        <FlatList
          ref={tabScrollRef}
          data={tabs}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            if (index >= 0 && index < tabs.length && index !== activeTabIndex) {
              handleTabSwipe(index);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            if (index >= 0 && index < tabs.length && index !== activeTabIndex) {
              handleTabSwipe(index);
            }
          }}
          keyExtractor={(item) => item.key}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={0}
          renderItem={({ item }) => (
            <View style={{ width, flex: 1, overflow: 'hidden' }}>
              {item.key === 'plans' && (
          <View style={styles.plansContent}>
            {plans.length === 0 ? (
              <View style={styles.emptyPlans}>
                <View style={styles.emptyIcon}>
                  <Award size={48} color="#FFC1A1" />
                </View>
                <Text style={styles.emptyTitle}>No Packages Yet</Text>
                <Text style={styles.emptySubtext}>
                  This partner is setting up their packages.{'\n'}Check back soon for exclusive offers!
                </Text>
                <TouchableOpacity style={styles.notifyButton}>
                  <Text style={styles.notifyButtonText}>Notify Me When Available</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.plansGrid}>
                {plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)}
              </View>
            )}
          </View>
              )}

              {item.key === 'about' && (
          <View style={styles.aboutContent}>
            {/* Description Card */}
            {partner.description && (
              <View style={styles.aboutCard}>
                <Text style={styles.aboutCardTitle}>Our Story</Text>
                <Text style={styles.aboutCardText}>{partner.description}</Text>
              </View>
            )}

            {/* Contact Card */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutCardTitle}>Contact Information</Text>
              {partner.contactPhone && (
                <TouchableOpacity style={styles.contactButton}>
                  <View style={styles.contactIconWrapper}>
                    <Phone size={18} color="#FF9B42" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>{partner.contactPhone}</Text>
                  </View>
                  <ChevronRight size={20} color="#CCC" />
                </TouchableOpacity>
              )}
              {partner.contactEmail && (
                <TouchableOpacity style={styles.contactButton}>
                  <View style={styles.contactIconWrapper}>
                    <Mail size={18} color="#FF9B42" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{partner.contactEmail}</Text>
                  </View>
                  <ChevronRight size={20} color="#CCC" />
                </TouchableOpacity>
              )}
              {partner.address && (
                <View style={styles.contactButton}>
                  <View style={styles.contactIconWrapper}>
                    <MapPin size={18} color="#FF9B42" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Address</Text>
                    <Text style={styles.contactValue}>
                      {partner.address.street}, {partner.address.city}, {partner.address.state} - {partner.address.postalCode}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Delivery Info Card */}
            {partner.deliveryRadius && (
              <View style={styles.aboutCard}>
                <Text style={styles.aboutCardTitle}>Delivery Coverage</Text>
                <View style={styles.deliveryInfo}>
                  <View style={styles.deliveryHighlight}>
                    <Text style={styles.deliveryRadius}>{partner.deliveryRadius} km</Text>
                    <Text style={styles.deliveryLabel}>Delivery Radius</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
              )}

              {item.key === 'reviews' && (
          <View style={styles.reviewsContent}>
            <View style={styles.emptyReviews}>
              <View style={styles.emptyIcon}>
                <Star size={48} color="#FFC1A1" />
              </View>
              <Text style={styles.emptyTitle}>No Reviews Yet</Text>
              <Text style={styles.emptySubtext}>
                Be the first to review this partner!{'\n'}Subscribe and share your experience.
              </Text>
            </View>
          </View>
              )}
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  // Hero Banner Section
  heroSection: {
    width: '100%',
    height: 260,
    position: 'relative',
    backgroundColor: '#FF9B42',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF9B42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPlaceholderText: {
    fontSize: 72,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    opacity: 0.3,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 48,
    left: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 52,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginLeft: 4,
  },
  // Floating Info Card
  floatingCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FF9B42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  headerSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  openDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  openText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#059669',
  },
  ratingHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9B42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  ratingValue: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  newPartnerHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  newText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  newSubtext: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  // Beautiful Info Grid
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  hoursInfoCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  infoCardIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#FF9B42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  hoursIconCircle: {
    shadowColor: '#10B981',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#D97706',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hoursLabel: {
    color: '#065F46',
  },
  infoCardValue: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#92400E',
  },
  hoursValue: {
    color: '#047857',
  },
  // Premium Veg Card
  vegPremiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    marginBottom: 12,
  },
  vegIconLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vegSquareLarge: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  vegPremiumContent: {
    flex: 1,
  },
  vegPremiumTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#047857',
    marginBottom: 2,
  },
  vegPremiumSubtitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#059669',
  },
  // Additional Dietary
  additionalDietaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  veganMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#10B981',
    gap: 6,
  },
  veganMiniText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
  },
  jainMiniCard: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  jainMiniText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#D97706',
  },
  // Stats Section
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  // Cuisines Section
  cuisinesSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisinePill: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredCuisinePill: {
    backgroundColor: '#FF9B42',
  },
  cuisinePillText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9B42',
  },
  featuredCuisinePillText: {
    color: '#FFF',
  },
  // Modern Tabs with Better Spacing
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 6,
    gap: 6,
  },
  modernTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: 44,
  },
  modernTabActive: {
    backgroundColor: '#FF9B42',
    shadowColor: '#FF9B42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabIcon: {
    marginBottom: 1,
  },
  modernTabText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  modernTabTextActive: {
    color: '#FFF',
  },
  // Plans Content
  plansContent: {
    marginTop: 20,
    paddingHorizontal: 16,
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
  },
  plansGrid: {
    gap: 12,
    width: '100%',
    alignSelf: 'stretch',
  },
  emptyPlans: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  notifyButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#FF9B42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  notifyButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  // About Content
  aboutContent: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  aboutCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutCardTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 14,
  },
  aboutCardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  deliveryInfo: {
    alignItems: 'center',
  },
  deliveryHighlight: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9B42',
  },
  deliveryRadius: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FF9B42',
    marginBottom: 4,
  },
  deliveryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  // Reviews Content
  reviewsContent: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  emptyReviews: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
  loadingText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#FF9B42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
});

