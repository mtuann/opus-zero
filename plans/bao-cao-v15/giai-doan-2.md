# Báo cáo giai đoạn 2: hiệu năng và trợ năng

Nhánh: `v15/g2-hieu-nang` (tạo từ `main` tại `e0b1be8`, sau khi gộp G1). Mỗi commit đều qua `mkdocs build --strict` và `npm test`:

| Commit | Việc |
|---|---|
| `345b7a3` | G2.1: hoãn tải chỉ mục tìm kiếm |
| `f715c13` | G2.2: khuông nhạc và công cụ khởi tạo khi gần màn hình |
| `69fb5e5` | G2.3: tự host font, bỏ chuỗi `@import`, bỏ JetBrains Mono |
| `b631851` | Sửa G2.1: chờ 2 giây sau khi trang tải xong mới thả yêu cầu tải chỉ mục |
| `be8b757` | Sửa G2.3: `font-display: fallback` cho chữ thường, bớt bộ ký tự thừa, nạp trước font màn hình đầu |
| `d552ebd` | G2.4: tên cho hộp tìm kiếm, gạch chân link trong bài |
| `58abfe1` | Công cụ đo `tools/lighthouse/` (cách đo G2.0) |

Hai commit "sửa" đến từ số đo sau G2.3 (xem mục Số đo). Mỗi mục G2.1–G2.4 vẫn nằm trong các commit riêng, không commit nào trộn hai mục.

## File đã sửa và lý do

