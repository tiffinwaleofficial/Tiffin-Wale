import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, ThumbsUp, Play } from 'lucide-react-native';
import { Review } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: string, isHelpful: boolean) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onMarkHelpful }) => {
  const { user } = useAuthStore();
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleMarkHelpful = () => {
    if (!review.id || review.id === 'undefined') {
      console.error('❌ ReviewCard: Invalid review ID:', review.id);
      return;
    }

    const newIsHelpful = !isHelpful;
    const newCount = newIsHelpful ? helpfulCount + 1 : helpfulCount - 1;
    
    setIsHelpful(newIsHelpful);
    setHelpfulCount(newCount);
    
    console.log('🔍 ReviewCard: Marking helpful for review:', review.id, 'isHelpful:', newIsHelpful);
    onMarkHelpful?.(review.id, newIsHelpful);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        fill={index < rating ? "#FFD700" : "transparent"}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {(review.user?.firstName || review.user?.name || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {review.user?.firstName && review.user?.lastName 
              ? `${review.user.firstName} ${review.user.lastName}`
              : review.user?.name || 'Anonymous User'
            }
          </Text>
          <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {renderStars(review.rating)}
        </View>
        <Text style={styles.ratingText}>{review.rating}/5</Text>
      </View>

      {/* Comment */}
      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}

      {/* Review Media */}
      {review.images && review.images.length > 0 && (
        <View style={styles.mediaContainer}>
          {review.images.slice(0, 3).map((mediaUrl, index) => {
            // Simple check if it's a video (could be enhanced with better detection)
            const isVideo = mediaUrl.includes('video') || mediaUrl.includes('.mp4') || mediaUrl.includes('.mov');
            
            return (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri: mediaUrl }} style={styles.reviewMedia} />
                {isVideo && (
                  <View style={styles.videoOverlay}>
                    <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Helpful Button */}
      <TouchableOpacity 
        style={styles.helpfulButton}
        onPress={handleMarkHelpful}
      >
        <ThumbsUp 
          size={16} 
          color={isHelpful ? "#FF9B42" : "#666"} 
          fill={isHelpful ? "#FF9B42" : "transparent"}
        />
        <Text style={[styles.helpfulText, isHelpful && styles.helpfulTextActive]}>
          Helpful ({helpfulCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9B42',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Poppins-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
  },
  comment: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  mediaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
  },
  reviewMedia: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  helpfulText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  helpfulTextActive: {
    color: '#FF9B42',
    fontWeight: '600',
  },
});
