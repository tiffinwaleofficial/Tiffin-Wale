import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from '../../services/websocket.service';

interface ChatScreenProps {
  conversationId: string;
  recipientName: string;
  recipientAvatar?: string;
  messages: ChatMessage[];
  typingUsers: any[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  recipientName,
  recipientAvatar,
  messages,
  typingUsers,
  currentUserId,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  onBack,
  isLoading = false,
}) => {
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.senderId === currentUserId;
    return (
      <ChatBubble
        message={item}
        isOwn={isOwn}
        showAvatar={!isOwn}
      />
    );
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        {recipientAvatar ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {recipientName.charAt(0).toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {recipientName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.recipientName}>{recipientName}</Text>
          <Text style={styles.recipientStatus}>
            {typingUsers.length > 0 ? 'typing...' : 'Online'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        No messages yet. Start the conversation!
      </Text>
    </View>
  );
  
  const renderFooter = () => {
    if (typingUsers.length === 0) return null;
    
    return (
      <TypingIndicator
        userName={typingUsers[0]?.userName}
        showName={true}
      />
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      {renderHeader()}
      
      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9F43" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item._id || `message-${index}`}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      
      {/* Input */}
      <ChatInput
        onSend={onSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
        disabled={isLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  recipientName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  recipientStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#10B981',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ChatScreen;