| Mục | File | Việc |
|---|---|---|
| G2.1 | `overrides/main.html` | Đoạn script trong `extrahead` (chạy trước bundle của Material) bọc `XMLHttpRequest.prototype.open` và `send`. Yêu cầu tới `search/search_index.json` bị giữ cho tới khi: người đọc mở tìm kiếm (focus vào hộp tìm kiếm, bấm nhãn `label[for="__search"]`, phím tắt f, s, /), URL có `?h=`, hoặc trang đã tải xong được 2 giây và trình duyệt rảnh (`requestIdleCallback`, dự phòng `setTimeout`). Mọi yêu cầu khác đi qua nguyên vẹn. Đã xác nhận trong bundle 9.7.6: chỉ mục tải bằng XMLHttpRequest (hàm `ks()`), phím tắt f, s, / gọi `focus()` vào ô tìm kiếm |
| G2.1 | `tests/browser.mjs` | Luồng mới với XMLHttpRequest giả: chưa mở tìm kiếm thì yêu cầu bị giữ và yêu cầu khác đi qua; mở ô tìm kiếm thì gửi; có `?h=` thì gửi ngay. `open()` nhận thêm `opts.query`, `opts.before` |
| G2.2 | `docs/assets/js/loader.js` | Công cụ ở xa màn hình chỉ được tải khi người đọc cuộn tới cách nó khoảng 600px (IntersectionObserver). Công cụ giữ trạng thái người học (quiz, danh sách việc, kế hoạch, nhật ký, dữ liệu, đàn MIDI) và mermaid tải ngay (`NOW`). `OZLoader.whenNear(el, fn)` để khởi tạo từng khối. Phần phía trên chỗ đang đọc, kể cả phần trước đích của link `#mục` (khi mở trang và khi đổi hash), được vẽ ngay rồi cuộn lại cho đúng đích. Trình duyệt không có `overflow-anchor` (Safari) thì tự cuộn bù khi khối phía trên màn hình lớn lên. Trước khi in (`beforeprint`) vẽ hết; `OZLoader.all()` cho nút in. abcjs được tải sẵn khi trình duyệt rảnh để kịp vẽ khi in. Vẽ hết ngay khi không có IntersectionObserver hoặc `window.OZ_EAGER = true` |
| G2.2 | `abc.js`, `recognition.js`, `print.js`, `opus.css` | Vẽ từng khuông và từng ví dụ phong cách qua `whenNear`. Khuông chưa vẽ ẩn mã ABC và giữ chỗ bằng chiều cao tạm ước theo số hệ khuông (đo trên các trang của site). Nút "In bài này" gọi `OZLoader.all()` rồi mới in |
| G2.2 | `tests/browser.mjs`, `tests/a11y.mjs` | Đặt `OZ_EAGER` để vẫn kiểm mọi khuông và công cụ. Luồng mới với IntersectionObserver giả và vị trí giả: lúc đầu không vẽ, tải sẵn abcjs khi rảnh, vẽ khi tới gần, tải `listen.js` khi tới gần, vẽ hết khi in, link `#dien-tau` và `#bai-tap-chuan-bi` |
| G2.2 | `docs/sw.js`, `loader.js`, README, AGENTS.md | VERSION 16; cách thêm công cụ cho đúng cơ chế mới |
| G2.3 | `docs/assets/fonts/` (mới) | Be Vietnam Pro 400, 700 (thường và nghiêng) và Literata 600; mỗi kiểu ba bộ ký tự latin, latin-ext, vietnamese (15 file woff2, khoảng 150 KB, lấy từ Google Fonts); `fonts.css`; văn bản giấy phép SIL OFL 1.1 của hai font |
| G2.3 | `mkdocs.yml`, `opus.css`, `hooks/books.py` | `theme.font: false`, nạp `fonts.css` trước các CSS khác. Bỏ `@import` Literata. Đặt `--md-text-font`; khối mã dùng font hệ thống. Tiêu đề khuông ghi rõ độ đậm 600. Sách in dùng chung `fonts.css` |
| G2.3 | `fonts.css`, `overrides/main.html` (commit sửa) | Be Vietnam Pro dùng `font-display: fallback`, Literata dùng `swap`. Thứ tự `@font-face`: latin-ext, vietnamese, latin. Nạp trước Be Vietnam Pro 400 và Literata 600 (bộ latin và vietnamese) |
| G2.3 | `tests/site_static.py` | Kiểm tra 7: không còn chỗ nào tải font từ Google Fonts; mọi `url()` trong `fonts.css` và mọi font được nạp trước có file |
| G2.3 | `docs/tai-lieu-tham-khao.md`, README, AGENTS.md | Ghi nguồn và giấy phép font; bỏ dòng "Noto Music qua Google Fonts" (không trang nào dùng) |
| G2.4 | `hooks/a11y.py` | `aria-label="Tìm kiếm"` cho hộp tìm kiếm (`div.md-search[role=dialog]`) và cho ô ẩn `#__search`, ở mọi trang kể cả 404 (`on_post_template`) |
| G2.4 | `opus.css` | Link trong nội dung bài có gạch chân trên màn hình. Không gạch: link trông như nút (`md-button`, `oz-btn`), ký hiệu ¶, nút sửa trang, thẻ blog. Khi in vẫn bỏ gạch chân |
| G2.4 | `tests/a11y.mjs`, README | Thêm một lượt axe trên toàn trang chủ (đầu trang, hộp tìm kiếm), ngoài phần bài viết của 41 trang |
| G2.0 | `tools/lighthouse/serve.mjs`, `measure.mjs` | Máy chủ HTTP/2 có nén để đo tại máy; chạy Lighthouse 12.2.1 ba trang và in dòng bảng (dùng được cho site thật ở G8) |
| | `plans/v15-do-luong.md` | Cách đo tại máy, bảng trước và sau theo từng bước, nhận xét |

## Build và kiểm thử

- `mkdocs build --strict`: `INFO - Documentation built in 2.56 seconds`, không cảnh báo.
- `npm test`: `Kiểm thử: 4 nhóm chạy song song trong 15.5 giây, mọi nhóm đều đạt`. Các dòng liên quan: `browser: 46 luồng tương tác, 0 lỗi` (36 luồng cũ, 3 luồng tìm kiếm, 7 luồng khởi tạo khi gần màn hình); `a11y: 41 trang (cả toàn trang chủ), 0 loại vi phạm, 0 phần tử`; `site_static: 7 kiểm tra, 0 lỗi`.
- Thử làm hỏng (hoàn tác trước khi commit):
    - Bỏ việc giữ yêu cầu tải chỉ mục: hai luồng tìm kiếm báo lỗi.
    - `loader.js` không chờ gần màn hình: 4 luồng báo lỗi.
    - Bỏ việc vẽ hết trước khi in: 1 luồng báo lỗi.
    - Bỏ phần "trước đích #mục": 2 luồng báo lỗi.
    - Thêm `@import` Google Fonts hoặc xóa một file font: `site_static` báo.
    - Hook không thêm nhãn: `a11y.mjs` báo cả `aria-dialog-name` lẫn `label`.

