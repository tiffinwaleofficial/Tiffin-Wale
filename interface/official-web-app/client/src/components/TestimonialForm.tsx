import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rating } from '@/components/ui/rating';
import { FileUploadZone, UploadedFile } from '@/components/ui/file-upload-zone';
import { ImageGallery, GalleryImage } from '@/components/ui/image-gallery';
import { UploadType } from '@/services/cloudinaryService';
import { submitTestimonial, TestimonialFormData } from '@/lib/api';

// No longer needed - using enhanced CloudinaryService

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
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Track character count
  useEffect(() => {
    setTestimonialCharCount(testimonial.length);
  }, [testimonial]);

  // Handle file upload completion
  const handleUploadComplete = (files: UploadedFile[]) => {
    const successfulFiles = files.filter(f => f.uploadStatus === 'success' && f.cloudinaryUrl);
    const images: GalleryImage[] = successfulFiles.map(f => ({
      id: f.id,
      url: f.cloudinaryUrl!,
      publicId: f.publicId,
      alt: `Testimonial image - ${f.file.name}`,
      caption: f.file.name
    }));
    setGalleryImages(images);
  };

  // Handle file changes
  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  // Handle image deletion from gallery
  const handleImageDelete = (imageId: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    setUploadedFiles(prev => prev.filter(f => f.id !== imageId));
  };

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
      
      // Include all uploaded image URLs
      const imageUrls = galleryImages.map(img => img.url);
      if (imageUrls.length > 0) {
        testimonialData.imageUrl = imageUrls[0]; // For backward compatibility
        testimonialData.imageUrls = imageUrls; // New field for multiple images
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
        setUploadedFiles([]);
        setGalleryImages([]);
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
            <Label className="block mb-2">Your Photos (Optional)</Label>
            <FileUploadZone
              uploadType={UploadType.TESTIMONIAL_IMAGE}
              maxFiles={3}
              maxSize={5}
              acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              onUploadComplete={handleUploadComplete}
              onFilesChange={handleFilesChange}
              showPreviews={true}
              allowDelete={true}
              multiple={true}
            />
            
            {/* Display uploaded images in gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-4">
                <Label className="block mb-2">Uploaded Images</Label>
                <ImageGallery
                  images={galleryImages}
                  onDelete={handleImageDelete}
                  showFullscreen={true}
                  showDeleteButton={true}
                  columns={3}
                  aspectRatio="square"
                />
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              You can upload up to 3 images, maximum 5MB each. Supported formats: JPEG, PNG, WebP
            </p>
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