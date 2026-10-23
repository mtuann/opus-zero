# Báo cáo giai đoạn 5: chơi theo tai; bài phổ biến ngoài nhạc cổ điển

Nhánh: `v15/g5-tai-va-pho-bien`, tạo từ `main` tại `7cea23b`. Mỗi commit đều qua `mkdocs build --strict` và `npm test`.

| Commit | Việc |
|---|---|
| `d813e0b` | G5.1: bài luyện tai thứ sáu *Chơi theo tai bên phím đàn*, nav, mục lục, lộ trình, bảng quãng |
| `af42734` | G5.2: năm bài phổ biến ngoài nhạc cổ điển trong *Tác phẩm theo cấp độ*; câu hỏi về nhạc phim ở trang Hỏi đáp |
| (commit cuối) | Báo cáo này |

## G5.1. Chơi theo tai bên phím đàn

### File đã sửa và lý do

| File | Thay đổi |
|---|---|
| `docs/luyen-tai/choi-bang-tai.md` (mới) | Năm mục theo kế hoạch: (1) tìm giai điệu quen trên phím, bảng bảy giai điệu của *10 bài đầu tiên* với nốt đầu và điều cần nghe; (2) đệm I, IV, V bằng tai, nghe bè trầm, ví dụ ABC "chỉ có I" và "đổi đúng chỗ", bài tự làm *Amazing Grace* so với tay trái của bài 6; (3) chơi lại câu vừa nghe với Hát lại, Chép giai điệu, bản thu; (4) dịch *Ode to Joy* sang Sol trưởng và Fa trưởng, hai khối ABC làm đáp án; (5) nghe trong đầu trước khi chơi, nối với trang Học thuộc và biểu diễn. Thêm thói quen 10 phút, kế hoạch 4 tuần với mốc tự kiểm `- [ ]`, quiz 5 câu, Nguồn |
| `mkdocs.yml` | Nav Luyện tập › Luyện tai, sau *Nghe tiến trình hòa âm* |
| `docs/luyen-tai/index.md` | "Lộ trình 6 bài", mục 6, câu "Bài 6 làm ở đàn…", "Sau 6 bài trên"; bảng "Gắn quãng với giai điệu quen thuộc" thêm cột ví dụ từ tiết mục của site và một câu về ba quãng đi xuống |
| `docs/luyen-tai/nghe-tien-trinh.md` | Dòng cuối: "Bài tiếp theo" trỏ tới bài mới |
| `docs/luyen-tap/index.md` | Một câu dẫn tới bài mới ở mục Luyện tai. Không thêm vào danh sách định nghĩa, vì danh sách ấy là các công cụ ("Bốn công cụ dưới đây"), còn bài mới không có công cụ riêng |
| `docs/piano/lo-trinh.md` | Hàng "Tai" của chặng 2: chặng này đã có vòng kết I–IV–I–V7–I ở Đô, Sol, Fa và nhạc lý bài 6–9, đúng những gì bài mới cần |
| `docs/bat-dau/lo-trinh-choi.md` | Tháng 5 (cột Tai và nghe) và một mốc tự kiểm: tháng này xong cả 10 bài và tập vòng kết ở Đô, Sol, Fa |
| `docs/piano/hoa-am/dem-giai-dieu.md` | Câu dẫn ở đoạn mở đầu: trang này chọn hợp âm bằng mắt, bài mới làm bằng tai |
| `docs/piano/index.md` | Thêm một câu vào mục "Luyện tai" của trang mục lục Piano |
| `tests/a11y.mjs`, `README.md` | Thêm trang mới vào `PAGES` (trang luyện tai *Nghe quãng* đã có trong đó); `tests/counts.py` báo README phải ghi 42 trang tiêu biểu |

Không sửa:

- `docs/assets/js/plan.js`: `SKILLS` chỉ gồm những kỹ năng có công cụ ghi kết quả (quãng, gam, hợp âm, kết…), dùng độ chính xác gần đây để xếp kế hoạch. Bài mới không có công cụ ghi kết quả, nên không có gì để thêm.
- `hooks/books.py`: các trang luyện tai không thuộc cuốn sách in nào.
- `docs/cap-nhat.md`: theo lời giao việc.

### Khuông nhạc và công cụ

