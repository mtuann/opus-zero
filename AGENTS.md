# Sổ tay cho agent: Opus Zero

Đọc hết trang này trước khi sửa repo. Khi trang này khác với trang thật trong `docs/`, trang thật là chuẩn; khi khác với một quyết định ghi trong kế hoạch hiện hành (`plans/`), kế hoạch là chuẩn.

## Dự án

Opus Zero là site MkDocs Material tiếng Việt (https://mtuann.github.io/opus-zero/), sổ tay học **piano cổ điển** cho người lớn tự học từ con số 0 đến nâng cao. Trục chính là mục Piano (`docs/piano/`): lộ trình 7 chặng, kỹ thuật, cách tập, 34 bài học tác phẩm, hòa âm bên phím. Các mục khác (nhạc lý, luyện tai, nghe nhạc, lịch sử, hình thức, nhạc cụ) phục vụ việc đọc, nghe và hiểu nhạc của người tập đàn. Nhiều công cụ luyện tập chạy ngay trong trình duyệt.

## Cấu trúc thư mục

```
docs/
├── bat-dau/        Bài 0, kiểm tra đầu vào, lộ trình piano năm đầu, lộ trình nghe hiểu và nhạc lý, tóm tắt, sách in, hỏi đáp
├── piano/          Trục chính: lộ trình, bắt đầu bên phím, 10 bài hai tay, kỹ thuật, tập luyện, văn học piano
│   ├── hoa-am/     Hòa âm bên phím và ứng tác
│   └── tac-pham/   Bài học tác phẩm (mỗi trang một tác phẩm)
├── nhac-ly/        Bài nhạc lý có số thứ tự, âm học, ôn tập, từ điển
├── luyen-tai/      Luyện tai (công cụ nhận biết quãng, hợp âm, gam, kết nằm ngay trong bài)
├── luyen-tap/      Công cụ luyện tập
├── nghe-nhac/      Hướng dẫn nghe, đọc tên tác phẩm, nghe gì tiếp, mẫu ghi chép
├── nhan-dien/      Nhận diện thời kỳ, thể loại, tác giả bằng tai
├── hinh-thuc/      Hình thức và thể loại
├── nhac-cu/        Nhạc cụ trong dàn nhạc (chỉ phần nghe)
├── lich-su/        Thời kỳ, nhà soạn nhạc, opera, Việt Nam, đương đại
├── assets/         CSS, JS (assets/js/), âm thanh (assets/audio/ + NGUON.txt), mẫu âm piano
└── sw.js           Service worker
hooks/              search_vi.py (tìm không dấu), books.py (sách in, biến BOOKS), a11y.py,
                    redirects.py (địa chỉ cũ, biến REDIRECTS; đích có thể kèm #mục), meta.py (mô tả trang)
tools/figures.py    Sinh hình (sơ đồ cấu trúc...) chèn giữa <!-- fig:TÊN --> và <!-- /fig:TÊN -->
tests/              Kiểm thử (npm test)
plans/              Kế hoạch và báo cáo của từng phiên bản
overrides/main.html Phần <head> thêm vào theme
```

## Môi trường, build và kiểm thử

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt    # mkdocs 1.6.1, mkdocs-material 9.7.6, pymdown-extensions 10.21.2
npm ci                             # abcjs, axe-core, jsdom, lunr: chỉ dùng cho kiểm thử
mkdocs build --strict              # phải sạch cảnh báo
npm test                           # 4 nhóm song song: nhanh, trang-1, trang-2, a11y (cần site/ đã build)
npm test -- nhanh                  # chạy một nhóm
```

- Kiểm thử gọi `python3`: chạy trong venv đã kích hoạt (hoặc `PATH="$PWD/.venv/bin:$PATH" npm test`).
- Đừng nâng MkDocs lên 2.x: Material không tương thích.
- Thêm hoặc đổi tên nhóm kiểm thử thì sửa cả ma trận trong `.github/workflows/test.yml` (`tests/site_static.py` kiểm hai nơi khớp nhau).
- Nhóm `nhanh` gồm: `unit.mjs`, `data.mjs`, `site_static.py` (sách in khớp nav, VERSION khớp nhau, precache, ma trận CI), `search.mjs` (truy vấn có dấu và không dấu ra đúng trang), `extract-examples.mjs` + `abc_bars.py` (độ dài ô nhịp), `abc_warn.mjs` (cảnh báo của abcjs), `tools/figures.py --check` (hình khớp dữ liệu), `browser.mjs --flows`. Nhóm `trang-1`, `trang-2` mở từng trang đã build (không lỗi JS, mọi công cụ khởi tạo). Nhóm `a11y` chạy axe trên các trang trong `PAGES` của `tests/a11y.mjs`.
- Sửa nhiều JS/CSS thì tăng `VERSION` ở **cả** `docs/sw.js` và `docs/assets/js/loader.js`.
- Thêm công cụ JS mới: file trong `docs/assets/js/`, đăng ký bằng `(window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);` và thêm quy tắc vào `RULES` trong `loader.js`; thêm lớp vào `TOOL_CLASSES` trong `tests/browser.mjs`.

## Cách làm việc

- Mỗi giai đoạn của kế hoạch một nhánh (ví dụ `v15/g1-kiem-thu`). Commit nhỏ, mỗi commit một việc, chỉ commit khi `mkdocs build --strict` và `npm test` đều đạt. Không gộp nhiều chủ đề vào một đợt.
- Không push, không sửa lịch sử của `main`, không xóa file ngoài phạm vi. Không sửa `.claude/` và `site/`.
- `_imslp/` (không đưa lên git) chỉ đọc, trừ khi giai đoạn nói khác. Làm trong git worktree thì đọc `_imslp/` và `plans/` chưa commit ở thư mục dự án gốc.
- Commit message tiếng Việt: một dòng tóm tắt, rồi các gạch đầu dòng.
- Báo cáo cuối giai đoạn ở `plans/bao-cao-v15/giai-doan-N.md`: file đã sửa và lý do, kết quả build và test (dán dòng tóm tắt), số đo nếu có, chỗ chưa chắc hoặc đã bỏ qua, nguồn đã dùng để kiểm chứng.
- Mạng: gửi User-Agent có link repo (`OpusZeroBot/1.0 (https://github.com/mtuann/opus-zero)`); nghỉ khoảng 2,5 giây giữa các yêu cầu tới Wikimedia và thử lại khi gặp 429. Không vượt cơ chế tải của IMSLP: bản thu IMSLP do chủ site tải tay vào `_imslp/`.

## Quy tắc nội dung

- Tiếng Việt, gọi người đọc là "bạn", câu ngắn, giọng của một giáo viên giỏi nói điều cụ thể. In đậm thuật ngữ ở lần xuất hiện đầu. Dùng bảng cho so sánh, kế hoạch, checklist; danh sách việc `- [ ]` cho mốc tự kiểm. Không quảng cáo, không emoji.
- Một H1, đoạn mở đầu 1–3 câu, các mục H2; trang kết thúc bằng `## Nguồn` với nguồn thật.
- Tên nốt: "Đô (C)", "Đô giữa (C4)", "Sol trưởng", "La thứ", "Mi♭ trưởng", "Fa♯"; dùng ♯ ♭ ♮ trong văn bản; quãng tám theo ký hiệu khoa học (C4 là Đô giữa). Tên tác phẩm nước ngoài giữ nguyên ngữ, kèm nghĩa tiếng Việt.
- Từ vựng của site: nốt tròn, trắng, đen, móc đơn, móc kép; chấm dôi; dấu nối, dấu luyến; ô nhịp, nhịp lấy đà, số chỉ nhịp; hóa biểu, giọng, gam, quãng; hợp âm, hợp âm rải, thể đảo; chủ âm, át âm, hạ át âm; kết, câu nhạc; tiết tấu, tốc độ, sắc thái; bàn đạp vang, *una corda*; nốt hoa mỹ (láy rền, láy, láy quanh, appoggiatura, acciaccatura); ngón 1–5 (ngón cái là 1), thế tay năm ngón, luồn ngón cái, vắt ngón; khuông kép, thị tấu, bản Urtext; trình bày, phát triển, tái hiện, coda, cadenza.
- Cấp độ: "khoảng ABRSM Grade N", kèm chặng 1–7 theo bảng ở `docs/piano/lo-trinh.md`: chặng 1 trước Grade 1; chặng 2 Grade 1–2; chặng 3 Grade 3; chặng 4 Grade 4–5; chặng 5 Grade 6; chặng 6 Grade 7–8; chặng 7 sau Grade 8. Mức độ khó của Henle chỉ ghi khi đã đọc trên trang henle.de của đúng tác phẩm.
- **Độ chính xác là quan trọng nhất.** Không bịa năm, số danh mục, trích dẫn, bản thu (năm, hãng), con số hay nguồn gốc biệt danh. Không chắc thì kiểm chứng hoặc bỏ đi, hoặc viết chung chung. Số ô nhịp chỉ ghi khi chắc; nếu không, mô tả bằng lời.
- Link nội bộ dùng đường dẫn tương đối tới file `.md` (từ `docs/piano/tac-pham/x.md`: `../gam.md`, `../../nhac-ly/13-ket.md`). Link tới một mục (`#...`) phải lấy id từ HTML đã build, không đoán: bộ tạo id bỏ chữ "đ" ("Chặng 1. Khởi đầu" thành `chang-1-khoi-au`). Tiêu đề cần id cố định thì ghi `{ #id }` ở cuối tiêu đề.
- Hộp nhấn mạnh: `!!! tip "…"`, `!!! note "…"`, `!!! warning "…"`, `??? question "…"`, nội dung thụt 4 dấu cách.

## Bản quyền

- Tác phẩm còn bảo hộ thì không chép khuông nhạc, tên nốt của giai điệu hay lời. Chỉ mô tả, hướng dẫn kỹ năng và dẫn tới bản nhạc, bản thu chính thức.
- Hết bảo hộ, tính đến năm 2026: ở Việt Nam (Luật Sở hữu trí tuệ, Điều 27) là tác giả mất từ năm 1975 trở về trước; ở Mỹ (nơi đặt GitHub Pages) là tác phẩm xuất bản từ năm 1930 trở về trước. Phải hết bảo hộ ở cả hai nơi, và phải dùng đúng ấn bản đã hết bảo hộ (ví dụ bản gốc 1909–1911 của *For Children*, không phải bản sửa 1945).
- Bản thu chỉ nhận phạm vi công cộng (kể cả PDM), CC0, CC BY, CC BY-SA (2.0–4.0); không nhận NC, ND. Bản thu ở Mỹ: bản xuất bản từ 1923 đến 1946 được bảo hộ 100 năm (bản 1924 vào phạm vi công cộng năm 2025, bản 1929 phải tới năm 2030).
- **Giấy phép dùng cá nhân** (chỉ để học và luyện tập) mà chủ site có với một số bài **không cho phép đăng công khai.** Repo và site đều công khai, nên tài liệu thuộc loại này chỉ để trong thư mục riêng ngoài git và không đưa vào `docs/`. Chỗ nào cần chúng thì ghi vào báo cáo để chủ site tự xử lý.
- Bên thứ ba (bản thu, hình, trích đoạn) giữ giấy phép riêng: ghi người chơi hoặc tác giả, giấy phép và link nguồn ngay trên trang; file âm thanh lưu trên site có một dòng trong `docs/assets/audio/NGUON.txt`.

## Mẫu trang

### Bài học tác phẩm (`docs/piano/tac-pham/<slug>.md`)

Đối chiếu `docs/piano/tac-pham/beethoven-op49-2.md` và `chopin-nocturne-op9-2.md`. Thứ tự:

1. `# <Nhà soạn nhạc>: <Tên tác phẩm>`, rồi 1–2 câu mở đầu.
2. Hàng chip:

    ```html
    <div class="oz-piece" markdown>
    <span class="oz-chip">Sol trưởng · 2/2</span> <span class="oz-chip">Allegro, ma non troppo</span> <span class="oz-chip oz-chip--level">≈ Grade 5</span> <span class="oz-chip">Hình thức sonata, 122 ô nhịp</span>
    </div>
    ```

3. Hộp thông tin `??? info oz-piece-info "Thông tin tác phẩm và bản nhạc nên dùng"`, bên trong (thụt 4 dấu cách) bảng `| Mục | Thông tin |` với đúng các dòng: Nhà soạn nhạc (năm sinh–mất) · Tác phẩm (tên đầy đủ, số danh mục) · Sáng tác / xuất bản · Giọng · nhịp · tốc độ · Hình thức · Độ khó ("Khoảng ABRSM Grade N (ước lượng; chặng M của site)", Henle nếu đã kiểm) · Kỹ năng chính · Bản nhạc (IMSLP kèm gợi ý tìm, bản Urtext nên dùng).
4. `## Vì sao nên học bài này`: 3–5 gạch đầu dòng mở bằng cụm in đậm; có thể thêm `!!! tip "Chưa sẵn sàng?"` chỉ bài nên học trước.
5. `## Bối cảnh`.
6. `## Nghe trước khi tập`: 3–4 câu hỏi để nghe; so sánh vài nghệ sĩ thật sự gắn với tác phẩm; **khối cuối cùng của mục là khối bản thu** `<div class="oz-listen" data-rec="…"></div>` (xem mục Khối đặc biệt).
7. `## Theo dõi khi nghe`: câu "Dán link một bản thu vào khung phía trên (hoặc chọn một file trên máy), rồi bấm ghi mốc khi bạn nghe thấy từng sự kiện." rồi bảng `| Thời điểm | Sự kiện |`, cột thời điểm luôn là "…", 5–10 dòng đúng thứ tự trong nhạc, kể cả phần nhắc lại: `| … | **Tên đoạn** (ô 1–8): điều tai nghe thấy |`.
8. `## Cấu trúc`: hình `<!-- fig:p-<tên> -->` và `<!-- /fig:p-<tên> -->` trên hai dòng riêng; bảng các đoạn (`| Đoạn | Ô nhịp | Nội dung | Điều cần chú ý |`); có thể có `### <N> ô đầu` với trích đoạn thật đã đối chiếu.
9. `## Chỗ khó và cách tập`: bảng `| Chỗ khó | Vì sao khó | Cách tập |`, ít nhất 5 dòng (bài nâng cao ít nhất 6).
10. `## Bài tập chuẩn bị`: 2–3 mục `### 1. <tên>`, mỗi mục một khối ABC soạn cho trang này (hai tay, có số ngón) và 1–3 câu cách dùng.
11. `## Kế hoạch tập`: một câu dẫn (số tuần, phút mỗi ngày) và bảng `| Tuần | Việc chính | Máy đếm nhịp |` (3–6 tuần cho bài dễ, 6–12 tuần cho bài khó).
12. `## Diễn tấu`: các mục `###` như Tốc độ và nhịp, Sắc thái, Phát âm, Bàn đạp, Nốt hoa mỹ, Ấn bản (chọn mục phù hợp).
13. `## Lỗi thường gặp`, `## Học tiếp` (2–5 bài, link trang có thật), `## Kiểm tra nhanh` (khối quiz 3–5 câu về chính trang này), `## Nguồn`.

Độ dài: bài hiện có khoảng 2.400–4.400 chữ không kể khuông nhạc (trung vị khoảng 3.200), 2–6 khuông nhạc; giữ tương đương các bài cùng chặng.

### Hướng dẫn nghe (`docs/nghe-nhac/<slug>.md`)

Đối chiếu `docs/nghe-nhac/debussy-preludes.md`:

1. `# <Nhà soạn nhạc>: <Tên>`, bảng `| Mục | Thông tin |`: Nhà soạn nhạc · Tên đầy đủ · Sáng tác (và xuất bản) · (Biểu diễn lần đầu) · Thời kỳ · Thể loại · Độ dài.
2. `## Điều cần biết trước khi nghe`: vài đoạn mở bằng cụm in đậm, nghe bằng tai người chơi đàn (kết cấu, âm vực, bàn đạp, cách chạm phím).
3. `## Sơ đồ cấu trúc`: hình `g-<tên>`.
4. `## Nghe kèm bản thu`: một câu giới thiệu bản thu, rồi khối `oz-listen` (hoặc `<div class="oz-listen"></div>` nếu chưa có bản thu hợp lệ: người học tự dán link).
5. `## Theo dõi khi nghe`: một câu dẫn, bảng `| Thời điểm | Sự kiện |` 6–12 dòng.
6. `## Câu hỏi để nghe chủ động` (4–6), `## So sánh bản thu` (2–4 nghệ sĩ, không bịa năm hay hãng), `## Nếu bạn muốn chơi` (cấp và chặng thật, link bài học), `## Ghi chép của bạn` (`*(Dùng [mẫu ghi chép](mau.md) để điền cảm nhận.)*`), `## Nguồn`.

Tiêu đề `## Theo dõi khi nghe` phải viết đúng như vậy (ở cả bài học và hướng dẫn nghe): `listen.js` tìm bảng ghi mốc ngay sau tiêu đề này.

### Trang hòa âm bên phím (`docs/piano/hoa-am/<slug>.md`)

Đối chiếu `docs/piano/hoa-am/ket.md`: đoạn mở đầu nói bạn sẽ làm được gì bên đàn; 3–6 mục dạy, mỗi mục là giải thích ngắn, khối ABC hai tay, rồi các bước "Tập ở đàn" đánh số; `## Tập trong mọi giọng`; `## Kế hoạch 4 tuần` (`| Tuần | Việc | Mục tiêu |`); `## Kiểm tra nhanh`; `## Nguồn`. Hình đệm đã dạy ở `docs/piano/hop-am-rai.md`: link tới đó, không dạy lại.

## Quy ước ABC (khối ```abc, vẽ bằng abcjs, có nút phát)

- Thứ tự dòng đầu: `X:` (duy nhất trong trang), `T:` (nếu có), `M:`, `L:`, `Q:` (ví dụ `Q:1/4=72`), rồi `K:` cuối cùng. Số chỉ nhịp bằng số (`2/2`, không dùng `C|`).
- Khuông kép, đúng bố cục này; **mọi dòng nhạc bắt đầu bằng `[V:RH]` hoặc `[V:LH]`** (`abc_bars.py` nhóm bè theo tiền tố này):

    ```abc
    X:1
    T:Ví dụ
    M:4/4
    L:1/4
    Q:1/4=72
    %%score {RH LH}
    V:RH clef=treble
    V:LH clef=bass
    K:C
    [V:RH] !1!C D E F | G4 |]
    [V:LH] [C,E,G,]4 | !5!C,4 |]
    ```

- Quãng tám: `C` là C4 (Đô giữa), `c` là C5, `c'` là C6, `C,` là C3, `C,,` là C2. `=` bình, `^` thăng, `_` giáng.
- Trường độ phải là nốt viết được: với `L:1/8`, 5 hay 9 đơn vị không phải một nốt, phải nối (`e3-e2`).
- Số ngón `!1!`…`!5!` ngay trước nốt, ghi ở nốt đầu và mỗi lần đổi thế tay. Bàn đạp: `"_Ped."` chỗ đạp, `"_*"` chỗ nhả (abcjs không hiểu `!ped!`).
- Dùng được: `!p! !pp! !mp! !mf! !f! !ff!`, `!<(! … !<)!`, `!>(! … !>)!`, staccato `.C`, `!tenuto!`, `!accent!`, `!fermata!`, luyến `( )`, nối `-`, hợp âm `[CEG]2`, nốt hoa mỹ `{g}`, `!trill!`, `!uppermordent!`, `!lowermordent!`, `!turn!`, `!arpeggio!`, liên ba `(3abc`, chồng bè `&` (mỗi lớp đủ ô nhịp), chữ `"^…"`.
- Không dùng: `!ped!`, `!8va(!`, nhịp chấm kiểu `>`/`<`, dấu lặng nhiều ô `Z`.
- Mọi ô nhịp đủ độ dài, trừ ô lấy đà và ô cuối. `tests/abc_bars.py` kiểm độ dài, `tests/abc_warn.mjs` kiểm cảnh báo của abcjs.
- **Tác phẩm thật:** chỉ chép khi đã đối chiếu từng nốt với nguồn công cộng (Mutopia, IMSLP) và ghi ấn bản trên trang. Không đối chiếu được thì soạn bài tập chuẩn bị và ghi "soạn cho trang này". Mutopia trên GitHub: liệt kê thư mục bằng `https://api.github.com/repos/MutopiaProject/MutopiaProject/contents/ftp/<ThưMụcTácGiả>/<TácPhẩm>` (ví dụ `BeethovenLv`, `BachJS`, `ChopinFF`), tải file `.ly` ở `https://raw.githubusercontent.com/MutopiaProject/MutopiaProject/master/ftp/<đường-dẫn>.ly`. Công cụ đối chiếu đã dùng: `_imslp/_scripts/abc/oz_tools_local/lyrel.py` (đổi cao độ tương đối của LilyPond sang tuyệt đối) và `_imslp/_scripts/abc/ozchk/`.

## Khối đặc biệt

- **Quiz:**

    ````markdown
    ```quiz
    ? Câu hỏi?
    + Đáp án đúng
    - Đáp án sai
    > Giải thích ngắn.
    ```
    ````

- **Bản thu:** `<div class="oz-listen" data-rec="…"></div>`, trong đó `data-rec` là JSON đã escape HTML (dấu `"` thành `&quot;`, dấu `'` thành `&#x27;`), các khóa theo thứ tự:
    - `by`: người chơi; `note` (tùy chọn): ghi chú, ví dụ "file dừng ở khoảng 6:24";
    - `lic`: tên giấy phép (phạm vi công cộng ghi "phạm vi công cộng"); `licUrl`: link giấy phép (bỏ khi là phạm vi công cộng không có link);
    - `page`: trang mô tả file hoặc trang tác phẩm ở nguồn (trang IMSLP thì công cụ ghi "IMSLP", còn lại ghi "Wikimedia Commons");
    - `parts`: mảng phần `{t: tên phần (khi có nhiều phần), mp3: URL hoặc đường dẫn tương đối, src: file gốc (tùy chọn), d: độ dài tính bằng giây}`; thời gian tính liền qua các phần theo `d`;
    - `ref`: mốc tham khảo, mỗi phần tử là số giây hoặc `null`, theo thứ tự các dòng của bảng "Theo dõi khi nghe"; bỏ các `null` ở cuối. **Mốc phải đúng hoặc bỏ trống**: chỉ ghi khi đã căn và đối chiếu (lệch không quá 2 giây).
    - File lưu trên site nằm trong `docs/assets/audio/`; từ trang `piano/tac-pham/<slug>/` đường dẫn là `../../../assets/audio/<file>.mp3`.
- **Hình:** `<!-- fig:TÊN -->` và `<!-- /fig:TÊN -->` trên hai dòng riêng; định nghĩa trong `tools/figures.py`, ví dụ `"p-ten": form_map("Chú thích.", [("Nhãn", "chữ nhỏ", trọng số, "loại"), ...], "ghi chú tùy chọn"),`; loại: `a`, `b`, `c` (tương phản), `dev` (phát triển, không ổn định), `cad` (kết, âm nền), `coda`, `intro`, `x`; trọng số gần đúng theo số ô nhịp hoặc thời lượng; tiền tố `p-` cho bài học, `g-` cho hướng dẫn nghe. Rồi chạy `python3 tools/figures.py`.
- **Công cụ nhúng** (tự tải theo nhu cầu, dùng tiết kiệm): `<div class="oz-piano" data-range="C3-C5" data-notes="C4 E4 G4" data-play="chord"></div>`, `<div class="oz-metronome"></div>`; danh sách lớp ở README, mục "Viết bài mới".

## Checklist: thêm một bài học tác phẩm

- [ ] Kiểm tra bản quyền (mục Bản quyền) và tìm bản thu hợp lệ **trước khi viết**; không có bản thu thì báo trong báo cáo.
- [ ] Trang `docs/piano/tac-pham/<slug>.md` theo mẫu; trích đoạn thật đã đối chiếu; bài tập chuẩn bị soạn riêng.
- [ ] Hình `p-<tên>` trong `tools/figures.py`, chạy `python3 tools/figures.py`.
- [ ] Bản thu (`data-rec`) và mốc tham khảo.
- [ ] Cấp độ giống nhau ở mọi nơi: chip `oz-chip--level` và dòng "Độ khó"; bảng ở `docs/piano/tac-pham/index.md` ("Grade X (chặng N)"); nhóm nav trong `mkdocs.yml`; mục chặng trong `docs/piano/tac-pham-theo-cap.md`; `SUGGEST` trong `docs/assets/js/practice.js` (nếu đưa vào gợi ý); hàng "Tác phẩm" ở `docs/piano/lo-trinh.md` (nếu có); bảng Grade ↔ chặng ở `docs/piano/thay-va-thi.md` (nếu có); cuốn `piano-tac-pham` trong `hooks/books.py`, đúng thứ tự chặng.
- [ ] Mục "Chọn bài theo mục tiêu" ở `docs/piano/tac-pham/index.md` nếu bài hợp một con đường kỹ năng.
- [ ] Con số "34 bài học" ở mọi nơi (xem mục Con số viết tay).
- [ ] "Học tiếp" của 1–2 bài liền trước cùng chặng link tới bài mới; trang `docs/piano/nha-soan-nhac.md` cũng vậy nếu tác giả có mục ở đó.
- [ ] Mục "Kiểm tra nhanh" và "Nguồn" với nguồn thật.

## Checklist: thêm một hướng dẫn nghe

- [ ] Trang `docs/nghe-nhac/<slug>.md` theo mẫu; hình `g-<tên>`; bản thu hợp lệ hoặc khối `oz-listen` trống.
- [ ] Nav: đúng nhóm trong "Hướng dẫn nghe" (Nhạc piano hoặc theo thời kỳ), đúng thứ tự thời gian.
- [ ] `hooks/books.py`, cuốn `huong-dan-nghe` (`tests/site_static.py` báo nếu thiếu).
- [ ] Bảng ở `docs/nghe-nhac/index.md`; con số hướng dẫn nghe (và hướng dẫn nhạc piano) ở mọi nơi.
- [ ] Link từ các trang liên quan (bài học cùng tác phẩm, trang nhà soạn nhạc, thời kỳ).

## Con số viết tay

Nhiều trang ghi con số đếm được ("34 bài học", "42 hướng dẫn nghe, 16 về nhạc piano", "7 chặng", "Bảy cuốn"...). Khi thêm hoặc bớt trang, tìm và sửa mọi chỗ: README, `docs/index.md`, `docs/piano/index.md`, `docs/piano/tac-pham/index.md`, `docs/bat-dau/sach-in.md`, `docs/bat-dau/lo-trinh-nghe.md`, `docs/nhac-ly/index.md`, `hooks/books.py`. Kiểm thử tự động cho con số và cấp độ được thêm ở giai đoạn G1 của kế hoạch v15; khi có, mục này sẽ ghi cách đăng ký một con số mới.

## Tài liệu tham khảo cho agent

- Kế hoạch hiện hành: `plans/ke-hoach-v15.md`; báo cáo các giai đoạn: `plans/bao-cao-v15/`.
- Hai bản hướng dẫn viết nội dung đã dùng ở v12–v14: `_imslp/_scripts/briefs/BRIEF.md`, `BRIEF2.md`. Script cũ (chưa dọn) và mục lục: `_imslp/_scripts/README.md`. Khi bản cũ khác trang thật hiện nay, trang thật là chuẩn.
- Nguồn chung đã dùng để viết và kiểm tra nội dung: `docs/tai-lieu-tham-khao.md`.
