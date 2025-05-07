
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { signInWithEmailAndPassword } from 'firebase/auth'; // Real auth disabled for dummy login
// import { getFirebase } from '@/firebase'; // Real auth disabled for dummy login
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Utensils, ArrowLeft } from 'lucide-react'; // Icon for branding
import Link from 'next/link'; // Import Link


const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }), // Min 1 for dummy login
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // const { auth } = getFirebase(); // Real auth disabled for dummy login

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    // --- Dummy Login Logic ---
    console.log('Dummy login submitted with data:', data);
    toast({
      title: 'Dummy Login',
      description: 'Bypassing authentication, redirecting to dashboard...',
    });

    // Use setTimeout to ensure the state update happens after the current render cycle
    // and allow navigation to potentially start. Re-enable button shortly after.
    setTimeout(() => {
        router.push('/dashboard');
        // Re-enable button after a short delay, assuming navigation might take time or fail silently
        // setTimeout(() => setIsLoading(false), 500); // Kept commented as per previous state. If re-enabling is desired, uncomment.
    }, 100); // Small delay to show loading state
    // --- End Dummy Login Logic ---

    /* --- Real Login Logic (Commented Out) ---
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
       setIsLoading(false); // Only set back on error in real flow
    }
    // No finally block needed here for real logic, loading stops on success navigation or error
    */
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="relative group"> {/* Added relative positioning and group for ::before */}
        <Card className="w-full max-w-md overflow-hidden animated-gradient-border relative z-10"> {/* Added relative z-10 */}
          <CardHeader className="space-y-1 text-center bg-muted/30 dark:bg-muted/10 py-8">
             <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-3 mx-auto">
                 <Utensils className="h-8 w-8" />
             </div>
            <CardTitle className="text-2xl font-bold">Tiffin Admin Pro</CardTitle>
            <CardDescription>Super Admin Login</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6"> {/* Increased padding and spacing */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {/* Updated: Added justify-between for spacing */}
                 <div className="flex items-center justify-between pt-2">
                   <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 mr-6"> {/* Added mr-6 */}
                         <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            aria-label="Remember Me"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">Remember Me</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                      Forgot Password?
                  </Link>
                </div>
                <Button type="submit" className="w-full !mt-6" disabled={isLoading} size="lg"> {/* Increased top margin and size */}
                  {isLoading ? 'Logging in...' : 'Login as Admin'}
                </Button>
              </form>
            </Form>
          </CardContent>
           <CardFooter className="text-center text-xs text-muted-foreground pb-6">
              &copy; {new Date().getFullYear()} Tiffin Wale. All rights reserved.
           </CardFooter>
        </Card>
      </div>
    </div>
  );
}

