# Review giai đoạn G0–G4a

Người review: Claude. Phạm vi: 27 commit từ `9899518` đến `4ab3642` (G0, G1, G2, G3, G4a), trên commit kế hoạch `84d8610`.

## Kết quả

- `mkdocs build --strict`: sạch cảnh báo.
- `npm test`: 4 nhóm đều đạt. Nhóm `nhanh` gồm cả các kiểm thử mới (`counts`: 110 chỗ ghi, 0 lỗi; `levels`: 34 bài, 170 chỗ ghi chặng, 0 lỗi; `anchors`: 69 link, 0 lỗi; `check_audio --static`: 0 lỗi; `abc_warn`: 358 khối, 0 cảnh báo). `trang-1`, `trang-2`: 234 trang, 0 lỗi. `a11y`: 41 trang, 0 vi phạm.
- `python3 tools/audio/check_audio.py` (bản đầy đủ, có ffmpeg): 0 lỗi, 3 dòng chú ý (xem phần Để lại).
- Kiểm tra link và anchor nội bộ trên `site/` bằng script của v14: không lỗi mới (18 báo ở `404.html` là bình thường).
- Đối chiếu tiêu chí "Xong khi" của kế hoạch: cả năm giai đoạn đạt. Các chỗ làm khác kế hoạch (tự host font thay cho plugin `privacy`, `font-display: fallback`, chờ 2 giây trước khi tải chỉ mục, đo qua HTTP/2) đều có lý do và số đo trong báo cáo G2; tôi đồng ý.

## Kiểm tra độc lập trên Chromium

Bản build từ `4ab3642`, Playwright với Chromium, khung điện thoại 412×823 và máy tính 1280×800, service worker tắt.

| Phép thử | Kết quả |
|---|---|
| Chỉ mục tìm kiếm ở trang chủ | Trang tải xong ở 0,22 giây; yêu cầu chỉ mục đi ở 2,22 giây, không có yêu cầu nào trước khi trang tải xong. Gõ `/` rồi "hop am ba": bài 10 có trong 5 kết quả đầu |
| Font | Không có yêu cầu tới Google Fonts. Trang chủ tải 6 file woff2 tự host. Thân bài dùng Be Vietnam Pro, tiêu đề dùng Literata 600 |
| Für Elise, cuộn từ đầu tới cuối | Lúc mở chưa vẽ khuông nào (0/4). Cuộn từng 350 px: không lần nào thấy khuông chưa vẽ trong màn hình. Cuối trang 4/4, khung nghe đã khởi tạo |
| Link `#dien-tau` | Đích cách đầu màn hình 68 px, cả 4 khuông phía trên đã vẽ |
| In | Trang 10 bài đầu tiên, sau khi trang rảnh, sự kiện `beforeprint` vẽ đủ 11/11 khuông. Nút "In bài này" ở bài nhạc lý 10: 2/2 khuông đã vẽ lúc gọi in |
| Chuyển trang bằng `navigation.instant` | Từ trang chủ sang 10 bài đầu tiên rồi cuộn: 11/11 khuông |
| Sách in *Piano: 10 bài đầu tiên và bài học tác phẩm* | 132 khuông, nút "In / Lưu PDF", mục lục không còn "&para;", dùng `fonts.css` |
| Khởi tạo hai lần hay bị sót | 116 trang có từ hai loại công cụ trở lên: so số phần tử con của từng công cụ giữa chế độ vẽ hết (`OZ_EAGER`) và chế độ lười sau khi cuộn hết trang. Giống nhau ở cả 116 trang, không lỗi JavaScript |
| 31 trang mẫu, cuộn hết trang | Không lỗi JavaScript, không còn khuông chưa vẽ |

Không kiểm được: sơ đồ mermaid (máy kiểm tra không tải được unpkg.com, nơi Material lấy mermaid; báo cáo G2 đã kiểm trên Chrome thật) và Safari.

## Đã sửa trong lần review

- Bài học *Cầu nguyện buổi sáng* (Tchaikovsky): mốc dòng 5 (ô 13) đổi từ 37 thành 36 giây, theo phát hiện 4 trong báo cáo G4a: đo tay hợp âm Mi♭5 + Si4 ở 36,3 giây, căn lại ra 36. Ghi bằng `tools/audio/attach.py --ref`; chỉ số này đổi.

## Để lại (không chặn các giai đoạn sau)

- Quy tắc `.mermaid` trong `loader.js` và kiểm tra 1 của `tests/site_static.py` dựa trên giả định `loader.js` vẽ mermaid, trong khi Material tự tải mermaid. Dọn khi kiểm tra được trên trình duyệt có mạng (G2.5 hoặc G8).
- Bấm Ctrl+P trong vài giây đầu, trước khi abcjs được tải sẵn, thì khuông ở xa chưa vẽ trong bản in. Nút "In bài này" không bị.
- Ba file MP3 giữ dưới 3 giây im lặng ở cuối (`bach-prelude-bwv939`, `burgmuller-arabesque`, `minuet-sol-thu`); tiếng đã tắt hẳn nên không nghe thấy khác.
- 4/10 trang Hình thức và 10/38 trang Nhạc lý chưa có mục "## Nguồn".
- Ba trang có bản thu nhưng chưa có mốc tham khảo: *Eine kleine Nachtmusik*, *Mùa xuân* (Vivaldi), Valse La thứ (Chopin).
- Đo Lighthouse trên site thật sau khi push (G8). Tạo release `v14` (G7.2) để hết lỗi 404 ở console, điểm "Thực hành tốt" hiện là 96 vì lỗi này.
