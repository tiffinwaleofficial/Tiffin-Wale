import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, RefreshCw, Trash2 } from 'lucide-react';
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

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-purple-500',
  delivering: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 100,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await apiClient.get('/super-admin/orders', { params });
      // Handle paginated response - backend returns { orders, total, page, limit }
      const data = response.data?.orders || response.data?.data || (Array.isArray(response.data) ? response.data : []);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      // Ignore cancelled requests
      if (error.name === 'CanceledError' || error.message?.includes('cancelled')) {
        return;
      }
      console.error('Orders fetch error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const id = orderId?.id || orderId?._id || orderId;
      await apiClient.patch(`/super-admin/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const id = orderId?.id || orderId?._id || orderId;
      const response = await apiClient.get(`/super-admin/orders/${id}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Order details fetch error:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    setDeleting(true);
    try {
      const id = orderToDelete?.id || orderToDelete?._id || orderToDelete;
      await apiClient.delete(`/super-admin/orders/${id}`);
      toast.success('Order deleted successfully');
      fetchOrders();
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  // Helper function to extract customer name from populated object
  const getCustomerName = (order) => {
    if (order.customer_name) return order.customer_name;
    if (order.customer) {
      if (typeof order.customer === 'string') return null;
      const firstName = order.customer.firstName || '';
      const lastName = order.customer.lastName || '';
      if (firstName || lastName) return `${firstName} ${lastName}`.trim();
      if (order.customer.name) return order.customer.name;
      if (order.customer.email) return order.customer.email;
    }
    return null;
  };

  // Helper function to extract partner name from populated object
  const getPartnerName = (order) => {
    if (order.partner_name) return order.partner_name;
    if (order.businessPartner) {
      if (typeof order.businessPartner === 'string') return null;
      if (order.businessPartner.businessName) return order.businessPartner.businessName;
      if (order.businessPartner.name) return order.businessPartner.name;
    }
    if (order.partner?.name) return order.partner.name;
    return null;
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const searchLower = searchQuery.toLowerCase();
    const orderId = (order.id || order._id || '').toString().toLowerCase();
    const idMatch = orderId.includes(searchLower);
    const customerName = getCustomerName(order) || '';
    const customerMatch = customerName.toLowerCase().includes(searchLower);
    const partnerName = getPartnerName(order) || '';
    const partnerMatch = partnerName.toLowerCase().includes(searchLower);
    return idMatch || customerMatch || partnerMatch;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="orders-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Orders Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage all orders across the platform</p>
        </div>
        <Button size="sm" onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order ID, customer, or partner..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivering">Delivering</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const orderId = order.id || order._id || 'N/A';
                  const customerName = getCustomerName(order) || 'N/A';
                  const partnerName = getPartnerName(order) || 'N/A';
                  const items = order.items || order.orderItems || [];
                  const totalAmount = order.total_amount || order.totalAmount || order.amount || 0;
                  const orderStatus = order.status || 'pending';
                  const createdAt = order.createdAt || order.created_at;

                  return (
                    <TableRow key={orderId} data-testid={`order-row-${orderId}`}>
                      <TableCell className="font-medium">#{orderId}</TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell>{partnerName}</TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate">
                          {Array.isArray(items) && items.length > 0 ? (
                            items.map((item, idx) => {
                              if (typeof item === 'string') return item;
                              const itemName = item.name || item.title || item.mealId || item.mealName || 'Item';
                              const quantity = item.quantity ? ` x${item.quantity}` : '';
                              return itemName + quantity;
                            }).join(', ')
                          ) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>₹{(totalAmount || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={statusColors[orderStatus] || 'bg-gray-500'}
                          data-testid={`order-status-${orderId}`}
                        >
                          {orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => viewOrderDetails(orderId)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Order ID</p>
                                      <p className="text-base">#{selectedOrder.id || selectedOrder._id || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Customer</p>
                                      <p className="text-base">{getCustomerName(selectedOrder) || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Partner</p>
                                      <p className="text-base">{getPartnerName(selectedOrder) || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Amount</p>
                                      <p className="text-base">₹{((selectedOrder.total_amount || selectedOrder.totalAmount || selectedOrder.amount || 0)).toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Status</p>
                                      <Badge className={statusColors[selectedOrder.status] || 'bg-gray-500'}>
                                        {selectedOrder.status || 'N/A'}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Date</p>
                                      <p className="text-base">{selectedOrder.createdAt || selectedOrder.created_at ? new Date(selectedOrder.createdAt || selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-gray-500">Items</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        {(selectedOrder.items || selectedOrder.orderItems || []).map((item, idx) => {
                                          if (typeof item === 'string') {
                                            return <li key={idx}>{item}</li>;
                                          }
                                          // Handle item objects with mealId, name, title, etc.
                                          const itemName = item.name || item.title || item.mealId || item.mealName || 'Unknown Item';
                                          const quantity = item.quantity ? ` (x${item.quantity})` : '';
                                          const price = item.price ? ` - ₹${item.price}` : '';
                                          const instructions = item.specialInstructions ? ` - ${item.specialInstructions}` : '';
                                          return (
                                            <li key={idx}>
                                              {itemName}{quantity}{price}{instructions}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Select
                            onValueChange={(value) => updateStatus(orderId, value)}
                            data-testid={`order-action-${orderId}`}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivering">Delivering</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(order)}
                            data-testid={`order-delete-${orderId}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
              {orderToDelete && (
                <span className="block mt-2 font-medium">
                  Order ID: {orderToDelete?.id || orderToDelete?._id}
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