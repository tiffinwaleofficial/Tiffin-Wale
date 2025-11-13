import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Eye, RefreshCw } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

const statusColors = {
  open: 'bg-red-500',
  in_progress: 'bg-yellow-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500'
};

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-blue-500'
};

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 100,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await apiClient.get('/super-admin/support/tickets', { params });
      // Handle paginated response
      const data = response.data?.data || response.data?.tickets || (Array.isArray(response.data) ? response.data : []);
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Tickets fetch error:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ticketId, newStatus) => {
    try {
      const id = ticketId?.id || ticketId?._id || ticketId;
      await apiClient.patch(`/super-admin/support/tickets/${id}/status`, { status: newStatus });
      toast.success('Ticket status updated');
      fetchTickets();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewTicketDetails = async (ticketId) => {
    try {
      const id = ticketId?.id || ticketId?._id || ticketId;
      const response = await apiClient.get(`/super-admin/support/tickets/${id}`);
      setSelectedTicket(response.data);
    } catch (error) {
      console.error('Ticket details fetch error:', error);
      toast.error('Failed to load ticket details');
    }
  };

  // Helper function to extract customer name from populated user object
  const getCustomerName = (ticket) => {
    if (ticket.customer_name) return ticket.customer_name;
    if (ticket.user) {
      if (typeof ticket.user === 'string') return null;
      const firstName = ticket.user.firstName || '';
      const lastName = ticket.user.lastName || '';
      if (firstName || lastName) return `${firstName} ${lastName}`.trim();
      if (ticket.user.name) return ticket.user.name;
      if (ticket.user.email) return ticket.user.email;
    }
    if (ticket.customer) {
      if (typeof ticket.customer === 'string') return null;
      const firstName = ticket.customer.firstName || '';
      const lastName = ticket.customer.lastName || '';
      if (firstName || lastName) return `${firstName} ${lastName}`.trim();
      if (ticket.customer.name) return ticket.customer.name;
      if (ticket.customer.email) return ticket.customer.email;
    }
    return null;
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!ticket) return false;
    const searchLower = searchQuery.toLowerCase();
    const ticketId = (ticket.id || ticket._id || ticket.ticketId || '').toString().toLowerCase();
    const idMatch = ticketId.includes(searchLower);
    const customerName = getCustomerName(ticket) || '';
    const customerMatch = customerName.toLowerCase().includes(searchLower);
    const subject = ticket.subject || '';
    const subjectMatch = subject.toLowerCase().includes(searchLower);
    return idMatch || customerMatch || subjectMatch;
  });

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="support-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer support requests and inquiries</p>
        </div>
        <Button size="sm" onClick={fetchTickets} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by ticket ID, customer, or subject..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => {
                  const ticketId = ticket.id || ticket._id || ticket.ticketId || 'N/A';
                  const customerName = getCustomerName(ticket) || 'N/A';
                  const createdAt = ticket.createdAt || ticket.created_at;
                  
                  return (
                  <TableRow key={ticketId} data-testid={`ticket-row-${ticketId}`}>
                    <TableCell className="font-medium">#{ticketId}</TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">{ticket.subject || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={priorityColors[ticket.priority] || 'bg-gray-500'}
                        data-testid={`ticket-priority-${ticketId}`}
                      >
                        {ticket.priority || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[ticket.status] || 'bg-gray-500'}
                        data-testid={`ticket-status-${ticketId}`}
                      >
                        {ticket.status || 'N/A'}
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
                              onClick={() => viewTicketDetails(ticketId)}
                              data-testid={`ticket-view-${ticketId}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Ticket Details</DialogTitle>
                              <DialogDescription>
                                Review ticket information and take action
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTicket && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                                    <p className="text-base">#{selectedTicket.id || selectedTicket._id || selectedTicket.ticketId || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Customer</p>
                                    <p className="text-base">{getCustomerName(selectedTicket) || 'N/A'}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Subject</p>
                                    <p className="text-base">{selectedTicket.subject || 'N/A'}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                    <p className="text-base">{selectedTicket.description || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Priority</p>
                                    <Badge className={priorityColors[selectedTicket.priority] || 'bg-gray-500'}>
                                      {selectedTicket.priority || 'N/A'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Badge className={statusColors[selectedTicket.status] || 'bg-gray-500'}>
                                      {selectedTicket.status || 'N/A'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Created At</p>
                                    <p className="text-base">{selectedTicket.createdAt || selectedTicket.created_at ? new Date(selectedTicket.createdAt || selectedTicket.created_at).toLocaleString() : 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          onValueChange={(value) => updateStatus(ticketId, value)}
                          data-testid={`ticket-action-${ticketId}`}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
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