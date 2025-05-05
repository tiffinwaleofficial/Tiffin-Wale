import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Rating({
  defaultValue = 0,
  value,
  onChange,
  max = 5,
  readonly = false,
  size = 'md',
  className,
}: RatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(defaultValue);
  
  const rating = value !== undefined ? value : currentRating;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  
  const starSize = sizeClasses[size];
  
  const handleClick = (newRating: number) => {
    if (readonly) return;
    
    setCurrentRating(newRating);
    onChange?.(newRating);
  };
  
  const handleMouseEnter = (rating: number) => {
    if (readonly) return;
    setHoveredRating(rating);
  };
  
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredRating(null);
  };
  
  return (
    <div 
      className={cn("flex space-x-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starRating = i + 1;
        const isActive = hoveredRating !== null 
          ? starRating <= hoveredRating
          : starRating <= rating;
        
        return (
          <button
            key={`star-${i}`}
            type="button"
            onClick={() => handleClick(starRating)}
            onMouseEnter={() => handleMouseEnter(starRating)}
            className={cn(
              "focus:outline-none transition-colors",
              readonly ? "cursor-default" : "cursor-pointer"
            )}
            disabled={readonly}
            aria-label={`Rate ${starRating} out of ${max}`}
          >
            <Star
              className={cn(
                starSize,
                "transition-colors",
                isActive 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300 hover:text-yellow-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
} 