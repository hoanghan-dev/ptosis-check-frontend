/**
 * Nút chuyển đổi giao diện Sáng / Tối (Theme Toggle) theo chuẩn RemiCare.
 * Tuân thủ G4: Tuyệt đối không dùng từ ngữ thuộc danh mục cấm.
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      title={isDark ? 'Giao diện sáng' : 'Giao diện tối'}
      className="p-2 rounded-xl bg-[#E1F4F0] dark:bg-[#0D2327] hover:bg-[#B8E8DF] dark:hover:bg-[#122D32] border border-[#B8E8DF] dark:border-[#1A3F45] text-[#00545D] dark:text-[#F2C66D] transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00AB9B]/40"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#F2C66D] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#00545D] transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
