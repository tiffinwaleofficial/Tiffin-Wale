/**
 * Enhanced File Upload Zone Component
 * Multi-file drag & drop with preview, progress tracking, and deletion
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, Video, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cloudinaryService, UploadType, UploadResult } from '@/services/cloudinaryService';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  cloudinaryUrl?: string;
  publicId?: string;
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface FileUploadZoneProps {
  uploadType: UploadType;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  onFilesChange?: (files: UploadedFile[]) => void;
  showPreviews?: boolean;
  allowDelete?: boolean;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function FileUploadZone({
  uploadType,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes,
  onUploadComplete,
  onUploadError,
  onFilesChange,
  showPreviews = true,
  allowDelete = true,
  className,
  disabled = false,
  multiple = true
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Generate preview for file
  const generatePreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    const filesToProcess = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);
    const currentFileCount = uploadedFiles.length;
    const availableSlots = maxFiles - currentFileCount;
    const finalFiles = filesToProcess.slice(0, availableSlots);

    if (finalFiles.length === 0) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Create initial file objects
    const newFiles: UploadedFile[] = finalFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: generatePreview(file),
      uploadProgress: 0,
      uploadStatus: 'pending' as const
    }));

    // Add to state immediately
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Start uploading each file
    for (const fileObj of newFiles) {
      await uploadFile(fileObj);
    }
  }, [uploadedFiles, maxFiles, disabled, multiple, uploadType, onUploadError, onFilesChange]);

  // Upload individual file
  const uploadFile = async (fileObj: UploadedFile) => {
    try {
      // Validate file
      const validation = cloudinaryService.validateFile(fileObj.file, uploadType);
      if (!validation.valid) {
        updateFileStatus(fileObj.id, 'error', validation.error);
        return;
      }

      // Update status to uploading
      updateFileStatus(fileObj.id, 'uploading');

      // Upload to Cloudinary
      const result = await cloudinaryService.uploadFile(
        fileObj.file,
        uploadType,
        undefined,
        (progress) => updateFileProgress(fileObj.id, progress)
      );

      if (result.success && result.url && result.publicId) {
        // Update with success
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                cloudinaryUrl: result.url,
                publicId: result.publicId,
                uploadStatus: 'success' as const,
                uploadProgress: 100
              }
            : f
        ));

        // Check if all files are uploaded
        const allFiles = uploadedFiles.map(f => 
          f.id === fileObj.id 
            ? { ...f, cloudinaryUrl: result.url, uploadStatus: 'success' as const }
            : f
        );
        
        if (allFiles.every(f => f.uploadStatus === 'success')) {
          onUploadComplete?.(allFiles);
        }
      } else {
        updateFileStatus(fileObj.id, 'error', result.error || 'Upload failed');
      }
    } catch (error) {
      updateFileStatus(fileObj.id, 'error', error instanceof Error ? error.message : 'Upload failed');
    }
  };

  // Update file status
  const updateFileStatus = (fileId: string, status: UploadedFile['uploadStatus'], error?: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, uploadStatus: status, error }
        : f
    ));
  };

  // Update file progress
  const updateFileProgress = (fileId: string, progress: number) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, uploadProgress: progress }
        : f
    ));
  };

  // Remove file
  const removeFile = async (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (!fileToRemove) return;

    // If file was uploaded to Cloudinary, delete it
    if (fileToRemove.publicId && fileToRemove.uploadStatus === 'success') {
      try {
        await cloudinaryService.deleteFile(fileToRemove.publicId);
      } catch (error) {
        console.warn('Failed to delete file from Cloudinary:', error);
      }
    }

    // Clean up preview URL
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    // Remove from state
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (file.type === 'application/pdf') return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: acceptedTypes ? acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}) : undefined,
    maxFiles: multiple ? maxFiles : 1,
    maxSize: maxSize * 1024 * 1024,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  });

  const canAddMore = uploadedFiles.length < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Zone */}
      {canAddMore && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200',
            'hover:border-primary/50 hover:bg-primary/5',
            {
              'border-primary bg-primary/10': isDragActive || dropzoneActive,
              'border-gray-300': !isDragActive && !dropzoneActive,
              'border-red-400 bg-red-50': false, // Add error state if needed
              'opacity-50 cursor-not-allowed': disabled
            }
          )}
        >
          <input {...getInputProps()} />
          
          <div className="text-center">
            <Upload className={cn(
              'h-12 w-12 mx-auto mb-4 transition-colors',
              isDragActive ? 'text-primary' : 'text-gray-400'
            )} />
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to select files
              </p>
              <p className="text-xs text-gray-400">
                Max {maxFiles} files, {maxSize}MB each
                {acceptedTypes && ` • ${acceptedTypes.join(', ')}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Previews */}
      {showPreviews && uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          <div className="grid gap-3">
            {uploadedFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-white"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded">
                      {getFileIcon(fileObj.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* Progress Bar */}
                  {fileObj.uploadStatus === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileObj.uploadProgress} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        {fileObj.uploadProgress}% uploaded
                      </p>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {fileObj.uploadStatus === 'error' && fileObj.error && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fileObj.error}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {fileObj.uploadStatus === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {fileObj.uploadStatus === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {fileObj.uploadStatus === 'uploading' && (
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {/* Delete Button */}
                {allowDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileObj.id)}
                    className="flex-shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploadZone;