# Hệ thống Giám sát Vệ sinh Tay (VST SYSTEM)

Ứng dụng chuyên nghiệp dành cho nhân viên y tế để ghi nhận và báo cáo kết quả giám sát tuân thủ vệ sinh tay tại Bệnh viện Đa khoa Tân Phú.

---

## 📱 Cách lấy Link truy cập trên điện thoại (Dùng Vercel)

Đây là cách dễ nhất để có link chạy thật trên điện thoại:

1. Truy cập [Vercel.com](https://vercel.com/) và chọn **Continue with GitHub**.
2. Nhấn **Add New** -> **Project**.
3. Tìm repository `vst-system` của bạn và nhấn **Import**.
4. Nhấn **Deploy**.
5. Sau khi xong, Vercel sẽ cho bạn một đường link (ví dụ: `https://vst-system.vercel.app`).
6. **Mẹo:** Vercel sẽ hiện một hình ảnh xem trước trang web, bạn có thể nhấn vào đó để lấy **Mã QR**. Dùng điện thoại quét mã này để mở ứng dụng ngay lập tức.

---

## 🚀 Hướng dẫn đồng bộ lên GitHub (Nếu chưa làm)

### Cách 1: Sử dụng giao diện Web
1. Tạo Repo mới trên GitHub.
2. Chọn **uploading an existing file**.
3. Kéo toàn bộ file dự án vào và nhấn **Commit changes**.

### Cách 2: Sử dụng Git Command Line
```bash
git init
git add .
git commit -m "Initial commit"
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
