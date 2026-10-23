# Việc lẻ: hai chỗ còn mở của G4b (Valse La thứ, *Mùa xuân*)

Nhánh: `v15/g4b-con-lai`, tạo từ `b2bf406`. Xử lý "Phát hiện" 5 và 6 trong `giai-doan-4b.md`. Mỗi commit đều qua `mkdocs build --strict`, `npm test` và `python3 tools/audio/check_audio.py --static`.

| Commit | Việc |
|---|---|
| `68d2f05` | Valse La thứ: cấu trúc theo bản nhạc, A' và C nhắc lại cùng nhau, mốc mới |
| `7db8da2` | *Mùa xuân*: phần cuối chương 1 tách thành ba dòng, mốc cho cả ba |
| (commit cuối) | Báo cáo này |

## Việc 1: Valse La thứ, B. 150

### Bản nhạc đã đối chiếu

Mutopia không có bài này: thư mục `ftp/ChopinFF` chỉ có B130 và các bài có số opus. Bộ Humdrum của Viện Chopin và bộ ASAP cũng không có. Một file kern mang nhãn "B.150" (bộ MCCC, `IFC0111_00.krn`, trong kho `lexngu/cmme-jupyter`) thật ra chứa một bài khác (Si♭ thứ, hơn 3.000 dòng), nên đã bỏ. Trang wiki của tác phẩm trên IMSLP (đọc qua API) liệt kê các ấn bản. Tôi không tải file nào từ IMSLP.

- **Bản khắc của André Van Ryckeghem** cho Werner Icking Music Archive (WIMA), ngày 28/6/1999. Đây chính là bản đang có trên IMSLP (`WIMA.dcf1-walzamin.pdf`, file nguồn PMX `WIMA.e5ca-walzamin.zip`, giấy phép CC BY-NC-SA 3.0). Tôi lấy bản lưu của site WIMA cũ trên Wayback Machine (`icking-music-archive.org/scores/chopin/walzamin.pdf`, `.zip`, `.mid`, `.info`), đọc file PMX và xem hai trang PDF.
- **Bản LilyPond** `chopin-b150-waltz-in-a-minor.ly` trong kho https://github.com/rdj/music (commit `a037ca3`, 29/4/2023). File ghi: "Musical text from the autograph *Walec* at Bibliothèque Nationale, Paris". Kho không ghi giấy phép, nên chỉ dùng để đọc.

Hai bản cho cùng một cấu trúc:

| Đoạn | Ô nhịp | Nội dung |
|---|---|---|
| (nhịp lấy đà) | | Mi4 |
| A | 1–16 | Bốn câu 4 ô; câu 2 dừng ở Đô, câu 4 lên La5 rồi dừng ở Mi |
| ‖: B :‖ | 17–24 | La thứ, hợp âm át và chủ luân phiên; ô 21 có hợp âm rải đi lên (chùm ba, rồi chùm năm) |
| ‖: A' | 25–32 | Câu 1 của chủ đề, rồi một câu đi lên Rê♯–Fa♯–Sol♯ trên hợp âm Si bảy và Mi bảy |
| C :‖ | 33–40 | La trưởng, hai câu 4 ô; ô 40 kết bằng nốt Mi lấy đà |
| A'' | 41–52 | Ba câu của chủ đề; câu ba khép bằng kết ở La thứ (ô 51–52) |
| Coda | 53–56 | |

Tổng cộng 56 ô 3/4 và một nhịp lấy đà. Dấu nhắc lại thứ hai bao trọn ô 25–40, tức là A' và C. Trang cũ ghi "C: La trưởng, 16 ô, nhắc lại", nhầm 8 ô của A' vào đoạn C (G4b đã đoán vậy). Wikipedia, theo Belotti và Cummings, cũng mô tả "the next section consists of sixteen measures and is repeated ... starting with the main theme again before modulating to A major".

**Bản thu chơi đủ mọi dấu nhắc lại.** Tôi viết một script tạm (ngoài repo) đổi bản LilyPond thành danh sách nốt, rồi căn bằng `core.align` của repo trên bản thu Aya Higuchi. Kết quả theo từng cách nối:

| Cách nối | Chi phí DTW | Biến thiên tốc độ |
|---|---|---|
| Đủ nhắc lại: A, B, B, A' C, A' C, A'', coda | 0,365 | −0,32..+0,21 |
| Bỏ nhắc lại của B | 0,371 | −0,49..+0,45 |
| Bỏ nhắc lại của ô 25–40 | 0,379 | −0,64..+0,36 |
| Không nhắc lại | 0,385 | −0,80..+1,52 |

