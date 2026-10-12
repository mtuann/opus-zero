# Opus Zero

Sổ tay học đọc nhạc và nhạc cổ điển từ con số 0: nhạc lý, luyện tai, lịch sử, nghe nhạc và các công cụ luyện tập chạy ngay trong trình duyệt.

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
npm test                   # chạy toàn bộ kiểm thử
```

`npm test` gồm:

| Kiểm thử | Kiểm tra gì |
|---|---|
| `tests/data.mjs` | Gộp dữ liệu sao lưu: 300 cặp dữ liệu ngẫu nhiên, kiểm tra không mất dữ liệu, gộp nhiều lần không nhân đôi, thứ tự gộp không đổi kết quả |
| `tests/unit.mjs` | Hàm thuần: tên nốt, gam, hợp âm, chấm cao độ và nhịp, kế hoạch học, sinh bài tập |
| `tests/browser.mjs` | Mở từng trang đã build như trình duyệt thật: không lỗi JavaScript, mọi khuông nhạc và công cụ khởi tạo, không tải script thừa; thử đàn MIDI ảo, micro ảo, bàn phím |
| `tests/a11y.mjs` | Khả năng tiếp cận (axe-core) trên 17 trang tiêu biểu |
| `tests/search.mjs` | Tìm kiếm có dấu và không dấu ra đúng trang |
| `tests/abc_bars.py` | Độ dài từng ô nhịp trong mọi khối ```abc và các đoạn nhạc tổng hợp |

GitHub Actions chạy toàn bộ kiểm thử **trước mỗi lần deploy**: nếu có lỗi, site không bị cập nhật. Nhánh khác và pull request được kiểm thử bởi `.github/workflows/test.yml`.

## Deploy

Mỗi lần push lên nhánh `main`, GitHub Actions (`.github/workflows/deploy.yml`) tự build và đưa site lên GitHub Pages.
Lần đầu cần vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.

## Cấu trúc

```
docs/
├── index.md              Trang chủ (có tóm tắt tiến độ hôm nay)
├── bat-dau/              Bài 0, kiểm tra đầu vào, 3 lộ trình, tóm tắt in được, hỏi đáp
├── nhac-ly/              32 bài nhạc lý + âm học + 3 bài ôn tập (khuông nhạc nghe được, quiz) + từ điển
├── nhan-dien/            Nhận diện bằng tai: so sánh thời kỳ, thể loại, dấu vân tay, luyện nghe, nghe mù
├── luyen-tap/            16 công cụ luyện tập, phiếu bài tập và giấy kẻ khuông in được
├── luyen-tai/            Luyện tai
├── lich-su/              Lịch sử, dòng thời gian, nhà soạn nhạc (cả nữ), opera, Việt Nam, đương đại
├── hinh-thuc/            Tổng quan + 5 trang hình thức chi tiết (sonata, fugue, biến tấu, rondo, concerto)
├── nhac-cu/              Piano, violin, guitar (lộ trình + 10 bài đầu), cách tập, mua đàn, dàn nhạc
├── nghe-nhac/            23 hướng dẫn nghe (có ghi mốc theo bản thu YouTube), đọc tên tác phẩm, nghe gì tiếp
├── blog/posts/           Nhật ký học (blog)
├── tai-nguyen.md         Tài nguyên
├── manifest.webmanifest  Cài như ứng dụng (PWA)
├── sw.js                 Service worker: dùng khi không có mạng
└── assets/               CSS, JavaScript, icon
overrides/main.html       Thêm manifest và màu chủ đề vào <head>
hooks/search_vi.py        Tìm kiếm tiếng Việt không dấu
hooks/books.py            Tạo các sách in được (site/sach/*.html); danh sách chương ở biến BOOKS
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
| `abc.js` | Vẽ khối ```abc thành khuông nhạc có nút phát |
| `quiz.js` | Khối ```quiz và trạng thái "đã học" |
| `note-reader.js`, `interval-trainer.js`, `chord-trainer.js`, `scale-trainer.js`, `circle.js`, `rhythm.js`, `sight-reading.js`, `build.js` | Công cụ luyện tập |
| `placement.js` | Khối ```placement: bài kiểm tra đầu vào |
| `worksheet.js` | Phiếu bài tập in được |
| `timeline.js` | Dòng thời gian, đọc từ bảng dữ liệu trên trang |
| `piano.js`, `metronome.js`, `tuner.js` | Bàn phím, máy đếm nhịp, máy lên dây |
| `flashcards.js` | Thẻ ghi nhớ, đọc từ các bảng có cột đầu "Thuật ngữ" |
| `journal.js` | Nhật ký luyện tập và tóm tắt trang chủ |
| `recognition.js` | Ví dụ phong cách, đoán phong cách, nhận biết kết và kết cấu, nghe mù (bản thu Wikimedia Commons), phiếu nghe mù |
| `listen.js` | Nghe kèm bản thu YouTube và ghi mốc thời gian trong hướng dẫn nghe |
| `acoustics.js` | Chuỗi bồi âm và so sánh hệ lên dây |
| `staffpaper.js`, `print.js` | Giấy kẻ khuông in được; nút "In bài này" |
| `pwa.js` | Đăng ký service worker |
| `data.js` | Dữ liệu của tôi: sao lưu, khôi phục kiểu gộp (hàm `OZData.merge`), xóa |
| `loader.js` | Bộ tải theo nhu cầu: mỗi trang chỉ tải những công cụ nó dùng |

## Viết bài mới

1. Tạo file `.md` trong thư mục phù hợp.
2. Thêm vào mục `nav` trong `mkdocs.yml`.
3. Muốn chèn khuông nhạc có nút phát, dùng khối mã `abc`:

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
7. **Thêm bài vào sách in được:** thêm đường dẫn trang vào danh sách tương ứng trong `hooks/books.py`.
8. **Hình minh họa:** đặt `<!-- fig:TÊN -->` vào trang, định nghĩa hình trong `tools/figures.py`, chạy `python3 tools/figures.py`. Sửa dữ liệu hình (ví dụ âm vực, cấu trúc tác phẩm) cũng chỉ cần sửa ở đó rồi chạy lại.
9. Bài nhật ký học: tạo file trong `docs/blog/posts/` với `date:` ở phần đầu (xem bài mẫu).

## Kiểm tra link tự động

Workflow `.github/workflows/link-check.yml` chạy mỗi thứ Hai và mở issue "Báo cáo link hỏng" nếu có link hỏng. Có thể chạy tay trong tab **Actions**. Quy trình cập nhật nội dung theo quý: xem `docs/cap-nhat.md`.

## Ghi chú kỹ thuật

- `requirements.txt` ghim `mkdocs==1.6.1`. Đừng nâng lên MkDocs 2.x: Material for MkDocs không tương thích với phiên bản đó.
- Khi sửa nhiều JS/CSS, tăng `VERSION` trong `docs/sw.js` để người dùng ứng dụng đã cài nhận bản mới ngay.
- Máy lên dây cần quyền micro và chỉ chạy trên HTTPS (GitHub Pages đã có sẵn).
- Tiến độ luyện tập lưu trong `localStorage` của trình duyệt (khóa `opus-zero:v1`), không gửi đi đâu.
- Thư viện bên ngoài: [abcjs](https://paulrosen.github.io/abcjs/) 6.7.1 qua jsDelivr; font Literata, Be Vietnam Pro, Noto Music qua Google Fonts.
