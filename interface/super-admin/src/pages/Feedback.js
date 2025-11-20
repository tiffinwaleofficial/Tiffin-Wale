import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RefreshCw, Trash2, Eye, MessageSquare } from 'lucide-react';
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

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-blue-500',
};

const statusColors = {
  open: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
};

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [typeFilter, statusFilter]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 100,
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await apiClient.get('/super-admin/feedback', { params });
      const data = response.data?.feedback || response.data?.data || response.data || [];
      setFeedback(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Feedback fetch error:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const viewFeedbackDetails = async (feedbackId) => {
    try {
      const id = feedbackId?.id || feedbackId?._id || feedbackId;
      const response = await apiClient.get(`/super-admin/feedback/${id}`);
      setSelectedFeedback(response.data);
    } catch (error) {
      console.error('Feedback details fetch error:', error);
      toast.error('Failed to load feedback details');
    }
  };

  const handleDeleteClick = (item) => {
    setFeedbackToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!feedbackToDelete) return;
    setDeleting(true);
    try {
      const id = feedbackToDelete?.id || feedbackToDelete?._id || feedbackToDelete;
      await apiClient.delete(`/super-admin/feedback/${id}`);
      toast.success('Feedback deleted successfully');
      fetchFeedback();
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete feedback');
    } finally {
      setDeleting(false);
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    if (!item) return false;
    const searchLower = searchQuery.toLowerCase();
    const message = (item.message || item.description || '').toLowerCase();
    const userName = (item.user?.name || item.userName || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    return message.includes(searchLower) || userName.includes(searchLower) || category.includes(searchLower);
  });

  if (loading && feedback.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="feedback-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Feedback Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer feedback and reports</p>
        </div>
        <Button size="sm" onClick={fetchFeedback} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by message, user, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
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
          <CardTitle>All Feedback ({filteredFeedback.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No feedback found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedback.map((item) => {
                    const feedbackId = item.id || item._id || 'N/A';
                    const userName = item.user?.name || item.userName || 'N/A';
                    const type = item.type || 'feedback';
                    const category = item.category || 'N/A';
                    const priority = item.priority || 'medium';
                    const status = item.status || 'open';
                    const message = item.message || item.description || 'No message';
                    const createdAt = item.createdAt || item.created_at;

                    return (
                      <TableRow key={feedbackId} data-testid={`feedback-row-${feedbackId}`}>
                        <TableCell className="font-medium">{userName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={priorityColors[priority] || 'bg-gray-500'}
                            data-testid={`feedback-priority-${feedbackId}`}
                          >
                            {priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={statusColors[status] || 'bg-gray-500'}
                            data-testid={`feedback-status-${feedbackId}`}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">{message}</div>
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
                                  onClick={() => viewFeedbackDetails(feedbackId)}
                                  data-testid={`feedback-view-${feedbackId}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Feedback Details</DialogTitle>
                                </DialogHeader>
                                {selectedFeedback && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">User</p>
                                        <p className="text-base">
                                          {selectedFeedback.user?.name || selectedFeedback.userName || 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Type</p>
                                        <Badge variant="outline" className="capitalize">
                                          {selectedFeedback.type || 'N/A'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Category</p>
                                        <p className="text-base">{selectedFeedback.category || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Priority</p>
                                        <Badge
                                          className={
                                            priorityColors[selectedFeedback.priority] || 'bg-gray-500'
                                          }
                                        >
                                          {selectedFeedback.priority || 'N/A'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <Badge
                                          className={
                                            statusColors[selectedFeedback.status] || 'bg-gray-500'
                                          }
                                        >
                                          {selectedFeedback.status || 'N/A'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Created At</p>
                                        <p className="text-base">
                                          {selectedFeedback.createdAt || selectedFeedback.created_at
                                            ? new Date(
                                                selectedFeedback.createdAt || selectedFeedback.created_at,
                                              ).toLocaleString()
                                            : 'N/A'}
                                        </p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-sm font-medium text-gray-500">Message</p>
                                        <p className="text-base">
                                          {selectedFeedback.message || selectedFeedback.description || 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteClick(item)}
                              data-testid={`feedback-delete-${feedbackId}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
              {feedbackToDelete && (
                <span className="block mt-2 font-medium">
                  Feedback ID: {feedbackToDelete?.id || feedbackToDelete?._id}
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

