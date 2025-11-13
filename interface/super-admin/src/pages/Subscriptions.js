import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

const statusColors = {
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  cancelled: 'bg-red-500',
  expired: 'bg-gray-500'
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 100,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await apiClient.get('/super-admin/subscriptions', { params });
      // Handle paginated response - backend returns { data, total, page, limit }
      const data = response.data?.data || response.data?.subscriptions || (Array.isArray(response.data) ? response.data : []);
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Subscriptions fetch error:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (subscriptionId, newStatus) => {
    try {
      const id = subscriptionId?.id || subscriptionId?._id || subscriptionId;
      await apiClient.patch(`/super-admin/subscriptions/${id}/status`, { status: newStatus });
      toast.success('Subscription status updated');
      fetchSubscriptions();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  // Helper function to extract customer name from populated object
  const getCustomerName = (sub) => {
    if (sub.customer_name) return sub.customer_name;
    if (sub.customer) {
      if (typeof sub.customer === 'string') return null;
      const firstName = sub.customer.firstName || '';
      const lastName = sub.customer.lastName || '';
      if (firstName || lastName) return `${firstName} ${lastName}`.trim();
      if (sub.customer.name) return sub.customer.name;
      if (sub.customer.email) return sub.customer.email;
    }
    return null;
  };

  // Helper function to extract partner name from plan
  const getPartnerName = (sub) => {
    if (sub.partner_name) return sub.partner_name;
    if (sub.plan) {
      if (typeof sub.plan === 'string') return null;
      if (sub.plan.partner) {
        if (typeof sub.plan.partner === 'string') return null;
        if (sub.plan.partner.businessName) return sub.plan.partner.businessName;
        if (sub.plan.partner.name) return sub.plan.partner.name;
      }
    }
    if (sub.partner?.name) return sub.partner.name;
    return null;
  };

  // Helper function to extract plan name
  const getPlanName = (sub) => {
    if (sub.plan_name) return sub.plan_name;
    if (sub.plan) {
      if (typeof sub.plan === 'string') return null;
      if (sub.plan.name) return sub.plan.name;
    }
    return null;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (!sub) return false;
    const searchLower = searchQuery.toLowerCase();
    const subId = (sub.id || sub._id || '').toString().toLowerCase();
    const idMatch = subId.includes(searchLower);
    const customerName = getCustomerName(sub) || '';
    const customerMatch = customerName.toLowerCase().includes(searchLower);
    const partnerName = getPartnerName(sub) || '';
    const partnerMatch = partnerName.toLowerCase().includes(searchLower);
    return idMatch || customerMatch || partnerMatch;
  });

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="subscriptions-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Subscriptions Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all meal plan subscriptions</p>
        </div>
        <Button size="sm" onClick={fetchSubscriptions} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by ID, customer, or partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => {
                  const subId = sub.id || sub._id || 'N/A';
                  const customerName = getCustomerName(sub) || 'N/A';
                  const partnerName = getPartnerName(sub) || 'N/A';
                  const planName = getPlanName(sub) || 'N/A';
                  const startDate = sub.startDate || sub.start_date;
                  const endDate = sub.endDate || sub.end_date;
                  const amount = sub.totalAmount || sub.amount || 0;
                  
                  return (
                  <TableRow key={subId} data-testid={`subscription-row-${subId}`}>
                    <TableCell className="font-medium">#{subId}</TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{partnerName}</TableCell>
                    <TableCell>{planName}</TableCell>
                    <TableCell>{startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>₹{amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[sub.status] || 'bg-gray-500'}
                        data-testid={`subscription-status-${subId}`}
                      >
                        {sub.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => updateStatus(subId, value)}
                        data-testid={`subscription-action-${subId}`}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}