## Kiểm tra trên Chrome 155 thật (puppeteer)

- **G2.1:**
    - Lúc `load` (87 ms) chưa có yêu cầu tải chỉ mục; yêu cầu đi lúc 2.089 ms.
    - Tìm "hợp âm ba" và "hop am ba" ra cùng kết quả (bài 10 trong 5 kết quả đầu).
    - Chuyển trang bằng `navigation.instant` rồi tìm được.
    - Bấm `/` ngay khi DOM sẵn sàng thì yêu cầu đi sau 2 ms; trang có `?h=` yêu cầu trước `load`.
    - Mất mạng sau lần ghé đầu vẫn tìm được, vì chỉ mục đã nằm trong bộ nhớ đệm của service worker.
    - Trang chỉ gửi yêu cầu tải chỉ mục một lần. Yêu cầu thứ hai thấy sau khi chuyển trang là của chính Material và lấy từ bộ nhớ đệm HTTP; bản trước G2 cũng có.
- **G2.2** (khung điện thoại 412×823):
    - Für Elise lúc mở chưa tải abcjs, `abc.js`, `listen.js`, chưa vẽ khuông nào. Sau 3 giây abcjs được tải sẵn nhưng chưa vẽ.
    - Cuộn dần 71 bước: không lần nào thấy khuông chưa vẽ trong màn hình.
    - Mở thẳng `#bai-tap-chuan-bi`, `#dien-tau`, `#kiem-tra-nhanh`, hoặc đổi hash trong trang: đích cách đầu màn hình 68 px (dưới thanh tiêu đề), mọi khuông phía trên đã vẽ.
    - Nút "In bài này" ở bài 9: khuông được vẽ trước khi gọi `window.print()`. In ra PDF (`beforeprint`): 0/4 → 4/4 khuông.
    - Chuyển trang bằng `navigation.instant` rồi cuộn dần: đủ 4/4 khuông và khung nghe.
    - Trang chủ: công cụ đọc nốt chỉ tải khi cuộn tới.
    - Giả lập trình duyệt không có `overflow-anchor`, nhảy xuống cuối "10 bài đầu tiên" rồi cuộn ngược 51 bước: nội dung không bị xô lần nào. Đối chứng (tắt anchoring, không tự bù): 3 lần bị xô, tới 137 px.
    - Không có lỗi JavaScript.
- **G2.3:**
    - Không yêu cầu nào tới `fonts.googleapis.com` hay `fonts.gstatic.com` ở trang chủ, Für Elise, Debussy và sách in.
    - Trang chủ tải 6 file font (khoảng 65 KB). Trước G2 là khoảng 256 KB; riêng Literata 175 KB qua chuỗi `@import`.
    - Đã xem ảnh chụp chữ có dấu ở tiêu đề Literata và thân bài, nền sáng, nền tối và trang sách in: hiển thị đúng.
- **G2.4:** đã xem ảnh chụp thẻ "Bạn đang ở đâu?", nút trang chủ, bảng "Mở sách" (nền tối), danh sách công cụ, chân trang.
- **Mermaid:** sơ đồ ở `hinh-thuc/sonata/` vẽ giống hệt bản `main`.

## Số đo

Bảng đầy đủ ở `plans/v15-do-luong.md`. Đo tại máy qua HTTP/2, Lighthouse 12.2.1, trung vị 3 lần:

| Trang | Trước G2 | Sau G2 |
|---|---|---|
| Trang chủ | 92 (92/92/92), trợ năng 93, LCP 3,2 s, CLS 0,021, tải trước LCP 1.698 KiB, chỉ mục trước LCP | 99 (99/99/99), trợ năng 100, LCP 1,7 s, CLS 0, tải trước LCP 153 KiB, chỉ mục sau LCP |
| Für Elise | 91 (91/90/91), trợ năng 93, LCP 3,0 s, TBT 152 ms | 99 (99/99/98), trợ năng 100, LCP 2,0 s, TBT 64 ms |
| Debussy | 97 (97/97/97), trợ năng 93, LCP 2,1 s | 99 (99/99/99), trợ năng 100, LCP 1,9 s |

Thực hành tốt giữ 96, SEO 100.

Đối chiếu từng tiêu chí "Xong khi" của kế hoạch:

