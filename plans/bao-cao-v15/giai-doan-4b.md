# Báo cáo giai đoạn 4b: bản thu cho 7 hướng dẫn nghe nhạc piano

Nhánh: `v15/g4b-link`, tạo từ `main` tại `473b183`. Mỗi commit đều qua `mkdocs build --strict` và `npm test`.

Nhánh này dựng lại nhánh đầu tiên `v15/g4b-ban-thu`: ở đó bốn bản thu IMSLP dài (K. 331, Mussorgsky; 52 MB) được chuyển mã và lưu trên site. Theo quyết định của bạn, bản thu dài chỉ dẫn link tới IMSLP; các commit chưa push được dựng lại để file MP3 chưa từng vào lịch sử git. `main` cũ (có file) còn ở nhánh `backup/main-co-audio`.

| Commit | Việc |
|---|---|
| `a97a9c1` | Bản thu Commons cho năm trang: Scarlatti, Mozart K. 467, Grieg, Rachmaninoff số 2, Gershwin |
| `3c63a02` | `fetch.py --member` (lấy một file trong zip của Mutopia); nguồn MIDI cho K. 525 và *Mùa xuân* |
| `f42d159` | Mốc cho ba trang đã có bản thu: *Eine kleine Nachtmusik*, *Mùa xuân*, Valse La thứ; sửa một luồng kiểm thử trình duyệt |
| `356d466` | Nguồn bản nhạc số cho K. 331 (9 MIDI Mutopia, 9 file kern) |
| `e0ae653` | Công cụ bản thu: tên file IMSLP có tiền tố `IMSLP<số>-`; ước lượng phần cắt đầu chính xác hơn |
| `4caf575` | Bản thu chỉ dẫn link: `listen.js` hiện link thay cho trình phát; công cụ và tài liệu |
| `31573ef` | Bản thu IMSLP cho K. 331 (Luis Kolodin) và Mussorgsky (Chiara Bertoglio), chỉ dẫn link; mốc cho Mussorgsky |
| `6b88a2b` | Mốc cho K. 331, tính theo file gốc trên IMSLP |
| `99b014f` | Hai bản thu Marcelle Meyer chỉ dẫn link (Debussy *Préludes*, Invention số 1) |
| (commit cuối) | Nhật ký trang Cập nhật, trạng thái trong `tools/audio/README.md`, báo cáo này |

## Bản thu đã chọn

| Trang | Bản thu | Nguồn, giấy phép | Mốc |
|---|---|---|---|
| Scarlatti: Ba sonata | Raymond Smullyan, piano, **chỉ có K. 380**; không chơi dấu nhắc lại | Commons (bộ Al Goldstein, Pandora Music), CC BY-SA 2.0 (EFF Open Audio License) | 2/9 |
| Mozart: K. 331 | Luis Kolodin, ba chương | IMSLP, CC BY-SA 4.0; chỉ dẫn link tới ba file (không lưu trên site) | 12/12 |
| Mozart: Concerto số 21 | Giorgi Latsabidze, Hsinchu Chamber Orchestra, David L. Wen; **chỉ có chương 3** (Đài Bắc, 2011) | Commons, CC BY-SA 3.0 | 1/10 |
| Grieg: Concerto | Neal O'Doan, University of Washington Symphony, Peter Erős | Commons (Pandora Music), CC BY-SA 2.0 | 3/12 |
| Mussorgsky: Những bức tranh | Chiara Bertoglio, bản piano trọn tập, một file 33:44 | IMSLP, CC BY 3.0; chỉ dẫn link (không lưu trên site) | 11/11 |
| Rachmaninoff: Concerto số 2 | Skidmore College Orchestra, Anthony Holland; người chơi piano không được ghi tên (Musopen); buổi hòa nhạc, cuối file chương III có vỗ tay và một bản bis | Commons, phạm vi công cộng (Musopen, có vé VRT) | 3/7 |
| Gershwin: *Rhapsody in Blue* | Bản thu đầu tiên, 10/6/1924: Gershwin (piano), Paul Whiteman Concert Orchestra; Victor 55225, hai mặt đĩa, rút gọn còn 8:54 | Commons, bản số hóa của Library of Congress (National Jukebox); phạm vi công cộng ở Mỹ từ 2025 | 1/7 |
| *Eine kleine Nachtmusik* (đã có bản thu) | Advent Chamber Orchestra | | 8/8 |
| Vivaldi: *Mùa xuân* (đã có bản thu) | John Harrison, Wichita State University Chamber Players | | 8/9 |
| Chopin: Valse La thứ (đã có bản thu) | Aya Higuchi (Musopen) | | 8/8 |

