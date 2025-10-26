import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '../store/chatStore';
import { ChatMessage, Conversation } from '../services/chatService';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { imageUploadService, UploadType } from '../services/imageUploadService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ChatRoomProps {
  conversation: Conversation;
  onBack: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ conversation, onBack }) => {
  const { t } = useTranslation('common');
  const {
    messages,
    isSending,
    isLoadingMessages,
    error,
    sendTextMessage,
    sendMediaMessage,
    deleteMessage,
    markMessagesAsRead,
    sendTypingIndicator,
    typingIndicators,
    onlineUsers,
    setActiveConversation,
    clearError,
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'optimizing' | 'uploading' | 'completed' | 'failed'>('optimizing');
  const [optimizationData, setOptimizationData] = useState<{
    originalSize: number,
    optimizedSize: number,
    compressionRatio: number
  } | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const conversationMessages = messages.get(conversation.id) || [];

  useEffect(() => {
    setActiveConversation(conversation);
    return () => {
      setActiveConversation(null);
    };
  }, [conversation, setActiveConversation]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('chatError'), error, [{ text: t('ok'), onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    
    // Stop typing indicator
    if (isTyping) {
      await sendTypingIndicator(conversation.id, false);
      setIsTyping(false);
    }

    try {
      await sendTextMessage(conversation.id, messageText);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (text: string) => {
    setInputText(text);

    // Send typing indicator
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      sendTypingIndicator(conversation.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(async () => {
      if (isTyping) {
        await sendTypingIndicator(conversation.id, false);
        setIsTyping(false);
      }
    }, 2000);
  };

  const handleMediaPicker = () => {
    setShowMediaPicker(true);
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPreviewImage(asset.uri);
        setPreviewVideo(asset.type === 'video' ? asset.uri : null);
        setPreviewType(asset.type === 'video' ? 'video' : 'image');
        setShowImagePreview(true);
        setShowMediaPicker(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPreviewImage(asset.uri);
        setPreviewVideo(asset.type === 'video' ? asset.uri : null);
        setPreviewType(asset.type === 'video' ? 'video' : 'image');
        setShowImagePreview(true);
        setShowMediaPicker(false);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Handle document upload
        console.log('Document selected:', asset);
        setShowMediaPicker(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSendMedia = async () => {
    if (!previewImage && !previewVideo) return;

    try {
      const fileUri = previewType === 'video' ? previewVideo! : previewImage!;
      
      // Reset progress states
      setUploadProgress(0);
      setUploadStatus('optimizing');
      setOptimizationData(null);
      
      console.log('🚀 Starting optimized media upload for chat...');
      
      // Check if imageUploadService is configured
      const configStatus = imageUploadService.getConfigStatus();
      if (!configStatus.configured) {
        console.error('❌ Cloudinary not configured:', configStatus.missing);
        Alert.alert('Configuration Error', 'Media upload is temporarily unavailable. Please try again later!');
        return;
      }
      
      const uploadType = previewType === 'video' ? UploadType.REVIEW_VIDEO : UploadType.REVIEW_IMAGE;
      
      // Progress callback to update UI
      const onProgress = (progress: number, status: string, optimizationResult?: any) => {
        console.log(`📊 Chat media upload progress: ${progress}% - ${status}`);
        setUploadProgress(progress);
        setUploadStatus(status as any);
        
        if (optimizationResult) {
          setOptimizationData({
            originalSize: optimizationResult.originalSize,
            optimizedSize: optimizationResult.optimizedSize,
            compressionRatio: optimizationResult.compressionRatio
          });
        }
      };
      
      // Use the optimized upload service
      const result = await imageUploadService.uploadImageWithProgress(
        fileUri,
        uploadType,
        onProgress
      );
      
      if (result.success && result.url) {
        console.log('✅ Chat media upload successful:', result.url);
        
        // Send message with uploaded URL
        await sendMediaMessage(conversation.id, result.url, previewType);
        
        // Show success message with optimization info
        if (result.metadata?.optimization?.compressionRatio > 0) {
          const compressionPercent = Math.round(result.metadata.optimization.compressionRatio * 100);
          console.log(`🎉 Media optimized by ${compressionPercent}% before sending`);
        }
        
        // Reset states
        setShowImagePreview(false);
        setPreviewImage(null);
        setPreviewVideo(null);
        setUploadProgress(0);
        setUploadStatus('optimizing');
        setOptimizationData(null);
      } else {
        console.error('❌ Chat media upload failed:', result.error);
        setUploadStatus('failed');
        Alert.alert('Upload Failed', result.error || 'Failed to upload media. Please try again!');
      }
    } catch (error) {
      console.error('Error sending optimized media:', error);
      setUploadStatus('failed');
      Alert.alert('Error', 'Failed to send media');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      t('deleteMessage'),
      t('areYouSureDeleteMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => deleteMessage(messageId) },
      ]
    );
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isOwnMessage = item.senderType === 'user';
    const isOnline = onlineUsers.has(item.senderId);
    const showAvatar = !isOwnMessage && (index === 0 || conversationMessages[index - 1].senderId !== item.senderId);

    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        {showAvatar && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
            {isOnline && <View style={styles.onlineIndicator} />}
          </View>
        )}
        
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          {!isOwnMessage && showAvatar && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          
          {item.messageType === 'text' ? (
            <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
              {item.content}
            </Text>
          ) : item.messageType === 'image' ? (
            <TouchableOpacity onPress={() => {
              setPreviewImage(item.mediaUrl || '');
              setPreviewType('image');
              setShowImagePreview(true);
            }}>
              <Image source={{ uri: item.mediaUrl }} style={styles.messageImage} />
            </TouchableOpacity>
          ) : item.messageType === 'video' ? (
            <TouchableOpacity onPress={() => {
              setPreviewVideo(item.mediaUrl || '');
              setPreviewType('video');
              setShowImagePreview(true);
            }}>
              <View style={styles.videoContainer}>
                <Image source={{ uri: item.mediaThumbnail }} style={styles.videoThumbnail} />
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
                {item.mediaDuration && (
                  <Text style={styles.videoDuration}>
                    {Math.floor(item.mediaDuration / 60)}:{(item.mediaDuration % 60).toString().padStart(2, '0')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ) : null}
          
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isOwnMessage && (
              <View style={styles.messageStatus}>
                {item.status === 'sending' && <ActivityIndicator size="small" color="#999" />}
                {item.status === 'sent' && <Text style={styles.statusIcon}>✓</Text>}
                {item.status === 'delivered' && <Text style={styles.statusIcon}>✓✓</Text>}
                {item.status === 'read' && <Text style={[styles.statusIcon, styles.readStatus]}>✓✓</Text>}
                {item.status === 'failed' && <Text style={styles.statusIcon}>⚠</Text>}
              </View>
            )}
          </View>
          
          {isOwnMessage && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMessage(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    const typingUsers = typingIndicators.get(conversation.id) || [];
    if (typingUsers.length === 0) return null;

    return (
      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>
          {typingUsers.map(user => user.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.conversationTitle}>{conversation.participants[0]?.name || 'Chat'}</Text>
          <Text style={styles.conversationSubtitle}>
            {onlineUsers.has(conversation.participants[0]?.id || '') ? 'Online' : 'Offline'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleMediaPicker} style={styles.mediaButton}>
          <Text style={styles.mediaButtonText}>📎</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={conversationMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={handleTyping}
          placeholder={t('typeAMessage')}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Media Picker Modal */}
      <Modal visible={showMediaPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.mediaPickerContainer}>
            <TouchableOpacity style={styles.mediaOption} onPress={handleImagePicker}>
              <Text style={styles.mediaOptionText}>{t('gallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaOption} onPress={handleCameraCapture}>
              <Text style={styles.mediaOptionText}>{t('camera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaOption} onPress={handleDocumentPicker}>
              <Text style={styles.mediaOptionText}>{t('document')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowMediaPicker(false)}>
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal visible={showImagePreview} transparent animationType="fade">
        <View style={styles.previewOverlay}>
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <TouchableOpacity onPress={() => setShowImagePreview(false)}>
                <Text style={styles.previewCloseButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.previewTitle}>Preview</Text>
              <TouchableOpacity onPress={handleSendMedia} disabled={isSending}>
                <Text style={styles.previewSendButton}>Send</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.previewContent}>
              {previewType === 'image' && previewImage && (
                <Image source={{ uri: previewImage }} style={styles.previewImage} />
              )}
              {previewType === 'video' && previewVideo && (
                <View style={styles.previewVideoContainer}>
                  <Image source={{ uri: previewVideo }} style={styles.previewVideo} />
                  <View style={styles.previewPlayButton}>
                    <Text style={styles.previewPlayButtonText}>▶</Text>
                  </View>
                </View>
              )}
            </ScrollView>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {uploadStatus === 'optimizing' ? 'Optimizing...' : 
                   uploadStatus === 'uploading' ? 'Uploading...' : 
                   'Processing...'}
                </Text>
                <Text style={styles.progressPercentage}>{Math.round(uploadProgress)}%</Text>
                {optimizationData && optimizationData.compressionRatio > 0 && (
                  <Text style={styles.compressionInfo}>
                    Size reduced by {Math.round(optimizationData.compressionRatio * 100)}%
                  </Text>
                )}
              </View>
            )}
            
            {uploadStatus === 'failed' && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Upload failed. Please try again.</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#6366F1',
  },
  headerInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  conversationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  mediaButton: {
    padding: 8,
  },
  mediaButtonText: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessageBubble: {
    backgroundColor: '#6366F1',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  videoContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageStatus: {
    marginLeft: 4,
  },
  statusIcon: {
    fontSize: 12,
    color: '#999',
  },
  readStatus: {
    color: '#6366F1',
  },
  deleteButton: {
    marginTop: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#EF4444',
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  mediaPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  mediaOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mediaOptionText: {
    fontSize: 18,
    color: '#333',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  previewContainer: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  previewCloseButton: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  previewSendButton: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
    resizeMode: 'contain',
  },
  previewVideoContainer: {
    position: 'relative',
  },
  previewVideo: {
    width: screenWidth,
    height: screenHeight * 0.7,
    resizeMode: 'contain',
  },
  previewPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlayButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  compressionInfo: {
    color: '#4CAF50',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,0,0,0.8)',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ChatRoom;
