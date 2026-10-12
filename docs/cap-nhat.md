# Cập nhật

Trang này ghi lại những thay đổi lớn của site và quy trình giữ cho nội dung luôn đúng.

## Nhật ký thay đổi

### 10/2026: Phiên bản 9 (hình phản hồi và hình chạy theo âm nhạc)

- **Con trỏ chạy trên khuông:** khi bấm phát, nốt đang vang được tô sáng, trên mọi khuông nhạc của site và các ví dụ phong cách.
- **Phản hồi trực quan khi luyện tập:** chơi theo, hát lại và đọc thị tấu vẽ **piano roll** so cao độ của bạn với nốt đúng; tiết tấu vẽ **dải thời gian** cho thấy từng lần gõ sớm hay muộn; luyện quãng, hợp âm, gam và nhận biết kết hiện **các nốt vừa nghe trên phím đàn**; chép giai điệu hiện **hình so sánh** nốt đúng và nốt bạn chép.
- **Tiến bộ theo tuần:** trang [Nhật ký](luyen-tap/nhat-ky.md) có biểu đồ độ chính xác 12 tuần cho từng kỹ năng (lịch sử được giữ khi sao lưu và gộp dữ liệu).
- **Hình cho khái niệm khó:** dẫn bè bốn bè (bài 21), quãng và kiểu chuyển động trong đối âm (bài 22), bản đồ giọng gần (bài 19), kết cấu dạng piano roll (bài 28), hiện tượng phách khi lên dây (Âm học).
- **Bản đồ nghe chạy theo bản thu:** trong các hướng dẫn nghe, khi phát bản thu YouTube đã ghi mốc, dòng sự kiện đang nghe được tô sáng.
- Mọi hình phản hồi nằm trong một module nhỏ (`viz.js`, khoảng 14 KB) chỉ tải ở trang cần; không thêm thư viện ngoài.

### 10/2026: Phiên bản 8.2 (minh họa)

Thêm khoảng 50 hình minh họa ở những chỗ hình giúp hiểu rõ hơn chữ, đều in được:

- **Nhạc cụ:** âm vực 17 nhạc cụ và 6 loại giọng so với bàn phím piano; sơ đồ chỗ ngồi dàn nhạc; các nốt trên cần đàn violin và guitar ở thế bấm thứ nhất.
- **Nhạc lý:** 15 hóa biểu kèm giọng thứ song song; vòng quãng năm bản in được; chuỗi bồi âm trên khuông; 7 điệu thức trên phím trắng; vòng chức năng hòa âm; âm vực bốn bè; hợp âm kèm ký hiệu pop và jazz; Bach Prelude kèm số La Mã; sơ đồ các hình thức nhỏ.
- **Lịch sử:** dải bảy thời kỳ; biểu đồ vòng đời nhà soạn nhạc; đoạn nhạc mẫu cho từng thời kỳ; thang Hò–Xự–Xang–Xê–Cống.
- **Nghe nhạc:** sơ đồ cấu trúc cho 18 hướng dẫn nghe; sơ đồ crescendo của Boléro; giải phẫu tên một tác phẩm.
- Hình được sinh từ dữ liệu bằng `tools/figures.py` và `tools/keysigs.mjs`; kiểm thử tự động báo lỗi nếu hình không khớp dữ liệu.

### 10/2026: Phiên bản 8.1

- **[Tóm tắt một tờ](bat-dau/tom-tat.md) thiết kế lại thành hai mặt A4** có hình minh họa: bàn phím piano ghi tên nốt (Đô giữa, nửa cung tự nhiên), khóa Sol và khóa Fa ghi tên từng dòng và khe, Đô giữa trên khuông kép, hình nốt và dấu lặng, dấu hóa, hóa biểu, gam, vòng quãng năm, hợp âm ba.
- **Sửa lỗi in bị cắt bảng** trên mọi trang: bảng rộng giờ tự co theo khổ giấy thay vì bị che mất phần bên phải; mỗi mục của tờ tóm tắt không bị tách đôi giữa hai cột.

### 10/2026: Phiên bản 8

- **[Dữ liệu của tôi](luyen-tap/du-lieu.md):** xem dữ liệu đang lưu; tải file sao lưu (có thể kèm bản thu âm); khôi phục kiểu **gộp**, có xem trước, không ghi đè, gộp nhiều lần không bị nhân đôi; xóa tiến độ hoặc bản thu âm. Dùng để chuyển dữ liệu giữa điện thoại và máy tính.
- **[Sách in được](bat-dau/sach-in.md):** 5 cuốn (nhạc lý cơ bản, nhạc lý nâng cao, tóm tắt và thuật ngữ, lịch sử, hướng dẫn nghe) có bìa, mục lục, khuông nhạc và đáp án; in hoặc lưu PDF từ trình duyệt. Tự tạo lại mỗi lần site cập nhật.

### 10/2026: Phiên bản 7 (chắc chắn hơn, nhanh hơn, dễ dùng hơn)

- **Nhanh hơn:** mỗi trang chỉ tải công cụ nó dùng. Trước đây mọi trang tải khoảng 754 KB JavaScript; nay một nửa số trang chỉ cần khoảng 25 KB. Menu được thu gọn trong mỗi trang, HTML trung bình giảm từ khoảng 102 KB xuống 47 KB.
- **Dễ dùng hơn:** menu gọn từ 12 xuống 8 mục; trang chủ mới với ba con đường bắt đầu và kế hoạch hôm nay; tìm kiếm không dấu ("hop am" tìm ra "hợp âm").
- **Tiếp cận tốt hơn:** bàn phím piano dùng được bằng phím mũi tên và Enter; nút lớn hơn trên màn hình cảm ứng; sửa thứ tự tiêu đề và bảng thiếu tiêu đề; mọi cặp màu chữ đạt chuẩn tương phản WCAG AA.
- **Chắc chắn hơn:** bộ kiểm thử tự động (đơn vị, trình duyệt, tiếp cận, tìm kiếm, ô nhịp) chạy trước mỗi lần deploy.

### 10/2026: Phiên bản 6

- **Âm thanh piano thật:** mọi công cụ dùng mẫu âm Salamander Grand Piano (CC BY 3.0, khoảng 2 MB, tải khi phát lần đầu); có thể chuyển về âm tổng hợp ở trang [Luyện tập](luyen-tap/index.md).
- **Site nghe bạn:** [Chơi theo](luyen-tap/choi-theo.md) chấm cao độ và nhịp qua micro hoặc đàn MIDI; [Hát lại](luyen-tap/hat-lai.md) chấm giọng hát theo cent; [Đọc thị tấu](luyen-tap/thi-tau.md) có chế độ chơi và được chấm.
- **Đàn MIDI:** [kết nối đàn piano điện](luyen-tap/ket-noi-midi.md) và dùng phím thật trong đọc nốt, thị tấu, chơi theo, chép giai điệu, xây hợp âm, bàn phím.
- **Kế hoạch học tự thích ứng:** trang chủ và nhật ký đề xuất buổi tập mỗi ngày dựa trên độ chính xác và thời gian chưa luyện của từng kỹ năng; bảng năng lực 13 kỹ năng.
- **Công cụ mới:** [chép giai điệu](luyen-tap/chep-giai-dieu.md), [thu âm buổi tập](luyen-tap/thu-am.md), [phổ âm thanh](luyen-tap/pho-am-thanh.md).

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
