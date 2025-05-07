'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserCheck, UserX, Eye, MessageSquare } from 'lucide-react';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';
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
import { doc, updateDoc } from 'firebase/firestore'; // Removed deleteDoc as it's not used
import { getFirebase } from '@/firebase';
import { Label } from '@/components/ui/label'; // Import Label


interface Partner {
  id: string; // Firestore document ID
  name: string;
  contactPerson: string;
  mobile: string;
  city: string;
  registeredDate: string; // Consider using Firestore Timestamp or Date object
  status: 'active' | 'inactive' | 'pending_approval' | 'banned';
  totalRevenue?: number; // Optional
  commissionRate?: number; // Optional
}

// Dummy Data (replace with Firestore hook later)
const DUMMY_PARTNERS: Partner[] = [
    { id: 'p1', name: 'Anna Tiffins', contactPerson: 'Anna Sharma', mobile: '9876543210', city: 'Mumbai', registeredDate: '2023-01-15', status: 'active', totalRevenue: 55000, commissionRate: 10 },
    { id: 'p2', name: 'Roti Ghar', contactPerson: 'Raj Patel', mobile: '9123456789', city: 'Delhi', registeredDate: '2023-02-20', status: 'active', totalRevenue: 72000, commissionRate: 12 },
    { id: 'p3', name: 'Home Meals Co.', contactPerson: 'Priya Singh', mobile: '9988776655', city: 'Bangalore', registeredDate: '2023-03-10', status: 'inactive', totalRevenue: 30000, commissionRate: 10 },
    { id: 'p4', name: 'Swad Tiffin', contactPerson: 'Amit Kumar', mobile: '9001122334', city: 'Mumbai', registeredDate: '2023-04-05', status: 'pending_approval', commissionRate: 11 },
    { id: 'p5', name: 'Delhi Delights', contactPerson: 'Sunita Gupta', mobile: '9555667788', city: 'Delhi', registeredDate: '2023-05-12', status: 'banned', totalRevenue: 15000, commissionRate: 10 },
    { id: 'p6', name: 'Healthy Bites', contactPerson: 'Vikram Rao', mobile: '9870001122', city: 'Bangalore', registeredDate: '2023-06-18', status: 'active', totalRevenue: 85000, commissionRate: 15 },
    { id: 'p7', name: 'Taste of India', contactPerson: 'Meera Desai', mobile: '9112233445', city: 'Mumbai', registeredDate: '2023-07-22', status: 'active', totalRevenue: 62000, commissionRate: 10 },
 ];

export default function ManagePartnersPage() {
  const router = useRouter(); // Initialize useRouter
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // Removed viewPartner state as details will be on a separate page
  const [partnerToBan, setPartnerToBan] = useState<Partner | null>(null);
  const [partnerToApprove, setPartnerToApprove] = useState<Partner | null>(null);
  const { toast } = useToast();
  const { firestore } = getFirebase();

  // Replace DUMMY_PARTNERS with live data
   const { data: partnersData, loading, error } = useFirestoreQuery<Partner>('/partners');
   const partners = partnersData.length > 0 ? partnersData : DUMMY_PARTNERS; // Fallback to dummy if needed initially

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.mobile.includes(searchTerm);
      const matchesCity = cityFilter === 'all' || partner.city === cityFilter;
      const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [partners, searchTerm, cityFilter, statusFilter]);

  // Extract unique cities for the filter dropdown
  const cities = useMemo(() => {
    const citySet = new Set(partners.map(p => p.city));
    return ['all', ...Array.from(citySet)];
  }, [partners]);

  const handleUpdateStatus = async (partnerId: string, newStatus: Partner['status']) => {
    if (!firestore) return;
    const partnerRef = doc(firestore, 'partners', partnerId);
    try {
      await updateDoc(partnerRef, { status: newStatus });
      toast({
        title: `Partner ${newStatus === 'banned' ? 'Banned' : newStatus === 'active' ? 'Approved' : 'Updated'}`,
        description: `Partner status successfully updated to ${newStatus}.`,
        variant: newStatus === 'banned' ? 'destructive' : 'default'
      });
       // Close modals after action
      if (newStatus === 'banned') setPartnerToBan(null);
      if (newStatus === 'active') setPartnerToApprove(null);
    } catch (err) {
      console.error("Error updating partner status:", err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update partner status.",
      });
    }
  };

  const getStatusBadgeVariant = (status: Partner['status']): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
       case 'active':
         return 'default'; // Use primary color (implicit default) - Greenish in theme
       case 'inactive':
         return 'secondary'; // Grayish
       case 'pending_approval':
         return 'outline'; // Neutral outline
       case 'banned':
         return 'destructive'; // Red
       default:
         return 'secondary';
     }
   };

   const handleRowClick = (partnerId: string) => {
     router.push(`/dashboard/partners/${partnerId}`);
   };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Manage Partners</h1>

      <Card>
        <CardHeader>
          <CardTitle>Partner List</CardTitle>
          <CardDescription>View, manage, and filter tiffin center partners.</CardDescription>
           {/* Filters */}
           <div className="mt-4 flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by name, contact, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
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
                <TableHead>Contact Person</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-2/4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-2/4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-2/4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-destructive">
                    Error loading partners: {error.message}
                  </TableCell>
                </TableRow>
              ) : filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id} onClick={() => handleRowClick(partner.id)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.contactPerson}</TableCell>
                    <TableCell>{partner.mobile}</TableCell>
                    <TableCell>{partner.city}</TableCell>
                    <TableCell>{partner.registeredDate}</TableCell>
                    <TableCell>
                       <Badge variant={getStatusBadgeVariant(partner.status)} className="capitalize">
                          {partner.status.replace('_', ' ')}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()} /* Prevent row click */>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRowClick(partner.id); }}>
                            <Eye className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          {partner.status === 'pending_approval' && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setPartnerToApprove(partner); }}>
                              <UserCheck className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                          )}
                           {partner.status !== 'banned' && partner.status !== 'pending_approval' && (
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setPartnerToBan(partner); }} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <UserX className="mr-2 h-4 w-4" /> Ban Partner
                              </DropdownMenuItem>
                           )}
                           {partner.status === 'banned' && (
                               <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(partner.id, 'active'); }}>
                                  <UserCheck className="mr-2 h-4 w-4" /> Unban/Reactivate
                               </DropdownMenuItem>
                            )}
                           <DropdownMenuItem onClick={(e) => { e.stopPropagation(); alert(`Contacting ${partner.contactPerson}...`); }}>
                              <MessageSquare className="mr-2 h-4 w-4" /> Contact
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No partners found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Add Pagination controls here if needed */}
        </CardContent>
      </Card>


        {/* Ban Confirmation Dialog */}
        <Dialog open={!!partnerToBan} onOpenChange={(open) => !open && setPartnerToBan(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban Partner?</DialogTitle>
              <DialogDescription>
                 Are you sure you want to ban {partnerToBan?.name}? This action cannot be easily undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
               <Button variant="destructive" onClick={() => handleUpdateStatus(partnerToBan!.id, 'banned')}>
                 Confirm Ban
               </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>

         {/* Approve Confirmation Dialog */}
         <Dialog open={!!partnerToApprove} onOpenChange={(open) => !open && setPartnerToApprove(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Partner?</DialogTitle>
                <DialogDescription>
                   Approve {partnerToApprove?.name} to make their tiffin service active?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                 <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                 <Button variant="default" onClick={() => handleUpdateStatus(partnerToApprove!.id, 'active')}>
                   Confirm Approval
                 </Button>
               </DialogFooter>
            </DialogContent>
          </Dialog>

    </div>
  );
}
