# G6: khảo sát bài học tác phẩm mới (lô A, B, C)

Khảo sát ngày 22–23/10/2026 cho G6 trong `plans/ke-hoach-v15.md`. G6 hoãn sang v16 (bạn quyết ngày 22/10/2026). Đây là kết quả khảo sát của một agent, chưa phải quyết định: chưa trang nào được viết, không file nào trong repo bị sửa. Lô D (bài Việt Nam) không thuộc phạm vi. Trước khi viết bài ở v16, cần:

- đọc lại trang mô tả của từng bản thu, vì giấy phép có thể đã đổi;
- nghe các bản thu IMSLP chỉ dẫn link (chưa ai nghe);
- xác nhận ấn bản đã hết bảo hộ trước khi chép trích đoạn (mục "Rủi ro và việc cần quyết");
- quyết định cách xử lý các chỗ lệch giữa site và danh sách thi (mục "Ghi chú ngoài phạm vi").

Cách làm và quy ước:

- **Bản quyền.** Việt Nam: tác giả mất từ năm 1975 trở về trước. Mỹ: tác phẩm xuất bản từ năm 1930 trở về trước, và phải đúng ấn bản. Bản thu ở Mỹ: xuất bản 1923–1946 thì bảo hộ 100 năm, 1947–1956 thì 110 năm.
- **Cấp độ.** Đọc thẳng các văn bản giáo trình ABRSM 2011–2028, danh sách ARSM 2017 và danh sách Trinity từ 2023 (bản cập nhật 8/2026); link ở mục Nguồn. Bài không có trong các danh sách này thì ước lượng theo [pianosyllabus.com](https://pianosyllabus.com), một cơ sở dữ liệu tổng hợp nhiều hội đồng thi nhưng không ghi năm giáo trình. Mức Henle chỉ ghi khi đã đọc trên trang henle.de của đúng ấn bản. Chặng suy từ Grade theo bảng của site: chặng 2 là Grade 1–2, chặng 3 là Grade 3, chặng 4 là Grade 4–5, chặng 5 là Grade 6, chặng 6 là Grade 7–8, chặng 7 là sau Grade 8.
- **Bản thu.** Mọi bản thu Commons đã đọc trang mô tả bằng `commons.py --fresh page`. Bản thu IMSLP đọc qua API (wikitext và HTML của trang tác phẩm), không tải file. Chỉ nhận phạm vi công cộng, CC0, CC BY, CC BY-SA 2.0–4.0; không nhận NC, ND, nhạc dựng từ MIDI.
- **"Chưa kiểm được"** nghĩa là chưa kiểm được thật, không có nghĩa là "không có". Musopen (403), Kickstarter (403) và piano-midi.de (418) chặn truy cập tự động, nên mọi điều về bản thu Musopen chỉ biết qua các file đã đưa lên Commons hoặc IMSLP.

## Tóm tắt đề xuất

| Lô | Bài đề xuất | Chặng | Bản thu | Nguồn đối chiếu trích đoạn |
|---|---|---|---|---|
| A | Bartók: *For Children* Sz. 42, bản gốc 1909, tập I số 1 và số 6 | 2 | Mississippi College Piano Pedagogy, CC BY-SA 4.0, IMSLP (chỉ dẫn link) | Không có bản số mở; chép tay từ bản quét Rozsnyai |
| A | Gretchaninov: *Grandfather's Album* Op. 119 (Schott 1929), 2–3 bài (thay Op. 98) | 3 | Jörg Römgens, CC BY-SA 4.0, IMSLP (chỉ dẫn link) | Không có bản số mở; chép tay từ bản quét Schott |
| A | Bartók: *Romanian Folk Dances* Sz. 56, bản in UE 1918 (thay *The Little Shepherd*) | 5 | Chris Breemer, CC0, IMSLP (chỉ dẫn link) | Mutopia chỉ có điệu số 2 |
| B | Chaminade: *Pierrette (Air de ballet)* Op. 41 | 6 | Luis Kolodin, CC BY-SA 4.0, IMSLP (chỉ dẫn link) | Không có bản số mở |
| B | Clara Schumann: Scherzo số 2 Đô thứ Op. 14 | 6 | Luis Kolodin, CC BY-SA 4.0, IMSLP (chỉ dẫn link) | Không có bản số mở |
| B | Fanny Hensel: *Mélodie* Op. 4 số 2. **Chưa đạt tiêu chí 2** (chưa có bản thu được nhận) | 6 | Thay tạm: Backer Grøndahl, *Klage* Op. 36 số 1 (Commons, Tjako van Schie, CC BY-SA 4.0), hoặc Chaminade, *Automne* (chặng 7) | Hensel: bản số WIMA (NC, chỉ dùng trên máy) |
| C | Mozart: *Alla turca*, chương 3 Sonata K. 331 | 6 | Romuald Greiss, PD-author, Commons (phát được) | Mutopia (PD), kern, ASAP, DCML |
| C | Debussy: Arabesque số 1 | 6 | Patrizia Prati, CC BY-SA 4.0, Commons (phát được) | Mutopia theo Durand 1904 (PD), DCML |
| C | Rachmaninoff: Prelude Đô♯ thứ Op. 3 số 2 | 7 | Chính tác giả, Edison, thu 1919, phát hành 12/1920, PD ở Mỹ, Commons (phát được) | Mutopia (CC BY-SA 4.0, theo Bosworth 1896 / UE 1910) |

**Phân bố chặng nếu nhận đủ các đề xuất trên** (hiện có 34 bài):

| Chặng | Hiện có | Thêm | Sau khi thêm |
|---|---|---|---|
| 2 | 7 | *For Children* | 8 |
| 3 | 6 | Op. 119 | 7 |
| 4 | 7 | | 7 |
| 5 | 6 | *Romanian Folk Dances* | 7 |
| 6 | 5 | *Pierrette*, Scherzo Op. 14, *Alla turca*, Arabesque số 1 (thêm Hensel nếu có bản thu) | 9 (10) |
| 7 | 3 | Rachmaninoff (thêm *Automne* nếu chọn) | 4 (5) |

Chặng 6 thành chặng đông nhất. Lý do là ở lô B, chỉ các bài khó của nhà soạn nhạc nữ mới có bản thu được nhận. Các bài dạy ở Grade 2–6 đều có trong danh sách thi nhưng không có bản thu mở, như *Album des enfants* của Chaminade, Op. 103 của Mel Bonis, Op. 50 của Farrenc. Muốn lấp chặng 3–5 bằng nhà soạn nhạc nữ thì phải tìm bản thu trước, ví dụ chủ site tự tra Musopen.

## Lô A: thế kỷ 20, chặng 2–5

### Bảng ứng viên

| Ứng viên | Bản quyền VN / Mỹ | Ấn bản hết bảo hộ nên dùng | Grade và chặng | Nguồn Mutopia và nguồn khác | Bản thu tốt nhất | Ghi chú |
|---|---|---|---|---|---|---|
| **Bartók (1881–1945): *For Children* (*Gyermekeknek*) Sz. 42 (BB 53), tập I số 1 và số 6** | VN: hết. Mỹ: bản gốc in 1909–1911, hết. **Bản sửa** (sửa 1943, Boosey & Hawkes New York ©1946, London 1947) còn bảo hộ ở Mỹ: không dùng. **Đạt** | Rozsnyai, Budapest, 4 tập, số bản in R.K. 376 [377, 634, 728]: tập I–II (dân ca Hungary) 1909, tập III–IV (Slovakia) 1911 (IMSLP; Henle ghi chung 1909–1911). Bản quét IMSLP #893790 (Sibley) | Số 1: ABRSM Grade 1 (2015–2016), Trinity Grade 2 (từ 2023). Henle HN 1225: số 1 mức 1, số 6 mức 2. **Chặng 2** | Mutopia: không có. DCML, KernScores, OpenScore: không thấy. Phải chép tay (bài rất ngắn) | Mississippi College Piano Pedagogy (MCPP), CC BY-SA 4.0, IMSLP, đăng 5/5/2017: số 1 [#469932](https://imslp.org/wiki/Special:ImagefromIndex/469932) (0:30), số 6 [#469925](https://imslp.org/wiki/Special:ImagefromIndex/469925) (0:45) | Hai bài duy nhất của tập có bản thu được nhận. Số 1 và 6 ở hai bản cùng số thứ tự, cùng chỉ dẫn tốc độ, không thuộc 11 bài Bartók chép lại khi sửa. Bản in đầu không có tên bài, không có hóa biểu, không có số máy đếm nhịp (trừ số 30). Chưa biết MCPP chơi theo bản nào. Kỹ năng: giai điệu dân ca trong thế tay hẹp, phát âm chính xác (số 1); tay trái giữ giai điệu, điệu thức Rê Dorian (số 6) |
| Debussy (1862–1918): *Children's Corner* L. 113 (CD 119), *The Little Shepherd* (số 5) | VN, Mỹ: hết (Durand 1908) | Durand & Fils, Paris, 1908, D. & F. 7188 | ABRSM Grade 7, danh sách B (2023–2024, 2025–2026, 2027–2028); Henle HN 382: mức 4, kèm nhãn ABRSM Grade 7. **Chặng 6**, không phải 5 như site đang ghi | Mutopia: không có. DCML `debussy_childrens_corner` (CC BY-NC-SA 4.0, chỉ dùng trên máy) | **Không có bản thu được nhận.** File Commons của Pracchia-78 dựng bằng đàn mẫu; IMSLP: Gerluz NC-ND, Firkušný 1956 còn bảo hộ ở Mỹ, cuộn piano Debussy là bản phát lại trong CD 2004, quyền bản ghi chưa rõ | **Loại** (không đạt tiêu chí 2) |
| Gretchaninov (1864–1956): *Children's Album* Op. 98 | VN: hết (mất 3/1/1956). Mỹ: in 1924, hết | Schott, Mainz, khoảng 1924, B.S.S. 31171 (IMSLP #11414). IMSLP ghi người biên tập "J. Kilp" là tên giả để giữ bản quyền Mỹ; nếu là người thật (1888–1976) thì phần biên tập còn bảo hộ ở VN đến hết 2026: chỉ chép nốt, số ngón tự soạn | ABRSM: số 1 Grade 1 (2021–2028), số 4 Grade 2 (2021–2028), số 5 Grade 3 (2021–2022). Chặng 2–3 | Không có | Bản MCPP số 1 và số 4 là **CC BY-NC-SA 4.0: không nhận**. Commons "О.Гречанінов "Танець".ogg" (Edgar Bondarenko, CC BY-SA 4.0, 44 s): chưa xác định là bài nào | Loại, trừ khi xác minh được file Commons là Op. 98 số 10 |
| **Gretchaninov: *Grandfather's Album* (*Das Großvaterbuch*) Op. 119** | VN: hết. Mỹ: in 1929, hết từ 1/1/2025. **Đạt** | Schott, Mainz, không ghi năm (khoảng 1929), số bản in 32355. IMSLP: năm 1929 được xác nhận qua số bản in và thư mục Đại học Sydney. Bản quét #269926, #270502 (có bìa), #272596 | Không có trong ABRSM 2011–2028 và Trinity từ 2023. pianosyllabus: số 1 AMEB 3; số 2, 4 RCM 4; "Nurse's Tale" Trinity 3; số 16 LCM 3. Ước **Grade 3, chặng 3** | Không có | Jörg Römgens, CC BY-SA 4.0, IMSLP, đăng 28/3/2018: số 1–13, [#517116](https://imslp.org/wiki/Special:ImagefromIndex/517116)–#517128 (0:46–1:47 mỗi bài). Bản MCPP số 2, 4, 15, 16: NC, không nhận | Thay Op. 98. IMSLP gắn nhãn còn bảo hộ ở EU (đến hết 2026), không ảnh hưởng VN và Mỹ. Chưa nghe kiểm bản thu. Kỹ năng: giai điệu hát trên đệm hợp âm, tính cách từng bài (giống bài học Schumann Op. 68) |
| Gretchaninov: *Glass Beads* Op. 123 | VN: hết. Mỹ: IMSLP ghi in lần đầu 1930 (dẫn Hofmeister 1930), nếu đúng thì hết từ 1/1/2026 | Chưa xác định được bản in đầu (IMSLP chỉ có bản Muzgiz 1959) | ABRSM: *Sad Song* Grade 3 (2011–2012); số 10 *In the Fields* Grade 4 (2019–2020) | Không có | Không có | Loại |
| **Bartók: *Romanian Folk Dances* Sz. 56 (BB 68)** | VN: hết. Mỹ: bản in đầu UE 1918 hết; **bản sửa UE 1934** (cùng số bản in) có thể còn bảo hộ đến hết 2029: không dùng. **Đạt**, nếu dùng đúng bản in trước 1934 | Universal Edition, Wien/Leipzig, U.E. 5802, phát hành 7/1918; in lại không đổi 1921, 1922, 1926 (Henle). Bản quét IMSLP #918136 (1200 dpi), #918139 (600 dpi): **phải kiểm** là bản in trước 1934 (không có thời lượng, không có "(1915)" sau ô cuối, số 4 tên *Tanz der Butschumer*) | Từng điệu: số 3 ABRSM Grade 4 (2015–2016), số 4 Trinity Grade 5 (ô 1–18, từ 2023). Henle HN 1402: 3, 2, 3, 3, 4, 4. Cả bộ: pianosyllabus ghi ở mức diploma (AMEB AMusA, RCM 10), từng điệu PS 3–6. Site đã xếp **chặng 5**: giữ, ước Grade 6 cho cả bộ | Mutopia: chỉ điệu số 2 *Brâul* (thư mục tên `rom_folk_dance_1_bartok` nhưng file là số 2; PD; nguồn UE 1918; Mutopia-2017/01/11-2162). Không có nguồn mở cho năm điệu còn lại | Chris Breemer, CC0 1.0, IMSLP [#991622](https://imslp.org/wiki/Special:ImagefromIndex/991622), đăng 17/9/2025, trọn sáu điệu, 5:22 | Thay *The Little Shepherd*. Kỹ năng: sáu điệu tương phản về nhịp, điệu thức, tiết tấu; giai điệu trên đệm hợp âm nhịp nhảy; tốc độ tăng dần ở hai điệu cuối. File Commons "Bartok - Romanian Folk Dances.ogg" là bản dàn nhạc (điệu 2, 5, 6): không dùng |
| Granados (1867–1916): *Cuentos de la juventud* Op. 1 | VN, Mỹ: hết (in 1910 theo IMSLP và AllMusic) | IMSLP #567312: Viuda de J. M. Llobet, Barcelona, không ghi năm [1914], J.M.LL. 36. Nhà xuất bản lần đầu: chưa kiểm được | ABRSM: số 1 *Dedicatoria* Grade 4 (2021–2028), số 9 *La huérfana* Grade 5 (2021–2028). Chặng 4 | Mutopia: không có | Chris Breemer, CC0, IMSLP [#937398](https://imslp.org/wiki/Special:ImagefromIndex/937398), một file 18:36 cho cả 10 bài | Thay thế 1. Phong cách gần Lãng mạn hơn thế kỷ 20. Chặng 4 đã có 7 bài |
| Bartók: Sonatina Sz. 55 (BB 69) | VN: hết. Mỹ: bản in đầu 1919 hết; bản sửa (không ghi năm, đầu thập niên 1930 theo Henle) có thể còn bảo hộ | Bản in đầu Rózsavölgyi, R. és Tsa **3929**, ©1919. **Mọi bản quét trên IMSLP mang số 3953**, tức bản sửa | ABRSM: chương 1 Grade 7 (2021–2028). Henle HN 1401: mức 4, nhãn ABRSM Grade 7. Chặng 6 | Không có | Commons [Bartok - Sonatina.ogg](https://commons.wikimedia.org/wiki/File:Bartok_-_Sonatina.ogg): La Pianista, thu 2009, 220,6 s, bản thu CC BY-SA 3.0 + GFDL, **phát được** | Thay thế 2. `commons.py info` báo nhầm "Public domain" (đọc mẫu `{{PD-old-auto-1923}}` của phần sáng tác): khi ghi khối bản thu phải sửa tay thành CC BY-SA 3.0 |
| Debussy: *Golliwogg's Cakewalk* (*Children's Corner* số 6) | VN, Mỹ: hết | Durand 1908 | Henle HN 382: mức 6; pianosyllabus PS 8. Chặng 6 | DCML (CC BY-NC-SA 4.0) | Commons eldüendesüarez, CC BY 4.0, 160,5 s, **phát được**; IMSLP Stefano Ligoratti, CC BY 4.0, #319772 (2:59) | Thay thế 3: giữ được *Children's Corner* trong lô, nhưng ở chặng 6 |
| Bartók: *Ten Easy Pieces* Sz. 39 | Hết bảo hộ (Rozsnyai 1909, R.K. 293) | Rozsnyai 1909 | Số 5 *Evening in the Village* ABRSM Grade 5 (2015–2016) | Không có | Chỉ số 3 (MCPP, CC BY-SA 4.0, #469929, 0:46) | Không đủ bản thu |

Xét sơ bộ, loại: Ibert, *Histoires* (Leduc 1922; *Le petit âne blanc* ABRSM Grade 7 năm 2021–2022; không có bản thu trên Commons, IMSLP chưa kiểm được); Poulenc, *Mouvements perpétuels* (Chester 1919; số 1 Trinity Grade 7; DCML có bản số NC; không có bản thu trên Commons); Satie, *Menus propos enfantins* và *Enfantillages pittoresques* (Demets 1913; cấp Initial, tức chặng 1); Maykapar (năm in Op. 8 chưa rõ, Op. 28 bị IMSLP gắn nhãn còn bảo hộ ở Mỹ theo URAA; không có bản thu); Joplin (bản thu Commons của *The Entertainer* là nhạc dựng hoặc đàn phím điện tử; *Solace*, *Bethena* chưa kiểm thêm).

### Đề xuất 3 bài

1. **Bartók: *For Children*, bản gốc 1909, tập I số 1 và số 6 (chặng 2).** Bài cơ bản nhất của piano thế kỷ 20, dạy điệu thức dân gian ngay từ chặng 2, có trong danh sách ABRSM và Trinity. Đây là hai bài duy nhất của tập có bản thu được nhận, và cũng là hai bài ít bị sửa nhất ở bản 1945. Nhược điểm: chặng 2 đã có 7 bài; hai bài rất ngắn (75 giây tổng cộng) nên bảng "Theo dõi khi nghe" chỉ đủ 5–6 dòng; phải chép tay và đối chiếu với bản quét Rozsnyai.
2. **Gretchaninov: *Grandfather's Album* Op. 119, 2–3 bài (chặng 3), thay cho Op. 98.** Op. 98 trong kế hoạch có bài trong danh sách ABRSM nhưng không có bản thu được nhận. Op. 119 cùng tác giả, cùng loại bài, hết bảo hộ ở cả hai nơi, có bản thu CC BY-SA cho 13/17 bài, và lấp chặng 3 (6 bài). Gợi ý chọn số 1 (*Meine liebe Mutti!*, Fa trưởng, AMEB 3), số 4 (*Auf der Wiese*, Đô♯ thứ, RCM 4) và số 7 (*Traurige Geschichte*, Mi thứ); chốt sau khi xem bản nhạc.
3. **Bartók: *Romanian Folk Dances* (chặng 5), thay cho *The Little Shepherd*.** *The Little Shepherd* không có bản thu được nhận, và ABRSM xếp Grade 7 (chặng 6). *Romanian Folk Dances* đã nằm ở chặng 5 trong danh mục của site, chặng 5 mới có 6 bài; có bản thu CC0 trọn bộ. Rủi ro: phải xác minh bản quét là bản in trước 1934; không có bản số cho năm điệu, nên mốc đo tay (mỗi điệu bắt đầu sau một quãng nghỉ, dễ đo).

**Thay thế, theo thứ tự:** Granados *Cuentos de la juventud* Op. 1 (chặng 4; nếu không muốn hai bài Bartók trong một lô); Bartók Sonatina (chặng 6; bản thu Commons phát được, nhưng phải tìm bản in 1919, số 3929); Debussy *Golliwogg's Cakewalk* (chặng 6; giữ *Children's Corner*, bản thu Commons phát được).

### Ghi chú: *For Children*, đánh số bản gốc và bản sửa

Theo lời tựa và phần bình chú của László Vikárius trong Henle HN 1225 và HN 1226 (2017), dựa trên Tổng tập phê bình Bartók, tập 37 (2016):

- Bản gốc: 85 bài trong 4 tập (Hungary: 42 bài, tập I–II; Slovakia: 43 bài, tập III–IV). Tựa đề tập I–II: *Gyermekeknek. Apró darabok kezdő zongorázóknak (oktávfogás nélkül)* (bài nhỏ cho người mới học, không có quãng tám).
- Bản sửa (Boosey & Hawkes, New York ©1946, London 1947): 79 bài trong 2 tập; thêm tên bài, số máy đếm nhịp, thời lượng; sửa hòa âm ở nhiều bài. Bỏ sáu bài: Hungary số 25 và 29; Slovakia số 23, 27, và số 33–34 (của Emma Kodály). Mười một bài Hungary sửa nhiều đến mức Bartók chép lại tay: bản sửa số 13–14, 17–19, 26, 31–32, 34–36 (bản gốc 13–14, 17–19, 26, 33–34, 36–38).
- Ánh xạ: Hungary gốc 1–24, 26–27 giữ số; gốc 28 thành 25; gốc 30–42 thành 28–40. Slovakia gốc 1–22 giữ số; gốc 24–26 thành 23–25; gốc 28–32 thành 26–30; gốc 35–43 thành 31–39.

Các bài trong danh sách thi, đổi về số bản gốc (ABRSM và Trinity dùng số bản sửa):

| Bản sửa | Bản gốc | Cấp |
|---|---|---|
| I/1 *Children at Play* | I/1 | ABRSM Grade 1 (2015–2016); Trinity Grade 2 (từ 2023) |
| I/3 *Quasi adagio* | I/3 (bản gốc ghi *Andante*) | ABRSM Grade 1 (2011–2012, 2019–2020) |
| I/27 *Jest* | II/27 | ABRSM Grade 3 (2013–2014) |
| I/29 *Pentatonic Tune* | II/31 | ABRSM Grade 4 (2023–2024) |
| I/38 *Winter Solstice Song* | II/40 | ABRSM Grade 5 (2021–2028) |
| II/2 *Andante* | III/2 | ABRSM Grade 3 (2021–2028) |
| II/3 *Allegretto* | III/3 | ABRSM Grade 3 (2025–2026) |
| II/7 *Sorrow* | III/7 | ABRSM Grade 2 (2021–2028) |
| II/8 *Dance* | III/8 | ABRSM Grade 3 (2019–2020) |
| II/18 *Teasing Song* | III/18 | ABRSM Grade 4 (2021–2022) |
| II/31 *The Highway Robber* | IV/35 | Trinity Grade 3 (từ 2023) |

Không bài nào trong bảng thuộc nhóm chép lại, nhưng các sửa đổi nhỏ được dán đè lên bản in gốc, nên vẫn phải đối chiếu từng nốt với bản quét Rozsnyai. Bản Bartók tự chơi trên đài năm 1945 còn bảo hộ ở Mỹ.

## Lô B: nhà soạn nhạc nữ, chặng 3–6

### Bảng ứng viên

| Ứng viên | Bản quyền VN / Mỹ | Ấn bản hết bảo hộ nên dùng | Grade và chặng | Nguồn Mutopia và nguồn khác | Bản thu tốt nhất | Ghi chú |
|---|---|---|---|---|---|---|
| **Fanny Hensel (1805–1847): *Mélodie* Đô♯ thứ, Op. 4 số 2 (Allegretto; IMSLP: H. 420)** | VN, Mỹ: hết. Viết 1846, in 1847 trong *3 Mélodies* Op. 4, Schlesinger, Berlin. IMSLP dẫn Hofmeister *Monatsbericht* 1847, trang 8 ([ANNO](http://anno.onb.ac.at/cgi-content/anno-buch?apm=0&aid=1000001&bd=0001847&teil=0203&seite=00000008&zoom=1)), tức khoảng tháng 1/1847, khi bà còn sống (bà mất 14/5/1847); chưa mở trang Hofmeister để xác nhận tháng. **Đạt tiêu chí 1** | Schlesinger, Berlin, 1847, S. 3294 (bản quét IMSLP `PMLP70375-Hensel_Fanny_Six_Melodies_Schlesinger_Op_4_filter.pdf`, ghi in lại bởi Robert Lienau) | ABRSM Grade 7, danh sách B (2021–2022, 2023–2024, 2025–2026, 2027–2028); Trinity Grade 7 (từ 2023). **Chặng 6**. Henle: chưa kiểm được | Mutopia: không có. Bản dàn trang WIMA của Jürgen Knuth (PDF và file Capella) trên IMSLP, CC BY-NC-SA 3.0: chỉ dùng trên máy để đối chiếu, căn mốc | **Không có bản thu được nhận.** Commons: không có file nào của Fanny Hensel. IMSLP: chỉ MIDI (NC) và bản phối sáo–guitar dựng bằng máy (NC). Musopen: chưa kiểm được | **Chưa đạt tiêu chí 2.** Bài mạnh nhất về dạy học (có trong cả ABRSM lẫn Trinity, 8 năm liền). Viết khi có bản thu được nhận. Các bài in khi bà còn sống hoặc ngay sau khi mất đều không có bản thu: Op. 2 (Bote & Bock 1846), Op. 4 và Op. 5 (Schlesinger 1847), Op. 6 (Bote & Bock 1847), Op. 8 (Breitkopf 1850) |
| Fanny Hensel: các bài trong danh sách ABRSM khác | *Bagatelle* Fa trưởng (ABRSM Grade 6, 2025–2026) và *Andante cantabile* Rê♭ trưởng (Grade 8, 2025–2028, theo ấn bản Henle *Selected Piano Works*): năm in lần đầu chưa kiểm được; có thể chỉ có ấn bản hiện đại, nên loại | | | | | Loại |
| **Clara Schumann (1819–1896): Scherzo số 2 Đô thứ, Op. 14** | VN, Mỹ: hết. Viết và in năm 1845, Breitkopf & Härtel, Leipzig (IMSLP). **Đạt** | Bản in đầu 1845: chưa thấy bản quét. Trên IMSLP: Breitkopf & Härtel, *Pianoforte-Werke zu zwei Händen*, 1879, số bản in 15120 (`PMLP90408-CSchumann_Scherzo_No.2,_Op.14.pdf`) | Không có trong ABRSM 2011–2028, Trinity từ 2023. pianosyllabus: PS 8 (kèm một dòng "Trinity 9", không rõ là cấp nào). Ước **Grade 8, chặng 6**. Henle: Op. 14 không có trong HN 393 (*Selected Piano Works*); chưa kiểm được ấn bản Henle khác | Không có | Luis Kolodin (trang người chơi trên IMSLP; mục nhà phát hành ghi "Felipe Sarro"), CC BY-SA 4.0, IMSLP [#292506](https://imslp.org/wiki/Special:ImagefromIndex/292506), đăng 16/8/2013. Độ dài: chưa kiểm được | Tác phẩm piano duy nhất của Clara có bản thu được nhận (đã quét mọi trang tác phẩm piano của bà trên IMSLP; Commons không có). Cấp ước lượng yếu. Tên người chơi phải ghi đúng như IMSLP ("Luis Kolodin"), kèm ghi chú về "Felipe Sarro". Kỹ năng: nhịp scherzo nhanh, quãng tám và hợp âm, đoạn trio hát |
| Clara Schumann: các bài có trong danh sách thi | Op. 15 (*Quatre pièces fugitives*), Breitkopf & Härtel 1845; Op. 11 (Mechetti, Vienna 1840); Op. 21 (viết 1853, Breitkopf & Härtel; năm in chưa kiểm được); Op. 6 (Hofmeister 1836); Op. 16 (Breitkopf 1845). Đều hết bảo hộ | | Op. 15 số 4 *Scherzo* ABRSM Grade 7 (2025–2028); Op. 15 số 2 *Un poco agitato* Grade 8 (2023–2028); Op. 16 số 1 Grade 8 (2015–2016), số 2 Grade 8 (2011–2012, 2021–2022). pianosyllabus: Op. 15 số 1 *Larghetto* AMEB 7, NZMEB 7, RIAM 8. Henle HN 393: Op. 11 số 1–3 mức 5, 6, 5; Op. 21 số 1–3 mức 5, 5, 7; Op. 6 số 2 *Notturno* mức 6 | Không có | **Không có bản thu được nhận** (IMSLP và Commons) | Loại tới khi có bản thu. *Sonata Sol thứ* (ABRSM 2027–2028 Grade 7 cho chương Adagio) chỉ in lần đầu ở thế kỷ 20: loại |
| **Cécile Chaminade (1857–1944): *Pierrette (Air de ballet)* Op. 41** | VN: hết (mất 1944). Mỹ: in trước 1930 (IMSLP có bản Carl Fischer 1914), hết. **Đạt**. Năm và nhà xuất bản lần đầu: chưa kiểm được | Bản quét IMSLP: M. Bernard, St. Petersburg, không ghi năm (IMSLP đoán khoảng 1885?), `Chaminade_Pierrette_Air_de_ballet_op.41.pdf`; Carl Fischer, New York, 1914 (trong một tuyển tập tam tấu) | ABRSM Grade 8, danh sách C (2021–2022, 2023–2024, 2025–2026, 2027–2028); pianosyllabus: Trinity 8 (năm chưa rõ), SCSM 7. **Chặng 6** | Không có | Luis Kolodin, CC BY-SA 4.0, IMSLP [#848447](https://imslp.org/wiki/Special:ImagefromIndex/848447), đăng 4/4/2023. Độ dài: chưa kiểm được | Đề xuất cho Chaminade. Kỹ năng: vũ khúc ballet nhẹ, staccato và nốt lặp nhanh, chuyển giọng |
| Chaminade: *Automne*, *Études de concert* Op. 35 số 2 | VN, Mỹ: hết (Enoch, Frères & Costallat, Paris, [1886], E. F. & C. 1316) | Bản quét IMSLP `PMLP7098-Chaminade-Op35.CompleteReprint.pdf` (Enoch [1886]); Schirmer 1893, 1895 | pianosyllabus: AMEB AMusA, DipLCM (mức diploma). **Chặng 7** | Không có | Commons [eldüendesüarez](https://commons.wikimedia.org/wiki/File:Chaminade_-_Automne_(Etude_de_Concert)_Op-35_No-2_(Piano_Performance_by_eld%C3%BCendes%C3%BCarez).wav), CC BY-SA 4.0, 385,6 s, ngày 3/11/2023, **phát được** (site đã dùng một bản của người chơi này cho Musette); IMSLP Takashi Sato, CC BY 3.0, #99449 | Thay thế mạnh: lấp chặng 7, bản thu phát được. Ngoài khoảng chặng 3–6 của lô B |
| Chaminade: *Pièce romantique* Op. 9 số 1 | VN, Mỹ: hết (in 1880) | Chưa kiểm được bản quét bản in đầu | Chỉ có pianosyllabus PS 6 (không hội đồng nào). Ước Grade 6, chặng 5 (ước lượng yếu) | Không có | IMSLP Takashi Sato, CC BY 3.0, #99442 | Thay thế ở chặng 5 |
| Chaminade: bài dạy Op. 123, Op. 126 | VN, Mỹ: hết. *Album des enfants* 1ère série Op. 123: Enoch 1906, E. & C. 6402–6413; 2ème série Op. 126: Enoch 1907, E. & C. 6648–6659 | Enoch 1906, 1907 | *Gavotte* Op. 123 số 5 ABRSM Grade 5 (2025–2028); *Idylle* Op. 126 số 1 Grade 4 (2011–2012, 2023–2024); *Élégie* Op. 126 số 7 Grade 6 (2011–2012) | Không có | **Chỉ có bản dựng MIDI** (David Kemp, IMSLP) | Loại tới khi có bản thu. Đây là những bài hợp chặng 4–5 nhất |
| Agathe Backer Grøndahl (1847–1907): *Klage*, *10 Fantasistykker* Op. 36 số 1 | VN, Mỹ: hết (Brødrene Hals, Christiania, [1895], B.H.M. 838) | Brødrene Hals [1895] (IMSLP) | Chưa kiểm được (không có trong danh sách thi, không có trên pianosyllabus) | Không có | Commons [Klage-grondahl.ogg](https://commons.wikimedia.org/wiki/File:Klage-grondahl.ogg): Tjako van Schie, thu tại nhà, `{{self|cc-by-sa-4.0}}`, 81 s, **phát được** | Thay thế cho Hensel nếu muốn đủ ba nhà soạn nhạc. Bài rất ngắn; cấp phải ước lượng sau khi xem bản nhạc. Bà có trong danh sách thi ở bài khác: *Sommervise* Op. 45 số 3 (ABRSM Grade 7 năm 2017–2018, Trinity Grade 7), *Trolldans* Op. 44 số 6 (ABRSM Grade 8, 2027–2028), nhưng không có bản thu được nhận |

Các nhà soạn nhạc nữ khác có bài trong danh sách thi nhưng không tìm thấy bản thu được nhận (Commons và trang tác phẩm trên IMSLP): Mel Bonis (Op. 103, 1913: ABRSM Grade 2–3, Trinity Grade 1–2), Louise Farrenc (Op. 50, khoảng 1859–1863: ABRSM Grade 4–5, Trinity Grade 4), Amy Beach (Op. 25, 1894: bản MCPP là NC; Op. 64, 1907: không có), Lili Boulanger (*D'un vieux jardin*, Grade 8), Dora Pejačević (Mutopia có Op. 4 *Gondellied*; năm in và bản thu chưa kiểm được), Maria Szymanowska (Mazurka, Trinity Grade 2; IMSLP chưa kiểm được). Florence Price: nhiều bài trong danh sách thi lấy từ ấn bản hiện đại; năm in từng bài chưa kiểm được.

### Đề xuất 3 bài

1. **Chaminade: *Pierrette* Op. 41 (chặng 6).** Có trong ABRSM Grade 8 suốt 2021–2028, hết bảo hộ ở cả hai nơi, có bản thu CC BY-SA 4.0. Liên hệ với mục Chaminade ở `docs/lich-su/nu-nha-soan-nhac.md`. Thiếu: năm in lần đầu (phải tra danh mục Citron hoặc BnF), bản số để đối chiếu.
2. **Clara Schumann: Scherzo số 2 Op. 14 (chặng 6).** Bài duy nhất của Clara có bản thu được nhận. Thiếu: bằng chứng cấp độ từ ABRSM hoặc Trinity (chỉ có ước lượng của pianosyllabus), bản số, và độ dài bản thu. Nếu chủ site tìm được bản thu mở cho Op. 15 (ABRSM Grade 7–8), nên đổi sang Op. 15 số 4 hoặc số 1.
3. **Fanny Hensel: *Mélodie* Op. 4 số 2 (chặng 6), có điều kiện.** Mạnh nhất về dạy học và bản quyền, nhưng chưa có bản thu được nhận. Chỉ viết khi có bản thu. Trong lúc chờ, bài thay đạt cả hai tiêu chí là Backer Grøndahl, *Klage* Op. 36 số 1 (Commons, phát được; cấp chưa kiểm được) hoặc Chaminade, *Automne* (chặng 7, Commons, phát được; nhưng thành hai bài Chaminade).

## Lô C: những bài người học hay hỏi, chặng 5–7

### Bảng ứng viên

| Ứng viên | Bản quyền VN / Mỹ | Ấn bản hết bảo hộ nên dùng | Grade và chặng | Nguồn Mutopia và nguồn khác | Bản thu tốt nhất | Ghi chú |
|---|---|---|---|---|---|---|
| **Mozart (1756–1791): *Alla turca*, chương 3 Sonata La trưởng K. 331 (300i)** | VN, Mỹ: hết (in 1784). **Đạt** | Artaria, Vienna, khoảng 1784, số bản in 47, in cùng K. 330 và K. 332 (IMSLP #292670); Alte Mozart-Ausgabe, Breitkopf & Härtel 1878 (#56321) | ABRSM Grade 8, danh sách A, 2025–2026 ("with first, third and final repeat"); không có trong 2027–2028 và Trinity từ 2023. Henle HN 1300: mức 6 cho cả sonata, trang Henle cũng ghi "ABRSM: Piano Grade 8". **Chặng 6** | Mutopia `MozartWA/KV331/KV331_3_RondoAllaTurca/KV331_3_RondoAllaTurca-lys/KV331_3_RondoAllaTurca.ly` (và `…Notes.ly`), `.mid` trên mutopiaproject.org (HEAD 200; đã có trong `sources.json`); Mutopia-2015/08/13-108, PD, nguồn chỉ ghi "IMSLP". kern `sonata11-3.krn` (craigsapp, CC BY-NC-SA 4.0, theo AMA; đã có). ASAP `Mozart/Piano_Sonatas/11-3` (CC BY-NC-SA 4.0). DCML `mozart_piano_sonatas/MS3/K331-3.mscx` (CC BY-NC-SA 4.0) | Commons [Mozart-Marsz turecki-(Romuald Greiss).ogg](https://commons.wikimedia.org/wiki/File:Mozart-Marsz_turecki-(Romuald_Greiss).ogg): Romuald Greiss thu trực tiếp năm 2000 ở Filharmonia Zabrze, trên đàn Budynowicz năm 1850; `{{PD-author|Romuald Greiss}}`, vé VRT 2007081710004688; 180,53 s; **phát được** | File chỉ khoảng 58 kbps. Chưa kiểm người chơi giữ những dấu nhắc lại nào. Thay thế: Luis Kolodin (IMSLP #815841, CC BY-SA 4.0, 218,52 s, **đã có trong `_imslp/`**, hướng dẫn nghe K. 331 đang dùng). Kỹ năng: phát âm Cổ điển nhẹ và rõ ở tốc độ Allegretto, hình móc kép vòng quanh nốt chính, hợp âm rải nhanh tay trái, quãng tám ở đoạn hành khúc. Thành cặp bài học – hướng dẫn nghe thứ sáu |
| **Debussy (1862–1918): Arabesque số 1 Mi trưởng, *Deux Arabesques* L. 66 / CD 74** | VN, Mỹ: hết. **Đạt** | Bản in đầu: **Durand et Schoenewerk** (không phải Choudens), Paris, 11/1891, D.S. 4395–96; Durand & Fils 1904 (khắc mới, giữ số bản in; IMSLP #255354) | Không có trong ABRSM 2011–2028 và Trinity (ABRSM 2023–2024 có Arabesque số 2, Grade 8). pianosyllabus: AMEB 7, ANZCA 7, NZMEB 7, Piano Street 7, RCM 10, DipLCM. Henle HN 380: mức 4 cho cả tập. Ước **Grade 7, chặng 6** | Mutopia `DebussyC/L66/debussy_Arabesque_1/debussy_Arabesque_1.ly` và `.mid` (HEAD 200); Mutopia-2011/10/25-1777, PD, nguồn Durand & Fils 1904. DCML `debussy_deux_arabesques`, `MS3/l066-01_arabesques_premiere.mscx` (CC BY-NC-SA 4.0) | Commons [Claude Debussy - Première Arabesque - Patrizia Prati.ogg](https://commons.wikimedia.org/wiki/File:Claude_Debussy_-_Premi%C3%A8re_Arabesque_-_Patrizia_Prati.ogg): thu trực tiếp ở Museo del Romanticismo, Madrid, 17/5/2016; `{{self|cc-by-sa-4.0}}`, vé VRT 2015120610013684; 292,99 s; **phát được** | Chơi khá chậm. Thay thế: eldüendesüarez, Commons, CC BY-SA 4.0, 240,0 s. 107 ô nhịp. Kỹ năng: hai chọi ba, hợp âm rải chảy qua hai tay, bàn đạp nửa, câu nhạc dài với rubato. Bài Ấn tượng thứ hai của site |
| **Rachmaninoff (1873–1943): Prelude Đô♯ thứ, *Morceaux de fantaisie* Op. 3 số 2** | VN: hết (từ 1994). Mỹ: hết (in 1893). **Đạt** | A. Gutheil, Moskva, 1893, A. 6516 G (IMSLP #868299, bản in lại năm 1992 từ bản khắc Gutheil). Trang Henle ghi "First published in 1892"; nên viết "in năm 1893 (Gutheil)" | Không có trong danh sách Grade của ABRSM 2011–2028, ARSM 2017, Trinity từ 2023 (ABRSM có Op. 3 số 1, 3, 4 ở Grade 8). pianosyllabus: mức diploma (AMEB Cert. Perf., ANZCA A.Dip.A., RCM 10, RIAM Senior Certificate). Henle HN 1211: mức 5. Site đang ghi "≈ Grade 8" và xếp chặng 6. Đề xuất "Grade 8 trở lên", **chặng 7** (như *Fantaisie-Impromptu*) | Mutopia `RachmaninoffS/O3/rach-prelude-op3-no2/rach-prelude-op3-no2.ly` và `.mid` (HEAD 200); Mutopia-2015/07/09-2033, **CC BY-SA 4.0**, nguồn Bosworth 1896 / UE 1910, nên trích đoạn phải đối chiếu thêm với Gutheil. Không có nguồn thứ hai (DCML `rachmaninoff_piano` chỉ có Op. 42; ASAP chỉ có Op. 23, Op. 32) | Commons [Sergei Rachmaninoff performs … Op. 3.ogg](https://commons.wikimedia.org/wiki/File:Sergei_Rachmaninoff_performs_Rachmaninoff%27s_Prelude_in_C_sharp_minor,_Op._3.ogg): **chính tác giả**, Edison Diamond Disc 82187-R, thu 24/4/1919, phát hành 12/1920, bản Adam Cuerden phục hồi; `{{PD-old-auto-record-expired}}`; PD ở Mỹ từ 1/1/2022; 227,91 s; **phát được** | Thu âm cơ học, có tiếng ồn mặt đĩa: căn mốc có thể khó. Thay thế: Martin Wörner, Commons, CC BY-SA 4.0, vé VRT, 232,84 s. Bản Victor 1928 của tác giả còn bảo hộ ở Mỹ đến hết 2028. Kỹ năng: hợp âm lớn dùng sức nặng cánh tay mà không gắt, làm nổi giai điệu trong khối hợp âm, đoạn Agitato chùm ba luân phiên hai tay, đọc nhiều khuông ở đoạn tái hiện |
| Chopin (1810–1849): Nocturne Đô♯ thứ *Lento con gran espressione*, B. 49 / KK IVa/16 | VN, Mỹ: hết (in 1875). **Đạt** | In lần đầu 1875: Henle ghi nhà Leitgeber ở Poznań, theo bản chép của Kolberg; bản quét IMSLP #1005676 (từ Polona) ghi "W. Benicke, Leipzig", số bản in M. L. 18: chưa kiểm được ai là nhà xuất bản thật | **ABRSM Grade 7, danh sách B, 2017–2018**; pianosyllabus: AMEB 8, RCM 9. Henle HN 781: mức 5 (cả hai phiên bản). **Chặng 6** (site đang xếp chặng 5) | **Không có** trên Mutopia, NIFC, DCML, ASAP | Commons [Frank Lévy (Musopen)](https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._20_in_C-sharp_minor,_B._49_(Frank_Levy).flac), `{{PD-author|Musopen}}`, 225,01 s, phát được | Để lượt sau: không có bản số mở, mốc phải đo tay; văn bản có hai phiên bản (bản nháp ở Valldemossa và bản theo các bản chép). Thay thế: Patrizia Prati, Commons, CC BY-SA 4.0, 302,97 s |
| Chopin: Valse Đô♯ thứ Op. 64 số 2 | VN, Mỹ: hết (in 1847). **Đạt** | Brandus, Paris, 1847, B. et Cie 4743 (IMSLP #400822); Breitkopf & Härtel, 7721; ấn bản Wessel: chưa kiểm được năm | Không có trong ABRSM 2011–2028 và Trinity từ 2023 (Trinity Grade 8 có Op. 64 số 1). pianosyllabus: AMEB 7, ANZCA 7, NZMEB 8, RCM 9. Henle HN 654: mức 6. Ước **Grade 7–8, chặng 6** | NIFC `pl-wnifc/humdrum-chopin-first-editions` (CC BY 4.0; repo đã dùng bộ này): `kern/064-1a-BH-002.krn` (Breitkopf), `kern/064_2-1-BR-002.krn` (Brandus). Mutopia chỉ có Op. 64 số 1 | Commons [Olga Gurevich (Musopen)](https://commons.wikimedia.org/wiki/File:Chopin_-_Waltz_No._7_in_C-sharp_minor,_Op._64_No._2_(Olga_Gurevich).flac), `{{PD-author|Musopen}}`, 230,06 s | Để lượt sau: người chơi ghi không thống nhất (một file khác cùng bản thu và Wikipedia ghi Luke Faulkner). Nếu dùng, ghi `by` là "Musopen". Thay thế: eldüendesüarez, CC BY-SA 4.0, 211,28 s |

### Đề xuất 3 bài

1. **Mozart: *Alla turca* (chặng 6).** Bài người học hỏi nhiều nhất; ABRSM Grade 8 (2025–2026); ba nguồn số độc lập (Mutopia PD, kern, ASAP, thêm DCML), repo đã có MIDI và kern; bản thu Commons phát được; thành cặp với hướng dẫn nghe K. 331 có sẵn (sửa đoạn "Năm bài học…" ở `docs/piano/tac-pham/index.md`). Thêm một bài Cổ điển.
2. **Debussy: Arabesque số 1 (chặng 6).** Bài Ấn tượng thứ hai; bản thu chuyên nghiệp CC BY-SA 4.0 phát được; Mutopia PD theo Durand 1904, kèm DCML để đối chiếu. Kỹ năng hai chọi ba và bàn đạp nửa đúng như bảng chặng 6 của site.
3. **Rachmaninoff: Prelude Op. 3 số 2 (chặng 7).** Lấp chặng ít bài nhất (3 lên 4); bài Lãng mạn muộn Nga đầu tiên; bài học đầu tiên có bản thu của chính tác giả (PD, phát được); Mutopia CC BY-SA 4.0. Phải sửa cấp ở `tac-pham-theo-cap.md` và `nha-soan-nhac.md` nếu xếp chặng 7.

**Để lượt sau:** Nocturne Đô♯ thứ B. 49 (không có bản số mở; hai phiên bản) và Valse Op. 64 số 2 (người chơi ghi không thống nhất). Site đã có 7/34 bài Chopin, nên hoãn hai bài Chopin cũng cân lại thời kỳ. Muốn đúng "bài hay được hỏi" hơn thì đổi Rachmaninoff lấy Nocturne B. 49, nhưng khi đó chặng 7 không được lấp.

## File IMSLP chủ site cần tải tay (vào `_imslp/`)

Link nghe hoặc tải cho khối bản thu chỉ dẫn link: `https://imslp.org/wiki/Special:ImagefromIndex/<số>`. Không bắt buộc tải file nào cho lô C (cả ba bài đề xuất đều có bản thu Commons).

**Bản thu** (để căn mốc):

| Lô | Bài | File | Trang file | Số IMSLP |
|---|---|---|---|---|
| A | *For Children* I/1 | `PMLP3084-Children_At_Play_Bartok.mp3` | https://imslp.org/wiki/File:PMLP3084-Children_At_Play_Bartok.mp3 | 469932 |
| A | *For Children* I/6 | `PMLP3084-Study_for_Left_Hand_Bartok.mp3` | https://imslp.org/wiki/File:PMLP3084-Study_for_Left_Hand_Bartok.mp3 | 469925 |
| A | Gretchaninov Op. 119 số 1 | `PMLP437344-GRETCHANINOV_-_Op.119_No.1_-_My_Dear_Mummy.mp3` | https://imslp.org/wiki/File:PMLP437344-GRETCHANINOV_-_Op.119_No.1_-_My_Dear_Mummy.mp3 | 517116 |
| A | Gretchaninov Op. 119 số 4 | `PMLP437344-GRETCHANINOV_-_Op.119_No.4_-_On_the_Meadow.mp3` | https://imslp.org/wiki/File:PMLP437344-GRETCHANINOV_-_Op.119_No.4_-_On_the_Meadow.mp3 | 517119 |
| A | Gretchaninov Op. 119 số 7 | `PMLP437344-GRETCHANINOV_-_Op.119_No.7_-_Sad_Story.mp3` | https://imslp.org/wiki/File:PMLP437344-GRETCHANINOV_-_Op.119_No.7_-_Sad_Story.mp3 | 517122 |
| A | Op. 119, bài khác (số 1–13) | `PMLP437344-GRETCHANINOV_-_Op.119_No.<N>_-_<tên>.mp3` | https://imslp.org/wiki/Grandfather's_Album,_Op.119_(Grechaninov,_Aleksandr) | 517116–517128 |
| A | *Romanian Folk Dances* | `PMLP3387-bartok-romanian-folk-dances-breemer.mp3` | https://imslp.org/wiki/File:PMLP3387-bartok-romanian-folk-dances-breemer.mp3 | 991622 |
| A (thay thế) | Granados Op. 1 | `PMLP337720-granados-cuentos-de-la-juventud-breemer.mp3` | https://imslp.org/wiki/File:PMLP337720-granados-cuentos-de-la-juventud-breemer.mp3 | 937398 |
| B | Chaminade *Pierrette* | `PMLP17439-chaminade-pierrette-op.41.mp3` | https://imslp.org/wiki/File:PMLP17439-chaminade-pierrette-op.41.mp3 | 848447 |
| B | Clara Schumann Op. 14 | `PMLP90408-FSarro_ClaraSchumann_Scherzo_Op.14.mp3` | https://imslp.org/wiki/File:PMLP90408-FSarro_ClaraSchumann_Scherzo_Op.14.mp3 | 292506 |
| B (thay thế) | Chaminade *Pièce romantique* Op. 9 số 1 | `PMLP08488-chaminade_pieceromantique.mp3` | https://imslp.org/wiki/File:PMLP08488-chaminade_pieceromantique.mp3 | 99442 |
| B (thay thế) | Chaminade *Automne* (Takashi Sato; đã có bản Commons) | `PMLP07098-chaminade_automne_mitaka.mp3` | https://imslp.org/wiki/File:PMLP07098-chaminade_automne_mitaka.mp3 | 99449 |
| C (thay thế) | *Alla turca*, Luis Kolodin | `PMLP1846-luis-kolodin-plays-mozart-s-piano-sonata-no.11_3.mp3` (**đã có** trong `_imslp/`) | https://imslp.org/wiki/File:PMLP1846-luis-kolodin-plays-mozart-s-piano-sonata-no.11_3.mp3 | 815841 |
| C (thay thế) | Arabesque số 1, Luis Kolodin | `PMLP2383-Y2mate.mx_-_Luis_Kolodin_plays_Debussy's_Deux_Arabesques_no._1_(128_kbps).mp3` | https://imslp.org/wiki/File:PMLP2383-Y2mate.mx_-_Luis_Kolodin_plays_Debussy%27s_Deux_Arabesques_no._1_(128_kbps).mp3 | 809126 |
| C (thay thế) | Op. 3 số 2, German Kitkin | `PMLP5664-German_Kitkin_-_5_Morceaux_de_Fantaisie,_Op._3,_2._Prelude._Lento.flac` | https://imslp.org/wiki/File:PMLP5664-German_Kitkin_-_5_Morceaux_de_Fantaisie,_Op._3,_2._Prelude._Lento.flac | 928449 |

**Bản nhạc** (để chép và đối chiếu trích đoạn khi không có bản số mở; xem trên IMSLP là đủ nếu người viết đối chiếu bằng mắt, tải về `_imslp/` nếu agent cần mở file):

| Lô | Bài | File | Số IMSLP |
|---|---|---|---|
| A | *For Children*, bản in đầu Rozsnyai (Book 1 = tập I–II) | `PMLP03084-Bartok-Sz42-For-Children-Book1-Hungarian.pdf` | 893790 |
| A | Gretchaninov Op. 119, Schott [1929] | `PMLP437344-gretchaninoffop119_grandfathersbook.pdf` (hoặc bản có bìa, bản đã làm sạch) | 269926 (270502, 272596) |
| A | *Romanian Folk Dances*, UE 1918 (phải kiểm là bản in trước 1934) | `PMLP03387-E173317_-béla-bartók_sz-56_román-népi-táncok.pdf` | 918136 |
| B | Chaminade *Pierrette* | `Chaminade_Pierrette_Air_de_ballet_op.41.pdf` | chưa kiểm được |
| B | Clara Schumann Op. 14, Breitkopf & Härtel 1879 | `PMLP90408-CSchumann_Scherzo_No.2,_Op.14.pdf` | chưa kiểm được |
| B | Fanny Hensel Op. 4, Schlesinger 1847 | `PMLP70375-Hensel_Fanny_Six_Melodies_Schlesinger_Op_4_filter.pdf` | chưa kiểm được |
| C | Rachmaninoff Op. 3, bản khắc Gutheil (Mutopia theo Bosworth/UE) | xem trang https://imslp.org/wiki/Morceaux_de_fantaisie,_Op.3_(Rachmaninoff,_Sergei) | 868299 |
| C | Mozart K. 331, Artaria 1784 (Mutopia không ghi ấn bản) | xem trang https://imslp.org/wiki/Piano_Sonata_No.11_in_A_major,_K.331/300i_(Mozart,_Wolfgang_Amadeus) | 292670 |

## Rủi ro và việc cần quyết

- **Lô B thiếu bản thu.** Hensel và các bài dạy của Chaminade, Bonis, Farrenc chưa có bản thu được nhận. Cần chủ site tự tra Musopen, hoặc chấp nhận hai bài chặng 6 cộng một bài thay thế.
- **Hầu hết bản thu lô A và lô B chỉ dẫn link** (IMSLP), nên không phát được trên site, và độ dài nhiều file chưa kiểm được. Chưa ai nghe kiểm các bản Römgens, Breemer, Kolodin (Op. 14, *Pierrette*).
- **Ấn bản:** *For Children* và *Romanian Folk Dances* có bản sửa còn bảo hộ ở Mỹ; trích đoạn phải theo đúng bản in đầu. Mutopia K. 331 không ghi ấn bản; Mutopia Op. 3 số 2 theo Bosworth/UE chứ không theo Gutheil.
- **Thiếu bản số mở** cho mọi bài lô A và lô B (trừ điệu số 2 của *Romanian Folk Dances*), nên trích đoạn phải chép tay từ bản quét, và mốc phải đo tay.
- **Cấp độ ước lượng:** Op. 119, Scherzo Op. 14, Arabesque số 1, *Klage* và *Pièce romantique* không có trong danh sách ABRSM/Trinity đã đọc. Rachmaninoff nằm giữa "≈ Grade 8" (site) và mức diploma (pianosyllabus).
- **`commons.py` đọc sai giấy phép** khi trang mô tả có mẫu PD cho phần sáng tác và giấy phép CC cho bản thu (đã gặp ở file Sonatina của Bartók): luôn đọc trang mô tả.

## Ghi chú ngoài phạm vi (lệch giữa site và danh sách thi)

- `docs/piano/tac-pham-theo-cap.md` xếp *The Little Shepherd* ở chặng 5 (cả bảng chặng 5 lẫn bảng "Đừng nhảy cóc"), `nha-soan-nhac.md` ghi "≈ Grade 6"; ABRSM xếp Grade 7 (2023–2028), Henle gắn nhãn ABRSM Grade 7.
- Nocturne Đô♯ thứ B. 49 ở chặng 5 (`tac-pham-theo-cap.md`) và "≈ Grade 6" (`nha-soan-nhac.md`); ABRSM 2017–2018 xếp Grade 7.
- Nocturne Mi thứ Op. 72 số 1 ở chặng 5; ABRSM 2027–2028 xếp Grade 8.
- Valse Si thứ Op. 69 số 2 (bài học hiện có, "Grade 5–6, chặng 5"); ABRSM 2015–2016 xếp Grade 8 (danh sách C).
- *Alla turca* chưa có trong `tac-pham-theo-cap.md`; `nha-soan-nhac.md` ghi K. 331 "≈ Grade 7–8".
- Rachmaninoff Op. 3 số 2: `nha-soan-nhac.md` ghi "≈ Grade 8", `tac-pham-theo-cap.md` xếp chặng 6.

## Nguồn đã dùng để kiểm chứng

**Danh sách thi** (đọc toàn văn PDF, lọc theo tên tác giả):

- ABRSM Piano 2027 & 2028 (Performance Grades; cùng danh sách bài với Practical Grades): https://www.abrsm.org/sites/default/files/2026-06/Piano%20Performance%20Grades%20Syllabus%202027%20%26%202028.pdf
- ABRSM Piano 2025 & 2026 (bản sao văn bản ABRSM ©2024 trên trang một cửa hàng): https://caswells-strings.co.uk/wp-content/uploads/2025/07/ABRSM-Piano-syllabus-2025-2026.pdf
- ABRSM Piano 2023 & 2024: https://web.archive.org/web/20220809125549/https://gb.abrsm.org/media/66595/piano-2023-2024-practical-grades-syllabus-may-2022.pdf
- ABRSM Piano 2021 & 2022: https://web.archive.org/web/20211216222640/https://gb.abrsm.org/media/65206/piano-2021-2022-syllabus-rev-sep-2020-final.pdf
- ABRSM Piano 2019 & 2020: https://web.archive.org/web/20201112011213/https://gb.abrsm.org/media/62972/piano_syllabus_2019___2020_complete.pdf
- ABRSM Piano 2017 & 2018: https://web.archive.org/web/20170215031502/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoSyllabusComplete17.pdf
- ABRSM Piano 2015 & 2016: https://web.archive.org/web/20160314222929/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoSyllabusComplete15.pdf
- ABRSM Piano 2013 & 2014: https://web.archive.org/web/20140308031625/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoSyllabusComplete13.pdf
- ABRSM Piano 2011 & 2012: https://web.archive.org/web/20131007054337/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoComplete11.pdf
- ABRSM ARSM Repertoire List (bản 2016–2017): https://web.archive.org/web/20170329071744/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoARSM.pdf
- Trinity College London, Piano repertoire list, graded exams from 2023 (bản cập nhật 8/2026): https://www.trinitycollege.com/resource/?id=10125
- Melanie Spanswick, bài về Nocturne B. 49 (xác nhận ABRSM Grade 7 năm 2017–2018): https://melaniespanswick.com/2017/11/10/practising-nocturne-no-20-in-c-sharp-minor-op-posth-by-fryderyk-chopin
- pianosyllabus.com, trang chi tiết (`https://pianosyllabus.com/x-detail.php?ref=<số>`): B. 49 (12350), Op. 64 số 2 (2316), Arabesque số 1 (16138), *Alla turca* (641058959), Op. 3 số 2 (3082417), *The Little Shepherd* (25841223), *Jimbo's Lullaby* (61467982), Op. 119 số 1 (61670366), số 2 (63039962), số 4 (46304697), *Nurse's Tale* (51934183), số 15 (98382097), số 16 (57071176), *Romanian Folk Dances* trọn bộ (71689264) và từng điệu (51015680, 13787774, 9595281, 98730354), Hensel *Mélodie* Op. 4 số 2 (60047668), Clara Op. 14 (972444999), Op. 15 số 1 (168267), Op. 15 số 4 (22049355), Chaminade *Pierrette* (29294826), *Automne* (70136852), *Pièce romantique* (879209722), *Gavotte* (56589), *Idylle* (28278099), *Élégie* (80569643)

**Henle** (đọc mức độ khó trên trang của đúng ấn bản):

- HN 1225 *For Children* I (số 1 mức 1, số 6 mức 2): https://www.henle.de/en/For-Children-Volume-I/HN-1225; lời tựa và bình chú: https://www.henle.de/media/87/71/16/1697725809/1225-1697725809-sync.pdf, https://www.henle.de/media/3a/ac/86/1697725627/1225-1697725627-sync.pdf; HN 1226 (tập II), lời tựa: https://www.henle.de/media/19/b7/b1/1697725923/1226-1697725923-sync.pdf; Tổng tập Bartók tập 37 (HN 6200): https://www.henle.de/Vol.-37-For-Children-Early-Version-and-Revised-Version/HN-6200
- HN 382 *Children's Corner*: https://www.henle.de/Children-s-Corner-Little-Suite-for-Piano/HN-382
- HN 1402 *Romanian Folk Dances* (và bình chú): https://www.henle.de/Romanian-Folk-Dances/HN-1402, https://www.henle.de/media/90/29/81/1697725629/1402-1697725629-sync.pdf
- HN 1401 Sonatina (và bình chú): https://www.henle.de/Sonatina/HN-1401, https://www.henle.de/media/0b/19/f2/1697725688/1401-1697725688-sync.pdf
- HN 393 Clara Schumann, *Selected Piano Works*: https://www.henle.de/en/Selected-Piano-Works/HN-393
- HN 1300 K. 331: https://www.henle.de/en/Piano-Sonata-A-major-K.-331-Alla-Turca/HN-1300
- HN 380 *Deux Arabesques*: https://www.henle.de/en/Deux-Arabesques/HN-380
- HN 1211 Prélude Op. 3 số 2: https://www.henle.de/en/Prelude-c-sharp-minor-op.-3-no.-2/HN-1211; HN 1491 *Morceaux de fantaisie*: https://www.henle.de/en/Morceaux-de-Fantaisie-op.-3/HN-1491
- HN 781 Nocturne B. 49 (và lời tựa): https://www.henle.de/en/Nocturne-c-sharp-minor-Lento-con-gran-espressione/HN-781, https://www.henle.de/media/04/de/94/1690886066/0781-1690886066-sync.pdf
- HN 654 Valse Op. 64 số 2: https://www.henle.de/en/Waltz-c-sharp-minor-op.-64-no.-2/HN-654; HN 131 *Waltzes*: https://www.henle.de/en/Waltzes/HN-131

**IMSLP** (đọc wikitext và HTML qua API, không tải file):

- Lô A: https://imslp.org/wiki/For_Children,_Sz.42_(Bartók,_Béla); https://imslp.org/wiki/Children's_Corner,_CD_119_(Debussy,_Claude); https://imslp.org/wiki/Livre_d'enfants,_Op.98_(Grechaninov,_Aleksandr); https://imslp.org/wiki/Grandfather's_Album,_Op.119_(Grechaninov,_Aleksandr); https://imslp.org/wiki/Glass_Beads,_Op.123_(Grechaninov,_Aleksandr); https://imslp.org/wiki/Romanian_Folk_Dances,_Sz.56_(Bartók,_Béla); https://imslp.org/wiki/Sonatina,_Sz.55_(Bartók,_Béla); https://imslp.org/wiki/10_Easy_Pieces,_Sz.39_(Bartók,_Béla); https://imslp.org/wiki/Cuentos_de_la_juventud,_Op.1_(Granados,_Enrique)
- Lô B: https://imslp.org/wiki/3_Mélodies,_Op.4_(Hensel,_Fanny); https://imslp.org/wiki/Allegretto,_H.420_(Hensel,_Fanny); các trang Op. 2, Op. 5, Op. 6 (và bốn bài con), Op. 8 của Hensel; mọi trang tác phẩm piano trong https://imslp.org/wiki/Category:Schumann,_Clara (Op. 1–21, WoO); https://imslp.org/wiki/Scherzo_No.2,_Op.14_(Schumann,_Clara); https://imslp.org/wiki/Pierrette,_Op.41_(Chaminade,_Cécile); https://imslp.org/wiki/6_Études_de_concert,_Op.35_(Chaminade,_Cécile); https://imslp.org/wiki/Album_des_enfants_-_1ère_série,_Op.123_(Chaminade,_Cécile); https://imslp.org/wiki/Album_des_enfants_-_2ème_série,_Op.126_(Chaminade,_Cécile); khoảng 50 trang tác phẩm piano khác của Chaminade (Op. 9–169); https://imslp.org/wiki/10_Fantasistykker,_Op.36_(Backer-Grøndahl,_Agathe); https://imslp.org/wiki/5_Fantasistykker,_Op.45_(Backer-Grøndahl,_Agathe); https://imslp.org/wiki/25_Etudes_faciles,_Op.50_(Farrenc,_Louise); https://imslp.org/wiki/Album_pour_les_tout-petits,_Op.103_(Bonis,_Mel); https://imslp.org/wiki/Children's_Carnival,_Op.25_(Beach,_Amy_Marcy); https://imslp.org/wiki/Eskimos,_Op.64_(Beach,_Amy_Marcy)
- Lô C: https://imslp.org/wiki/Piano_Sonata_No.11_in_A_major,_K.331/300i_(Mozart,_Wolfgang_Amadeus); https://imslp.org/wiki/2_Arabesques,_CD_74_(Debussy,_Claude); https://imslp.org/wiki/Morceaux_de_fantaisie,_Op.3_(Rachmaninoff,_Sergei); https://imslp.org/wiki/Nocturne_in_C-sharp_minor,_B.49_(Chopin,_Fr%C3%A9d%C3%A9ric); https://imslp.org/wiki/Waltzes,_Op.64_(Chopin,_Fr%C3%A9d%C3%A9ric)

**Wikimedia Commons** (đọc bằng `tools/audio/commons.py`, lệnh `search`, `info`, `--fresh page`, và API category):

- Đã chọn hoặc nêu: Bartok_-_Sonatina.ogg; Bartok_-_Romanian_Folk_Dances.ogg; Claude_Debussy_-_Children%27s_Corner.ogg; File "О.Гречанінов "Танець".ogg"; Mozart-Marsz_turecki-(Romuald_Greiss).ogg; Claude_Debussy_-_Premi%C3%A8re_Arabesque_-_Patrizia_Prati.ogg; Debussy_-_Arabesque_No-1_in_E_(Piano_Performance_by_eld%C3%BCendes%C3%BCarez).wav; Sergei_Rachmaninoff_performs_Rachmaninoff%27s_Prelude_in_C_sharp_minor,_Op._3.ogg; Prelude_3_2_Rach_playing.ogg; Sergei_Rachmaninoff_-_Morceaux_de_fantasie_op._3_No._2_c_sharp_minor.ogg; Chopin_-_Nocturne_No._20_in_C-sharp_minor,_B._49_(Frank_Levy).flac; Chopin_-_Waltz_No._7_in_C-sharp_minor,_Op._64_No._2_(Olga_Gurevich).flac; Chopin-waltz-op-64-no-2-in-c-sharp-minor.oga; Chaminade_-_Automne_(Etude_de_Concert)_Op-35_No-2_(Piano_Performance_by_eld%C3%BCendes%C3%BCarez).wav; Klage-grondahl.ogg (tất cả ở `https://commons.wikimedia.org/wiki/File:<tên>`)
- Tìm không thấy bản thu: Fanny Hensel, Clara Schumann, Farrenc, Bonis, Pejačević, Szymanowska (tìm theo `intitle:` và theo category "Audio files of music by …"); Bartók *For Children* (category "Audio files of music by Béla Bartók")

**Bản nhạc số:**

- Mutopia (GitHub `MutopiaProject/MutopiaProject`, thư mục `ftp/`; header các file `.ly`; HEAD file `.mid` trên mutopiaproject.org): `BartokB`, `DebussyC` (chỉ L66, L75, L117), `ChopinFF` (không có B. 49, Op. 64 chỉ có số 1), `MozartWA/KV331`, `RachmaninoffS/O3`; trang tác phẩm Mutopia 108, 1777, 2033, 2162
- NIFC: https://github.com/pl-wnifc/humdrum-chopin-first-editions (CC BY 4.0)
- DCML: https://github.com/DCMLab/debussy_childrens_corner, https://github.com/DCMLab/debussy_deux_arabesques, https://github.com/DCMLab/mozart_piano_sonatas, https://github.com/DCMLab/rachmaninoff_piano, https://github.com/DCMLab/poulenc_mouvements_perpetuels (đều CC BY-NC-SA 4.0)
- ASAP: https://github.com/fosfrancesco/asap-dataset (CC BY-NC-SA 4.0)
- `tools/audio/align/NGUON.md` và `sources.json` của repo (nguồn đã có cho K. 331)

**Khác:** EMB (kotta.info), *For Children I* Z. 20038 (bản in đầu không có tên bài): https://www.kotta.info/en/product/20038/BARTOK-BELA-For-Children-I; RISM 1001035728, 1001033709 (ấn bản Op. 64); PTNA Piano Encyclopedia (B. 49): https://enc.piano.or.jp/en/musics/483; OCVE (bản chép B. 49 của Ludwika): https://chopinonline.ac.uk/ocve/browse/pageview/78903/; Wikipedia (các trang *For Children*, Gretchaninov, Piano Sonata No. 11, Two Arabesques, Prelude in C-sharp minor, Nocturne Op. posth., Waltz Op. 64 No. 2); AllMusic (*Cuentos de la juventud*).

Ghi chép chi tiết hơn của lô A và lô C (từng bản thu bị loại và lý do, header từng file Mutopia) và dữ liệu thô của danh sách thi nằm trong thư mục tạm của phiên khảo sát (`lot-a.md`, `lot-c.md`, `abrsm_hits.txt`, `ps_bartok.txt`), không được lưu lại. File này đã gộp mọi kết luận cần dùng.