- [x] Mỗi mục G2.1–G2.4 là một (hoặc hai) commit riêng.
- [x] Có bảng đo trước và sau.
- [x] Trợ năng 100 trên ba trang (tại máy).
- [x] Hiệu năng trang chủ và Für Elise tăng rõ: cả 3 lần đều từ 98 trở lên; `search_index.json` không còn trong các yêu cầu trước LCP ở trang chủ.
- [x] Không có lỗi JavaScript của site; in một bài vẫn đủ khuông nhạc; `npm test` đạt.

## Quyết định khác với kế hoạch

- **G2.3 tự host mọi font, không bật plugin `privacy`.** Kế hoạch đề xuất plugin, và cho phép tự host Literata nếu plugin không tải được nó. Thử build với plugin cho thấy:
    - Plugin tải về và đưa lên site 7,6 MB: mọi độ đậm, mọi bộ ký tự của Be Vietnam Pro và JetBrains Mono, và hai bản mermaid. Một bản là chuỗi `unpkg.com/mermaid@11` trong bundle của Material, bản kia là chuỗi jsDelivr trong `loader.js`.
    - Mỗi lần CI build (năm lần mỗi lần deploy: bốn job kiểm thử, mỗi job tự build, và một job build) phải tải lại từ Google và CDN; mạng lỗi thì build dừng.
    - Các trang sách in do `hooks/books.py` ghi ở bước sau không được xử lý, vẫn gọi Google Fonts.

    Tự host chỉ cần 15 file (khoảng 150 KB), không cần mạng lúc build, chọn được đúng độ đậm, và sách in dùng chung.
- **Literata còn một độ đậm (600) và bỏ trục `opsz`.** Site chỉ dùng 600; độ 500 trước đây chỉ phục vụ tiêu đề khuông, nay ghi rõ 600. Bộ latin giảm từ 86 KB còn 22 KB. Không có `opsz`, tiêu đề lớn dùng thiết kế mặc định thay cho bản tối ưu cỡ chữ lớn; khác biệt nhỏ, ảnh chụp không thấy xấu.
- **`font-display`:** Literata dùng `swap` như kế hoạch, nhưng Be Vietnam Pro dùng `fallback`, như Material vẫn đặt trước đây.
    - Với `swap`, đoạn giới thiệu trang chủ vẽ bằng font hệ thống rồi đổi sang Be Vietnam Pro, xuống thêm một dòng, xô khối bên dưới 36 px (CLS 0,181).
    - `fallback` chờ font tối đa khoảng 100 ms (đặc tả khuyến nghị "100ms or less") và chỉ đổi font trong khoảng 3 giây đầu. Cộng với nạp trước font, CLS còn 0.
- **Thứ tự `@font-face`** đổi thành latin-ext, vietnamese, latin. Theo đặc tả, khi `unicode-range` chồng nhau, quy tắc khai báo sau được thử trước. Với thứ tự của Google, các chữ ơ, ư, đ, ĩ… lấy từ bộ latin-ext, nên mọi trang tiếng Việt tải cả latin-ext lẫn vietnamese. Sau khi đổi, trang chủ tải 6 file font thay vì 9.
- **Chỉ mục tìm kiếm chờ 2 giây sau `load`** rồi mới chờ trình duyệt rảnh. Kế hoạch chỉ nói "load xong và rảnh". Với `fallback`, đoạn chữ LCP có thể vẽ sau `load` ở lần tải rất nhanh, và chỉ mục khi đó lọt vào nhóm "trước LCP" (2/3 lần đo).
- **G2.4: lỗi Lighthouse thật là `aria-dialog-name` (hộp tìm kiếm `role="dialog"` không tên) và `link-in-text-block`.** Kế hoạch đoán lỗi là nhãn ô tìm kiếm. Ô ẩn `#__search` không bị Lighthouse báo vì bị ẩn bằng CSS, nhưng lượt axe toàn trang (jsdom không có CSS của Material) thì báo, nên cũng được gắn nhãn.
- **Cách đo dùng HTTP/2.** Kế hoạch gợi ý `npx serve site`, tức HTTP/1.1. Lần đo đầu bằng một máy chủ HTTP/1.1 cho thấy G2.3 làm FCP chậm thêm 0,5–0,8 giây và Debussy rơi 98 → 92. Nguyên nhân: Lighthouse mô phỏng giới hạn 6 kết nối mỗi nguồn khi font chuyển về cùng nguồn với site. GitHub Pages dùng HTTP/2, nên tôi đo lại mọi bước (kể cả mốc "trước") qua HTTP/2 và đưa công cụ vào `tools/lighthouse/`.
- **G2.5 (mermaid, tùy chọn): không làm.** Lúc giữa giai đoạn tôi đã báo có thể có hai bản mermaid được tải; kiểm trên Chrome cho thấy không phải vậy.
    - Chỉ một bản được tải: Material tự tải `unpkg.com/mermaid@11` (hiện chuyển tới 11.17.2, khoảng 3,6 MB chưa nén) và vẽ sơ đồ trước khi `loader.js` quét.
    - Material gỡ lớp `mermaid` khỏi khối khi xử lý, nên quy tắc `.mermaid` trong `loader.js` không bao giờ chạy.
    - Muốn ghim phiên bản hay dùng được khi mất mạng thì phải đổi cách Material tải mermaid (hoặc chép 3,6 MB vào repo); việc đó ngoài tầm một thay đổi nhỏ.

