import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Bell, BellRing, Settings, Check, Clock, TriangleAlert as AlertTriangle, Info, CreditCard, Calendar, ChevronRight } from 'lucide-react-native';

// Mock data for notifications
const notificationsData = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'You have received 3 new breakfast orders for today.',
    time: '10 mins ago',
    read: false,
    type: 'order',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Weekly payment of ₹23,150 has been processed to your account.',
    time: '2 hours ago',
    read: true,
    type: 'payment',
  },
  {
    id: '3',
    title: 'Order Status Update',
    message: 'Customer #1021 has marked their order as received.',
    time: '5 hours ago',
    read: true,
    type: 'update',
  },
  {
    id: '4',
    title: 'Upcoming Subscription',
    message: '8 new lunch orders scheduled for tomorrow.',
    time: 'Yesterday',
    read: true,
    type: 'schedule',
  },
  {
    id: '5',
    title: 'Menu Update Required',
    message: 'Please update your menu for the upcoming week.',
    time: '2 days ago',
    read: true,
    type: 'alert',
  },
];

// Mock data for notification preferences
const notificationPreferences = [
  {
    id: 'orders',
    title: 'New Orders',
    description: 'Get notified when you receive new orders',
    enabled: true,
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Get notified about payment processing and transfers',
    enabled: true,
  },
  {
    id: 'reminders',
    title: 'Reminders',
    description: 'Reminders for pending actions and tasks',
    enabled: true,
  },
  {
    id: 'updates',
    title: 'App Updates',
    description: 'Get notified about new features and updates',
    enabled: false,
  },
  {
    id: 'marketing',
    title: 'Marketing & Promotions',
    description: 'Receive promotional offers and tips',
    enabled: false,
  },
];

export default function NotificationsScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(notificationPreferences);

  const getIconForNotificationType = (type, read) => {
    const color = read ? '#999' : '#FF9F43';
    
    switch (type) {
      case 'order':
        return <Bell size={24} color={color} />;
      case 'payment':
        return <CreditCard size={24} color={color} />;
      case 'update':
        return <Check size={24} color={color} />;
      case 'schedule':
        return <Calendar size={24} color={color} />;
      case 'alert':
        return <AlertTriangle size={24} color={color} />;
      default:
        return <Info size={24} color={color} />;
    }
  };

  const toggleNotificationPreference = (id) => {
    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Settings size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {showSettings ? (
        <ScrollView style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Notification Settings</Text>
          <Text style={styles.settingsSubtitle}>
            Manage which notifications you receive
          </Text>

          {preferences.map((pref) => (
            <View key={pref.id} style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceTitle}>{pref.title}</Text>
                <Text style={styles.preferenceDescription}>
                  {pref.description}
                </Text>
              </View>
              <Switch
                value={pref.enabled}
                onValueChange={() => toggleNotificationPreference(pref.id)}
                trackColor={{ false: '#D1D5DB', true: '#FF9F43' }}
                thumbColor={pref.enabled ? '#FFF' : '#FFF'}
              />
            </View>
          ))}

          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.actionButtonText}>Save Preferences</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.notificationsContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Recent</Text>
            <TouchableOpacity>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>

          {notificationsData.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                notification.read && styles.readNotification,
              ]}
            >
              <View
                style={[
                  styles.notificationIcon,
                  !notification.read && styles.unreadIcon,
                ]}
              >
                {getIconForNotificationType(
                  notification.type,
                  notification.read
                )}
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      notification.read && styles.readText,
                    ]}
                  >
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.notificationMessage,
                    notification.read && styles.readText,
                  ]}
                >
                  {notification.message}
                </Text>
              </View>

              <ChevronRight size={18} color="#CCC" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.viewAllContainer}>
            <Text style={styles.viewAllText}>View All Notifications</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
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
  notificationsContainer: {
    paddingHorizontal: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
  },
  markAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9F43',
  },
  readNotification: {
    borderLeftColor: 'transparent',
  },
  notificationIcon: {
    marginRight: 16,
  },
  unreadIcon: {
    opacity: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  notificationTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  notificationMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  readText: {
    color: '#999',
  },
  viewAllContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 60,
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
  },
  settingsContainer: {
    padding: 16,
  },
  settingsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
  },
  settingsSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  preferenceTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  actionButtonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});