Mỗi trang có thêm một câu giới thiệu bản thu trước khối nghe (theo mẫu trang Debussy) và một dòng nguồn bản thu ở mục Nguồn. Dòng nào để trống là dòng giữa chương của tác phẩm có dàn nhạc (không có bản nhạc số đáng tin), hoặc dòng bản thu không có (K. 141, K. 466, chương 1–2 của K. 467, dấu nhắc lại của K. 380).

## Cách lấy mốc

- **Đầu chương** (Grieg, Rachmaninoff, K. 467, Gershwin): `"start"` của `run.py`. Ở chương II của Grieg và chương 3 của K. 467, `"start"` bắt nhầm tiếng ồn nền (ngưỡng "mức 95% trừ 30 dB" quá thấp với bản thu nhỏ); đo tay: Grieg 8,5 s, K. 467 4,0 s.
- **K. 525** (*Eine kleine*): MIDI Mutopia, đối chiếu bằng ấn bản Breitkopf 1883 (cũng trên Mutopia). Ô nhịp của từng dòng lấy từ các bè trong bản LilyPond (ví dụ "câu đối đáp" là ô 11–12: violin hát Rê–Mi, viola và cello đáp). Kiểm trên phổ ba dòng; phần phát triển sửa từ 200,4 s thành 199,2 s.
- **Mùa xuân**: MIDI Mutopia; ô của từng dòng theo các chữ B–E (câu thơ) trong bản LilyPond. Hai biến thể (khởi-âm, thô→mịn) cùng căn ritornello 2 vào 66 s, trong khi tutti vào ở 70,45 s, sau một khoảng lặng: quy tắc "hai trong ba" chọn sai. Đã neo bốn mốc đo theo khởi âm; tiếng sấm đo tay (111,0 s). Dòng cuối để trống (xem Chỗ chưa chắc).
- **Valse La thứ**: chưa có bản nhạc số. Tìm từng câu của chủ đề A, đoạn B, đoạn C bằng so khớp chroma, rồi lấy khởi âm ở đầu đoạn. Coda chắc trong khoảng 1 giây; các dòng khác trong khoảng 0,5 giây.
- **Mussorgsky**: 16 MIDI Mutopia (Knute Snortum, theo ấn bản Pavel Lamm, CC BY-SA 4.0) nối lại; 6 mốc neo ở các bài đứng sau khoảng lặng, đo bằng khởi âm của nốt đầu trong MIDI. Bydło và Goldenberg đo tay (căn tự động lệch 1,6 và 2,0 giây); Catacombae và Kiev khớp khởi âm.
- **K. 331**: mốc tính theo ba file gốc trên IMSLP (bản thu chỉ dẫn link); `run.py` căn trên bản đã tải vào `_imslp/`. Chương I nối 7 MIDI Mutopia (đã viết ra dấu nhắc lại). Căn tự động không ổn định ở biến tấu 3, 4 (ba biến thể lệch nhau), lệch hơn 1 giây ở biến tấu 1, 5; đầu cả năm biến tấu đo trên khởi âm (biến tấu 3: Đô5 bình cùng La3 ở 250,75 s trong file gốc, chroma chuyển hẳn sang La thứ). Chương II, III dùng kern của Craig Sapp nối bằng `segs`; `explore.py structure` cho thấy Kolodin chơi mọi dấu nhắc lại, Menuetto da capo không nhắc lại. Trio khớp nguồn đối chiếu. Ở *Alla turca*, hai biến thể cùng căn coda vào khoảng 211 s (3 giây trước khi hết bài); đo tay: Đô♯6 mở ô 99 ở 188,6 s. Hành khúc La trưởng đo tay ở hai nốt lấy đà La5, Si5 (46,76 s).

