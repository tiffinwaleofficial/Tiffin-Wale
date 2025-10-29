
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { sendPasswordResetEmail } from 'firebase/auth'; // Real auth disabled for dummy implementation
// import { getFirebase } from '@/firebase'; // Real auth disabled for dummy implementation
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Utensils, ArrowLeft } from 'lucide-react'; // Icons
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // const { auth } = getFirebase(); // Real auth disabled for dummy implementation

  const form = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    setIsLoading(true);
    // --- Dummy Forgot Password Logic ---
    console.log('Dummy password reset requested for:', data.email);
    toast({
      title: 'Password Reset Link Sent (Dummy)',
      description: `If an account exists for ${data.email}, a reset link has been sent.`,
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // --- End Dummy Forgot Password Logic ---

    /* --- Real Forgot Password Logic (Commented Out) ---
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: 'Password Reset Link Sent',
        description: `If an account exists for ${data.email}, a reset link has been sent.`,
      });
      // Optionally redirect or clear form
      // form.reset();
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: error.message || 'Could not send reset link. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
       <div className="relative group"> {/* Wrapper for gradient border */}
        <Card className="w-full max-w-md overflow-hidden animated-gradient-border relative z-10"> {/* Gradient border */}
          <CardHeader className="space-y-1 text-center bg-muted/30 dark:bg-muted/10 py-8">
             <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-3 mx-auto">
                 <Utensils className="h-8 w-8" />
             </div>
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
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
                <Button type="submit" className="w-full !mt-6" disabled={isLoading} size="lg">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
             <Link href="/login" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Login
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
