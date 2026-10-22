# Báo cáo giai đoạn 3: dọn trùng lặp còn lại

Nhánh: `v15/g3-don-trung-lap` (tạo từ `main` tại `33b899d`, sau khi gộp G2). Mỗi commit đều qua `mkdocs build --strict` và `npm test`:

| Commit | Việc |
|---|---|
| `0a76db1` | G3.1: hình thức nhỏ và minuet–trio, mỗi điều viết một nơi, link qua lại |
| `c3e4998` | G3.2: hai trang nhà soạn nhạc link qua lại |
| `22f67e6` | Sửa hai lỗi tìm được ở G1, G2 (chủ site đã đồng ý làm trong nhánh này): mục lục sách in, câu về trang Đương đại |

## File đã sửa và lý do

| Mục | File | Việc |
|---|---|---|
| G3.1 | `docs/nhac-ly/31-hinh-thuc-nho.md` | Bài 31 là nơi chi tiết của hai đoạn, hai đoạn có tái hiện, ba đoạn. Mục "Minuet và trio" giữ câu dẫn (nay gộp ý "A B A lớn, mỗi khối là hai đoạn có tái hiện") và bảng ba khối. Bỏ phần trùng với trang Minuet và Trio: giải thích tên gọi trio, ví dụ *Eine kleine Nachtmusik* thành link. Đoạn về scherzo còn một câu, link sang trang Scherzo. Bốn câu quiz vẫn đúng với phần còn lại |
| G3.1 | `docs/hinh-thuc/minuet-trio.md` | Chuyện tên gọi "trio" chỉ còn ở đây: gộp hai cách giải thích cũ ("xưa kia chỉ còn 3 nhạc cụ chơi" ở trang này, "thói quen thời Baroque dùng ba nhạc cụ" ở bài 31) thành một câu. Thêm câu: mỗi khối minuet và trio là một hình thức hai đoạn có tái hiện, link về mục tương ứng của bài 31 |
| G3.1 | `docs/hinh-thuc/scherzo.md` | "Khung ABA" link về mục Minuet và trio của bài 31 |
| G3.1 | `docs/hinh-thuc/index.md` | Bảng "Các hình thức cơ bản": Hai đoạn, Ba đoạn dẫn tới mục tương ứng ở bài 31; Rondo, Chủ đề và biến tấu, Minuet và trio dẫn tới trang riêng. Thêm một câu dẫn tới bài 31. Mục "Hình thức sonata" và "Fugue" rút còn một câu mỗi mục, dẫn tới trang riêng. Hai gợi ý nghe bị bỏ (Mozart Giao hưởng số 40; Bach BWV 578) đã có sẵn trên trang Hình thức sonata và trang Fugue |
| G3.1 | `docs/nghe-nhac/mozart-40.md` | Link "hình thức sonata" trước trỏ tới mục sonata (nay chỉ còn một câu) của trang mục lục; nay trỏ thẳng tới trang Hình thức sonata |
| G3.2 | `docs/lich-su/nha-soan-nhac.md` | 19 mục (Bach, Handel, Haydn, Mozart, Beethoven, Schubert, Mendelssohn, Chopin, Schumann, Liszt, Brahms, Tchaikovsky, Grieg, Debussy, Rachmaninoff, Ravel, Bartók, Prokofiev, Shostakovich) thêm dòng cuối "**Nhạc cho piano:** xem Nhà soạn nhạc cho piano", trỏ đúng mục của người đó |
| G3.2 | `docs/piano/nha-soan-nhac.md` | 19 mục thêm dòng "**Cuộc đời và các tác phẩm khác:** Nhà soạn nhạc". Clara Schumann (chỉ có ở trang này) có dòng riêng trỏ tới mục Thế kỷ 19 của trang Các nhà soạn nhạc nữ, thay cho câu "Xem Các nhà soạn nhạc nữ" không có anchor |
| Sửa | `hooks/books.py` | Tiêu đề chương trong HTML đã build còn thực thể (`&para;` của ký hiệu ¶), nên mục lục cả bảy cuốn sách in hiện chữ "&para;" sau mỗi tên chương (36 chỗ ở cuốn *Piano: 10 bài đầu tiên và bài học tác phẩm*). Giải mã thực thể trước khi bỏ ¶ |
| Sửa | `tests/browser.mjs` | Luồng sách in kiểm thêm: mục lục không còn thực thể HTML hay ký hiệu ¶; thông báo lỗi nói rõ chuỗi tìm thấy |
| Sửa | `docs/lich-su/index.md` | Câu "Mỗi thời kỳ có một trang chi tiết (…, 10 tác phẩm để nghe)" liệt kê cả Đương đại, nhưng trang Âm nhạc hôm nay không có các mục đó. Tách ra: "Thời Đương đại có trang Âm nhạc hôm nay: những nhà soạn nhạc nên nghe, tin đáng chú ý, tên tuổi Việt Nam và các cuộc thi lớn", đúng các mục của trang ấy |

