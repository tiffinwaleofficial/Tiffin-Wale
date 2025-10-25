import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Download,
  ArrowRight,
} from 'lucide-react-native';
import { useTheme } from '../../store/themeStore';

// TODO: Create these hooks once the backend is ready
const useGetEarningsSummary = () => ({ data: null, isLoading: true, error: null });
const useGetTransactions = () => ({ data: null, isLoading: true, error: null });


export default function EarningsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('today');
  const [chartExpanded, setChartExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState('last30Days');

  const { data: earningsData, isLoading: earningsLoading, error: earningsError } = useGetEarningsSummary();
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useGetTransactions();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <View>
          <Text style={styles.transactionDate}>{item.date}</Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text style={styles.transactionAmount}>
            {formatCurrency(item.amount)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'Paid' ? '#DCFCE7' : '#FEF3C7' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: item.status === 'Paid' ? '#10B981' : '#F59E0B',
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Download size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodTabsContainer}
        >
          <TouchableOpacity
            style={[
              styles.periodTab,
              activeTab === 'today' && styles.activePeriodTab,
            ]}
            onPress={() => setActiveTab('today')}
          >
            <Text
              style={[
                styles.periodTabText,
                activeTab === 'today' && styles.activePeriodTabText,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodTab,
              activeTab === 'weekly' && styles.activePeriodTab,
            ]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text
              style={[
                styles.periodTabText,
                activeTab === 'weekly' && styles.activePeriodTabText,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodTab,
              activeTab === 'monthly' && styles.activePeriodTab,
            ]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text
              style={[
                styles.periodTabText,
                activeTab === 'monthly' && styles.activePeriodTabText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodTab,
              activeTab === 'custom' && styles.activePeriodTab,
            ]}
            onPress={() => setActiveTab('custom')}
          >
            <Text
              style={[
                styles.periodTabText,
                activeTab === 'custom' && styles.activePeriodTabText,
              ]}
            >
              Custom
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Earnings Summary Card */}
        {earningsLoading ? <ActivityIndicator style={{ marginVertical: 40 }}/> :
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconContainer}>
              <DollarSign size={24} color="#FF9F43" />
            </View>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => {
                // Date picker logic
              }}
            >
              <Calendar size={18} color="#666" />
              <Text style={styles.dateSelectorText}>
                {activeTab === 'today'
                  ? 'Today'
                  : activeTab === 'weekly'
                  ? 'This Week'
                  : 'This Month'}
              </Text>
              <ChevronDown size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.totalEarnings}>
            {formatCurrency(earningsData[activeTab].total)}
          </Text>
          <View style={styles.earningMetaContainer}>
            <Text style={styles.earningsSubtext}>
              {earningsData[activeTab].orderCount} orders
            </Text>
            <View style={styles.comparisonContainer}>
              <TrendingUp
                size={14}
                color={
                  earningsData[activeTab].comparison.status === 'increase'
                    ? '#10B981'
                    : '#EF4444'
                }
              />
              <Text
                style={[
                  styles.comparisonText,
                  {
                    color:
                      earningsData[activeTab].comparison.status === 'increase'
                        ? '#10B981'
                        : '#EF4444',
                  },
                ]}
              >
                {earningsData[activeTab].comparison.percent}%
              </Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Earnings Chart</Text>
              <TouchableOpacity
                onPress={() => setChartExpanded(!chartExpanded)}
              >
                {chartExpanded ? (
                  <ChevronUp size={20} color="#666" />
                ) : (
                  <ChevronDown size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            {chartExpanded && (
              <View style={styles.chart}>
                {/* This would be replaced with an actual chart component */}
                <View style={styles.mockChart}>
                  <View style={[styles.mockBar, { height: 100 }]} />
                  <View style={[styles.mockBar, { height: 80 }]} />
                  <View style={[styles.mockBar, { height: 120 }]} />
                  <View style={[styles.mockBar, { height: 90 }]} />
                  <View style={[styles.mockBar, { height: 110 }]} />
                  <View style={[styles.mockBar, { height: 70 }]} />
                  <View style={[styles.mockBar, { height: 130 }]} />
                </View>
              </View>
            )}
          </View>
        </View>
        }

        {/* Payment History Section */}
        <View style={styles.paymentHistoryContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color="#FF9F43" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'last30Days' && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter('last30Days')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === 'last30Days' && styles.activeFilterTabText,
                ]}
              >
                Last 30 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'last3Months' && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter('last3Months')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === 'last3Months' && styles.activeFilterTabText,
                ]}
              >
                Last 3 Months
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'allTime' && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter('allTime')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === 'allTime' && styles.activeFilterTabText,
                ]}
              >
                All Time
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transactions List */}
          {transactionsLoading ? <ActivityIndicator style={{ marginVertical: 40 }} /> :
          <FlatList
            data={transactionsData}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.transactionsList}
          />
          }
        </View>
      </ScrollView>
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
  headerButton: {
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
  periodSelector: {
    paddingBottom: 16,
  },
  periodTabsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  periodTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePeriodTab: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  periodTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  activePeriodTabText: {
    color: '#FF9F43',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateSelectorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#666',
    marginHorizontal: 8,
  },
  totalEarnings: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#333',
    marginBottom: 4,
  },
  earningMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  earningsSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  chartContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
  },
  chart: {
    height: 200,
    marginBottom: 16,
  },
  mockChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  mockBar: {
    width: 30,
    backgroundColor: '#FF9F43',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paymentHistoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    marginRight: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  activeFilterTab: {
    backgroundColor: '#FF9F43',
  },
  filterTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#FFF',
  },
  transactionsList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 8,
    paddingBottom: 90,
  },
  transactionItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  transactionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
});