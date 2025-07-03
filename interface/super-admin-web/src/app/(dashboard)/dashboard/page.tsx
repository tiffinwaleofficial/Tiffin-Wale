'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, ReceiptText, IndianRupee, TrendingDown, TrendingUp, UserPlus, Briefcase, Clock, Headset, LineChart as LineChartIcon } from 'lucide-react'; // Changed import name for LineChartIcon
import type { ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import api from '@/lib/apiClient';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const mapRevenueHistory = (raw: any[]) => raw.map((r: any, idx) => ({ month: months[idx % 12], revenue: r.revenue, orders: r.orders ?? 0, partners: r.partners ?? 0 }));

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
     label: "Revenue (₹)",
     color: "hsl(var(--chart-2))",
   },
  partners: {
     label: "Partners",
     color: "hsl(var(--chart-3))",
   },
   subscriptions: {
      label: "Subscriptions",
    },
    monthly: { label: "Monthly", color: "hsl(var(--chart-1))" },
    weekly: { label: "Weekly", color: "hsl(var(--chart-2))" },
    trial: { label: "Trial", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const latestActivities = [
    { id: 1, type: 'order', refId: 'ORD12345', description: "Tiffin dispatched for Order #ORD12345", time: "10 mins ago", icon: Package, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 2, type: 'partner', refId: 'p8', description: "New partner 'Mumbai Tiffins' onboarded", time: "1 hour ago", icon: Briefcase, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
    { id: 3, type: 'support', refId: 'TKT-006', description: "Support ticket #TKT-006 resolved", time: "2 hours ago", icon: Headset, iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400' },
    { id: 4, type: 'order', refId: 'ORD12344', description: "Tiffin delivered for Order #ORD12344", time: "3 hours ago", icon: Package, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 5, type: 'customer', refId: 'c4', description: "New customer 'Anita Desai' subscribed", time: "5 hours ago", icon: UserPlus, iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
    { id: 6, type: 'payout', refId: 'PAYOUT001', description: "Payout of ₹5,500 initiated for 'Anna Tiffins'", time: "6 hours ago", icon: IndianRupee, iconBg: 'bg-pink-100 dark:bg-pink-900/30', iconColor: 'text-pink-600 dark:text-pink-400' },
];


const getLinkForActivity = (type: string, refId: string): string | undefined => {
    switch (type) {
      case 'order': return `/dashboard/orders?search=${refId}`;
      case 'partner': return `/dashboard/partners?search=${refId}`;
      case 'customer': return `/dashboard/customers?search=${refId}`;
      case 'support': return `/dashboard/support?search=${refId}`;
      case 'payout': return `/dashboard/revenue?search=${refId}`;
      default: return undefined;
    }
};

const cardLinks: { [key: string]: string } = {
    'Daily Orders': '/dashboard/orders',
    'Active Subscriptions': '/dashboard/subscriptions',
    'Pending Orders': '/dashboard/orders?status=pending',
    'Cancelled Orders (Today)': '/dashboard/orders?status=cancelled&date=today',
    'Active Partners': '/dashboard/partners',
    'Total Revenue (Month)': '/dashboard/revenue',
    'New Customers (Month)': '/dashboard/customers',
    'Pending Payouts': '/dashboard/revenue?status=pending',
    // Links for charts
    'Orders & Revenue Trend': '/dashboard/revenue', // Link order chart to revenue page
    'Partner Growth': '/dashboard/partners', // Link partner chart to partners page
    'Subscription Distribution': '/dashboard/subscriptions', // Link pie chart to subscriptions page
};


export default function DashboardPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [partnerData, setPartnerData] = useState<any[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Earnings & orders trend
    api.get('/analytics/revenue-history?months=6').then((res) => {
      setChartData(mapRevenueHistory(res.data));
    });

    // Partner growth (reuse revenue history partners field or dedicated endpoint later)
    api.get('/analytics/revenue-history?months=6').then((res) => {
      setPartnerData(mapRevenueHistory(res.data).map((d) => ({ month: d.month, partners: d.partners ?? Math.floor(Math.random()*30)})));
    });

    // Subscriptions distribution
    api.get('/subscriptions/active').then((res) => {
      const counts = res.data.reduce((acc: any, s: any) => {
        acc[s.plan.type] = (acc[s.plan.type] || 0) + 1; return acc;
      }, {});
      setSubscriptionData([
        { name: 'Monthly', value: counts.monthly || 0, fill: 'hsl(var(--chart-1))' },
        { name: 'Weekly', value: counts.weekly || 0, fill: 'hsl(var(--chart-2))' },
        { name: 'Trial', value: counts.trial || 0, fill: 'hsl(var(--chart-3))' },
      ]);
    });

    // KPI metrics
    api.get('/analytics/earnings?period=month').then((res) => setMetrics(res.data));
  }, []);

  // Fallback if metrics not loaded
  const metricsCards = metrics ? [
      { title: 'Daily Orders', icon: Package, value: metrics.totalOrders || '0', trend: '', trendColor: 'text-muted-foreground' },
      { title: 'Total Revenue (Month)', icon: IndianRupee, value: `₹${metrics.totalRevenue}`, trend: '', trendColor: 'text-muted-foreground' },
  ] : [];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6"> {/* Added padding */}
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1> {/* Increased size */}

      {/* Metrics Cards - Made Clickable */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric) => (
           <Link key={metric.title} href={cardLinks[metric.title] || '/dashboard'} passHref>
             {/* Use Card as the clickable element */}
             <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-5 w-5 text-muted-foreground" /> {/* Slightly larger icon */}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div> {/* Larger value */}
                  <p className={cn("text-xs flex items-center pt-1", metric.trendColor || 'text-muted-foreground')}>
                      {metric.title !== 'Pending Payouts' && metric.trend.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1" /> : metric.title !== 'Pending Payouts' ? <TrendingDown className="h-4 w-4 mr-1" /> : null }
                      {metric.trend}
                  </p>
                </CardContent>
              </Card>
           </Link>
          ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {/* Orders & Revenue Trend Chart - Clickable */}
          <Link href={cardLinks['Orders & Revenue Trend'] || '/dashboard/revenue'} passHref className="lg:col-span-2 block">
             <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-lg h-full">
               <CardHeader>
                 <CardTitle>Orders &amp; Revenue Trend</CardTitle>
                 <CardDescription>Last 6 months overview. Click for details.</CardDescription>
               </CardHeader>
               <CardContent className="pl-2 pr-4 pb-4"> {/* Adjusted padding */}
                 <ChartContainer config={chartConfig} className="h-[300px] w-full"> 
                   {/* Direct element reference, not a fragment */}
                   <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                     <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                     <XAxis
                       dataKey="month"
                       tickLine={false}
                       tickMargin={10}
                       axisLine={false}
                       tickFormatter={(value) => value.slice(0, 3)}
                     />
                     <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickFormatter={(value) => `${value}`} name="Orders" axisLine={false} tickLine={false}/>
                     <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickFormatter={(value) => `₹${value / 1000}k`} name="Revenue" axisLine={false} tickLine={false}/>
                     <ChartTooltip
                       cursor={false}
                       content={<ChartTooltipContent indicator="dot" />}
                       formatter={(value, name) => name === 'revenue' ? `₹${(value as number).toLocaleString()}` : value}
                     />
                     <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} yAxisId="left" name={chartConfig.orders.label}/>
                     <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} yAxisId="right" name={chartConfig.revenue.label}/>
                   </BarChart>
                 </ChartContainer>
               </CardContent>
             </Card>
          </Link>

           {/* Partner Growth Chart - Clickable */}
           <Link href={cardLinks['Partner Growth'] || '/dashboard/partners'} passHref>
             <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-lg h-full">
               <CardHeader>
                 <CardTitle>Partner Growth</CardTitle>
                  <CardDescription>Active tiffin partners over time. Click for details.</CardDescription>
               </CardHeader>
               <CardContent className="pl-2 pr-4 pb-4"> {/* Adjusted padding */}
                 <ChartContainer config={chartConfig} className="h-[300px] w-full">
                   {/* Direct element reference, not a fragment */}
                   <LineChart accessibilityLayer data={partnerData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                     <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
                     <XAxis
                       dataKey="month"
                       tickLine={false}
                       tickMargin={10}
                       axisLine={false}
                       tickFormatter={(value) => value.slice(0, 3)}
                     />
                     <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                     <Line dataKey="partners" type="monotone" stroke="var(--color-partners)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--color-partners)', strokeWidth: 1 }} activeDot={{ r: 7 }} />
                   </LineChart>
                 </ChartContainer>
               </CardContent>
             </Card>
            </Link>

          {/* Subscription Distribution Chart - Clickable */}
          <Link href={cardLinks['Subscription Distribution'] || '/dashboard/subscriptions'} passHref>
              <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-lg h-full">
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                   <CardDescription>Breakdown of active plans. Click for details.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center pb-4">
                 <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                   {/* Direct element reference, not a fragment */}
                   <PieChart>
                     <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel hideIndicator />} />
                     <Pie 
                       data={subscriptionData} 
                       dataKey="value" 
                       nameKey="name" 
                       innerRadius={60} 
                       outerRadius={90} 
                       paddingAngle={3} 
                       labelLine={false}
                     >
                       {subscriptionData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} strokeWidth={1} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ChartContainer>
                </CardContent>
               </Card>
            </Link>

           {/* Latest Activities - Enhanced */}
           <Card className="lg:col-span-2">
             <CardHeader>
               <CardTitle>Latest Activities</CardTitle>
               <CardDescription>Recent system events and updates</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4"> {/* Use div with space-y */}
                    {latestActivities.map((activity) => {
                      const link = getLinkForActivity(activity.type, activity.refId);
                      const ActivityContent = () => (
                         <div className="flex items-start gap-3"> {/* Changed items-center to items-start */}
                             <div className={cn("flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 mt-1", activity.iconBg)}> {/* Added background */}
                                <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
                             </div>
                            <div className="flex flex-col flex-grow">
                              <span className="text-sm font-medium">{activity.description}</span>
                              <span className="text-xs text-muted-foreground">{activity.time}</span>
                            </div>
                          </div>
                       );

                      return (
                        <div key={activity.id} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0"> {/* Added border */}
                             {link ? (
                               <Link href={link} className="hover:bg-muted/50 block p-2 -m-2 rounded-md transition-colors"> {/* Make link block */}
                                  <ActivityContent />
                               </Link>
                             ) : (
                               <div className="p-2"> {/* Add padding for non-link items */}
                                   <ActivityContent />
                                </div>
                             )}
                           </div>
                       );
                    })}
                  </div>
             </CardContent>
           </Card>
       </div>
    </div>
  );
}

    