import React, { useState, useRef } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { uploadImage, validateImageFile } from '../../utils/imageUpload';

interface MultipleImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  folder: 'portfolio' | 'services' | 'hero' | 'about' | 'profiles' | 'sessions';
  placeholder?: string;
  className?: string;
  maxFiles?: number;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
  folder,
  placeholder = "Upload multiple images",
  className = "",
  maxFiles = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    setUploading(true);

    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        setUploading(false);
        return;
      }
    }

    if (fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      setUploading(false);
      return;
    }

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        const fileKey = `${file.name}-${index}`;
        setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));

        try {
          const result = await uploadImage(file, folder);
          setUploadProgress(prev => ({ ...prev, [fileKey]: 100 }));
          return result.url;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange(uploadedUrls);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload some images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isUploading = uploading || Object.keys(uploadProgress).length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isUploading 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="text-sm text-blue-600">
                Uploading images...
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                <Plus className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  {placeholder}
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop multiple images or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max {maxFiles} files • PNG, JPG, WebP up to 5MB each
                </p>
              </div>
            </>
          )}
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.entries(uploadProgress).map(([fileKey, progress]) => (
              <div key={fileKey} className="text-left">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{fileKey.split('-')[0]}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500">
        <p>• Select multiple images at once for batch upload</p>
        <p>• All images will be uploaded simultaneously</p>
        <p>• Supported formats: JPEG, PNG, WebP, GIF</p>
      </div>
    </div>
  );
};

export default MultipleImageUpload;