## Chỗ chưa chắc hoặc đã bỏ qua

- **Chưa đo trên site thật** (chưa deploy). Số tại máy tốt hơn số trên site thật. Sau khi push, chạy `node tools/lighthouse/measure.mjs https://mtuann.github.io/opus-zero/ 3` và ghi vào `plans/v15-do-luong.md`.
- **Thực hành tốt 96** do lỗi 404 của `api.github.com/.../releases/latest` (repo chưa có release, G7.2). Khi đo nhiều lần trong một giờ, API trả 403 vì hết hạn mức; không do site.
- **Bấm Ctrl+P trong vài giây đầu,** trước khi abcjs được tải sẵn, thì khuông ở xa chưa vẽ trong bản in. Nút "In bài này" không bị vấn đề này.
- **Tự cuộn bù khi không có `overflow-anchor`** chỉ áp dụng cho khối vẽ đồng bộ (khuông nhạc). Công cụ tải bất đồng bộ ở phía trên màn hình vẫn có thể đẩy nội dung trên Safari.
- **Chiều cao tạm của khuông** thấp hơn thật ở khối dày trên màn hình hẹp (740 so với 962 px). Chỉ ảnh hưởng thanh cuộn khi khối còn ở xa.
- **`fallback`:** trên mạng rất chậm, chữ thân bài có thể trống tối đa khoảng 100 ms, rồi hiện bằng font hệ thống và đổi font trong 3 giây đầu (giống Google Fonts trước đây).
- **Quy tắc `.mermaid` trong `loader.js`** và kiểm tra 1 của `site_static.py` dựa trên giả định `loader.js` vẽ mermaid. Có thể dọn ở một giai đoạn sau.
- **Ngoài phạm vi, chưa sửa:** mục lục sách in hiện nguyên chữ "&para;" sau tên chương. `books.py` bỏ ký tự "¶", nhưng trang đã build ghi nó là `&para;`; chỉ cần `html.unescape` trước khi bỏ. Câu về trang Đương đại ở `lich-su/index.md` (đã ghi ở báo cáo G1).

## Nguồn đã dùng để kiểm chứng

- Bundle của Material 9.7.6 (`site/assets/javascripts/bundle.*.min.js`): `ks()` tải chỉ mục bằng XMLHttpRequest; phím tắt f, s, /; mermaid tải từ `unpkg.com/mermaid@11` nếu `window.mermaid` chưa có. Mã plugin `material/plugins/privacy/plugin.py` (những gì plugin tải và xử lý).
- CSS Fonts Module Level 4, mục `unicode-range` ("the last rule defined is the first to be checked for a given character") và `font-display` (`fallback`: "100ms or less is recommended", "3s is recommended"): https://www.w3.org/TR/css-fonts-4/ ; MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- Google Fonts CSS API (Be Vietnam Pro v12, Literata v40); văn bản giấy phép OFL trong kho google/fonts (`ofl/bevietnampro/OFL.txt`, `ofl/literata/OFL.txt`).
- Lighthouse 12.2.1 (JSON các lần đo, trace của một lần đo trang chủ để xem các sự kiện LayoutShift), Chrome 155, puppeteer-core 23.11.1 đi kèm Lighthouse.
