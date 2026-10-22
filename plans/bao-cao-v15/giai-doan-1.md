# Báo cáo giai đoạn 1: kiểm thử con số, cấp độ và anchor

Nhánh: `v15/g1-kiem-thu` (tạo từ `main` tại `30274c1`). Năm commit, mỗi commit đều qua `mkdocs build --strict` và `npm test`:

| Commit | Việc |
|---|---|
| `fc82dea` | G1.1: `tests/counts.py` |
| `e51ea33` | G1.2: `tests/levels.py` |
| `e4e7d33` | G1.3: `validation.anchors` trong `mkdocs.yml`, `tests/anchors.py` |
| `c8ef66d` | G1.4: `AGENTS.md` (mục Con số viết tay, danh sách nhóm `nhanh`, hai checklist), README (bước "Con số và cấp độ") |
| `a61c01e` | `tests/anchors.py` kiểm thêm file MP3 mà `data-rec` trỏ tới |

## File đã sửa và lý do

| File | Việc |
|---|---|
| `tests/counts.py` (mới) | Con số viết tay. `TRUTH`: 33 cách đếm số thật (nav đọc bằng PyYAML với constructor bỏ qua tag `!!python/name`; thư mục; `BOOKS`; `PAGES` của `tests/a11y.mjs`; mục "## Chặng" của lộ trình; `GROUPS` của `tests/run.mjs`; dữ liệu trong `recognition.js`, `loader.js`...). `CLAIMS`: 97 dòng, khớp 110 chỗ ghi; đọc được số viết bằng chữ ("Bảy cuốn", "Ba mươi tư tác phẩm", "Mười sáu hướng dẫn"). Khóa có tiền tố `<` cho câu "Hơn N". `IGNORE`: 37 dòng kèm lý do. Dòng `CLAIMS` hay `IGNORE` không còn khớp chỗ nào cũng là lỗi |
| `tests/levels.py` (mới) | Grade và chặng của 34 bài học ở 8 nơi trong kế hoạch, cộng hai nơi tìm thêm (xem dưới); 170 chỗ ghi chặng |
| `mkdocs.yml` | `validation: anchors: warn`: với `--strict`, link Markdown tới một mục không có là lỗi build |
| `tests/anchors.py` (mới) | Link nội bộ mà MkDocs không thấy: đường dẫn trang trong JavaScript, `href` trong HTML viết tay, MP3 tương đối trong `data-rec`; 69 link |
| `tests/run.mjs` | Ba script vào nhóm `nhanh`. Không thêm nhóm nên ma trận CI không đổi (`site_static.py` vẫn xác nhận hai nơi khớp nhau) |
| `README.md` | Ba dòng trong bảng kiểm thử; bước 8 "Con số và cấp độ" trong mục Viết bài mới |
| `AGENTS.md` | Mục Con số viết tay viết lại: cách sửa khi thêm bớt trang, cách đăng ký một con số mới (`CLAIMS`, `TRUTH`, khóa `<`), cách bỏ qua (`IGNORE`), những gì không bị quét. Danh sách nhóm `nhanh`; ghi chú build báo anchor hỏng; hai checklist nói kiểm thử nào kiểm bước nào |

## Build và kiểm thử

- `mkdocs build --strict`: `INFO - Documentation built in 2.30 seconds`, không cảnh báo (đã bật `validation.anchors: warn`, không có cảnh báo nhầm).
- `npm test`: `Kiểm thử: 4 nhóm chạy song song trong 10.6 giây, mọi nhóm đều đạt`. Dòng của ba kiểm thử mới:
    - `counts: 110 chỗ ghi con số đã kiểm, 214 cụm số + danh từ đã quét, 0 lỗi`
    - `levels: 34 bài học, 170 chỗ ghi chặng đã kiểm, 0 lỗi`
    - `anchors: 69 link trong JavaScript, HTML viết tay và data-rec, 0 lỗi`
- Thời gian chạy riêng: `counts.py` 0,37 giây, `levels.py` 0,07 giây, `anchors.py` 0,04 giây. Nhóm `nhanh` vẫn khoảng 8–9 giây.

## Bằng chứng kiểm thử bắt được lỗi

Mỗi lần sửa tạm một chỗ, chạy kiểm thử, rồi khôi phục (cây sạch trước mỗi commit).

