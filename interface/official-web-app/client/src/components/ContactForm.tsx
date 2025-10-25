import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploadZone, UploadedFile } from '@/components/ui/file-upload-zone';
import { ImageGallery, GalleryImage } from '@/components/ui/image-gallery';
import { UploadType } from '@/services/cloudinaryService';
import { submitContactForm, ContactFormData } from '@/lib/api';
import { AlertCircle, CheckCircle, Send, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactForm({ className = '' }: { className?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'normal'
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
      alt: `Contact attachment - ${f.file.name}`,
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
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMessage('Message must be at least 10 characters long');
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
      const contactData: ContactFormData & { attachments?: string[] } = {
        ...formData,
        attachments: galleryImages.map(img => img.url)
      };
      
      const response = await submitContactForm(contactData);
      
      if (response.success === false) {
        throw new Error(response.message || 'Form submission failed');
      }
      
      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        priority: 'normal'
      });
      setUploadedFiles([]);
      setGalleryImages([]);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred while submitting the form. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`p-8 border border-green-200 bg-green-50 rounded-2xl text-green-800 ${className}`}>
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
          <p className="text-green-700 mb-6">
            Thank you for contacting us! We will get back to you within 24 hours.
          </p>
          <Button 
            onClick={() => setStatus('idle')}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
        <p className="text-primary-foreground/90">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="p-6">
        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Call Us</p>
              <p className="text-xs text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Email Us</p>
              <p className="text-xs text-muted-foreground">hello@tiffinwale.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Visit Us</p>
              <p className="text-xs text-muted-foreground">Mumbai, India</p>
            </div>
          </div>
        </div>

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
              <Label htmlFor="name" className="flex items-center gap-1 mb-2">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
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

          {/* Phone and Subject Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="block mb-2">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="h-12"
              />
            </div>
            
            <div>
              <Label htmlFor="priority" className="block mb-2">
                Priority Level
              </Label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject" className="block mb-2">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is this regarding?"
              value={formData.subject}
              onChange={handleChange}
              className="h-12"
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="flex items-center gap-1 mb-2">
              Your Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={handleChange}
              required
              className="min-h-[120px] resize-none"
              rows={5}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.message.length}/1000 characters
            </p>
          </div>

          {/* File Upload */}
          <div>
            <Label className="block mb-2">Attachments (Optional)</Label>
            <FileUploadZone
              uploadType={UploadType.CONTACT_DOCUMENT}
              maxFiles={5}
              maxSize={10}
              acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
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
                  showDownloadButton={true}
                  columns={4}
                  aspectRatio="auto"
                />
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              You can upload up to 5 files (images, PDFs, documents), maximum 10MB each
            </p>
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
                Sending Message...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}