## Công cụ đã sửa

| File | Việc |
|---|---|
| `tools/audio/align/fetch.py` | `--member`: Mutopia đóng gói MIDI của bài nhiều phần thành `<tên>-mids.zip`; sha256 tính trên file lấy ra; README nhắc |
| `tools/audio/transcode.py` | File tải từ IMSLP mang tiền tố `IMSLP<số>-`: link trang file suy ra từ phần sau tiền tố. Không cắt đuôi thì không đặt `-to` |
| `tools/audio/check_audio.py`, `sound.py` | Tìm file gốc trong `_imslp/` cả khi có tiền tố. Phần cắt đầu ước lượng bằng khớp đường bao mức âm 20 giây đầu: cách cũ (hiệu "tiếng đầu tiên") lệch 0,15 giây ở bản Bertoglio mở đầu rất nhỏ và báo nhầm "mất 0,2 giây tiếng ngân". Với 13 file cũ, hai cách cho cùng số trong 0,04 giây |
| `docs/assets/js/listen.js` | **Bản thu chỉ dẫn link**: khi mọi phần có `link` mà không có `mp3`, khối nghe hiện "Mở bản thu." (hoặc "Mở từng phần: …", mở thẻ mới) thay cho nút "Nghe bản này"; ô mốc tham khảo là chữ ("11:13", hoặc "1:22, phần 1" khi có nhiều phần) thay cho nút tua. Người học vẫn ghi mốc được trên file tải về máy ("Chọn file trên máy"). `VERSION` 17 → 18 ở `sw.js` và `loader.js` |
| `tools/audio/page.py`, `attach.py`, `check_audio.py`, `align/run.py` | Thứ tự khóa của phần: `t`, `mp3`, `link`, `src`, `d`. `attach.py` nhận phần chỉ dẫn link (link phải là http(s); không có file trên site để đo). `check_audio.py` coi phần chỉ dẫn link là phần trên mạng; `--network` đối chiếu phần Commons như cũ, bỏ qua phần IMSLP (không có API). `run.py` căn trên file gốc: link IMSLP thì lấy file đã tải vào `_imslp/`, link Commons thì lấy file trong bộ nhớ đệm. Tài liệu: `AGENTS.md` (khối bản thu), mục 2c của `tools/audio/README.md` |
| `tests/unit.mjs` | `readRec` với bản thu chỉ dẫn link nhiều phần (khóa là link phần đầu; mốc tính trong từng phần); khối trộn phần `mp3` và phần `link` bị từ chối; bản thu thường không bị coi là chỉ dẫn link |
| `tests/browser.mjs` | Luồng mới trên trang Mussorgsky: không có nút "Nghe bản này", có link `Special:ImagefromIndex`, mốc là chữ. `open()` nhận `transform`. Luồng "trang chưa có mốc thì không có ô bật/tắt" dùng *Eine kleine* làm mẫu, nay trang này có mốc (và không còn trang nào có bản thu mà chưa có mốc): bỏ `ref` khỏi HTML trước khi mở |

`_imslp/` không bị sửa: bốn file bạn tải giữ nguyên tên có tiền tố.

## Build và kiểm thử

