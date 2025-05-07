'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'; // Added FormDescription
import { useAuth } from '@/context/auth-provider';
import { updatePassword, type User } from 'firebase/auth'; // Assuming password update needed
import { getFirebase } from '@/firebase'; // Import getFirebase
import { Switch } from "@/components/ui/switch"
import { Copy, RotateCcw } from 'lucide-react'; // Added icons

const settingsSchema = z.object({
  adminName: z.string().min(1, 'Admin name is required'),
  adminEmail: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
    // Current password field removed for dummy implementation
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"], // path of error
});

const notificationSchema = z.object({
  newOrderEmails: z.boolean().default(true),
  partnerApprovalEmails: z.boolean().default(true),
  lowBalanceAlerts: z.boolean().default(false),
});

type SettingsFormInputs = z.infer<typeof settingsSchema>;
type PasswordFormInputs = z.infer<typeof passwordSchema>;
type NotificationFormInputs = z.infer<typeof notificationSchema>;

export default function SettingsPage() {
    const { user } = useAuth(); // Get current user if needed for pre-fill or auth actions
    const { auth } = getFirebase(); // Get auth instance
    const { toast } = useToast();
    const [isLoadingProfile, setIsLoadingProfile] = React.useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = React.useState(false);
    const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(false);

    const settingsForm = useForm<SettingsFormInputs>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
          adminName: user?.displayName || 'Admin User', // Pre-fill if available
          adminEmail: user?.email || 'admin@tiffinpro.com', // Pre-fill if available
        },
      });

      const passwordForm = useForm<PasswordFormInputs>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
          newPassword: '',
          confirmPassword: '',
        },
      });

      const notificationForm = useForm<NotificationFormInputs>({
          resolver: zodResolver(notificationSchema),
          defaultValues: {
              newOrderEmails: true,
              partnerApprovalEmails: true,
              lowBalanceAlerts: false,
          },
      });


      const onProfileSubmit: SubmitHandler<SettingsFormInputs> = async (data) => {
        setIsLoadingProfile(true);
        console.log('Updating profile settings (dummy):', data);
        // TODO: Implement actual profile update logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: 'Profile Updated',
          description: 'Admin profile information saved successfully.',
        });
        setIsLoadingProfile(false);
      };

      const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
        setIsLoadingPassword(true);
        console.log('Updating password (dummy):', data.newPassword);

        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to change your password.' });
            setIsLoadingPassword(false);
            return;
        }

        try {
            // await updatePassword(user, data.newPassword); // Real Firebase password update
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast({
                title: 'Password Updated',
                description: 'Your password has been changed successfully.',
            });
            passwordForm.reset({ newPassword: '', confirmPassword: '' }); // Clear form
        } catch (error: any) {
            console.error("Password update failed:", error);
            toast({
                variant: 'destructive',
                title: 'Password Update Failed',
                description: error.message || 'Could not update password.',
            });
        } finally {
            setIsLoadingPassword(false);
        }
    };

    const onNotificationSubmit: SubmitHandler<NotificationFormInputs> = async (data) => {
        setIsLoadingNotifications(true);
        console.log('Updating notification settings (dummy):', data);
        // TODO: Implement actual notification settings update logic
        await new Promise(resolve => setTimeout(resolve, 800));
        toast({
          title: 'Notifications Updated',
          description: 'Notification preferences saved successfully.',
        });
        setIsLoadingNotifications(false);
    };

     const handleCopyApiKey = () => {
        const apiKey = "DUMMY_API_KEY_123XYZ"; // Replace with actual key logic
        navigator.clipboard.writeText(apiKey);
        toast({ title: "API Key Copied", description: "Dummy API Key copied to clipboard." });
     }

     const handleRegenerateApiKey = () => {
         // Placeholder for regeneration logic
         toast({ title: "API Key Regenerated", description: "A new dummy API key has been generated (placeholder action)." });
      }


  return (
    <div className="flex flex-col gap-8"> {/* Increased gap */}
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Manage your admin account details.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                 control={settingsForm.control}
                 name="adminName"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Admin Name</FormLabel>
                     <FormControl>
                       <Input placeholder="Your Name" {...field} disabled={isLoadingProfile} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                  control={settingsForm.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                         <Input placeholder="your@email.com" {...field} readOnly disabled />
                       </FormControl>
                      <FormMessage />
                       <p className="text-xs text-muted-foreground pt-1">Email address cannot be changed here.</p>
                     </FormItem>
                  )}
                />
               <Button type="submit" disabled={isLoadingProfile}>
                  {isLoadingProfile ? 'Saving...' : 'Save Profile'}
                </Button>
            </form>
           </Form>
        </CardContent>
      </Card>

       {/* Password Settings */}
       <Card>
         <CardHeader>
           <CardTitle>Change Password</CardTitle>
           <CardDescription>Update your admin account password. Ensure you choose a strong password.</CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...passwordForm}>
               <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  {/* Current password often requires re-authentication flow, skipped in dummy */}
                  <FormField
                     control={passwordForm.control}
                     name="newPassword"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>New Password</FormLabel>
                         <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoadingPassword} />
                          </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                             <Input type="password" placeholder="••••••••" {...field} disabled={isLoadingPassword} />
                           </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <Button type="submit" disabled={isLoadingPassword}>
                     {isLoadingPassword ? 'Updating...' : 'Update Password'}
                   </Button>
                </form>
              </Form>
         </CardContent>
       </Card>


        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control which email notifications you receive.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationForm}>
               <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                   <FormField
                      control={notificationForm.control}
                      name="newOrderEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New Order Notifications</FormLabel>
                            <FormDescription>Receive an email for every new tiffin order placed.</FormDescription>
                          </div>
                           <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoadingNotifications} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={notificationForm.control}
                        name="partnerApprovalEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Partner Approval Requests</FormLabel>
                              <FormDescription>Get notified when a new partner requires approval.</FormDescription>
                            </div>
                             <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoadingNotifications} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                         control={notificationForm.control}
                         name="lowBalanceAlerts"
                         render={({ field }) => (
                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                             <div className="space-y-0.5">
                               <FormLabel className="text-base">Low Payout Balance Alerts</FormLabel>
                               <FormDescription>Receive alerts when partner payout balances are low.</FormDescription>
                             </div>
                              <FormControl>
                               <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoadingNotifications} />
                             </FormControl>
                           </FormItem>
                         )}
                       />
                    <Button type="submit" disabled={isLoadingNotifications}>
                      {isLoadingNotifications ? 'Saving...' : 'Save Notifications'}
                    </Button>
                 </form>
             </Form>
          </CardContent>
        </Card>

        {/* API Key Management Placeholder */}
         <Card>
           <CardHeader>
             <CardTitle>API Key Management</CardTitle>
             <CardDescription>Manage API keys for integrations (Placeholder).</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <span className="font-mono text-sm truncate">DUMMY_API_KEY_123XYZ...</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleCopyApiKey} title="Copy API Key">
                            <Copy className="h-4 w-4" />
                        </Button>
                         <Button variant="outline" size="icon" onClick={handleRegenerateApiKey} title="Regenerate API Key">
                            <RotateCcw className="h-4 w-4" />
                         </Button>
                     </div>
                 </div>
                 <p className="text-xs text-muted-foreground">
                      This is a placeholder. Actual API key management would involve server-side logic and secure storage. Do not expose real keys here.
                  </p>
            </CardContent>
             <CardFooter>
                <Button disabled>Generate New Key (Disabled)</Button>
             </CardFooter>
         </Card>


       {/* System Preferences Placeholder */}
       <Card>
         <CardHeader>
           <CardTitle>System Preferences</CardTitle>
           <CardDescription>Configure global system settings (Placeholder).</CardDescription>
         </CardHeader>
         <CardContent className="text-muted-foreground text-sm">
           System preferences configuration options (e.g., currency, timezone, default commission) would go here. This requires backend implementation.
         </CardContent>
       </Card>

    </div>
  );
}
