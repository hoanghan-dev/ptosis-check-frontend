/**
 * Ứng dụng Frontend RemiCare PtosisCheck - Quản lý State Machine Sàng lọc Hình thái Mi mắt.
 * Thiết kế giao diện hỗ trợ chuyển đổi linh hoạt giữa giao diện Sáng (Light) và Tối (Dark).
 * Tuân thủ G1: Client chỉ làm nhiệm vụ giao diện và tiền kiểm tra;
 * Tuân thủ G2: Zero-retention RAM;
 * Tuân thủ G4: Tuyệt đối không sử dụng từ ngữ thuộc danh mục cấm.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import type { ScreeningStep, ScreeningError } from './types/screening-state';
import type { ImageType, MeasurementPayload, QualityRejection } from './types/api-contracts';
import { useScreeningApi } from './hooks/useScreeningApi';
import { useTheme } from './hooks/useTheme';
import { ConsentDialog } from './components/common/ConsentDialog';
import { CaptureScreen } from './components/capture/CaptureScreen';
import { ThemeToggle } from './components/common/ThemeToggle';
import { QualityErrorModal } from './components/common/QualityErrorModal';
import { ResultScreen } from './components/result/ResultScreen';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('CONSENT');
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState<ImageType>('fullface');
  const [payload, setPayload] = useState<MeasurementPayload | null>(null);
  const [error, setError] = useState<ScreeningError | null>(null);

  const { isLoading, analyzeImage } = useScreeningApi();
  const { isDark, toggleTheme } = useTheme();

  const handleConsentAccept = () => {
    setHasConsented(true);
    setCurrentStep('READY_TO_CAPTURE');
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleSubmitScreening = async () => {
    if (!selectedFile || !hasConsented) return;

    setCurrentStep('ANALYZING');
    setError(null);

    try {
      const result = await analyzeImage(selectedFile, imageType);
      setPayload(result);
      setCurrentStep('RESULT');
    } catch (err: unknown) {
      const rejection = (err as { rejection?: QualityRejection })?.rejection;
      if (rejection) {
        setError({
          type: 'QUALITY_GATE',
          title: 'Ảnh chưa đạt tiêu chuẩn sàng lọc',
          message: rejection.rejection_message_vi || 'Hình ảnh không đạt chuẩn chất lượng.',
          rejection,
        });
      } else {
        const rawMessage = err instanceof Error ? err.message : '';
        const isNetworkError =
          rawMessage.includes('Failed to fetch') ||
          rawMessage.includes('Network') ||
          rawMessage.includes('fetch');
        setError({
          type: 'SERVER',
          title: isNetworkError ? 'Không thể kết nối máy chủ' : 'Không thể hoàn tất sàng lọc',
          message: isNetworkError
            ? 'Không thể kết nối đến máy chủ phân tích. Vui lòng đảm bảo dịch vụ Backend đang chạy trên cổng 8000 (uvicorn app.main:app).'
            : (rawMessage || 'Có lỗi không xác định xảy ra trong quá trình gửi ảnh.'),
        });
      }
      setCurrentStep('ERROR');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPayload(null);
    setError(null);
    setCurrentStep('READY_TO_CAPTURE');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F2] dark:bg-[#071619] text-[#00545D] dark:text-[#F9F8F2] flex flex-col selection:bg-[#00AB9B] selection:text-[#F9F8F2] transition-colors duration-250">
      {/* Thanh Header Điều hướng chuẩn RemiCare */}
      <header className="sticky top-0 z-40 border-b border-[#B8E8DF]/70 dark:border-[#1A3F45]/80 bg-[#F9F8F2]/90 dark:bg-[#071619]/90 backdrop-blur-xl transition-colors duration-250 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            {/* Website Logo: Tệp ảnh logo-remi.svg trong suốt */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00AB9B] rounded-lg cursor-pointer"
              title="Về trang chủ sàng lọc RemiCare PtosisCheck"
            >
              <img
                src="/logo-remi.svg"
                alt="RemiCare Logo"
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>

            <div className="h-7 w-px bg-[#B8E8DF] dark:bg-[#1A3F45] hidden sm:block" />

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold text-[#00545D] dark:text-[#F9F8F2] tracking-tight leading-none">
                  PtosisCheck
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-[#E1F4F0] dark:bg-[#122D32] text-[#00AB9B] dark:text-[#6FB4AF] border border-[#B8E8DF] dark:border-[#1A3F45]">
                  AI Vision
                </span>
              </div>
              <p className="text-[11px] text-[#267A78] dark:text-[#6FB4AF] font-medium hidden sm:block mt-0.5">
                Hệ thống Sàng lọc Hình thái Mi mắt
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs">
            {/* Huy hiệu Bảo mật Zero-Retention RAM */}
            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E1F4F0]/80 dark:bg-[#0D2327] border border-[#B8E8DF] dark:border-[#1A3F45] text-[#00545D] dark:text-[#F9F8F2] shadow-xs"
              title="Tuân thủ G2: Xử lý 100% trong RAM, tuyệt đối không lưu trữ ảnh trên máy chủ"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AB9B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00AB9B]"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00AB9B] flex-shrink-0" />
              <span className="font-semibold text-[11px] hidden md:inline tracking-tight">
                Zero-Retention RAM
              </span>
              <span className="font-semibold text-[11px] md:hidden tracking-tight">
                RAM Safe
              </span>
            </div>

            {/* Nút chuyển đổi giao diện Sáng / Tối */}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Vùng Nội dung Chính */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Bước 1: Cam kết quyền riêng tư (SP-004) */}
        {currentStep === 'CONSENT' && (
          <ConsentDialog onAccept={handleConsentAccept} />
        )}

        {/* Bước 2: Nạp ảnh & Bắt đầu phân tích */}
        {(currentStep === 'READY_TO_CAPTURE' || currentStep === 'ANALYZING') && (
          <CaptureScreen
            selectedFile={selectedFile}
            imageType={imageType}
            onImageTypeChange={setImageType}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
            onSubmit={handleSubmitScreening}
            isAnalyzing={isLoading || currentStep === 'ANALYZING'}
          />
        )}

        {/* Bước 3: Hiển thị Kết quả Sàng lọc Hoàn thiện (Phase 8) */}
        {currentStep === 'RESULT' && payload && (
          <ResultScreen
            payload={payload}
            selectedFile={selectedFile}
            onReset={handleReset}
          />
        )}

        {/* Màn hình Báo lỗi hoặc Modal Cổng Chất lượng */}
        {currentStep === 'ERROR' && error && (
          error.type === 'QUALITY_GATE' && error.rejection ? (
            <QualityErrorModal
              rejection={error.rejection}
              onRetry={handleReset}
              onClose={handleReset}
            />
          ) : (
            <div className="w-full max-w-lg mx-auto bg-white dark:bg-[#0D2327] border border-[#F28C7B]/60 dark:border-[#F28C7B]/40 rounded-2xl p-6 sm:p-8 shadow-remi-card dark:shadow-remi-card-dark text-center space-y-4 transition-colors duration-250">
              <div className="w-12 h-12 rounded-full bg-[#F28C7B]/15 border border-[#F28C7B]/40 mx-auto flex items-center justify-center text-[#F28C7B]">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#00545D] dark:text-[#F9F8F2]">{error.title}</h3>
              <p className="text-sm text-[#267A78] dark:text-[#6FB4AF] leading-relaxed">{error.message}</p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-[#00AB9B] hover:bg-[#267A78] text-[#F9F8F2] text-xs font-semibold transition cursor-pointer shadow-remi-button"
                >
                  Thử lại với ảnh khác
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Chân trang RemiCare với thông cáo an toàn phi can thiệp y tế (FR-029 / G4) */}
      <footer className="border-t border-[#B8E8DF] dark:border-[#1A3F45] bg-[#E1F4F0]/60 dark:bg-[#0D2327]/60 py-5 text-center text-xs text-[#267A78] dark:text-[#6FB4AF] px-4 space-y-2 transition-colors duration-250">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <img
            src="/logo-remi.svg"
            alt="RemiCare Logo"
            className="h-6 w-auto object-contain opacity-85"
          />
        </div>
        <p className="text-[#00545D] dark:text-[#F9F8F2] font-medium max-w-2xl mx-auto">
          PtosisCheck là hệ thống hỗ trợ sàng lọc hình thái học ban đầu dựa trên thị giác máy tính, tuyệt đối không thay thế cho các chỉ định thăm khám chuyên sâu của bác sĩ chuyên khoa mắt.
        </p>
        <p className="text-[11px] text-[#267A78] dark:text-[#6FB4AF]">
          Tuân thủ Nghị định 13/2023/NĐ-CP & Điều 9 GDPR: Dữ liệu ảnh chỉ xử lý trên RAM khả biến, không lưu trữ đĩa cứng server.
        </p>
      </footer>
    </div>
  );
};

export default App;
