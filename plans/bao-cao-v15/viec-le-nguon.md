# Báo cáo việc lẻ `nguon`: mục Nguồn cho chín trang

Nhánh: `v15/viec-le-nguon`, tạo từ `main` tại `7cea23b`. Mỗi commit đều qua `mkdocs build --strict` (không cảnh báo) và `npm test` (cả bốn nhóm đạt).

| Commit | Việc |
|---|---|
| `bfddb91` | Mục Nguồn cho bốn trang Hình thức; hai chỗ sửa ở trang Minuet và Trio |
| `cee0e2e` | Mục Nguồn cho năm bài nhạc lý 28–32; ví dụ Musette ở bài 31 chuyển sang hình thức ba đoạn |
| (commit cuối) | Báo cáo này |

## File đã sửa

| File | Thay đổi |
|---|---|
| `docs/hinh-thuc/minuet-trio.md` | Thêm `## Nguồn` (6 mục, 14 link). Sửa "giọng song song" thành "giọng cùng tên", "nhanh gấp đôi" thành "nhanh hơn nhiều" (xem mục Chỗ đã sửa) |
| `docs/hinh-thuc/overture.md` | Thêm `## Nguồn` (4 mục, 11 link) |
| `docs/hinh-thuc/scherzo.md` | Thêm `## Nguồn` (5 mục, 13 link) |
| `docs/hinh-thuc/symphonic-poem.md` | Thêm `## Nguồn` (4 mục, 10 link) |
| `docs/nhac-ly/28-ket-cau.md` | Thêm `## Nguồn` (4 mục, 10 link) |
| `docs/nhac-ly/29-chuoi-hoa-am.md` | Thêm `## Nguồn` (5 mục, 9 link) |
| `docs/nhac-ly/30-phat-trien-motip.md` | Thêm `## Nguồn` (5 mục, 8 link) |
| `docs/nhac-ly/31-hinh-thuc-nho.md` | Thêm `## Nguồn` (6 mục, 17 link). Musette Rê trưởng chuyển từ ví dụ hai đoạn sang ví dụ ba đoạn |
| `docs/nhac-ly/32-ky-thuat-the-ky-20.md` | Thêm `## Nguồn` (4 mục, 18 link) |

Mỗi mục Nguồn theo kiểu các trang cùng mục: danh sách gạch đầu dòng, tên nguồn, link, và điều nguồn đó xác nhận trên trang; dòng cuối "Xem tài liệu tham khảo". Không đụng file nào khác ngoài chín trang và báo cáo này.

## Kết quả build và kiểm thử

Lần chạy cuối (sau commit `cee0e2e`):

```
mkdocs build --strict    INFO - Documentation built in 2.12 seconds   (0 dòng WARNING)

── nhanh · 8.4 giây · đạt
counts: 110 chỗ ghi con số đã kiểm, 214 cụm số + danh từ đã quét, 0 lỗi
── trang-2 · 8.4 giây · đạt
── trang-1 · 8.8 giây · đạt
── a11y · 11.5 giây · đạt
Kiểm thử: 4 nhóm chạy song song trong 11.5 giây, mọi nhóm đều đạt
```

Link: chín mục Nguồn có 105 link ngoài khác nhau. Mỗi link được tải (GET, User-Agent của dự án, nghỉ 2,5 giây giữa các yêu cầu tới Wikimedia và IMSLP qua `tools/audio/net.py`): đều trả 200. Hai link có chuyển hướng đã được thay bằng địa chỉ đích (LibreTexts, BBC Music Magazine).

## Nguồn của từng trang và điều nguồn xác nhận

Chỉ ghi nguồn đã mở và đọc. Wikipedia luôn đi kèm một nguồn khác cho các sự kiện cụ thể khi tìm được (xem mục Chỗ chưa chắc cho các chi tiết chỉ có Wikipedia).

### Minuet và Trio

