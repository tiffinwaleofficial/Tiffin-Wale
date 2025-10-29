import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatScreen } from '../../components/chat/ChatScreen';
import { useChatMessages } from '../../hooks/useWebSocket';
import { wsService, ChatMessage } from '../../services/websocket.service';
import { tokenManager } from '../../lib/auth/TokenManager';
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
      
      // Get current user ID from token
      const userData = await tokenManager.getUserData();
      if (!userData?.id) {
        Alert.alert('Error', 'Please log in to chat');
        router.back();
        return;
      }
      setCurrentUserId(userData.id);
      
      // Create or get conversation
      // TODO: Replace with actual API call
      // const conversation = await api.chat.createOrGetConversation({
      //   participantId: params.recipientId,
      //   type: params.conversationType,
      // });
      
      // Create conversation ID
      const conversationIdStr = `${userData.id}_${params.recipientId}_${params.conversationType}`;
      setConversationId(conversationIdStr);
      
      // Load historical messages (if API exists)
      try {
        // TODO: Replace with actual API call when available
        // const history = await api.chat.getMessages(conversationIdStr);
        // setHistoricalMessages(history || []);
        setHistoricalMessages([]);
      } catch (historyError) {
        console.log('No chat history API available, starting fresh');
        setHistoricalMessages([]);
      }
      
      // Initialize messages state
      setMessages([]);
      
      console.log('✅ Chat initialized:', {
        conversationId: conversationIdStr,
        recipientId: params.recipientId,
        recipientName: params.recipientName,
        type: params.conversationType,
      });
      
    } catch (error: any) {
      console.error('❌ Failed to initialize chat:', error);
      Alert.alert('Error', error.message || 'Failed to load chat. Please try again.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (content: string) => {
    const finalConvId = conversationId || `${currentUserId}_${params.recipientId}_${params.conversationType}`;
    if (!finalConvId || !currentUserId) return;
    
    const tempMessage: ChatMessage = {
      _id: `temp_${Date.now()}`,
      conversationId: finalConvId,
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
        conversationId: finalConvId,
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
    const finalConvId = conversationId || `${currentUserId}_${params.recipientId}_${params.conversationType}`;
    if (finalConvId && currentUserId) {
      wsService.startTyping(finalConvId);
    }
  };

  const handleTypingStop = () => {
    const finalConvId = conversationId || `${currentUserId}_${params.recipientId}_${params.conversationType}`;
    if (finalConvId && currentUserId) {
      wsService.stopTyping(finalConvId);
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // Combine historical and live messages
  const allMessages = [...historicalMessages, ...liveMessages];

  // Show loading only during initial setup
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
        <Text style={{ marginTop: 12, color: '#666', fontFamily: 'Poppins-Regular' }}>
          Loading chat...
        </Text>
      </View>
    );
  }

  // Show chat even if conversationId is generated (for new chats)
  if (!currentUserId) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
        <Text style={{ marginTop: 12, color: '#666', fontFamily: 'Poppins-Regular' }}>
          Initializing...
        </Text>
      </View>
    );
  }

  // Use generated conversationId if available, otherwise create one
  const finalConversationId = conversationId || `${currentUserId}_${params.recipientId}_${params.conversationType}`;
  
  return (
    <View style={styles.container}>
      <ChatScreen
        conversationId={finalConversationId}
        recipientName={params.recipientName || 'Support Team'}
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

