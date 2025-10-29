import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { User, Settings, LogOut, MapPin, CreditCard, Bell, CircleHelp as HelpCircle, ChevronRight, Camera, MessageSquare, ShieldCheck, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePartnerStore } from '../../store/partnerStore';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [updatingNotifications, setUpdatingNotifications] = useState(false);
  const { profile, stats, fetchProfile, fetchStats } = usePartnerStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
    if (!stats) {
      fetchStats();
    }
    // Load notification preferences
    if (profile?.notificationPreferences) {
      setNotificationsEnabled(profile.notificationPreferences.pushEnabled !== false);
    }
  }, [profile]);

  const handleLogout = () => {
    router.replace('/(auth)/login' as any);
  };

  const handleNotificationToggle = async (value: boolean) => {
    // Optimistically update UI
    setNotificationsEnabled(value);
    setUpdatingNotifications(true);

    try {
      const { api } = await import('../../lib/api');
      await api.partner.updateNotificationPreferences({
        pushEnabled: value,
      });
      console.log(`✅ Push notifications ${value ? 'enabled' : 'disabled'}`);
      // No need to fetch profile - notification preferences are updated via API
      // The state is already updated optimistically
    } catch (error) {
      console.error('❌ Failed to update push notification preference:', error);
      // Revert on error
      setNotificationsEnabled(!value);
    } finally {
      setUpdatingNotifications(false);
    }
  };

  const menuItems = [
    {
      id: 'business',
      title: 'Business Profile',
      icon: User,
      color: '#3B82F6',
      action: () => {
        router.push('/pages/business-profile');
      },
    },
    {
      id: 'bank',
      title: 'Bank Account',
      icon: CreditCard,
      color: '#10B981',
      action: () => {
        router.push('/pages/bank-account');
      },
    },
    {
      id: 'location',
      title: 'Address',
      icon: MapPin,
      color: '#F59E0B',
      action: () => {
        router.push('/pages/address');
      },
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      color: '#8B5CF6',
      action: () => {
        router.push('/pages/help-support');
      },
    },
    {
      id: 'chat',
      title: 'Chat with Support',
      icon: MessageSquare,
      color: '#EC4899',
      action: () => {
        router.push({
          pathname: '/pages/chat',
          params: {
            recipientId: 'support_team',
            recipientName: 'Support Team',
            conversationType: 'support',
          },
        } as any);
      },
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: ShieldCheck,
      color: '#6B7280',
      action: () => {
        router.push('/pages/privacy-policy');
      },
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: FileText,
      color: '#6B7280',
      action: () => {
        router.push('/pages/terms-conditions');
      },
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          {profile?.logoUrl ? (
            <Image
              source={{ uri: profile.logoUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <User size={40} color="#CCC" />
            </View>
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              router.push('/pages/edit-profile');
            }}
          >
            <Camera size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.businessName}>
            {profile?.businessName || user?.partner?.businessName || 'Loading...'}
          </Text>
          <Text style={styles.businessEmail}>
            {profile?.user?.email || user?.email || 'No email'}
          </Text>
          <Text style={styles.businessType}>
            {profile?.serviceType?.[0] || 'Partner'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            router.push('/pages/edit-profile');
          }}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.businessStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {(profile?.averageRating ?? 0) > 0 
              ? profile.averageRating.toFixed(1) 
              : (stats?.averageRating ?? 0) > 0
              ? stats.averageRating.toFixed(1) 
              : '0.0'}
          </Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {(profile?.totalReviews ?? 0) || (stats?.totalReviews ?? 0) || 0}
          </Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {stats?.totalOrders ? stats.totalOrders.toLocaleString() : '0'}
          </Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>

      <View style={styles.notificationPreference}>
        <View style={styles.notificationText}>
          <Bell size={20} color="#FF9F43" />
          <Text style={styles.notificationTitle}>Push Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationToggle}
          disabled={updatingNotifications}
          trackColor={{ false: '#D1D5DB', true: '#FF9F43' }}
          thumbColor={notificationsEnabled ? '#FFF' : '#FFF'}
        />
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuItemContent}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: `${item.color}20` },
                ]}
              >
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <ChevronRight size={18} color="#CCC" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF4757" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF9F43',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    marginBottom: 4,
  },
  businessEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  businessType: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#FF9F43',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
  },
  businessStats: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  notificationPreference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  notificationText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FF4757',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});