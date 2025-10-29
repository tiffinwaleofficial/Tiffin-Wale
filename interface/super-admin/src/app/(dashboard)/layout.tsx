
'use client';
import React from 'react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarRail, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, LayoutDashboard, Users, Package, UtensilsCrossed, ReceiptText, BarChart3, Headset, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import AdminGuard from '@/components/AdminGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      logout();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred during logout.',
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const displayEmail = user?.email || '';
  const displayName = user?.profile?.firstName ? 
    `${user.profile.firstName} ${user.profile.lastName || ''}`.trim() : 
    'Admin User';
  const displayInitial = user?.profile?.firstName?.[0]?.toUpperCase() || 
                        user?.email[0]?.toUpperCase() || 'A';

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/partners', label: 'Manage Partners', icon: Users },
    { href: '/dashboard/customers', label: 'Manage Customers', icon: Users },
    { href: '/dashboard/orders', label: 'Manage Orders', icon: Package },
    { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: ReceiptText },
    { href: '/dashboard/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { href: '/dashboard/revenue', label: 'Revenue & Payouts', icon: BarChart3 },
    { href: '/dashboard/support', label: 'Support Tickets', icon: Headset },
   ];

  return (
    <AdminGuard requiredRole="admin">
      <SidebarProvider>
        <Sidebar>
           <SidebarHeader>
             <div className="flex items-center gap-3 p-3 border-b border-sidebar-border">
                <Avatar className="h-9 w-9">
                   <AvatarImage src="" alt={displayInitial} />
                   <AvatarFallback>{displayInitial}</AvatarFallback>
                </Avatar>
               <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                   <span className="text-sm font-semibold text-sidebar-foreground">{displayName}</span>
                    <span className="text-xs text-sidebar-foreground/70">{displayEmail}</span>
                 </div>
              </div>
            </SidebarHeader>

          <SidebarContent className="p-2">
             <SidebarMenu>
               {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        className="h-9"
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
             </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
             <SidebarMenu>
               <SidebarMenuItem>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9" onClick={toggleTheme}>
                     {theme === 'light' ? <Moon /> : <Sun />}
                      <span className="group-data-[collapsible=icon]:hidden">
                         {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                      </span>
                  </Button>
               </SidebarMenuItem>
               <SidebarMenuItem>
                  <Link href="/dashboard/settings" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="Settings" isActive={pathname === '/dashboard/settings'} className="h-9">
                      <Settings />
                      <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </SidebarMenuButton>
                  </Link>
               </SidebarMenuItem>
               <SidebarMenuItem>
                   <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="h-9 text-destructive hover:bg-destructive/10 hover:text-destructive">
                     <LogOut />
                     <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                   </SidebarMenuButton>
               </SidebarMenuItem>
             </SidebarMenu>
           </SidebarFooter>
            <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex flex-col min-h-svh">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur px-4 md:hidden">
            <span className="text-lg font-semibold">Tiffin Admin Pro</span>
            <SidebarTrigger />
          </header>
           <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}

    