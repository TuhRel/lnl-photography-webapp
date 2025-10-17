import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, deleteImage, validateImageFile, getStoragePathFromUrl } from '../../utils/imageUpload';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  folder: 'portfolio' | 'services' | 'hero' | 'about' | 'profiles';
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  maxWidth?: number;
  maxHeight?: number;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  folder,
  aspectRatio = 'auto',
  maxWidth = 400,
  maxHeight = 300,
  placeholder = 'Click to upload image',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: ''
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Delete old image if it exists and is from Firebase Storage
      if (currentImageUrl) {
        const oldImagePath = getStoragePathFromUrl(currentImageUrl);
        if (oldImagePath) {
          await deleteImage(oldImagePath);
        }
      }

      // Upload new image
      const result = await uploadImage(file, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update parent component
      onImageChange(result.url);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setError(error instanceof Error ? error.message : 'Upload failed');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    try {
      // Delete from Firebase Storage if it's a Firebase URL
      const imagePath = getStoragePathFromUrl(currentImageUrl);
      if (imagePath) {
        await deleteImage(imagePath);
      }
      
      // Update parent component
      onImageChange('');
      setError(null);
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from UI even if delete fails
      onImageChange('');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload area */}
      <div
        className={`
          relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden
          hover:border-gray-400 transition-colors cursor-pointer group
          ${aspectRatioClasses[aspectRatio]}
          ${!aspectRatio || aspectRatio === 'auto' ? `w-full` : ''}
        `}
        style={aspectRatio === 'auto' ? { maxWidth, maxHeight } : {}}
        onClick={openFileDialog}
      >
        {currentImageUrl && !isUploading ? (
          // Display current image
          <div className="relative w-full h-full">
            <img
              src={currentImageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with remove button */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Change image"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Upload placeholder
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-500">
            {isUploading ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Uploading...</p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium mb-1">{placeholder}</p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-600 text-sm mt-2 flex items-center">
          <X className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}

      {/* URL input fallback */}
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Or paste image URL:
        </label>
        <input
          type="url"
          value={currentImageUrl || ''}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
