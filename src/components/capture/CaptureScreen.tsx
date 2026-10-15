/**
 * Màn hình tiếp nhận và chụp/tải ảnh phục vụ sàng lọc hình thái mi mắt.
 * Thiết kế giao diện thích ứng với cả hai chế độ Sáng và Tối (RemiCare Brand Guidelines).
 * Tuân thủ G4: Tuyệt đối không dùng từ ngữ thuộc danh mục cấm.
 */

import React, { useState } from 'react';
import { Camera, ArrowRight, Sparkles, Check, AlertCircle, Video } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';
import { CameraView } from './CameraView';

interface CaptureScreenProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  selectedFile,
  onFileSelect,
  onClearFile,
  onSubmit,
  isAnalyzing,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Thẻ hướng dẫn chụp ảnh đạt chuẩn */}
      <div className="bg-[#E1F4F0]/60 dark:bg-[#0D2327]/80 border border-[#B8E8DF] dark:border-[#1A3F45] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors duration-250">
        <div className="flex items-center space-x-2.5 mb-3 text-[#00AB9B]">
          <Sparkles className="w-5 h-5 text-[#00AB9B]" />
          <h3 className="font-semibold text-sm sm:text-base text-[#00545D] dark:text-[#F9F8F2]">
            Quy chuẩn Chụp ảnh Khuôn mặt Chính xác
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start space-x-2 p-3 bg-white/80 dark:bg-[#122D32]/60 rounded-xl border border-[#B8E8DF]/60 dark:border-[#1A3F45] text-[#00545D] dark:text-[#F9F8F2]">
            <Check className="w-4 h-4 text-[#00AB9B] flex-shrink-0 mt-0.5" />
            <span className="text-[#267A78] dark:text-[#6FB4AF]">Đầu giữ thẳng thăng bằng, không nghiêng sang bên hoặc ngửa/cúi.</span>
          </div>
          <div className="flex items-start space-x-2 p-3 bg-white/80 dark:bg-[#122D32]/60 rounded-xl border border-[#B8E8DF]/60 dark:border-[#1A3F45] text-[#00545D] dark:text-[#F9F8F2]">
            <Check className="w-4 h-4 text-[#00AB9B] flex-shrink-0 mt-0.5" />
            <span className="text-[#267A78] dark:text-[#6FB4AF]">Mắt nhìn thẳng trực diện vào ống kính camera với biểu cảm thư giãn.</span>
          </div>
          <div className="flex items-start space-x-2 p-3 bg-white/80 dark:bg-[#122D32]/60 rounded-xl border border-[#B8E8DF]/60 dark:border-[#1A3F45] text-[#00545D] dark:text-[#F9F8F2]">
            <Check className="w-4 h-4 text-[#00AB9B] flex-shrink-0 mt-0.5" />
            <span className="text-[#267A78] dark:text-[#6FB4AF]">Ánh sáng phân bố đều, rõ nét hai mắt, nên bật đèn flash khi chụp.</span>
          </div>
        </div>
      </div>

      {/* Vùng nạp ảnh: Hỗ trợ cả Tải tệp lên và Chụp trực tiếp qua WebRTC */}
      <div className="bg-white dark:bg-[#0D2327] border border-[#B8E8DF] dark:border-[#1A3F45] rounded-2xl p-6 sm:p-8 shadow-remi-card dark:shadow-remi-card-dark transition-colors duration-250">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#267A78] dark:text-[#6FB4AF]">
            Phương thức cung cấp ảnh
          </span>

          <div className="relative group">
            <button
              type="button"
              disabled
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#E1F4F0]/40 dark:bg-[#122D32]/40 text-[#267A78]/60 dark:text-[#6FB4AF]/50 text-xs font-semibold border border-[#B8E8DF]/50 dark:border-[#1A3F45]/50 cursor-not-allowed select-none"
              title="Tính năng chụp ảnh trực tiếp qua camera đang được tối ưu hóa đa khung hình (Sắp ra mắt)"
            >
              <Video className="w-3.5 h-3.5 text-[#267A78]/50" />
              <span>Chụp trực tiếp</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F2C66D]/20 text-[#00545D] dark:text-[#F2C66D] border border-[#F2C66D]/50">
                Coming Soon
              </span>
            </button>
          </div>
        </div>

        <FileUploadZone
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onClearFile={onClearFile}
          validationError={validationError}
          setValidationError={setValidationError}
        />

        {/* Modal Camera trực tiếp */}
        {isCameraOpen && (
          <CameraView
            onCapture={(file) => {
              onFileSelect(file);
              setIsCameraOpen(false);
            }}
            onClose={() => setIsCameraOpen(false)}
          />
        )}

        {/* Nút gửi ảnh phân tích */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#B8E8DF] dark:border-[#1A3F45]">
          <div className="flex items-center space-x-2 text-xs text-[#267A78] dark:text-[#6FB4AF]">
            <AlertCircle className="w-4 h-4 text-[#00AB9B] flex-shrink-0" />
            <span>Ảnh được xử lý hoàn toàn trong RAM và hủy ngay lập tức.</span>
          </div>

          <button
            id="btn-submit-screening"
            disabled={!selectedFile || Boolean(validationError) || isAnalyzing}
            onClick={onSubmit}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              selectedFile && !validationError && !isAnalyzing
                ? 'bg-[#00AB9B] text-[#F9F8F2] hover:bg-[#267A78] shadow-remi-button cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-[#B8E8DF]/50 dark:bg-[#1A3F45]/50 text-[#267A78]/60 dark:text-[#6FB4AF]/50 border border-[#B8E8DF] dark:border-[#1A3F45] cursor-not-allowed opacity-60'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-[#F9F8F2] border-t-transparent rounded-full animate-spin" />
                <span>Đang phân tích hình thái...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Tiến hành sàng lọc</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
