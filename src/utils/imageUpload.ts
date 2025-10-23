import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export interface UploadResult {
  url: string;
  path: string;
}

export interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error?: string;
}

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param folder - Storage folder (portfolio, services, hero, about)
 * @param filename - Optional custom filename (auto-generated if not provided)
 * @returns Promise with download URL and storage path
 */
export const uploadImage = async (
  file: File,
  folder: 'portfolio' | 'services' | 'hero' | 'about' | 'profiles' | 'sessions',
  filename?: string
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Generate filename if not provided
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const finalFilename = filename || `${timestamp}.${extension}`;

    // Create storage reference
    const storageRef = ref(storage, `images/${folder}/${finalFilename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * @param imagePath - The storage path of the image to delete
 */
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for delete operations to avoid blocking other operations
  }
};

/**
 * Extract storage path from Firebase Storage URL
 * @param url - Firebase Storage download URL
 * @returns Storage path or null if not a Firebase Storage URL
 */
export const getStoragePathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('firebasestorage.googleapis.com')) {
      const pathMatch = url.match(/\/o\/(.+?)\?/);
      return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Validate image file before upload
 * @param file - File to validate
 * @returns Validation result
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!supportedFormats.includes(file.type)) {
    return { isValid: false, error: 'Supported formats: JPEG, PNG, WebP, GIF' };
  }

  return { isValid: true };
};

/**
 * Resize image before upload (optional optimization)
 * @param file - Original image file
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Resized image file
 */
export const resizeImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
