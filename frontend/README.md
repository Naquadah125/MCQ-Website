# Setup dự án Frontend

## Cấu hình:
npm install
npm start

## Các nhánh trong dự án:
main     : Nhánh chính, dùng để tổng hợp lại và để nộp bài.
frontend : Nhánh làm giao diện.
backend  : Nhánh xử lý logic + database.

## Hướng dẫn làm việc với nhánh frontend

1. Chuyển nhánh:

git checkout frontend

Kiểm tra nhánh hiện tại:
git branch

Dấu * phải nằm bên cạnh frontend.

2. Quy trình:

Lấy code mới nhất từ GitHub:
git pull origin frontend

Push lên nhánh frontend:
git add .
git commit -m "Mô tả giao diện vừa làm"
git push origin frontend

Khi cần cập nhật code từ nhánh main:
git checkout main
git pull origin main

git checkout frontend
git merge main


## Caution
Nếu có báo conflict -> Nhắn tui để xử lý