- Open Music Theory bản 1 (Wharton, Shaffer), "Minuet Form" (LibreTexts): minuet – trio – minuet *da capo*, lần chơi lại thường bỏ dấu nhắc lại; minuet và trio thường là hai đoạn có tái hiện; trio tương phản về giọng, nhiều khi chỉ đổi trưởng – thứ trên cùng chủ âm.
- Open Music Theory, "Ternary Form" (Brian Jarvis): minuet và trio là ba đoạn kép.
- Wikipedia: Minuet (gốc Pháp, nhịp 3/4; tên "trio" từ thời Lully, đoạn giữa viết cho ba nhạc cụ; chương 3 chuẩn của giao hưởng Cổ điển), Trio (music), Ternary form (đoạn giữa thường ở giọng át hoặc giọng cùng tên; minuet chơi lại không nhắc lại), Scherzo ("considerably quicker"; Beethoven biến minuet lịch sự thành điệu nhảy dữ dội; scherzo là chương chuẩn suốt thế kỷ 19).
- Stephen Johnson, "What is a trio in music?", BBC Music Magazine (2016): nguồn gốc tên trio (điệu nhảy thứ hai cho ba nhạc cụ hơi, nhẹ hơn).
- Wikipedia: *Eine kleine Nachtmusik* (minuet Sol trưởng, trio Rê trưởng, da capo), Giao hưởng số 94 của Haydn (Allegro molto, bước chuyển sang scherzo), số 40 của Mozart (cùng số 25 là hai giao hưởng giọng thứ duy nhất; trio Sol trưởng), số 5 của Beethoven (scherzo làm chương 3 từ số 2, trừ số 8).
- Bản nhạc: K. 525 trên Mutopia (Breitkopf & Härtel 1883): trio ghi hóa biểu Rê trưởng. IMSLP: tên chương của Hob. I:94 (Minuet. Allegro molto), K. 550 (Menuetto).

### Overture

- Wikipedia: Overture (mở đầu opera, ballet, oratorio; overture Pháp từ Lully; overture Ý nhanh – chậm – nhanh; concert overture từ đầu thời Lãng mạn), French overture (chậm với tiết tấu chấm, nhanh kiểu fugue, đoạn cuối thường gợi lại phần chậm; tổ khúc dàn nhạc của Bach, opera và oratorio của Handel), Italian overture và Symphony (overture Ý là tiền thân trực tiếp của giao hưởng; giao hưởng bốn chương thành lệ trong thế kỷ 18).
- Wikipedia tiếng Đức, Ouvertüre: chơi khi màn còn đóng; overture Pháp chậm – nhanh – chậm; concert overture thường là chương sonata nhanh có mở đầu chậm, nhiều khi có nội dung chương trình.
- Wikipedia: The Hebrides (hang Fingal, đảo Staffa), Overtures by Hector Berlioz (*Le carnaval romain* dựng từ *Benvenuto Cellini*, có nhạc cảnh lễ hội), Romeo and Juliet (Tchaikovsky) (chủ đề xung đột có tiếng chũm chọe tả đấu kiếm, chủ đề tình yêu), Don Giovanni.
- *1812*: Wikipedia (kỷ niệm năm 1812; thánh ca Chính thống giáo, *La Marseillaise* đối đầu nhạc dân gian Nga, *God Save the Tsar!* với đại bác và chuông; buổi diễn ngoài trời dùng đại bác thật) và Tchaikovsky Research, trang "The Year 1812" (nguồn gốc từng giai điệu được trích và vị trí của chúng).

### Scherzo

- Wikipedia, Scherzo: nghĩa "trò đùa", nhanh hơn nhiều, một phách mỗi ô, Beethoven và Schubert dùng rộng rãi; Mendelssohn, Chopin.
- Wikipedia, giao hưởng của Beethoven: số 1 (Menuetto nhưng thực chất là scherzo), số 2 (scherzo đầu tiên), số 5 (cello và contrabass mở đầu, trio Đô trưởng viết đối âm, scherzo trở lại pizzicato rất nhỏ, đoạn chuyển trên timpani, vào thẳng chương cuối), số 9 (scherzo ở chương 2; trio thoáng trở lại rồi coda ngắn khép lại).
- IMSLP: tên chương, năm sáng tác và buổi diễn đầu của các giao hưởng số 1 (1799–1800, diễn 2/4/1800), số 2 (1800–1802), số 5 (Scherzo Đô thứ, Trio Đô trưởng), số 9 (Scherzo là chương 2).
- Wikipedia: Symphony No. 6 (Mahler) (scherzo ở chương 2 trong số 1, số 4, bản đầu của số 6; đổi thứ tự hai chương giữa), Scherzos (Chopin), Scherzo No. 2 (Chopin), A Midsummer Night's Dream (Mendelssohn).

