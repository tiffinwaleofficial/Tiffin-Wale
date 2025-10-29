/**
 * Support API Service
 * All support ticket endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export interface SupportTicket {
  _id?: string;
  id?: string;
  ticketId: string;
  user: string;
  partner?: string;
  subject: string;
  message: string;
  category: 'payments' | 'orders' | 'account' | 'menu' | 'technical' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  replies?: Array<{
    message: string;
    by: string;
    userId?: string;
    adminId?: string;
    timestamp: string;
  }>;
  assignedTo?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketDto {
  subject: string;
  message: string;
  category: 'payments' | 'orders' | 'account' | 'menu' | 'technical' | 'other';
}

export interface SupportTicketResponse {
  success: boolean;
  message: string;
  ticket: {
    ticketId: string;
    subject: string;
    category: string;
    status: string;
    createdAt: string;
  };
}

/**
 * Support API Methods
 */
export const supportApi = {
  /**
   * Create a new support ticket
   */
  createTicket: async (
    ticketData: CreateSupportTicketDto
  ): Promise<SupportTicketResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<SupportTicketResponse>('/support/tickets', ticketData)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createTicket');
    }
  },

  /**
   * Get all tickets for current user
   */
  getMyTickets: async (): Promise<SupportTicket[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<SupportTicket[]>('/support/tickets')
      );
      return response.data || [];
    } catch (error) {
      return handleApiError(error, 'getMyTickets');
    }
  },

  /**
   * Get ticket by ID
   */
  getTicket: async (ticketId: string): Promise<SupportTicket> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<SupportTicket>(`/support/tickets/${ticketId}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getTicket');
    }
  },

  /**
   * Add reply to ticket
   */
  addReply: async (ticketId: string, message: string): Promise<SupportTicket> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<SupportTicket>(`/support/tickets/${ticketId}/reply`, { message })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'addReply');
    }
  },
};

export default supportApi;