| Kiểm thử | Sửa tạm | Kết quả |
|---|---|---|
| counts | `docs/index.md`: "42 hướng dẫn nghe" thành "43" | `x docs/index.md:69 ghi "43 hướng dẫn nghe" nhưng số hướng dẫn nghe trong nav là 42` |
| counts | `docs/bat-dau/sach-in.md`: "Bảy cuốn sách" thành "Tám cuốn sách" | `x docs/bat-dau/sach-in.md:3 ghi "Tám cuốn sách" nhưng số cuốn trong BOOKS (hooks/books.py) là 7` |
| counts | Thêm vào `docs/piano/gam.md` câu "Site có 35 bài học tác phẩm và mười hai công cụ." | `x docs/piano/gam.md:7 có cụm "35 bài học tác phẩm" chưa đăng ký: thêm vào CLAIMS (nếu là con số của site) hoặc IGNORE kèm lý do (tests/counts.py)`, và tương tự cho "mười hai công cụ" |
| counts | `docs/index.md`: "Hơn 20 công cụ" thành "Hơn 45" | `x docs/index.md:68 ghi "Hơn 45 công cụ" nhưng số công cụ (bộ chọn trong RULES của loader.js có dùng trong docs/) chỉ là 40` |
| counts | README: "16 về nhạc piano" viết lại thành "mười sáu bài về nhạc piano" | `x CLAIMS (README.md, '{N} về nhạc piano') không còn khớp chỗ nào` và `x README.md:64 có cụm "mười sáu bài" chưa đăng ký` |
| levels | `tac-pham/index.md`: Für Elise "(chặng 4)" thành "(chặng 5)" | `x docs/piano/tac-pham/index.md:57: fur-elise ghi chặng 5 nhưng Tác phẩm theo cấp độ xếp ở chặng 4` |
| levels | Chip của Für Elise "≈ Grade 5" thành "≈ Grade 6" | Ba lỗi: Grade 6 không hợp chặng 4; chip khác dòng "Độ khó"; bảng mục lục khác chip |
| levels | `mkdocs.yml`: chuyển Für Elise sang nhóm "Trung cấp cao (≈ Grade 6)" | `x mkdocs.yml (nhóm "Trung cấp cao (≈ Grade 6)"): fur-elise ghi chặng 5 nhưng Tác phẩm theo cấp độ xếp ở chặng 4` |
| levels | `practice.js`: đưa Für Elise vào `SUGGEST[5]` | `x docs/assets/js/practice.js:18 (SUGGEST): fur-elise ghi chặng 5 ...` |
| levels | `practice.js`: bỏ Für Elise khỏi `SUGGEST` (đối chứng, không đổi chặng) | Vẫn đạt, như mong đợi |
| levels | `the-loai.md`: link Für Elise kèm "(chặng 3)" | `x docs/piano/the-loai.md:18: fur-elise ghi chặng 3 ...` |
| levels | `thay-va-thi.md`: bảng quy đổi ghi chặng 3 là "Grade 3–4" | `x docs/piano/thay-va-thi.md:86: bảng ghi chặng 3 là "Grade 3–4" (phải là "Grade 3")` |
| levels | `beethoven-op49-2.md`, dòng "Độ khó": "chặng 4 của site" thành "chặng 5" | `x ... (dòng "Độ khó"): beethoven-op49-2 ghi chặng 5 ...` |
| build | `luyen-tap/index.md`: link `nghe-quang.md#khong-co-muc-nay` | `WARNING - Doc file 'luyen-tap/index.md' contains a link '../luyen-tai/nghe-quang.md#khong-co-muc-nay', but the doc 'luyen-tai/nghe-quang.md' does not contain an anchor '#khong-co-muc-nay'.` rồi `Aborted with 1 warnings in strict mode!` |
| build | `bach-prelude-do.md`: link trong cùng trang `#khong-co-boi-canh` | `WARNING - ... contains a link '#khong-co-boi-canh', but there is no such anchor on this page.` rồi dừng |
| build | `hooks/redirects.py`: đích `luyen-tap/hoa-bieu/#vong-quang-nam-cu` | `ERROR - redirects: trang luyen-tap/hoa-bieu/ không có mục #vong-quang-nam-cu (cho luyen-tap/vong-quang-nam/)` rồi `Aborted with a BuildError!` |
| anchors | `plan.js`: `#luyen-voi-cong-cu` thành `#cong-cu`; `luyen-tap/hoa-bieu/` thành `hoa-bieu-cu/` | `x docs/assets/js/plan.js:11: link tới luyen-tai/nghe-gam/#cong-cu nhưng trang không có mục #cong-cu`; `x docs/assets/js/plan.js:10: link tới luyen-tap/hoa-bieu-cu/ ...` |
| anchors | `grieg-arietta.md`: MP3 `../../../assets/audio/...` thành `../../assets/audio/...` | `x docs/piano/tac-pham/grieg-arietta.md:50: link tới piano/assets/audio/grieg-arietta.mp3 nhưng site/ không có` |

