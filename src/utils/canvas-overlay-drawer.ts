/**
 * Tiện ích vẽ lớp phủ đồ họa vector minh bạch trên Canvas 2D (Module M8).
 * Hiển thị trực quan:
 * - Viền mống mắt HVID (nét đứt trắng #FFFFFF)
 * - Đường bờ mi trên nội suy B-spline (nét liền xanh ngọc #10B981)
 * - Đường bờ mi dưới (nét đứt cyan #38BDF8)
 * - Đốm phản quang Purkinje / Tâm đồng tử (chấm tròn đỏ #EF4444)
 * - Mũi tên / đường đo MRD1 thẳng đứng (vàng hổ phách #F59E0B) kèm nhãn milimét
 * Tuân thủ G4: Tuyệt đối không dùng từ ngữ thuộc danh mục cấm.
 */

import type {
  AnnotatedOverlayContainer,
  EyeAnnotationPoints,
  MeasurementsContainer,
  SingleEyeMeasurement,
} from '../types/api-contracts';

export interface OverlayDrawOptions {
  showIrisLimbus: boolean;
  showUpperMargin: boolean;
  showLowerMargin: boolean;
  showCornealReflex: boolean;
  showMrd1Arrow: boolean;
  zoomToEyes: boolean;
}

export const DEFAULT_OVERLAY_OPTIONS: OverlayDrawOptions = {
  showIrisLimbus: true,
  showUpperMargin: true,
  showLowerMargin: true,
  showCornealReflex: true,
  showMrd1Arrow: true,
  zoomToEyes: false,
};

/**
 * Tính toán hình chữ nhật bao quanh hai mắt để hỗ trợ chế độ phóng to (zoomToEyes).
 */
