'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, MessageSquare, CheckSquare, Archive } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea'; // For reply

interface SupportTicket {
    id: string; // Firestore document ID
    ticketId: string;
    submitterId: string;
    submitterName: string; // Added for display
    submitterType: 'customer' | 'partner';
    subject: string;
    description: string;
    submittedDate: string; // ISO string or Timestamp
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string; // Admin User ID
    assignedAdminName?: string; // Added for display
    resolution?: string;
}

// Dummy Data
const DUMMY_TICKETS: SupportTicket[] = [
    { id: 't1', ticketId: 'TKT-001', submitterId: 'c1', submitterName: 'Rohan Verma', submitterType: 'customer', subject: 'Late Delivery', description: 'My lunch order ORD12345 was delivered 30 minutes late yesterday.', submittedDate: '2024-07-29T10:30:00Z', status: 'open' },
    { id: 't2', ticketId: 'TKT-002', submitterId: 'p2', submitterName: 'Roti Ghar', submitterType: 'partner', subject: 'Payout Query', description: 'Haven\'t received the payout for the last cycle.', submittedDate: '2024-07-28T15:00:00Z', status: 'in_progress', assignedTo: 'admin1', assignedAdminName: 'Admin A' },
    { id: 't3', ticketId: 'TKT-003', submitterId: 'c6', submitterName: 'Deepika Nair', submitterType: 'customer', subject: 'Wrong Item Received', description: 'Received Paneer instead of Chicken Curry today.', submittedDate: '2024-07-27T13:15:00Z', status: 'resolved', resolution: 'Refund processed for the order.' },
    { id: 't4', ticketId: 'TKT-004', submitterId: 'p1', submitterName: 'Anna Tiffins', submitterType: 'partner', subject: 'Menu Update Issue', description: 'Cannot update the menu for next week, getting an error.', submittedDate: '2024-07-26T09:00:00Z', status: 'closed', resolution: 'System glitch fixed. Please try again.' },
    { id: 't5', ticketId: 'TKT-005', submitterId: 'c2', submitterName: 'Priya Sharma', submitterType: 'customer', subject: 'Subscription Pause Request', description: 'Please pause my subscription from next Monday for 1 week.', submittedDate: '2024-07-29T11:00:00Z', status: 'open' },
];


