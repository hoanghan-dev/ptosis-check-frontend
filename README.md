# RemiCare PtosisCheck — Client Application

[![React](https://img.shields.io/badge/React-19.2+-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3+-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-11%20Passing-brightgreen?logo=vitest)](https://vitest.dev/)
[![A11y](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success)]()

Giao diện Web tương tác chất lượng cao phục vụ **Sàng lọc Hình thái Mi mắt (Ptosis Morphology Screening)** thuộc nền tảng **RemiCare**. Ứng dụng mang phong cách thiết kế **Clinical-Luxury** (sang trọng, y tế chuẩn mực, trực quan, hỗ trợ chế độ Sáng/Tối linh hoạt), kết nối liền mạch với Backend API để cung cấp kết quả phân tầng và trực quan hóa lớp phủ đo đạc thời gian thực.

> [!IMPORTANT]
> **THÔNG CÁO AN TOÀN SÀNG LỌC (NON-DIAGNOSTIC SAFETY NOTICE):**
> Ứng dụng chỉ phục vụ mục đích sàng lọc hình thái học ban đầu và nâng cao nhận thức cộng đồng về sự bất đối xứng mi mắt. Ứng dụng **không đưa ra kết luận chuyên khoa** và **không thay thế lời khuyên của bác sĩ chuyên khoa mắt**.

---

## Mục lục

1. [Tính năng nổi bật](#tính-năng-nổi-bật)
2. [Hệ thống diễn giải kết quả & Chỉ số đo đạc](#hệ-thống-diễn-giải-kết-quả--chỉ-số-đo-đạc)
3. [Cấu trúc mã nguồn](#cấu-trúc-mã-nguồn)
4. [Hướng dẫn cài đặt & Khởi chạy](#hướng-dẫn-cài-đặt--khởi-chạy)
5. [Quy chuẩn kiểm thử & Đảm bảo chất lượng](#quy-chuẩn-kiểm-thử--đảm-bảo-chất-lượng)

---

## Tính năng nổi bật

- **Kiểm soát chất lượng tại máy trạm (Client-Side Pre-validation):**
  - Xác thực định dạng tệp ảnh (chỉ chấp nhận JPEG, PNG).
  - Giới hạn dung lượng an toàn (tối thiểu 50 KB, tối đa 15 MB) trước khi gửi yêu cầu lên Backend nhằm tối ưu băng thông.
- **Phản hồi hướng dẫn trực quan thông minh (Smart Quality Guidance Modal):**
  - Khi hình ảnh vi phạm cổng chất lượng (nghiêng đầu quá mức, thiếu sáng, mờ nhòe, chói lóa, nhắm mắt), modal chuyên dụng sẽ hiển thị hình ảnh minh họa và hướng dẫn cụ thể cách khắc phục.
- **Thẻ phân tầng trực quan (TierCard System):**
  - Hiển thị rõ ràng 3 mức khuyến nghị **Mức A**, **Mức B**, **Mức C** với màu sắc nhận diện tương ứng, văn bản giải thích chuẩn đại chúng và định hướng hành động rõ ràng.
- **Khung thị giác tương tác (Interactive Canvas Overlay):**
  - Vẽ lớp phủ đồ họa chính xác trên ảnh gốc: Phản xạ giác mạc Purkinje ($R_1$), đường viền mống mắt (Iris Limbus), bờ sụn mi trên và bờ mi dưới.
  - Tích hợp thước đo động milimét và tùy chọn phóng to/thu nhỏ tương tác.
- **Bảng thông số chi tiết hai mắt (Bilateral Measurement Details Accordion):**
  - So sánh chi tiết từng chỉ số giữa mắt phải (OD) và mắt trái (OS).
  - Huy hiệu phân loại bất đối xứng theo màu sắc chuẩn quốc tế.
- **Trải nghiệm cao cấp & Tiếp cận toàn diện (Clinical-Luxury & A11y):**
  - Hỗ trợ đầy đủ chế độ Light / Dark mode với bảng màu Teal đậm kết hợp Mint trang nhã.
  - Tuân thủ tiêu chuẩn tương phản WCAG 2.1 AA, điều hướng bàn phím đầy đủ.

---

## Hệ thống diễn giải kết quả & Chỉ số đo đạc

### 1. Ý nghĩa các chỉ số đo đạc

| Chỉ số | Tên đầy đủ | Giải thích chi tiết | Đơn vị tính |
| :---: | :--- | :--- | :---: |
| **MRD1** | Margin Reflex Distance 1 | Khoảng cách từ tâm phản xạ giác mạc Purkinje ($R_1$) lên bờ mi trên. Thước đo chủ đạo để đánh giá độ cao mi mắt. | mm (kèm dung sai ±0.5 mm) |
| **MRD2** | Margin Reflex Distance 2 | Khoảng cách từ tâm phản xạ giác mạc Purkinje ($R_1$) xuống bờ mi dưới. | mm |
| **PFD / PFH** | Palpebral Fissure Height | Độ mở khe mi toàn phần theo chiều thẳng đứng ($PFD = MRD1 + MRD2$). | mm |
| **$\Delta MRD1$** | Bilateral Asymmetry | Độ chênh lệch tuyệt đối giữa hai bên mắt: $\Delta MRD1 = \lvert MRD1_{\text{OS}} - MRD1_{\text{OD}} \rvert$. Chỉ số quan trọng nhất để phát hiện bất đối xứng. | mm |
| **$\Delta Brow$** | Eyebrow Height Discrepancy | Độ chênh lệch vị trí cung mày hai bên; giúp nhận diện phản xạ nhướng mày / co cơ trán nâng mi bù trừ vô thức. | pixels |

---

### 2. Quy tắc hiển thị mức độ bất đối xứng hai bên ($\Delta MRD1$)

Trên giao diện chi tiết đo đạc ([`MeasurementDetails.tsx`](file:///d:/Documents/FPT_Education/FA26/EXE101/New/PtosisCheck-1.1/frontend/src/components/result/MeasurementDetails.tsx)), độ bất đối xứng được phân loại và hiển thị bằng các huy hiệu màu sắc trực quan:

- **Huy hiệu Xanh lục (`Đối xứng sinh lý (≤ 1.5 mm)`):**
  - Độ chênh lệch $\Delta MRD1 \le 1.5\text{ mm}$. Hai mắt cân đối về mặt giải phẫu tự nhiên.
- **Huy hiệu Vàng hổ phách (`Bất đối xứng ranh giới (1.5 - 2.0 mm)`):**
  - Độ chênh lệch nằm trong khoảng $1.5\text{ mm} < \Delta MRD1 \le 2.0\text{ mm}$. Có sự khác biệt nhẹ giữa hai bên mi mắt; hệ thống đề xuất người dùng lưu ý theo dõi thêm.
- **Huy hiệu Đỏ hoa hồng (`Bất đối xứng đáng chú ý (> 2.0 mm)`):**
  - Độ chênh lệch **vượt quá $2.0\text{ mm}$**. Hai mắt có sự chênh lệch rõ rệt; hệ thống kích hoạt **cảnh báo cần sớm thăm khám chuyên khoa (Mức C)** để kiểm tra chi tiết.

---

### 3. Tiêu chí phân tầng 3 Mức độ khuyến nghị (Tier System)

```
┌────────────────────────────────────────────────────────────────────────┐
│ MỨC A: KHÔNG PHÁT HIỆN BẤT THƯỜNG (Tier A - Xanh ngọc)                 │
├────────────────────────────────────────────────────────────────────────┤
│ • Hai mắt có độ mở cân đối hoặc thuộc dáng mắt hẹp sinh lý Á Đông.     │
│ • ΔMRD1 ≤ 1.5 mm VÀ min(MRD1) > 0 mm VÀ ΔBrow ≤ 8 px.                 │
│ ➜ Khuyến nghị: Chưa ghi nhận dấu hiệu cần can thiệp. Theo dõi định kỳ.  │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ MỨC B: DẤU HIỆU NGHI NGỜ / RANH GIỚI (Tier B - Vàng hổ phách)          │
├────────────────────────────────────────────────────────────────────────┤
│ • Ghi nhận độ cao mi ở mức ranh giới hoặc có chênh lệch nhẹ hai mắt.  │
│ • 1.5 mm < ΔMRD1 ≤ 2.0 mm;                                             │
│   HOẶC ΔBrow > 8 px (nghi ngờ co cơ trán nâng mi bù trừ).              │
│ ➜ Khuyến nghị: Tự theo dõi thêm qua ảnh chụp và cân nhắc thăm khám.     │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ MỨC C: KHUYẾN NGHỊ SỚM THĂM KHÁM CHUYÊN KHOA (Tier C - Đỏ san hô)      │
├────────────────────────────────────────────────────────────────────────┤
│ • Bờ mi che phủ đáng kể trục thị giác hoặc bất đối xứng rõ rệt.        │
│ • ΔMRD1 > 2.0 mm (Bất đối xứng rõ rệt vượt ngưỡng an toàn);            │
│   HOẶC NGOẠI LỆ: min(MRD1) ≤ 0 mm (kể cả khi ΔMRD1 ≈ 0);              │
│   HOẶC bờ mi che lấp hoàn toàn phản quang giác mạc Purkinje.          │
│ ➜ Khuyến nghị: Sớm đến cơ sở y tế chuyên khoa mắt để được thăm khám.   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Cấu trúc mã nguồn

```
frontend/src/
├── assets/                       # Biểu tượng vector và tài nguyên đồ họa SVG
├── components/
│   ├── capture/                  # Màn hình tải ảnh & Xác thực máy trạm
│   │   ├── CaptureScreen.tsx     # Điều phối giao diện chụp và tải ảnh
│   │   ├── FileUploadZone.tsx    # Vùng kéo thả tệp, kiểm tra định dạng và dung lượng
│   │   └── CameraView.tsx        # Thành phần chụp ảnh realtime (Coming Soon)
│   ├── result/                   # Màn hình hiển thị kết quả phân tích
│   │   ├── ResultScreen.tsx      # Bố cục màn hình kết quả tổng thể
│   │   ├── TierCard.tsx          # Thẻ phân tầng Mức A/B/C với huy hiệu động
│   │   ├── MeasurementDetails.tsx# Bảng Accordion chi tiết số đo OD/OS và huy hiệu đối xứng
│   │   └── AnnotatedCanvas.tsx   # Canvas tương tác hiển thị phản quang và đường viền bờ mi
│   └── common/                   # Thành phần giao diện dùng chung
│       ├── Header.tsx            # Thanh điều hướng trên cùng kèm nút đổi Light/Dark mode
│       ├── QualityErrorModal.tsx # Hộp thoại thông báo và hướng dẫn khắc phục lỗi chất lượng
│       ├── SafetyDisclaimer.tsx  # Khung thông cáo an toàn y tế phi chẩn đoán bắt buộc
│       └── ConsentDialog.tsx     # Hộp thoại đồng thuận quyền riêng tư sinh trắc học
├── hooks/
│   └── useScreening.ts           # Custom hook quản lý trạng thái tải ảnh và gọi API
├── services/
│   └── api.ts                    # Tầng giao tiếp HTTP với Backend FastAPI
├── types/
│   └── api-contracts.ts          # Khế ước dữ liệu TypeScript đồng bộ với Backend
├── tests/                        # Bộ kiểm thử đơn vị với Vitest & Testing Library
│   ├── preValidation.test.ts     # Kiểm thử kiểm định tệp ảnh đầu vào
│   ├── qualityErrorModal.test.tsx# Kiểm thử modal lỗi chất lượng tư thế
│   ├── consentDialog.test.tsx    # Kiểm thử luồng đồng thuận người dùng
│   └── theme.test.tsx            # Kiểm thử chuyển đổi chủ đề Sáng / Tối
├── App.tsx                       # Điểm gắn kết ứng dụng chính
├── main.tsx                      # Entrypoint khởi tạo React DOM
└── index.css                     # Bảng thiết kế Vanilla CSS, biến chủ đề & kiểu dáng
```

---

## Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu môi trường
- **Node.js:** Phiên bản 18.0 trở lên (khuyến nghị **Node.js 20 LTS** hoặc 22 LTS).
- **Trình quản lý gói:** `npm` (đi kèm Node.js) hoặc `pnpm` / `yarn`.
- **Backend API:** Cần có một phiên bản backend đang lắng nghe tại `http://localhost:8000` (xem hướng dẫn tại `backend/README.md`).

---

### Các bước cài đặt và khởi chạy:

#### 1. Điều hướng vào thư mục frontend:
```bash
cd frontend
```

#### 2. Cài đặt các gói thư viện:
```bash
npm install
```

#### 3. Cấu hình biến môi trường (Tùy chọn):
Nếu backend của bạn chạy ở cổng khác cổng mặc định `8000`, tạo tệp `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

#### 4. Khởi chạy Development Server:
```bash
npm run dev
```
Trình biên dịch Vite sẽ khởi chạy máy chủ phát triển trong vòng dưới 1 giây. Mở trình duyệt và truy cập:
👉 **`http://localhost:5173/`**

---

### Xây dựng bản phân phối Production:

Để kiểm tra lỗi kiểu dữ liệu TypeScript và đóng gói ứng dụng:
```bash
# Kiểm tra kiểu TypeScript và biên dịch gói sản phẩm tối ưu
npm run build

# Xem thử (preview) bản dựng sản phẩm cục bộ
npm run preview
```

---

## Quy chuẩn kiểm thử & Đảm bảo chất lượng

Frontend được trang bị bộ kiểm thử tự động với **Vitest** và **React Testing Library**:

```bash
# Chạy toàn bộ 11 bài kiểm thử tự động của Frontend
npx vitest run

# Chạy kiểm thử ở chế độ theo dõi tương tác (Watch mode)
npx vitest

# Kiểm tra cú pháp và chất lượng mã nguồn với Oxlint
npm run lint
```

---

## Bản quyền & Đóng góp
Dự án được xây dựng với mục tiêu mang công nghệ sàng lọc y tế số dễ tiếp cận đến cộng đồng. Mọi đóng góp xin vui lòng tuân thủ quy tắc ứng xử và tiêu chuẩn an toàn phi chẩn đoán của dự án.
