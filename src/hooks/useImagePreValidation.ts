/**
 * Hook kiểm tra hợp lệ phía Client trước khi gửi ảnh lên Backend (Client Pre-validation).
 * Kiểm tra MIME type, đuôi tệp và dung lượng trong giới hạn cho phép (50KB - 15MB).
 * Tuân thủ G4: Tuyệt đối không dùng từ ngữ thuộc danh mục cấm.
 */

import { useCallback } from 'react';

export const MIN_FILE_SIZE_BYTES = 50 * 1024; // 50 KB
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

export interface PreValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Hàm kiểm tra hợp lệ tệp ảnh độc lập, có thể kiểm thử đơn vị trực tiếp.
 */
export function validateImageFile(file: File): PreValidationResult {
  // 1. Kiểm tra định dạng tệp (MIME type và extension)
  const fileExtension = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());
  const isExtensionValid = ALLOWED_EXTENSIONS.includes(fileExtension);

  if (!isMimeValid && !isExtensionValid) {
    return {
      isValid: false,
      errorMessage: 'Định dạng tệp không được hỗ trợ. Vui lòng chỉ tải lên tệp ảnh (JPEG, PNG, WebP hoặc HEIC).',
    };
  }

  // 2. Kiểm tra dung lượng tối thiểu (50KB)
  if (file.size < MIN_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorMessage: 'Dung lượng tệp quá nhỏ (< 50KB). Vui lòng chọn ảnh chụp có độ phân giải và chất lượng tốt hơn.',
    };
  }

  // 3. Kiểm tra dung lượng tối đa (15MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorMessage: 'Dung lượng tệp vượt quá giới hạn 15MB. Vui lòng tối ưu kích thước ảnh trước khi tải lên.',
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

export function useImagePreValidation() {
  const validateFile = useCallback((file: File): PreValidationResult => {
    return validateImageFile(file);
  }, []);

  return { validateFile, MIN_FILE_SIZE_BYTES, MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES };
}