### Symphonic poem

- Wikipedia, Symphonic poem: định nghĩa; *Tondichtung* từ Loewe (1828); Liszt và 13 tác phẩm; Strauss, Sibelius thích "tone poem"; biến hình chủ đề; Smetana gắn chủ đề với nhân vật như Berlioz; *Má vlast* sáu bài.
- Wikipedia, Les Préludes (diễn lần đầu 23/2/1854, tác phẩm cho dàn nhạc sớm nhất mang tên thơ giao hưởng; mọi chủ đề từ một tế bào ba nốt, tiếp nối *idée fixe* của Berlioz; lời tựa về đời người) và ghi chú chương trình của Boston Symphony Orchestra (Burk, Ledbetter): thơ giao hưởng được ưa chuộng nhất của Liszt.
- *Moldau*: Wikipedia Má vlast (lời Smetana tả bảy cảnh) và Wikipedia tiếng Đức Die Moldau (tiêu đề trong tổng phổ và nhạc cụ từng cảnh: sáo, clarinet, violin, kèn horn, polka, cảnh dưới trăng, thác là chỗ to nhất).
- Wikipedia: Don Juan (Strauss), Till Eulenspiegel (hai chủ đề: kèn horn, clarinet Rê), La mer (*trois esquisses symphoniques*), Finlandia, Program music.

### Bài 28: Kết cấu

- Open Music Theory, "Texture" (Brady, Hamm): bốn loại kết cấu, hai kiểu chủ điệu, phức điệu gắn với fugue và canon; "High Baroque Fugal Exposition" (Gotham): fugue mở đầu bằng một bè.
- Wikipedia: Texture (độ dày, âm vực; Gregorian đơn âm), Monophony (cách nhau quãng 8 vẫn là đơn âm), Homophony (bè Alberti; Chopin), Alberti bass, Polyphony, Heterophony (gamelan, nhạc Ả Rập; hiếm ở phương Tây trước thế kỷ 20), Syrinx (sáo độc tấu).
- Nguyễn Thanh Thủy, Stefan Östersjö, "Claiming Space…", *Intersections* 41/1 (2021), tóm tắt trên Érudit: đờn ca tài tử là dị âm trang trí.

### Bài 29: Chuỗi hòa âm

- Open Music Theory: "Diatonic Sequences in Middles" (Peterson): định nghĩa, quãng 5 đi xuống, quãng 3 đi xuống (Pachelbel), 5–6 đi lên; "Chromatic Sequences" (Hughes): chuỗi nửa cung, ví dụ Chopin, dùng suốt thế kỷ 19; "ii–V–I" (Lavengood): chuỗi ii–V–I trong jazz.
- Wikipedia: Sequence (music) (Baroque, Vivaldi; bè trầm Đô – Fa – Si – Mi…; quãng 3 đi xuống; Pachelbel xuống 4 lên 2; 5–6 đi lên), Pachelbel's Canon (theo mẫu Romanesca), Messiah Part II (đoạn "King of Kings" đẩy lên cao dần).
- Bản nhạc trên Mutopia, tôi tự đối chiếu: BWV 847 (Breitkopf & Härtel 1866): ô 6–11 là chuỗi quãng 5 đi xuống, D7/C – Sol thứ/Si♭ – C7/Si♭ – Fa thứ/La♭ – B♭7/La♭ – Mi♭/Sol, mẫu hai ô hạ dần từng bậc; *Hallelujah*: soprano ngân Rê, Mi, Fa♯, Sol trên "King of Kings"; *La primavera*: độc tấu ở chương 1 (cặp nốt lặp đi lên từng bậc) và chương 3 (hình ba nốt đi xuống lặp ở nhiều cao độ).

