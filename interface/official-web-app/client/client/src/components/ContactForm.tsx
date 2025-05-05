import React from 'react';
import FormWithFeedback from '@/components/FormWithFeedback';
import { submitContactForm, ContactFormData } from '@/lib/api';

export default function ContactForm({ className = '' }: { className?: string }) {
  const contactFields = [
    {
      name: 'name',
      label: 'Your Name',
      type: 'text' as const,
      placeholder: 'Enter your full name',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'Your email address',
      required: true
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      placeholder: 'How can we help you?',
      required: true,
      minLength: 10
    }
  ];

  const handleSubmit = async (formData: ContactFormData) => {
    return await submitContactForm(formData);
  };

  return (
    <FormWithFeedback
      title="Contact Us"
      fields={contactFields}
      submitUrl="/api/contact"
      submitButtonText="Send Message"
      successMessage="Thank you for contacting us! We will get back to you as soon as possible."
      submitHandler={handleSubmit}
      className={className}
      realTimeUpdates={true}
    />
  );
}