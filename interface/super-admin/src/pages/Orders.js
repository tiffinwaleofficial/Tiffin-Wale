import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, RefreshCw } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

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
      // Handle paginated response
      const data = response.data?.data || response.data?.orders || (Array.isArray(response.data) ? response.data : []);
      setOrders(data);
    } catch (error) {
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

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const searchLower = searchQuery.toLowerCase();
    const idMatch = order.id?.toLowerCase().includes(searchLower) || 
                    order._id?.toLowerCase().includes(searchLower) || false;
    const customerMatch = order.customer_name?.toLowerCase().includes(searchLower) ||
                         order.customer?.name?.toLowerCase().includes(searchLower) || false;
    const partnerMatch = order.partner_name?.toLowerCase().includes(searchLower) ||
                        order.businessPartner?.name?.toLowerCase().includes(searchLower) || false;
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const orderId = order.id || order._id || 'N/A';
                  const customerName = order.customer_name || order.customer?.name || 'N/A';
                  const partnerName = order.partner_name || order.businessPartner?.name || order.partner?.name || 'N/A';
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
                                    <p className="text-base">{selectedOrder.customer_name || selectedOrder.customer?.name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Partner</p>
                                    <p className="text-base">{selectedOrder.partner_name || selectedOrder.businessPartner?.name || selectedOrder.partner?.name || 'N/A'}</p>
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
    </div>
  );
}