### Bài 30: Phát triển môtip

- Open Music Theory (Peterson): "Foundational Concepts" (môtip; Beethoven số 5; các phép biến đổi), "The Phrase, Archetypes, and Unique Forms" (câu: trình bày và tiếp nối; đoạn nhạc: vế trước kết nửa, vế sau kết trọn), "Expansion and Contraction" (kéo dài, làm lại sau kết bị né, codetta).
- Wikipedia: Motif (đơn vị nhỏ nhất mang bản sắc chủ đề), Sentence (câu của Schoenberg), Piano Sonata No. 1 (Beethoven) (Schoenberg dùng mở đầu này làm ví dụ câu; kết nửa ở ô 8).
- Bản nhạc trên Mutopia (Breitkopf & Härtel 1862–1865), tôi tự đối chiếu: Giao hưởng số 5, chương 1, violin I: ô 1–5 là Sol Sol Sol Mi♭ rồi Fa Fa Fa Rê; phần phát triển: bè violin I và bè oboe thay nhau giữ hợp âm, từng hai ô rồi từng ô một. Sonata Op. 2 số 1: ô 1–2 hợp âm rải Fa thứ, ô 3–4 trên hợp âm Đô (át), ô 5–6 mảnh một ô, kết nửa ở ô 8.

### Bài 31: Hình thức nhỏ

- Open Music Theory (Jarvis): "Binary Form" (hai đoạn nhắc lại, nhạc nhảy, kết chuẩn kể cả kết nửa, hai đoạn có tái hiện, đoạn hai kết trọn ở giọng chính), "Ternary Form" (A B A, ba đoạn kép, Mazurka Op. 17 số 4), "Sonata Form" (sonata là dạng phức tạp của hai đoạn có tái hiện); Open Music Theory bản 1, "Minuet Form".
- Robert Hutchinson, *Music Theory for the 21st-Century Classroom*, "Ternary Form": nocturne và các tiểu phẩm Lãng mạn; minuet và trio, aria da capo.
- Wikipedia: Binary form (sang giọng át; ở giọng thứ sang giọng trưởng song song; có thể kết trọn ở giọng chính; phân biệt với ba đoạn), Ternary form ("Giọt mưa"; minuet chơi lại không nhắc lại), Da capo aria, Sarabande, Strophic form (*Heidenröslein*), Through-composed music (*Erlkönig*).
- Yung-Ching Yu, luận án University of Kentucky (2021): ca khúc theo khổ có biến đổi của Brahms.
- Bản nhạc trên Mutopia, tôi tự đối chiếu: BWV Anh. 114 (đoạn A kết trọn ở Sol trưởng, đoạn B sang Rê trưởng), Anh. 115 (đoạn A kết ở Si♭ trưởng), Anh. 126 (đoạn A kết ở Rê với dấu ngân, đoạn B kết ở La trưởng), *La candeur* (đoạn A dừng trên hợp âm Sol), BWV 1007 (mọi điệu nhảy có hai đoạn nhắc lại).

### Bài 32: Kỹ thuật thế kỷ 20

- Open Music Theory: "Collections" (hai gam toàn cung, ba gam bát cung; Messiaen điệu thức số 2), "Basics of Twelve-Tone Theory" (dãy, P/I/R/RI, 48 dạng), "Graphic Notation and Scores" (ngẫu nhiên bằng tung đồng xu; Cage, *4′33″*).
- Wikipedia: Whole-tone scale (*Voiles*), Octatonic scale, Quartal and quintal harmony, Polytonality, The Rite of Spring (hợp âm Mi♭7 trên Fa♭ trưởng), Twelve-tone technique (1921, 1923; 48 dạng), Violin Concerto (Berg) (1935; các hợp âm ba trong dãy, bốn nốt cuối toàn cung), Minimal music, Piano Phase (1967), Aleatoric music, 4′33″ (1952).
- IRCAM, cơ sở dữ liệu BRAHMS: Schoenberg (kỹ thuật chuỗi từ 1923), Violinkonzert của Berg (1935), *Piano Phase* (1967).
- BBC Music Magazine (2024): buổi diễn đầu tiên của *4′33″* (David Tudor, 29/8/1952, Woodstock).

