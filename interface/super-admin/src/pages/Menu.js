import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Trash2 } from 'lucide-react';
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

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [categoryFilter]);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const params = {
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      };
      const response = await apiClient.get('/super-admin/menu/items', { params });
      console.log('Menu Items API Response:', response.data); // Debug log

      // Handle different response formats
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.items) {
        data = Array.isArray(response.data.items) ? response.data.items : [];
      } else if (response.data?.data) {
        data = Array.isArray(response.data.data) ? response.data.data : [];
      }

      setMenuItems(data);
      if (!loading && data.length > 0) {
        console.log(`Loaded ${data.length} menu items`);
      }
    } catch (error) {
      console.error('Menu items fetch error:', error);
      // Only show error toast on actual API failure
      if (error.response) {
        toast.error(`Failed to load menu items: ${error.response.data?.message || error.message}`);
      } else {
        toast.error('Failed to load menu items');
      }
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const id = itemToDelete?.id || itemToDelete?._id || itemToDelete;
      await apiClient.delete(`/super-admin/menu/items/${id}`);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item) return false;
    const searchLower = searchQuery.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const partnerName = (item.partner_name || item.partner?.businessName || item.partner?.name || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    return name.includes(searchLower) || partnerName.includes(searchLower) || category.includes(searchLower);
  });

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="menu-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Menu Management</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all menu items across partners</p>
        </div>
        <Button size="sm" onClick={fetchMenuItems} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by item name, partner, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Menu Items ({filteredMenuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuItems.map((item) => {
                  const itemId = item.id || item._id || 'N/A';
                  const partnerName = item.partner_name || item.partner?.businessName || item.partner?.name || 'N/A';
                  const price = item.price || 0;
                  const available = item.available !== false && item.available !== undefined;

                  return (
                    <TableRow key={itemId} data-testid={`menu-item-row-${itemId}`}>
                      <TableCell className="font-medium">{item.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">{item.description || 'N/A'}</div>
                      </TableCell>
                      <TableCell>{partnerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.category || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={available ? 'bg-green-500' : 'bg-red-500'}
                          data-testid={`menu-availability-${itemId}`}
                        >
                          {available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(item)}
                            data-testid={`menu-delete-${itemId}`}
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
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
              {itemToDelete && (
                <span className="block mt-2 font-medium">
                  Item: {itemToDelete?.name || itemToDelete?.id || itemToDelete?._id}
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