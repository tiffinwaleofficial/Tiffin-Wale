'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarDays, List } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker'; // Assuming this component exists
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { DateRange } from 'react-day-picker';

interface MenuItem {
  id: string;
  partnerId: string;
  partnerName: string;
  date: string; // YYYY-MM-DD
  mealType: 'Lunch' | 'Dinner';
  items: string[];
  status: 'active' | 'draft' | 'archived';
}

// Dummy Data
const DUMMY_MENUS: MenuItem[] = [
  { id: 'm1', partnerId: 'p1', partnerName: 'Anna Tiffins', date: '2024-08-01', mealType: 'Lunch', items: ['Dal Makhani', 'Paneer Butter Masala', 'Rice', 'Roti (3)', 'Salad'], status: 'active' },
  { id: 'm2', partnerId: 'p2', partnerName: 'Roti Ghar', date: '2024-08-01', mealType: 'Dinner', items: ['Chole Bhature', 'Raita', 'Onion Salad'], status: 'active' },
  { id: 'm3', partnerId: 'p1', partnerName: 'Anna Tiffins', date: '2024-08-02', mealType: 'Lunch', items: ['Rajma Chawal', 'Mix Veg', 'Roti (3)', 'Curd'], status: 'active' },
  { id: 'm4', partnerId: 'p6', partnerName: 'Healthy Bites', date: '2024-08-01', mealType: 'Lunch', items: ['Quinoa Salad', 'Grilled Chicken', 'Steamed Veggies'], status: 'draft' },
  { id: 'm5', partnerId: 'p2', partnerName: 'Roti Ghar', date: '2024-08-02', mealType: 'Dinner', items: ['Veg Biryani', 'Raita', 'Papad'], status: 'active' },
  { id: 'm6', partnerId: 'p1', partnerName: 'Anna Tiffins', date: '2024-07-31', mealType: 'Lunch', items: ['Kadhi Pakoda', 'Aloo Gobi', 'Rice', 'Roti (3)'], status: 'archived' },
];