export function calculateEyesBoundingBox(
  overlay: AnnotatedOverlayContainer,
  imgWidth: number,
  imgHeight: number,
  paddingRatio: number = 0.45
): { x: number; y: number; width: number; height: number } {
  const points: [number, number][] = [
    overlay.right_eye.corneal_reflex,
    overlay.left_eye.corneal_reflex,
    ...overlay.right_eye.upper_eyelid_contour,
    ...overlay.left_eye.upper_eyelid_contour,
    ...(overlay.right_eye.lower_eyelid_contour || []),
    ...(overlay.left_eye.lower_eyelid_contour || []),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const rawW = maxX - minX;
  const rawH = maxY - minY;
  const padX = rawW * paddingRatio;
  const padY = rawH * paddingRatio * 1.2;

  const x = Math.max(0, minX - padX);
  const y = Math.max(0, minY - padY);
  const w = Math.min(imgWidth - x, rawW + padX * 2);
  const h = Math.min(imgHeight - y, rawH + padY * 2);

  return { x, y, width: w, height: h };
}

/**
 * Vẽ một mắt với đầy đủ các mốc giải phẫu và số đo.
 */
function drawSingleEyeOverlay(
  ctx: CanvasRenderingContext2D,
  eye: EyeAnnotationPoints,
  measurement: SingleEyeMeasurement,
  options: OverlayDrawOptions,
  eyeLabel: 'OD' | 'OS'
): void {
  const scale = 1.0;

  // 1. Vẽ viền mống mắt ngang (HVID Limbus Contour) - Nét đứt trắng (#FFFFFF)
  if (options.showIrisLimbus && eye.iris_limbus_contour.length >= 2) {
    const pt1 = eye.iris_limbus_contour[0];
    const pt2 = eye.iris_limbus_contour[1];
    const centerX = (pt1[0] + pt2[0]) / 2;
    const centerY = (pt1[1] + pt2[1]) / 2;
    const radius = Math.hypot(pt2[0] - pt1[0], pt2[1] - pt1[1]) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4 * scale, 3 * scale]);
    ctx.lineWidth = 1.8 * scale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Điểm neo rìa ngang mống mắt
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(pt1[0], pt1[1], 2.2 * scale, 0, Math.PI * 2);
    ctx.arc(pt2[0], pt2[1], 2.2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Vẽ đường bờ mi dưới (Lower Eyelid Contour) - Nét đứt cyan (#38BDF8)
  if (options.showLowerMargin && eye.lower_eyelid_contour && eye.lower_eyelid_contour.length > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([3 * scale, 3 * scale]);
    ctx.lineWidth = 1.6 * scale;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';

    const pts = eye.lower_eyelid_contour;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 3. Vẽ đường bờ mi trên (Upper Eyelid Margin) - Nét liền xanh ngọc (#10B981)
  if (options.showUpperMargin && eye.upper_eyelid_contour.length > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2.4 * scale;
    ctx.strokeStyle = '#10B981';
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 6;

    const pts = eye.upper_eyelid_contour;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 4. Vẽ đốm phản quang Purkinje hoặc Điểm mốc dự phòng
  const reflexPt = eye.corneal_reflex;
  if (options.showCornealReflex && reflexPt) {
    const isFallback = measurement.reference_point_used === 'PUPIL_CENTER_FALLBACK';
    const mainColor = isFallback ? '#F97316' : '#EF4444'; // Cam hổ phách khi dự phòng, Đỏ khi có phản quang
    const glowColor = isFallback ? 'rgba(249, 115, 22, 0.35)' : 'rgba(239, 68, 68, 0.3)';

    ctx.save();
    // Vòng phát sáng ngoại vi
    ctx.beginPath();
    ctx.fillStyle = glowColor;
    ctx.arc(reflexPt[0], reflexPt[1], 5.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Điểm tâm sắc nét
    ctx.beginPath();
    ctx.fillStyle = mainColor;
    ctx.arc(reflexPt[0], reflexPt[1], 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Viền trắng bảo vệ tương phản
    ctx.lineWidth = 1.0 * scale;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.restore();
  }

  // 5. Vẽ mũi tên / thước đo MRD1 - Đường dọc vàng hổ phách (#F59E0B)
  if (options.showMrd1Arrow && measurement.reference_coordinates && measurement.eyelid_margin_point) {
    const refX = measurement.reference_coordinates.x;
    const refY = measurement.reference_coordinates.y;
    const marginY = measurement.eyelid_margin_point.y;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2.0 * scale;
    ctx.strokeStyle = '#F59E0B';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
    ctx.shadowBlur = 4;

    // Đường thẳng đứng nối mốc tham chiếu và bờ mi
    ctx.moveTo(refX, refY);
    ctx.lineTo(refX, marginY);
    ctx.stroke();

    // Hai vạch ngang chặn đầu và đuôi
    const tickW = 5 * scale;
    ctx.beginPath();
    ctx.moveTo(refX - tickW, refY);
    ctx.lineTo(refX + tickW, refY);
    ctx.moveTo(refX - tickW, marginY);
    ctx.lineTo(refX + tickW, marginY);
    ctx.stroke();

    // Điểm giao cắt bờ mi
    ctx.beginPath();
    ctx.fillStyle = '#F59E0B';
    ctx.arc(refX, marginY, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Nhãn số đo MRD1 (mm)
    const midY = (refY + marginY) / 2;
    const labelText = `${eyeLabel}: ${measurement.mrd1_mm.toFixed(1)} mm`;
    ctx.font = `bold ${Math.round(11 * scale)}px Inter, sans-serif`;
    const textMetrics = ctx.measureText(labelText);
    const textW = textMetrics.width;
    const textH = 14 * scale;

    const labelX = eyeLabel === 'OD' ? refX - textW - 8 * scale : refX + 8 * scale;
    const labelY = midY - textH / 2;

    // Khung nền nhãn tương phản
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(labelX - 3 * scale, labelY, textW + 6 * scale, textH, 3 * scale);
    ctx.fill();

    // Chữ nhãn
    ctx.fillStyle = '#F2C66D';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, labelX, midY);

    ctx.restore();
  }
}

/**
 * Hàm điều phối vẽ toàn bộ lớp phủ đồ họa lên canvas.
 */
export function drawAnnotatedCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  overlay: AnnotatedOverlayContainer,
  measurements: MeasurementsContainer,
  options: OverlayDrawOptions = DEFAULT_OVERLAY_OPTIONS
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const naturalW = image.naturalWidth || image.width;
  const naturalH = image.naturalHeight || image.height;

  // Xác định khung nhìn (toàn cảnh hoặc phóng to vùng mắt)
  let srcX = 0;
  let srcY = 0;
  let srcW = naturalW;
  let srcH = naturalH;

  if (options.zoomToEyes) {
    const bbox = calculateEyesBoundingBox(overlay, naturalW, naturalH);
    srcX = bbox.x;
    srcY = bbox.y;
    srcW = bbox.width;
    srcH = bbox.height;
  }

  // Cài đặt độ phân giải nội bộ của canvas khớp với vùng nhìn
  canvas.width = srcW;
  canvas.height = srcH;

  // Xóa sạch canvas trước khi vẽ
  ctx.clearRect(0, 0, srcW, srcH);

  // 1. Vẽ ảnh gốc (cắt theo vùng nhìn nếu zoom)
  ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

  // Áp dụng dịch chuyển tọa độ nếu đang ở chế độ zoom
  ctx.save();
  if (options.zoomToEyes) {
    ctx.translate(-srcX, -srcY);
  }

  // 2. Vẽ mắt phải (OD) và mắt trái (OS)
  drawSingleEyeOverlay(ctx, overlay.right_eye, measurements.right_eye_od, options, 'OD');
  drawSingleEyeOverlay(ctx, overlay.left_eye, measurements.left_eye_os, options, 'OS');

  ctx.restore();
}
