import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, RefreshCw, Download, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

const statusColors = {
  captured: 'bg-green-500',
  authorized: 'bg-blue-500',
  pending: 'bg-yellow-500',
  failed: 'bg-red-500',
  refunded: 'bg-purple-500',
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [paymentDashboard, setPaymentDashboard] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const [historyRes, dashboardRes] = await Promise.all([
        apiClient.get('/super-admin/payments/history', {
          params: {
            page: 1,
            limit: 100,
            ...(statusFilter !== 'all' && { status: statusFilter }),
          },
        }),
        apiClient.get('/super-admin/payments/dashboard').catch(() => ({ data: null })),
      ]);

      const data = historyRes.data?.data || historyRes.data || [];
      setPayments(Array.isArray(data) ? data : []);
      setPaymentDashboard(dashboardRes.data);
    } catch (error) {
      // Ignore cancelled requests
      if (error.name === 'CanceledError' || error.message?.includes('cancelled')) {
        return;
      }
      console.error('Payments fetch error:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const viewPaymentDetails = async (paymentId) => {
    try {
      const id = paymentId?.id || paymentId?._id || paymentId;
      const response = await apiClient.get(`/super-admin/payments/${id}`);
      setSelectedPayment(response.data);
    } catch (error) {
      console.error('Payment details fetch error:', error);
      toast.error('Failed to load payment details');
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const id = paymentId?.id || paymentId?._id || paymentId;
      await apiClient.post(`/super-admin/payments/verify/${id}`);
      toast.success('Payment verified successfully');
      fetchPayments();
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (!payment) return false;
    const searchLower = searchQuery.toLowerCase();
    const paymentId = (payment.id || payment._id || payment.paymentId || '').toString().toLowerCase();
    const customerName = (payment.customer?.name || payment.customerName || '').toLowerCase();
    const orderId = (payment.orderId || payment.referenceId || '').toString().toLowerCase();
    return (
      paymentId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      orderId.includes(searchLower)
    );
  });

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="payments-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payments Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all payment transactions and refunds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Export feature coming soon')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={fetchPayments} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Payment Dashboard Stats */}
      {paymentDashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {paymentDashboard.totalPayments || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {paymentDashboard.successfulPayments || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {paymentDashboard.failedPayments || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(paymentDashboard.totalAmount || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by payment ID, customer, or order ID..."
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
                <SelectItem value="captured">Captured</SelectItem>
                <SelectItem value="authorized">Authorized</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => {
                    const paymentId = payment.id || payment._id || payment.paymentId || 'N/A';
                    const customerName =
                      payment.customer?.name ||
                      payment.customerName ||
                      payment.customer?.email ||
                      'N/A';
                    const orderId = payment.orderId || payment.referenceId || 'N/A';
                    const amount = payment.amount || 0;
                    const method = payment.method || payment.paymentMethod || 'N/A';
                    const status = payment.status || 'pending';
                    const createdAt = payment.createdAt || payment.created_at;

                    return (
                      <TableRow key={paymentId} data-testid={`payment-row-${paymentId}`}>
                        <TableCell className="font-medium">#{paymentId}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell>#{orderId}</TableCell>
                        <TableCell>₹{amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={statusColors[status] || 'bg-gray-500'}
                            data-testid={`payment-status-${paymentId}`}
                          >
                            {status}
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
                                  onClick={() => viewPaymentDetails(paymentId)}
                                  data-testid={`payment-view-${paymentId}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Payment Details</DialogTitle>
                                </DialogHeader>
                                {selectedPayment && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Payment ID</p>
                                        <p className="text-base">
                                          #{selectedPayment.id || selectedPayment._id || selectedPayment.paymentId || 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Customer</p>
                                        <p className="text-base">
                                          {selectedPayment.customer?.name ||
                                            selectedPayment.customerName ||
                                            'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                                        <p className="text-base">
                                          #{selectedPayment.orderId || selectedPayment.referenceId || 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Amount</p>
                                        <p className="text-base font-bold">
                                          ₹{(selectedPayment.amount || 0).toFixed(2)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Method</p>
                                        <p className="text-base">
                                          {selectedPayment.method || selectedPayment.paymentMethod || 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <Badge
                                          className={
                                            statusColors[selectedPayment.status] || 'bg-gray-500'
                                          }
                                        >
                                          {selectedPayment.status || 'N/A'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Created At</p>
                                        <p className="text-base">
                                          {selectedPayment.createdAt || selectedPayment.created_at
                                            ? new Date(
                                              selectedPayment.createdAt || selectedPayment.created_at,
                                            ).toLocaleString()
                                            : 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {status === 'pending' && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => verifyPayment(paymentId)}
                                data-testid={`payment-verify-${paymentId}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

