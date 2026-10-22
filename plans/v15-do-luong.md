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
