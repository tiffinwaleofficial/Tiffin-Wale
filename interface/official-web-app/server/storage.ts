// This is a simple storage interface for the API
// In a real application, this would connect to a database

// Placeholder storage
const contacts: any[] = [];
const testimonials: any[] = [];
const feedback: any[] = [];

export const storage = {
  // Contact methods
  addContact: (contact: any) => {
    const newContact = {
      id: Date.now().toString(),
      ...contact,
      timestamp: new Date().toISOString()
    };
    contacts.push(newContact);
    return newContact;
  },
  getContacts: () => [...contacts],
  
  // Testimonial methods
  addTestimonial: (testimonial: any) => {
    const newTestimonial = {
      id: Date.now().toString(),
      ...testimonial,
      timestamp: new Date().toISOString()
    };
    testimonials.push(newTestimonial);
    return newTestimonial;
  },
  getTestimonials: () => [...testimonials],
  
  // Feedback methods
  addFeedback: (feedbackItem: any) => {
    const newFeedback = {
      id: Date.now().toString(),
      ...feedbackItem,
      timestamp: new Date().toISOString()
    };
    feedback.push(newFeedback);
    return newFeedback;
  },
  getFeedback: () => [...feedback]
};