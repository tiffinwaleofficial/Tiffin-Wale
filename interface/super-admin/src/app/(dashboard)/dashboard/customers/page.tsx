'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserX, Eye, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { superAdminControllerGetAllCustomersOptions } from '@tiffinwale/api';
import { Label } from '@/components/ui/label'; // Import Label

interface Customer {
  id: string; // Firestore document ID
  name: string;
  mobile: string;
  city: string;
  subscriptionType: 'monthly' | 'weekly' | 'trial';
  status: 'active' | 'inactive' | 'banned';
  // Add other relevant fields if needed, e.g., registration date
}

// Dummy Data (replace with Firestore hook later)
const DUMMY_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Rohan Verma', mobile: '8765432109', city: 'Mumbai', subscriptionType: 'monthly', status: 'active' },
  { id: 'c2', name: 'Priya Sharma', mobile: '8123456780', city: 'Delhi', subscriptionType: 'weekly', status: 'active' },
  { id: 'c3', name: 'Suresh Kumar', mobile: '8988776651', city: 'Bangalore', subscriptionType: 'monthly', status: 'inactive' },
  { id: 'c4', name: 'Anita Desai', mobile: '8001122335', city: 'Mumbai', subscriptionType: 'trial', status: 'active' },
  { id: 'c5', name: 'Vikram Singh', mobile: '8555667781', city: 'Delhi', subscriptionType: 'monthly', status: 'banned' },
  { id: 'c6', name: 'Deepika Nair', mobile: '8870001123', city: 'Bangalore', subscriptionType: 'weekly', status: 'active' },
];

export default function ManageCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [customerToBan, setCustomerToBan] = useState<Customer | null>(null);
  const { toast } = useToast();

  // Use auto-generated React Query hooks
  const { data, isLoading: loading, error } = useQuery(
    superAdminControllerGetAllCustomersOptions({ query: { page: 1, limit: 100 } })
  );

  const customers = (data as any)?.customers || [];

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: any) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm);
      const matchesCity = cityFilter === 'all' || customer.city === cityFilter;
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesSubscription = subscriptionFilter === 'all' || customer.subscriptionType === subscriptionFilter;
      return matchesSearch && matchesCity && matchesStatus && matchesSubscription;
    });
  }, [customers, searchTerm, cityFilter, statusFilter, subscriptionFilter]);

  const cities = useMemo(() => {
     const citySet = new Set(customers.map((c: any) => c.city));
     return ['all', ...Array.from(citySet)] as string[];
   }, [customers]);

  // Note: Status update functionality can be added when backend endpoint is available
  const handleUpdateStatus = async (customerId: string, newStatus: Customer['status']) => {
    toast({
      title: "Feature Coming Soon",
      description: "Customer status update will be available soon.",
    });
    setCustomerToBan(null);
  };

   const getStatusBadgeVariant = (status: Customer['status']): "default" | "secondary" | "destructive" | "outline" => {
       switch (status) {
         case 'active':
           return 'default'; // Greenish in theme
         case 'inactive':
           return 'secondary'; // Grayish
         case 'banned':
           return 'destructive'; // Red
         default:
           return 'secondary';
       }
     };

     const getSubscriptionBadgeVariant = (type: Customer['subscriptionType']): "default" | "secondary" | "outline" => {
         switch (type) {
           case 'monthly':
             return 'default';
           case 'weekly':
             return 'outline';
           case 'trial':
             return 'secondary';
           default:
             return 'secondary';
         }
       };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Manage Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View, manage, and filter registered users.</CardDescription>
          {/* Filters */}
          <div className="mt-4 flex flex-col md:flex-row flex-wrap gap-4">
            <Input
              placeholder="Search by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm md:flex-1"
            />
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Subscription Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                     <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                     <TableCell><Skeleton className="h-4 w-2/4" /></TableCell>
                     <TableCell><Skeleton className="h-4 w-2/4" /></TableCell>
                     <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                     <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                     <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center text-destructive">
                     Error loading customers: {error.message}
                   </TableCell>
                 </TableRow>
              ): filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.mobile}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      <Badge variant={getSubscriptionBadgeVariant(customer.subscriptionType)} className="capitalize">
                          {customer.subscriptionType}
                       </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(customer.status)} className="capitalize">
                         {customer.status}
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
                          <DropdownMenuItem onClick={() => setViewCustomer(customer)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {customer.status !== 'banned' && (
                            <DropdownMenuItem onClick={() => setCustomerToBan(customer)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <UserX className="mr-2 h-4 w-4" /> Ban User
                            </DropdownMenuItem>
                          )}
                           {customer.status === 'banned' && (
                               <DropdownMenuItem onClick={() => handleUpdateStatus(customer.id, 'active')}>
                                   <UserX className="mr-2 h-4 w-4" /> Unban User
                                </DropdownMenuItem>
                            )}
                          <DropdownMenuItem onClick={() => alert(`Contacting ${customer.name}...`)}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           {/* Add Pagination controls here if needed */}
        </CardContent>
      </Card>

       {/* View Customer Dialog */}
       <Dialog open={!!viewCustomer} onOpenChange={(open) => !open && setViewCustomer(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customer Details: {viewCustomer?.name}</DialogTitle>
              <DialogDescription>
                Information about the selected customer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Display customer details */}
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">Name</Label>
                 <Input value={viewCustomer?.name} readOnly className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">Mobile</Label>
                 <Input value={viewCustomer?.mobile} readOnly className="col-span-3" />
               </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">City</Label>
                  <Input value={viewCustomer?.city} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                   <Label className="text-right">Subscription</Label>
                    <Badge variant={getSubscriptionBadgeVariant(viewCustomer?.subscriptionType!)} className="col-span-3 capitalize w-fit">
                        {viewCustomer?.subscriptionType}
                    </Badge>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label className="text-right">Status</Label>
                   <Badge variant={getStatusBadgeVariant(viewCustomer?.status!)} className="col-span-3 capitalize w-fit">
                       {viewCustomer?.status}
                   </Badge>
                 </div>
              {/* Add more fields as needed */}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

         {/* Ban Confirmation Dialog */}
         <Dialog open={!!customerToBan} onOpenChange={(open) => !open && setCustomerToBan(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ban Customer?</DialogTitle>
                <DialogDescription>
                   Are you sure you want to ban {customerToBan?.name}? They will lose access to the service.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                 <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                 <Button variant="destructive" onClick={() => handleUpdateStatus(customerToBan!.id, 'banned')}>
                   Confirm Ban
                 </Button>
               </DialogFooter>
            </DialogContent>
          </Dialog>

    </div>
  );
}
