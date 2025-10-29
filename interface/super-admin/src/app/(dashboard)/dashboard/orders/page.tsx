'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Truck, CheckCircle, CircleOff, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  superAdminControllerGetAllOrdersOptions,
  superAdminControllerUpdateOrderStatusMutation 
} from '@tiffinwale/api';
import type { DateRange } from "react-day-picker"
import { format } from 'date-fns';
import { cn } from "@/lib/utils";


interface Order {
  id: string; // Firestore document ID
  orderId: string;
  customerId: string;
  customerName: string;
  partnerId: string;
  partnerName: string;
  tiffinType: 'Lunch' | 'Dinner' | 'Both';
  orderDate: string; // Consider using Firestore Timestamp or Date object
  status: 'pending' | 'dispatched' | 'delivered' | 'cancelled';
  deliveryPartner?: string; // Optional
  dispatched: boolean;
  amount: number;
}

// Dummy Data
const DUMMY_ORDERS: Order[] = [
  { id: 'o1', orderId: 'ORD12345', customerId: 'c1', customerName: 'Rohan Verma', partnerId: 'p1', partnerName: 'Anna Tiffins', tiffinType: 'Lunch', orderDate: '2024-07-28', status: 'delivered', deliveryPartner: 'Raju', dispatched: true, amount: 150 },
  { id: 'o2', orderId: 'ORD12346', customerId: 'c2', customerName: 'Priya Sharma', partnerId: 'p2', partnerName: 'Roti Ghar', tiffinType: 'Dinner', orderDate: '2024-07-28', status: 'dispatched', deliveryPartner: 'Sunil', dispatched: true, amount: 180 },
  { id: 'o3', orderId: 'ORD12347', customerId: 'c1', customerName: 'Rohan Verma', partnerId: 'p1', partnerName: 'Anna Tiffins', tiffinType: 'Lunch', orderDate: '2024-07-29', status: 'pending', dispatched: false, amount: 150 },
  { id: 'o4', orderId: 'ORD12348', customerId: 'c3', customerName: 'Suresh Kumar', partnerId: 'p6', partnerName: 'Healthy Bites', tiffinType: 'Both', orderDate: '2024-07-29', status: 'pending', dispatched: false, amount: 250 },
  { id: 'o5', orderId: 'ORD12349', customerId: 'c4', customerName: 'Anita Desai', partnerId: 'p7', partnerName: 'Taste of India', tiffinType: 'Dinner', orderDate: '2024-07-27', status: 'cancelled', dispatched: false, amount: 160 },
  { id: 'o6', orderId: 'ORD12350', customerId: 'c2', customerName: 'Priya Sharma', partnerId: 'p2', partnerName: 'Roti Ghar', tiffinType: 'Dinner', orderDate: '2024-07-29', status: 'pending', dispatched: false, amount: 180 },
];