- `mkdocs build --strict` (sau commit cuối): `INFO - Documentation built in 2.31 seconds`, không cảnh báo.
- `npm test`: `Kiểm thử: 4 nhóm chạy song song trong 12.9 giây, mọi nhóm đều đạt`; trong đó `check_audio --static: 13 file trên site, 52 trang có bản thu, 0 lỗi` và `browser: 48 luồng tương tác, 0 lỗi`.
- `python3 tools/audio/check_audio.py --network`: `13 file trên site (13 so được với file gốc trong _imslp/), 52 trang có bản thu (109 phần trên mạng, đã đối chiếu Commons), 0 lỗi`, kèm ba dòng "chú ý" cũ (`bach-prelude-bwv939`, `burgmuller-arabesque`, `minuet-sol-thu`). 109 phần = 105 phần trên Commons (kể cả 13 phần Marcelle Meyer, nay chỉ dẫn link) và 4 phần IMSLP.
- 195 link `upload.wikimedia.org` trong các khối bản thu: thư mục băm (`/f/fd/…`) khớp MD5 của tên file.
- Bốn link IMSLP (`Special:ImagefromIndex/815839`, `815840`, `815841`, `251520`): số chỉ mục khớp tiền tố của bốn file bạn tải (`IMSLP815839-…`); trang trả về 200 và chuyển qua `friendlyredirect.html` của IMSLP (trình duyệt đi tiếp được, công cụ không đi tiếp).
- Chạy lại cả 52 cấu hình trong `pieces.py` trên nhánh đã dựng lại: 52/52 cấu hình cho ra đúng từng mốc đang ghi trên trang (0 dòng lệch, 0 lỗi).

## Số đo

- `docs/assets/audio/` giữ nguyên 14 MB, 13 file. Bốn file K. 331 và Mussorgsky chuyển mã ra khoảng 52 MB (128 kbps); chúng không lưu trên site và không có trong lịch sử git của nhánh này.

## Phát hiện

1. **Bản thu "phạm vi công cộng" trên Commons nhưng còn bảo hộ ở Mỹ.** Các bản thu châu Âu 1926–1956 trên Commons (bộ Médiathèque musicale Mahler, PDP-CH) mang mẫu `{{PD-EU-audio}}` và `{{PD-US-record}}`; chính mẫu `PD-US-record` ghi theo luật MMA: xuất bản 1926–1946 được bảo hộ 100 năm, 1947–1956 được 110 năm. Tôi không dùng các ứng viên loại này (Marcelle Meyer K. 380 năm 1954, Landowska K. 141 năm 1940, Richter Rachmaninoff số 2 năm 1959, Schnabel K. 467 năm 1937, Gieseking và Backhaus Grieg). Hai trang có sẵn dùng bản thu Marcelle Meyer: *Préludes* của Debussy (thu năm 1956) và bài học Invention số 1 (thu năm 1948). Theo quyết định của bạn, hai trang này chuyển sang chỉ dẫn link tới trang file trên Commons (commit `99b014f`), mốc tham khảo giữ nguyên; câu giới thiệu bản thu nói rõ vì sao.
2. **Bộ *Pictures at an Exhibition* của Musopen trên Commons không phải bản piano.** 15 track (ghi "pictures at an exhibition") khớp độ dài từng giây với bộ Skidmore College Orchestra (bản phối Ravel), và cũng thiếu Promenade thứ năm như bản Ravel. Bộ ba file "Neal and Nancy O'Doan" là bản chuyển soạn cho hai đàn piano của Russell Warner. Vì vậy bản piano duy nhất dùng được là bản Bertoglio trên IMSLP.
3. **Bản Rachmaninoff của Musopen là Skidmore College Orchestra.** Trên Commons không ghi người chơi; trang IMSLP có cùng ba file (10:54, 11:04, 19:12, khớp từng giây) ghi "Skidmore College Orchestra / Anthony Holland, conductor; uncredited piano soloist". IMSLP ghi giấy phép CC BY-SA 3.0, Commons ghi phạm vi công cộng (Musopen, vé VRT 2008012110017088); trang dùng file Commons nên ghi theo Commons. Cả hai đều là giấy phép được nhận.
4. **"Hai trong ba biến thể" chọn sai ở ba chỗ** (ritornello 2 của *Mùa xuân*, coda *Alla turca*) và căn không ổn định ở chương I K. 331: mọi chỗ đã đo tay, ghi cách đo trong `pieces.py`. Nên coi mọi mốc mới căn tự động (không có nguồn đối chiếu) là phải kiểm trên phổ.
5. **Cấu trúc Valse La thứ trong bản thu khác mô tả trên trang bài học.** Bản thu chơi A | B B | A' | C, rồi chủ đề La thứ | C | A'' (ba câu) | coda: giữa hai lần đoạn C (La trưởng) có chủ đề La thứ, và A' chỉ khoảng 8 ô. Trang ghi "C: La trưởng, 16 ô, nhắc lại". Có thể "16 ô" của trang gồm cả 8 ô chủ đề La thứ; cần đối chiếu với bản nhạc trước khi sửa (ngoài phạm vi).
6. **Dòng cuối của *Mùa xuân* để trống:** "Ritornello cuối cùng" có thể là ô 66 (tutti trở lại sau đoạn chim hót) hoặc ô 76 (tutti sau đoạn độc tấu cuối). Nếu tách thành hai dòng, mốc lấy được ngay (ô 66 và 76 đã có trong MIDI).
7. **K. 141 và K. 466 chưa có bản thu dùng được.** Ngoài các bản PD-EU ở mục 1: John Sankey (MIDI dựng âm, giấy phép "Attribution" không có trong danh sách), Membeth (CC0, đàn harpsichord điện tử Yamaha CLP-470; khác giấy phép với K. 380, mà một khối bản thu chỉ ghi được một giấy phép). K. 467 chỉ có chương 3 của Latsabidze; các bản trọn bộ trên IMSLP là đĩa thương mại 1962–1963 hoặc NC.

