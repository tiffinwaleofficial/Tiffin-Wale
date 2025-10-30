import React, { useState, useEffect } from 'react';
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
      {/* Header with back button */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Partner Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Partner Banner */}
        <View style={styles.banner}>
          {partner.logoUrl ? (
            <Image
              source={{ uri: partner.logoUrl }}
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
          {partner.status === 'approved' && (
            <View style={styles.verifiedBadge}>
              <Check size={16} color="#FFF" strokeWidth={3} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {/* Business Name and Status */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.businessName}>{partner.businessName}</Text>
            {partner.isAcceptingOrders && (
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Open Now</Text>
              </View>
            )}
          </View>

          {/* Rating and Reviews */}
          {partner.averageRating && partner.averageRating > 0 ? (
            <View style={styles.ratingRow}>
              <Star size={18} color="#FF9F43" fill="#FF9F43" />
              <Text style={styles.rating}>{partner.averageRating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>
                ({partner.totalReviews || 0} reviews)
              </Text>
            </View>
          ) : (
            <Text style={styles.noRating}>New Partner</Text>
          )}

          {/* Location */}
          {partner.address && (
            <View style={styles.locationRow}>
              <MapPin size={16} color="#666" />
              <Text style={styles.locationText}>
                {partner.address.street}, {partner.address.city}, {partner.address.state} - {partner.address.postalCode}
              </Text>
            </View>
          )}

          {/* Operational Hours */}
          {partner.businessHours && (
            <View style={styles.hoursRow}>
              <Clock size={16} color="#666" />
              <Text style={styles.hoursText}>
                Open: {partner.businessHours.open} - {partner.businessHours.close}
              </Text>
            </View>
          )}

          {/* Contact Info */}
          <View style={styles.contactRow}>
            {partner.contactPhone && (
              <View style={styles.contactItem}>
                <Phone size={14} color="#666" />
                <Text style={styles.contactText}>{partner.contactPhone}</Text>
              </View>
            )}
            {partner.contactEmail && (
              <View style={styles.contactItem}>
                <Mail size={14} color="#666" />
                <Text style={styles.contactText}>{partner.contactEmail}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Users size={20} color="#FF9F43" />
              <Text style={styles.statValue}>{stats.totalCustomers}</Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={20} color="#6366F1" />
              <Text style={styles.statValue}>{stats.activeSubscriptions}</Text>
              <Text style={styles.statLabel}>Active Plans</Text>
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'plans' && styles.tabActive]}
            onPress={() => setActiveTab('plans')}
          >
            <Text style={[styles.tabText, activeTab === 'plans' && styles.tabTextActive]}>
              Plans ({plans.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'plans' && (
          <View style={styles.tabContent}>
            {plans.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No Active Plans</Text>
                <Text style={styles.emptyText}>
                  This partner hasn't created any subscription plans yet. Check back later!
                </Text>
              </View>
            ) : (
              plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)
            )}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            {/* Description */}
            {partner.description && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>About Us</Text>
                <Text style={styles.aboutText}>{partner.description}</Text>
              </View>
            )}

            {/* Cuisine Types */}
            {partner.cuisineTypes && partner.cuisineTypes.length > 0 && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Cuisine Types</Text>
                <View style={styles.tagsRow}>
                  {partner.cuisineTypes.map((cuisine, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{cuisine}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Dietary Options */}
            {partner.dietaryOptions && partner.dietaryOptions.length > 0 && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Dietary Options</Text>
                <View style={styles.tagsRow}>
                  {partner.dietaryOptions.map((option, index) => (
                    <View key={index} style={[styles.tag, styles.dietaryTag]}>
                      <Text style={styles.dietaryTagText}>{option}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Delivery Info */}
            {partner.deliveryRadius && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Delivery Information</Text>
                <Text style={styles.aboutText}>
                  We deliver within {partner.deliveryRadius} km radius from our location.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Reviews Coming Soon</Text>
              <Text style={styles.emptyText}>
                Review feature will be available after you place your first order!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  banner: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPlaceholderText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  infoSection: {
    backgroundColor: '#FFF',
    padding: 16,
    gap: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
    marginLeft: 6,
  },
  noRating: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
  },
  contactRow: {
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: 1,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF9F43',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#FF9F43',
  },
  tabContent: {
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  aboutSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9F43',
  },
  dietaryTag: {
    backgroundColor: '#D1FAE5',
  },
  dietaryTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 32,
    gap: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  backButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});

