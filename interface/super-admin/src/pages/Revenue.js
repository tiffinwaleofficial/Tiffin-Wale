import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Clock, RefreshCw, Download, Calendar, Users, ShoppingBag, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '@/config/api';
import { toast } from 'sonner';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function Revenue() {
  const [revenueStats, setRevenueStats] = useState(null);
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('6months');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchRevenueData();
  }, [timeFilter]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const months = timeFilter === '3months' ? 3 : timeFilter === '6months' ? 6 : 12;
      const [statsRes, historyRes] = await Promise.all([
        apiClient.get('/super-admin/revenue/stats'),
        apiClient.get(`/super-admin/analytics/revenue-history?months=${months}`)
      ]);
      setRevenueStats(statsRes.data);
      setRevenueHistory(historyRes.data);
    } catch (error) {
      console.error('Revenue fetch error:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading financial data...</p>
        </div>
      </div>
    );
  }

  // Mock comprehensive financial data
  const financialMetrics = [
    { title: 'Total Revenue', value: `₹${revenueStats?.total_revenue?.toLocaleString()}`, change: '+18%', icon: DollarSign, color: 'from-green-500 to-emerald-500', positive: true },
    { title: 'Monthly Revenue', value: `₹${revenueStats?.monthly_revenue?.toLocaleString()}`, change: '+12%', icon: TrendingUp, color: 'from-blue-500 to-cyan-500', positive: true },
    { title: 'Commission Earned', value: `₹${revenueStats?.commission_earned?.toLocaleString()}`, change: '+15%', icon: CreditCard, color: 'from-purple-500 to-pink-500', positive: true },
    { title: 'Pending Payouts', value: `₹${revenueStats?.pending_payouts?.toLocaleString()}`, change: '-5%', icon: Clock, color: 'from-orange-500 to-red-500', positive: false },
    { title: 'Average Order Value', value: '₹385', change: '+8%', icon: ShoppingBag, color: 'from-indigo-500 to-purple-500', positive: true },
    { title: 'Commission Rate', value: '15%', change: '0%', icon: Percent, color: 'from-pink-500 to-rose-500', positive: true },
    { title: 'Active Partners', value: '156', change: '+12', icon: Users, color: 'from-teal-500 to-cyan-500', positive: true },
    { title: 'Total Transactions', value: '3,892', change: '+245', icon: ShoppingBag, color: 'from-amber-500 to-orange-500', positive: true },
  ];

  // Revenue by category
  const revenueByCategory = [
    { name: 'Subscriptions', value: 1850000, percentage: 72 },
    { name: 'One-Time Orders', value: 520000, percentage: 20 },
    { name: 'Add-ons', value: 177890, percentage: 8 },
  ];

  // Top revenue partners
  const topPartners = [
    { name: 'Mumbai Tiffin House', revenue: 245000, orders: 856, growth: '+23%' },
    { name: 'Delhi Home Kitchen', revenue: 198500, orders: 734, growth: '+18%' },
    { name: 'Bangalore Meals', revenue: 175000, orders: 645, growth: '+15%' },
    { name: 'Pune Flavors', revenue: 142000, orders: 523, growth: '+12%' },
    { name: 'Chennai Specials', revenue: 128000, orders: 467, growth: '+10%' },
  ];

  // Payment methods breakdown
  const paymentMethods = [
    { name: 'UPI', value: 45, color: '#6366f1' },
    { name: 'Credit Card', value: 30, color: '#8b5cf6' },
    { name: 'Debit Card', value: 15, color: '#ec4899' },
    { name: 'Net Banking', value: 10, color: '#f59e0b' },
  ];

  // Pending payouts
  const pendingPayouts = [
    { id: 'p1', partner: 'Mumbai Tiffin House', amount: 45000, period: 'Jan 2025', date: '2025-02-01', status: 'pending' },
    { id: 'p2', partner: 'Delhi Home Kitchen', amount: 38500, period: 'Jan 2025', date: '2025-02-01', status: 'pending' },
    { id: 'p3', partner: 'Bangalore Meals', amount: 52000, period: 'Jan 2025', date: '2025-02-01', status: 'pending' },
    { id: 'p4', partner: 'Pune Flavors', amount: 28000, period: 'Jan 2025', date: '2025-02-05', status: 'pending' },
  ];

  // Recent transactions
  const recentTransactions = [
    { id: 't1', customer: 'Rahul Kumar', amount: 450, type: 'subscription', status: 'completed', date: '2025-01-15' },
    { id: 't2', customer: 'Priya Sharma', amount: 280, type: 'order', status: 'completed', date: '2025-01-15' },
    { id: 't3', customer: 'Amit Singh', amount: 520, type: 'subscription', status: 'completed', date: '2025-01-14' },
    { id: 't4', customer: 'Sneha Patel', amount: 180, type: 'order', status: 'pending', date: '2025-01-14' },
    { id: 't5', customer: 'Rohan Verma', amount: 380, type: 'subscription', status: 'completed', date: '2025-01-13' },
  ];

  return (
    <div className="space-y-6" data-testid="revenue-page">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Revenue & Financial Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive financial metrics and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" data-testid="export-report-btn">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" onClick={fetchRevenueData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Mobile-Friendly Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="subscriptions">Subscriptions</SelectItem>
              <SelectItem value="orders">One-Time Orders</SelectItem>
              <SelectItem value="addons">Add-ons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all" data-testid={`metric-${index}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </CardTitle>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </div>
                  <div className={`flex items-center text-xs font-medium ${
                    metric.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueHistory}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentMethods} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Payouts ({pendingPayouts.length})</CardTitle>
                <Button size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">{payout.partner}</TableCell>
                        <TableCell>{payout.period}</TableCell>
                        <TableCell>₹{payout.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Process</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generating Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPartners.map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{partner.name}</p>
                        <p className="text-sm text-gray-500">{partner.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">₹{partner.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{partner.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">{txn.customer}</TableCell>
                        <TableCell>₹{txn.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{txn.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={txn.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}