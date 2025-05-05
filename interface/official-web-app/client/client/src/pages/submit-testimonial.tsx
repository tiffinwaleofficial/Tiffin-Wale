import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Upload, X, StarIcon } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';

// Cloudinary upload helper function
const uploadToCloudinary = async (file: File, onProgress: (progress: number) => void) => {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Using default unsigned upload preset
    
    const xhr = new XMLHttpRequest();
    
    // Use the environment variables correctly
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload`);
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (error) {
          console.error('Failed to parse response:', error, xhr.responseText);
          reject(new Error('Failed to parse response'));
        }
      } else {
        console.error('Upload failed with status:', xhr.status, xhr.responseText);
        reject(new Error('Upload failed'));
      }
    };
    
    xhr.onerror = () => {
      console.error('Network error during upload');
      reject(new Error('Network error'));
    };
    
    xhr.send(formData);
  });
};

export default function SubmitTestimonialPage() {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size exceeds 2MB limit');
      return;
    }
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      const imageUrl = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadedImageUrl(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send all data including the uploadedImageUrl to the server
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link href="/testimonials">
              <span className="text-gray-500 hover:text-primary cursor-pointer">Testimonials</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-medium">Submit Testimonial</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-bold text-3xl mb-6 text-center">Share Your TiffinWale Experience</h1>
            <p className="text-center text-muted-foreground mb-8">
              We appreciate your feedback! Let us know about your experience with TiffinWale and help others discover our service.
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-xl">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input type="text" id="name" placeholder="Enter your full name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" placeholder="Enter your email address" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input type="text" id="profession" placeholder="e.g. Software Engineer, Student, etc." required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">How long have you been using TiffinWale?</Label>
                  <select id="duration" className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="Less than a month">Less than a month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="More than a year">More than a year</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <StarIcon 
                          className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testimonial">Your Testimonial</Label>
                  <Textarea 
                    id="testimonial" 
                    placeholder="Tell us about your experience with TiffinWale..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photo" className="block">Your Photo (Optional)</Label>
                  
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
                      ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
                      ${uploadError ? 'border-red-400' : ''}
                      ${uploadedImageUrl ? 'border-green-400' : ''}
                    `}
                  >
                    <input {...getInputProps()} />
                    
                    {uploadedImageUrl ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden">
                          <img 
                            src={uploadedImageUrl} 
                            alt="Uploaded" 
                            className="w-full h-full object-cover" 
                          />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImageUrl('');
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-green-600 text-sm">Image uploaded successfully</span>
                      </div>
                    ) : isUploading ? (
                      <div className="text-center space-y-4">
                        <Upload className="h-10 w-10 text-primary mx-auto animate-pulse" />
                        <p>Uploading image...</p>
                        <div className="w-full max-w-xs mx-auto">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-500">
                          Drag and drop your image here, or click to select
                        </p>
                        {uploadError && (
                          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">Maximum file size: 2MB. Recommended dimensions: 200x200px.</p>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full">Submit Testimonial</Button>
                </div>
              </form>
            ) : (
              <div className="bg-green-50 p-8 rounded-xl text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="font-bold text-2xl text-green-800">Thank You!</h2>
                <p className="text-green-700">
                  Your testimonial has been submitted successfully. We appreciate you taking the time to share your experience.
                </p>
                <p className="text-green-600">
                  After review, your testimonial may be featured on our website.
                </p>
                <div className="pt-4">
                  <Link href="/testimonials">
                    <Button variant="outline">Back to Testimonials</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}