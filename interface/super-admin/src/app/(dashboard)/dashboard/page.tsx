'use client';
import React, { useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { 
  superAdminControllerGetDashboardStatsOptions,
  superAdminControllerGetDashboardActivitiesOptions,
  superAdminControllerGetRevenueHistoryOptions,
  superAdminControllerGetActiveSubscriptionsOptions
} from '@tiffinwale/api';

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
  // Use auto-generated React Query hooks
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
    superAdminControllerGetDashboardStatsOptions()
  );
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery(
    superAdminControllerGetDashboardActivitiesOptions({ query: { limit: 6 } })
  );
  const { data: revenueHistoryData, isLoading: revenueLoading } = useQuery(
    superAdminControllerGetRevenueHistoryOptions({ query: { months: 6 } })
  );
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery(
    superAdminControllerGetActiveSubscriptionsOptions()
  );

  // Compute loading and error states
  const loading = statsLoading || activitiesLoading || revenueLoading || subscriptionsLoading;
  const error = statsError ? (statsError as any)?.message || 'Failed to load dashboard data' : null;

  // Compute derived data using useMemo
  const chartData = useMemo(() => {
    if (!revenueHistoryData) return [];
    return mapRevenueHistory(revenueHistoryData as any);
  }, [revenueHistoryData]);

  const partnerData = useMemo(() => {
    if (!revenueHistoryData) return [];
    const formattedPartnerData = mapRevenueHistory(revenueHistoryData as any);
    return formattedPartnerData.map((d) => ({ 
      month: d.month, 
      partners: d.partners || 0 
    }));
  }, [revenueHistoryData]);

  const subscriptionData = useMemo(() => {
    if (!subscriptionsData) return [];
    
    const subscriptionCounts = (subscriptionsData as any[]).reduce((acc: any, s: any) => {
      const planType = s.plan?.type || s.planId?.type || 'monthly';
      acc[planType] = (acc[planType] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Monthly', value: subscriptionCounts.monthly || 0, fill: 'hsl(var(--chart-1))' },
      { name: 'Weekly', value: subscriptionCounts.weekly || 0, fill: 'hsl(var(--chart-2))' },
      { name: 'Trial', value: subscriptionCounts.trial || 0, fill: 'hsl(var(--chart-3))' },
    ];
  }, [subscriptionsData]);

  // Use activities data from the hook
  const activities = (activitiesData as any)?.activities || [];

  // Create metrics cards from real data
  const metricsCards = useMemo(() => {
    if (!statsData) return [];
    
    const metrics = statsData as any;
    return [
    { 
      title: 'Daily Orders', 
      icon: Package, 
      value: metrics.ordersToday?.toString() || '0', 
      trend: metrics.growthMetrics?.orderGrowth ? `+${metrics.growthMetrics.orderGrowth}%` : '', 
      trendColor: 'text-green-600' 
    },
    { 
      title: 'Total Revenue (Month)', 
      icon: IndianRupee, 
      value: `₹${(metrics.revenueThisMonth || 0).toLocaleString()}`, 
      trend: metrics.growthMetrics?.revenueGrowth ? `${metrics.growthMetrics.revenueGrowth > 0 ? '+' : ''}${metrics.growthMetrics.revenueGrowth}%` : '', 
      trendColor: metrics.growthMetrics?.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600' 
    },
    { 
      title: 'Active Partners', 
      icon: Briefcase, 
      value: metrics.totalPartners?.toString() || '0', 
      trend: metrics.growthMetrics?.partnerGrowth ? `+${metrics.growthMetrics.partnerGrowth}%` : '', 
      trendColor: 'text-green-600' 
    },
    { 
      title: 'Pending Orders', 
      icon: Clock, 
      value: metrics.pendingOrders?.toString() || '0', 
      trend: '', 
      trendColor: 'text-muted-foreground' 
    },
  ];
  }, [statsData]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 p-4 md:p-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center py-8">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 p-4 md:p-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Failed to load dashboard</p>
              <p className="text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Metrics Cards - Made Clickable */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric) => (
           <Link key={metric.title} href={cardLinks[metric.title] || '/dashboard'} passHref>
             <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <p className={cn("text-xs flex items-center pt-1", metric.trendColor || 'text-muted-foreground')}>
                      {metric.trend && metric.trend.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1" /> : metric.trend && metric.trend.startsWith('-') ? <TrendingDown className="h-4 w-4 mr-1" /> : null }
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
               <CardContent className="pl-2 pr-4 pb-4">
                 <ChartContainer config={chartConfig} className="h-[300px] w-full"> 
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
               <CardContent className="pl-2 pr-4 pb-4">
                 <ChartContainer config={chartConfig} className="h-[300px] w-full">
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

           {/* Latest Activities - Enhanced with Real Data */}
           <Card className="lg:col-span-2">
             <CardHeader>
               <CardTitle>Latest Activities</CardTitle>
               <CardDescription>Recent system events and updates</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent activities
                      </div>
                    ) : (
                      activities.map((activity: any) => {
                        const link = getLinkForActivity(activity.type, activity.refId);
                        const getActivityIcon = (type: string) => {
                          switch (type) {
                            case 'order': return Package;
                            case 'partner': return Briefcase;
                            case 'customer': return UserPlus;
                            case 'support': return Headset;
                            case 'payout': return IndianRupee;
                            default: return Package;
                          }
                        };
                        
                        const getActivityColors = (type: string) => {
                          switch (type) {
                            case 'order': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
                            case 'partner': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' };
                            case 'customer': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' };
                            case 'support': return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' };
                            case 'payout': return { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' };
                            default: return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600 dark:text-gray-400' };
                          }
                        };

                        const ActivityIcon = getActivityIcon(activity.type);
                        const colors = getActivityColors(activity.type);

                        const ActivityContent = () => (
                           <div className="flex items-start gap-3">
                               <div className={cn("flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 mt-1", colors.bg)}>
                                  <ActivityIcon className={cn("h-4 w-4", colors.text)} />
                               </div>
                              <div className="flex flex-col flex-grow">
                                <span className="text-sm font-medium">{activity.description}</span>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                              </div>
                            </div>
                         );

                        return (
                          <div key={activity.id} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                               {link ? (
                                 <Link href={link} className="hover:bg-muted/50 block p-2 -m-2 rounded-md transition-colors">
                                    <ActivityContent />
                                 </Link>
                               ) : (
                                 <div className="p-2">
                                     <ActivityContent />
                                  </div>
                               )}
                             </div>
                         );
                      })
                    )}
                  </div>
             </CardContent>
           </Card>
       </div>
    </div>
  );
}

    