- Ba khối ABC, đều ghi "soạn cho trang này", hai tay, có số ngón, theo bố cục trong `AGENTS.md`. Giai điệu là *Ah! vous dirai-je, maman* và *Ode to Joy*, đã ở phạm vi công cộng và đã có trên site. Số ngón tay phải lấy theo bài 2 và bài 3 của *10 bài đầu tiên*; hình hợp âm tay trái 5-3-1 và 5-2-1 lấy theo bài 4 (*Hänschen klein*); thế Sol và thế Fa của tay trái theo bảng ở trang *Vị trí năm ngón* (ngón 2 tay trái trên Si♭ ở thế Fa).
- Hai bàn phím `oz-piano` (gam Đô trưởng; thế Fa với Si♭), dải C4–C6. Không thêm công cụ mới.
- Đã xem trang dựng bằng Chrome không giao diện: khuông nhạc, chữ dưới khuông (I, IV, V7) và số ngón không chồng lên nhau.

### Bảng "Gắn quãng với giai điệu quen thuộc"

Mỗi ví dụ mới đã đối chiếu với khuông nhạc trên chính site:

| Quãng | Ví dụ | Kiểm ở đâu |
|---|---|---|
| 2 thứ lên | *Ode to Joy*, nốt 2 sang nốt 3 (Mi–Fa) | Bài 3, *10 bài đầu tiên* (`E E F G`) |
| 2 trưởng lên | *Frère Jacques* (Đô–Rê) | Bài 5 (`c2 d2`) |
| 3 thứ lên | *Greensleeves* (La–Đô), Largo (Mi–Sol) | Bài 7 (`A │ c2`), bài 8 (`E3 G`) |
| 3 trưởng lên | Minuet K. 2 (Fa–La); Sonata K. 545 (Đô–Mi) | Trích đoạn thật ở bài học K. 2 (`f a`); K. 545: trang bài học không in câu mở đầu, nên đối chiếu file LilyPond của Mutopia (`KV545/K545-1.ly`: `\relative c'' { c2 e4 g`) |
| 4 đúng lên | *Amazing Grace* (Sol–Đô); *Bài ca Pháp cổ* (Rê–Sol) | Bài 6 (`G │ c2`); trích đoạn thật ở bài học Tchaikovsky (`D2 │ G2`) |
| 5 đúng lên | *Ah! vous dirai-je, maman* (Đô–Sol) | Bài 2 (`C C G G`) |
| 6 trưởng lên | Nocturne Op. 9 số 2 (Si♭–Sol) | Trang bài học không in câu mở đầu; đối chiếu Mutopia (`chopin_nocturne_op9_n2.ly`: `\relative c'' { … bf8 … g'4.` = Si♭4 lên Sol5) |
| 2 thứ xuống | *Für Elise* (Mi–Rê♯) | Trích đoạn thật ở bài học và bài 10 (`e ^d`) |
| 3 thứ xuống | *Hänschen klein* (Sol–Mi) | Bài 4 (`G E E2`) |
| 5 đúng xuống | Minuet Sol trưởng (Rê–Sol) | Trích đoạn thật ở bài học và bài 9 (`d2 G`) |

### Dân ca Việt Nam

Không dùng. Tôi không tìm được bản ghi chép đã in hoặc đã đăng mà mình đối chiếu được từng nốt. Trang chỉ nói chung: nhiều bài dân ca Việt Nam dùng gam ngũ cung, và phím đàn không chơi trọn được chỗ luyến láy, nhấn nhá (dẫn tới bài 16 và trang Nhạc truyền thống Việt Nam). Nếu sau này có một tuyển tập in (ví dụ một tuyển tập dân ca có ghi người ký âm), có thể thêm một giai điệu vào bảng ở mục 1.

## G5.2. Bài phổ biến ngoài nhạc cổ điển

### File đã sửa

- `docs/piano/tac-pham-theo-cap.md`, mục `#ngoai-co-dien`: một đoạn cách xếp cấp và bảng tóm tắt sáu bài; năm mục mới theo mẫu *Mariage d'Amour* (bảng Mục/Thông tin, thêm dòng "Bản thu chính thức"; nhầm lẫn phổ biến nếu có; "Bài này dạy gì"; "Đi qua trước" với link bài học kèm chặng). Các mục xếp theo cấp, nên mục *Mariage d'Amour* (giữ nguyên chữ) chuyển xuống sau ba bài chặng 4. Thêm nguồn cho từng bài ở mục Nguồn; câu mở đầu trang nêu thêm hai tên bài.
- `docs/bat-dau/hoi-dap.md`: câu hỏi về nhạc phim vốn đã link tới `#ngoai-co-dien`; nay nêu tên từng bài và những gì mục ấy có.
- Không in khuông nhạc, tên nốt giai điệu hay lời của bài nào trong năm bài. Chỉ ghi giọng, nhịp, tốc độ, kết cấu và kỹ năng.

