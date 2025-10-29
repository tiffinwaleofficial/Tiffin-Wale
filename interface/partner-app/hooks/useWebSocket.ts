/**
 * React Hook for WebSocket connection
 * Manages connection lifecycle and provides chat functionality
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { wsService, WebSocketEvent, ChatMessage, TypingIndicator } from '../services/websocket.service';
import { TokenManager } from '../lib/auth/TokenManager';

export interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: Partial<ChatMessage>) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  error: string | null;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initializeWebSocket = async () => {
      try {
        const token = await TokenManager.getAccessToken();
        const userId = await TokenManager.getUserId();
        
        if (!token || !userId) {
          console.warn('⚠️ No token or userId, skipping WebSocket connection');
          return;
        }
        
        // Connect to WebSocket
        await wsService.connect(token, userId);
        
        // Listen for connection events
        const unsubConnect = wsService.on(WebSocketEvent.CONNECT, () => {
          console.log('✅ WebSocket connected in hook');
          setIsConnected(true);
          setError(null);
        });
        
        const unsubDisconnect = wsService.on(WebSocketEvent.DISCONNECT, () => {
          console.log('🔌 WebSocket disconnected in hook');
          setIsConnected(false);
        });
        
        const unsubError = wsService.on(WebSocketEvent.ERROR, (data) => {
          console.error('❌ WebSocket error in hook:', data);
          setError('Connection error');
        });
        
        // Cleanup on unmount
        return () => {
          unsubConnect();
          unsubDisconnect();
          unsubError();
        };
      } catch (err) {
        console.error('❌ Failed to initialize WebSocket:', err);
        setError('Failed to connect');
      }
    };
    
    initializeWebSocket();
  }, []);
  
  const sendMessage = useCallback((message: Partial<ChatMessage>) => {
    wsService.sendChatMessage(message);
  }, []);
  
  const joinConversation = useCallback((conversationId: string) => {
    wsService.joinConversation(conversationId);
  }, []);
  
  const leaveConversation = useCallback((conversationId: string) => {
    wsService.leaveConversation(conversationId);
  }, []);
  
  const startTyping = useCallback((conversationId: string) => {
    wsService.startTyping(conversationId);
  }, []);
  
  const stopTyping = useCallback((conversationId: string) => {
    wsService.stopTyping(conversationId);
  }, []);
  
  return {
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    error,
  };
}

/**
 * Hook for listening to chat messages in a specific conversation
 */
export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  
  useEffect(() => {
    if (!conversationId) return;
    
    // Join conversation
    wsService.joinConversation(conversationId);
    
    // Listen for new messages
    const unsubMessages = wsService.onNewMessage((message) => {
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    // Listen for typing indicators
    const unsubTyping = wsService.onUserTyping((typing) => {
      if (typing.conversationId === conversationId) {
        setTypingUsers(prev => {
          // Remove existing entry for this user
          const filtered = prev.filter(t => t.userId !== typing.userId);
          // Add new entry if typing
          return typing.isTyping ? [...filtered, typing] : filtered;
        });
      }
    });
    
    // Listen for message status updates
    const unsubStatus = wsService.onMessageStatus((data) => {
      setMessages(prev => prev.map(msg =>
        msg._id === data.messageId
          ? { ...msg, status: data.status as any }
          : msg
      ));
    });
    
    // Cleanup
    return () => {
      wsService.leaveConversation(conversationId);
      unsubMessages();
      unsubTyping();
      unsubStatus();
    };
  }, [conversationId]);
  
  return {
    messages,
    setMessages,
    typingUsers,
  };
}

export default useWebSocket;
