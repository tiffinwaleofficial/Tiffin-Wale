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
  TrendingDown,
  Download,
  ArrowRight,
  Package,
  Percent,
  CreditCard,
  BarChart3,
} from 'lucide-react-native';
import { useTheme } from '../../store/themeStore';
import { usePartnerStore } from '../../store/partnerStore';
import { api } from '../../lib/api';
import { useEffect } from 'react';


export default function EarningsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'monthly' | 'custom' | 'allTime'>('allTime');
  const [chartExpanded, setChartExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState('last30Days');
  const [earningsData, setEarningsData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const { stats } = usePartnerStore();

  useEffect(() => {
    loadEarningsData();
  }, [activeTab, activeFilter]);

  const mapPeriod = (tab: string): string => {
    switch (tab) {
      case 'today':
        return 'today';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      case 'custom':
        return 'custom';
      case 'allTime':
      default:
        return 'all'; // Get all time data
    }
  };

  const loadEarningsData = async () => {
    try {
      setEarningsLoading(true);
      setTransactionsLoading(true);

      const period = mapPeriod(activeTab);
      
      // For all time, fetch comprehensive data without period restriction
      // For specific periods, fetch period-specific data
      const fetchPromises = activeTab === 'allTime' 
        ? [
            api.analytics.getEarnings('all').catch(() => ({ totalEarnings: stats?.totalRevenue || 0, totalOrders: stats?.totalOrders || 0 })),
            api.analytics.getRevenueHistory(12).catch(() => ({ data: [], totalRevenue: stats?.totalRevenue || 0, totalOrders: stats?.totalOrders || 0 })),
          ]
        : [
            api.analytics.getEarnings(period),
            api.analytics.getOrderAnalytics(period === 'custom' ? 'week' : period),
            api.analytics.getRevenueHistory(period === 'today' ? 1 : period === 'weekly' ? 4 : 6),
          ];

      const results = await Promise.all(fetchPromises);
      const earningsRes = results[0] as any;
      const orderAnalyticsRes = results[1] as any;
      const revenueHistoryRes = results[2] || results[1] as any;

      // Map to UI structure with comprehensive financial data
      const totalEarnings = earningsRes?.totalEarnings ?? earningsRes?.totalRevenue ?? stats?.totalRevenue ?? 0;
      const totalOrders = earningsRes?.totalOrders ?? stats?.totalOrders ?? 0;
      const averageOrderValue = earningsRes?.averageOrderValue ?? (totalOrders > 0 ? totalEarnings / totalOrders : 0);
      const commission = earningsRes?.commission ?? (totalEarnings * 0.2); // Default 20% commission
      const netEarnings = earningsRes?.netEarnings ?? (totalEarnings - commission);

      // Compute comparison from breakdown or trend
      let comparison = { status: 'increase', percent: 0 } as any;
      const breakdown = earningsRes?.breakdown as Array<{ date: string; earnings: number; orders: number }> | undefined;
      
      if (breakdown && breakdown.length >= 2) {
        const last = breakdown[breakdown.length - 1]?.earnings || 0;
        const prev = breakdown[breakdown.length - 2]?.earnings || 0;
        const diff = last - prev;
        comparison = {
          status: diff >= 0 ? 'increase' : 'decrease',
          percent: prev === 0 ? (last > 0 ? 100 : 0) : Math.round((Math.abs(diff) / prev) * 100),
        };
      } else if (orderAnalyticsRes?.trend && orderAnalyticsRes.trend.length >= 2) {
        // Use order trend as fallback
        const lastOrders = orderAnalyticsRes.trend[orderAnalyticsRes.trend.length - 1]?.orders || 0;
        const prevOrders = orderAnalyticsRes.trend[orderAnalyticsRes.trend.length - 2]?.orders || 0;
        const diff = lastOrders - prevOrders;
        comparison = {
          status: diff >= 0 ? 'increase' : 'decrease',
          percent: prevOrders === 0 ? (lastOrders > 0 ? 100 : 0) : Math.round((Math.abs(diff) / prevOrders) * 100),
        };
      }

      // Chart data from breakdown
      if (breakdown && breakdown.length > 0) {
        const maxEarnings = Math.max(...breakdown.map(b => b.earnings || 0));
        setChartData(breakdown.map(b => ({
          date: b.date,
          earnings: b.earnings || 0,
          orders: b.orders || 0,
          heightPercent: maxEarnings > 0 ? ((b.earnings || 0) / maxEarnings) * 100 : 0,
        })));
      } else {
        // Use revenue history for chart if no breakdown
        const historyRes = revenueHistoryRes as any;
        const historyData = historyRes?.data || [];
        if (historyData.length > 0) {
          const maxRevenue = Math.max(...historyData.map((h: any) => h.revenue || 0));
          setChartData(historyData.slice(-7).map((h: any) => ({
            date: h.month,
            earnings: h.revenue || 0,
            orders: h.orders || 0,
            heightPercent: maxRevenue > 0 ? ((h.revenue || 0) / maxRevenue) * 100 : 0,
          })));
        }
      }

      setEarningsData({
        totalEarnings,
        totalOrders,
        averageOrderValue,
        commission,
        netEarnings,
        comparison,
        orderAnalytics: orderAnalyticsRes,
        breakdown: breakdown,
      });

      // Transactions from revenue history or orders
      let transactions: any[] = [];
      const historyRes = revenueHistoryRes as any;
      if (historyRes?.data && Array.isArray(historyRes.data)) {
        transactions = historyRes.data.slice(0, 10).map((m: any, idx: number) => ({
          id: `${m.month}-${idx}`,
          date: m.month,
          description: `${m.orders || 0} orders completed`,
          amount: m.revenue || 0,
          status: 'Paid',
          orders: m.orders || 0,
        }));
      }

      // Filter transactions based on activeFilter
      if (activeFilter === 'last30Days') {
        transactions = transactions.slice(0, 1); // Last month
      } else if (activeFilter === 'last3Months') {
        transactions = transactions.slice(0, 3);
      }
      // allTime shows all

      setTransactionsData(transactions);
    } catch (error) {
      console.error('Failed to load earnings:', error);
      setEarningsData({
        totalEarnings: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        commission: 0,
        netEarnings: 0,
        comparison: { status: 'increase', percent: 0 },
      });
      setChartData([]);
      setTransactionsData([]);
    } finally {
      setEarningsLoading(false);
      setTransactionsLoading(false);
    }
  };

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
          <TouchableOpacity
            style={[
              styles.periodTab,
              activeTab === 'allTime' && styles.activePeriodTab,
            ]}
            onPress={() => setActiveTab('allTime')}
          >
            <Text
              style={[
                styles.periodTabText,
                activeTab === 'allTime' && styles.activePeriodTabText,
              ]}
            >
              All Time
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
                // Date picker logic for custom range
              }}
            >
              <Calendar size={18} color="#666" />
              <Text style={styles.dateSelectorText}>
                {activeTab === 'today'
                  ? 'Today'
                  : activeTab === 'weekly'
                  ? 'This Week'
                  : activeTab === 'monthly'
                  ? 'This Month'
                  : activeTab === 'allTime'
                  ? 'All Time'
                  : 'Custom Range'}
              </Text>
              {activeTab === 'custom' && <ChevronDown size={18} color="#666" />}
            </TouchableOpacity>
          </View>

          <Text style={styles.totalEarnings}>
            {formatCurrency(earningsData?.totalEarnings || 0)}
          </Text>
          <View style={styles.earningMetaContainer}>
            <Text style={styles.earningsSubtext}>
              {earningsData?.totalOrders || 0} orders
            </Text>
            <View style={styles.comparisonContainer}>
              {earningsData?.comparison?.status === 'increase' ? (
              <TrendingUp
                size={14}
                  color="#10B981"
                />
              ) : (
                <TrendingDown
                  size={14}
                  color="#EF4444"
                />
              )}
              <Text
                style={[
                  styles.comparisonText,
                  {
                    color:
                      earningsData?.comparison?.status === 'increase'
                        ? '#10B981'
                        : '#EF4444',
                  },
                ]}
              >
                {earningsData?.comparison?.percent || 0}%
              </Text>
            </View>
          </View>

          {/* Financial Breakdown Cards */}
          <View style={styles.breakdownGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <CreditCard size={18} color="#10B981" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Net Earnings</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(earningsData?.netEarnings || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <Percent size={18} color="#F59E0B" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Commission</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(earningsData?.commission || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <Package size={18} color="#3B82F6" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Avg Order</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(earningsData?.averageOrderValue || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <BarChart3 size={18} color="#8B5CF6" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Completion</Text>
                <Text style={styles.metricValue}>
                  {earningsData?.orderAnalytics?.completedOrders || 0} orders
                </Text>
              </View>
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
                {chartData.length > 0 ? (
                  <View style={styles.chartContainerInner}>
                    <View style={styles.chartBars}>
                      {chartData.map((item, index) => {
                        const barHeight = Math.max((item.heightPercent / 100) * 160, 20);
                        return (
                          <View key={index} style={styles.chartBarWrapper}>
                            <View
                              style={[
                                styles.chartBar,
                                {
                                  height: barHeight,
                                },
                              ]}
                            />
                            <Text style={styles.chartBarLabel} numberOfLines={1}>
                              {item.date?.split('T')[0]?.split('-')[2] || item.date?.substring(0, 7) || ''}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    <View style={styles.chartLegend}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FF9F43' }]} />
                        <Text style={styles.legendText}>Earnings</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyChart}>
                    <Text style={styles.emptyChartText}>No data available for selected period</Text>
                </View>
                )}
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
          {transactionsLoading ? (
            <ActivityIndicator style={{ marginVertical: 40 }} />
          ) : transactionsData.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsText}>No transactions found</Text>
            </View>
          ) : (
          <FlatList
            data={transactionsData}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.transactionsList}
          />
          )}
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
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    minWidth: 140,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
  },
  chartContainerInner: {
    height: 200,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 50,
  },
  chartBar: {
    width: 30,
    backgroundColor: '#FF9F43',
    borderRadius: 8,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
  },
  emptyTransactions: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTransactionsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
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