## Quyết định ngoài phần tối thiểu của kế hoạch

- **Con số đăng ký thêm** (ngoài 16 khóa tối thiểu), tìm được khi quét: số bài luyện tai ("Lộ trình 5 bài"); số bài trong 10 bài đầu tiên ("10 bài hai tay có số ngón", "Lộ trình 10 bài"...); "Năm bài này" của phần 6 Nhạc lý; "10 tác phẩm để nghe" ở sáu trang thời kỳ (đếm danh sách trên từng trang, phải bằng nhau); bộ nghe mù (10 bản thu, đếm `TRACKS`); 10 đoạn nhạc của công cụ đoán phong cách (`EX`); 13 bản thu lưu trên site cho 10 bài học (trang Tài liệu tham khảo); "cả 34 bài đều có một bản thu" (kiểm cả số bài học lẫn số bài có `data-rec`); 4 nhóm kiểm thử (README, AGENTS.md); "hơn 30 nhà soạn nhạc piano", "khoảng 37 nhà soạn nhạc", "hơn 100 thuật ngữ"; vài con số đếm trên chính trang ("kèm sáu bài tập", "Năm bài tập", "Bốn công cụ dưới đây", "Hai công cụ").
- **Chỗ ghi tìm thêm cho khóa có sẵn:** "Ba mươi tư tác phẩm" (`tac-pham/index.md:3`), "Mười sáu hướng dẫn về nhạc piano" (`nghe-nhac/index.md:75`), "Bài 1–14", "Bài 15–32" (sách in), và `AGENTS.md`.
- **`AGENTS.md` cũng được quét** (kế hoạch chỉ nói `docs/`, README, `hooks/books.py`): sổ tay ghi "34 bài học tác phẩm", "lộ trình 7 chặng", và các con số ví dụ trong mục Con số viết tay.
- **Quy tắc quét:** không quét khoảng ("2–3 bản thu"), số một, và số viết bằng chữ từ hai đến bốn đi với danh từ chung (bài, trang, tác phẩm, bản thu, nhóm, nhà soạn nhạc, thuật ngữ, đoạn nhạc). Với danh từ riêng của site (hướng dẫn nghe, bài học, bài nhạc lý, bài ôn tập, công cụ, cuốn, chặng, tác phẩm piano) thì quét mọi số từ hai. Lý do: "hai bài", "ba bài" có khoảng 60 chỗ trong văn xuôi ("chơi ba bài cho người thân nghe"), không chỗ nào là con số của site; bắt đăng ký chúng chỉ làm danh sách bỏ qua phình ra ở mỗi bài học mới. Ví dụ số viết bằng chữ của kế hoạch ("năm, sáu, bảy, mười") cũng bắt đầu từ năm.
- **"10 bài đầu tiên"** được bỏ qua như tên trang (theo ví dụ của kế hoạch), nhưng các câu mô tả số bài ("10 bài hai tay có số ngón", "Xong cả 10 bài") được đăng ký và so với số mục "## N." trong trang.
- **Cặp bài học và hướng dẫn nghe cùng tác phẩm** ("Năm bài học có thêm hướng dẫn nghe"): tính tự động, hai trang là một cặp khi cùng nhà soạn nhạc và có chung một số danh mục (Op. 27, D. 899, S. 541...) giữa dòng "Tác phẩm" của bài học và dòng "Tên đầy đủ" của hướng dẫn. Ra đúng năm cặp đang liệt kê. Chỉ dựa vào link qua lại thì ra 11 cặp (nhiều bài link sang hướng dẫn của tác phẩm khác), nên không dùng.
- **Dòng "Độ khó" của bài Schumann Op. 68** ghi Grade riêng cho từng bài (1; 2; 2–3), còn chip ghi "Grade 1–3". Kiểm thử chấp nhận khi Grade đầu tiên của dòng trùng chip, hoặc khoảng từ Grade thấp nhất tới cao nhất của dòng trùng chip. Không sửa nội dung trang.
- **Hai nơi ghi chặng tìm thêm** cho `levels.py`: chữ "chặng N" trong dòng "Độ khó" của 8 bài, và link tới bài học kèm "(chặng N)" ở mọi trang (`the-loai.md` có 12 chỗ, `tac-pham-theo-cap.md`, `grieg-concerto.md`). Ngoài ra kiểm nhãn Grade của từng chặng ở tiêu đề mục, nhóm nav, bảng tổng quan lộ trình và bảng ở Thầy và thi, để bảng quy đổi không lệch giữa các nơi.
- **`tests/anchors.py` dù `validation.anchors` không báo nhầm:** kế hoạch chỉ dùng script này thay cho cách của MkDocs khi có cảnh báo nhầm. Ở đây nó bổ sung chứ không thay: MkDocs không thấy link trong JavaScript (`plan.js` có 4 link kèm `#luyen-voi-cong-cu`, `practice.js` có 20 đường dẫn bài học), `href` trong HTML viết tay (7 nút "Mở sách") và MP3 trong `data-rec` (script v14 `_imslp/_scripts/qa/links.py` có kiểm phần này).

