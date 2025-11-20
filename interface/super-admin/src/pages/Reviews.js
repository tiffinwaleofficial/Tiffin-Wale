import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Trash2, Star } from 'lucide-react';
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

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/super-admin/reviews', {
        params: {
          page: 1,
          limit: 100,
        },
      });
      const data = response.data?.data || response.data || [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Reviews fetch error:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    setDeleting(true);
    try {
      const id = reviewToDelete?.id || reviewToDelete?._id || reviewToDelete;
      await apiClient.delete(`/super-admin/reviews/${id}`);
      toast.success('Review deleted successfully');
      fetchReviews();
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (!review) return false;
    const searchLower = searchQuery.toLowerCase();
    const comment = (review.comment || '').toLowerCase();
    const userName = (review.user?.name || review.userName || '').toLowerCase();
    const restaurantName = (review.restaurant?.businessName || review.restaurantName || '').toLowerCase();
    return comment.includes(searchLower) || userName.includes(searchLower) || restaurantName.includes(searchLower);
  });

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="reviews-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reviews Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer reviews and ratings</p>
        </div>
        <Button size="sm" onClick={fetchReviews} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by comment, user, or restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => {
                    const reviewId = review.id || review._id || 'N/A';
                    const userName = review.user?.name || review.userName || 'N/A';
                    const restaurantName = review.restaurant?.businessName || review.restaurantName || 'N/A';
                    const rating = review.rating || 0;
                    const comment = review.comment || 'No comment';
                    const createdAt = review.createdAt || review.created_at;

                    return (
                      <TableRow key={reviewId} data-testid={`review-row-${reviewId}`}>
                        <TableCell className="font-medium">{userName}</TableCell>
                        <TableCell>{restaurantName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate">{comment}</div>
                        </TableCell>
                        <TableCell>
                          {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(review)}
                            data-testid={`review-delete-${reviewId}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
              {reviewToDelete && (
                <span className="block mt-2 font-medium">
                  Review ID: {reviewToDelete?.id || reviewToDelete?._id}
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

