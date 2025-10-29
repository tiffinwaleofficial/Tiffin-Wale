import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, CheckCheck, Clock } from 'lucide-react-native';
import { ChatMessage } from '../../services/websocket.service';

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  onPress?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn,
  showAvatar = false,
  onPress,
}) => {
  const renderStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock size={14} color="#999" />;
      case 'sent':
        return <Check size={14} color="#999" />;
      case 'delivered':
        return <CheckCheck size={14} color="#999" />;
      case 'read':
        return <CheckCheck size={14} color="#3B82F6" />;
      case 'failed':
        return <Text style={styles.failedText}>!</Text>;
      default:
        return null;
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOwn ? styles.containerOwn : styles.containerOther,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {showAvatar && !isOwn && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {message.senderName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {!isOwn && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        
        <Text style={[styles.content, isOwn ? styles.contentOwn : styles.contentOther]}>
          {message.content}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
            {formatTime(message.createdAt)}
          </Text>
          {renderStatusIcon()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  containerOwn: {
    justifyContent: 'flex-end',
  },
  containerOther: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleOwn: {
    backgroundColor: '#FF9F43',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  content: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  contentOwn: {
    color: '#FFF',
  },
  contentOther: {
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
  timeOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeOther: {
    color: '#999',
  },
  failedText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#EF4444',
  },
});

export default ChatBubble;

