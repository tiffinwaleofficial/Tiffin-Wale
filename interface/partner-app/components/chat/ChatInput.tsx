import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Paperclip, Smile } from 'lucide-react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  const handleTextChange = (text: string) => {
    setMessage(text);
    
    // Start typing indicator
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      onTypingStart?.();
    }
    
    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop?.();
    }, 2000);
  };
  
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0 || disabled) return;
    
    // Send message
    onSend(trimmedMessage);
    
    // Clear input
    setMessage('');
    
    // Stop typing
    if (isTyping) {
      setIsTyping(false);
      onTypingStop?.();
    }
    
    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Attachment button (disabled for now) */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {/* TODO: Implement file picker */}}
          disabled
        >
          <Paperclip size={22} color="#CCC" />
        </TouchableOpacity>
        
        {/* Text input */}
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          editable={!disabled}
        />
        
        {/* Emoji button (disabled for now) */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {/* TODO: Implement emoji picker */}}
          disabled
        >
          <Smile size={22} color="#CCC" />
        </TouchableOpacity>
        
        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            message.trim().length === 0 && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={message.trim().length === 0 || disabled}
        >
          <Send
            size={20}
            color={message.trim().length > 0 ? '#FFF' : '#CCC'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
});

export default ChatInput;

