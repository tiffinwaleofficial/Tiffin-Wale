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
      setPartners(response.data);
    } catch (error) {
      console.error('Partners fetch error:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (partnerId, newStatus) => {
    try {
      await apiClient.patch(`/super-admin/partners/${partnerId}/status`, { status: newStatus });
      toast.success('Partner status updated');
      fetchPartners();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewPartnerDetails = async (partnerId) => {
    try {
      const response = await apiClient.get(`/super-admin/partners/${partnerId}`);
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

  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.phone.includes(searchQuery)
  );

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
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id} data-testid={`partner-row-${partner.id}`}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{partner.phone}</TableCell>
                    <TableCell>{partner.address}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{partner.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{partner.total_orders}</TableCell>
                    <TableCell>
                      <Badge
                        variant={partner.status === 'active' ? 'default' : 'secondary'}
                        className={partner.status === 'active' ? 'bg-green-500' : partner.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'}
                        data-testid={`partner-status-${partner.id}`}
                      >
                        {partner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => viewPartnerDetails(partner.id)}
                              data-testid={`view-partner-${partner.id}`}
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
                                    <p className="text-base">{selectedPartner.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-base">{selectedPartner.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-base">{selectedPartner.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-base">{selectedPartner.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Rating</p>
                                    <p className="text-base flex items-center gap-1">
                                      <span className="text-yellow-500">★</span>
                                      {selectedPartner.rating.toFixed(1)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-base">{selectedPartner.total_orders}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Badge className={selectedPartner.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                                      {selectedPartner.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Joined Date</p>
                                    <p className="text-base">{new Date(selectedPartner.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          onValueChange={(value) => updateStatus(partner.id, value)}
                          data-testid={`partner-action-${partner.id}`}
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
                ))}
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