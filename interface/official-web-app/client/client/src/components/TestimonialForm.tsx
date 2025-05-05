import React from 'react';
import FormWithFeedback from '@/components/FormWithFeedback';
import { submitTestimonial, TestimonialFormData } from '@/lib/api';

export default function TestimonialForm({ className = '' }: { className?: string }) {
  const testimonialFields = [
    {
      name: 'name',
      label: 'Your Name',
      type: 'text' as const,
      placeholder: 'Enter your full name',
      required: true
    },
    {
      name: 'profession',
      label: 'Profession',
      type: 'text' as const,
      placeholder: 'Your profession or title'
    },
    {
      name: 'rating',
      label: 'Rating (1-5)',
      type: 'number' as const,
      placeholder: 'Rate your experience from 1 to 5',
      required: true
    },
    {
      name: 'testimonial',
      label: 'Your Testimonial',
      type: 'textarea' as const,
      placeholder: 'Share your experience with TiffinWale...',
      required: true,
      minLength: 10
    }
  ];

  const handleSubmit = async (formData: TestimonialFormData) => {
    return await submitTestimonial(formData);
  };

  return (
    <FormWithFeedback
      title="Share Your Experience"
      fields={testimonialFields}
      submitUrl="/api/testimonial"
      submitButtonText="Submit Testimonial"
      successMessage="Thank you for sharing your experience! Your testimonial will be reviewed and published soon."
      submitHandler={handleSubmit}
      className={className}
      realTimeUpdates={true}
    />
  );
}