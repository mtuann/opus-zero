# Đo lường phiên bản 15

## Cách đo

- Lighthouse 12.2.1 (`npx lighthouse@12.2.1 <url> --only-categories=performance,accessibility,best-practices,seo --output=json --chrome-flags="--headless=new" --quiet`), Chrome 155 không giao diện. Mặc định của Lighthouse: điện thoại, mạng 4G chậm mô phỏng.
- Đo trên site thật (https://mtuann.github.io/opus-zero/), chạy từ máy của chủ dự án.
- Mỗi trang 3 lần, lấy trung vị. Cột "Hiệu năng" ghi trung vị, trong ngoặc là điểm của từng lần.
- Ba trang: trang chủ, `piano/tac-pham/fur-elise/`, `nghe-nhac/debussy-preludes/`.
- Với Chrome 155, mục "phần tử LCP" của Lighthouse 12.2.1 báo lỗi (`TraceElements`), nên chưa xác định được phần tử LCP. Các chỉ số khác không bị ảnh hưởng.

## Mốc ban đầu (G0, ngày 21/10/2026, site ở commit `ed69d89`, phiên bản 14)

| Trang | Hiệu năng | Trợ năng | Thực hành tốt | SEO | FCP | LCP | TBT | CLS | Tổng tải |
|---|---|---|---|---|---|---|---|---|---|
| Trang chủ | 86 (93/65/86) | 93 | 96 | 100 | 2,1 s | 3,0 s | 0 ms | 0,019 | 1.733 KiB |
| Bài học Für Elise | 86 (86/88/67) | 93 | 96 | 100 | 2,3 s | 3,2 s | 262 ms | 0,035 | 1.742 KiB |
| Debussy: Préludes | 96 (96/96/96) | 93 | 96 | 100 | 2,2 s | 2,2 s | 0 ms | 0,001 | 1.595 KiB |

- Chỉ mục tìm kiếm `site/search/search_index.json`: 4.174.064 byte (4,17 MB), nén gzip mức 9 còn 1.223.608 byte (1,22 MB). Mọi trang tải nó ngay khi mở, chiếm khoảng 70% tổng dung lượng tải ở cả ba trang.
- `mkdocs build --strict`: sạch cảnh báo.
- `npm test`: 4 nhóm đều đạt, khoảng 10 giây; `abc_warn`: 358 khối, 0 khối có cảnh báo.

## Nhận xét về số đo

- Điểm hiệu năng dao động mạnh giữa các lần đo trên cùng một trang: trang chủ 93, 65, 86; Für Elise 86, 88, 67. Trang Debussy ổn định (96 cả ba lần). Lần đo đơn lẻ trước khi lập kế hoạch (trang chủ 65, Für Elise 52, LCP 11–12 giây) rơi vào loại lượt xấu này.
- Trung vị của hai trang đã đạt mục tiêu "từ 80 trở lên" của G2. Vì vậy ở G2 nên so cả **lần xấu nhất trong 3 lần** (mục tiêu: cả 3 lần từ 80 trở lên), **LCP** và **dung lượng tải trước LCP**, không chỉ trung vị.

## Cách đo tại máy (từ G2)

- Lighthouse 12.2.1, Chrome 155 không giao diện, điện thoại và 4G chậm mô phỏng như trên; mỗi trang 3 lần.
- Máy chủ: `node tools/lighthouse/serve.mjs site 8443`. Nó phục vụ `site/` dưới `/opus-zero/` như GitHub Pages, qua HTTP/2 (TLS tự ký), nén gzip, `Cache-Control: max-age=600`. Đo: `node tools/lighthouse/measure.mjs https://localhost:8443/opus-zero/ 3`; công cụ này in đúng các cột của bảng dưới.
- Vì sao HTTP/2: GitHub Pages phục vụ HTTP/2. Lần đo đầu của G2 dùng một máy chủ HTTP/1.1 có nén. Khi đó Lighthouse mô phỏng giới hạn 6 kết nối cho mỗi nguồn, nên khi font chuyển về cùng nguồn với site, FCP mô phỏng chậm thêm 0,5–0,8 giây và Debussy rơi từ 98 xuống 92; cũng bản build ấy, đo qua HTTP/2 thì nhanh hơn. Bảng dưới chỉ dùng số đo qua HTTP/2, kể cả mốc "trước".
- Số đo tại máy tốt hơn số đo trên site thật (trace không có độ trễ mạng thật), nên chỉ dùng để so trước và sau. Số trên site thật sau khi deploy vẫn là chuẩn (G8).

## G2: trước và sau (ngày 22/10/2026, đo tại máy qua HTTP/2)

| Bản | Trang | Hiệu năng (từng lần) | Trợ năng | Thực hành tốt | SEO | FCP | LCP | TBT | CLS | Tổng tải | Tải trước LCP | Chỉ mục tìm kiếm |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Trước G2 (`e0b1be8`) | Trang chủ | 92 (92/92/92) | 93 | 96 | 100 | 1,8 s | 3,2 s | 28 ms | 0,021 | 1.702 KiB | 1.698 KiB | trước LCP cả 3 lần |
| | Für Elise | 91 (91/90/91) | 93 | 96 | 100 | 2,1 s | 3,0 s | 152 ms | 0,032 | 1.709 KiB | 1.705 KiB | trước LCP cả 3 lần |
| | Debussy | 97 (97/97/97) | 93 | 96 | 100 | 2,1 s | 2,1 s | 0 ms | 0,001 | 1.566 KiB | 1.555 KiB | trước LCP cả 3 lần |
| Sau G2.1 và G2.2 (`f715c13`) | Trang chủ | 90 (86/90/91) | 93 | 96 | 100 | 1,8 s | 2,9 s | 29 ms | 0,149 | 1.552 KiB | 350 KiB | sau LCP cả 3 lần |
| | Für Elise | 92 (91/94/92) | 93 | 96 | 100 | 2,1 s | 3,1 s | 0 ms | 0,028 | 1.704 KiB | 353 KiB | sau LCP cả 3 lần |
| | Debussy | 97 (98/97/97) | 93 | 96 | 100 | 2,0 s | 2,0 s | 0 ms | 0,001 | 1.561 KiB | 359 KiB | sau LCP cả 3 lần |
| Sau G2.3, bản đầu (`69fb5e5`) | Trang chủ | 90 (90/90/90) | 93 | 96 | 100 | 1,7 s | 2,0 s | 11 ms | 0,181 | 1.394 KiB | 184 KiB | sau LCP cả 3 lần |
| | Für Elise | 98 (98/98/97) | 93 | 96 | 100 | 1,9 s | 2,0 s | 45 ms | 0,037 | 1.577 KiB | 216 KiB | sau LCP cả 3 lần |
| | Debussy | 98 (98/98/98) | 93 | 96 | 100 | 1,9 s | 2,0 s | 19 ms | 0,001 | 1.433 KiB | 228 KiB | sau LCP cả 3 lần |
| Sau cùng (`d552ebd`) | Trang chủ | 99 (99/99/99) | 100 | 96 | 100 | 1,4 s | 1,7 s | 10 ms | 0,000 | 162 KiB | 153 KiB | sau LCP cả 3 lần |
| | Für Elise | 99 (99/99/98) | 100 | 96 | 100 | 1,6 s | 2,0 s | 64 ms | 0,029 | 338 KiB | 181 KiB | sau LCP cả 3 lần |
| | Debussy | 99 (99/99/99) | 100 | 96 | 100 | 1,6 s | 1,9 s | 24 ms | 0,000 | 194 KiB | 192 KiB | sau LCP cả 3 lần |

- "Tải trước LCP": tổng dung lượng các yêu cầu bắt đầu trước LCP quan sát được.
- "Tổng tải" sau cùng nhỏ hẳn vì chỉ mục tìm kiếm (khoảng 1,2 MB khi nén) chỉ được yêu cầu 2 giây sau khi trang tải xong, và Lighthouse dừng trước khi nó tải xong. Người đọc thật vẫn tải chỉ mục một lần trong mỗi phiên: khi mở tìm kiếm, hoặc khi trình duyệt rảnh.

## Nhận xét về G2

- Trang chủ 92 → 99, lần xấu nhất 92 → 99; LCP 3,2 → 1,7 giây; tải trước LCP 1.698 → 153 KiB; chỉ mục không còn nằm trong các yêu cầu trước LCP. Für Elise 91 → 99, lần xấu nhất 90 → 98; LCP 3,0 → 2,0 giây; TBT 152 → 64 ms (vẽ khuông khi gần màn hình). Debussy 97 → 99. Cả ba trang đạt mục tiêu "cả 3 lần từ 80 trở lên".
- Trợ năng 93 → 100 ở cả ba trang.
- CLS: sau G2.1 và G2.2, trang chủ có lần đo CLS 0,149, và G2.3 bản đầu 0,181. Nguyên nhân là đoạn giới thiệu đổi từ font hệ thống sang Be Vietnam Pro ngay sau lần vẽ đầu, xuống thêm một dòng, đẩy khối nút và khối "Bạn đang ở đâu?" xuống 36px. Với Google Fonts trước đây, cú đổi này có hay không là tùy lúc font về. Sửa bằng `font-display: fallback` cho chữ thường cộng nạp trước font màn hình đầu: CLS còn 0.
- Thực hành tốt 96 không đổi. Lỗi console duy nhất là 404 của `https://api.github.com/repos/mtuann/opus-zero/releases/latest`: widget kho mã của Material hỏi release mới nhất, mà repo chưa có release (G7.2). Đo nhiều lần trong một giờ thì API GitHub trả 403 vì hết hạn mức 60 lượt mỗi giờ; lỗi ấy cũng không do site.
- Lúc viết nhận xét này chưa đo trên site thật vì chưa deploy (số đo ở mục dưới). Sau khi push, chạy `node tools/lighthouse/measure.mjs https://mtuann.github.io/opus-zero/ 3` và ghi vào bảng này.

## Site thật sau G0–G4a và release v14 (ngày 22/10/2026)

Site ở commit `7fefd4a` (G0–G4a và review, deploy lúc 15:09 UTC), đo ngay sau khi tạo release `v14` (G7.2). Lệnh: `node tools/lighthouse/measure.mjs https://mtuann.github.io/opus-zero/ 3`, từ máy của chủ dự án.

| Trang | Hiệu năng (từng lần) | Trợ năng | Thực hành tốt | SEO | FCP | LCP | TBT | CLS | Tổng tải | Tải trước LCP | Chỉ mục tìm kiếm |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Trang chủ | 99 (99/100/99) | 100 | 100 | 100 | 1,4 s | 1,8 s | 9 ms | 0,000 | 173 KiB | 164 KiB | sau LCP cả 3 lần |
| Bài học Für Elise | 99 (98/99/99) | 100 | 100 | 100 | 1,6 s | 1,9 s | 32 ms | 0,029 | 353 KiB | 184 KiB | sau LCP cả 3 lần |
| Debussy: Préludes | 99 (100/99/99) | 100 | 100 | 100 | 1,5 s | 1,9 s | 28 ms | 0,000 | 205 KiB | 204 KiB | sau LCP cả 3 lần |

- So với mốc ban đầu trên site thật (G0, `ed69d89`): hiệu năng trang chủ 86 → 99, Für Elise 86 → 99, Debussy 96 → 99; lần xấu nhất trong 3 lần 65 → 99 và 67 → 98; LCP 3,0 → 1,8 giây và 3,2 → 1,9 giây.
- Trợ năng 93 → 100 ở cả ba trang.
- Thực hành tốt 96 → 100: có release `v14` nên widget kho mã của Material không còn gặp 404 khi hỏi release mới nhất.
- Số trên site thật gần như bằng số đo tại máy qua HTTP/2 ở G2 (mục trên); LCP chậm hơn 0,1 giây ở trang chủ.
