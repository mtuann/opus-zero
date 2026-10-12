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

## Deploy

Mỗi lần push lên nhánh `main`, GitHub Actions (`.github/workflows/deploy.yml`) tự build và đưa site lên GitHub Pages.
Lần đầu cần vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.

## Cấu trúc

```
docs/
├── index.md              Trang chủ (có tóm tắt tiến độ hôm nay)
├── bat-dau/              Bài 0, kiểm tra đầu vào, 3 lộ trình, tóm tắt in được, hỏi đáp
├── nhac-ly/              20 bài nhạc lý + 3 bài ôn tập (khuông nhạc nghe được, quiz) + từ điển
├── luyen-tap/            15 công cụ luyện tập, phiếu bài tập in được
├── luyen-tai/            Luyện tai
├── lich-su/              Lịch sử, dòng thời gian, nhà soạn nhạc (cả nữ), opera, Việt Nam, đương đại
├── hinh-thuc/            Hình thức và thể loại
├── nhac-cu/              Piano, violin, guitar (lộ trình + 10 bài đầu), cách tập, mua đàn, dàn nhạc
├── nghe-nhac/            13 hướng dẫn nghe từng bước, nghe gì tiếp, mẫu ghi chép
├── blog/posts/           Nhật ký học (blog)
├── tai-nguyen.md         Tài nguyên
├── manifest.webmanifest  Cài như ứng dụng (PWA)
├── sw.js                 Service worker: dùng khi không có mạng
└── assets/               CSS, JavaScript, icon
overrides/main.html       Thêm manifest và màu chủ đề vào <head>
```

## JavaScript

| File | Vai trò |
|---|---|
| `audio.js` | Phát nốt và tiếng đếm nhịp bằng Web Audio |
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
| `pwa.js` | Đăng ký service worker |

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

4. Quiz cuối bài dùng khối mã `quiz`: dòng `?` là câu hỏi, `+` đáp án đúng, `-` đáp án sai, `>` giải thích.
5. Chèn công cụ vào bất kỳ trang nào bằng một thẻ `div`, ví dụ
   `<div class="oz-piano" data-range="C4-C5" data-notes="C4 E4 G4" data-play="chord"></div>`.
   Các lớp có sẵn: `oz-note-reader`, `oz-interval-trainer`, `oz-chord-trainer`, `oz-keysig-quiz`,
   `oz-circle`, `oz-rhythm`, `oz-sight`, `oz-piano`, `oz-piano-explorer`, `oz-metronome`, `oz-tuner`,
   `oz-flashcards`, `oz-journal`, `oz-summary`, `oz-scale-trainer`, `oz-build`, `oz-worksheet-gen`, `oz-timeline`.
6. Bài nhật ký học: tạo file trong `docs/blog/posts/` với `date:` ở phần đầu (xem bài mẫu).

## Ghi chú kỹ thuật

- `requirements.txt` ghim `mkdocs==1.6.1`. Đừng nâng lên MkDocs 2.x: Material for MkDocs không tương thích với phiên bản đó.
- Khi sửa nhiều JS/CSS, tăng `VERSION` trong `docs/sw.js` để người dùng ứng dụng đã cài nhận bản mới ngay.
- Máy lên dây cần quyền micro và chỉ chạy trên HTTPS (GitHub Pages đã có sẵn).
- Tiến độ luyện tập lưu trong `localStorage` của trình duyệt (khóa `opus-zero:v1`), không gửi đi đâu.
- Thư viện bên ngoài: [abcjs](https://paulrosen.github.io/abcjs/) 6.7.1 qua jsDelivr; font Literata, Be Vietnam Pro, Noto Music qua Google Fonts.
