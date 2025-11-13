import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShoppingBag, Calendar, DollarSign, TrendingUp, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [statsRes, activitiesRes, revenueRes] = await Promise.all([
        apiClient.get('/super-admin/dashboard-stats'),
        apiClient.get('/super-admin/dashboard/activities?limit=10'),
        apiClient.get('/super-admin/analytics/revenue-history?months=6')
      ]);
      
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
      setRevenueHistory(revenueRes.data);
      
      if (silent) {
        toast.success('Dashboard refreshed', { duration: 2000 });
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Partners', 
      value: stats?.totalPartners || stats?.total_partners || 0, 
      icon: Users, 
      color: 'from-blue-500 to-cyan-500', 
      testId: 'stat-partners',
      trend: '+12%'
    },
    { 
      title: 'Total Customers', 
      value: stats?.totalCustomers || stats?.total_customers || 0, 
      icon: Users, 
      color: 'from-purple-500 to-pink-500', 
      testId: 'stat-customers',
      trend: '+8%'
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders || stats?.total_orders || 0, 
      icon: ShoppingBag, 
      color: 'from-green-500 to-emerald-500', 
      testId: 'stat-orders',
      trend: '+15%'
    },
    { 
      title: 'Active Subscriptions', 
      value: stats?.activeSubscriptions || stats?.active_subscriptions || 0, 
      icon: Calendar, 
      color: 'from-orange-500 to-red-500', 
      testId: 'stat-subscriptions',
      trend: '+5%'
    },
    { 
      title: 'Total Revenue', 
      value: `₹${(stats?.totalRevenue || stats?.total_revenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'from-indigo-500 to-purple-500', 
      testId: 'stat-revenue',
      trend: '+18%'
    },
    { 
      title: 'Pending Tickets', 
      value: stats?.pendingTickets || stats?.pending_tickets || 0, 
      icon: AlertCircle, 
      color: 'from-pink-500 to-rose-500', 
      testId: 'stat-tickets',
      trend: '-3%'
    },
  ];

  // Mock order status data for pie chart
  const orderStatusData = [
    { name: 'Delivered', value: 1245, color: '#10b981' },
    { name: 'Preparing', value: 432, color: '#f59e0b' },
    { name: 'Pending', value: 156, color: '#6366f1' },
    { name: 'Cancelled', value: 89, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with TiffinWale today.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          data-testid="refresh-dashboard"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith('+');
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all" data-testid={stat.testId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className={`text-xs font-medium ${
                    isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card data-testid="revenue-chart-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Revenue Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card data-testid="order-status-chart-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Orders Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} orders`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1" data-testid="quick-actions-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="approve-partners-btn"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Pending Partners (12)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="process-payouts-btn"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Process Payouts (₹1.2L)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="review-tickets-btn"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Review Support Tickets ({stats?.pendingTickets || stats?.pending_tickets || 0})
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="view-orders-btn"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Today's Orders (45)
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2" data-testid="recent-activities-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0" 
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}