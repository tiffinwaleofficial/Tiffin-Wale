
'use client';
import React from 'react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarRail, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, LayoutDashboard, Users, Package, UtensilsCrossed, ReceiptText, BarChart3, Headset, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { auth } = getFirebase();
  const pathname = usePathname();

  // Authentication checks are bypassed in middleware for now.

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show a toast notification for logout failure
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // If using dummy login, assume user object might be null but we still show the layout
  const displayEmail = user?.email ?? 'admin@tiffinpro.com'; // Use a more relevant dummy email
  const displayInitial = displayEmail?.[0]?.toUpperCase() ?? 'A';

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
    // Assuming RootLayout handles ThemeProvider correctly.
    <SidebarProvider>
      <Sidebar>
         <SidebarHeader>
           <div className="flex items-center gap-3 p-3 border-b border-sidebar-border"> {/* Increased gap and padding */}
              <Avatar className="h-9 w-9"> {/* Slightly larger avatar */}
                 {/* Add Admin profile picture source */}
                 <AvatarImage src="" alt={displayInitial} />
                 <AvatarFallback>{displayInitial}</AvatarFallback>
              </Avatar>
             <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                 <span className="text-sm font-semibold text-sidebar-foreground">Admin User</span> {/* Bolder name */}
                  <span className="text-xs text-sidebar-foreground/70">{displayEmail}</span>
               </div>
            </div>
          </SidebarHeader>

        <SidebarContent className="p-2"> {/* Consistent padding */}
           <SidebarMenu>
             {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="h-9" // Slightly taller button
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
           </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border"> {/* mt-auto pushes footer down */}
           <SidebarMenu>
             <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start gap-2 h-9" onClick={toggleTheme}> {/* Adjusted height */}
                   {theme === 'light' ? <Moon /> : <Sun />}
                    <span className="group-data-[collapsible=icon]:hidden">
                       {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                </Button>
             </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/dashboard/settings" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Settings" isActive={pathname === '/dashboard/settings'} className="h-9"> {/* Adjusted height */}
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                  </SidebarMenuButton>
                </Link>
             </SidebarMenuItem>
             <SidebarMenuItem>
                 <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"> {/* Adjusted height and destructive colors */}
                   <LogOut />
                   <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                 </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
         </SidebarFooter>
          <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-svh"> {/* Ensure inset takes full height */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur px-4 md:hidden"> {/* Added backdrop blur */}
          <span className="text-lg font-semibold">Tiffin Admin Pro</span>
          <SidebarTrigger />
        </header>
         <main className="flex-1 overflow-y-auto">{children}</main> {/* Allow main content to scroll */}
      </SidebarInset>
    </SidebarProvider>
  );
}

    