'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IndianRupee, TrendingUp, Users, ListFilter, CalendarDays, Download, Send, CircleDollarSign, AlertTriangle, Eye, FileSpreadsheet, FileText } from 'lucide-react'; // Added FileSpreadsheet, FileText
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, TooltipProps } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import type { DateRange } from "react-day-picker";
import type { ChartConfig } from "@/components/ui/chart";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { getFirebase } from '@/firebase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Added Dropdown imports

interface Payout {
    id: string;
    payoutId: string;
    partnerId: string;
    partnerName: string;
    amount: number;
    payoutDate: string; // YYYY-MM-DD
    status: 'pending' | 'paid' | 'failed';
    transactionId?: string;
    initiatedBy?: string;
    notes?: string;
}

const DUMMY_REVENUE_DATA = [
  { month: 'Jan', revenue: 45000, payouts: 31500, commission: 13500 },
  { month: 'Feb', revenue: 52000, payouts: 36400, commission: 15600 },
  { month: 'Mar', revenue: 61000, payouts: 42700, commission: 18300 },
  { month: 'Apr', revenue: 58000, payouts: 40600, commission: 17400 },
  { month: 'May', revenue: 65000, payouts: 45500, commission: 19500 },
  { month: 'Jun', revenue: 71000, payouts: 49700, commission: 21300 },
];

const DUMMY_PAYOUTS: Payout[] = [
    { id: 'pay1', payoutId: 'PAYOUT001', partnerId: 'p1', partnerName: 'Anna Tiffins', amount: 5500, payoutDate: '2024-07-15', status: 'paid', transactionId: 'txn_abc123', initiatedBy: 'Admin A' },
    { id: 'pay2', payoutId: 'PAYOUT002', partnerId: 'p2', partnerName: 'Roti Ghar', amount: 7200, payoutDate: '2024-07-15', status: 'paid', transactionId: 'txn_def456', initiatedBy: 'Admin A' },
    { id: 'pay3', payoutId: 'PAYOUT003', partnerId: 'p6', partnerName: 'Healthy Bites', amount: 8500, payoutDate: '2024-08-01', status: 'pending' },
    { id: 'pay4', payoutId: 'PAYOUT004', partnerId: 'p7', partnerName: 'Taste of India', amount: 6200, payoutDate: '2024-08-01', status: 'pending' },
    { id: 'pay5', payoutId: 'PAYOUT005', partnerId: 'p3', partnerName: 'Home Meals Co.', amount: 3000, payoutDate: '2024-06-15', status: 'failed', notes: 'Bank details invalid' },
    { id: 'pay6', payoutId: 'PAYOUT006', partnerId: 'p1', partnerName: 'Anna Tiffins', amount: 5800, payoutDate: '2024-08-15', status: 'pending' },
];