Với cách nối đủ nhắc lại, ba biến thể cho đầu mỗi đoạn lệch không quá 0,8 giây so với các mốc dưới đây.

### File đã sửa

- `docs/piano/tac-pham/chopin-valse-la-thu.md`:
    - Bảng "Theo dõi khi nghe": ghi số ô cho từng đoạn. Đoạn C là ô 33–40 (8 ô, không phải 16). A' ghi rõ câu thứ hai đi lên và dừng ở hợp âm át. Thêm dòng **"Đoạn A' nhắc lại"** (A' và C nhắc lại cùng nhau) trước dòng "Đoạn C nhắc lại". Bảng có 9 dòng.
    - Mục Cấu trúc: thêm câu dẫn (56 ô, hai chỗ nhắc lại, thứ tự nghe A – B – B – A' – C – A' – C – A'' – coda). Bảng các đoạn đổi cột "Độ dài" thành "Ô nhịp", sửa A' và C, và ghi giọng của B là La thứ (trước ghi "–").
    - Mục Rubato: "câu thứ tư của mỗi đoạn A" thành "cuối đoạn A (câu thứ tư), trước khi vào đoạn B". A' chỉ có hai câu và A'' ba câu, nên câu cũ sai.
    - Mục Nguồn: thêm hai bản nhạc đã đối chiếu.
- `tools/figures.py`, hình `p-valse-la-thu`: các ô ‖: B :‖ và ‖: A' … C :‖, mỗi đoạn kèm số ô; độ rộng theo số ô (A' 8, C 8; trước là 16 và 16); chú thích nói rõ A' và C nhắc lại cùng nhau.
- `tools/audio/align/pieces.py`, cấu hình `chopin-valse-la-thu`: thêm dòng mới, sửa hai số đo, ghi cấu trúc và cách đo trong chú thích. Cấu hình vẫn là mốc đo tay, vì `sources.json` chưa có bản nhạc số của bài.

### Mốc (đo trên khởi âm bằng `explore.py onsets`, ghi bằng `run.py --write`)

| Dòng | Sự kiện | Cũ | Mới | Cách đo |
|---|---|---|---|---|
| 1 | Đoạn A | 0 | 0 | Mi4 lấy đà 0,28 s |
| 2 | Đoạn B | 26 | 26 | Mi2 trầm 25,87 s, Mi5 26,01 s |
| 3 | B nhắc lại | 39 | 39 | Mi2 38,68 s, Mi5 38,78 s |
| 4 | Đoạn A' | 51 | 51 | La2 51,22 s, La4 51,36 s. G4b ghi 50,6 s, nhưng đó là hợp âm phách 3 của ô 24 (La3, Mi3 ở 50,43–50,48 s). Hai số cùng làm tròn thành 51 |
| 5 | Đoạn C | 64 | 64 | Mi2 63,90 s, Si5 64,04 s |
| 6 | **A' nhắc lại** (mới) | – | 75 | Mi4 lấy đà cuối ô 40 ở 74,91 s; ô 25 (La2, La4) ở 75,42–75,46 s |
| 7 | C nhắc lại | 88 (trước là dòng 6) | 88 | Mi2 87,35 s, Si5 87,54 s; giữ số đo 87,5 của G4b |
| 8 | Đoạn A'' | 98 (trước là dòng 7) | 98 | Mi4 lấy đà 98,27 s |
| 9 | Coda | 117 (trước là dòng 8) | 118 | Đô3 mở ô 53 ở 117,63 s; Đô6 (móc đơn thứ hai) 118,14 s; hợp âm Mi3–La3–Mi4 phách 2 ở 118,47 s; Rê3 mở ô 54 ở 119,49 s |

`ref` cũ: `[0,26,39,51,64,88,98,117]`; mới: `[0,26,39,51,64,75,88,98,118]`.

## Việc 2: *Mùa xuân*, chương 1

### Bản nhạc đã đối chiếu

Bản LilyPond của Mutopia (Mutopia-2010/02/08-301, nguồn ghi "Performers' Facsimiles", CC BY-SA 3.0), cũng là bản đã dựng ra MIDI `mutopia_spring-score.mid`. Tôi đọc từng bè: `spring1.ly` (violin độc tấu), `spring1a.ly` (violin I), `spring1b.ly` (violin II), `spring1c.ly` (viola), `spring1d.ly` (cello). Phần cuối chương:

