import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle2, Clock, TrendingUp, CircleAlert as AlertCircle, ChevronRight, Bell, MessageCircle, Utensils } from 'lucide-react-native';

// Mock Data
const overviewData = [
  { id: '1', title: 'Pending', count: 12, icon: Clock, color: '#F59E0B' },
  { id: '2', title: 'In Progress', count: 8, icon: Utensils, color: '#3B82F6' },
  {
    id: '3',
    title: 'Completed',
    count: 24,
    icon: CheckCircle2,
    color: '#10B981',
  },
];

const activeMeals = [
  {
    id: '1',
    name: 'Paneer Butter Masala',
    count: 8,
    status: 'In Progress',
    timeRemaining: '15 mins',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '2',
    name: 'Dal Tadka with Rice',
    count: 6,
    status: 'In Queue',
    timeRemaining: '30 mins',
    image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    name: 'Aloo Paratha',
    count: 10,
    status: 'In Progress',
    timeRemaining: '10 mins',
    image: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentDate] = useState(new Date());

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const renderMealCard = ({ item }) => (
    <View style={styles.mealCard}>
      <Image source={{ uri: item.image }} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <Text style={styles.mealName}>{item.name}</Text>
        <View style={styles.mealInfo}>
          <Text style={styles.mealCount}>{item.count} orders</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'In Progress' ? '#EBF5FF' : '#FEF3C7',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: item.status === 'In Progress' ? '#3B82F6' : '#F59E0B',
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.mealActions}>
          <Text style={styles.timeRemaining}>
            <Clock size={14} color="#666" /> {item.timeRemaining}
          </Text>
          <TouchableOpacity
            style={styles.readyButton}
            onPress={() => {
              // Mark as ready logic
            }}
          >
            <Text style={styles.readyButtonText}>Mark Ready</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Spice Garden!</Text>
          <Text style={styles.date}>{formatDate(currentDate)}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <Text style={styles.earningsTitle}>Today's Earnings</Text>
          <TouchableOpacity onPress={() => router.push('/earnings')}>
            <TrendingUp size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
        <Text style={styles.earningsAmount}>₹3,420</Text>
        <Text style={styles.earningsSubtext}>
          <Text style={{ color: '#10B981' }}>↑ 12%</Text> compared to yesterday
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
      </View>

      <View style={styles.statsContainer}>
        {overviewData.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: item.color + '20' }]}
            >
              <item.icon size={22} color={item.color} />
            </View>
            <Text style={styles.statCount}>{item.count}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Meals</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#FF9F43" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeMeals}
        renderItem={renderMealCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/menu')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
              <Utensils size={20} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Today's Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/support')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <MessageCircle size={20} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/notifications')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <AlertCircle size={20} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#333',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
  },
  notificationButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#FFF',
  },
  earningsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  earningsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
  },
  earningsAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#333',
    marginBottom: 4,
  },
  earningsSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  statTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mealImage: {
    width: 90,
    height: 'auto',
  },
  mealDetails: {
    flex: 1,
    padding: 12,
  },
  mealName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  mealInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRemaining: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  readyButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  readyButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFF',
  },
  quickActions: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});