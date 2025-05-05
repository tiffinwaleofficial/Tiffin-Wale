import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from 'ws';
import { z } from 'zod';

// Get environment variables with fallbacks
const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

const BACKEND_API_URL = getEnv('BACKEND_API_URL', 'http://localhost:3000');
const BACKEND_API_KEY = getEnv('BACKEND_API_KEY', '');
const BACKEND_API_SECRET = getEnv('BACKEND_API_SECRET', '');

// Cache the auth token and its expiry
let authTokenCache = {
  token: '',
  expiresAt: 0, // Unix timestamp for expiry
};

// Define validation schemas for our forms
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

const testimonialFormSchema = z.object({
  name: z.string(),
  email: z.string().email("Please provide a valid email address"),
  profession: z.string().optional(),
  rating: z.number().min(1).max(5),
  testimonial: z.string().max(1000, "Testimonial cannot exceed 1000 characters"),
  imageUrl: z.string().optional(),
});

const feedbackFormSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  type: z.enum(['suggestion', 'complaint', 'question', 'other']),
  feedback: z.string().min(10, "Feedback must be at least 10 characters long"),
  rating: z.number().min(1).max(5).optional(),
});

// Create a WebSocket clients collection for real-time updates
type Client = {
  ws: WebSocket;
  id: string;
};

const clients: Client[] = [];