### Năm bài và nguồn kiểm chứng

| Bài | Sự kiện | Nguồn đã mở |
|---|---|---|
| *River Flows in You* | Yiruma (Lee Ru-ma, sinh 1978, Hàn Quốc); album *First Love* (2001, Stomp Music) | Wikipedia "Yiruma", "First Love (Yiruma album)" |
| | La trưởng, 4/4, *Freely, flowing* rồi *Moderately, expressively*; © 2001 Stomp Music; nhà xuất bản UMPG | Musicnotes MN0096080 (thông tin sản phẩm và ảnh trang 1) |
| | Không phải nhạc phim *Twilight*: *Bella's Lullaby* của Carter Burwell; bài không có trong album nhạc phim (12 bài) và album nhạc nền (21 bài) | Wikipedia "Twilight (soundtrack)"; Classic FM (2019) nói bài "frequently mistaken for 'Bella's Lullaby'" |
| | Bản của tác giả: *Yiruma SOLO: Original* và *SOLO: Easy* (Faber Music), từ album *SOLO* (2021, nhân 20 năm); *First SOLO* cho người mới hơn | Trang Faber Music của hai tập |
| | Cấp: Andrew Eales xếp tập bản gốc quanh UK Grade 5, tập bản dễ quanh Grade 3; Yiruma tự soạn cả hai dạng | Pianodao, 16/12/2023 |
| *Kiss the Rain* | Album *From the Yellow Room* (2003, Stomp Music) | Wikipedia "Yiruma" (bảng đĩa nhạc) |
| | La♭ trưởng, 4/4, ♩ = khoảng 76; tay trái mở đầu ở khóa Sol; đoạn 8va, nốt hoa mỹ, liên ba; © 2003 Stomp Music | Musicnotes MN0073221 (thông tin và ảnh trang 1) |
| | Có trong hai tập *SOLO* | Faber Music; Pianodao (danh sách bài) |
| *One Summer's Day* | Hisaishi (sinh 1950); bài 1 album nhạc phim *Spirited Away*, *Ano natsu e*, 11/7/2001, Studio Ghibli Records/Tokuma Japan Communications; New Japan Philharmonic; Hisaishi chỉ huy, chơi piano | Wikipedia "Spirited Away (soundtrack)", "Joe Hisaishi" |
| | Đô trưởng, 4/4, ♩ = 80; portato, hợp âm rải, hai lớp tay phải; © 2001 Studio Ghibli; bản easy piano chính thức | Musicnotes MN0151256 (thông tin và ảnh trang 1), MN0242959 |
| | *Ghibli Best Stories* (Zen-On), có *One Summer's Day*; "the only edition approved by the composer" | Hal Leonard, sản phẩm 49044225 |
| | *Always with Me*: nhạc Youmi Kimura, lời Wakako Kaku; ABRSM Grade 3 (2025–2026) ghi đúng hai tên | Wikipedia "Spirited Away (soundtrack)"; mục lục sách ABRSM Grade 3 (trang Just Flutes chép lại); Classic FM 6/6/2024 |
| | *Summer* thuộc phim *Kikujiro* (1999, Takeshi Kitano) | Wikipedia "Kikujiro"; thông cáo album *Dream Songs* (Shore Fire Media) |
| | *il porco rosso* trong danh sách B, Grade 8, ABRSM 2025–2026; *Porco Rosso* (1992) | Mục lục sách ABRSM Grade 8 (Just Flutes); Classic FM 6/6/2024; Wikipedia "Porco Rosso" |
| *Comptine d'un autre été: l'après-midi* | Tiersen (sinh 1970, Pháp); bài 4 album nhạc phim *Amélie* (23/4/2001, Virgin) | Wikipedia "Amélie (soundtrack)", "Yann Tiersen" |
| | *Rue des Cascades* (1996) có *Comptine d'été* số 1–3, không có bài này | Wikipedia "Rue des Cascades" |
| | Mi thứ, 4/4, ♩ = 100; tay trái hai bè (5-4 nốt đen, ngón 1 móc đơn); © 2001 Ici d'Ailleurs/BMG | Musicnotes MN0091413 (thông tin và ảnh trang 1); bài viết của Alex Burns (classicalexburns.com) về tay trái giữ nguyên hình suốt bài |
| | *Piano Works 1994–2003* (Ricordi) có bài này | Hal Leonard, sản phẩm 50490446 |
| | AMEB Piano for Leisure Series 4, Grade 6 có bài này | Mục lục trên trang Australian Music Centre (ISMN 979-0-7201-1674-7) |
| *Nuvole bianche* | Einaudi (sinh 1955, Ý); album *Una mattina* (2004); tên nghĩa là "mây trắng"; Decca phát hành lại nhân 20 năm | Classic FM "Nuvole Bianche"; uDiscover Music; Wikipedia "Ludovico Einaudi" |
| | Fa thứ; 4/4 (♩ = ca. 40, *allarg.*) rồi 12/8 (♩. = 78, *poco accel.*); tay phải hai bè; © 2004 Chester Music | Musicnotes MN0106486 (thông tin và ảnh trang 1) |
| | Tập *Una Mattina* (Music Sales), hai tập *Graded Pieces for Piano* (Chester; Preparatory–Grade 2 và Grade 3–5, đều có bài này) | Hal Leonard, sản phẩm 14009965, 280828, 280827 |
| | AMEB Piano for Leisure Series 4, Grade 6 | Australian Music Centre |
| Kênh chính thức | Yiruma: "YIRUMA place / 이루마 official", mô tả "YIRUMA's official channel by YIRUMA"; Tiersen, Einaudi, Hisaishi: kênh được link từ trang web chính thức của từng người | Trang kênh YouTube; yanntiersen.com, ludovicoeinaudi.com, joehisaishi.com |

