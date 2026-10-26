# TÀI LIỆU KỸ THUẬT VÀ TỔNG QUAN GIẢI PHÁP - REMICARE
**Hệ Thống Trợ Lý AI Sàng Lọc Thị Lực Sớm (Sụp Mi & Lác Mắt)**  
*Phiên bản:* **1.3 (Condensed Executive & Technical Brief)**  
*Ngày cập nhật:* **24/10/2026**  
*Cổng thông tin chính thức:* [https://remicare.id.vn](https://remicare.id.vn)

---

## 1. TỔNG QUAN GIẢI PHÁP (EXECUTIVE SUMMARY)

### 1.1 Bài toán thực tế
- **Phát hiện muộn ở trẻ nhỏ:** Các tật lác ẩn (*phoria*) và sụp mi nhẹ (*mild ptosis*) rất khó phát hiện bằng mắt thường tại nhà. Trẻ không được can thiệp trước 7 tuổi (*độ tuổi vàng*) có nguy cơ cao biến chứng thành **nhược thị** (*amblyopia* - suy giảm thị lực vĩnh viễn không thể phục hồi bằng kính).
- **Rào cản tiếp cận:** Khám chuyên khoa mắt đòi hỏi trang thiết bị phức tạp (thước đo Putterman, lăng kính đo góc lác Prism, đèn khe Slit Lamp), vốn chỉ tập trung ở bệnh viện tuyến trung ương.
- **Bất tiện của các giải pháp cũ:** Đa số phần mềm đo lường trước đây bắt buộc người dùng dán thẻ ATM, đồng xu hay sticker lên trán để làm vật chuẩn kích thước, gây phiền toái, mất vệ sinh và khiến hơn 60% người dùng bỏ dở giữa chừng.

### 1.2 Giải pháp RemiCare
**RemiCare** là nền tảng y tế số ứng dụng Trí tuệ Nhân tạo (AI) và Thị giác Máy tính (Computer Vision), cho phép người dùng tự sàng lọc hình thái mi mắt và trục thị giác ngay tại nhà thông qua trình duyệt web:
- **Không cần vật chuẩn (Markerless):** Tự động đo đạc kích thước milimet dựa trên kích thước sinh học của mống mắt người Đông Á.
- **Tiếp cận tức thì (Instant Web Access):** Chạy trực tiếp trên trình duyệt điện thoại và máy tính tại [remicare.id.vn](https://remicare.id.vn), không cần cài đặt ứng dụng.
- **Bảo mật tuyệt đối (Zero-Retention):** Ảnh được giải mã và phân tích trực tiếp trên bộ nhớ RAM, xóa sạch ngay lập tức sau khi xử lý; không lưu trữ bất kỳ hình ảnh khuôn mặt nào trên máy chủ.

---

## 2. PHƯƠNG PHÁP & CƠ SỞ KHOA HỌC (METHODOLOGY & CLINICAL FOUNDATIONS)

RemiCare số hóa 3 quy trình khám nhãn khoa kinh điển thành các thuật toán tự động:

```mermaid
flowchart LR
    A["Chụp ảnh / Quay video tại nhà"] --> B{"Lựa chọn phân hệ"}
    B -->|"Sụp mi (Ảnh tĩnh)"| C["Đo đạc MRD1 & Bất đối xứng"]
    B -->|"Lác mắt (Ảnh có Flash)"| D["Phản xạ giác mạc Hirschberg"]
    B -->|"Lác mắt (Video che mắt)"| E["Nghiệm pháp Cover-Uncover Test"]
    C --> F["Báo cáo phân tầng nguy cơ & Khuyến nghị chuyên khoa"]
    D --> F
    E --> F
```

### 2.1 Bảng so sánh 3 phương pháp sàng lọc cốt lõi

| Tiêu chí | 1. Sàng lọc Sụp mi (Ptosis) | 2. Sàng lọc Lác qua ảnh (Hirschberg) | 3. Sàng lọc Lác động học (Cover Test) |
| :--- | :--- | :--- | :--- |
| **Bản chất y khoa** | Đo khoảng cách bờ mi trên - phản xạ đồng tử (**MRD1**) | Xác định vị trí ánh phản xạ giác mạc (**Purkinje Image I**) | Đánh giá chuyển động bù trừ định vị (**Refixation Movement**) |
| **Định dạng đầu vào** | 1 ảnh chân dung nhìn thẳng, mắt mở tự nhiên | 1 ảnh chân dung nhìn thẳng có bật **đèn flash** | 1 đoạn video ngắn 3 - 5 giây che lần lượt từng mắt |
| **Cơ sở y văn** | Putterman (2012), Small & Finsterer (2003) | Hirschberg (1886), von Noorden (2002) | American Academy of Ophthalmology (AAO) |
| **Thời gian xử lý** | **~ 1.0 giây** (rất nhanh) | **~ 9.1 giây** (mô hình học sâu ResNet-18) | **10 - 20 giây** (phân tích chuỗi 10 - 15 FPS) |
| **Kết quả trả về** | - Chỉ số MRD1 từng mắt (mm)<br>- Độ bất đối xứng mí mắt (mm)<br>- Độ rướn cơ trán (pixel)<br>- Phân tầng TIER_A/B/C | - Phân loại: Bình thường / Nghi ngờ lác<br>- Độ tin cậy thuật toán (%)<br>- Vùng mắt phóng to kèm tiêu điểm Purkinje | - Đánh giá lác hiện (*Tropia*) / lác ẩn (*Phoria*)<br>- Đồ thị quỹ đạo nhãn cầu theo thời gian |

---

### 2.2 Đột phá: Cơ chế hiệu chuẩn kích thước không vật chuẩn (Markerless Calibration)
- **Cơ sở sinh học:** Đường kính giác mạc vùng trắng sang trắng (*White-to-White - WTW*) là một hằng số sinh học cực kỳ ổn định ở người trên 2 tuổi. Theo nghiên cứu nhãn khoa trên quần thể người Đông Á (*Chen et al., 2011*), đường kính ngang giác mạc trung bình đạt **$11.71 \pm 0.42\text{ mm}$**.
- **Cách thức thực hiện:**
  $$\text{Tỷ lệ quy đổi (mm/pixel)} = \frac{11.71\text{ mm}}{\text{Đường kính ngang mống mắt (pixels)}}$$
- Nhờ công thức này, hệ thống quy đổi chính xác các khoảng cách pixel trên ảnh thành số đo milimet thực tế mà người dùng không cần cầm theo bất kỳ thẻ đo hay vật đối chứng nào.

---

### 2.3 Tiêu chuẩn phân tầng nguy cơ Sụp mi (Asymmetry-First Tiers)

Cây quyết định phân tầng của RemiCare tuân thủ triết lý **Ưu tiên Bất đối xứng (Asymmetry-First)** kết hợp bảo vệ hình thái mắt một mí sinh lý Á Đông và chốt chặn an toàn trục thị giác:

- **TIER_A (Bình thường / Dáng mắt sinh lý Á Đông - Xanh lục):**
  - Độ bất đối xứng hai bên $\Delta\text{MRD1} \le 1.5\text{ mm}$ VÀ $\min(\text{MRD1}) \ge 1.0\text{ mm}$.
  - Không có phản xạ nhướng mày bù trừ khi bờ mi ở mức thấp ($\Delta\text{Brow} \le 8.0\text{ px}$ hoặc $\min(\text{MRD1}) \ge 2.0\text{ mm}$).
  - *Ý nghĩa y học:* Trục thị giác hoàn toàn thông thoáng; người có dáng mắt hẹp hoặc mắt một mí tự nhiên không bị báo động giả.
- **TIER_B (Nghi ngờ sụp mi nhẹ / Bất đối xứng ranh giới - Vàng hổ phách):**
  - Bất đối xứng ranh giới: $1.5\text{ mm} < \Delta\text{MRD1} \le 2.0\text{ mm}$;
  - HOẶC sụp mi ranh giới có phản xạ co cơ trán nâng mi bù trừ: $\Delta\text{Brow} > 8.0\text{ px}$ VÀ $\min(\text{MRD1}) < 2.0\text{ mm}$;
  - HOẶC mất phản xạ ánh sáng do điều kiện chiếu sáng tự nhiên thiếu đèn flash (`NOT_VISIBLE_QUALITY` / `INDETERMINATE`).
  - *Ý nghĩa y học:* Ghi nhận chênh lệch nhẹ hoặc dấu hiệu mỏi cơ nâng mi bù trừ; khuyến nghị tự theo dõi thêm.
- **TIER_C (Nguy cơ cao / Khuyến nghị sớm khám chuyên khoa - Đỏ san hô):**
  - **Bất đối xứng rõ rệt:** $\Delta\text{MRD1} > 2.0\text{ mm}$ vượt ngưỡng an toàn lâm sàng;
  - **Chốt chặn ngoại lệ che phủ:** $\min(\text{MRD1}) < 1.0\text{ mm}$ (kể cả khi $\Delta\text{MRD1} \le 1.5\text{ mm}$);
  - **Che lấp hoàn toàn phản quang / trục thị giác:** $\text{MRD1} \le 0\text{ mm}$ hoặc cờ giải phẫu `OCCLUDED_BY_LID`;
  - **Chốt chặn sụp một mắt khi có flash (Unilateral Occlusion Guard):** Một bên mắt bắt được ánh phản xạ rõ nét (`SUCCESS`) nhưng bên đối diện hoàn toàn mất phản xạ và khe mi hẹp nghiêm trọng ($\text{PFH} < 5.0\text{ mm}$ hoặc $\text{MRD1} \le 0.5\text{ mm}$) $\rightarrow$ Lập tức phân tầng TIER_C thay vì hạ về Tier B.
  - *Ý nghĩa y học:* Bờ mi sa trễ che phủ đồng tử hoặc mất cân đối nghiêm trọng; cần sớm đến cơ sở y tế chuyên khoa mắt để được thăm khám trực tiếp.

---

## 3. DANH MỤC MÔ HÌNH AI & THUẬT TOÁN (AI & COMPUTER VISION ENGINE)

Hệ thống tích hợp chuỗi mô hình học sâu và thuật toán thị giác máy tính chuyên sâu, tối ưu hóa để chạy trực tiếp trên bộ nhớ đệm RAM (In-Memory Zero-Retention):

| Tên mô hình / Thuật toán | Loại công nghệ | Vai trò trong hệ thống | Đầu vào $\rightarrow$ Đầu ra |
| :--- | :--- | :--- | :--- |
| **Dual-Pipeline Input Router** | Heuristic & Computer Vision | Tự động phân loại ảnh toàn mặt (`FULL_FACE`) và ảnh crop cận cảnh 2 mắt (`DUAL_EYE_CROP`) | Tệp ảnh tải lên $\rightarrow$ Luồng pipeline xử lý tối ưu |
| **Synthetic Canvas Injection** | Computer Vision Transformation | Ghép ảnh crop 2 mắt vào khung canvas giả lập $640 \times 480$ chuẩn nhân trắc học, giúp MediaPipe nhận diện hoàn hảo | ROI 2 mắt $\rightarrow$ Khung hình hợp lệ cho Face Mesh |
| **CV Limbus Refinement (`refine_iris_limbus_cv`)** | Toán tử Gradient Hướng kính Daugman trên Green Channel | Tinh chỉnh rìa mống mắt dọc kinh tuyến ngang, loại trừ vùng mi trên ($\sin\theta > -0.4$), triệt tiêu sai số lông mi và nếp mí | Ảnh ROI mắt $\rightarrow$ Tâm mống mắt & HVID chính xác (sai số $< 5.5\%$) |
| **MediaPipe Face Mesh (Iris-Refined)** | Deep Learning (Google) | Trích xuất 478 mốc khuôn mặt, 71 mốc viền mắt và mốc mống mắt cận sub-pixel | Ảnh khuôn mặt $\rightarrow$ Tọa độ 3D mi mắt, mống mắt, chân mày |
| **Purkinje Glint Detector & Fallback Engine** | Morphology, Contour & Multi-stage Fallback | Phát hiện đốm phản xạ giác mạc Purkinje I (tỷ lệ trục $\le 2.5$, tương phản $\ge 1.15$). Dự phòng tâm đồng tử / mống mắt khi chói lóa. **Triệt tiêu chấm đỏ phản quang giả (`corneal_reflex = None`)** khi mi mắt che lấp | ROI mống mắt $\rightarrow$ Tọa độ phản xạ thật hoặc mốc tham chiếu dự phòng minh bạch |
| **Unilateral Occlusion Guard** | Clinical Safeguard Logic | Chốt chặn an toàn phát hiện sụp mi nặng một bên làm mất phản xạ khi mắt đối diện có flash rõ | Trạng thái phản quang 2 mắt $\rightarrow$ Kích hoạt `OCCLUDED_BY_LID` $\rightarrow$ TIER_C |
| **Exif & 2D FFT Orientation Engine** | Xử lý Tín hiệu Số & Phổ Fourier | Tự động phát hiện góc xoay và đảo chiều ảnh đúng hướng trước khi đo | Ma trận ảnh $\rightarrow$ Ảnh đã xoay thẳng đứng sinh lý |
| **ResNet-18 Deep CNN** | Convolutional Neural Network (PyTorch) | Phân loại lác mắt dựa trên ảnh cắt vùng mắt có ánh phản xạ | Ảnh mắt có đèn Flash $\rightarrow$ Nhãn: Bình thường / Nghi ngờ lác |
| **Ellipse Fitting Algorithm** | Computer Vision (OpenCV) | Khớp đường bao elip mống mắt và đồng tử chính xác sub-pixel | Các điểm mốc $\rightarrow$ Tâm đồng tử & Bán kính (pixel) |
| **Trajectory Consensus Model** | Computer Vision & Signal Processing | Theo dõi vector chuyển động của nhãn cầu qua từng khung hình video | Video 10-15 FPS $\rightarrow$ Tốc độ & Biên độ chuyển động định vị |
| **Head Pose 3D & EAR Gate** | Phép chiếu phối cảnh solvePnP & Hình học | Bộ lọc chất lượng ảnh chuyên sâu (Quality Gate) | Điểm mốc khuôn mặt $\rightarrow$ Góc xoay 3D ($^\circ$) & Độ mở mắt (EAR) |

---

### Bộ lọc chất lượng ảnh (Quality Gate - Bảo vệ độ chính xác)
Trước khi đưa ảnh vào phân tích sâu, thuật toán tự động kiểm tra nghiêm ngặt:
1. **Góc nghiêng đầu 3D (Head Pose solvePnP):** Góc quay trái/phải (*Yaw*) $\le 10^\circ$, ngửa/cúi (*Pitch*) $\le 10^\circ$, nghiêng (*Roll*) $\le 5^\circ$ (kiểm soát chặt Roll để tránh sai số $\Delta\text{MRD1}$).
2. **Độ mở mắt (Eye Aspect Ratio - EAR):** Yêu cầu $\text{EAR} > 0.15$ (đảm bảo mắt mở tự nhiên, không nhắm mắt hoặc chớp mắt dở dang).
3. **Độ phân giải & Thước đo:** Vùng khuôn mặt đạt tối thiểu $100 \times 100\text{ px}$, đường kính mống mắt ngang $\ge 30\text{ px}$.
4. **Độ sắc nét & Chiếu sáng:** Phương sai Laplacian $\ge 50.0$, độ sáng trung bình $40 \le \bar{I} \le 220$, tỷ lệ lóa sáng bão hòa $< 15\%$. Trao đổi và sửa xoay tự động bằng Exif/FFT.

---

## 4. KIẾN TRÚC HỆ THỐNG & TECH STACK (ARCHITECTURE & TECHNOLOGIES)

### 4.1 Sơ đồ kiến trúc phân tán

```mermaid
graph TD
    Client["Người dùng (Web Browser) Mobile / Tablet / Desktop"]
    CDN["Cloudflare CDN & Tên miền: remicare.id.vn"]
    FE["Frontend Hợp Nhất (React 19 + Vite + Tailwind CSS)"]

    subgraph Backend_Services["Hệ Thống Microservices (Python FastAPI)"]
        BE_Ptosis["Ptosis Service (Port 8000)<br>• Đo MRD1, PFH, ΔMRD1 & Asymmetry-First Triage<br>• MediaPipe Face Mesh & CV Limbus Refinement"]
        BE_Hirschberg["Hirschberg Service (Port 8001)<br>• Sàng lọc lác mắt qua ảnh Flash<br>• PyTorch ResNet-18 (eye_disease_model)"]
        BE_CoverTest["Cover Test Service (Port 8002)<br>• Sàng lọc lác động học qua Video<br>• Phân tích quỹ đạo chuyển động mắt"]
    end

    Client --> CDN
    CDN --> FE
    FE -->|"POST /api/v1/screening/analyze"| BE_Ptosis
    FE -->|"POST /predict"| BE_Hirschberg
    FE -->|"POST /api/cover-test/analyze"| BE_CoverTest
```

---

### 4.2 Chi tiết Tech Stack

| Tầng thành phần | Công nghệ / Thư viện chính | Phiên bản | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Frontend UI/UX** | **React** + **Vite** | React 19.x | Ứng dụng Single Page Application (SPA), giao diện mượt mà |
| | **Tailwind CSS** | 3.4.x / 4.x | Thiết kế giao diện responsive (chuẩn cho cả mobile và desktop) |
| | **MediaPipe Tasks Vision** | 0.10.x | Tiền xử lý khung hình camera trực tiếp trên trình duyệt |
| | **Lucide React** | 1.16.x | Bộ icon giao diện y tế hiện đại, trực quan |
| **Backend Ptosis** | **FastAPI** + **Uvicorn** | Python 3.10+ | REST API hiệu năng cao đo đạc hình thái mí mắt (Port 8000) |
| | **MediaPipe** + **OpenCV** | 0.10.x / 4.8+ | Trích xuất 478 mốc khuôn mặt, Daugman Limbus Refinement |
| | **Quality Gate & Guards** | Python 3.12 | 218 bài test tự động; Unilateral Occlusion Guard & Zero-Retention |
| **Backend Hirschberg** | **PyTorch** | 2.0+ (CPU) | Chạy mạng nơ-ron ResNet-18 phát hiện lác mắt qua ảnh (Port 8001) |
| | **Asyncio Single-Lock** | Built-in | Khóa an toàn ngăn máy chủ CPU bị quá tải khi xử lý |
| **Backend Cover Test** | **FastAPI** + **OpenCV Video**| Python 3.10+ | Xử lý chuỗi khung hình video bóc tách chuyển động mắt (Port 8002) |
| **Hạ tầng mạng & Tên miền** | **Domain chính thức** | DNS Host | `https://remicare.id.vn` (SSL Let's Encrypt) |
| | **Chuyển hướng vĩnh viễn**| Nginx 301 | Đưa domain cũ `ptosis-check.remicare.id.vn` về trang chủ mới |

---

## 5. AN TOÀN DỮ LIỆU & BẢO VỆ QUYỀN RIÊNG TƯ (SECURITY & COMPLIANCE)

> [!IMPORTANT]
> **Cam kết Zero-Retention (Không lưu trữ dữ liệu khuôn mặt):**
> Hình ảnh khuôn mặt của người dùng **CHỈ** được giải mã tạm thời trong bộ nhớ RAM của máy chủ để trích xuất các mảng số tọa độ hình học (landmarks). Ngay sau khi có kết quả, dữ liệu pixel gốc bị hàm `purge_image_data()` **xóa sạch hoàn toàn** khỏi bộ nhớ. Máy chủ **tuyệt đối không lưu file ảnh xuống đĩa cứng, cơ sở dữ liệu hay bất kỳ dịch vụ đám mây bên ngoài nào**.

### Nguyên tắc truyền thông y tế an toàn (Non-Diagnostic)
- **Định vị pháp lý:** RemiCare là **công cụ sàng lọc hỗ trợ cộng đồng**, không phải là thiết bị chẩn đoán y tế và không thay thế bác sĩ chuyên khoa mắt.
- **Quy tắc ngôn từ:**
  - ✅ **Được dùng:** *Sàng lọc, nhận diện dấu hiệu nghi ngờ, bất đối xứng hình thái, khuyến nghị thăm khám chuyên khoa, người dùng*.
  - ❌ **Cấm dùng:** *Chẩn đoán, điều trị, chữa khỏi, bệnh nhân, đơn thuốc, thay thế bác sĩ nhãn khoa*.

---

## 6. LƯU Ý VẬN HÀNH & NĂNG LỰC HỆ THỐNG CHO CHIẾN DỊCH (OPERATIONAL CAPACITY)

- **Hiệu năng xử lý:**
  - Sàng lọc sụp mi: **~ 1.0 giây** $\rightarrow$ Đáp ứng lưu lượng lớn, phù hợp làm nội dung phễu tiếp cận ban đầu.
  - Sàng lọc lác mắt (Hirschberg): **~ 9.1 giây** trên CPU máy chủ.
- **Cơ chế khóa đơn luồng (`_prediction_lock`):**
  - Nhằm bảo vệ máy chủ không bị treo khi chạy mô hình học sâu ResNet-18 trên CPU, backend Hirschberg chỉ xử lý **1 yêu cầu tại một thời điểm**.
  - Nếu có yêu cầu thứ hai gửi đến đồng thời, hệ thống sẽ trả về mã `HTTP 503 (Retry-After: 2)`.
  - **Khuyến nghị cho Marketing:** Không chạy quảng cáo dồn lượng truy cập lớn trong vài phút (tránh flash mob traffic); phân bổ ngân sách đều trong ngày hoặc triển khai thêm hàng đợi (Queue) khi nâng cấp hạ tầng GPU.

---

## 7. ĐỊNH HƯỚNG MỞ RỘNG & HỢP TÁC B2B (ROADMAP & COLLABORATION)

```mermaid
flowchart LR
    G1["Giai đoạn 1 (Đã hoàn thành)<br>• Bản thử nghiệm ban đầu<br>• Kiểm chứng thuật toán MRD1 & Hirschberg"]
    G2["Giai đoạn 2 (Hiện tại)<br>• Hợp nhất cổng remicare.id.vn<br>• Trực quan hóa Song thị & Nhược thị<br>• Chuẩn hóa bảo mật Zero-Retention"]
    G3["Giai đoạn 3 (Kế hoạch ngắn hạn)<br>• Xuất phiếu sàng lọc PDF tải về máy<br>• Thử nghiệm lâm sàng mù đôi tại VN"]
    G4["Giai đoạn 4 (Mở rộng B2B)<br>• Mạng lưới phòng khám nhãn khoa<br>• Sàng lọc thị lực học đường & cộng đồng"]

    G1 --> G2 --> G3 --> G4
```

1. **Phiếu kết quả PDF tổng hợp (Downloadable PDF Report):**
   Người dùng có thể xuất file PDF lưu lại kết quả sàng lọc chuẩn y văn (đường vẽ mi mắt, chỉ số MRD1, ảnh phản xạ Purkinje) để mang trực tiếp đến gặp bác sĩ mắt mà hệ thống vẫn không cần lưu dữ liệu cá nhân.
2. **Mô phỏng thị giác cảm xúc (Vision Simulator):**
   Module trực quan hóa tầm nhìn **Song thị** (*Diplopia*) và **Nhược thị** (*Amblyopia*), giúp người nhà thấu hiểu cảm giác của người mắc tật về mắt, từ đó kích hoạt hành vi đưa trẻ đi khám sớm.
3. **Mô hình hợp tác Phòng khám / Bệnh viện Mắt (B2B Referral):**
   Tại trang kết quả nghi ngờ bất thường (Tier B, Tier C), hệ thống cung cấp danh mục các phòng khám nhãn khoa uy tín gần nhất để người dùng chủ động liên hệ đặt lịch khám chuyên sâu.

---
*Tài liệu được tổng hợp và chuẩn hóa dựa trên toàn bộ mã nguồn thực tế của hệ thống RemiCare.*  
*Liên hệ hỗ trợ kỹ thuật và hợp tác: `contact@remicare.id.vn` | Website: `https://remicare.id.vn`*
