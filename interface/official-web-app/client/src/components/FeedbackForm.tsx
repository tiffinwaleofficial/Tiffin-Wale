import React from 'react';
import FormWithFeedback from '@/components/FormWithFeedback';
import { submitFeedback, FeedbackFormData } from '@/lib/api';

export default function FeedbackForm({ className = '' }: { className?: string }) {
  const feedbackFields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'Your email address',
      required: true
    },
    {
      name: 'type',
      label: 'Feedback Type',
      type: 'select' as const,
      options: [
        { value: 'suggestion', label: 'Suggestion' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'question', label: 'Question' },
        { value: 'other', label: 'Other' }
      ],
      required: true
    },
    {
      name: 'rating',
      label: 'Rating (1-5)',
      type: 'number' as const,
      placeholder: 'Rate your experience from 1 to 5'
    },
    {
      name: 'feedback',
      label: 'Your Feedback',
      type: 'textarea' as const,
      placeholder: 'Please share your thoughts with us...',
      required: true,
      minLength: 10
    }
  ];

  const handleSubmit = async (formData: FeedbackFormData) => {
    return await submitFeedback(formData);
  };

  return (
    <FormWithFeedback
      title="Share Your Feedback"
      fields={feedbackFields}
      submitUrl="/api/feedback"
      submitButtonText="Submit Feedback"
      successMessage="Thank you for your feedback! We appreciate your input and will use it to improve our services."
      submitHandler={handleSubmit}
      className={className}
      realTimeUpdates={true}
    />
  );
}