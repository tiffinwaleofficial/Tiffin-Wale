import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Bell, ChevronRight, CreditCard, CircleHelp as HelpCircle, LogOut, MapPin, Tag } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, fetchUserProfile } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image 
                source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
                style={styles.profileImage} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'John Doe'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => router.push('/account-information')}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.subscriptionSection}>
              <View style={styles.activePlanHeader}>
                <Text style={styles.activePlanLabel}>Current Plan</Text>
                <TouchableOpacity 
                  style={styles.viewPlansButton}
                  onPress={() => router.push('/active-subscription-plan' as never)}
                >
                  <Text style={styles.viewPlansButtonText}>View Plans</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activePlanContainer}>
                <View style={styles.activePlanDetails}>
                  <Text style={styles.activePlanName}>{user?.subscriptionActive ? 'Active Plan' : 'No Active Plan'}</Text>
                  <Text style={styles.activePlanExpiry}>
                    {user?.subscriptionActive ? 'You are subscribed' : 'Subscribe to a plan to get started'}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingsCard}>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => router.push('/delivery-addresses')}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: '#E8F5E9' }]}>
                    <MapPin size={20} color="#43A047" />
                  </View>
                  <Text style={styles.settingsItemText}>Delivery Addresses</Text>
                </View>
                <ChevronRight size={20} color="#999999" />
              </TouchableOpacity>
              
              <View style={styles.settingsDivider} />
              
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => router.push('/payment-methods' as never)}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: '#E3F2FD' }]}>
                    <CreditCard size={20} color="#1E88E5" />
                  </View>
                  <Text style={styles.settingsItemText}>Payment Methods</Text>
                </View>
                <ChevronRight size={20} color="#999999" />
              </TouchableOpacity>
              
              <View style={styles.settingsDivider} />

              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => router.push('/promotions' as never)}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: '#E0F2F1' }]}>
                    <Tag size={20} color="#00796B" />
                  </View>
                  <Text style={styles.settingsItemText}>Promotions</Text>
                </View>
                <ChevronRight size={20} color="#999999" />
              </TouchableOpacity>
              
              <View style={styles.settingsDivider} />
              
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: '#FFF3E0' }]}>
                    <Bell size={20} color="#FF9800" />
                  </View>
                  <Text style={styles.settingsItemText}>Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#CCCCCC', true: '#FFD3B0' }}
                  thumbColor={notificationsEnabled ? '#FF9B42' : '#F4F4F4'}
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <View style={styles.settingsCard}>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => router.push('/help-support')}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: '#FFF5E6' }]}>
                    <HelpCircle size={20} color="#FF9B42" />
                  </View>
                  <Text style={styles.settingsItemText}>Help & Support</Text>
                </View>
                <ChevronRight size={20} color="#999999" />
              </TouchableOpacity>
              
              <View style={styles.settingsDivider} />
              
              <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: '#FFEBEE' }]}>
                    <LogOut size={20} color="#E53935" />
                  </View>
                  <Text style={styles.settingsItemText}>Logout</Text>
                </View>
                <ChevronRight size={20} color="#999999" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <TouchableOpacity>
              <Text style={styles.termsText}>Terms & Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFFAF0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFAF0',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF8EE',
    borderRadius: 20,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
  },
  subscriptionSection: {
    marginTop: 8,
  },
  activePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activePlanLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
  },
  viewPlansButton: {},
  viewPlansButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
  },
  activePlanContainer: {
    backgroundColor: '#FFF8EE',
    borderRadius: 16,
    padding: 20,
  },
  activePlanDetails: {
  },
  activePlanName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  activePlanExpiry: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999999',
  },
  termsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
    marginLeft: 8,
  },
});