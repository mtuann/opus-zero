# G4c: khảo sát bản thu cho 23 hướng dẫn nghe không phải nhạc piano

G4c hoãn sang v16 (bạn quyết ngày 22/10/2026). Đây là kết quả khảo sát của một agent, chưa phải quyết định, và chưa trang nào được sửa. Trước khi gắn bản thu ở v16, cần:

- đọc lại trang mô tả của từng file, vì giấy phép và tình trạng file trên Commons có thể đã đổi;
- nghe xác nhận các điểm ở mục "Rủi ro và việc cần kiểm thêm";
- quyết định những chỗ dành cho chủ site (âm thanh trích từ phim không gia hạn, bản nhạc số mang giấy phép NC dùng để căn mốc).

Khảo sát ngày 22/10/2026, chỉ đọc, không sửa file nào trong repo. Mọi trang mô tả Commons của bản thu được chọn và phương án dự phòng đều đọc lại bằng `commons.py --fresh page` và `--fresh info` (bộ nhớ đệm mặc định `~/.cache/opus-zero`, không đặt `OZ_AUDIO_CACHE`). IMSLP: đọc wikitext và trang đã render qua `api.php` (đi qua `net.py`, cùng User-Agent và khoảng nghỉ). Không tải file nào từ IMSLP.

Quy ước trong file này:

- `d` là độ dài (giây) do API Commons trả về (`info`), đúng giá trị `rec` sẽ ghi.
- "Chơi được" nghĩa là Commons có MP3 (file gốc MP3 hoặc bản chuyển mã), dùng `commons.py rec` như các trang G4b.
- "Chỉ dẫn link" nghĩa là file video (WebM) trên Commons: không có MP3 chuyển mã, nên dùng phần `link` (trang `File:`) + `src` (file gốc trên `upload.wikimedia.org`) + `d`, như bản Marcelle Meyer ở `debussy-preludes.md`.
- "Chưa kiểm được" là điều tôi không xác minh được từ nguồn nào.

## Tóm tắt

| Nhóm | Số trang | Trang |
|---|---|---|
| Có bản thu Commons chơi được (đề xuất chính) | 13 | bach-air, bach-cello-1, beethoven-5, brahms-4, dvorak-9-largo, grieg-buoi-sang, handel-hallelujah, mendelssohn-violin, mozart-40, mozart-nu-hoang-bong-dem, schubert-erlkonig, tchaikovsky-1812, vivaldi-mua-dong |
| Chỉ có video Commons (chỉ dẫn link), cần nghe xác nhận trước khi dùng | 3 | beethoven-op132, bizet-habanera, ravel-bolero |
| Chỉ có bản IMSLP | 0 | IMSLP chỉ có phương án dự phòng (Dvořák: DuPage Symphony Orchestra) |
| Không có bản thu hợp lệ: để khối trống | 6 | haydn-94, mozart-requiem, puccini-nessun-dorma, schubert-ca-hoi, stravinsky-sacre, tchaikovsky-ho-thien-nga |
| Tác phẩm còn bảo hộ ở Mỹ: để trống như Pärt | 1 | shostakovich-5 |

Bản quyền tác phẩm: 22 tác phẩm hết bảo hộ ở cả Việt Nam và Mỹ. Ba trường hợp cần kiểm:

- *Turandot*: Puccini mất 1924; IMSLP ghi "Year of First Publication=1926 – Milan: Ricordi" nên hết bảo hộ ở Mỹ. "Nessun dorma" là nhạc của Puccini.
- *Boléro*: Ravel mất 1937; IMSLP ghi xuất bản 1929 (Paris: Durand), nên đạt mốc "từ 1930 trở về trước".
- *Le Sacre du printemps*: Stravinsky mất 1971. IMSLP ghi "1913, 1921 – Berlin: Editions Russes de Musique (piano duet, score and parts)", nên bản gốc hết bảo hộ ở Mỹ. Các bản sửa 1947 và 1967 (Boosey & Hawkes) vẫn còn bảo hộ, và phần lớn bản thu hiện đại dùng chúng. Rủi ro này chỉ cần tính nếu sau này tìm được bản thu.

Shostakovich số 5: sáng tác 1937 (tháng 4–7), IMSLP ghi "Year of First Publication=1939", ấn bản đầu Muzgiz, Moscow, n.d. (ca. 1939), số bản in M. 16313 Г. Như vậy tác phẩm xuất bản sau 1930 và còn bảo hộ ở Mỹ. Ông mất 9/8/1975, tức đã hết bảo hộ ở Việt Nam, nhưng tác phẩm phải hết bảo hộ ở cả hai nơi. Đề xuất: để trống, ghi lý do như `part-spiegel.md`.

## Bảng tổng

| Trang | Bản thu đề xuất | Giấy phép | Nguồn | Phần | Ghi chú |
|---|---|---|---|---|---|
| bach-air | Air Force Strings (US Air Force Band), Keith H. Bland, 2000 | phạm vi công cộng (PD-USGov) | Commons, chơi được | 1 | Rê trưởng (bản gốc, không phải Wilhelmj); phần đầu nhắc lại, phần sau không |
| bach-cello-1 | John Michel (cello) | CC BY-SA 3.0 | Commons, chơi được | 1 (Prelude) | Năm thu: chưa kiểm được |
| beethoven-5 | Skidmore College Orchestra (Musopen) | phạm vi công cộng (PD-author, vé VRT) | Commons, chơi được | 4 (I–IV) hoặc 3 (I, III, IV) | Chương I có nhắc lại phần trình bày; file III dừng ngay chỗ chuyển sang IV |
| beethoven-op132 | New York Classical Players (tứ tấu: Bak, Haralampieva, Yiu, Fayette), 4/1/2020 | CC BY 3.0 (YouTube CC-BY, đã duyệt) | Commons video, chỉ dẫn link | 1 file cả tứ tấu | Chương 3 bắt đầu ở 19:31; Commons ghi nhầm "Public domain" trong metadata |
| bizet-habanera | Natalia Kutateladze (mezzo), Concurs Tenor Viñas lần thứ 57 (2020) | CC BY 3.0 (YouTube CC-BY, chưa duyệt) | Commons video, chỉ dẫn link | 1 | Đệm piano hay dàn nhạc: chưa kiểm được; không có hợp xướng |
| brahms-4 | Musopen Symphony Orchestra (IMSLP ghi: Czech National Symphony Orchestra), 2012 | phạm vi công cộng (bản FLAC) hoặc CC0 (bản OGG) | Commons, chơi được | 1 (chương 4) | |
| dvorak-9-largo | Musopen, không ghi tên dàn nhạc | phạm vi công cộng (PD-author, vé VRT) | Commons, chơi được | 1 (chương 2) | Dự phòng IMSLP: DuPage Symphony Orchestra, CC BY-SA 3.0 |
| grieg-buoi-sang | Czech National Symphony Orchestra (Musopen Symphony Orchestra), 2012 | phạm vi công cộng (PD-author) | Commons, chơi được | 1 | Dự phòng lịch sử: Leo Blech, Berliner Philharmoniker, 1921 |
| handel-hallelujah | MIT Concert Choir, William C. Cutter, 20/5/2003 | CC BY-SA 2.0 | Commons, chơi được | 1 | Dự phòng: National Chorus of Korea, 2019 (CC BY 3.0) |
| haydn-94 | (không có) | | | | Koussevitzky 1929 còn bảo hộ ở Mỹ; các bản khác dựng bằng máy hoặc thuộc thời LP |
| mendelssohn-violin | Soojin Han (violin), Hankyung Arte Philharmonic, Seokwon Hong, 23/9/2022 | CC BY 3.0 (YouTube CC-BY, chưa thấy duyệt) | Commons, chơi được | 3 | Commons chỉ ghi tên dàn nhạc; tên nghệ sĩ lấy từ mô tả YouTube |
| mozart-40 | Tsumugi Orchestra, Takashi Inoue, 15/8/2010 | CC BY 3.0 | Commons, chơi được | 1 (chương 1) | Có nhắc lại phần trình bày; bản Musopen thì không |
| mozart-nu-hoang-bong-dem | Sandra Partridge, Siam Philharmonic Orchestra, Trisdee na Patalung (Bangkok Opera, 5/4/2006) | CC BY 2.5 | Commons, chơi được | 1 | Thu trực tiếp |
| mozart-requiem | (không có) | | | | |
| puccini-nessun-dorma | (không có) | | | | Pertile 1927 vào phạm vi công cộng ở Mỹ ngày 1/1/2028 |
| ravel-bolero | Flashmob: nhạc công CNSMDP, EMESP Tom Jobim, Guri; São Paulo, 14/9/2013 | CC BY 3.0 (YouTube CC-BY, đã duyệt) | Commons video, chỉ dẫn link | 1 | Thu ở nơi công cộng; trọn bài hay rút gọn: chưa kiểm được |
| schubert-ca-hoi | (không có) | | | | |
| schubert-erlkonig | Michael Jackson (bass-baritone), người đệm không ghi tên | CC BY 3.0 | Commons, chơi được | 1 | Dự phòng lịch sử: Schumann-Heink, Victor 1913 |
| shostakovich-5 | (để trống: tác phẩm còn bảo hộ ở Mỹ) | | | | |
| stravinsky-sacre | (không có) | | | | |
| tchaikovsky-1812 | Skidmore College Orchestra (Musopen) | phạm vi công cộng (PD-author, vé VRT) | Commons, chơi được | 1 | |
| tchaikovsky-ho-thien-nga | (không có) | | | | Barbirolli 1933 còn bảo hộ ở Mỹ |
| vivaldi-mua-dong | John Harrison (violin), Wichita State University Chamber Players, Robert Turizziani, 6/2/2000 | CC BY-SA 4.0 (trang ghi cc-by-sa-1.0+) | Commons, chơi được | 1 (chương 1) | Cùng bộ với trang *Mùa xuân* |

