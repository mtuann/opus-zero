# Opus Zero

Sổ tay học **piano cổ điển** từ con số 0 đến nâng cao: lộ trình, kỹ thuật, 10 bài hai tay đầu tiên, 34 bài học tác phẩm, hòa âm bên phím, cách tập; cùng nhạc lý, luyện tai, lịch sử, nghe nhạc và các công cụ luyện tập chạy ngay trong trình duyệt (kể cả với đàn MIDI).

Website: https://mtuann.github.io/opus-zero/

## Chạy trên máy

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve                     # mở http://127.0.0.1:8000/opus-zero/
```

## Kiểm thử

```bash
mkdocs build --strict      # build site/ (bắt link nội bộ và anchor hỏng)
npm ci                     # cài công cụ kiểm thử (lần đầu)
npm test                   # chạy toàn bộ kiểm thử (4 nhóm song song, khoảng 20 giây)
npm test -- a11y           # chỉ chạy một nhóm: nhanh, trang-1, trang-2 hoặc a11y
```

`tests/run.mjs` chia kiểm thử thành 4 nhóm chạy song song: **nhanh** (mọi kiểm thử nhỏ cùng các luồng tương tác của `browser.mjs`), **trang-1** và **trang-2** (mỗi nhóm mở một nửa số trang), **a11y**. Các kiểm thử mở trang chờ bộ tải báo mọi công cụ đã khởi tạo (`OZLoader.done`) thay vì chờ cố định, nên nhanh gấp khoảng 3 lần so với trước.

`npm test` gồm:

| Kiểm thử | Kiểm tra gì |
|---|---|
| `tests/data.mjs` | Gộp dữ liệu sao lưu: 300 cặp dữ liệu ngẫu nhiên, kiểm tra không mất dữ liệu, gộp nhiều lần không nhân đôi, thứ tự gộp không đổi kết quả |
| `tests/unit.mjs` | Hàm thuần: tên nốt, gam, hợp âm, chấm cao độ và nhịp, kế hoạch học, sinh bài tập |
| `tests/browser.mjs` | Mở từng trang đã build như trình duyệt thật: không lỗi JavaScript, mọi khuông nhạc và công cụ khởi tạo, không tải script thừa; thử đàn MIDI ảo, micro ảo, bàn phím |
| `tests/a11y.mjs` | Khả năng tiếp cận (axe-core) trên 41 trang tiêu biểu |
| `tests/site_static.py` | Kiểm tra tĩnh: khối mermaid có quy tắc tải, sách "Hướng dẫn nghe" khớp nav, VERSION của sw.js và loader.js khớp nhau, nhóm kiểm thử trong `tests/run.mjs` khớp ma trận CI |
| `tests/search.mjs` | Tìm kiếm có dấu và không dấu ra đúng trang |
| `tests/abc_bars.py` | Độ dài từng ô nhịp trong mọi khối ```abc (hiểu cả nốt hoa mỹ `{…}`, bè chồng `&` và liên ba `(p:q:r`) và các đoạn nhạc tổng hợp |

GitHub Actions chạy toàn bộ kiểm thử **trước mỗi lần deploy**: nếu có lỗi, site không bị cập nhật. `.github/workflows/test.yml` chạy mỗi nhóm thành một job song song (môi trường chung ở `.github/actions/setup`); `deploy.yml` gọi lại workflow này, đồng thời build bản cho Pages, và chỉ deploy khi mọi nhóm đều đạt. Nhánh khác và pull request cũng được kiểm thử bằng `test.yml`.

## Deploy

Mỗi lần push lên nhánh `main`, GitHub Actions (`.github/workflows/deploy.yml`) tự build và đưa site lên GitHub Pages.
Lần đầu cần vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.

## Cấu trúc