## Chỗ chưa chắc hoặc đã bỏ qua

- Dòng giữa chương của Grieg, Rachmaninoff, K. 467 (cadenza), Gershwin để trống: không có bản nhạc số; đo bằng tai không đủ chắc trong 2 giây.
- Gershwin: câu "bản thu đầu tiên" theo hồ sơ Victor 55225 của Library of Congress (thu ngày 10/6/1924) và các nguồn chung (Wikipedia); trang chi tiết của DAHR (UCSB) chặn tải nên chưa đọc được.
- Raymond Smullyan: không rõ năm thu (trang Commons chỉ ghi năm sáng tác).
- Kiểm tra trình duyệt thật (Chrome) cho các trang mới và khối chỉ dẫn link chưa làm; kiểm thử jsdom đạt.
- Link IMSLP đưa người đọc tới trang tải của IMSLP (có trang chờ hoặc trang điều khoản, tùy tài khoản); site không kiểm được bước này, vì công cụ không được vượt cơ chế tải của IMSLP.
- Các nhánh cũ `v15/g4b-ban-thu` và `v15/g7-2-release` (chưa push) vẫn giữ commit có bốn file MP3; `backup/main-co-audio` là `main` cũ. Xóa hay giữ là việc của bạn.
- G4c (24 hướng dẫn nghe dàn nhạc, thính phòng, giọng hát) chưa làm.

## Nguồn đã dùng để kiểm chứng

- Trang mô tả file trên Commons (`commons.py --fresh page`) của mọi bản thu đã chọn và các ứng viên đã loại; mẫu `Template:PD-US-record`, `Template:PD-EU-audio`.
- Trang tác phẩm trên IMSLP (wikitext): K. 331, *Pictures at an Exhibition*, Rachmaninoff Op. 18, Grieg Op. 16, K. 467, Scarlatti K. 141/380/466, *Rhapsody in Blue*, Chopin B. 150; độ dài file IMSLP từ trang đã render.
- Library of Congress, National Jukebox (JSON): https://www.loc.gov/item/jukebox-70342/ và https://www.loc.gov/item/jukebox-70335/ (Victor 55225, ma trận C-30174 và C-30173, 10/6/1924).
- Trường `license`/`copyright` trong file `.ly` của Mutopia (K. 525 hai ấn bản, *Mùa xuân*, K. 331, *Pictures*); `LICENSE.txt` của https://github.com/craigsapp/mozart-piano-sonatas.
