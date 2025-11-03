import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, RefreshCw } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchPartners();
  }, [page, statusFilter]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await apiClient.get('/super-admin/partners', { params });
      // Handle paginated response - check for partners array first
      const data = response.data?.partners || response.data?.data || (Array.isArray(response.data) ? response.data : []);
      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Partners fetch error:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (partnerId, newStatus) => {
    try {
      const id = partnerId?.id || partnerId?._id || partnerId;
      await apiClient.patch(`/super-admin/partners/${id}/status`, { status: newStatus });
      toast.success('Partner status updated');
      fetchPartners();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewPartnerDetails = async (partnerId) => {
    try {
      const id = partnerId?.id || partnerId?._id || partnerId;
      const response = await apiClient.get(`/super-admin/partners/${id}`);
      setSelectedPartner(response.data);
    } catch (error) {
      console.error('Partner details fetch error:', error);
      toast.error('Failed to load partner details');
    }
  };

  const exportToCSV = () => {
    toast.success('Exporting partners to CSV...');
    // TODO: Implement CSV export
  };

  const filteredPartners = partners.filter(partner => {
    if (!partner) return false;
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = (partner.businessName || partner.name || '')?.toLowerCase().includes(searchLower) || false;
    const emailMatch = (partner.contactEmail || partner.email || '')?.toLowerCase().includes(searchLower) || false;
    const phoneMatch = (partner.phoneNumber || partner.phone || '')?.includes(searchQuery) || false;
    return nameMatch || emailMatch || phoneMatch;
  });

  if (loading && partners.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="partners-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Partners Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all restaurant partners and tiffin providers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV} data-testid="export-csv-btn">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={fetchPartners} disabled={loading} data-testid="refresh-partners-btn">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
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
              <SelectTrigger className="w-full sm:w-48" data-testid="status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Partners ({filteredPartners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => {
                  const partnerId = partner.id || partner._id || 'N/A';
                  const partnerName = partner.businessName || partner.name || 'N/A';
                  const partnerEmail = partner.contactEmail || partner.email || 'N/A';
                  const partnerPhone = partner.phoneNumber || partner.phone || 'N/A';
                  const partnerLocation = partner.address?.city || partner.address?.fullAddress || partner.location || 'N/A';
                  const partnerRating = partner.rating || partner.avgRating || 0;
                  const partnerOrders = partner.totalOrders || partner.total_orders || 0;
                  const partnerStatus = partner.status || partner.isActive ? 'active' : 'pending';
                  
                  return (
                    <TableRow key={partnerId} data-testid={`partner-row-${partnerId}`}>
                      <TableCell className="font-medium">{partnerName}</TableCell>
                      <TableCell>{partnerEmail}</TableCell>
                      <TableCell>{partnerPhone}</TableCell>
                      <TableCell>{partnerLocation}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{(partnerRating || 0).toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{partnerOrders}</TableCell>
                      <TableCell>
                        <Badge
                          variant={partnerStatus === 'active' ? 'default' : 'secondary'}
                          className={partnerStatus === 'active' ? 'bg-green-500' : partnerStatus === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'}
                          data-testid={`partner-status-${partnerId}`}
                        >
                          {partnerStatus}
                        </Badge>
                      </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => viewPartnerDetails(partnerId)}
                              data-testid={`view-partner-${partnerId}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Partner Details</DialogTitle>
                            </DialogHeader>
                            {selectedPartner && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="text-base">{selectedPartner.businessName || selectedPartner.name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-base">{selectedPartner.contactEmail || selectedPartner.email || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-base">{selectedPartner.phoneNumber || selectedPartner.phone || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-base">{selectedPartner.address?.city || selectedPartner.address?.fullAddress || selectedPartner.address || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Rating</p>
                                    <p className="text-base flex items-center gap-1">
                                      <span className="text-yellow-500">★</span>
                                      {((selectedPartner.rating || selectedPartner.averageRating || 0)).toFixed(1)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-base">{selectedPartner.totalOrders || selectedPartner.total_orders || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Badge className={selectedPartner.status === 'active' || selectedPartner.status === 'approved' ? 'bg-green-500' : 'bg-gray-500'}>
                                      {selectedPartner.status || 'N/A'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Joined Date</p>
                                    <p className="text-base">{selectedPartner.createdAt || selectedPartner.created_at ? new Date(selectedPartner.createdAt || selectedPartner.created_at).toLocaleDateString() : 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          onValueChange={(value) => updateStatus(partnerId, value)}
                          data-testid={`partner-action-${partnerId}`}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Activate</SelectItem>
                            <SelectItem value="suspended">Suspend</SelectItem>
                            <SelectItem value="pending">Set Pending</SelectItem>
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
          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No partners found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}