```
docs/
├── index.md              Trang chủ (có tóm tắt tiến độ hôm nay)
├── bat-dau/              Bài 0, kiểm tra đầu vào, lộ trình piano năm đầu, lộ trình nghe hiểu và nhạc lý, tóm tắt in được, hỏi đáp
├── piano/                Trục chính: lộ trình 0 → nâng cao, bắt đầu bên phím đàn, 10 bài hai tay, 8 trang kỹ thuật,
│   │                     5 trang tập luyện, tác phẩm theo cấp, lịch sử cây đàn, thể loại, nhà soạn nhạc, nghệ sĩ
│   ├── hoa-am/           Hòa âm bên phím và ứng tác (5 trang)
│   └── tac-pham/         34 bài học tác phẩm (Minuet K. 2 → Ballade số 1)
├── nhac-ly/              32 bài nhạc lý + âm học + 3 bài ôn tập (khuông nhạc nghe được, quiz) + từ điển
├── nhan-dien/            Nhận diện bằng tai: so sánh thời kỳ, thể loại, dấu vân tay, luyện nghe, nghe mù
├── luyen-tap/            Công cụ luyện tập: đọc nốt, thị tấu, chơi theo, hát lại và máy lên dây, thu âm, phiếu bài tập và giấy kẻ khuông in được
├── luyen-tai/            Luyện tai; công cụ nhận biết quãng, hợp âm, gam và kết nằm ngay trong từng bài
├── lich-su/              Lịch sử, dòng thời gian, nhà soạn nhạc (cả nữ), opera, Việt Nam, đương đại
├── hinh-thuc/            Tổng quan + 5 trang hình thức chi tiết (sonata, fugue, biến tấu, rondo, concerto)
├── nhac-cu/              Nhạc cụ trong dàn nhạc (phần nghe): dàn nhạc, violin, cello, guitar, sáo, clarinet, trumpet
├── nghe-nhac/            42 hướng dẫn nghe, 16 về nhạc piano (có ghi mốc theo bản thu), đọc tên tác phẩm, nghe gì tiếp
├── blog/posts/           Nhật ký học (blog)
├── tai-nguyen.md         Tài nguyên
├── manifest.webmanifest  Cài như ứng dụng (PWA)
├── sw.js                 Service worker: dùng khi không có mạng
└── assets/               CSS, JavaScript, icon
overrides/main.html       Thêm manifest và màu chủ đề vào <head>
hooks/search_vi.py        Tìm kiếm tiếng Việt không dấu
hooks/books.py            Tạo các sách in được (site/sach/*.html); danh sách chương ở biến BOOKS
hooks/a11y.py             Vá nhỏ về trợ năng cho HTML sinh từ Markdown (ô đánh dấu của danh sách việc)
hooks/redirects.py        Trang chuyển hướng cho địa chỉ cũ đã đổi chỗ hoặc đã gộp vào trang khác (biến REDIRECTS; đích có thể kèm #mục)
hooks/meta.py             Mô tả ngắn cho từng trang; ảnh xem trước khi chia sẻ link nằm ở docs/assets/og.png
tests/                    Kiểm thử tự động (npm test)
tools/figures.py          Sinh hình minh họa (SVG, sơ đồ cấu trúc) và chèn vào trang giữa <!-- fig:TÊN -->
tools/keysigs.mjs         Vẽ sẵn 15 hóa biểu bằng abcjs (chạy: node tools/keysigs.mjs)
```

## JavaScript

