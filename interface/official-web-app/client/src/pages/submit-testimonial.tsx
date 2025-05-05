import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Upload, X } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState, useCallback, FormEvent, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { Rating } from "@/components/ui/rating";
import { submitTestimonial } from "@/lib/api";
import { CLOUDINARY } from "@/lib/env";

// Cloudinary upload helper function
const uploadToCloudinary = async (file: File, onProgress: (progress: number) => void) => {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // For unsigned uploads, we ONLY need the upload_preset (not the API key)
    formData.append('upload_preset', CLOUDINARY.UPLOAD_PRESET);
    
    // Build the Cloudinary URL with the correct cloud name
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY.CLOUD_NAME}/image/upload`;
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    
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
          reject(new Error('Failed to parse response'));
        }
      } else {
        let errorMsg = 'Upload failed';
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          errorMsg = errorResponse.error?.message || 'Upload failed';
        } catch (e) {
          // Parsing error, use default message
        }
        reject(new Error(errorMsg));
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };
    
    xhr.send(formData);
  });
};

export default function SubmitTestimonialPage() {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [duration, setDuration] = useState('Less than a month');
  const [testimonial, setTestimonial] = useState('');
  const [testimonialCharCount, setTestimonialCharCount] = useState(0);
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  // Only track character count, no validation
  useEffect(() => {
    setTestimonialCharCount(testimonial.length);
  }, [testimonial]);
  
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
  
  const handleTestimonialChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Only limit maximum length
    if (value.length <= 1000) {
      setTestimonial(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // HTML5 validation will handle required fields
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // Create testimonial data object with required fields
      const testimonialData: {
        name: string;
        email: string;
        profession?: string;
        rating: number;
        testimonial: string;
        imageUrl?: string;
      } = {
        name,
        email,
        profession,
        rating,
        testimonial,
      };
      
      // Only include imageUrl if one was successfully uploaded
      if (uploadedImageUrl) {
        testimonialData.imageUrl = uploadedImageUrl;
      }
      
      // Submit testimonial to the API
      console.log('Submitting testimonial data:', testimonialData);
      const response = await submitTestimonial(testimonialData);
      console.log('API response:', response);
      
      // Always set submitted to true for any successful API response
      // The API returned a response without throwing an error, consider it a success
      setSubmitted(true);
      // Reset form
      setName('');
      setEmail('');
      setProfession('');
      setTestimonial('');
      setRating(5);
      setUploadedImageUrl('');
    } catch (error: any) {
      console.error('Error submitting testimonial:', error);
      setSubmitError(
        error.message || 
        'Failed to submit testimonial. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="font-bold text-3xl text-center mb-2">Share Your TiffinWale Experience</h1>
            <p className="text-center text-muted-foreground mb-8">
              We appreciate your feedback! Let us know about your experience with TiffinWale and help others discover our service.
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-xl relative">
                <span className="text-xs text-gray-500 absolute top-4 right-4">Fields marked with * are required</span>
                
                {submitError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {submitError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex">
                    Your Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    type="text" 
                    id="name" 
                    placeholder="Enter your full name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex">
                    Email Address <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession" className="flex">
                    Profession <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    type="text" 
                    id="profession" 
                    placeholder="e.g. Software Engineer, Student, etc." 
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">How long have you been using TiffinWale?</Label>
                  <select 
                    id="duration" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="Less than a month">Less than a month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="More than a year">More than a year</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex">
                    Your Rating <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Rating 
                    value={rating} 
                    onChange={setRating} 
                    size="lg" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testimonial" className="flex">
                    Your Testimonial <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                  <Textarea 
                    id="testimonial" 
                    placeholder="Tell us about your experience with TiffinWale..."
                      className="min-h-[150px] pr-16"
                    required
                      value={testimonial}
                      onChange={handleTestimonialChange}
                  />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500">
                      {testimonialCharCount}/1000
                    </div>
                  </div>
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
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-base"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Testimonial'}
                </Button>
              </form>
            ) : (
              <div className="text-center p-8 bg-green-50 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h2>
                <p className="text-green-800 mb-2">
                  Your testimonial has been submitted successfully. We appreciate you taking the
                  time to share your experience.
                </p>
                <p className="text-green-800 mb-6">
                  After review, your testimonial may be featured on our website.
                </p>
                <Link href="/testimonials">
                  <Button variant="outline" className="px-6">
                    Back to Testimonials
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <MobileAppBanner />
      <Footer />
    </div>
  );
}