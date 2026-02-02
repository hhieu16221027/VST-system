# Hệ thống Giám sát Vệ sinh Tay (VST SYSTEM)

Ứng dụng chuyên nghiệp dành cho nhân viên y tế để ghi nhận và báo cáo kết quả giám sát tuân thủ vệ sinh tay tại Bệnh viện Đa khoa Tân Phú.

---

## 🚀 Hướng dẫn đồng bộ lên GitHub

Bạn có thể chọn một trong hai cách sau để đưa code lên GitHub:

### Cách 1: Sử dụng giao diện Web (Đơn giản nhất, không cần cài đặt)
1. Truy cập [github.com](https://github.com) và đăng nhập.
2. Nhấn nút **New** (màu xanh) để tạo kho lưu trữ mới. Đặt tên (ví dụ: `vst-system`) và nhấn **Create repository**.
3. Tại trang hướng dẫn hiện ra, tìm dòng: *"...or upload an existing file"*. Nhấp vào chữ **uploading an existing file**.
4. Kéo toàn bộ các file từ máy tính của bạn và thả vào vùng tải lên của trình duyệt.
5. Cuộn xuống dưới, nhập nội dung mô tả (ví dụ: "Initial upload") và nhấn **Commit changes**.

### Cách 2: Sử dụng Git Command Line (Dành cho lập trình viên)
1. **Khởi tạo:** `git init`
2. **Thêm file:** `git add .`
3. **Lưu:** `git commit -m "Initial commit"`
4. **Kết nối & Đẩy code:**
   ```bash
   git branch -M main
   git remote add origin <URL_REPO_CỦA_BẠN>
   git push -u origin main
   ```

---

## 🛠 Cấu hình Google Sheets để nhận dữ liệu

Để dữ liệu tự động đổ về Google Sheets:

1. Mở một file Google Sheets mới.
2. Vào menu **Extensions** -> **Apps Script**.
3. Dán mã xử lý Apps Script vào.
4. Chọn **Deploy** -> **New Deployment**.
5. Chọn loại là **Web App**, đặt quyền truy cập là **Anyone**.
6. Copy **Web App URL** nhận được.
7. Mở ứng dụng VST System, vào phần **Cấu hình (biểu tượng bánh răng)** và dán URL vào ô **Google Script URL**.

---
*Phát triển bởi Đội ngũ Kiểm soát Nhiễm khuẩn - BVĐK Tân Phú.*
