/**
 * Accordion Chi tiết Các Chỉ số Đo lường Bán định lượng (Module M8 / FR-017, FR-018, FR-031).
 * Công bố dung sai kỹ thuật số +-0.5 mm, hệ số quy đổi HVID và các tham số đối xứng hai bên.
 * Tuân thủ tuyệt đối G4: Không dùng từ ngữ thuộc danh mục cấm.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Camera,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { MeasurementPayload, SingleEyeMeasurement } from '../../types/api-contracts';

interface MeasurementDetailsProps {
  payload: MeasurementPayload;
}

export const MeasurementDetails: React.FC<MeasurementDetailsProps> = ({ payload }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { measurements, bilateral_comparison, scale_reference, image_quality_audit } = payload;
  const od = measurements.right_eye_od;
  const os = measurements.left_eye_os;

  const getStatusBadge = (singleEye: SingleEyeMeasurement) => {
    const { status, confidence_score: confidence, reflex_visibility, warning_flags, mrd1_mm } = singleEye;
    const isOccluded =
      reflex_visibility === 'OCCLUDED_BY_LID' ||
      warning_flags?.includes('REFLEX_OCCLUDED_BY_UPPER_LID') ||
      warning_flags?.includes('REFLEX_OCCLUDED_BY_LID') ||
      warning_flags?.includes('ANATOMICAL_NEGATIVE_SUSPECTED');
    const isQualityIssue =
      reflex_visibility === 'NOT_VISIBLE_QUALITY' ||
      warning_flags?.includes('REFLEX_NOT_VISIBLE_QUALITY') ||
      warning_flags?.includes('IMAGE_UNDEREXPOSED_OR_DIFFUSE');

    if (status === 'MEASUREMENT_UNAVAILABLE' || mrd1_mm === null) {
      if (isOccluded) {
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 text-[11px] font-semibold">
            <AlertCircle className="w-3 h-3" />
            <span>Không thể đo (Che phủ bờ mi)</span>
          </span>
        );
      }
      if (isQualityIssue) {
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
            <AlertCircle className="w-3 h-3" />
            <span>Không thể đo (Thiếu sáng)</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 text-[11px] font-semibold">
          <AlertCircle className="w-3 h-3" />
          <span>Không khả dụng</span>
        </span>
      );
    }
    if (status === 'VALID') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
          <CheckCircle className="w-3 h-3" />
          <span>Hợp lệ ({Math.round(confidence * 100)}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
        <AlertCircle className="w-3 h-3" />
        <span>Tin cậy thấp ({Math.round(confidence * 100)}%)</span>
      </span>
    );
  };

  const getAsymmetryBadge = (classification: string) => {
    switch (classification) {
      case 'PHYSIOLOGICAL_SYMMETRY':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
            Đối xứng sinh lý (≤ 1.0 mm)
          </span>
        );
      case 'BORDERLINE_ASYMMETRY':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
            Bất đối xứng ranh giới (1.0 - 1.5 mm)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 text-[11px] font-semibold">
            Bất đối xứng đáng chú ý (&gt; 1.5 mm)
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#0D2327] border border-[#B8E8DF] dark:border-[#1A3F45] overflow-hidden shadow-remi-card dark:shadow-remi-card-dark transition-colors duration-250">
      {/* Nút bấm tiêu đề mở rộng Accordion */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-6 py-4.5 flex items-center justify-between text-left bg-white dark:bg-[#0D2327] hover:bg-[#E1F4F0]/40 dark:hover:bg-[#122D32]/50 transition cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#E1F4F0] dark:bg-[#122D32] border border-[#B8E8DF] dark:border-[#1A3F45] flex items-center justify-center text-[#00AB9B]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#00545D] dark:text-[#F9F8F2]">
              Thông Số Đo Lường Bán Định Lượng & Dung Sai Kỹ Thuật Số
            </h4>
            <p className="text-xs text-[#267A78] dark:text-[#6FB4AF] mt-0.5">
              Khoảng ước lượng danh định ±0.5 mm theo tiêu chuẩn nhân trắc học
            </p>
          </div>
        </div>

        <div className="text-[#267A78] dark:text-[#6FB4AF]">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Nội dung chi tiết các bảng đo lường */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-[#B8E8DF] dark:border-[#1A3F45] space-y-6 text-xs">
          {/* 1. Thẻ so sánh từng mắt OD & OS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mắt Phải (OD) */}
            <div className="p-4 rounded-xl bg-[#E1F4F0]/40 dark:bg-[#122D32]/40 border border-[#B8E8DF] dark:border-[#1A3F45] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#00545D] dark:text-[#F9F8F2]">Mắt Phải (OD)</span>
                {getStatusBadge(od)}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#071619] border border-black/5 dark:border-white/5">
                  <div className="text-[#267A78] dark:text-[#6FB4AF] text-[11px]">Khoảng MRD1 ước lượng</div>
                  <div className="text-base font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                    {od.mrd1_estimated_range || '--'}
                  </div>
                  <div className="text-[10px] text-[#267A78] dark:text-[#6FB4AF]">
                    Chỉ số: {od.mrd1_mm !== null && od.mrd1_mm !== undefined ? `${od.mrd1_mm.toFixed(2)} mm` : '--'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-[#071619] border border-black/5 dark:border-white/5">
                  <div className="text-[#267A78] dark:text-[#6FB4AF] text-[11px]">Chiều cao khe mi (PFH)</div>
                  <div className="text-base font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                    {od.pfh_mm ? `${od.pfh_mm.toFixed(1)} mm` : '--'}
                  </div>
                  <div className="text-[10px] text-[#267A78] dark:text-[#6FB4AF]">
                    {od.pfh_px ? `${od.pfh_px.toFixed(1)} px` : '--'}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#267A78] dark:text-[#6FB4AF] pt-1">
                Mốc quang học:{' '}
                <span className="font-semibold text-[#00545D] dark:text-[#F9F8F2]">
                  {od.reference_point_used === 'CORNEAL_LIGHT_REFLEX'
                    ? 'Phản quang giác mạc Purkinje'
                    : od.reference_point_used === 'NONE'
                    ? 'Không có mốc hợp lệ'
                    : 'Tâm đồng tử dự phòng'}
                </span>
              </div>
            </div>

            {/* Mắt Trái (OS) */}
            <div className="p-4 rounded-xl bg-[#E1F4F0]/40 dark:bg-[#122D32]/40 border border-[#B8E8DF] dark:border-[#1A3F45] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#00545D] dark:text-[#F9F8F2]">Mắt Trái (OS)</span>
                {getStatusBadge(os)}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#071619] border border-black/5 dark:border-white/5">
                  <div className="text-[#267A78] dark:text-[#6FB4AF] text-[11px]">Khoảng MRD1 ước lượng</div>
                  <div className="text-base font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                    {os.mrd1_estimated_range || '--'}
                  </div>
                  <div className="text-[10px] text-[#267A78] dark:text-[#6FB4AF]">
                    Chỉ số: {os.mrd1_mm !== null && os.mrd1_mm !== undefined ? `${os.mrd1_mm.toFixed(2)} mm` : '--'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-[#071619] border border-black/5 dark:border-white/5">
                  <div className="text-[#267A78] dark:text-[#6FB4AF] text-[11px]">Chiều cao khe mi (PFH)</div>
                  <div className="text-base font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                    {os.pfh_mm ? `${os.pfh_mm.toFixed(1)} mm` : '--'}
                  </div>
                  <div className="text-[10px] text-[#267A78] dark:text-[#6FB4AF]">
                    {os.pfh_px ? `${os.pfh_px.toFixed(1)} px` : '--'}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#267A78] dark:text-[#6FB4AF] pt-1">
                Mốc quang học:{' '}
                <span className="font-semibold text-[#00545D] dark:text-[#F9F8F2]">
                  {os.reference_point_used === 'CORNEAL_LIGHT_REFLEX'
                    ? 'Phản quang giác mạc Purkinje'
                    : os.reference_point_used === 'NONE'
                    ? 'Không có mốc hợp lệ'
                    : 'Tâm đồng tử dự phòng'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. So sánh bất đối xứng hai bên (Bilateral Comparison) */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#071619] border border-[#B8E8DF] dark:border-[#1A3F45] space-y-3">
            <div className="flex items-center space-x-2 text-[#00545D] dark:text-[#F9F8F2] font-bold">
              <Layers className="w-4 h-4 text-[#00AB9B]" />
              <span>Chỉ Số Tương Quan & Bất Đối Xứng Hai Bên</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#E1F4F0]/30 dark:bg-[#122D32]/30 border border-black/5 dark:border-white/5">
                <div className="text-[11px] text-[#267A78] dark:text-[#6FB4AF]">Chênh lệch |ΔMRD1|</div>
                <div className="text-lg font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                  {bilateral_comparison.delta_mrd1_mm !== null && bilateral_comparison.delta_mrd1_mm !== undefined
                    ? `${bilateral_comparison.delta_mrd1_mm.toFixed(2)} mm`
                    : '--'}
                </div>
                <div className="mt-1">{getAsymmetryBadge(bilateral_comparison.asymmetry_classification)}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#E1F4F0]/30 dark:bg-[#122D32]/30 border border-black/5 dark:border-white/5">
                <div className="text-[11px] text-[#267A78] dark:text-[#6FB4AF]">Chênh lệch cung mày (ΔBrow)</div>
                <div className="text-lg font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                  {bilateral_comparison.delta_brow_px
                    ? `${bilateral_comparison.delta_brow_px.toFixed(1)} px`
                    : '0.0 px'}
                </div>
                <div className="text-[10px] text-[#267A78] dark:text-[#6FB4AF] mt-1">
                  {bilateral_comparison.delta_brow_px && bilateral_comparison.delta_brow_px > 8.0
                    ? 'Có dấu hiệu nhướng mày nâng mi'
                    : 'Đối xứng cung mày bình thường'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#E1F4F0]/30 dark:bg-[#122D32]/30 border border-black/5 dark:border-white/5">
                <div className="text-[11px] text-[#267A78] dark:text-[#6FB4AF]">Thước đo HVID nội sinh</div>
                <div className="text-lg font-bold text-[#00545D] dark:text-[#F9F8F2] mt-0.5">
                  {scale_reference.assumed_corneal_diameter_mm.toFixed(2)} mm
                </div>
                <div className="text-[10px] text-[#267A78] dark:text-[#6FB4AF] mt-1">
                  OD: {scale_reference.hvid_pixels.right_eye.toFixed(0)} px • OS:{' '}
                  {scale_reference.hvid_pixels.left_eye.toFixed(0)} px
                </div>
              </div>
            </div>
          </div>

          {/* 3. Kiểm định chất lượng ảnh (Quality Audit Summary) */}
          <div className="p-3.5 rounded-xl bg-[#E1F4F0]/20 dark:bg-[#122D32]/20 border border-[#B8E8DF]/60 dark:border-[#1A3F45]/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#267A78] dark:text-[#6FB4AF]">
            <div className="flex items-center space-x-2">
              <Camera className="w-3.5 h-3.5 text-[#00AB9B]" />
              <span className="font-medium text-[#00545D] dark:text-[#F9F8F2]">Kiểm định quang học:</span>
              <span>Độ sắc nét: {image_quality_audit.sharpness_score.toFixed(0)}</span>
              <span>•</span>
              <span>Độ sáng: {image_quality_audit.mean_illumination.toFixed(0)}/255</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>Góc xoay đầu:</span>
              <span>Yaw {image_quality_audit.pose.yaw.toFixed(1)}°</span>
              <span>•</span>
              <span>Pitch {image_quality_audit.pose.pitch.toFixed(1)}°</span>
              <span>•</span>
              <span>Roll {image_quality_audit.pose.roll.toFixed(1)}°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementDetails;
