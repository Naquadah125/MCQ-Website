npm install
npm run dev

Reset db
npm run seed

admin:
admin@test.com
123

test chức năng: 
- **Đăng ký / Đăng nhập**
  - Đăng ký tài khoản **student** và **teacher** (UI + API) và đăng nhập thành công
  - Đăng nhập bằng tài khoản **admin**, **teacher**, **student**

- **Student**:
  - Tham gia bài thi (vào kỳ thi đang diễn ra), nộp bài, xử lý hết giờ tự động
  - Xem **Lịch sử** và **Xem lại** bài thi (review result)
  - Kiểm tra giao diện khi chưa có kỳ thi hoặc khi đã hoàn thành

- **Teacher**:
  - Tạo câu hỏi thủ công và bằng **Import (CSV / XLSX)**, kiểm tra validation (môn/khối đồng nhất)
  - Tạo kỳ thi từ ngân hàng (hoặc từ bộ import), kiểm tra auto-prefill subject/grade
  - Mở **Lịch sử bài thi** (select phải hiển thị các exam của teacher), thử export CSV
  - Kiểm tra tính năng tạo đề ngẫu nhiên (nếu đã triển khai)

- **Admin**:
  - Tạo / sửa / xóa tài khoản student/teacher, đổi role
  - Kiểm tra **Audit Log** hiển thị đúng các hành động (đăng nhập, tạo/xóa câu hỏi, tạo/xóa exam)

- **Seed & kiểm tra dữ liệu**:
  - Chạy `npm run seed` để tạo dữ liệu demo (3 exams: upcoming/ongoing/finished, demo teacher/student)
  - Xác nhận các user demo tồn tại: `admin@test.com` (123), `teacher@test.com` (123), `student@test.com` (123)


để chạy backend(terminal riêng)