## Chi tiết từng trang có bản thu

Mỗi mục ghi: tên file chính xác, người chơi như trang mô tả ghi, giấy phép và link, trang mô tả, `d`, năm thu. Sau đó là phương án dự phòng, các ứng viên đã loại và nguồn bản nhạc số cho mốc.

### 1. bach-air (BWV 1068, Air; bảng 5 dòng)

**Chọn:** `File:Air - Air Force Strings - United States Air Force Band.mp3`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Air_-_Air_Force_Strings_-_United_States_Air_Force_Band.mp3
- Trang ghi: "Overture (Suite) No. 3 in D Major, BWV 1068: II. Air, "Air on the G String" performed by the Air Force Strings of the United States Air Force Band. Track 13 from *Collage* (2000)."
- Trang của bản OGG cùng bản thu (`File:Air.ogg`) ghi thêm: "United States Air Force Strings, conducted by Keith H. Bland". Album *Collage* thu ngày 18–26/5/2000 tại The United States Air Force Band Recording Facility, Bolling Air Force Base, Washington, D.C.; số catalogue BOL-0006. Theo liner notes, album có 7 violin 1, 5 violin 2, 4 viola, 3 cello, 1 contrabass và 1 accordion.
- Giấy phép: Performance và Recording `{{PD-USGov-Military-Air Force}}`, Composition `{{PD-old-auto-expired}}`. Ghi "phạm vi công cộng", không có `licUrl`.
- MP3 (file gốc là MP3, không có `src`): https://upload.wikimedia.org/wikipedia/commons/e/ec/Air_-_Air_Force_Strings_-_United_States_Air_Force_Band.mp3
- `d` = 183.31.
- Kiểm bằng chroma (bản thu trong bộ nhớ đệm), chưa nghe xác nhận:
    - Bè trầm mở đầu và kết ở Rê (Rê2), vậy đây là bản gốc giọng Rê trưởng, không phải bản Wilhelmj Đô trưởng.
    - Đoạn mở đầu quay lại ở khoảng 46,6 giây (độ tương đồng 0,98), tức phần đầu (6 ô) được nhắc lại.
    - Tính theo độ dài, phần sau (12 ô) không nhắc lại.
- Cuối file có thẻ "LYRICS" khiến bộ giải mã báo cảnh báo. Không ảnh hưởng gì.

**Dự phòng:**

1. `File:Air.ogg`: cùng bản thu, bitrate thấp hơn. `d` = 183.28; MP3 chuyển mã https://upload.wikimedia.org/wikipedia/commons/transcoded/5/55/Air.ogg/Air.ogg.mp3; `src` https://upload.wikimedia.org/wikipedia/commons/5/55/Air.ogg. Giấy phép như trên.
2. `File:Bach - Orchestral Suite No. 3 in D major, BWV 1068 - Air (Menuhin).flac`, `d` = 275.62.
    - Commons ghi: date 1948, Concert Films Corporation/Paul Gordon (phim *Concert Magic*), `{{PD-US-not renewed}}{{PD-US-extracted-audio}}`.
    - IMSLP (trang BWV 1068, mục Air) ghi người chơi: Yehudi Menuhin (violin), Antal Doráti (conductor), Symphony Orchestra of Hollywood.
    - Chroma cho thấy giọng Rê trưởng.
    - Đây là âm thanh trích từ phim không gia hạn bản quyền, cơ sở pháp lý khác với luật bản thu 100 năm (MMA). Chủ site quyết định có nhận hay không.
3. Bản Wilhelmj (lịch sử; dùng nếu muốn minh họa hai phiên bản mà trang nói tới): `File:Air (Bach).ogg`, `d` = 259.9.
    - "1920 recording … Violin solo by Joel Belov with piano accompaniment by Robert Gayler", nguồn ống ghi âm UCSB số 1089.
    - Thu năm 1920, nên đã vào phạm vi công cộng ở Mỹ.

**Đã loại:**

- `Johann Sebastian Bach, Suite n° 3 … (secondo movimento, Aria).ogg`: dựng bằng LMMS.
- `Wiki naxos 8.550194 01 13.ogg`: bản chuyển soạn cho violin và dàn nhạc.
- Bản saxophone (David Hernando Vitores).
- PDP-CH Busch (HMV, những năm 1930) và Melachrino: còn bảo hộ ở Mỹ.
- IMSLP: bản thu thời LP 1957–1962 còn bảo hộ ở Mỹ; các bản khác là chuyển soạn (Papalin, accordion, organ, piano Siloti, guitar).

**Mốc:** Mutopia `BachJS/BWV1068/bach-air` (theo Bach-Gesellschaft; CC BY-SA 3.0; Mutopia-2008/10/28-242).

- Tải `https://www.mutopiaproject.org/ftp/BachJS/BWV1068/bach-air/bach-air-mids.zip`, lấy member `bach-air-score.mid` (Rê trưởng, 4/4; đủ bốn bè Violino I, II, Viola, Continuo).
- MIDI không viết ra dấu nhắc lại: dùng `segs` (A, A, B).

### 2. bach-cello-1 (BWV 1007, Prelude; bảng 6 dòng)

