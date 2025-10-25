/**
 * Enhanced Image Gallery Component
 * Displays images with lightbox, deletion, and reordering capabilities
 */

import React, { useState } from 'react';
import { X, ZoomIn, Download, Trash2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cloudinaryService } from '@/services/cloudinaryService';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  id: string;
  url: string;
  publicId?: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  onDelete?: (imageId: string) => void;
  onReorder?: (newOrder: GalleryImage[]) => void;
  showFullscreen?: boolean;
  showDeleteButton?: boolean;
  showDownloadButton?: boolean;
  allowReorder?: boolean;
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export function ImageGallery({
  images,
  onDelete,
  onReorder,
  showFullscreen = true,
  showDeleteButton = false,
  showDownloadButton = false,
  allowReorder = false,
  className,
  columns = 3,
  aspectRatio = 'square'
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Handle image deletion
  const handleDelete = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        await cloudinaryService.deleteFile(image.publicId);
      } catch (error) {
        console.warn('Failed to delete from Cloudinary:', error);
      }
    }

    onDelete?.(imageId);
  };

  // Handle image download
  const handleDownload = async (image: GalleryImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!allowReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    if (!allowReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!allowReorder || draggedIndex === null) return;
    
    e.preventDefault();
    
    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    onReorder?.(newImages);
    setDraggedIndex(null);
  };

  // Get grid columns class
  const getGridClass = () => {
    const colsMap = {
      2: 'grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
    };
    return colsMap[columns];
  };

  // Get aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      default: return '';
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No images to display</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('grid gap-4', getGridClass(), className)}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              'relative group overflow-hidden rounded-lg bg-gray-100',
              getAspectClass(),
              allowReorder && 'cursor-move',
              draggedIndex === index && 'opacity-50'
            )}
            draggable={allowReorder}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Image */}
            <img
              src={image.thumbnail || image.url}
              alt={image.alt || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />

            {/* Action Buttons */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                {/* Fullscreen Button */}
                {showFullscreen && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedImage(image)}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                )}

                {/* Download Button */}
                {showDownloadButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(image)}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                {/* Delete Button */}
                {showDeleteButton && onDelete && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500 text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Drag Handle */}
            {allowReorder && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-1 bg-white/90 rounded">
                  <Move className="h-3 w-3 text-gray-600" />
                </div>
              </div>
            )}

            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-medium">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Full Size Image */}
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || 'Full size image'}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Caption */}
              {selectedImage.caption && (
                <div className="p-4 bg-white border-t">
                  <p className="text-gray-700">{selectedImage.caption}</p>
                </div>
              )}

              {/* Action Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                {showDownloadButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(selectedImage)}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}

                {showDeleteButton && onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      handleDelete(selectedImage.id);
                      setSelectedImage(null);
                    }}
                    className="bg-red-500/90 hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ImageGallery;