| Ô | Bản nhạc ghi | Nội dung |
|---|---|---|
| 59–65 | E, *Solo*, "Canto d'Uccelli" | Chim hót: violin độc tấu và hai violin láy rền; cello giữ Đô♯ suốt 7 ô |
| 66 – phách 2 ô 70 | *Tutti* | Ritornello: hình nhịp điệu của câu mở đầu (ba móc đơn, hai móc kép, đen chấm dôi), đi qua Đô♯ thứ, Fa♯ thứ, Si, rồi về Mi trưởng |
| phách 3 ô 70 – 75 | *Solo* | Violin độc tấu chạy móc kép; violin I, II và viola nghỉ ô 71–75 (`R1*5`), chỉ còn bè trầm (cello giữ Si từ phách 3 ô 70) |
| 76–82 | *Tutti*, *Piano* từ phách 4 ô 79 | Ritornello cuối (ý thứ hai của ritornello), câu cuối nhắc lại nhỏ như tiếng vọng, dấu lưu ở ô 82 |

Vậy phần cuối có ba sự kiện nghe rõ chứ không phải hai, nên tôi tách dòng cũ thành ba dòng. Tám câu thơ của chương 1 kết thúc ở "Tornan di nuovo al lor canoro incanto" (chim hót trở lại), nên ba dòng mới không có câu thơ tương ứng.

Cách đánh số: MIDI bắt đầu bằng nhịp lấy đà (một móc đơn), nên ô in *n* bắt đầu ở chỉ số *n* − 1 + 0,125 (như G4b đã ghi). `explore.py bars` cho thấy chỉ số 70 là các móc kép độc tấu của ô 71 và chỉ số 75 là tutti ô 76, khớp cách đánh số này.

### File đã sửa

- `docs/nghe-nhac/vivaldi-mua-xuan.md`: dòng cuối "Ritornello cuối cùng" thay bằng ba dòng: "Ritornello trở lại: cả dàn nhạc nhắc nhịp điệu của câu mở đầu" (ô 66), "Violin độc tấu thêm một đoạn ngắn: chuỗi nốt nhanh, chỉ có bè trầm liên tục đệm" (ô 70), "Ritornello cuối cùng; câu cuối nhắc lại nhỏ như tiếng vọng" (ô 76). Bảng có 11 dòng. Mục Nguồn thêm tổng phổ Mutopia đã dùng.
- `tools/figures.py`, hình `g-vivaldi`: sau "Chim trở lại" thêm R, "Độc tấu (violin)", rồi R cuối; hình khớp từng dòng của bảng.
- `tools/audio/align/pieces.py`, cấu hình `vivaldi-mua-xuan`: thêm ba mốc neo và ba dòng (chỉ số 65,125; 69,625; 75,125), chú thích cách đo; bỏ ghi chú cũ "dòng cuối để trống".

### Mốc

Căn tự động không dùng được ở cuối chương. Không neo, ô 66 ra 157,8 / 159,4 s (thật là 164,5 s), và ở hai biến thể các ô 70–79 dồn về một điểm (189,38 s). Vì vậy ba mốc mới được neo theo khởi âm (`explore.py onsets`) và mức âm (đo mỗi 0,25 giây), rồi ghi bằng `run.py --write`:

| Dòng | Sự kiện | Mốc | Cách đo |
|---|---|---|---|
| 9 | Ritornello trở lại (ô 66) | 164 | Sol♯5, Si2 164,49 s; Đô♯3 (cello, móc đơn lặp) và Mi4 164,58 s; mức âm từ −40 lên −28 dB. Kiểm tiếp: Fa♯3 ở phách 3 lúc 165,79 s, Si2 mở ô 67 lúc 167,00 s. Ba biến thể cho 164,46 s, làm tròn thành 164 |
| 10 | Violin độc tấu (phách 3 ô 70) | 176 | Mi3 của cello ở 174,61 / 174,99 / 175,31 s, Si2 175,50 s, rồi Fa♯5 của violin độc tấu 175,96 s và các móc kép Si4, Rê♯5; cello giữ Si2 từ khoảng 176 s; tutti tắt dần đến khoảng 177 s |
| 11 | Ritornello cuối cùng (ô 76) | 193 | Cello Mi3 ở 190,40 và 191,47 s, Si2 ở 191,98 s (ô 75), trill Fa♯5–Sol♯5 191,98–192,59 s; tutti Mi3 + Mi4 + Mi5 192,63 s. Tiếng vọng *piano* vào sau một khoảng gần lặng ở khoảng 200,3 s |

Tám mốc cũ không đổi: `ref` cũ `[1,33,70,79,103,111,138,146]`, mới `[1,33,70,79,103,111,138,146,164,176,193]`.

## Build và kiểm thử

Sau commit `7db8da2`:

