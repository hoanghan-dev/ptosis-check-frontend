import { describe, it, expect } from 'vitest';
import { validateImageFile } from '../hooks/useImagePreValidation';

describe('validateImageFile Client Pre-validation Tests', () => {
  it('TC-1.1: chấp thuận ảnh JPEG 500KB hợp lệ', () => {
    const file = new File([new Uint8Array(500 * 1024)], 'test_face.jpg', {
      type: 'image/jpeg',
    });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it('TC-1.2: từ chối file PDF 1MB không phải ảnh', () => {
    const file = new File([new Uint8Array(1024 * 1024)], 'document.pdf', {
      type: 'application/pdf',
    });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('Định dạng tệp không được hỗ trợ');
  });

  it('TC-1.3: từ chối ảnh > 15MB (ví dụ: 20MB)', () => {
    const file = new File([new Uint8Array(20 * 1024 * 1024)], 'huge_photo.jpg', {
      type: 'image/jpeg',
    });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('vượt quá giới hạn 15MB');
  });

  it('TC-1.4: từ chối ảnh < 50KB (ví dụ: 30KB)', () => {
    const file = new File([new Uint8Array(30 * 1024)], 'tiny_thumb.jpg', {
      type: 'image/jpeg',
    });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('quá nhỏ (< 50KB)');
  });

  it('TC-1.5: chấp thuận ảnh đúng ngưỡng biên 50KB', () => {
    const file = new File([new Uint8Array(50 * 1024)], 'border_50kb.jpg', {
      type: 'image/jpeg',
    });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });
});