Mọi link ngoài mới đều trả mã 200 với User-Agent của dự án (kiểm ngày 23/10/2026), trừ trang chủ Musicnotes (403), nên trang chủ ấy không được link.

### Cấp ước lượng

| Bài | Bản gốc | Căn cứ |
|---|---|---|
| *River Flows in You* | Grade 5, chặng 4 | Pianodao (cả tập bản gốc quanh Grade 5) và kết cấu trang đầu |
| *Kiss the Rain* | Grade 5, chặng 4, khó hơn một chút | Pianodao; bốn dấu giáng, hợp âm tay phải, đoạn 8va |
| *One Summer's Day* | Grade 5, chặng 4 (bản Musicnotes) | Chỉ kết cấu trang đầu; không có mốc ngoài |
| *Comptine* | Grade 6, chặng 5 | AMEB Piano for Leisure Grade 6 |
| *Nuvole bianche* | Grade 6, chặng 5 | AMEB Piano for Leisure Grade 6 |

Mọi bài cổ điển trong "Đi qua trước" có chặng dưới hoặc bằng chặng của bài; `tests/levels.py` kiểm 13 chỗ "(chặng N)" mới.

## Build và kiểm thử

```
mkdocs build --strict      INFO - Documentation built in 2.08 seconds (không cảnh báo)
npm test                   Kiểm thử: 4 nhóm chạy song song trong 12.0 giây, mọi nhóm đều đạt
counts: 110 chỗ ghi con số đã kiểm, 218 cụm số + danh từ đã quét, 0 lỗi
levels: 34 bài học, 183 chỗ ghi chặng đã kiểm, 0 lỗi
abc_warn: 361 khối, 0 khối có cảnh báo
browser: 118/235 (phần 1/2) và 117/235 (phần 2/2) trang, 0 trang có lỗi
a11y: 42 trang (cả toàn trang chủ), 0 loại vi phạm, 0 phần tử
```

## Chỗ chưa chắc hoặc đã bỏ qua