## Build và kiểm thử

- `mkdocs build --strict`: `INFO - Documentation built in 2.29 seconds`, không cảnh báo. Kể từ G1, lệnh này báo lỗi nếu link tới một mục không có, nên mọi link mới (13 link mới hoặc đổi đích trong G3.1, 39 link trong G3.2) đã được kiểm. Trang Lịch sử có 19 link sang trang Piano; trang Piano có 20 link ngược lại (19 người cộng Clara Schumann).
- `npm test`: `Kiểm thử: 4 nhóm chạy song song trong 12.4 giây, mọi nhóm đều đạt`; `counts: 110 chỗ ghi con số đã kiểm, 214 cụm số + danh từ đã quét, 0 lỗi`. Câu "10 tác phẩm để nghe" ở `lich-su/index.md` vẫn được kiểm thử con số nhận ra.
- Thử bỏ bản sửa `books.py`: luồng sách in báo lỗi ở cả bảy cuốn; trả lại thì đạt.

Đối chiếu tiêu chí "Xong khi" của kế hoạch:

- [x] Mọi link mới qua kiểm thử anchor của G1.
- [x] Bài 31 và mục Hình thức link qua lại: bài 31 dẫn tới trang mục lục Hình thức, Hình thức sonata, Minuet và Trio, Scherzo. Trang mục lục, Minuet và Trio, Scherzo dẫn về bài 31.
- [x] Build và test đạt.

## Chỗ chưa chắc hoặc đã bỏ qua

- Câu gộp về tên gọi "trio" chỉ ghép hai câu đã có trên site, không thêm sự kiện mới. Hai câu cũ không ghi nguồn, và tôi chưa kiểm chứng riêng.
- Bài 31, trang Minuet và Trio, trang Scherzo không có mục "## Nguồn" (quy tắc của site đòi mỗi trang có). Tính rộng ra, 4/10 trang trong `docs/hinh-thuc/` và 10/38 trang trong `docs/nhac-ly/` thiếu mục này. Thêm nguồn cần kiểm chứng từng trang, ngoài phạm vi G3; nên làm ở một đợt rà nội dung.
- Bảng ở trang mục lục Hình thức: kế hoạch nói ba dòng (Hai đoạn, Ba đoạn, Minuet và trio); tôi gắn link cho cả năm dòng cho thống nhất.
- Clara Schumann không có id riêng trên trang Các nhà soạn nhạc nữ (bà là một đoạn trong mục Thế kỷ 19), nên link trỏ tới mục Thế kỷ 19.
- Không làm theo kế hoạch: hai bài Minuet của Petzold.

## Nguồn đã dùng để kiểm chứng

- Kế hoạch `plans/ke-hoach-v15.md`, mục G3.
- Các trang trong `docs/` và HTML đã build (`site/`) để lấy id tiêu đề: bài 31 (`#hinh-thuc-hai-oan-binary`, `#hai-oan-co-tai-hien-rounded-binary`, `#hinh-thuc-ba-oan-ternary`, `#minuet-va-trio`), các mục nhà soạn nhạc (ví dụ `#johann-sebastian-bach-16851750`), trang Các nhà soạn nhạc nữ (`#the-ky-19`).
- Trang Hình thức sonata và trang Fugue, để chắc nội dung bị rút khỏi trang mục lục đã có ở đó.
