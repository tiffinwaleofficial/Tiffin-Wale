/**
 * Enhanced Corporate Quote Form Component
 * Multi-step form with document upload capabilities
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploadZone, UploadedFile } from '@/components/ui/file-upload-zone';
import { ImageGallery, GalleryImage } from '@/components/ui/image-gallery';
import { UploadType } from '@/services/cloudinaryService';
import { AlertCircle, CheckCircle, Building, Users, Calendar, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface CorporateQuoteFormData {
  // Company Information
  companyName: string;
  companySize: string;
  industry: string;
  website?: string;
  
  // Contact Information
  contactPerson: string;
  email: string;
  phone: string;
  designation: string;
  
  // Requirements
  employeeCount: string;
  mealType: string[];
  deliveryLocation: string;
  preferredTime: string;
  budget: string;
  startDate: string;
  duration: string;
  requirements?: string;
  
  // Documents
  documents?: string[];
}

const steps = [
  { id: 1, title: 'Company Info', icon: Building },
  { id: 2, title: 'Contact Details', icon: Users },
  { id: 3, title: 'Requirements', icon: FileText },
  { id: 4, title: 'Documents', icon: FileText }
];

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Consulting', 'Real Estate', 'Media', 'Government', 'Other'
];

const mealTypes = [
  { value: 'lunch', label: 'Lunch' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' }
];

const budgetRanges = [
  { value: '50-100', label: '₹50-100 per person/day' },
  { value: '100-150', label: '₹100-150 per person/day' },
  { value: '150-200', label: '₹150-200 per person/day' },
  { value: '200+', label: '₹200+ per person/day' },
  { value: 'custom', label: 'Custom Budget' }
];

export default function CorporateQuoteForm({ className = '' }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CorporateQuoteFormData>({
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    contactPerson: '',
    email: '',
    phone: '',
    designation: '',
    employeeCount: '',
    mealType: [],
    deliveryLocation: '',
    preferredTime: '',
    budget: '',
    startDate: '',
    duration: '',
    requirements: '',
    documents: []
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMealTypeChange = (mealType: string) => {
    setFormData(prev => ({
      ...prev,
      mealType: prev.mealType.includes(mealType)
        ? prev.mealType.filter(type => type !== mealType)
        : [...prev.mealType, mealType]
    }));
  };

  const handleUploadComplete = (files: UploadedFile[]) => {
    const successfulFiles = files.filter(f => f.uploadStatus === 'success' && f.cloudinaryUrl);
    const images: GalleryImage[] = successfulFiles.map(f => ({
      id: f.id,
      url: f.cloudinaryUrl!,
      publicId: f.publicId,
      alt: `Corporate document - ${f.file.name}`,
      caption: f.file.name
    }));
    setGalleryImages(images);
    setFormData(prev => ({ ...prev, documents: images.map(img => img.url) }));
  };

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleImageDelete = (imageId: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    setUploadedFiles(prev => prev.filter(f => f.id !== imageId));
    setFormData(prev => ({ 
      ...prev, 
      documents: prev.documents?.filter(url => !galleryImages.find(img => img.id === imageId)?.url.includes(url))
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          setErrorMessage('Company name is required');
          return false;
        }
        if (!formData.companySize) {
          setErrorMessage('Company size is required');
          return false;
        }
        if (!formData.industry) {
          setErrorMessage('Industry is required');
          return false;
        }
        break;
      case 2:
        if (!formData.contactPerson.trim()) {
          setErrorMessage('Contact person name is required');
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
        if (!formData.phone.trim()) {
          setErrorMessage('Phone number is required');
          return false;
        }
        break;
      case 3:
        if (!formData.employeeCount.trim()) {
          setErrorMessage('Employee count is required');
          return false;
        }
        if (formData.mealType.length === 0) {
          setErrorMessage('Please select at least one meal type');
          return false;
        }
        if (!formData.deliveryLocation.trim()) {
          setErrorMessage('Delivery location is required');
          return false;
        }
        if (!formData.budget) {
          setErrorMessage('Budget range is required');
          return false;
        }
        break;
    }
    setErrorMessage('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      setStatus('error');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      // Here you would submit to your API
      console.log('Submitting corporate quote:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('success');
    } catch (error: any) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred while submitting your quote request. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`p-8 border border-green-200 bg-green-50 rounded-2xl text-green-800 ${className}`}>
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-2xl font-bold mb-2">Quote Request Submitted!</h3>
          <p className="text-green-700 mb-6">
            Thank you for your interest in our corporate meal services! Our team will review your requirements and get back to you within 24 hours with a customized quote.
          </p>
          <Button 
            onClick={() => {
              setStatus('idle');
              setCurrentStep(1);
              setFormData({
                companyName: '',
                companySize: '',
                industry: '',
                website: '',
                contactPerson: '',
                email: '',
                phone: '',
                designation: '',
                employeeCount: '',
                mealType: [],
                deliveryLocation: '',
                preferredTime: '',
                budget: '',
                startDate: '',
                duration: '',
                requirements: '',
                documents: []
              });
              setUploadedFiles([]);
              setGalleryImages([]);
            }}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Corporate Meal Plans</h2>
        <p className="text-primary-foreground/90">
          Get a customized quote for your company's meal requirements
        </p>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive 
                      ? 'border-primary bg-primary/10' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 bg-gray-50'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="font-medium text-sm hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-xl text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="font-medium">{errorMessage || 'Please fix the errors above.'}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Company Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="flex items-center gap-1 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companySize" className="flex items-center gap-1 mb-2">
                    Company Size <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select company size</option>
                    {companySizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry" className="flex items-center gap-1 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="website" className="block mb-2">
                    Company Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson" className="flex items-center gap-1 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    placeholder="Full name of contact person"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="designation" className="block mb-2">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    name="designation"
                    type="text"
                    placeholder="e.g. HR Manager, Admin Head"
                    value={formData.designation}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Meal Requirements</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeCount" className="flex items-center gap-1 mb-2">
                    Number of Employees <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="employeeCount"
                    name="employeeCount"
                    type="number"
                    placeholder="e.g. 50"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget" className="flex items-center gap-1 mb-2">
                    Budget Range <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-3">
                  Meal Types Required <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mealTypes.map(meal => (
                    <label
                      key={meal.value}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.mealType.includes(meal.value)
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.mealType.includes(meal.value)}
                        onChange={() => handleMealTypeChange(meal.value)}
                        className="sr-only"
                      />
                      <span className="font-medium">{meal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryLocation" className="flex items-center gap-1 mb-2">
                    Delivery Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deliveryLocation"
                    name="deliveryLocation"
                    type="text"
                    placeholder="Office address"
                    value={formData.deliveryLocation}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="preferredTime" className="block mb-2">
                    Preferred Delivery Time
                  </Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="block mb-2">
                    Preferred Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration" className="block mb-2">
                    Contract Duration
                  </Label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select duration</option>
                    <option value="1-month">1 Month</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    <option value="custom">Custom Duration</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="requirements" className="block mb-2">
                  Additional Requirements
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="Any specific dietary requirements, preferences, or additional information..."
                  value={formData.requirements}
                  onChange={handleChange}
                  className="min-h-[100px] resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Supporting Documents (Optional)</h3>
              <p className="text-muted-foreground mb-4">
                Upload any relevant documents such as company profile, employee list, or specific requirements.
              </p>
              
              <FileUploadZone
                uploadType={UploadType.CORPORATE_PROPOSAL}
                maxFiles={5}
                maxSize={10}
                acceptedTypes={['application/pdf', '.doc', '.docx', '.xls', '.xlsx', 'image/*']}
                onUploadComplete={handleUploadComplete}
                onFilesChange={handleFilesChange}
                showPreviews={true}
                allowDelete={true}
                multiple={true}
              />
              
              {galleryImages.length > 0 && (
                <div className="mt-4">
                  <Label className="block mb-2">Uploaded Documents</Label>
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
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-primary hover:bg-accent"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quote Request
                    <CheckCircle className="h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}