export default function MenuManagementPage() {
  const [loading, setLoading] = useState(false); // Set to true when fetching data
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list'); // Default view mode
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  // In a real app, fetch partners for the filter dropdown
  const partners = [
      { id: 'all', name: 'All Partners' },
      { id: 'p1', name: 'Anna Tiffins' },
      { id: 'p2', name: 'Roti Ghar' },
      { id: 'p6', name: 'Healthy Bites' },
      // Add other partners
  ];


  const filteredMenus = DUMMY_MENUS.filter(menu => {
      const matchesPartner = partnerFilter === 'all' || menu.partnerId === partnerFilter;
      const matchesStatus = statusFilter === 'all' || menu.status === statusFilter;
       const matchesDate = !dateRange || !dateRange.from || (
              menu.date >= (dateRange.from?.toISOString().split('T')[0] ?? '') &&
              (!dateRange.to || menu.date <= (dateRange.to?.toISOString().split('T')[0] ?? ''))
           );
      return matchesPartner && matchesStatus && matchesDate;
    });

    const getStatusBadgeVariant = (status: MenuItem['status']): "default" | "secondary" | "outline" => {
        switch (status) {
          case 'active':
            return 'default';
          case 'draft':
            return 'outline';
          case 'archived':
            return 'secondary';
          default:
            return 'secondary';
        }
      };

    const handleAddOrEditMenu = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const menuData = Object.fromEntries(formData.entries());
        console.log("Saving menu:", menuData); // Replace with actual save logic
        // Add logic to save/update menu in Firestore
        setIsAddMenuOpen(false);
        setEditingMenu(null);
        // Optionally show a toast notification
      };

    const openEditModal = (menu: MenuItem) => {
      setEditingMenu(menu);
      setIsAddMenuOpen(true);
    };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Menu Management</h1>
         <Button onClick={() => { setEditingMenu(null); setIsAddMenuOpen(true); }}>
           <PlusCircle className="mr-2 h-4 w-4" /> Add New Menu
         </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tiffin Menus</CardTitle>
          <CardDescription>Manage daily and weekly menus offered by partners.</CardDescription>
          <div className="mt-4 flex flex-col md:flex-row gap-4">
             {/* Date Picker */}
             <DatePicker date={dateRange} onDateChange={setDateRange} className="w-full md:w-auto"/>
             {/* Partner Filter */}
             <Select value={partnerFilter} onValueChange={setPartnerFilter}>
               <SelectTrigger className="w-full md:w-[200px]">
                 <SelectValue placeholder="Filter by Partner" />
               </SelectTrigger>
               <SelectContent>
                 {partners.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
              {/* Status Filter */}
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
             {/* View Mode Toggle */}
             <div className="flex gap-1 ml-auto">
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'calendar' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('calendar')}>
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
           {loading ? (
             <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
           ) : error ? (
              <p className="text-center text-destructive">
                 Error loading menus: {error}
              </p>
           ) : viewMode === 'list' ? (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Date</TableHead>
                   <TableHead>Partner</TableHead>
                   <TableHead>Meal Type</TableHead>
                   <TableHead>Items</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredMenus.length > 0 ? (
                    filteredMenus.map(menu => (
                      <TableRow key={menu.id}>
                        <TableCell>{menu.date}</TableCell>
                        <TableCell>{menu.partnerName}</TableCell>
                        <TableCell>{menu.mealType}</TableCell>
                        <TableCell className="max-w-xs truncate">{menu.items.join(', ')}</TableCell>
                         <TableCell>
                           <Badge variant={getStatusBadgeVariant(menu.status)} className="capitalize">
                              {menu.status}
                           </Badge>
                         </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(menu)}>Edit</Button>
                           {/* Add more actions like duplicate, delete */}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                       <TableCell colSpan={6} className="text-center">
                         No menus found for the selected criteria.
                       </TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
             <div className="text-center text-muted-foreground py-8">
                Calendar view is under development. Please use the list view for now.
                {/* Placeholder for Calendar Component */}
              </div>
           )}
        </CardContent>
      </Card>

        {/* Add/Edit Menu Dialog */}
        <Dialog open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{editingMenu ? 'Edit Menu' : 'Add New Menu'}</DialogTitle>
              <DialogDescription>
                {editingMenu ? 'Update the details for this menu.' : 'Create a new menu offering for a partner.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddOrEditMenu}>
              <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="partnerId" className="text-right">Partner</Label>
                    <Select name="partnerId" defaultValue={editingMenu?.partnerId ?? ''} required>
                      <SelectTrigger className="col-span-3">
                         <SelectValue placeholder="Select a partner" />
                       </SelectTrigger>
                       <SelectContent>
                         {partners.filter(p=> p.id !== 'all').map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                         ))}
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                     {/* Basic date input, replace with a Date Picker component if available */}
                     <Input id="date" name="date" type="date" defaultValue={editingMenu?.date ?? ''} required className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mealType" className="text-right">Meal</Label>
                     <Select name="mealType" defaultValue={editingMenu?.mealType ?? 'Lunch'} required>
                       <SelectTrigger className="col-span-3">
                         <SelectValue placeholder="Select meal type" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Lunch">Lunch</SelectItem>
                         <SelectItem value="Dinner">Dinner</SelectItem>
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="items" className="text-right pt-2 self-start">Items</Label>
                     <Textarea
                        id="items"
                        name="items"
                        defaultValue={editingMenu?.items.join(', ') ?? ''}
                        required
                        className="col-span-3"
                        placeholder="Enter menu items, separated by commas (e.g., Roti, Sabzi, Dal)"
                      />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">Status</Label>
                      <Select name="status" defaultValue={editingMenu?.status ?? 'draft'} required>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
               </div>
               <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                 <Button type="submit">{editingMenu ? 'Update Menu' : 'Add Menu'}</Button>
               </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

    </div>
  );
}