## Chỗ chưa chắc hoặc đã bỏ qua

- `anchors.py` chỉ nhận đường dẫn viết nguyên trong một chuỗi JavaScript và bắt đầu bằng tên một mục của site (`piano/`, `luyen-tap/`...). Đường dẫn ghép từ nhiều mảnh lúc chạy không kiểm được.
- Cách tìm cặp bài học và hướng dẫn nghe cần số danh mục. Một cặp tương lai không có số danh mục (ví dụ một bài học trong *Préludes* của Debussy, hướng dẫn nghe này không ghi số L.) sẽ không được đếm; khi đó cần sửa `lesson_guide_pairs()` hoặc thêm số danh mục vào dòng "Tên đầy đủ".
- Nhắc trước cho giai đoạn sau: G5 thêm bài luyện tai thứ sáu thì "Lộ trình 5 bài" và "Sau 5 bài trên" phải sửa (kiểm thử sẽ báo). G6 thêm bài học *Alla turca* (K. 331) thì số cặp thành sáu: sửa đoạn "Năm bài học có thêm hướng dẫn nghe" và danh sách link trong đoạn.

## Việc ngoài phạm vi (ghi lại, chưa làm)

- `docs/lich-su/index.md` viết "Mỗi thời kỳ có một trang chi tiết (bối cảnh, âm thanh đặc trưng, nhạc cụ, 10 tác phẩm để nghe)" rồi liệt kê cả Đương đại, nhưng `docs/lich-su/duong-dai.md` không có mục này (các mục: nhà soạn nhạc nên nghe, tin gần đây, tên tuổi Việt Nam, theo dõi tin tức, các cuộc thi). Nên bỏ Đương đại khỏi câu đó hoặc thêm mục cho trang Đương đại.
- Trước G1, README ghi `mkdocs build --strict` "bắt link nội bộ và anchor hỏng", nhưng MkDocs 1.6.1 mặc định `validation.links.anchors: info` nên anchor hỏng không làm dừng build. Từ commit `e4e7d33` câu này mới đúng.
- Dòng "Độ khó" của `schumann-album.md` có thể mở đầu bằng "Khoảng ABRSM Grade 1–3 (ước lượng)" cho giống mẫu trong `AGENTS.md`; kiểm thử không đòi việc này.

## Nguồn đã dùng để kiểm chứng

- Kế hoạch `plans/ke-hoach-v15.md`, mục G1; `AGENTS.md`.
- MkDocs 1.6.1 trong `.venv`: `mkdocs/config/defaults.py` (`validation.links.anchors` mặc định `info`); tài liệu cấu hình, mục validation: https://www.mkdocs.org/user-guide/configuration/#validation. Hành vi đã kiểm bằng thử nghiệm ở bảng trên (link sang trang khác, link trong cùng trang).
- `hooks/redirects.py`: đích kèm `#mục` được kiểm trong `on_post_build`, lỗi là `PluginError` nên dừng build ngay cả khi không có `--strict`.
- `_imslp/_scripts/qa/links.py` (script kiểm link v14) để so phạm vi với `tests/anchors.py`.
- Trang thật trong `docs/` và dữ liệu trong `docs/assets/js/` (`loader.js`, `recognition.js`, `practice.js`, `plan.js`) cho từng cách đếm.