## Chỗ đã sửa nội dung

1. **`minuet-trio.md`, bảng Cấu trúc, dòng Trio:** "thường chuyển giọng (giọng át, giọng song song)" thành "(giọng át, giọng cùng tên)". Theo cách gọi của site (bài 07), "giọng song song" là giọng relative; nguồn lại nói trio thường giữ chủ âm và đổi trưởng – thứ, tức giọng cùng tên: Open Music Theory bản 1, "Minuet Form" (tương phản về giọng là nét chính của trio, nhưng trio thường chỉ đổi trưởng – thứ: khi giữ nguyên chủ âm, minuet giọng trưởng đi với trio ghi *minore*); Wikipedia, Ternary form (đoạn B "usually a perfect fifth above or the parallel minor of the home key"). Ví dụ trên chính trang: Mozart số 40, minuet Sol thứ, trio Sol trưởng. Câu cũ có lẽ dịch "parallel key" thành "giọng song song".
2. **`minuet-trio.md`, mục Từ minuet đến scherzo:** "nhanh gấp đôi" thành "nhanh hơn nhiều". Không nguồn nào nêu tỉ lệ gấp đôi; Wikipedia, Scherzo: "considerably quicker". Bài 31 và trang Scherzo cũng đã viết "nhanh hơn nhiều", "rất nhanh".
3. **`31-hinh-thuc-nho.md`:** Musette Rê trưởng bỏ khỏi danh sách ví dụ hình thức hai đoạn, thêm vào ví dụ ba đoạn: "đoạn A và đoạn B đều có dấu nhắc lại như hình thức hai đoạn, nhưng đoạn B kết ở giọng át (La trưởng), nên đoạn A được chơi lại từ đầu (*da capo*): A B A". Lý do: trang tự định nghĩa đoạn B của hình thức hai đoạn phải về giọng chính; bản Bach-Gesellschaft trên Mutopia cho thấy đoạn B kết ở La trưởng và ô 8 có dấu ngân để kết sau khi chơi lại; trang bài học `musette-re.md` cũng ghi A · B · A.

## Chỗ chưa chắc (không sửa)

- **Bài 28:** "nhã nhạc" trong ví dụ dị âm. Không tìm được nguồn mở nói nhã nhạc là dị âm: trang UNESCO về Nhã nhạc, Wikipedia (Nhã nhạc, Music of Vietnam) không nhắc tới; bài trên *Intersections* chỉ nói về đờn ca tài tử.
- **Bài 29:**
    - Dòng "Quãng 3 đi xuống", cột "Gặp ở: Ballad, nhạc pop": chưa có nguồn.
    - Dòng "Chuỗi nửa cung": nguồn xác nhận Chopin và thế kỷ 19, chưa có nguồn cho Wagner, Liszt.
    - "dạng 'nhảy' của mẫu Romanesca": Wikipedia chỉ nói vòng Pachelbel theo mẫu Romanesca; chi tiết "dạng nhảy" lấy từ sách của Gjerdingen (đã dẫn ở trang `piano/hoa-am/mau-galant.md`), tôi không kiểm được sách.
