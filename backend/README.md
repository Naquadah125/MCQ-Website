# Setup dự án Backend

## Cấu hình:
npm install
cp .env.example .env

# Lưu ý: Mở file .env và chỉnh sửa nội dung như sau để khớp với Frontend:
# PORT=5001
# MONGO_URI=mongodb://localhost:27017/exam_management_db
# JWT_SECRET=secret_key_bat_ky

npm run dev
# (Lệnh trên dùng để chạy mode development, tự động reset khi sửa code)

## Reset Database
npm run seed

## Các nhánh trong dự án:
main     : Nhánh chính, dùng để tổng hợp lại và để nộp bài.
frontend : Nhánh làm giao diện (UI - ReactJS).
backend  : Nhánh xử lý logic + database (NodeJS - Bạn ở đây).

## Hướng dẫn làm việc với nhánh backend

1. Chuyển nhánh:

git checkout backend

Kiểm tra nhánh hiện tại:
git branch

Dấu * phải nằm bên cạnh backend.

2. Quy trình:

Lấy code mới nhất từ GitHub:
git pull origin backend

Push lên nhánh backend:
git add .
git commit -m "Mô tả tính năng vừa làm"
git push origin backend

Khi cần cập nhật code từ nhánh main:
git checkout main
git pull origin main

git checkout backend
git merge main


## Caution
Nếu có báo conflict -> Nhắn tui để xử lý