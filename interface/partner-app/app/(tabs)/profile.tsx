import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { User, Settings, LogOut, MapPin, CreditCard, Bell, CircleHelp as HelpCircle, ChevronRight, Camera, MessageSquare, ShieldCheck, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    router.replace('/login');
  };

  const menuItems = [
    {
      id: 'business',
      title: 'Business Profile',
      icon: User,
      color: '#3B82F6',
      action: () => {
        // Navigate to business profile
      },
    },
    {
      id: 'bank',
      title: 'Bank Account',
      icon: CreditCard,
      color: '#10B981',
      action: () => {
        // Navigate to bank account
      },
    },
    {
      id: 'location',
      title: 'Address',
      icon: MapPin,
      color: '#F59E0B',
      action: () => {
        // Navigate to address
      },
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      color: '#8B5CF6',
      action: () => {
        // Navigate to help & support
      },
    },
    {
      id: 'chat',
      title: 'Chat with Support',
      icon: MessageSquare,
      color: '#EC4899',
      action: () => {
        // Open chat with support
      },
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: ShieldCheck,
      color: '#6B7280',
      action: () => {
        // Navigate to privacy policy
      },
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: FileText,
      color: '#6B7280',
      action: () => {
        // Navigate to terms & conditions
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
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            // Navigate to settings
          }}
        >
          <Settings size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              // Handle image change
            }}
          >
            <Camera size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.businessName}>Spice Garden</Text>
          <Text style={styles.businessEmail}>spicegarden@example.com</Text>
          <Text style={styles.businessType}>Home Food Partner</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // Navigate to edit profile
          }}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.businessStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>142</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3,240</Text>
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
          onValueChange={setNotificationsEnabled}
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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