- **Bài 30:** "Trong chương 1 Giao hưởng số 5, Beethoven dùng gần như tất cả các kỹ thuật này". Nguồn chỉ xác nhận phần lớn chủ đề phát triển từ môtip bốn nốt và phần phát triển dùng chia nhỏ; tôi không thấy chỗ nào dùng phép ngược. Nếu muốn chắc, có thể viết "nhiều kỹ thuật này".
- **Bài 31:** dòng "Theo khổ có biến đổi": "(thường là khổ cuối hoặc khổ buồn)" và tên Schubert chưa có nguồn (Brahms có: luận án của Yu).
- **Overture:**
    - *1812*, bước 2: "Thân chính (gần như sonata): Marseillaise (chủ đề 1, phe Pháp) đối đầu nhạc Nga (chủ đề 2)". Không nguồn nào gọi các giai điệu này là chủ đề 1 và 2 của hình thức sonata. Tchaikovsky Research cho thấy giai điệu trữ tình (ô 164 và 278) và bài dân ca (ô 207 và 299) đều xuất hiện hai lần, hợp với bố cục kiểu sonata, nhưng không nói thẳng. Cũng theo trang này, chữ "đại bác" trong tổng phổ thật ra chỉ một trống lớn của nhà hát; câu "có đại bác thật, ở buổi diễn ngoài trời" của trang vẫn đúng.
    - *Hebrides*, "sóng vỗ mở đầu nổi tiếng": Wikipedia gắn chủ đề mở đầu với hang Fingal, chủ đề thứ hai với sóng biển. Nghe phần mở đầu như sóng là cách nghe phổ biến, không sai rõ ràng.
- **Scherzo:** Giao hưởng số 5, "kèn horn đáp lại": theo Wikipedia, bộ gỗ đáp chủ đề mở đầu trước, rồi kèn horn mới vang chủ đề chính. Cách viết hiện tại là rút gọn.
- **Minuet và Trio:** "Beethoven thấy minuet quá 'lịch sự'": nguồn nói Beethoven biến nhịp điệu lịch sự của minuet thành điệu nhảy dữ dội hơn; gán ý nghĩ cho Beethoven là cách kể.
- **Chi tiết chỉ có Wikipedia làm nguồn** (không tìm được nguồn thứ hai mở được): cảm hứng của *Hebrides*, chủ đề của *Romeo and Juliet*, *Le carnaval romain*; Don Juan, Till Eulenspiegel, *La mer*, *Finlandia*; thứ tự chương của Mahler; năm sáng tác các scherzo của Chopin; các truyền thống dị âm ngoài Việt Nam; các nhà soạn nhạc gắn với gam bát cung, hợp âm quãng 4 (Hindemith), hợp âm trong *Le Sacre*. Hai trang Overture và Symphonic poem dựa chủ yếu vào Wikipedia (tiếng Anh và tiếng Đức), thêm Tchaikovsky Research và ghi chú của Boston Symphony Orchestra.

## Cách kiểm chứng và giới hạn

- Mạng: User-Agent `OpusZeroBot/1.0 (https://github.com/mtuann/opus-zero)`; Wikimedia và IMSLP qua `tools/audio/net.py` (nghỉ 2,5 giây, tính chung cho mọi tiến trình). Riêng Pressbooks (nơi đặt Open Music Theory) trả 403 với UA này, nên với máy chủ nào trả 403 thì thử lại bằng `Mozilla/5.0 (compatible; OpusZeroBot/1.0; +https://github.com/mtuann/opus-zero)`, vẫn có tên bot và link repo.
- Trang "The Year 1812" của Tchaikovsky Research lúc trả 200, lúc trả 500 (lỗi phía máy chủ, gặp cả ở các trang khác của site này); link đúng, đã mở và đọc được.
- Bản nhạc Mutopia đọc từ file LilyPond trên GitHub (`gh api` để liệt kê thư mục, `raw.githubusercontent.com` để tải); trang mô tả từng bản (`piece-info.cgi?id=…`) là link được ghi trên site.
- Không dùng được: Britannica, Yale Open Courses, Universal Edition, MoMA (403, cả với công cụ tải trang); trang tác phẩm của John Cage Trust (404); trang UNESCO về Nhã nhạc chỉ đọc được qua công cụ tải trang và không nói gì về dị âm. Không ghi các nguồn này.
- Không ghi sách in nào (Caplin, Kostka – Payne, Aldwell – Schachter…) vì không kiểm được đúng nội dung qua bản xem trước hay mục lục.
- Ngoài phạm vi, để chủ site cân nhắc: mục Nguồn của các trang Hình thức khác (sonata, fugue, rondo, biến tấu, concerto, mục lục) và các bài nhạc lý 10–27 vẫn là hai dòng chung (Open Music Theory, IMSLP hoặc musictheory.net), chưa chỉ ra nguồn cho từng điều cụ thể.
