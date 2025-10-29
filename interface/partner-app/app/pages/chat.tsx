import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatScreen } from '../../components/chat/ChatScreen';
import { useChatMessages } from '../../hooks/useWebSocket';
import { wsService, ChatMessage } from '../../services/websocket.service';
import { TokenManager } from '../../lib/auth/TokenManager';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    recipientId: string;
    recipientName: string;
    conversationType: 'customer' | 'support';
  }>();
  
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalMessages, setHistoricalMessages] = useState<ChatMessage[]>([]);
  
  const { messages: liveMessages, setMessages, typingUsers } = useChatMessages(conversationId);
  
  useEffect(() => {
    initializeChat();
  }, []);
  
  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Get current user ID
      const userId = await TokenManager.getUserId();
      if (!userId) {
        Alert.alert('Error', 'Please log in to chat');
        router.back();
        return;
      }
      setCurrentUserId(userId);
      
      // Create or get conversation
      // TODO: Replace with actual API call
      // const conversation = await api.chat.createOrGetConversation({
      //   participantId: params.recipientId,
      //   type: params.conversationType,
      // });
      
      // Mock conversation for now
      const mockConversationId = `${userId}_${params.recipientId}_${params.conversationType}`;
      setConversationId(mockConversationId);
      
      // Load historical messages
      // TODO: Replace with actual API call
      // const history = await api.chat.getMessages(mockConversationId);
      // setHistoricalMessages(history);
      
      // For now, just initialize with empty messages
      setMessages([]);
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      Alert.alert('Error', 'Failed to load chat');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (content: string) => {
    if (!conversationId || !currentUserId) return;
    
    const tempMessage: ChatMessage = {
      _id: `temp_${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      senderName: 'You',
      messageType: 'text',
      content,
      status: 'sending',
      createdAt: new Date().toISOString(),
    };
    
    // Optimistically add message
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      // Send via WebSocket
      wsService.sendChatMessage({
        conversationId,
        content,
        messageType: 'text',
      });
      
      // Update status to sent
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempMessage._id
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // Update status to failed
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempMessage._id
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    }
  };
  
  const handleTypingStart = () => {
    if (conversationId) {
      wsService.startTyping(conversationId);
    }
  };
  
  const handleTypingStop = () => {
    if (conversationId) {
      wsService.stopTyping(conversationId);
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // Combine historical and live messages
  const allMessages = [...historicalMessages, ...liveMessages];
  
  if (isLoading || !conversationId || !currentUserId) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ChatScreen
        conversationId={conversationId}
        recipientName={params.recipientName || 'Unknown'}
        messages={allMessages}
        typingUsers={typingUsers}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        onBack={handleBack}
        isLoading={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