- **Nguồn gốc *Comptine d'un autre été: l'après-midi*.** Nguồn chỉ cho thấy bài nằm trong album nhạc phim *Amélie* (2001) và bản in ghi © 2001; không nguồn nào tôi mở nói rõ bài viết riêng cho phim hay có từ trước. Trang chỉ ghi "album nhạc phim".
- **Hãng của *Una mattina* năm 2004.** uDiscover Music ghi Sony Classical, Wikipedia (bài "Ludovico Einaudi discography") ghi Decca. Trang không nêu hãng của lần phát hành đầu, chỉ nêu lần Decca phát hành lại.
- **Classic FM về *Twilight*.** Bài năm 2019 còn viết rằng *River Flows in You* "does also feature later on the soundtrack" và rằng bài lấy cảm hứng từ một tác phẩm của "Samuel Vallée". Cả hai không khớp với danh sách bài của hai album phim trên Wikipedia và tôi không kiểm được, nên không dùng. Trang chỉ nói bài không có trong hai album ấy.
- **Classic FM về ABRSM** (6/6/2024) ghi "'Always with Me' from Joe Hisaishi's *Spirited Away*", đúng kiểu nhầm lẫn mà trang này cảnh báo; tên người viết nhạc lấy theo mục lục sách ABRSM và Wikipedia. Trang của ABRSM chặn yêu cầu tự động (403), nên mục lục Grade 3 và Grade 8 đọc qua trang cửa hàng Just Flutes chép lại.
- **Cấp độ.** Đánh giá của Pianodao áp cho cả tập, không cho từng bài. AMEB Grade 6 không trùng khít với ABRSM Grade 6, và mục lục không cho biết tập AMEB in bản gốc nguyên vẹn hay có lược bớt (không ghi "arr." như với các bài pop được soạn lại). *One Summer's Day* không có mốc ngoài. Tôi chưa xem tập *Ghibli Best Stories*, nên không ghi cấp cho bản ấy và nhắc người đọc xem trang mẫu.
- **Bản soạn dễ** của *Comptine* và bản easy piano của *One Summer's Day*: "chặng 2–3" là ước lượng chung cho loại bản này, như mục *Mariage d'Amour* vẫn ghi.
- **Giai điệu Việt Nam** cho G5.1: không dùng (xem trên).
- **Link YouTube** dùng tên kênh (`@…`), không link từng video, để ít hỏng hơn; kênh vẫn có thể đổi tên.
- **Ngoài phạm vi, chưa làm:** tiêu đề câu hỏi ở trang Hỏi đáp vẫn ghi "nhạc phim" dù *River Flows in You* và *Kiss the Rain* là bài trong album; bảng Tiến độ của kế hoạch còn ghi G4b "chưa làm"; README (mục Cấu trúc) chưa nhắc bài luyện tai mới. Mục Phiên bản 15 ở `docs/cap-nhat.md` để người điều phối viết.

## Nguồn đã dùng để kiểm chứng

- Wikipedia: "First Love (Yiruma album)", "Yiruma", "Twilight (soundtrack)", "Spirited Away (soundtrack)", "Joe Hisaishi", "Joe Hisaishi discography", "Kikujiro", "Porco Rosso", "Amélie (soundtrack)", "Rue des Cascades", "Yann Tiersen", "Ludovico Einaudi", "Ludovico Einaudi discography", "Audiation".
- Musicnotes, trang sản phẩm (thông tin và ảnh trang đầu): MN0096080, MN0073222, MN0097979, MN0073221, MN0151256, MN0242959, MN0091413, MN0106486, MN0183413.
- Faber Music: *Yiruma SOLO: Original* (p470825), *SOLO: Easy* (p470824). Pianodao: "Yiruma 20th Anniversary Solo piano" (Andrew Eales, 16/12/2023).
- Hal Leonard: 49044225 (*Ghibli Best Stories*, Zen-On), 50490446 (*Yann Tiersen: Piano Works 1994–2003*, Ricordi), 14009965 (*Ludovico Einaudi: Una Mattina*), 280827 và 280828 (*Graded Pieces for Piano*, Chester Music).
- Classic FM: bài về *River Flows in You* (2019), "Nuvole Bianche", bài về chương trình piano ABRSM 2025–2026 (6/6/2024). uDiscover Music: bài về lần phát hành lại *Una Mattina*. Shore Fire Media: thông cáo album *Dream Songs: The Essential Joe Hisaishi*.
- Just Flutes: mục lục *Piano Exam Pieces 2025 & 2026*, ABRSM Grade 3 và Grade 8. Australian Music Centre: mục lục AMEB *Piano for Leisure Series 4, Grade 6*.
- Trang chính thức: yanntiersen.com, ludovicoeinaudi.com, joehisaishi.com; kênh YouTube của bốn tác giả.
- Mutopia (GitHub MutopiaProject): `MozartWA/KV545/K545-1/K545-1.ly`, `ChopinFF/O9/chopin_nocturne_op9_n2/chopin_nocturne_op9_n2.ly`.
- Cho G5.1: Lucy Green, *Hear, Listen, Play!* (Oxford University Press, 30/1/2014; thông tin sách trên trang hiệu sách Canterbury Christ Church University); Edwin E. Gordon, *Learning Sequences in Music* (GIA Publications), khái niệm audiation theo Wikipedia "Audiation".
