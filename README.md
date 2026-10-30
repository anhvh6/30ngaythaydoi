# 30 Ngày Thay Đổi Khuôn Mặt — MeGa Phương

Website tĩnh HTML/CSS/JavaScript, không cần cài thư viện hoặc chạy build.

## Chạy local

Chạy `./start-local.ps1` bằng PowerShell, hoặc:

```sh
python -m http.server 5173 --bind 127.0.0.1
```

Mở http://127.0.0.1:5173.

## Deploy lên Vercel

Import repository `anhvh6/30ngaythaydoi`, chọn nhánh `main` và Root Directory là thư mục gốc. Cấu hình `vercel.json` đặt Framework là Other, bỏ qua build và phục vụ các file tĩnh từ thư mục gốc. Không cần biến môi trường.

## Nội dung và tính năng

- `index.html`: nội dung trang và CSS nền đã biên dịch.
- `effects.css`: hiệu ứng, responsive và popup.
- `app.js`: điều hướng, popup ảnh, chuyển ảnh, phóng to, thông tin chi tiết và hỏi đáp.
- `site-data.js`: nội dung các popup.
- `assets/`: hình ảnh của trang.

Ảnh nội dung mở popup toàn màn hình; ảnh nền đầu trang chỉ dùng để trang trí. Nút Bắt đầu hành trình chuyển đến phần giới thiệu. Mục Lộ Trình & Quyền Lợi có thông tin chụp ảnh, thời gian học 60 ngày, Gmail, giới hạn thiết bị và phí duy trì. Không có form đăng ký hoặc backend. Hỏi đáp dùng nội dung có sẵn; liên hệ qua Zalo. Video YouTube, font và ảnh nền Unsplash cần Internet.