- `mkdocs build --strict`: `INFO - Documentation built in 2.15 seconds`, không cảnh báo.
- `npm test`: `Kiểm thử: 4 nhóm chạy song song trong 11.6 giây, mọi nhóm đều đạt` (trong đó `figures: mọi hình đã khớp với dữ liệu`, `browser: 48 luồng tương tác, 0 lỗi`).
- `python3 tools/audio/check_audio.py --static`: `13 file trên site, 52 trang có bản thu, 0 lỗi`.
- `run.py chopin-valse-la-thu` và `run.py vivaldi-mua-xuan` cho ra đúng `ref` đang ghi trên trang.

## Chỗ chưa chắc hoặc đã bỏ qua

- **Chưa đối chiếu được bản thảo và bản Urtext.** Bản thảo ở BnF (Gallica, `ark:/12148/btv1b55001038v` và `btv1b550016651`) bị Cloudflare chặn khi truy cập bằng script (403). Bản Henle 1979, Könemann, Bärenreiter và Ấn bản Quốc gia Ba Lan chỉ có trên IMSLP hoặc phải mua. Hai bản đã đối chiếu đều là bản chép của người dùng, và bản WIMA không ghi chép theo nguồn nào. Dù vậy số ô, hai dấu nhắc lại và chỗ chia đoạn thống nhất ở cả hai bản, ở mô tả của Wikipedia và ở bản thu.
- **Làm tròn:** dòng 7 của Valse (C nhắc lại) nằm giữa 87,35 s (bè trầm) và 87,54 s (giai điệu); 87 hay 88 đều cách dưới 1 giây, tôi giữ 88. Dòng 9 của *Mùa xuân* là 164,46 s, ghi 164; nốt mạnh đầu tiên vào ở 164,49–164,58 s.
- ***Mùa xuân* có ba dòng mới thay vì hai** như lời giao việc gợi ý: tutti ô 66, độc tấu ô 70, tutti ô 76 là ba sự kiện nghe rõ. Bảng có 11 dòng, trong giới hạn 6–12 của mẫu.
- **Năm in lần đầu của Valse:** trang IMSLP ghi bài được in năm 1860 (Maho), là số 3 trong *4 Pièces pour piano*, dưới tên Charlotte de Rothschild; Wikipedia cũng ghi vậy. Hộp thông tin của trang đã viết cẩn thận ("được biết đến rộng rãi và công nhận là của Chopin sau khi tạp chí *La Revue musicale* in năm 1955"), nhưng mục Bối cảnh chưa nhắc bản in 1860. Tôi không sửa vì ngoài phạm vi; nên bổ sung sau khi kiểm thêm.
- **Sắc thái của Valse:** bản LilyPond theo bản thảo không có ký hiệu sắc thái nào. Bản WIMA có *mf*, *p*, *f* (ô 17), *cresc.*, nhưng không có *dim.* ở coda. Câu "nhỏ dần đến lặng" ở dòng Coda và lời khuyên sắc thái ở mục Diễn tấu là cách chơi, không phải ký hiệu trong bản nhạc. Tôi không đổi.
- Valse vẫn chưa có bản nhạc số trong `sources.json`, nên chạy lại `run.py` chỉ in lại số đo tay. MIDI của bản WIMA (CC BY-NC-SA 3.0, dùng trên máy) có thể thêm làm nguồn sau này để `run.py` tự kiểm. Script đổi LilyPond thành nốt dùng cho lần kiểm này nằm ngoài repo.

## Nguồn đã dùng để kiểm chứng

- IMSLP, trang tác phẩm "Waltz in A minor, B.150 (Chopin, Frédéric)" (wikitext qua API): danh sách ấn bản, năm in 1860.
- Wayback Machine, bản lưu của WIMA: `walzamin.info` (12/11/2003), `walzamin.pdf` (1/4/2004), `walzamin.mid` (15/12/2004), `walzamin.zip` (PMX, 20/6/2010).
- https://github.com/rdj/music, file `chopin-b150-waltz-in-a-minor.ly` (commit `a037ca3`).
- Wikipedia, "Waltz in A minor, Op. posth. (Chopin)" (mục Structure and analysis, theo Belotti và Cummings).
- Mutopia Project, *La Primavera* Op. 8 số 1 (https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=301), các file `.ly` trong `ftp/VivaldiA/O8/spring/spring-lys/` của kho MutopiaProject trên GitHub.
- Đã kiểm và loại: kho Humdrum của Viện Chopin (không có B. 150), ASAP (không có valse của Chopin), MCCC `IFC0111_00.krn` (nhãn B. 150 nhưng là bài khác).
