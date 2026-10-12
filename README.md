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
├── index.md              Trang chủ
├── bat-dau/              Cách dùng, lộ trình, thói quen mỗi ngày
├── nhac-ly/              Bài học nhạc lý (có khuông nhạc phát được âm thanh)
├── luyen-tap/            Đọc nốt, quãng, máy đếm nhịp, nhật ký
├── luyen-tai/            Luyện tai
├── lich-su/              Lịch sử và âm nhạc đương đại
├── hinh-thuc/            Hình thức và thể loại
├── nhac-cu/              Piano, violin, guitar
├── nghe-nhac/            Nhật ký nghe nhạc
├── tai-nguyen.md         Tài nguyên
└── assets/               CSS, JavaScript, favicon
```

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

4. Chèn công cụ luyện tập vào bất kỳ trang nào bằng một thẻ `div`:
   `<div class="oz-note-reader"></div>`, `<div class="oz-interval-trainer"></div>`,
   `<div class="oz-metronome"></div>`, `<div class="oz-journal"></div>`.

## Ghi chú kỹ thuật

- `requirements.txt` ghim `mkdocs==1.6.1`. Đừng nâng lên MkDocs 2.x: Material for MkDocs không tương thích với phiên bản đó.
- Tiến độ luyện tập lưu trong `localStorage` của trình duyệt (khóa `opus-zero:v1`), không gửi đi đâu.
- Thư viện bên ngoài: [abcjs](https://paulrosen.github.io/abcjs/) 6.7.1 qua jsDelivr; font Literata, Be Vietnam Pro, Noto Music qua Google Fonts.