**Chọn:** `File:JOHN MICHEL CELLO-J S BACH CELLO SUITE 1 in G Prelude.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg
- Người chơi: John Michel (http://johnmichel.com/); nguồn garageband.com/artist/cello; vé VRT 2007090610014151.
- Giấy phép: CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/4/43/JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg/JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/4/43/JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg
- `d` = 130.27.
- Năm thu: chưa kiểm được (trường Date để trống).
- Commons có đủ các chương khác của John Michel (Allemande … Gigue), nếu muốn thêm Sarabande mà trang nhắc tới.

**Dự phòng:**

1. `File:Bach Cello Suite 1 Prelude (BWV 1007) Played by Chris.ogg`, `d` = 154.71.
    - CC0 (http://creativecommons.org/publicdomain/zero/1.0/deed.en); ngày 2024-12-21; người tải lên Fopseh.
    - Người chơi chỉ ghi "Chris".
2. Chỉ dẫn link (không phát được): `File:Bach - Cello Suite no. 1 in G major, BWV 1007 - I. Prélude.ogg` (Pablo Casals, "Date=1929/1939", bản phục chế Naxos Historical/Ward Marston). Mẫu giấy phép là `{{PD-EU-audio}}`, nên vẫn còn bảo hộ ở Mỹ: xử lý như bản Marcelle Meyer. Trang nghe có nhắc Casals ở dòng "Bản thu gợi ý".

**Đã loại:**

- Philip Milman (Lud and Schlatts): dàn nhạc ảo.
- Darrell Jacobi (`IMSLP173147-…darjac.ogg`): IMSLP xếp vào Synthesized/MIDI.
- Kevin MacLeod (dulcimer).
- IMSLP: Fournier 1961 và Casals LP 1957 (còn bảo hộ ở Mỹ), Colin Carr (NC-ND), Thomas Auner (NC).

**Mốc:** Mutopia `BachJS/BWV1007/bwv1007` (Schirmer 1916; phạm vi công cộng; Mutopia-2018/01/19-517).

- Tải `bwv1007-mids.zip`, lấy member `bwv1007.mid`: đây là Prelude (Sol trưởng, 4/4, 656 nốt). Các file `-1` đến `-6` là những chương sau.

### 3. beethoven-5 (Op. 67; bảng 9 dòng: 8 dòng chương 1, 1 dòng từ chương 3 sang chương 4)

**Chọn:** Skidmore College Orchestra, do Musopen phát hành. Cùng nguồn và cùng vé VRT 2008012110017088 với bản Rachmaninoff số 2 đã nhận ở G4b.

- Phần ghi bản thu trên Commons: `{{PD-author|[https://musopen.org/music/113/… Skidmore College orchestra]}}`. Không ghi người chỉ huy; năm thu chưa kiểm được.
- Giấy phép: phạm vi công cộng.

Các phần, theo thứ tự (`page` là trang mô tả của phần đầu):

| t | File | d |
|---|---|---|
| I. Allegro con brio | `File:Ludwig van Beethoven - symphony no. 5 in c minor, op. 67 - i. allegro con brio.ogg` | 500.09 |
| II. Andante con moto (tùy chọn) | `File:Ludwig van Beethoven - symphony no. 5 in c minor, op. 67 - ii. andante con moto.ogg` | 598.68 |
| III. Allegro | `File:Ludwig van Beethoven - symphony no. 5 in c minor, op. 67 - iii. allegro.ogg` | 336.01 |
| IV. Allegro | `File:Ludwig van Beethoven - symphony no. 5 in c minor, op. 67 - iv. allegro.ogg` | 706.68 |

- Trang mô tả phần I: https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor,_op._67_-_i._allegro_con_brio.ogg
- MP3 và `src` là đường dẫn chuẩn của `commons.py rec`. Lệnh `info` cho các thư mục băm: `e/e6` (I), `c/c0` (II), `5/5b` (III), `4/47` (IV).
- Kiểm bằng chroma:
    - Chương I có nhắc lại phần trình bày: đoạn mở đầu quay lại ở khoảng 103 giây.
    - File III không có khoảng lặng ở cuối: mức âm tăng dần tới khoảng −9 dBFS ở giây cuối, tức file dừng giữa đoạn chuyển. File IV vào ngay ở mức to.
    - Vì vậy dòng 9 ("từ chương 3 sang chương 4") nên lấy mốc là đầu phần IV.
- Nên đưa cả II để trọn bản giao hưởng (trang có mục "Bốn chương"). Nếu bỏ II thì còn 3 phần.

**Dự phòng:**

1. Chỉ có chương 1: `File:Beethoven Symphony No. 5, Mvmt 1 - University of Colorado Boulder Symphony Orchestra.webm`, `d` = 440.18.
    - Video, chỉ dẫn link.
    - Gary Lewis chỉ huy; `{{YouTube CC-BY|University of Colorado Boulder College of Music}}`, đã được LicenseReviewerBot duyệt ngày 2022-01-30. Ghi CC BY 3.0.
2. Fulda Symphonic Orchestra, Simon Schindler, thu ngày 10/3/2002: **không nên dùng**, vì giấy phép mâu thuẫn.
    - Commons ghi `{{OAL-1}}`; không có trong danh sách của `licenses.py`.
    - Riêng file chương 1 có LicenseShortName là "Public domain", nhưng con số này lấy từ mẫu ghi cho tác phẩm, nên sai.
    - IMSLP ghi cùng bộ này là CC BY-SA 3.0 (#298641–#298644, 7:28 / 9:57 / 5:22 / 10:53).

**Đã loại:**

- `Symphony No.5, Op.67 – Ludwig van Beethoven.ogg` (Omega13a): dựng bằng MuseScore 4.
- PDP-CH Sargent (Decca), HMV DB 3328–3332: còn bảo hộ ở Mỹ.
- Victor Concert Orchestra 1917: chỉ có chương 4.
- IMSLP: các bản 1937–1963 còn bảo hộ ở Mỹ.

**Mốc:** Mutopia `BeethovenLv/O67/Symphony5_1` (chương 1, tổng phổ theo Breitkopf & Härtel 1862–1865; phạm vi công cộng; Mutopia-2017/11/05-941).

- MIDI dựng sẵn: https://www.mutopiaproject.org/ftp/BeethovenLv/O67/Symphony5_1/Symphony5_1.mid
- Nguồn đối chiếu: `BeethovenLv/O67/beethoven_fifth_op67`, bản rút gọn cho piano của chương 1 (Augener; phạm vi công cộng; Mutopia-2015/01/17-497), file `beethoven_fifth_op67.mid`.
- Chương 3 và 4 không có bản nhạc số: dòng 9 dùng `"start"` của phần IV.

### 4. beethoven-op132 (chương 3; bảng 5 dòng)

**Chọn (chỉ dẫn link, video):** `File:NYCP Beethoven String Quartet No. 15.webm`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:NYCP_Beethoven_String_Quartet_No._15.webm
- Commons ghi: "performed by the New York Classical Players … January 4, 2020, at the Bruno Walter Auditorium at Lincoln Center".
- Mô tả YouTube (Uxxz1ehyOUs, đọc ngày 22/10/2026) xác nhận đây là tứ tấu bốn người, không phải dàn dây: Brian Bak, Gergana Haralampieva (violin), Jay Yiu (viola), Madeline Fayette (cello).
- Mốc chương trong mô tả YouTube: Opening 00:00; I 00:09; II 10:20; **III 19:31**; IV 36:33; V 38:46.
- Giấy phép: `{{YouTube CC-BY|New York Classical Players}}` kèm `{{YouTubeReview|…|date=2024-08-04|reviewer=Mazbel}}`, tức CC BY 3.0 (https://creativecommons.org/licenses/by/3.0). Trang YouTube vẫn hiện "Creative Commons Attribution license (reuse allowed)".
- **Bẫy:** extmetadata của Commons ghi LicenseShortName = "Public domain" (lấy từ mẫu `{{PD-old-auto-expired}}` của tác phẩm). Vì vậy `commons.py info/rec` sẽ trả "phạm vi công cộng", là sai: phải ghi tay CC BY 3.0. `check_audio.py --network` có thể báo lệch giấy phép.
- `link`: https://commons.wikimedia.org/wiki/File:NYCP_Beethoven_String_Quartet_No._15.webm
- `src`: https://upload.wikimedia.org/wikipedia/commons/2/26/NYCP_Beethoven_String_Quartet_No._15.webm (164 MB, VP9 + Opus)
- `d` = 2764.75: cả tứ tấu trong một file.
- Đo trên bản chuyển mã 240p: khoảng lặng ở 1164,4–1172,6 giây; ngay sau đó là nhạc chỉ dùng phím trắng (Fa Lydian). Khớp với mốc 19:31 của YouTube. Đề xuất `note`: "chương 3 bắt đầu ở khoảng 19:31".

**Không có dự phòng:**

- IMSLP: Orion String Quartet và Belcea Quartet (NC-ND), Budapest String Quartet 1953 (còn bảo hộ ở Mỹ).
- Commons chỉ có trích đoạn 32 giây (`Opus 132 opening.ogg`) và MIDI.

**Mốc:**

- DCML ABC (Annotated Beethoven Corpus), https://github.com/DCMLab/ABC: `notes/n15op132_03.notes.tsv`, `measures/n15op132_03.measures.tsv`, `MS3/n15op132_03.mscx`. Giấy phép CC BY-NC-SA 4.0, giống bộ `dcml-grieg` đã dùng.
- Đối chiếu: MuseData `musedata/beethoven-op132-03.msd` (https://github.com/musedata/beethoven-quartets). Kho không ghi giấy phép: chưa kiểm được. Định dạng MuseData stage 2, cần chuyển đổi.

### 5. bizet-habanera (bảng 5 dòng)

**Ứng viên duy nhất (chỉ dẫn link, video), cần nghe trước khi dùng:** `File:57è Concurs Viñas - Natalia Kutateladze.webm`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:57%C3%A8_Concurs_Vi%C3%B1as_-_Natalia_Kutateladze.webm
- Người hát: "Natalia Kutateladze, mezzosoprano (GEÒRGIA)". Mô tả kể các giải của cô, trong đó có "Premi del públic assistent a la Prova Final", và ghi "Interpreta: Havanera – Carmen (Bizet)".
- Commons date 2020-01-29; nguồn YouTube 3CwOcxrjb_A (kênh LiceuOperaBarcelona).
- Giấy phép: `{{YouTube CC-BY|LiceuOperaBarcelona}}` + `{{LicenseReview}}` **chưa có người duyệt**. Trang YouTube hiện "Creative Commons Attribution license (reuse allowed)" (đọc ngày 22/10/2026). Ghi CC BY 3.0, https://creativecommons.org/licenses/by/3.0
- `link`: https://commons.wikimedia.org/wiki/File:57%C3%A8_Concurs_Vi%C3%B1as_-_Natalia_Kutateladze.webm
- `src`: https://upload.wikimedia.org/wikipedia/commons/d/db/57%C3%A8_Concurs_Vi%C3%B1as_-_Natalia_Kutateladze.webm
- `d` = 215.94; nhạc bắt đầu khoảng 7,9 giây (silencedetect −40 dB).
- Chưa kiểm được:
    - Đệm bằng piano hay dàn nhạc. Mô tả không nói; phân tích phổ không đủ chắc.
    - Bản thi nên gần như chắc không có hợp xướng, nên dòng 3 của bảng ("hợp xướng phụ họa 'L'amour!'") sẽ không khớp.

**Đã loại:**

- `Habanera (ISRC USUAN1100656).mp3`: Jenny Lee Mitchell hát trên phần đệm của Kevin MacLeod (incompetech, dựng bằng nhạc cụ ảo).
- `Kevin MacLeod - Georges Bizet Habanera.ogg`: không lời, dựng bằng máy.
- `Habanera.ogg` (Pracchia-78): dựng bằng máy.
- `Habanera iz op. "Karmen"B.16517.wav`: Amanda Liberte-Rebāne, Parlophon, năm "[19--]", `{{PD-EU-audio}}`. Năm chưa rõ, nhiều khả năng còn bảo hộ ở Mỹ.
- IMSLP: Beecham 1960, Goehr 195?, Wolff 1958 (còn bảo hộ ở Mỹ); tenor Pottier (NC-ND).
- Không tìm thấy trên Commons bản thu Habanera nào trước 1926. Đã tìm: Calvé, Farrar, Maria Gay, "Habanera Victor", "Habanera 1908", "Carmen L'amour", "L'amour est un oiseau rebelle", danh mục "Audio files of Carmen".

**Mốc:** Mutopia không có (thư mục `BizetG` chỉ có Entr'acte màn II và Prélude, bản piano).

### 6. brahms-4 (chương 4; bảng 8 dòng)

**Chọn:** `File:Brahms - Symphony No. 4 in E minor, Op. 98 - IV. Allegro energico e passionato - Più allegro (Musopen Symphony).flac`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Brahms_-_Symphony_No._4_in_E_minor,_Op._98_-_IV._Allegro_energico_e_passionato_-_Pi%C3%B9_allegro_(Musopen_Symphony).flac
- Trang ghi "Artists: Musopen Symphony", date 2012; nguồn Musopen và https://archive.org/details/MusopenCollectionAsFlac.
- Giấy phép: recording `{{PD-author|Musopen}}`, tức phạm vi công cộng.
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7c/Brahms_-_Symphony_No._4_in_E_minor%2C_Op._98_-_IV._Allegro_energico_e_passionato_-_Pi%C3%B9_allegro_%28Musopen_Symphony%29.flac/Brahms_-_Symphony_No._4_in_E_minor%2C_Op._98_-_IV._Allegro_energico_e_passionato_-_Pi%C3%B9_allegro_%28Musopen_Symphony%29.flac.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/7/7c/Brahms_-_Symphony_No._4_in_E_minor%2C_Op._98_-_IV._Allegro_energico_e_passionato_-_Pi%C3%B9_allegro_%28Musopen_Symphony%29.flac
- `d` = 667.70.
- Tên dàn nhạc thật: IMSLP (trang Op. 98) ghi bản này là "Czech National Symphony Orchestra … Palo Alto: Musopen, 2012 … Public Domain (dedicated)". Trang Commons của *Morning Mood* (cùng dự án Musopen Kickstarter) cũng ghi như vậy.

**Dự phòng:** `File:Brahms, Symphony No. 4 in E Minor, Op. 98 - IV. Allegro Energico e Passionato.ogg`. Cùng bản thu; CC0 (http://creativecommons.org/publicdomain/zero/1.0/deed.en); Author "Musopen Symphony Orchestra"; `d` = 667.73.

**Đã loại:**

- IMSLP: Walter 1957 (còn bảo hộ ở Mỹ); Stenov (bản organ).

**Mốc:** chưa tìm thấy bản nhạc số mở (Mutopia không có Op. 98). Có thể chỉ dùng `"start"` rồi đo tay: mỗi biến tấu dài 8 ô.

### 7. dvorak-9-largo (chương 2; bảng 6 dòng)

**Chọn:** `File:Antonin Dvorak - symphony no. 9 in e minor 'from the new world', op. 95 - ii. largo.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Antonin_Dvorak_-_symphony_no._9_in_e_minor_%27from_the_new_world%27,_op._95_-_ii._largo.ogg
- Người chơi: trang ghi "(see Musopen for performance author information)". Dàn nhạc chưa kiểm được: không có trong bộ Musopen Kickstarter trên Internet Archive, IMSLP cũng không có.
- Giấy phép: recording `{{PD-author|Musopen}}`, vé VRT 2008012110017088, tức phạm vi công cộng.
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c3/Antonin_Dvorak_-_symphony_no._9_in_e_minor_%27from_the_new_world%27%2C_op._95_-_ii._largo.ogg/Antonin_Dvorak_-_symphony_no._9_in_e_minor_%27from_the_new_world%27%2C_op._95_-_ii._largo.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/c/c3/Antonin_Dvorak_-_symphony_no._9_in_e_minor_%27from_the_new_world%27%2C_op._95_-_ii._largo.ogg
- `d` = 694.46.

**Dự phòng (IMSLP, chỉ dẫn link):** DuPage Symphony Orchestra, Barbara Schubert chỉ huy, "Performed 12 February 2012", CC BY-SA 3.0.

- File: `File:PMLP08710-dso20120212-003-dvorak-symphony-no9-mvtII.mp3`, #291837, 11:09.
- Link tải: https://imslp.org/wiki/Special:ImagefromIndex/291837
- Trang tác phẩm: https://imslp.org/wiki/Symphony_No.9,_Op.95_(Dvo%C5%99%C3%A1k,_Anton%C3%ADn)
- Bản này cũng có trên Internet Archive: `dso20120212`.

**Đã loại:**

- `Dvorak S9M2 100501.ogg`: dựng bằng Garritan.
- Omega13a: MuseScore.
- PDP-CH Landon Ronald, Royal Albert Hall Orchestra: thu và phát hành 1927, còn bảo hộ ở Mỹ đến hết 2027.
- "Goin' Home" của US Air Force Band: bản chuyển soạn.
- IMSLP: các bản 1953–1962 còn bảo hộ ở Mỹ; Stenov (bản chuyển soạn có lời).

**Mốc:** Mutopia `DvorakA/O95/Sym9` (N. Simrock GmbH 1894; CC BY-SA 3.0; Mutopia-2011/10/03-1793).

- Tải `https://www.mutopiaproject.org/ftp/DvorakA/O95/Sym9/Sym9-mids.zip`, lấy member `Mvt2_Largo.mid`.

### 8. grieg-buoi-sang (*Morgenstemning*; bảng 7 dòng)

**Chọn:** `File:Musopen - Morning.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Musopen_-_Morning.ogg
- Trang ghi: "performed by the Czech National Symphony Orchestra as the Musopen Symphony Orchestra for the Musopen Kickstarter Project"; date 2012-04-07.
- Giấy phép: `{{PD-author|Musopen}}`, tức phạm vi công cộng.
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1a/Musopen_-_Morning.ogg/Musopen_-_Morning.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/1/1a/Musopen_-_Morning.ogg
- `d` = 229.18.
- IMSLP có cùng bản Musopen này, nhưng ghi CC BY 3.0 (#246987, 3:53). Trang dùng file Commons nên ghi theo Commons; cả hai đều là giấy phép được nhận.

**Dự phòng:**

1. `File:Grieg - Peer Gynt Suite No. 1, Op. 46 - I. Morning Mood (Musopen Symphony).flac`: cùng bản thu, `d` = 229.18, PD-author.
2. Bản lịch sử: `File:Peer Gynt Suite - Part 1- Morning.oga`, `d` = 225.81.
    - Trang ghi "Performer: Berlin Philharmonic Orchestra … Conductor: Leo Blech … First recording date: 1921, First release date: 1921"; nguồn Vocalion A-38009 (Public Domain Project).
    - Phát hành 1921 nên đã vào phạm vi công cộng ở Mỹ. Thu âm cơ học.

**Đã loại:**

- `Henrik Ibsen, Edvard Grieg - Morgenstemning (Morning Mood).ogg` (Pracchia-78): dựng bằng máy.
- Omega13a: MuseScore.
- IMSLP: van Otterloo 1952 (còn bảo hộ ở Mỹ).

**Mốc:** Mutopia không có *Morning* (`GriegE/O46` chỉ có số 2, 3, 4).

### 9. handel-hallelujah (bảng 6 dòng)

**Chọn:** `File:Handel - messiah - 44 hallelujah.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Handel_-_messiah_-_44_hallelujah.ogg
- Trang ghi: "Performed by: MIT Concert Choir; Directed by William C. Cutter", Date 2003-05-20; nguồn web.archive.org (hebb.mit.edu/FreeMusic/MIT_Music/Handel/).
- Danh mục "Handel - Messiah, 2003 MIT recording" có cả các số khác, trong đó có Sinfony cho dàn nhạc.
- Giấy phép: CC BY-SA 2.0, https://creativecommons.org/licenses/by-sa/2.0
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/c/ce/Handel_-_messiah_-_44_hallelujah.ogg/Handel_-_messiah_-_44_hallelujah.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/c/ce/Handel_-_messiah_-_44_hallelujah.ogg
- `d` = 227.39.

**Dự phòng:**

1. `File:The National Chorus of Korea - Handel's Messiah, HWV 56 - XLIV. Hallelujah.ogg`, `d` = 210.76.
    - CC BY 3.0, https://creativecommons.org/licenses/by/3.0; `{{YouTube CC-BY}}`, chưa thấy mẫu duyệt.
    - Mô tả YouTube (IueFDoUxPt8): buổi hòa nhạc định kỳ lần thứ 180 của 국립합창단 (National Chorus of Korea), chỉ huy 윤의중 (Yoon Eui-joong), 3/12/2019, Seoul Arts Center Concert Hall.
    - Có thêm bản video: `…XLIV. Hallelujah (video).webm`, `d` = 227.53.
2. Bản lịch sử: `File:Messiah Hallelujah Chorus 1916.ogg`, `d` = 222.96.
    - Edison Diamond Disc, matrix 4433, tháng 5/1916, `{{PD-US}}`. Thu âm cơ học.
    - `Handel Messiah Hallelujah by Oratorio Chorus.ogg` (`d` = 221.21) lấy từ cùng mục Internet Archive EDIS-SRP-0195-06.

**Đã loại:**

- `Hallelujah from Messiah.OGG`: nguồn "own", mẫu PD-US-record, không rõ người chơi.
- `G.F.Händel-Halleluja hoerprobe.ogg`: "Copyrighted free use", không có trong danh sách giấy phép.
- PDP-CH Sargent (Electrola): còn bảo hộ ở Mỹ.
- Scherchen 1953 (Westminster), các bản trọn bộ trên IMSLP 1946–1964: còn bảo hộ ở Mỹ.
- Ghin (bản chuyển soạn).

**Mốc:** Mutopia `HandelGF/HWV56/Messiah` (Chrysander, Deutsche Händelgesellschaft, tập 45, 1902; CC BY 3.0; Mutopia-2009/12/15-1732).

- Tải `https://www.mutopiaproject.org/ftp/HandelGF/HWV56/Messiah/Messiah-mids.zip`, lấy member **`Messiah-45.mid`**. Đây là Hallelujah: Rê trưởng, 4/4, 201 giây ở tốc độ của MIDI, lời "Hal-le-lu-jah"; `Messiah-44.mid` là "Thou shalt break them".
- Không dùng `HandelGF/hallelujah` (Mutopia-2015/01/17-459): source "Unknown", header ghi "Arranged to play on JSM's 40th anniversary".

### 10. mendelssohn-violin (Op. 64; bảng 8 dòng qua ba chương)

**Chọn:** ba file Hankyung Arte Philharmonic, cùng một video YouTube (aegrdfHxXRA).

| t | File | d |
|---|---|---|
| I. Allegro molto appassionato | `File:Hankyung Arte Philharmonic - Mendelssohn's Violin Concerto in E minor, Op. 64, MWV O 14 - I. Allegro molto appassionato.ogg` | 832.54 |
| II. Andante | `File:Hankyung Arte Philharmonic - Mendelssohn's Violin Concerto in E minor, Op. 64, MWV O 14 - II. Andante.ogg` | 502.90 |
| III. Allegretto non troppo – Allegro molto vivace | `File:Hankyung Arte Philharmonic - Mendelssohn's Violin Concerto in E minor, Op. 64, MWV O 14 - III. Allegretto non troppo-Allegro molto vivace.ogg` | 398.98 |

- Trang mô tả phần I: https://commons.wikimedia.org/wiki/File:Hankyung_Arte_Philharmonic_-_Mendelssohn%27s_Violin_Concerto_in_E_minor,_Op._64,_MWV_O_14_-_I._Allegro_molto_appassionato.ogg (thư mục băm I `b/bc`, II `f/f4`, III `f/fb`)
- Commons chỉ ghi author "Hankyung Arte Philharmonic", date 2023-02-18 (nhiều khả năng là ngày đăng YouTube).
- Mô tả YouTube (đọc ngày 22/10/2026): "Vn. Soojin Han / Cond. Seokwon Hong / Orch. Hankyung Arte Philharmonic / 23rd September 2022 / Seoul Arts Centre Concert Hall". Video hiện nằm trên kênh "한수진 Soojin Han", vẫn hiện "Creative Commons Attribution license (reuse allowed)".
- Giấy phép: CC BY 3.0, https://creativecommons.org/licenses/by/3.0
- Rủi ro: trang Commons chỉ có `{{YouTube CC-BY}}`, chưa thấy `LicenseReview`.
- Phần III bắt đầu bằng Allegretto non troppo, ứng với dòng "Cầu nối … Mi thứ". Chỗ cắt giữa phần I và II (nốt bassoon nối hai chương) cần xem khi căn mốc.

**Dự phòng: không nên dùng khi chưa làm rõ giấy phép.** Fulda Symphonic Orchestra, Simon Schindler, Franziska Früh (violin), 18/3/2001.

- Commons: `Felix Mendelssohn - Violinkonzert e-moll - 1./2./3. ….ogg`, mang `{{OAL-1}}`; `licenses.py` không nhận.
- IMSLP ghi cùng bộ là CC BY 4.0 (#690943 13:27, #690944 8:03, #690945 6:53).

**Đã loại:**

- University of Chicago Orchestra / Frank Wen (NC-ND).
- Oistrakh 1961, Stern 1959, Schwalbé 1960 (còn bảo hộ ở Mỹ).
- Paul De Bra (accordion).

**Mốc:** không có (Mutopia không có Op. 64). Dùng `"start"` cho dòng đầu mỗi chương.

### 11. mozart-40 (K. 550, chương 1; bảng 8 dòng)

**Chọn:** `File:Mozart Symphony 40 G minor - 1 Molto allegro.oga`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Mozart_Symphony_40_G_minor_-_1_Molto_allegro.oga
- Trang ghi: "Performed by the Tsumugi Orchestra conducted by Takashi Inoue on 15 Aug 2010 at the Fukuoka City Children's Science and Culture Center Hall, Japan". Bản tiếng Nhật ghi 井上京（指揮）、管弦楽団紬.
- Nguồn: IMSLP. Trên IMSLP là "Das Orchester Tsumugi", CC BY 3.0, #239964, 7:56.
- Giấy phép: CC BY 3.0, https://creativecommons.org/licenses/by/3.0
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/Mozart_Symphony_40_G_minor_-_1_Molto_allegro.oga/Mozart_Symphony_40_G_minor_-_1_Molto_allegro.oga.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/4/40/Mozart_Symphony_40_G_minor_-_1_Molto_allegro.oga
- `d` = 476.18.
- Chroma: chủ đề 1 quay lại ở 118,6 giây (phần trình bày nhắc lại) và ở 312,2 giây (tái hiện). Khớp dòng 4 của bảng.

**Dự phòng (không hợp bằng):** `File:Mozart - Symphony No. 40 in G minor, K550 - I. Molto allegro (Musopen Symphony).flac`, PD-author, `d` = 358.82.

- Chroma: chủ đề 1 chỉ quay lại ở 195 giây (tái hiện), tức bản này **không nhắc lại phần trình bày**. Dòng "toàn bộ phần trình bày được nhắc lại" sẽ sai.

**Đã loại:**

- Fulda Symphonic Orchestra (Commons `{{OAL-1}}`; IMSLP ghi CC BY-SA 3.0, #298723): giấy phép mâu thuẫn.
- IMSLP: các bản 1942–1962 còn bảo hộ ở Mỹ, gồm cả các bản Philips 1962 và Erato 1957 mà IMSLP ghi "CC0".

**Mốc:** chưa tìm thấy bản nhạc số mở (Mutopia không có K. 550).

### 12. mozart-nu-hoang-bong-dem (*Der Hölle Rache*; bảng 5 dòng)

**Chọn:** `File:Der Hoelle Rache.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Der_Hoelle_Rache.ogg
- Trang ghi: "Live recording from Bangkok Opera's 2006 production, recorded in Thailand Cultural Centre, Bangkok. Performers: Sandra Partridge, soprano; Trisdee na Patalung, conductor; Siam Philharmonic Orchestra"; Date 2006-04-05.
- Giấy phép: `{{Self|GFDL|Cc-by-sa-3.0-migrated|Cc-by-2.5}}`. Commons trả CC BY 2.5, https://creativecommons.org/licenses/by/2.5
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7d/Der_Hoelle_Rache.ogg/Der_Hoelle_Rache.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/7/7d/Der_Hoelle_Rache.ogg
- `d` = 190.56.
- Thu trực tiếp nên cuối file có thể có tiếng vỗ tay: chưa nghe.

**Không có dự phòng tốt:**

- `Mozart. The Queen of the Night's Aria in Ukrainian.ogg`: lời tiếng Ukraina, đệm piano.
- `Queen of the Night 2.webm` (Idara Aguinaga): giấy phép mâu thuẫn. Mẫu ghi CC BY-SA 4.0, nhưng mô tả viết "copyright 2014 All Rights Reserved".
- `Der Hölle Rache.ogg` (77 giây): chỉ là trích đoạn.
- Fricsay 1953: còn bảo hộ ở Mỹ.
- IMSLP: chỉ có bản 1947–1964.

**Mốc:** Mutopia `MozartWA/KV620/magicflute-14-aria` (phạm vi công cộng; Mutopia-2013/03/24-266; nguồn J. L. Peters 1875, C. F. Peters, Lee & Walker 1870, North & Co. 1879).

- Tải `magicflute-14-aria-mids.zip`, lấy member `MF14-ArieScore.mid`.

### 13. ravel-bolero (bảng 12 dòng)

**Ứng viên duy nhất (chỉ dẫn link, video), cần nghe trước khi dùng:** `File:Flashmob - Bolero de Ravel na Pinacoteca de São Paulo, Brasil, Conservatoire de Paris, GURI & EMESP.webm`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Flashmob_-_Bolero_de_Ravel_na_Pinacoteca_de_S%C3%A3o_Paulo,_Brasil,_Conservatoire_de_Paris,_GURI_%26_EMESP.webm
- Trang ghi: "musicians of the Conservatoire de Paris (CNSMDP) … with teachers and students of Tom Jobim EMESP and Guri … Ravel's Bolero in the shape of a flashmob, at the Pinacoteca do Estado, on 14th September [2013]"; "Project of Marine Gandon, Ghislain Roffat & Pierre-Olivier Schmitt".
- Giấy phép: `{{YouTube CC-BY|B Projet}}`, đã duyệt (Daphne Lantier, 2017-05-15), tức CC BY 3.0, https://creativecommons.org/licenses/by/3.0. YouTube fTd3ZsvqDiQ vẫn hiện CC BY.
- `link`: trang mô tả ở trên.
- `src`: https://upload.wikimedia.org/wikipedia/commons/b/bf/Flashmob_-_Bolero_de_Ravel_na_Pinacoteca_de_S%C3%A3o_Paulo%2C_Brasil%2C_Conservatoire_de_Paris%2C_GURI_%26_EMESP.webm (314 MB)
- `d` = 791.25.
- Đo trên bản 240p:
    - Khoảng 60 giây đầu chủ yếu là tiếng ồn nơi công cộng, có lẫn trống.
    - Từ khoảng 90 giây mức âm gần như phẳng (có vẻ bị nén), không thấy đường crescendo.
    - Từ khoảng 745 giây là tiếng vỗ tay.
- Nhạc dài khoảng 11–12 phút: nhanh hơn thường lệ, hoặc là bản rút gọn. **Trọn bài hay không: chưa kiểm được.**

**Đã loại:**

- `Bolero-Maurice Ravel-1930.ogg` (Ravel chỉ huy, 1930): ở Mỹ đến 1/1/2031 mới vào phạm vi công cộng.
- Lamoureux 1935/1939, Munch 1956, Fricsay 1959, Tzipine 1965: còn bảo hộ ở Mỹ.
- Omega13a: MuseScore.
- IMSLP: Paray 1953, Goehr 1958, Silvestri 1959, Ormandy 1963 (còn bảo hộ ở Mỹ).
- US Marine Band chỉ có *Introduction and Allegro*.

**Mốc:** không có (Mutopia không có Ravel).

### 14. schubert-erlkonig (D. 328; bảng 9 dòng)

**Chọn:** `File:Schubert's Erlkönig, D.328 - Michael Jackson.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Schubert%27s_Erlk%C3%B6nig,_D.328_-_Michael_Jackson.ogg
- Commons ghi author "Michael Jackson (presumably not that one)". IMSLP (nguồn của file) ghi "Michael Jackson, Bass-Baritone", CC BY 3.0, #186613, 4:07.
- Người đệm piano: không ghi tên.
- Date 2012-03-11 trên Commons nhiều khả năng là ngày đăng; năm thu chưa kiểm được.
- Giấy phép: CC BY 3.0, https://creativecommons.org/licenses/by/3.0
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/7/71/Schubert%27s_Erlk%C3%B6nig%2C_D.328_-_Michael_Jackson.ogg/Schubert%27s_Erlk%C3%B6nig%2C_D.328_-_Michael_Jackson.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/7/71/Schubert%27s_Erlk%C3%B6nig%2C_D.328_-_Michael_Jackson.ogg
- `d` = 247.04.

**Dự phòng:**

1. Bản lịch sử: `File:Schubert - Schumann-Heink - Erlkönig.ogg`, `d` = 236.67.
    - Ernestine Schumann-Heink, "Recording in 1913 by Victor Talking Machine Company"; nguồn YouTube.
    - Thu năm 1913 nên đã vào phạm vi công cộng ở Mỹ. Trang chỉ có mẫu `{{PD-old}}` (cho tác phẩm).
2. `File:Schubert - Erlkönig (Beal, Campbell).flac`, `d` = 238.17.
    - Phim *Concert Magic* năm 1948, Concert Films Corporation/Paul Gordon, `{{PD-US-not renewed}}`.
    - Người hát và người đệm chỉ ghi "Beal, Campbell": chưa kiểm được.

**Đã loại:**

- `Der Erlkönig.wav`: Suno AI.
- Bản violin (H. W. Ernst), bài đọc thơ Goethe.
- IMSLP: Christoff/Rosbaud 1955 (còn bảo hộ ở Mỹ).

**Mốc:** Mutopia `SchubertF/D328/Erlkoenig` (C. F. Peters, Band I; phạm vi công cộng; Mutopia-2007/09/07-1030).

- MIDI: https://www.mutopiaproject.org/ftp/SchubertF/D328/Erlkoenig/Erlkoenig.mid

### 15. tchaikovsky-1812 (Op. 49; bảng 7 dòng)

**Chọn:** `File:Pyotr Ilyich Tchaikovsky - 1812 overture.ogg`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Pyotr_Ilyich_Tchaikovsky_-_1812_overture.ogg
- Trang ghi: "Recording: Skidmore College Orchestra" (Musopen), "the performance captured here is far more recent (2000-2010)".
- Giấy phép: `{{PD-author|Skidmore College Orchestra}}`, vé VRT 2008012110017088, tức phạm vi công cộng.
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/0/04/Pyotr_Ilyich_Tchaikovsky_-_1812_overture.ogg/Pyotr_Ilyich_Tchaikovsky_-_1812_overture.ogg.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/0/04/Pyotr_Ilyich_Tchaikovsky_-_1812_overture.ogg
- `d` = 999.14.
- Bản thu buổi hòa nhạc. Đại bác hay trống thay đại bác: chưa nghe.

**Dự phòng:**

1. `File:1812 Overture.ogg`, `d` = 988.89.
    - "performed by the United States Army Band, led by Colonel Thomas Rotondi, Jr. in 2005", `{{PD-USGov-Military-Army}}`.
    - Dàn nhạc giao hưởng hay bản chuyển soạn cho kèn: trang không nói, chưa kiểm được.
2. `File:1812 Overture - United States Marine Band.opus`, `d` = 754.64.
    - Col. Jason K. Fettig, 26/5/2019, Wolf Trap.
    - "Transcription: MGySgt Donald Patterson", tức bản chuyển soạn cho dàn kèn. Chỉ dùng khi không còn lựa chọn khác.

**Đã loại:**

- Omega13a: MuseScore.
- van Kempen/Concertgebouw 1951: còn bảo hộ ở Mỹ.
- IMSLP: Bernstein 1963.

**Mốc:** không có (Mutopia không có Op. 49).

### 16. vivaldi-mua-dong (RV 297, chương 1; bảng 6 dòng)

**Chọn:** `File:Vivaldi - Four Seasons 4 Winter mvt 1 Allegro non molto - John Harrison violin.oga`

- Trang mô tả: https://commons.wikimedia.org/wiki/File:Vivaldi_-_Four_Seasons_4_Winter_mvt_1_Allegro_non_molto_-_John_Harrison_violin.oga
- Trang ghi: "Live, Unedited performance — 3m:28.840s, Wiedemann Recital Hall, Wichita State University. John Harrison — Violin / Robert Turizziani — Conductor / Wichita State University Chamber Players"; "Recorded February 6, 2000"; vé VRT 2007022510020031.
- Giấy phép: mẫu trên trang là `{{self|cc-by-sa-1.0+|author=John Harrison}}`. Commons trả CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/deed.en. Trang *Mùa xuân* cũng ghi như vậy.
- MP3: https://upload.wikimedia.org/wikipedia/commons/transcoded/2/2a/Vivaldi_-_Four_Seasons_4_Winter_mvt_1_Allegro_non_molto_-_John_Harrison_violin.oga/Vivaldi_-_Four_Seasons_4_Winter_mvt_1_Allegro_non_molto_-_John_Harrison_violin.oga.mp3
- `src`: https://upload.wikimedia.org/wikipedia/commons/2/2a/Vivaldi_-_Four_Seasons_4_Winter_mvt_1_Allegro_non_molto_-_John_Harrison_violin.oga
- `d` = 208.84.
- `by` nên ghi giống trang *Mùa xuân*: "John Harrison (violin), Wichita State University Chamber Players, Robert Turizziani chỉ huy".

**Dự phòng:**

1. `File:The Modena Chamber Orchestra - Vivaldi's Winter, RV 297 - I. Allegro non molto.ogg`, `d` = 205.51.
    - Musopen, `{{PDMark-owner}}`.
    - Trang ghi "pitch adjusted 20 cents down from original recording", tức file đã bị chỉnh cao độ.
2. `File:Vivaldi - Four Seasons 4 Winter Air Force Strings - United States Air Force Band.mp3`, `d` = 197.67.
    - Jessica Dan (violin), album *Wintertime* (1999), PD-USGov.
    - Là chương nào hay cả mấy chương ghép lại: chưa kiểm được.

**Đã loại:**

- USAF Concert Band (`Vivaldi Winter mvt 1 … The USAF Concert.ogg`): chuyển soạn cho dàn kèn.
- Philip Milman: dựng bằng máy.
- Bản cho tứ tấu saxophone.

**Mốc:** Mutopia `VivaldiA/O8/winter` (Performers' Facsimiles; CC BY-SA 3.0; Mutopia-2010/02/08-351).

- Tải `https://www.mutopiaproject.org/ftp/VivaldiA/O8/winter/winter-mids.zip`, lấy member `winter-score.mid`: chương 1 (Fa thứ, 4/4). `-1`, `-2` là chương 2 và 3, giống quy ước `spring-mids.zip`.

## Trang không có bản thu hợp lệ

Đề xuất: để khối `<div class="oz-listen"></div>` trống (người học tự dán link). Mỗi trang ghi lý do và những gì đã tìm.

| Trang | Lý do | Đã tìm |
|---|---|---|
| haydn-94 | Commons chỉ có Koussevitzky/Boston Symphony Orchestra (date 1929-01-01, `{{PD-EU-audio}}`, nguồn archive.org). Nếu phát hành năm 1929 thì ở Mỹ còn bảo hộ đến hết 2029. Bản còn lại của Beeswaxcandle dựng từ LilyPond. IMSLP: Beecham 1956/1958, Scherchen 1952 (còn bảo hộ ở Mỹ). | Commons: "Haydn Symphony No. 94", "Surprise Symphony", "Haydn surprise andante", "Haydn Symphony 94 Andante", "Paukenschlag", "Hob. I:94", "Sinfonía sorpresa", "Symphony No. 94", danh mục `Symphony No. 94 (Haydn)`, các ban nhạc quân đội Mỹ, Musopen; tìm video. IMSLP: trang Hob. I:94. |
| mozart-requiem | Commons: Krips 1951, Walter 1956, Karajan 1960 (còn bảo hộ ở Mỹ); London Philharmonic Choir/Charles Kennedy Scott (thu 6/7/1926, phát hành 1927, chỉ có Kyrie và Dies irae; ở Mỹ đến 1/1/2028); Papalin (`PMLP02751-S002-*`, bản cho sáo dọc); `M1 Lacrimosa1991.ogg` (Korg M1); `Mozart, Requiem, Sanctus.ogg` (nguồn YouTube, không rõ người hát, chỉ có Sanctus). IMSLP: chỉ có bản 1951–1964 (kể cả bản Krips 1951 mà IMSLP ghi "CC0"). | "Mozart Requiem", "K. 626", "Introitus", "Lacrimosa", "Dies irae", "Confutatis", "Rex tremendae", "Tuba mirum", "Requiem de Mozart", "Réquiem Mozart", "Requiem in D minor"; các danh mục `Requiem, K. 626 (Mozart)`, `Audio files of Requiem Mass by Mozart`; tìm video (chỉ thấy trích đoạn 105 giây "Toonkunst zingt Requiem van Mozart"). |
| puccini-nessun-dorma | Tác phẩm hết bảo hộ. Bản thu: Aureliano Pertile (Fonotipia, date 1927-01-24, nguồn YouTube) ở Mỹ đến **1/1/2028** mới vào phạm vi công cộng; `Giacomo Puccini - Nessun dorma - versione strumentale.ogg` (Pracchia-78) dựng bằng máy. IMSLP: Jacques Pottier (NC-ND); phần đệm piano (NC). | "Nessun dorma", "Turandot", "Turandot Act 3", "Puccini tenor aria", "Nessun dorma tenor/band"; danh mục `Audio files of Turandot (Puccini)`; ban nhạc quân đội Mỹ; tìm video. |
| schubert-ca-hoi | Commons không có bản nào của D. 667 (danh mục `D 667 – Trout Quintet` trống; chỉ có bài giới thiệu "Inleiding" của deSingel). IMSLP: Discophiles français 1961 (còn bảo hộ ở Mỹ), Chamber Music Society of Lincoln Center (NC-ND), De Bra (accordion). | "Trout Quintet", "Forellenquintett", "D. 667", "Quintet D. 667", "Schubert piano quintet", "Schubert quintet Op. 114", "Trout quintet Andantino", "Quintette La Truite", "Forelle"; Musopen String Quartet; tìm video. |
| stravinsky-sacre | Commons chỉ có các trích đoạn 3–13 giây và một bài đọc tiếng Hà Lan. IMSLP: Stravinsky 1940 và 1960, Monteux 1951, Doráti 1954, Bernstein 1958, Boulez 1964… (còn bảo hộ ở Mỹ). | "Rite of Spring", "Sacre du printemps", "Augurs of Spring", "Frühlingsopfer", "Stravinsky ballet"; danh mục `Le Sacre du printemps`; tìm video. |
| tchaikovsky-ho-thien-nga | `Tchaikovsky Swan Lake Op.20 No.10. Scène.ogg` đúng là số 10 nhưng là Barbirolli/London Philharmonic Orchestra, 1933-07-22 (CHARM, `{{PD-EU-audio}}`), còn bảo hộ ở Mỹ đến hết 2033. `Tchaikovsky - Swan Lake Op.20 - Act II Pt.1.ogg` ghi author "European Archive", date "unknown", không rõ người chơi. Ballet Francaise Symphony Orchestra 1958 và Sidney Beer (Decca, PDP-CH) còn bảo hộ ở Mỹ. IMSLP: không có bản thu. | "Swan Lake", "Swan Lake scene", "Swan Lake No. 10", "Swan Lake Op. 20", "Swan Lake suite", "Op. 20a", "Lac des cygnes", "Schwanensee", "Lebedinoe ozero"; danh mục `Audio files of Swan Lake`; Musopen; ban nhạc quân đội Mỹ; tìm video. |
| shostakovich-5 | Tác phẩm còn bảo hộ ở Mỹ: xuất bản 1939 (xem phần Tóm tắt). Commons và IMSLP cũng không có bản thu nào. | |

Bản thu sẽ hết bảo hộ ở Mỹ trong vài năm tới, có thể xem lại khi đến hạn (đều là bản 1923–1946, 100 năm):

- 1/1/2028: Pertile *Nessun dorma* 1927; Kennedy Scott, Requiem (chỉ Kyrie và Dies irae, phát hành 1927); Landon Ronald, Dvořák Largo (1927).
- 1/1/2030: Koussevitzky, Haydn 94. Năm phát hành cần kiểm lại.
- 1/1/2031: Ravel chỉ huy *Boléro* 1930.
- 1/1/2034: Barbirolli, *Hồ thiên nga* số 10 (1933).

## File IMSLP chủ site cần tải tay

Phương án chính không cần file IMSLP nào: mọi bản đề xuất đều nằm trên Commons. Chỉ cần tải tay nếu chọn phương án dự phòng IMSLP và muốn có mốc:

| Trang | File IMSLP | Số chỉ mục | Độ dài (trang IMSLP) | Giấy phép | Ghi chú |
|---|---|---|---|---|---|
| dvorak-9-largo | `File:PMLP08710-dso20120212-003-dvorak-symphony-no9-mvtII.mp3` (https://imslp.org/wiki/File:PMLP08710-dso20120212-003-dvorak-symphony-no9-mvtII.mp3) | #291837 | 11:09 | CC BY-SA 3.0 | DuPage Symphony Orchestra, Barbara Schubert, 12/2/2012. Thay thế được bản Musopen không rõ dàn nhạc |
| mendelssohn-violin (không khuyên) | `PMLP04931-Felix_Mendelssohn_-_Violinkonzert_e-moll_-_1._Allegro_molto_appassionato.ogg`, `…_-_2._Andante.ogg`, `…_-_3._Allegro_molto_vivace.ogg` | #690943, #690944, #690945 | 13:27, 8:03, 6:53 | IMSLP ghi CC BY 4.0, Commons ghi OAL 1.0 | Fulda Symphonic Orchestra, Franziska Früh. Cần làm rõ giấy phép trước |
| beethoven-5 (không khuyên) | `PMLP01586-LvBeethoven_Symphony_No.5_mvt1.ogg` … `mvt4.ogg` | #298641–#298644 | 7:28, 9:57, 5:22, 10:53 | IMSLP ghi CC BY-SA 3.0, Commons ghi OAL 1.0 | Fulda Symphonic Orchestra, Simon Schindler |

## Rủi ro và việc cần kiểm thêm

1. **Video trên Commons không có MP3 chuyển mã** (beethoven-op132, bizet-habanera, ravel-bolero; và các phương án dự phòng: Colorado Boulder, bản video của National Chorus).
    - Phải dùng phần chỉ dẫn link: `link` là trang `File:`, `src` là file WebM trên `upload.wikimedia.org`. `commons.py rec` sẽ báo "không có MP3 chuyển mã".
    - Mốc phải căn trên file WebM gốc. Lưu ý: `run.py` tải `src` vào bộ nhớ đệm; file NYCP nặng 164 MB, file Boléro 314 MB.
2. **Giấy phép trong metadata Commons sai ở file NYCP:** ghi "Public domain", trong khi thật ra là CC BY 3.0. Ghi tay `--lic "CC BY 3.0" --lic-url https://creativecommons.org/licenses/by/3.0`; `check_audio.py --network` có thể báo lệch.
3. **YouTube CC-BY chưa được duyệt trên Commons:** Kutateladze (`{{LicenseReview}}` còn trống), Hankyung Arte (Mendelssohn) và National Chorus of Korea (không có mẫu duyệt). Ngày 22/10/2026 tôi đã đọc trang YouTube của Kutateladze, Mendelssohn, National Chorus, NYCP và Boléro: cả năm đều hiện "Creative Commons Attribution license (reuse allowed)". Video Mendelssohn hiện nằm trên kênh của nghệ sĩ violin, không còn trên kênh của dàn nhạc.
4. **Musopen "PD-author" có vé VRT 2008012110017088** (Beethoven 5, Dvořák, 1812, cùng loại với Rachmaninoff ở G4b) và **PD-USGov** (Air Force, Army, Marine Band): đều là phạm vi công cộng, nằm trong danh sách được nhận.
5. **Âm thanh trích từ phim không gia hạn bản quyền** (Menuhin/Doráti 1948; Beal/Campbell 1948): phạm vi công cộng ở Mỹ theo cơ chế khác (phim không gia hạn). Chỉ để dự phòng; chủ site quyết định.
6. **Bản thu trước 1926 làm dự phòng lịch sử** (Belov 1920, Blech 1921, Edison 1916, Schumann-Heink 1913) đã vào phạm vi công cộng ở Mỹ. Đều thu âm cơ học, chất lượng thấp.
7. **Cần nghe xác nhận:**
    - Bach Air của Air Force: phần đầu nhắc lại, phần sau không (suy từ chroma và độ dài).
    - Kutateladze: đệm piano hay dàn nhạc.
    - Boléro flashmob: trọn bài hay rút gọn, chất lượng âm thanh.
    - *Mùa đông* của Air Force Strings: là chương nào.
    - *1812* của US Army Band: dàn nhạc hay dàn kèn.
    - Tiếng vỗ tay cuối các bản thu trực tiếp (Bangkok, Skidmore).
8. Bảng của trang **bizet-habanera** có dòng "hợp xướng phụ họa"; bản thi không có hợp xướng, nên nếu dùng bản này cần để `null` dòng đó hoặc sửa lời trang.

## Nguồn bản nhạc số cho mốc tham khảo

| Trang | Nguồn | Giấy phép | File |
|---|---|---|---|
| bach-air | Mutopia `BachJS/BWV1068/bach-air` (Bach-Gesellschaft), Mutopia-2008/10/28-242 | CC BY-SA 3.0 | `bach-air-mids.zip` → `bach-air-score.mid` |
| bach-cello-1 | Mutopia `BachJS/BWV1007/bwv1007` (Schirmer 1916), Mutopia-2018/01/19-517 | phạm vi công cộng | `bwv1007-mids.zip` → `bwv1007.mid` (Prelude) |
| beethoven-5 | Mutopia `BeethovenLv/O67/Symphony5_1` (B&H 1862–65), Mutopia-2017/11/05-941; đối chiếu `beethoven_fifth_op67` (bản piano, Augener), Mutopia-2015/01/17-497 | phạm vi công cộng | `Symphony5_1.mid`; `beethoven_fifth_op67.mid` |
| beethoven-op132 | DCML ABC `n15op132_03`; đối chiếu MuseData `beethoven-op132-03.msd` | CC BY-NC-SA 4.0; MuseData chưa kiểm được | TSV nốt và ô nhịp, `.mscx`; `.msd` |
| dvorak-9-largo | Mutopia `DvorakA/O95/Sym9` (Simrock 1894), Mutopia-2011/10/03-1793 | CC BY-SA 3.0 | `Sym9-mids.zip` → `Mvt2_Largo.mid` |
| handel-hallelujah | Mutopia `HandelGF/HWV56/Messiah` (Chrysander 1902), Mutopia-2009/12/15-1732 | CC BY 3.0 | `Messiah-mids.zip` → `Messiah-45.mid` |
| mozart-nu-hoang-bong-dem | Mutopia `MozartWA/KV620/magicflute-14-aria`, Mutopia-2013/03/24-266 | phạm vi công cộng | `magicflute-14-aria-mids.zip` → `MF14-ArieScore.mid` |
| schubert-erlkonig | Mutopia `SchubertF/D328/Erlkoenig` (C. F. Peters), Mutopia-2007/09/07-1030 | phạm vi công cộng | `Erlkoenig.mid` |
| vivaldi-mua-dong | Mutopia `VivaldiA/O8/winter` (Performers' Facsimiles), Mutopia-2010/02/08-351 | CC BY-SA 3.0 | `winter-mids.zip` → `winter-score.mid` |
| brahms-4, grieg-buoi-sang, mendelssohn-violin, mozart-40, tchaikovsky-1812, bizet-habanera, ravel-bolero | Không tìm thấy bản nhạc số mở (Mutopia, GitHub/MuseData, DCML). Dùng `"start"` cho đầu phần, các mốc khác đo tay hoặc để `null` | | |

Link MIDI dựng sẵn: `https://www.mutopiaproject.org/ftp/<đường dẫn>/<tên>.mid` hoặc `<tên>-mids.zip` (đã thử HEAD, trả 200). Giấy phép đọc trong trường `license`/`copyright` của file `.ly`.

## Cách đã làm (để tái lập)

Các đường dẫn `scratchpad/research/…` dưới đây là thư mục tạm của phiên làm việc ngày 22/10/2026, không được lưu lại. Muốn tái lập thì chạy lại các lệnh.

- **Commons, tìm theo truy vấn:** `commons.py search … --limit 50`, khoảng 150 truy vấn tiếng Anh, Đức, Pháp, Ý, Tây Ban Nha, có số danh mục, Musopen, các ban nhạc quân đội Mỹ, tên dàn nhạc. Kết quả lưu ở `scratchpad/research/search/` và `search2/`.
- **Commons, danh mục và video:** liệt kê danh mục và tìm `filetype:video` bằng script phụ `scratchpad/research/bin/oz.py` (gọi `net.py` của repo, nên dùng chung khoảng nghỉ). Kết quả ở `cats/` và `search2/videos.txt`.
- **Commons, trang mô tả:** đọc bằng `commons.py --fresh page` (lưu ở `pages/`); số liệu `info` lưu ở `info1.json`, `info2.json`, `info3.json`.
- **IMSLP:** wikitext tóm tắt bằng `bin/imslpsum.py` (`imslpsum/`, `imslp/`); số chỉ mục và độ dài lấy từ trang render bằng `bin/imslpidx.py` (`imslpidx/`).
- **Phân tích âm thanh** (bằng `.venv-audio`; file Commons tải qua `net.cached_audio` vào bộ nhớ đệm mặc định):
    - `bin/repeatcheck.py`: tìm chỗ chủ đề mở đầu quay lại.
    - `bin/keycheck.py`: ước lượng giọng.
    - `ffmpeg silencedetect` trên các đoạn video 240p.
- **YouTube:** đọc tiêu đề, mô tả và dòng giấy phép trên trang xem video (một yêu cầu mỗi video).
- **Mutopia:** liệt kê qua `gh api` (kho MutopiaProject); tải các file zip MIDI nhỏ vào `scratchpad/research/dl/` để xác định member.
