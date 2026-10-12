# Cập nhật

Trang này ghi lại những thay đổi lớn của site và quy trình giữ cho nội dung luôn đúng.

## Nhật ký thay đổi

### 10/2026: Phiên bản 5

- **Nhạc lý:** 5 bài "nghe hiểu cấu trúc" (28–32): [kết cấu](nhac-ly/28-ket-cau.md), [chuỗi hòa âm](nhac-ly/29-chuoi-hoa-am.md), [phát triển môtip và cấu trúc câu](nhac-ly/30-phat-trien-motip.md), [hình thức nhỏ](nhac-ly/31-hinh-thuc-nho.md), [kỹ thuật thế kỷ 20](nhac-ly/32-ky-thuat-the-ky-20.md); bổ sung quãng ghép (bài 9), hemiola (bài 15), hợp âm cảm âm phụ (bài 19).
- **Mục mới [Nhận diện](nhan-dien/index.md):** quy trình ba câu hỏi và bảy yếu tố; bảng so sánh các thời kỳ với 10 ví dụ minh họa; nhận diện thể loại qua biên chế; dấu vân tay 20 nhà soạn nhạc; luyện tai đoán phong cách, nhận biết kết, nhận biết kết cấu; nghe mù với 10 bản thu giấy phép mở từ Wikimedia Commons; phiếu nghe mù cho bản thu của riêng bạn.

### 10/2026: Phiên bản 4

- **Nhạc lý:** bài [Âm học cơ bản](nhac-ly/am-hoc.md) với công cụ nghe chuỗi bồi âm và so sánh hệ lên dây; 7 bài **trung cấp** (21–27): hòa âm bốn bè, đối âm, hợp âm mượn, Napoli và sáu tăng, bè trầm số, phân tích, ký hiệu hợp âm pop và jazz.
- **Hình thức:** 5 trang chi tiết, mỗi trang đi qua một tác phẩm cụ thể: [sonata](hinh-thuc/sonata.md), [fugue](hinh-thuc/fugue.md), [biến tấu](hinh-thuc/bien-tau.md), [rondo](hinh-thuc/rondo.md), [concerto](hinh-thuc/concerto.md).
- **Lịch sử:** trang riêng cho 6 thời kỳ; thêm 16 chân dung nhà soạn nhạc; trang [Nhạc truyền thống Việt Nam và nhạc cổ điển](lich-su/nhac-truyen-thong-viet-nam.md).
- **Nghe nhạc:** 10 hướng dẫn nghe mới (tổng cộng 23); trang [Đọc tên tác phẩm và bản thu](nghe-nhac/doc-ten-tac-pham.md); công cụ **ghi mốc thời gian** theo bản thu YouTube của bạn ngay trong mỗi hướng dẫn.
- **Nhạc cụ:** trang [các nhạc cụ khác](nhac-cu/nhac-cu-khac.md): cello, sáo, giọng hát, organ, harpsichord.
- **Hạ tầng:** kiểm tra link tự động hằng tuần; trang [tài liệu tham khảo](tai-lieu-tham-khao.md); nút "In bài này" ở mỗi bài học; [giấy kẻ khuông in được](luyen-tap/giay-ke-khuong.md).

### 10/2026: Phiên bản 3

Bài 0, kiểm tra đầu vào, hai lộ trình, ba bài ôn tập, 6 bài nhạc lý nâng cao (15–20), trang riêng cho piano, violin, guitar với 10 bài đầu tiên, 8 hướng dẫn nghe, opera, các nhà soạn nhạc nữ, dòng thời gian, nhạc cổ điển ở Việt Nam.

### 10/2026: Phiên bản 2

14 bài nhạc lý nền tảng có quiz, từ điển thuật ngữ có thẻ ghi nhớ, 11 công cụ luyện tập, blog nhật ký học, cài như ứng dụng.

### 10/2026: Phiên bản 1

Khung site, 6 bài nhạc lý đầu tiên, 4 công cụ luyện tập.

## Quy trình giữ nội dung luôn đúng

**Hằng tuần (tự động):** GitHub Actions chạy workflow *Kiểm tra link* (`.github/workflows/link-check.yml`). Nếu có link hỏng, một **issue** "Báo cáo link hỏng" được mở trong repo. Sửa link, rồi đóng issue.

**Mỗi quý (tháng 1, 4, 7, 10), khoảng 30 phút:**

- [ ] [Âm nhạc hôm nay](lich-su/duong-dai.md): cập nhật tin đáng chú ý (cuộc thi lớn, giải Pulitzer Âm nhạc công bố tháng 5, nhà soạn nhạc qua đời).
- [ ] [Nhạc cổ điển ở Việt Nam](lich-su/viet-nam.md): dàn nhạc, nhà hát, sự kiện mới.
- [ ] [Tài nguyên](tai-nguyen.md) và trang các nhạc cụ: kiểm tra giáo trình thi cấp ABRSM, Trinity (giáo trình piano ABRSM hiện hành hết hiệu lực ngày 31/12/2026).
- [ ] Sửa dòng "Cập nhật lần cuối" ở các trang trên.
- [ ] Ghi thay đổi vào nhật ký ở trang này.

**Khi thêm nội dung mới:** ghi nguồn ở cuối trang (xem [tài liệu tham khảo](tai-lieu-tham-khao.md)); thêm trang vào mục `nav` trong `mkdocs.yml`; chạy `mkdocs build --strict` trên máy trước khi push để bắt link nội bộ hỏng.
