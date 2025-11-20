import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, RefreshCw, Trash2 } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      console.log('Customers API Response:', response.data); // Debug log

      // Handle different response formats
      let data = [];
      if (response.data?.data) {
        data = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (response.data?.customers) {
        data = Array.isArray(response.data.customers) ? response.data.customers : [];
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }

      setCustomers(data);

      // Only show success message on manual refresh, not on initial load
      if (!loading && data.length > 0) {
        console.log(`Loaded ${data.length} customers`);
      }
    } catch (error) {
      // Ignore cancelled requests
      if (error.name === 'CanceledError' || error.message?.includes('cancelled')) {
        return;
      }
      console.error('Customers fetch error:', error);
      // Only show error toast on actual API failure, not on empty data
      if (error.response) {
        toast.error(`Failed to load customers: ${error.response.data?.message || error.message}`);
      } else {
        toast.error('Failed to load customers');
      }
      setCustomers([]); // Set empty array on error
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

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      const id = customerToDelete?.id || customerToDelete?._id || customerToDelete;
      await apiClient.delete(`/super-admin/customers/${id}`);
      toast.success('Customer deleted successfully');
      fetchCustomers();
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete customer');
    } finally {
      setDeleting(false);
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
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <TableRow key={customer.id || customer._id || index} data-testid={`customer-row-${customer.id || index}`}>
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
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(customer)}
                          data-testid={`customer-delete-${customer.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
              {customerToDelete && (
                <span className="block mt-2 font-medium">
                  Customer: {customerToDelete?.name || customerToDelete?.email || customerToDelete?.id || customerToDelete?._id}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}