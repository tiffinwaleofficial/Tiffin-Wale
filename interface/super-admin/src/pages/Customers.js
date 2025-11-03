import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, RefreshCw } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 100,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await apiClient.get('/super-admin/customers', { params });
      // Handle paginated response
      const data = response.data?.data || response.data?.customers || (Array.isArray(response.data) ? response.data : []);
      setCustomers(data);
    } catch (error) {
      console.error('Customers fetch error:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (customerId, newStatus) => {
    try {
      await apiClient.patch(`/super-admin/customers/${customerId}/status`, { status: newStatus });
      toast.success('Customer status updated');
      fetchCustomers();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewCustomerDetails = async (customerId) => {
    try {
      const response = await apiClient.get(`/super-admin/customers/${customerId}`);
      setSelectedCustomer(response.data);
    } catch (error) {
      console.error('Customer details fetch error:', error);
      toast.error('Failed to load customer details');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    if (!customer) return false;
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = customer.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = customer.email?.toLowerCase().includes(searchLower) || false;
    const phoneMatch = customer.phone?.includes(searchQuery) || false;
    return nameMatch || emailMatch || phoneMatch;
  });

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="customers-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customers Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all student customers and subscribers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="export-csv-btn">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={fetchCustomers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="search-input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Active Subscriptions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} data-testid={`customer-row-${customer.id}`}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.total_orders}</TableCell>
                    <TableCell>{customer.active_subscriptions}</TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.status === 'active' ? 'default' : 'secondary'}
                        className={customer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                        data-testid={`customer-status-${customer.id}`}
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => viewCustomerDetails(customer.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="text-base">{selectedCustomer.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-base">{selectedCustomer.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-base">{selectedCustomer.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-base">{selectedCustomer.total_orders}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                                    <p className="text-base">{selectedCustomer.active_subscriptions}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Badge className={selectedCustomer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                                      {selectedCustomer.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Joined Date</p>
                                    <p className="text-base">{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          onValueChange={(value) => updateStatus(customer.id, value)}
                          data-testid={`customer-action-${customer.id}`}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Activate</SelectItem>
                            <SelectItem value="inactive">Deactivate</SelectItem>
                            <SelectItem value="suspended">Suspend</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}