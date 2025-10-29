'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, PauseCircle, PlayCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  superAdminControllerGetAllSubscriptionsOptions,
  superAdminControllerUpdateSubscriptionStatusMutation 
} from '@tiffinwale/api';

interface Subscription {
  id: string; // Firestore document ID
  subscriptionId: string;
  customerId: string;
  customerName: string;
  partnerId: string;
  partnerName: string;
  planType: 'monthly' | 'weekly' | 'trial';
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  amount: number;
  nextBillingDate?: string; // YYYY-MM-DD, optional
}

// initial empty array; will be filled from API
const DUMMY_SUBSCRIPTIONS: Subscription[] = [];

export default function ManageSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewSubscription, setViewSubscription] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();

  // Use auto-generated React Query hooks
  const { data, isLoading: loading, error: queryError } = useQuery(
    superAdminControllerGetAllSubscriptionsOptions({ query: { page: 1, limit: 100 } })
  );
  
  const updateSubscriptionStatus = useMutation({
    ...superAdminControllerUpdateSubscriptionStatusMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminControllerGetAllSubscriptions'] });
    },
  });

  const subscriptions = (data as any)?.subscriptions || [];
  const error = queryError ? (queryError as any)?.message : null;

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub: any) => {
      const matchesSearch =
        sub.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = planFilter === 'all' || sub.planType === planFilter;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [subscriptions, searchTerm, planFilter, statusFilter]);

  const getStatusBadgeVariant = (status: Subscription['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default'; // Greenish
      case 'paused':
        return 'outline'; // Yellowish/Neutral outline
      case 'cancelled':
        return 'destructive'; // Red
      case 'expired':
        return 'secondary'; // Grayish
      default:
        return 'secondary';
    }
  };

  const handleUpdateStatus = (subId: string, newStatus: Subscription['status']) => {
    updateSubscriptionStatus.mutate({
      path: { id: subId },
      body: { status: newStatus } as any
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Manage Subscriptions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer Subscriptions</CardTitle>
          <CardDescription>View and manage customer subscription plans.</CardDescription>
           <div className="mt-4 flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by ID, Customer, Partner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
               <Select value={planFilter} onValueChange={setPlanFilter}>
                 <SelectTrigger className="w-full md:w-[180px]">
                   <SelectValue placeholder="Filter by Plan" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Plans</SelectItem>
                   <SelectItem value="monthly">Monthly</SelectItem>
                   <SelectItem value="weekly">Weekly</SelectItem>
                   <SelectItem value="trial">Trial</SelectItem>
                 </SelectContent>
               </Select>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                 <SelectTrigger className="w-full md:w-[180px]">
                   <SelectValue placeholder="Filter by Status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Statuses</SelectItem>
                   <SelectItem value="active">Active</SelectItem>
                   <SelectItem value="paused">Paused</SelectItem>
                   <SelectItem value="cancelled">Cancelled</SelectItem>
                   <SelectItem value="expired">Expired</SelectItem>
                 </SelectContent>
               </Select>
            </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
               {Array.from({ length: 5 }).map((_, index) => (
                 <Skeleton key={index} className="h-10 w-full rounded-md" />
               ))}
             </div>
           ) : error ? (
              <p className="text-center text-destructive">
                Error loading subscriptions: {error}
              </p>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                    <TableHead>Subscription ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody>
                  {filteredSubscriptions.length > 0 ? (
                     filteredSubscriptions.map((sub: any) => (
                       <TableRow key={sub.id}>
                         <TableCell className="font-medium">{sub.subscriptionId}</TableCell>
                         <TableCell>{sub.customerName}</TableCell>
                         <TableCell>{sub.partnerName}</TableCell>
                         <TableCell className="capitalize">{sub.planType}</TableCell>
                         <TableCell>{sub.endDate}</TableCell>
                         <TableCell>
                           <Badge variant={getStatusBadgeVariant(sub.status)} className="capitalize">
                              {sub.status}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" className="h-8 w-8 p-0">
                                 <span className="sr-only">Open menu</span>
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setViewSubscription(sub)}>
                                   <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                {sub.status === 'active' && (
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(sub.id, 'paused')}>
                                     <PauseCircle className="mr-2 h-4 w-4" /> Pause
                                   </DropdownMenuItem>
                                )}
                                {sub.status === 'paused' && (
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(sub.id, 'active')}>
                                     <PlayCircle className="mr-2 h-4 w-4" /> Resume
                                   </DropdownMenuItem>
                                )}
                                {(sub.status === 'active' || sub.status === 'paused') && (
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(sub.id, 'cancelled')} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                                    </DropdownMenuItem>
                                )}
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </TableCell>
                       </TableRow>
                     ))
                   ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No subscriptions found matching your criteria.
                        </TableCell>
                      </TableRow>
                   )}
                 </TableBody>
              </Table>
           )}
        </CardContent>
      </Card>

      {/* View Subscription Dialog */}
       <Dialog open={!!viewSubscription} onOpenChange={(open) => !open && setViewSubscription(null)}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle>Subscription Details: {viewSubscription?.subscriptionId}</DialogTitle>
             <DialogDescription>
               Complete information for the selected subscription.
             </DialogDescription>
           </DialogHeader>
           <div className="grid gap-3 py-4 text-sm">
              <div className="flex justify-between">
                 <span className="text-muted-foreground">Customer:</span>
                 <span>{viewSubscription?.customerName} ({viewSubscription?.customerId})</span>
               </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Partner:</span>
                <span>{viewSubscription?.partnerName} ({viewSubscription?.partnerId})</span>
              </div>
               <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type:</span>
                  <span className="capitalize">{viewSubscription?.planType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{viewSubscription?.startDate}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{viewSubscription?.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Next Billing:</span>
                     <span>{viewSubscription?.nextBillingDate || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>₹{viewSubscription?.amount.toFixed(2)}</span>
                   </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Status:</span>
                     <Badge variant={getStatusBadgeVariant(viewSubscription?.status!)} className="capitalize">
                        {viewSubscription?.status}
                     </Badge>
                   </div>
           </div>
           <DialogFooter>
             <DialogClose asChild>
               <Button type="button" variant="secondary">Close</Button>
             </DialogClose>
           </DialogFooter>
         </DialogContent>
       </Dialog>

    </div>
  );
}