export default function SupportTicketsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [submitterTypeFilter, setSubmitterTypeFilter] = useState('all');
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);
  const [replyingTicket, setReplyingTicket] = useState<SupportTicket | null>(null);

  // In a real app, fetch data using a hook like useFirestoreQuery
  const tickets = DUMMY_TICKETS;

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch =
        ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesSubmitter = submitterTypeFilter === 'all' || ticket.submitterType === submitterTypeFilter;
      return matchesSearch && matchesStatus && matchesSubmitter;
    });
  }, [tickets, searchTerm, statusFilter, submitterTypeFilter]);


   const getStatusBadgeVariant = (status: SupportTicket['status']): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
        case 'open':
          return 'destructive'; // Highlight open tickets
        case 'in_progress':
          return 'outline'; // Neutral outline
        case 'resolved':
          return 'default'; // Greenish/Completed
        case 'closed':
          return 'secondary'; // Grayed out
        default:
          return 'secondary';
      }
    };

    const handleUpdateStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
        // Placeholder for Firestore update logic
        console.log(`Updating ticket ${ticketId} to status ${newStatus}`);
        // Potentially close modals and show toast
        if (replyingTicket?.id === ticketId) setReplyingTicket(null);
     };

     const handleSendReply = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const reply = formData.get('reply') as string;
        const markResolved = formData.get('markResolved') === 'on'; // Check if checkbox was checked
        console.log(`Replying to ticket ${replyingTicket?.ticketId}:`, reply);
         // Add logic to save reply and potentially update status
        handleUpdateStatus(replyingTicket!.id, markResolved ? 'resolved' : 'in_progress'); // Example: Mark based on checkbox
        setReplyingTicket(null); // Close modal
        // Show toast notification
      };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Support Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer & Partner Support</CardTitle>
          <CardDescription>View and manage support requests and feedback.</CardDescription>
          <div className="mt-4 flex flex-col md:flex-row gap-4">
             <Input
               placeholder="Search by Ticket ID, Submitter, Subject..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="max-w-sm"
             />
              <Select value={submitterTypeFilter} onValueChange={setSubmitterTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Submitter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submitters</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </CardHeader>
        <CardContent>
           {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                   <Skeleton key={index} className="h-12 w-full rounded-md" />
                 ))}
              </div>
            ) : error ? (
               <p className="text-center text-destructive">
                  Error loading support tickets: {error}
               </p>
           ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Submitted By</TableHead>
                     <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {filteredTickets.length > 0 ? (
                      filteredTickets.map(ticket => (
                        <TableRow key={ticket.id} onClick={() => setViewTicket(ticket)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.ticketId}</TableCell>
                          <TableCell>{ticket.submitterName}</TableCell>
                          <TableCell className="capitalize">{ticket.submitterType}</TableCell>
                          <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                          <TableCell>{new Date(ticket.submittedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                             <Badge variant={getStatusBadgeVariant(ticket.status)} className="capitalize">
                                {ticket.status.replace('_', ' ')}
                             </Badge>
                           </TableCell>
                           <TableCell>{ticket.assignedAdminName || 'Unassigned'}</TableCell>
                           <TableCell className="text-right">
                             {/* Actions Button - Removed Dropdown, action on row click */}
                             <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                           </TableCell>
                         </TableRow>
                      ))
                    ) : (
                       <TableRow>
                         <TableCell colSpan={8} className="text-center">
                           No support tickets found matching your criteria.
                         </TableCell>
                       </TableRow>
                    )}
                 </TableBody>
              </Table>
           )}
        </CardContent>
      </Card>

        {/* View Ticket Dialog */}
        <Dialog open={!!viewTicket} onOpenChange={(open) => !open && setViewTicket(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ticket Details: {viewTicket?.ticketId}</DialogTitle>
              <DialogDescription>
                Submitted by {viewTicket?.submitterName} ({viewTicket?.submitterType})
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1">
                 <Label className="text-sm font-medium">Subject</Label>
                 <p className="text-sm">{viewTicket?.subject}</p>
              </div>
              <div className="space-y-1">
                 <Label className="text-sm font-medium">Description</Label>
                 <p className="text-sm whitespace-pre-wrap">{viewTicket?.description}</p>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Submitted:</span>
                 <span>{viewTicket ? new Date(viewTicket.submittedDate).toLocaleString() : ''}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Status:</span>
                 <Badge variant={getStatusBadgeVariant(viewTicket?.status!)} className="capitalize">
                    {viewTicket?.status.replace('_', ' ')}
                 </Badge>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned To:</span>
                  <span>{viewTicket?.assignedAdminName || 'Unassigned'}</span>
               </div>
               {viewTicket?.resolution && (
                 <div className="space-y-1 border-t pt-4 mt-4">
                    <Label className="text-sm font-medium">Resolution</Label>
                    <p className="text-sm whitespace-pre-wrap">{viewTicket.resolution}</p>
                 </div>
                )}
            </div>
            <DialogFooter className="sm:justify-between">
               {(viewTicket?.status === 'open' || viewTicket?.status === 'in_progress') && (
                  <Button type="button" onClick={() => { setReplyingTicket(viewTicket); setViewTicket(null); }}>
                     <MessageSquare className="mr-2 h-4 w-4" /> Reply/Resolve
                  </Button>
               )}
                {(viewTicket?.status === 'resolved') && (
                   <Button type="button" variant="outline" onClick={() => handleUpdateStatus(viewTicket!.id, 'closed')}>
                     <Archive className="mr-2 h-4 w-4" /> Archive/Close Ticket
                   </Button>
                )}
              <DialogClose asChild>
                <Button type="button" variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

         {/* Reply/Resolve Ticket Dialog */}
         <Dialog open={!!replyingTicket} onOpenChange={(open) => !open && setReplyingTicket(null)}>
           <DialogContent className="sm:max-w-lg">
             <DialogHeader>
               <DialogTitle>Reply to Ticket: {replyingTicket?.ticketId}</DialogTitle>
               <DialogDescription>
                 Respond to {replyingTicket?.submitterName} and update the ticket status.
               </DialogDescription>
             </DialogHeader>
             <form onSubmit={handleSendReply}>
               <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                     <Label className="text-sm font-medium">Original Message</Label>
                     <p className="text-sm border p-2 rounded-md bg-muted/50 max-h-24 overflow-y-auto">{replyingTicket?.description}</p>
                   </div>
                  <div className="space-y-1">
                    <Label htmlFor="reply" className="text-sm font-medium">Your Reply / Resolution</Label>
                    <Textarea id="reply" name="reply" required rows={5} placeholder="Enter your response here..." />
                  </div>
                   <div className="flex items-center space-x-2">
                       <input type="checkbox" id="markResolved" name="markResolved" className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"/>
                       <Label htmlFor="markResolved" className="text-sm">Mark as Resolved after reply?</Label>
                    </div>
               </div>
               <DialogFooter>
                 <DialogClose asChild>
                   <Button type="button" variant="outline">Cancel</Button>
                 </DialogClose>
                 <Button type="submit">Send Reply</Button>
               </DialogFooter>
             </form>
           </DialogContent>
         </Dialog>

    </div>
  );
}
