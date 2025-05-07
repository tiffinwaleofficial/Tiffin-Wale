'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Phone, MessageSquare, IndianRupee, ListOrdered } from 'lucide-react';
import { useFirestoreDoc } from '@/hooks/use-firestore-doc'; // Assuming this hook exists/will be created
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Label } from '@/components/ui/label'; // Added missing import

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
  address?: string; // Optional address field
  description?: string; // Optional description
  profileImageUrl?: string; // Optional image URL
}

// Dummy Data for fallback or initial state
const DUMMY_PARTNER: Partner = {
    id: 'p1', name: 'Anna Tiffins', contactPerson: 'Anna Sharma', mobile: '9876543210', city: 'Mumbai', registeredDate: '2023-01-15', status: 'active', totalRevenue: 55000, commissionRate: 10, address: '123 Food Street, Andheri West', description: 'Serving authentic North Indian thalis since 2020.', profileImageUrl: 'https://picsum.photos/200/200?random=1'
 };


export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.partnerId as string;

  const { data: partner, loading, error } = useFirestoreDoc<Partner>(`/partners/${partnerId}`);

   // Use dummy data if loading fails or no data found for now
   const displayPartner = !loading && !error && partner ? partner : (!loading && (error || !partner) ? DUMMY_PARTNER : null);


  const getStatusBadgeVariant = (status?: Partner['status']): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
       case 'active': return 'default';
       case 'inactive': return 'secondary';
       case 'pending_approval': return 'outline';
       case 'banned': return 'destructive';
       default: return 'secondary';
     }
   };

  if (loading) {
    return (
      <div className="space-y-6">
         <Button variant="outline" size="sm" onClick={() => router.back()}>
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Partners
         </Button>
         <Skeleton className="h-10 w-1/2" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
                <CardHeader className="items-center">
                     <Skeleton className="h-24 w-24 rounded-full mb-4" />
                      <Skeleton className="h-6 w-3/4" />
                       <Skeleton className="h-4 w-20" />
                 </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                 </CardContent>
                 <CardFooter className="flex justify-center gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-20" />
                  </CardFooter>
            </Card>
            <div className="md:col-span-2 space-y-6">
               <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
               <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
            </div>
         </div>
       </div>
    );
  }

  if (error) {
    return (
      <div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Partners
        </Button>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not load partner details. Please try again later.</p>
            <p className="text-xs text-muted-foreground mt-2">Error: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

   if (!displayPartner) {
     return (
       <div>
         <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Partners
         </Button>
         <p>Partner not found.</p>
       </div>
     );
   }


  return (
    <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Partners
        </Button>

       <h1 className="text-3xl font-semibold">{displayPartner.name} - Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column: Profile Summary */}
         <Card className="lg:col-span-1 h-fit">
           <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                 <AvatarImage src={displayPartner.profileImageUrl} alt={displayPartner.name} data-ai-hint="restaurant logo" />
                  <AvatarFallback>{displayPartner.name.charAt(0)}</AvatarFallback>
               </Avatar>
              <CardTitle>{displayPartner.name}</CardTitle>
               <Badge variant={getStatusBadgeVariant(displayPartner.status)} className="capitalize mt-1">
                  {displayPartner.status.replace('_', ' ')}
               </Badge>
            </CardHeader>
           <CardContent className="text-sm space-y-3">
             <div className="flex justify-between">
                <span className="text-muted-foreground">Contact Person:</span>
                <span>{displayPartner.contactPerson}</span>
              </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Mobile:</span>
                 <a href={`tel:${displayPartner.mobile}`} className="text-primary hover:underline">{displayPartner.mobile}</a>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">City:</span>
                 <span>{displayPartner.city}</span>
               </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered:</span>
                  <span>{new Date(displayPartner.registeredDate).toLocaleDateString()}</span>
                </div>
                 <Separator className="my-3" />
                 {displayPartner.address && (
                   <div className="space-y-1">
                     <Label className="text-xs text-muted-foreground">Address</Label>
                     <p>{displayPartner.address}</p>
                   </div>
                  )}
                  {displayPartner.description && (
                    <div className="space-y-1">
                       <Label className="text-xs text-muted-foreground">Description</Label>
                       <p className="text-muted-foreground">{displayPartner.description}</p>
                    </div>
                   )}
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
               <Button size="sm" variant="outline" onClick={() => alert(`Editing ${displayPartner.name}...`)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
               <Button size="sm" variant="outline" onClick={() => alert(`Contacting ${displayPartner.name}...`)}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact
               </Button>
             </CardFooter>
         </Card>

         {/* Right Column: Financials, Orders etc. */}
         <div className="lg:col-span-2 space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>Financial Summary</CardTitle>
                 <CardDescription>Overview of revenue and commissions.</CardDescription>
               </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Total Revenue (All Time)</Label>
                    <p className="text-lg font-semibold">₹{displayPartner.totalRevenue?.toLocaleString() ?? 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Commission Rate</Label>
                    <p className="text-lg font-semibold">{displayPartner.commissionRate?.toFixed(1) ?? 'N/A'}%</p>
                  </div>
                   <div className="space-y-1">
                     <Label className="text-xs text-muted-foreground">Next Payout Amount (Est.)</Label>
                     <p className="text-lg font-semibold">₹{((displayPartner.totalRevenue ?? 0) * (1 - (displayPartner.commissionRate ?? 0)/100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p> {/* Corrected Calculation */}
                   </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Payout Status</Label>
                      <Badge variant="outline">Upcoming</Badge> {/* Placeholder */}
                    </div>
               </CardContent>
               <CardFooter>
                   <Link href={`/dashboard/revenue?partner=${displayPartner.id}`} passHref> {/* Updated link */}
                        <Button variant="link" size="sm">View Payout History</Button>
                   </Link>
                </CardFooter>
           </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Last few orders fulfilled by this partner.</CardDescription>
               </CardHeader>
               <CardContent>
                  {/* Placeholder for recent orders table/list */}
                  <p className="text-sm text-muted-foreground">Recent order data would be displayed here.</p>
                  <p className="text-xs mt-2"> (Feature under development - requires order data fetching based on partner ID)</p>
                </CardContent>
                <CardFooter>
                   <Link href={`/dashboard/orders?partner=${displayPartner.id}`} passHref>
                        <Button variant="link" size="sm">View All Orders</Button>
                   </Link>
                 </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                   <CardTitle>Menu Management</CardTitle>
                   <CardDescription>Current and upcoming menus.</CardDescription>
                 </CardHeader>
                <CardContent>
                   {/* Placeholder for menu information */}
                   <p className="text-sm text-muted-foreground">Current menu information would be displayed here.</p>
                   <p className="text-xs mt-2"> (Feature under development - requires menu data fetching based on partner ID)</p>
                 </CardContent>
                 <CardFooter>
                    <Link href={`/dashboard/menu?partner=${displayPartner.id}`} passHref>
                        <Button variant="link" size="sm">Manage Menus</Button>
                    </Link>
                  </CardFooter>
             </Card>

          </div>
       </div>
     </div>
  );
}
