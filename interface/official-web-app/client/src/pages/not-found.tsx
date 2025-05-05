import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 overflow-hidden">
        <div className="w-full h-40 bg-primary/10 flex items-center justify-center relative">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=300&q=80"
            alt="Food illustration"
            width={800}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-[-1]">
            <AlertCircle className="h-16 w-16 text-primary/50" />
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
            <p className="mt-3 text-gray-600">
              We couldn't find the page you're looking for.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <Link href="/">
            <Button className="w-full">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
