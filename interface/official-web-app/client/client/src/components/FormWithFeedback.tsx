import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { connectWebSocket, disconnectWebSocket } from '@/lib/api';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  minLength?: number;
  maxLength?: number;
}

interface FormWithFeedbackProps {
  title: string;
  fields: FormField[];
  submitUrl: string;
  submitButtonText?: string;
  successMessage?: string;
  submitHandler: (formData: any) => Promise<any>;
  className?: string;
  realTimeUpdates?: boolean;
}

export default function FormWithFeedback({
  title,
  fields,
  submitUrl,
  submitButtonText = 'Submit',
  successMessage = 'Thank you for your submission!',
  submitHandler,
  className = '',
  realTimeUpdates = false
}: FormWithFeedbackProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { toast } = useToast();

  // Connect to WebSocket for real-time updates if needed
  React.useEffect(() => {
    if (realTimeUpdates) {
      connectWebSocket(
        (data) => {
          // Handle incoming WebSocket data if needed
          console.log('WebSocket data received:', data);
        },
        () => {
          console.log('WebSocket connected for form updates');
        }
      );
    }

    return () => {
      if (realTimeUpdates) {
        disconnectWebSocket();
      }
    };
  }, [realTimeUpdates]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field.name] || '';

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[field.name] = 'Please enter a valid email address';
          isValid = false;
        }
      } else if (field.minLength && value.length < field.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
        isValid = false;
      } else if (field.maxLength && value.length > field.maxLength) {
        newErrors[field.name] = `${field.label} must be less than ${field.maxLength} characters`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number = value;
    
    // Convert to number for number inputs
    if (type === 'number') {
      processedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await submitHandler(formData);
      
      if (response.success) {
        setSubmitted(true);
        setFormData({});
        toast({
          title: 'Success!',
          description: successMessage,
        });
      } else {
        if (response.errors) {
          const serverErrors: Record<string, string> = {};
          response.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              serverErrors[err.path[0]] = err.message;
            }
          });
          setErrors(serverErrors);
        }
        
        toast({
          title: 'Error',
          description: response.message || 'An error occurred while submitting the form.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while submitting the form.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const { name, label, type, placeholder, required, options } = field;
    
    switch (type) {
      case 'textarea':
        return (
          <div className="mb-4" key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div className="mb-4" key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={name}
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select {label}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
          </div>
        );
        
      default:
        return (
          <div className="mb-4" key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={type === 'number' ? (formData[name] === undefined ? '' : String(formData[name])) : (formData[name] || '')}
              onChange={handleInputChange}
              className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
          </div>
        );
    }
  };

  if (submitted) {
    return (
      <div className={`p-6 bg-green-50 rounded-lg text-center ${className}`}>
        <h3 className="text-xl font-bold text-green-700 mb-2">Thank You!</h3>
        <p className="text-green-600 mb-4">{successMessage}</p>
        <Button 
          onClick={() => setSubmitted(false)} 
          variant="outline"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(renderField)}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>
      </form>
    </div>
  );
}