// Function to get authentication token from backend
async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  const now = Date.now() / 1000; // Current time in seconds
  if (authTokenCache.token && authTokenCache.expiresAt > now + 60) { // 60s buffer
    return authTokenCache.token;
  }

  // If API key/secret not configured, return empty token
  if (!BACKEND_API_KEY || !BACKEND_API_SECRET) {
    console.warn('Backend API authentication not configured');
    return '';
  }

  try {
    // Request new token from auth endpoint
    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: BACKEND_API_KEY,
        apiSecret: BACKEND_API_SECRET,
      }),
    });

    if (!response.ok) {
      console.error('Failed to authenticate with backend:', response.status, response.statusText);
      return '';
    }

    const data = await response.json();
    
    // Cache the token and its expiry time
    authTokenCache = {
      token: data.access_token,
      // Convert expiry to timestamp or use a default (1 hour)
      expiresAt: data.expires_in 
        ? (now + data.expires_in) 
        : (now + 3600),
    };
    
    return authTokenCache.token;
  } catch (error) {
    console.error('Error authenticating with backend:', error);
    return '';
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // WebSocket connection handler
  wss.on('connection', (ws) => {
    const id = Math.random().toString(36).substring(2, 15);
    clients.push({ ws, id });
    
    console.log(`WebSocket client connected: ${id}`);
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Connected to TiffinWale API', 
      id 
    }));
    
    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message from client:', data);
        
        // Echo back to the client
        ws.send(JSON.stringify({
          type: 'echo',
          data
        }));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      const index = clients.findIndex(client => client.id === id);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log(`WebSocket client disconnected: ${id}`);
    });
  });
  
  // Broadcast message to all connected clients
  const broadcastMessage = (type: string, data: any) => {
    const message = JSON.stringify({ type, data });
    clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  };
  
  // API Routes
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'TiffinWale API is running' });
  });
  
  // Get approved testimonials
  app.get('/api/testimonials', async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const sortBy = req.query.sortBy?.toString() || 'createdAt';
      const sortOrder = req.query.sortOrder?.toString() as 'asc' | 'desc' || 'desc';
      
      try {
        // Fetch from NestJS backend
        const response = await fetch(
          `${BACKEND_API_URL}/testimonials?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, 
          { method: 'GET' }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error fetching testimonials from backend:', data);
          
          // Fallback to local data if backend unavailable
          return res.status(200).json({ 
            testimonials: [], 
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            message: 'Using local data (backend unavailable)',
          });
        }
        
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error connecting to backend for testimonials:', error);
        
        // Fallback to local data if backend unavailable
        return res.status(200).json({ 
          testimonials: [], 
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          message: 'Using local data (backend unavailable)',
        });
      }
    } catch (error) {
      console.error('Error in testimonials endpoint:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching testimonials.'
      });
    }
  });
  
  // Contact form submission
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const result = contactFormSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          errors: result.error.errors 
        });
      }
      
      const data = result.data;
      
      // Forward to the NestJS backend - Contact/Inquiry API
      try {
        // API endpoint for the NestJS backend contact form submission (via landing module)
        const response = await fetch(`${BACKEND_API_URL}/landing/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Backend error:', responseData);
          return res.status(response.status).json({
            success: false,
            message: responseData.message || 'Error from backend service',
            errors: responseData.errors,
          });
        }
        
        // Log success and broadcast to WebSocket clients
        console.log('Contact form submitted successfully:', responseData);
        
        // Broadcast to connected clients
        broadcastMessage('newContact', {
          id: responseData.id || Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for contacting us! We will get back to you shortly.',
          data: responseData
        });
      } catch (backendError) {
        console.error('Error connecting to backend service:', backendError);
        
        // If backend is unavailable, still log locally and broadcast
        console.log('Contact form submission (stored locally):', data);
        
        // Broadcast to connected clients
        broadcastMessage('newContact', {
          id: Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for contacting us! We will get back to you shortly.',
          note: 'Processed locally due to backend service unavailability'
        });
      }
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred while processing your request.' 
      });
    }
  });
  
  // Testimonial submission
  app.post('/api/testimonial', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const result = testimonialFormSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          errors: result.error.errors 
        });
      }
      
      const data = result.data;
      
      // Forward to the NestJS backend
      try {
        // API endpoint for the NestJS backend testimonial submission
        const response = await fetch(`${BACKEND_API_URL}/testimonial`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Backend error:', responseData);
          return res.status(response.status).json({
            success: false,
            message: responseData.message || 'Error from backend service',
            errors: responseData.errors,
          });
        }
        
        // Log success and broadcast to WebSocket clients
        console.log('Testimonial submitted successfully:', responseData);
        
        // Broadcast to connected clients
        broadcastMessage('newTestimonial', {
          id: responseData.id || Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for your testimonial! Your feedback helps us improve our service.',
          data: responseData
        });
      } catch (backendError) {
        console.error('Error connecting to backend service:', backendError);
        
        // If backend is unavailable, still log locally and broadcast
        console.log('Testimonial submission (stored locally):', data);
        
        // Broadcast to connected clients
        broadcastMessage('newTestimonial', {
          id: Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for your testimonial! Your feedback helps us improve our service.',
          note: 'Processed locally due to backend service unavailability'
        });
      }
    } catch (error) {
      console.error('Error processing testimonial:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred while processing your testimonial.' 
      });
    }
  });
  
  // Feedback submission
  app.post('/api/feedback', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const result = feedbackFormSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          errors: result.error.errors 
        });
      }
      
      const data = result.data;
      
      // Forward to the NestJS backend feedback module
      try {
        // API endpoint for the NestJS backend feedback submission
        const response = await fetch(`${BACKEND_API_URL}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Backend error:', responseData);
          return res.status(response.status).json({
            success: false,
            message: responseData.message || 'Error from backend service',
            errors: responseData.errors,
          });
        }
        
        // Log success and broadcast to WebSocket clients
        console.log('Feedback submitted successfully:', responseData);
        
        // Broadcast to connected clients
        broadcastMessage('newFeedback', {
          id: responseData.id || Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for your feedback! We appreciate your input.',
          data: responseData
        });
      } catch (backendError) {
        console.error('Error connecting to backend service:', backendError);
        
        // If backend is unavailable, still log locally and broadcast
        console.log('Feedback submission (stored locally):', data);
        
        // Broadcast to connected clients
        broadcastMessage('newFeedback', {
          id: Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for your feedback! We appreciate your input.',
          note: 'Processed locally due to backend service unavailability'
        });
      }
    } catch (error) {
      console.error('Error processing feedback:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred while processing your feedback.' 
      });
    }
  });

  return httpServer;
}
