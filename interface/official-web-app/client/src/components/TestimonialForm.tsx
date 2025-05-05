import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import { useDropzone } from 'react-dropzone';
import { submitTestimonial, TestimonialFormData } from '@/lib/api';
import { CLOUDINARY } from "@/lib/env";

// Cloudinary upload helper
const uploadToCloudinary = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
  // Remove debug logging
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

export default function TestimonialForm({ className = '' }: { className?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [rating, setRating] = useState(5);
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
  
  const onDrop = async (acceptedFiles: File[]) => {
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
  };
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const testimonialData: TestimonialFormData = {
        name,
        email,
        profession,
        rating,
        testimonial,
      };
      
      if (uploadedImageUrl) {
        testimonialData.imageUrl = uploadedImageUrl;
      }
      
      const response = await submitTestimonial(testimonialData);
      
      // Check for success property instead of error
      if (response.success) {
        setSubmitted(true);
        // Reset form
        setName('');
        setEmail('');
        setProfession('');
        setTestimonial('');
        setRating(5);
        setUploadedImageUrl('');
      }
    } catch (error) {
      // Silently handle errors without showing them to the user
      console.error('Error submitting testimonial:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Share Your Experience</h2>
        <span className="text-xs text-gray-500">Fields marked with * are required</span>
      </div>
      <p className="text-gray-600 mb-6">
        We appreciate your feedback! Let us know about your experience with TiffinWale and help others discover our service.
      </p>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="testimonial-name" className="flex">
              Your Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="testimonial-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name" 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="testimonial-email" className="flex">
              Email Address <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="testimonial-email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="testimonial-profession" className="flex">
              Profession <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="testimonial-profession" 
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Software Engineer, Student, etc." 
              required
            />
          </div>
          
          <div>
            <Label className="flex">
              Rating <span className="text-red-500 ml-1">*</span>
            </Label>
            <Rating 
              value={rating} 
              onChange={setRating} 
              size="md" 
            />
          </div>
          
          <div>
            <Label htmlFor="testimonial-text" className="flex">
              Your Testimonial <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Textarea 
                id="testimonial-text" 
                value={testimonial}
                onChange={handleTestimonialChange}
                placeholder="Share your experience with TiffinWale..." 
                className="min-h-[120px] pr-16"
                required 
              />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500">
                {testimonialCharCount}/1000
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">Your Photo (Optional)</Label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
                ${uploadError ? 'border-red-400' : ''}
                ${uploadedImageUrl ? 'border-green-400' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {uploadedImageUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
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
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-green-600 text-xs">Image uploaded</span>
                </div>
              ) : isUploading ? (
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 text-primary mx-auto animate-pulse" />
                  <p className="text-sm">Uploading...</p>
                  <div className="w-full max-w-xs mx-auto">
                    <Progress value={uploadProgress} className="h-1" />
                    <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Drag and drop your photo, or click to select
                  </p>
                  {uploadError && (
                    <p className="text-red-500 text-xs mt-2">{uploadError}</p>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Maximum file size: 2MB</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Testimonial'}
          </Button>
        </form>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-700 text-sm mb-4">
            Your testimonial has been submitted successfully. We appreciate your feedback!
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSubmitted(false)}
          >
            Submit Another
          </Button>
        </div>
      )}
    </div>
  );
}