import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { connectWebSocket, disconnectWebSocket } from '@/lib/api';

type FieldType = 'text' | 'email' | 'textarea' | 'select' | 'number';

interface FieldOption {
  value: string;
  label: string;
}

interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  required?: boolean;
  minLength?: number;
}

interface FormWithFeedbackProps {
  title: string;
  fields: FormField[];
  submitUrl?: string;
  submitButtonText: string;
  successMessage: string;
  className?: string;
  submitHandler: (formData: any) => Promise<any>;
  realTimeUpdates?: boolean;
}

export default function FormWithFeedback({
  title,
  fields,
  submitUrl,
  submitButtonText,
  successMessage,
  className = '',
  submitHandler,
  realTimeUpdates = false,
}: FormWithFeedbackProps) {
  const [formData, setFormData] = useState<any>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setErrorMessage(`${field.label} is required`);
        return false;
        }
      
      if (field.minLength && formData[field.name] && formData[field.name].length < field.minLength) {
        setErrorMessage(`${field.label} must be at least ${field.minLength} characters`);
        return false;
    }
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
      // Process form data type conversion for numbers
      const processedData = { ...formData };
      fields.forEach(field => {
        if (field.type === 'number' && processedData[field.name]) {
          processedData[field.name] = Number(processedData[field.name]);
            }
          });
      
      const response = await submitHandler(processedData);
      
      if (response.success === false) {
        throw new Error(response.message || 'Form submission failed');
      }
      
      setStatus('success');
      setFormData({});
    } catch (error: any) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred while submitting the form. Please try again.');
    }
  };

  // Don't show the form after successful submission unless real-time updates are enabled
  if (status === 'success' && !realTimeUpdates) {
        return (
      <div className={`p-4 border border-green-200 bg-green-50 rounded-md text-green-800 ${className}`}>
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold mb-1">{title} Submitted</h3>
            <p>{successMessage}</p>
          </div>
        </div>
          </div>
        );
  }
        
        return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      {status === 'success' && realTimeUpdates && (
        <div className="mb-4 p-3 border border-green-200 bg-green-50 rounded-md text-green-800">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md text-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            <p>{errorMessage || 'An error occurred. Please try again.'}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="block font-medium">
              {field.label}{field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className="w-full"
                rows={5}
              />
            ) : field.type === 'select' ? (
            <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className="w-full"
              />
            )}
          </div>
        ))}
        
        <Button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full"
        >
          {status === 'submitting' ? 'Submitting...' : submitButtonText}
        </Button>
      </form>
    </div>
  );
}