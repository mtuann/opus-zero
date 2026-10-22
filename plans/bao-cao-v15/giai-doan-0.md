# Báo cáo giai đoạn 0: sổ tay cho agent, kiểm tra ABC, mốc đo ban đầu

Nhánh: `v15/g0-so-tay` (tạo từ `main` tại `84d8610`).

## File đã sửa và lý do

| File | Việc |
|---|---|
| `AGENTS.md` (mới) | Sổ tay cho agent: dự án, cấu trúc, lệnh build và kiểm thử, cách làm việc, quy tắc nội dung, bản quyền (kể cả giấy phép dùng cá nhân không được đăng công khai), mẫu bài học tác phẩm, hướng dẫn nghe, trang hòa âm bên phím (lấy từ trang thật: `beethoven-op49-2.md`, `chopin-nocturne-op9-2.md`, `debussy-preludes.md`, `hoa-am/ket.md`), quy ước ABC, khối đặc biệt (quiz, `data-rec`, hình, công cụ), hai checklist, con số viết tay, tài liệu tham khảo |
| `CLAUDE.md` (mới) | Một dòng `@AGENTS.md` |
| `tests/abc_warn.mjs` (mới) | Đọc mọi khối ```abc trong `docs/` bằng `abcjs.parseOnly`, báo khối có cảnh báo (file và thứ tự khối), thoát mã lỗi nếu có; danh sách `IGNORE` kèm lý do (hiện trống) |
| `tests/run.mjs` | Thêm `abc_warn.mjs` vào nhóm `nhanh` (không thêm nhóm, ma trận CI không đổi) |
| `README.md` | Thêm dòng `abc_warn.mjs` vào bảng kiểm thử |
| `plans/ke-hoach-v15.md` | Mục 2, Nội dung: thêm quy tắc giấy phép dùng cá nhân không cho phép đăng công khai (chủ site đã duyệt) |
| `plans/v15-do-luong.md` (mới) | Mốc đo ban đầu |

## Build và kiểm thử

- `mkdocs build --strict`: `INFO - Documentation built in 2.27 seconds`, không cảnh báo.
- `npm test`: `Kiểm thử: 4 nhóm chạy song song trong 10.2 giây, mọi nhóm đều đạt`; `abc_warn: 358 khối, 0 khối có cảnh báo`.
- Kiểm tra kiểm thử bắt được lỗi: tạm thêm một trang có khối `!ped!C D !8va(!E F | G4 |]` thì `abc_warn` báo `Unknown decoration: ped` và `Unknown decoration: 8va(`, thoát mã 1; đã xóa trang thử.

## Số đo

Xem `plans/v15-do-luong.md`. Tóm tắt (trung vị 3 lần): trang chủ 86, Für Elise 86, Debussy 96; trợ năng 93 cả ba trang; chỉ mục tìm kiếm 4,17 MB (1,22 MB khi nén), chiếm khoảng 70% dung lượng tải.

## Chỗ chưa chắc hoặc đã bỏ qua

- **G7.2 (release `v14`) chưa làm được:** lệnh `gh release create` bị chặn vì tạo nội dung công khai trên GitHub; cần chủ site tự chạy. Ghi chú release đã soạn (link tương đối đã đổi thành link tuyệt đối, 30 link tới site đều trả về 200).
- Điểm hiệu năng dao động mạnh giữa các lần đo (xem nhận xét trong `plans/v15-do-luong.md`); đề xuất G2 dùng lần xấu nhất trong 3 lần làm tiêu chí.
- Ghi cho G4a: kế hoạch muốn `check_audio.py` đòi mọi `data-rec` có `licUrl`, nhưng các bản thu phạm vi công cộng hiện có (Musopen, Marcelle Meyer, Aya Higuchi...) không có `licUrl`. G4a cần quyết: thêm link cho phạm vi công cộng (ví dụ trang mô tả file) hay cho phép thiếu `licUrl` khi `lic` là "phạm vi công cộng".
- `AGENTS.md` mục "Con số viết tay" mới liệt kê nơi cần sửa; cách đăng ký con số sẽ ghi sau G1.

## Nguồn đã dùng để kiểm chứng

- Trang thật trong `docs/` (mẫu), `docs/assets/js/listen.js` (chỉ dựa vào tiêu đề "Theo dõi khi nghe" để tìm bảng; nhãn "IMSLP" hay "Wikimedia Commons" theo `page`), `tests/` (cách lấy khối ABC).
- `_imslp/_scripts/briefs/BRIEF.md`, `BRIEF2.md`, `_imslp/_scripts/README.md`, `_imslp/_scripts/abc/abcwarn.cjs`.
- Bundle Material 9.7.6 trong `site/assets/javascripts/`: chỉ mục tìm kiếm tải bằng `XMLHttpRequest` (khớp nhận định ở G2.1).