const chartConfig = {
    revenue: { label: "Total Revenue (₹)", color: "hsl(var(--chart-1))" },
    payouts: { label: "Partner Payouts (₹)", color: "hsl(var(--chart-2))" },
    commission: { label: "Platform Commission (₹)", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

// Placeholder for future Excel generation
const generateExcel = (data: Payout[]) => {
    console.log("Generating Excel for:", data);
    // Add library like 'xlsx' or 'exceljs' here
    alert("Excel generation not implemented yet.");
};

// Placeholder for future PDF generation
const generatePDF = (data: Payout[]) => {
    console.log("Generating PDF for:", data);
    // Add library like 'jspdf' and 'jspdf-autotable' here
    alert("PDF generation not implemented yet.");
};


const RevenueChartTooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {label}
              </span>
            </div>
            {payload.map((item) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                   <span
                     className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                     style={{ backgroundColor: item.color }}
                   />
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[item.dataKey as keyof typeof chartConfig]?.label || item.name}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  ₹{item.value?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }


export default function RevenuePayoutsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const { toast } = useToast();
  const { firestore } = getFirebase();

   // In a real app, fetch data based on filters
   const { data: payoutsData, loading: payoutsLoading, error: payoutsError } = useFirestoreQuery<Payout>(
      '/payouts', // Assuming '/payouts' collection
      {
          // Add constraints based on filters if needed later
          // constraints: [{ field: 'status', operator: '==', value: payoutStatusFilter === 'all' ? undefined : payoutStatusFilter }],
          orderByField: 'payoutDate',
          orderByDirection: 'desc',
       }
    );
   const payouts = payoutsData.length > 0 ? payoutsData : DUMMY_PAYOUTS; // Fallback

   const filteredPayouts = useMemo(() => {
      return payouts.filter(payout => {
          const matchesStatus = payoutStatusFilter === 'all' || payout.status === payoutStatusFilter;
           const matchesDate = !dateRange || !dateRange.from || (
                payout.payoutDate >= format(dateRange.from, 'yyyy-MM-dd') &&
                (!dateRange.to || payout.payoutDate <= format(dateRange.to, 'yyyy-MM-dd'))
             );
          return matchesStatus && matchesDate;
       });
    }, [payouts, payoutStatusFilter, dateRange]);


    const getPayoutStatusBadgeVariant = (status: Payout['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
          case 'paid':
            return 'default'; // Greenish
          case 'pending':
            return 'outline'; // Yellowish/Neutral outline
          case 'failed':
            return 'destructive'; // Red
          default:
            return 'secondary'; // Grayish
        }
      };

    const currentMonthRevenue = DUMMY_REVENUE_DATA[DUMMY_REVENUE_DATA.length - 1]?.revenue || 0;
    const currentMonthPayouts = DUMMY_REVENUE_DATA[DUMMY_REVENUE_DATA.length - 1]?.payouts || 0;
    const currentMonthCommission = DUMMY_REVENUE_DATA[DUMMY_REVENUE_DATA.length - 1]?.commission || 0;
    const partnersAwaitingPayout = payouts.filter(p => p.status === 'pending');
    const totalPendingPayoutAmount = partnersAwaitingPayout.reduce((sum, p) => sum + p.amount, 0);

    const handleExportExcel = () => {
        if (filteredPayouts.length === 0) {
           toast({ variant: "default", title: "No Data", description: "No payout data to export." });
           return;
         }
        generateExcel(filteredPayouts); // Call placeholder
        toast({ title: "Export Started", description: "Generating Excel file..." });
     };

     const handleExportPDF = () => {
        if (filteredPayouts.length === 0) {
          toast({ variant: "default", title: "No Data", description: "No payout data to export." });
          return;
        }
       generatePDF(filteredPayouts); // Call placeholder
       toast({ title: "Export Started", description: "Generating PDF file..." });
     };


     const handleMarkAsPaid = async (payoutId: string) => {
       if (!firestore) return;
       const payoutRef = doc(firestore, 'payouts', payoutId); // Assuming 'payouts' collection
       try {
         await updateDoc(payoutRef, { status: 'paid', /* Add transactionId or other relevant fields */ });
         toast({
           title: "Payout Marked as Paid",
           description: `Payout ${payoutId} status updated successfully.`,
         });
         setSelectedPayout(null); // Close the dialog
       } catch (err) {
         console.error("Error marking payout as paid:", err);
         toast({
           variant: "destructive",
           title: "Update Failed",
           description: "Could not mark payout as paid.",
         });
       }
     };

     const handleRetryPayout = (payoutId: string) => {
         // Placeholder for retry logic (e.g., API call to payment gateway)
         console.log(`Retrying payout ${payoutId}...`);
         toast({
           title: "Retry Initiated",
           description: `Payout ${payoutId} retry process started (placeholder).`,
         });
         setSelectedPayout(null); // Close the dialog
      };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Revenue &amp; Payouts</h1>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (This Month)</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{currentMonthRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground text-green-600">+9.2% vs last month</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Payouts (This Month)</CardTitle>
               <IndianRupee className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">₹{currentMonthPayouts.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground text-green-600">+14.3% vs last month</p>
             </CardContent>
           </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Commission (This Month)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{currentMonthCommission.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">Projected estimate</p>
              </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Partners Awaiting Payout</CardTitle>
                 <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{partnersAwaitingPayout.length}</div>
                 <p className="text-xs text-muted-foreground">Totaling ₹{totalPendingPayoutAmount.toLocaleString()}</p>
               </CardContent>
             </Card>
       </div>


       {/* Revenue Chart - Clickable */}
        <Link href="/dashboard/revenue/details" passHref> {/* Link to a potential detailed revenue page */}
           <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-md">
             <CardHeader>
               <CardTitle>Monthly Financial Overview</CardTitle>
               <CardDescription>Revenue, payouts, and commission over the last 6 months. Click for details.</CardDescription>
             </CardHeader>
             <CardContent className="pl-2">
               <ChartContainer config={chartConfig} className="h-[300px] w-full">
                   <AreaChart
                      accessibilityLayer
                      data={DUMMY_REVENUE_DATA}
                      margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
                   >
                     <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                     <XAxis
                       dataKey="month"
                       tickLine={false}
                       axisLine={false}
                       tickMargin={8}
                     />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                     <ChartTooltip cursor={false} content={<RevenueChartTooltipContent />} />
                      <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="fillPayouts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                         </linearGradient>
                          <linearGradient id="fillCommission" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                          </linearGradient>
                       </defs>
                     <Area
                        dataKey="revenue"
                        type="natural"
                        fill="url(#fillRevenue)"
                        fillOpacity={0.4}
                        stroke="hsl(var(--chart-1))"
                        stackId="a"
                        name={chartConfig.revenue.label}
                      />
                      <Area
                         dataKey="payouts"
                         type="natural"
                         fill="url(#fillPayouts)"
                         fillOpacity={0.4}
                         stroke="hsl(var(--chart-2))"
                         stackId="b"
                         name={chartConfig.payouts.label}
                       />
                        <Area
                           dataKey="commission"
                           type="natural"
                           fill="url(#fillCommission)"
                           fillOpacity={0.3}
                           stroke="hsl(var(--chart-3))"
                           stackId="c"
                            name={chartConfig.commission.label}
                         />
                   </AreaChart>
                 </ChartContainer>
             </CardContent>
           </Card>
        </Link>


      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <CardTitle>Payout Management</CardTitle>
                 <CardDescription>Review and process partner payouts.</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                 <DatePicker date={dateRange} onDateChange={setDateRange} className="w-full md:w-auto"/>
                  <Select value={payoutStatusFilter} onValueChange={setPayoutStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Export Button Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" /> Export Data
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleExportExcel}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export as Excel (XLSX)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportPDF}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
               </div>
           </div>
        </CardHeader>
        <CardContent>
          {payoutsLoading ? (
             <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                 ))}
             </div>
           ) : payoutsError ? (
              <p className="text-center text-destructive">
                 Error loading payouts: {payoutsError.message}
               </p>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID / Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.length > 0 ? (
                   filteredPayouts.map(payout => (
                     <TableRow key={payout.id} onClick={() => setSelectedPayout(payout)} className="cursor-pointer hover:bg-muted/50">
                       <TableCell className="font-medium">{payout.payoutId}</TableCell>
                       <TableCell>{payout.partnerName}</TableCell>
                       <TableCell>₹{payout.amount.toFixed(2)}</TableCell>
                       <TableCell>{payout.payoutDate}</TableCell>
                       <TableCell>
                         <Badge variant={getPayoutStatusBadgeVariant(payout.status)} className="capitalize">
                           {payout.status}
                         </Badge>
                       </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {payout.transactionId || payout.notes || 'N/A'}
                        </TableCell>
                       <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                             <Eye className="h-4 w-4" />
                             <span className="sr-only">View Details</span>
                           </Button>
                       </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={7} className="text-center py-6">
                       No payouts found for the selected criteria.
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
          )}
        </CardContent>
      </Card>

       {/* View Payout Details Dialog */}
       <Dialog open={!!selectedPayout} onOpenChange={(open) => !open && setSelectedPayout(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payout Details: {selectedPayout?.payoutId}</DialogTitle>
              <DialogDescription>
                Information for payout to {selectedPayout?.partnerName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4 text-sm">
               <div className="flex justify-between">
                  <span className="text-muted-foreground">Partner:</span>
                  <Link href={`/dashboard/partners/${selectedPayout?.partnerId}`} className="text-primary hover:underline">
                      {selectedPayout?.partnerName} ({selectedPayout?.partnerId})
                  </Link>
                </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Amount:</span>
                 <span className="font-semibold">₹{selectedPayout?.amount.toFixed(2)}</span>
               </div>
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Payout Date:</span>
                   <span>{selectedPayout?.payoutDate}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={getPayoutStatusBadgeVariant(selectedPayout?.status!)} className="capitalize">
                       {selectedPayout?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Transaction ID:</span>
                     <span>{selectedPayout?.transactionId || 'N/A'}</span>
                   </div>
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">Initiated By:</span>
                       <span>{selectedPayout?.initiatedBy || 'System'}</span>
                    </div>
                    {selectedPayout?.notes && (
                       <div className="space-y-1 border-t pt-3 mt-3">
                         <Label className="text-sm font-medium">Notes</Label>
                         <p className="text-sm text-muted-foreground">{selectedPayout.notes}</p>
                       </div>
                    )}
            </div>
            <DialogFooter className="sm:justify-between">
              {selectedPayout?.status === 'pending' && (
                  <Button variant="default" onClick={() => handleMarkAsPaid(selectedPayout!.id)}>
                     <Send className="mr-2 h-4 w-4" /> Mark as Paid
                  </Button>
               )}
               {selectedPayout?.status === 'failed' && (
                  <Button variant="outline" onClick={() => handleRetryPayout(selectedPayout!.id)}>
                    <AlertTriangle className="mr-2 h-4 w-4" /> Retry Payout
                  </Button>
                )}
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Close</Button>
                </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  );
}
