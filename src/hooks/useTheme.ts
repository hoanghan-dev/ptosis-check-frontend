/**
 * Hook quản lý chế độ giao diện Sáng / Tối (Theme Mode) cho RemiCare PtosisCheck.
 * Tự động đồng bộ với cấu hình hệ điều hành và lưu tùy chọn vào localStorage.
 * Tuân thủ G4: Tuyệt đối không dùng từ ngữ thuộc danh mục cấm.
 */

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'remicare-theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 1. Kiểm tra tùy chọn đã lưu trong localStorage
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {
      // Bỏ qua lỗi truy cập localStorage nếu có
    }

    // 2. Mặc định kiểm tra chế độ hệ thống (System Preference)
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Bỏ qua lỗi lưu localStorage
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