| File | Vai trò |
|---|---|
| `audio.js` | Phát nốt bằng mẫu âm piano thật (Salamander, CC BY 3.0, `docs/assets/samples/piano/`) hoặc âm tổng hợp; nút gốc chung cho phổ âm thanh |
| `midi.js`, `mic.js`, `assess.js` | Đàn MIDI (Web MIDI), micro dùng chung, chấm cao độ và nhịp |
| `playalong.js`, `dictation.js`, `recorder.js`, `spectrum.js` | Chơi theo, hát lại, chép giai điệu, thu âm (IndexedDB), phổ âm thanh |
| `viz.js` | Hình phản hồi dùng chung: piano roll, dải nhịp gõ, bàn phím nhỏ, so sánh chép giai điệu, biểu đồ tiến bộ |
| `plan.js` | Kế hoạch học tự thích ứng và bảng năng lực |
| `progress.js` | Lưu tiến độ trong `localStorage` |
| `theory.js` | Lõi nhạc lý: tên nốt, gam, hợp âm, hóa biểu |
| `abc.js` | Vẽ khối ```abc thành khuông nhạc kèm trình phát luyện tập: tốc độ, lặp lại, nghe từng tay, gõ nhịp, chế độ giá nhạc |
| `practice.js` | Danh sách việc đánh dấu được, bài đang tập, tự đánh giá chặng piano |
| `sight2.js` | Thị tấu hai tay: sinh bài 4 ô trên khuông kép theo 4 cấp (`OZSight2.gen`), tự chấm |
| `quiz.js` | Khối ```quiz và trạng thái "đã học" |
| `note-reader.js`, `interval-trainer.js`, `chord-trainer.js`, `scale-trainer.js`, `circle.js`, `rhythm.js`, `sight-reading.js`, `build.js` | Công cụ luyện tập |
| `placement.js` | Khối ```placement: bài kiểm tra đầu vào |
| `worksheet.js` | Phiếu bài tập in được |
| `timeline.js` | Dòng thời gian, đọc từ bảng dữ liệu trên trang |
| `piano.js`, `metronome.js`, `tuner.js` | Bàn phím, máy đếm nhịp, máy lên dây |
| `flashcards.js` | Thẻ ghi nhớ, đọc từ các bảng có cột đầu "Thuật ngữ" |
| `journal.js` | Nhật ký luyện tập và tóm tắt trang chủ |
| `recognition.js` | Ví dụ phong cách, đoán phong cách, nhận biết kết và kết cấu, nghe mù (bản thu Wikimedia Commons), phiếu nghe mù |
| `listen.js` | Nghe kèm bản thu (bản gợi ý từ Commons hoặc lưu ở `docs/assets/audio/` với nguồn IMSLP, YouTube, link file, file trên máy), ghi mốc trong bảng "Theo dõi khi nghe", bật/tắt mốc tham khảo (`ref` trong `data-rec`) để so sánh |
| `acoustics.js` | Chuỗi bồi âm và so sánh hệ lên dây |
| `staffpaper.js`, `print.js` | Giấy kẻ khuông in được; nút "In bài này" |
| `pwa.js` | Đăng ký service worker |
| `data.js` | Dữ liệu của tôi: sao lưu, khôi phục kiểu gộp (hàm `OZData.merge`), xóa |
| `loader.js` | Bộ tải theo nhu cầu: mỗi trang chỉ tải những công cụ nó dùng |

## Viết bài mới

1. Tạo file `.md` trong thư mục phù hợp.
2. Thêm vào mục `nav` trong `mkdocs.yml`.
3. Muốn chèn khuông nhạc có nút phát, dùng khối mã `abc`. Bản nhạc hai tay dùng `%%score {RH LH}`, `V:RH clef=treble`, `V:LH clef=bass` và mỗi dòng nhạc bắt đầu bằng `[V:RH]` hoặc `[V:LH]`; số ngón viết `!1!`…`!5!`; bàn đạp viết `"_Ped."` và `"_*"` (abcjs không hiểu `!ped!`):

   ````markdown
   ```abc
   X:1
   L:1/4
   K:C
   C D E F | G4 |]
   ```
   ````

4. **Thêm công cụ JavaScript mới:** tạo file trong `docs/assets/js/`, đăng ký hàm khởi tạo bằng
   `(window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);`
   và **thêm một quy tắc vào `RULES` trong `loader.js`** (bộ chọn CSS → các script cần, theo thứ tự phụ thuộc).
   Mỗi trang chỉ tải script mà nó dùng; quên thêm quy tắc thì công cụ không chạy (`npm test` sẽ báo lỗi).
5. Quiz cuối bài dùng khối mã `quiz`: dòng `?` là câu hỏi, `+` đáp án đúng, `-` đáp án sai, `>` giải thích.
6. Chèn công cụ vào bất kỳ trang nào bằng một thẻ `div`, ví dụ
   `<div class="oz-piano" data-range="C4-C5" data-notes="C4 E4 G4" data-play="chord"></div>`.
   Các lớp có sẵn: `oz-note-reader`, `oz-interval-trainer`, `oz-chord-trainer`, `oz-keysig-quiz`,
   `oz-circle`, `oz-rhythm`, `oz-sight`, `oz-piano`, `oz-piano-explorer`, `oz-metronome`, `oz-tuner`,
   `oz-flashcards`, `oz-journal`, `oz-summary`, `oz-scale-trainer`, `oz-build`, `oz-worksheet-gen`, `oz-timeline`.
7. **Thêm bài vào sách in được:** thêm đường dẫn trang vào danh sách tương ứng trong `hooks/books.py` (`tests/site_static.py` sẽ báo lỗi nếu thêm hướng dẫn nghe mà quên sách).
8. **Hình minh họa:** đặt `<!-- fig:TÊN -->` vào trang, định nghĩa hình trong `tools/figures.py`, chạy `python3 tools/figures.py`. Sửa dữ liệu hình (ví dụ âm vực, cấu trúc tác phẩm) cũng chỉ cần sửa ở đó rồi chạy lại.
9. Bài nhật ký học: tạo file trong `docs/blog/posts/` với `date:` ở phần đầu (xem bài mẫu).

## Kiểm tra link tự động

Workflow `.github/workflows/link-check.yml` chạy mỗi thứ Hai và mở issue "Báo cáo link hỏng" nếu có link hỏng. Có thể chạy tay trong tab **Actions**. Quy trình cập nhật nội dung theo quý: xem `docs/cap-nhat.md`.

## Ghi chú kỹ thuật

- `requirements.txt` ghim `mkdocs==1.6.1`. Đừng nâng lên MkDocs 2.x: Material for MkDocs không tương thích với phiên bản đó.
- Khi sửa nhiều JS/CSS, tăng `VERSION` trong `docs/sw.js` **và** `docs/assets/js/loader.js` (hai số phải khớp nhau — `tests/site_static.py` kiểm tra) để người dùng ứng dụng đã cài nhận bản mới ngay.
- Máy lên dây cần quyền micro và chỉ chạy trên HTTPS (GitHub Pages đã có sẵn).
- Tiến độ luyện tập lưu trong `localStorage` của trình duyệt (khóa `opus-zero:v1`), không gửi đi đâu.
- Thư viện bên ngoài: [abcjs](https://paulrosen.github.io/abcjs/) 6.7.1 đi kèm trong repo (`docs/assets/js/vendor/`, `docs/assets/css/vendor/`) để khuông nhạc vẫn vẽ được khi mất mạng; font Literata, Be Vietnam Pro, Noto Music qua Google Fonts.
