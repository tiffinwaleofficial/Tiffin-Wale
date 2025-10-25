import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Rating } from '@/components/ui/rating';
import { FileUploadZone, UploadedFile } from '@/components/ui/file-upload-zone';
import { ImageGallery, GalleryImage } from '@/components/ui/image-gallery';
import { UploadType } from '@/services/cloudinaryService';
import { submitFeedback, FeedbackFormData } from '@/lib/api';
import { AlertCircle, CheckCircle, MessageSquare, ThumbsUp, AlertTriangle, HelpCircle, Star } from 'lucide-react';

const feedbackTypes = [
  { value: 'suggestion', label: 'Suggestion', icon: ThumbsUp, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { value: 'complaint', label: 'Complaint', icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50' },
  { value: 'question', label: 'Question', icon: HelpCircle, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { value: 'compliment', label: 'Compliment', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  { value: 'other', label: 'Other', icon: MessageSquare, color: 'text-gray-500', bgColor: 'bg-gray-50' }
];

export default function FeedbackForm({ className = '' }: { className?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    rating: 0,
    feedback: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadComplete = (files: UploadedFile[]) => {
    const successfulFiles = files.filter(f => f.uploadStatus === 'success' && f.cloudinaryUrl);
    const images: GalleryImage[] = successfulFiles.map(f => ({
      id: f.id,
      url: f.cloudinaryUrl!,
      publicId: f.publicId,
      alt: `Feedback attachment - ${f.file.name}`,
      caption: f.file.name
    }));
    setGalleryImages(images);
  };

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleImageDelete = (imageId: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    setUploadedFiles(prev => prev.filter(f => f.id !== imageId));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.type) {
      setErrorMessage('Please select a feedback type');
      return false;
    }
    if (!formData.feedback.trim() || formData.feedback.length < 10) {
      setErrorMessage('Feedback must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const feedbackData: FeedbackFormData & { attachments?: string[] } = {
        ...formData,
        attachments: galleryImages.map(img => img.url)
      };
      
      const response = await submitFeedback(feedbackData);
      
      if (response.success === false) {
        throw new Error(response.message || 'Form submission failed');
      }
      
      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        type: '',
        rating: 0,
        feedback: ''
      });
      setUploadedFiles([]);
      setGalleryImages([]);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred while submitting your feedback. Please try again.');
    }
  };

  const selectedType = feedbackTypes.find(type => type.value === formData.type);

  if (status === 'success') {
    return (
      <div className={`p-8 border border-green-200 bg-green-50 rounded-2xl text-green-800 ${className}`}>
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-2xl font-bold mb-2">Feedback Submitted!</h3>
          <p className="text-green-700 mb-6">
            Thank you for your valuable feedback! We appreciate your input and will use it to improve our services.
          </p>
          <Button 
            onClick={() => setStatus('idle')}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Submit More Feedback
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Share Your Feedback</h2>
        <p className="text-primary-foreground/90">
          Your opinion matters to us. Help us improve by sharing your thoughts and suggestions.
        </p>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-xl text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="font-medium">{errorMessage || 'An error occurred. Please try again.'}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="block mb-2">
                Your Name (Optional)
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="h-12"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="flex items-center gap-1 mb-2">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div>
            <Label className="flex items-center gap-1 mb-3">
              Feedback Type <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.type === type.value
                        ? `border-primary ${type.bgColor} shadow-md`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === type.value ? type.bgColor : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${formData.type === type.value ? type.color : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${
                      formData.type === type.value ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label className="block mb-3">
              Rate Your Experience (Optional)
            </Label>
            <div className="flex items-center gap-4">
              <Rating 
                value={formData.rating} 
                onChange={(rating) => setFormData(prev => ({ ...prev, rating }))} 
                size="lg" 
              />
              {formData.rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {formData.rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <Label htmlFor="feedback" className="flex items-center gap-1 mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="feedback"
              name="feedback"
              placeholder={selectedType ? 
                `Share your ${selectedType.label.toLowerCase()} with us...` : 
                'Please share your thoughts with us...'
              }
              value={formData.feedback}
              onChange={handleChange}
              required
              className="min-h-[120px] resize-none"
              rows={5}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.feedback.length}/1000 characters (minimum 10 required)
            </p>
          </div>

          {/* File Upload */}
          <div>
            <Label className="block mb-2">Attachments (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-3">
              You can attach screenshots, documents, or images to help us better understand your feedback.
            </p>
            <FileUploadZone
              uploadType={UploadType.FEEDBACK_ATTACHMENT}
              maxFiles={3}
              maxSize={5}
              acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
              onUploadComplete={handleUploadComplete}
              onFilesChange={handleFilesChange}
              showPreviews={true}
              allowDelete={true}
              multiple={true}
            />
            
            {/* Display uploaded files */}
            {galleryImages.length > 0 && (
              <div className="mt-4">
                <Label className="block mb-2">Uploaded Attachments</Label>
                <ImageGallery
                  images={galleryImages}
                  onDelete={handleImageDelete}
                  showFullscreen={true}
                  showDeleteButton={true}
                  columns={3}
                  aspectRatio="auto"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full h-12 bg-primary hover:bg-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
            {status === 'submitting' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting Feedback...
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}