export default function ManageOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tiffinTypeFilter, setTiffinTypeFilter] = useState('all');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use auto-generated React Query hooks
  const { data, isLoading: loading, error } = useQuery(
    superAdminControllerGetAllOrdersOptions({ query: { page: 1, limit: 100 } })
  );
  
  const updateOrderStatus = useMutation({
    ...superAdminControllerUpdateOrderStatusMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminControllerGetAllOrders'] });
      toast({
        title: "Order Status Updated",
        description: `Order ${orderToUpdate?.orderId} status updated successfully.`,
      });
      setOrderToUpdate(null);
      setNewStatus('');
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Could not update order status.",
      });
    },
  });

  const orders = (data as any)?.orders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.deliveryPartner && order.deliveryPartner.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesTiffinType = tiffinTypeFilter === 'all' || order.tiffinType === tiffinTypeFilter;

      const matchesDate = !dateRange || !dateRange.from || (
        order.orderDate >= format(dateRange.from, 'yyyy-MM-dd') &&
        (!dateRange.to || order.orderDate <= format(dateRange.to, 'yyyy-MM-dd'))
      );


      return matchesSearch && matchesStatus && matchesTiffinType && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, tiffinTypeFilter, dateRange]);

  const handleUpdateStatus = () => {
    if (!orderToUpdate || !newStatus) return;
    
    updateOrderStatus.mutate({
      path: { id: orderToUpdate.id },
      body: { status: newStatus } as any
    });
  };


  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
        case 'delivered':
          return 'default'; // Greenish
        case 'dispatched':
          return 'outline'; // Blueish/Default outline
        case 'pending':
          return 'secondary'; // Grayish
        case 'cancelled':
          return 'destructive'; // Red
        default:
          return 'secondary';
      }
    };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Manage Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>View, filter, and manage tiffin orders.</CardDescription>
          {/* Filters */}
          <div className="mt-4 flex flex-col md:flex-row flex-wrap gap-4">
            <Input
              placeholder="Search by Order ID, Names, Delivery Partner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm md:flex-1"
            />
             {/* Use the imported DatePicker */}
             <DatePicker date={dateRange} onDateChange={setDateRange} className="w-full md:w-auto"/>
            <Select value={tiffinTypeFilter} onValueChange={setTiffinTypeFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                 <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Partner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {loading ? (
                  Array.from({ length: 7 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                   <TableRow>
                     <TableCell colSpan={9} className="text-center text-destructive">
                       Error loading orders: {error.message}
                     </TableCell>
                   </TableRow>
               ): filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.partnerName}</TableCell>
                    <TableCell>{order.tiffinType}</TableCell>
                     <TableCell>₹{order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                       <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {order.status}
                       </Badge>
                    </TableCell>
                    <TableCell>{order.deliveryPartner || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={() => { setOrderToUpdate(order); setNewStatus('pending'); }}
                              disabled={order.status === 'pending'}
                            >
                             <History className="mr-2 h-4 w-4" /> Mark Pending
                           </DropdownMenuItem>
                           <DropdownMenuItem
                               onClick={() => { setOrderToUpdate(order); setNewStatus('dispatched'); }}
                               disabled={order.status === 'dispatched' || order.status === 'delivered' || order.status === 'cancelled'}
                             >
                              <Truck className="mr-2 h-4 w-4" /> Mark Dispatched
                            </DropdownMenuItem>
                            <DropdownMenuItem
                               onClick={() => { setOrderToUpdate(order); setNewStatus('delivered'); }}
                               disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                               onClick={() => { setOrderToUpdate(order); setNewStatus('cancelled'); }}
                               disabled={order.status === 'cancelled'}
                               className="text-destructive focus:text-destructive focus:bg-destructive/10"
                             >
                               <CircleOff className="mr-2 h-4 w-4" /> Mark Cancelled
                             </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No orders found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           {/* Add Pagination controls here if needed */}
        </CardContent>
      </Card>

       {/* View Order Dialog */}
       <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader>
               <DialogTitle>Order Details: {viewOrder?.orderId}</DialogTitle>
               <DialogDescription>
                 Complete information for the selected order.
               </DialogDescription>
             </DialogHeader>
             <div className="grid gap-3 py-4 text-sm">
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Customer:</span>
                   <span>{viewOrder?.customerName} ({viewOrder?.customerId})</span>
                 </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partner:</span>
                  <span>{viewOrder?.partnerName} ({viewOrder?.partnerId})</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span>{viewOrder?.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Tiffin Type:</span>
                     <span>{viewOrder?.tiffinType}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-muted-foreground">Amount:</span>
                       <span>₹{viewOrder?.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusBadgeVariant(viewOrder?.status!)} className="capitalize">
                           {viewOrder?.status}
                         </Badge>
                    </div>
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Dispatched:</span>
                       <span>{viewOrder?.dispatched ? 'Yes' : 'No'}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Partner:</span>
                        <span>{viewOrder?.deliveryPartner || 'N/A'}</span>
                     </div>
             </div>
             <DialogFooter>
               <DialogClose asChild>
                 <Button type="button" variant="secondary">Close</Button>
               </DialogClose>
             </DialogFooter>
           </DialogContent>
         </Dialog>


          {/* Update Status Confirmation Dialog */}
          <Dialog open={!!orderToUpdate} onOpenChange={(open) => !open && setOrderToUpdate(null)}>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Update Order Status?</DialogTitle>
                 <DialogDescription>
                    Are you sure you want to mark order {orderToUpdate?.orderId} as <span className="font-semibold capitalize">{newStatus}</span>?
                 </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <DialogClose asChild><Button variant="outline" onClick={() => setNewStatus('')}>Cancel</Button></DialogClose>
                  <Button
                     variant={newStatus === 'cancelled' ? 'destructive' : 'default'}
                     onClick={handleUpdateStatus}
                    >
                    Confirm Update
                  </Button>
                </DialogFooter>
             </DialogContent>
           </Dialog>

    </div>
  );
}
