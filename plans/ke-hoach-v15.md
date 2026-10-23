# Kế hoạch phiên bản 15

Tài liệu này chia việc của phiên bản 15 thành các giai đoạn nhỏ để giao cho agent làm lần lượt. Mỗi giai đoạn ghi rõ phạm vi, việc cần làm, tiêu chí xong và cách kiểm tra. Claude chỉ review sau mỗi giai đoạn.

Cơ sở của kế hoạch:

- Commit `ed69d89` (phiên bản 14, rà soát lần hai).
- Hai bản nhận xét của agent rà soát: trùng lặp và những thứ còn thiếu; hiệu năng (Lighthouse); mức độ nội dung và thứ tự ưu tiên bổ sung.
- Báo cáo rà soát lần hai của Claude (những gì đã sửa trong `ed69d89`).

Mục tiêu của v15, theo thứ tự:

1. Kỹ thuật an toàn, đo được: kiểm thử cho con số và cấp độ, tải trang nhanh hơn, trợ năng đạt 100.
2. Dọn nốt phần trùng lặp còn lại.
3. Âm thanh: đưa công cụ vào repo, thêm bản thu cho các hướng dẫn nghe nhạc piano.
4. Nội dung mới: chơi theo tai, bài phổ biến ngoài nhạc cổ điển, bài học tác phẩm lấp khoảng trống tiết mục.
5. Những việc cần bạn quyết: giấy phép, release, kênh góp ý, video, blog.

## Cách dùng tài liệu này

1. Giao cho mỗi agent đúng một giai đoạn (hoặc một lô của giai đoạn G6), theo thứ tự ở mục 3.
2. Dùng lời giao việc mẫu ở cuối tài liệu, thay số giai đoạn.
3. Agent làm trên nhánh riêng, chỉ commit khi build và kiểm thử đều đạt, rồi viết báo cáo vào `plans/bao-cao-v15/`.
4. Gửi Claude tên nhánh và file báo cáo để review. Sửa xong mới gộp vào `main`; Claude cập nhật mục Tiến độ, rồi sang giai đoạn sau.
5. Việc ghi "bạn quyết" chỉ giao cho agent sau khi bạn đã chọn (ghi lựa chọn ngay trong mục G7).

Từ ngày 22/10/2026, bạn review một lần khi xong cả v15, thay cho review sau từng giai đoạn. Mỗi việc vẫn làm trên nhánh riêng và có báo cáo. Việc nào xong (build và kiểm thử đạt) thì được gộp kiểu fast-forward vào nhánh tích hợp `v15/tich-hop`. `main` giữ nguyên bản đã push cho tới khi bạn review xong.

## Tiến độ

Cập nhật 22/10/2026 (tối).

| Giai đoạn | Trạng thái | Báo cáo |
|---|---|---|
| G0. Sổ tay cho agent, kiểm tra ABC, mốc đo | Xong, đã review | `plans/bao-cao-v15/giai-doan-0.md` |
| G1. Kiểm thử con số, cấp độ, anchor | Xong, đã review | `plans/bao-cao-v15/giai-doan-1.md` |
| G2. Hiệu năng và trợ năng | Xong, đã review (G2.5 thay bằng việc lẻ `mermaid`) | `plans/bao-cao-v15/giai-doan-2.md` |
| G3. Dọn trùng lặp còn lại | Xong, đã review | `plans/bao-cao-v15/giai-doan-3.md` |
| G4a. Công cụ âm thanh | Xong, đã review | `plans/bao-cao-v15/giai-doan-4a.md` |
| G4b. Bản thu cho 7 hướng dẫn nghe nhạc piano | Xong, đã push ngày 22/10; review cùng cả v15. Hai bản IMSLP và hai bản Marcelle Meyer chỉ dẫn link, theo quyết định của bạn | `plans/bao-cao-v15/giai-doan-4b.md` |
| G7.2. Release `v14` | Xong ngày 22/10; số đo trên site thật: 99, 100, 100, 100 ở cả ba trang | `plans/v15-do-luong.md` |
| G7.1. Giấy phép cho phần chữ | Xong trên `v15/tich-hop` (CC BY-SA 4.0, mã nguồn vẫn MIT) | |
| Việc lẻ `kiem-link`, `khoa-goi`, `mermaid` | Xong trên `v15/tich-hop` | |
| Việc lẻ `nguon`, G5 | Đang làm | |
| G4c, G6 | Đang khảo sát (bản quyền, ấn bản, bản thu) | |
| G7.3 | Bạn chọn để sau | |
| G7.4, G7.5, G8 | Chưa làm | |

Review của Claude cho G0–G4a: `plans/bao-cao-v15/review-g0-g4a.md`. Báo cáo và review là biên bản, không cần sửa. Việc còn mở trong đó đã chép vào các ghi chú dưới đây; chỗ nào cần đọc thêm báo cáo thì ghi chú nói rõ.

Ghi chú từ các báo cáo cho giai đoạn sau:

- G4b: các file K. 331 trên Commons phần lớn là nhạc dựng từ MIDI (các file "Variation…", bộ của Bernd Krueger): không dùng; bản Leonid Kreutzer phải xác định năm phát hành trước (xem báo cáo G4a, mục Ghi chú cho G4b). piano-midi.de chặn User-Agent của dự án và KernScores đang bảo trì: nguồn bản nhạc số lấy theo `tools/audio/align/sources.json` (`fetch.py --from _imslp/_scripts/align/src` cho file đã có).
- G4b, thêm: căn mốc cho ba trang đã có bản thu nhưng chưa có mốc: `docs/nghe-nhac/mozart-eine-kleine.md`, `docs/nghe-nhac/vivaldi-mua-xuan.md`, `docs/piano/tac-pham/chopin-valse-la-thu.md` (`tools/audio/attach.py --ref`, theo bước 4 của G4b).
- G5: thêm bài luyện tai thứ sáu thì sửa "Lộ trình 5 bài" và "Sau 5 bài trên" (`tests/counts.py` báo).
- G6: thêm bài học *Alla turca* thì số cặp bài học có hướng dẫn nghe cùng tác phẩm thành sáu: sửa đoạn "Năm bài học…" và danh sách link ở `docs/piano/tac-pham/index.md`.

Việc lẻ, mỗi việc một nhánh nhỏ, giao bất kỳ lúc nào bằng lời mẫu (thay "Giai đoạn N" bằng tên việc, nhánh `v15/<tên>`, báo cáo `plans/bao-cao-v15/viec-le-<tên>.md`):

- `nguon`: thêm mục "## Nguồn" với nguồn thật cho 9 trang: `docs/hinh-thuc/minuet-trio.md`, `overture.md`, `scherzo.md`, `symphonic-poem.md` và `docs/nhac-ly/28-ket-cau.md` đến `32-ky-thuat-the-ky-20.md`. Trang mục lục, ôn tập 1–3 và từ điển không bắt buộc.
- `mermaid`: bỏ quy tắc mermaid trong `docs/assets/js/loader.js` (`EXT.mermaid`, dòng `[".mermaid", …]`, `mermaid` trong `NOW`) và kiểm tra 1 của `tests/site_static.py`, vì Material tự tải mermaid. Xem sơ đồ ở `hinh-thuc/sonata/` trên Chrome có mạng trước và sau khi bỏ.
- `kiem-link` (thêm ngày 22/10/2026): issue #1 của công cụ kiểm tra link có 21 lỗi, phần lớn là báo nhầm:
    - 12 link tới abrsm.org bị báo vì trang chặn robot;
    - 5 link tới sách in, vì sách chỉ có sau khi build;
    - trang chủ Oxford Music Online chuyển hướng vòng quanh trang đăng nhập.

    Cần sửa cài đặt kiểm tra, sửa các link hỏng thật, và để mỗi loại lỗi chỉ giữ một issue, thay vì mở thêm issue mỗi tuần.
- `khoa-goi` (thêm ngày 22/10/2026): `requirements.txt` chỉ khóa 3 gói. Các gói kéo theo tự lên bản mới mỗi lần build: CI đã cài `python-dateutil` 3.0.0, còn máy dự án ở 2.9.0. Khóa mọi gói.

Không cần làm: bấm Ctrl+P trong vài giây đầu thì bản in có thể thiếu khuông ở xa (nút "In bài này" không bị); ba file MP3 còn dưới 3 giây im lặng ở cuối.

## 1. Nhận xét nào đã xong, nào còn lại

Một số nhận xét được viết trước commit `ed69d89`, nên đã được xử lý xong hoặc xử lý khác đi một chút. Bảng dưới đây là trạng thái thật để agent không làm lại.

| Nhận xét | Trạng thái sau `ed69d89` | Còn làm | Giai đoạn |
|---|---|---|---|
| Sáu trang nhạc cụ chủ yếu là phần học chơi | **Xong.** Đã bỏ lộ trình, sơ đồ cần đàn và "10 bài đầu tiên" (60 khuông nhạc, nhiều bài chép sai nốt) ở violin, cello, guitar, sáo, clarinet, trumpet. Mỗi trang giữ phần nghe (âm thanh, vai trò, nên nghe, nghệ sĩ) và một đoạn "Nếu muốn học chơi" ngắn. Không thêm danh sách tài nguyên học nhạc cụ khác, vì site tập trung vào piano. | Không | |
| Hình thức nhỏ và Minuet–trio viết ở hai nơi; mục Hình thức không có link sang bài 31 | Chưa làm | Chọn một nơi viết chi tiết, nơi kia tóm tắt và dẫn link | G3 |
| Hai trang "Nhà soạn nhạc" có 19 người chung, trang Lịch sử không link sang trang Piano | Chưa làm (trang Lịch sử có 0 link sang trang Piano, chiều ngược lại có 1) | Link qua lại cho từng người | G3 |
| Hai bài Minuet của Petzold lặp khoảng 500 chữ | **Phần lớn đã xong ở v14:** mục Bối cảnh của bài Sol thứ chỉ còn tóm tắt và dẫn link sang bài Sol trưởng. Phần còn trùng (khoảng 240 chữ) là khung mẫu (hộp thông tin, câu dẫn bảng theo dõi) và danh sách nguồn. | Không làm thêm: nguồn phải ghi ở từng trang | |
| Cấp độ của 34 bài học ghi ở nhiều nơi | Hiện khớp nhau nhưng chưa có kiểm thử. Thực tế có 8 nơi (xem G1.2) | Kiểm thử tự động | G1 |
| Con số viết tay ("42 hướng dẫn nghe"…) | `ed69d89` đã sửa các chỗ sai tìm được (README: 10 trang kỹ thuật, 6 trang tập luyện, 9 trang hình thức; trang Sách in: bảy cuốn và nội dung từng cuốn) nhưng chưa có kiểm thử | Kiểm thử tự động | G1 |
| Chỉ mục tìm kiếm tải ngay ở mọi trang | Chưa làm | Hoãn tải | G2 |
| Khuông nhạc và công cụ khởi tạo ngay khi mở trang | Chưa làm | Khởi tạo khi cuộn tới gần | G2 |
| Font | Chưa làm | Bớt độ đậm, tự host | G2 |
| Trợ năng 93 | Chưa làm | Nhãn hộp tìm kiếm, gạch chân link | G2 |
| Script xử lý âm thanh nằm ngoài repo | Chưa làm. Bản gốc (chưa dọn) đã được chép vào `_imslp/_scripts/` (không đưa lên git) | Đưa vào `tools/audio/` | G4a |
| Bản thu cho hướng dẫn nghe nhạc piano | 7 trang chưa có: Scarlatti, Mozart K. 331, Mozart Concerto số 21, Grieg, Mussorgsky, Rachmaninoff số 2, *Rhapsody in Blue*. Pärt (*Spiegel im Spiegel*) còn bản quyền: giữ để người học tự dán link | Thêm bản thu, căn mốc | G4b |
| Luyện tai cho người chơi đàn | Chưa làm | Bài "Chơi theo tai bên phím đàn" | G5 |
| Bài phổ biến ngoài nhạc cổ điển (chỉ có *Mariage d'Amour*) | Chưa làm | Thêm 5 bài, không in khuông nhạc | G5 |
| Tiết mục lệch: 17/34 bài thời Lãng mạn, thế kỷ 20 chỉ có Satie và *Clair de lune*, chưa có nhà soạn nhạc nữ, chưa có tác phẩm Việt Nam | Chưa làm | Bài học mới theo lô | G6 |
| Video minh họa kỹ thuật | Chưa làm | Bạn duyệt danh sách đề cử | G7 |
| Giấy phép cho phần chữ | Chưa làm (repo chỉ có giấy phép MIT) | Bạn quyết | G7 |
| Kênh góp ý cho người không dùng GitHub | Chưa làm (link GitHub Issues ở Hỏi đáp, Tài nguyên, Tài liệu tham khảo, cộng nút sửa trang) | Bạn quyết | G7 |
| GitHub Release (lỗi 404 ở console mọi trang) | Chưa làm | Tạo release `v14` ngay | G7.2 |
| Blog chỉ có 2 bài | `ed69d89` viết lại lời giới thiệu trang blog | Bạn quyết | G7 |
| Giáo trình ABRSM 2027–2028 | Đã có trong checklist hằng quý ở trang Cập nhật | Rà vào tháng 1/2027 | Bảo trì |
| Mỗi đợt một chủ đề, commit khi build và test đạt | | Áp dụng cho mọi giai đoạn | Quy tắc chung |

Số đo Lighthouse của người rà soát (điện thoại, 4G chậm mô phỏng, đo từ máy của họ), dùng để tham khảo; G0 đo lại bằng cách đo cố định:

| Trang | Hiệu năng | Trợ năng | Thực hành tốt | SEO |
|---|---|---|---|---|
| Trang chủ | 65 | 93 | 96 | 100 |
| Bài học Für Elise | 52 | 93 | 96 | 100 |
| Debussy: Préludes | 96 | 93 | 96 | 100 |

## 2. Quy tắc chung cho mọi giai đoạn

### Môi trường và lệnh

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt    # mkdocs 1.6.1, mkdocs-material 9.7.7, pymdown-extensions 10.21.2 (khóa mọi gói)
npm ci                             # abcjs, axe-core, jsdom, lunr: chỉ dùng cho kiểm thử
mkdocs build --strict              # phải sạch cảnh báo
npm test                           # mọi nhóm: nhanh, trang-1, trang-2, a11y (cần site/ đã build)
```

- `npm test -- nhanh` chạy riêng một nhóm.
- Thêm hoặc đổi tên nhóm kiểm thử thì sửa cả ma trận trong `.github/workflows/test.yml`; `tests/site_static.py` kiểm tra hai nơi khớp nhau.
- `python3 tools/figures.py` sinh lại các hình giữa `<!-- fig:TÊN -->` và `<!-- /fig:TÊN -->`; `npm test` có bước `--check`.

### Cách làm

- Mỗi giai đoạn một nhánh `v15/gN-<tên-ngắn>`. Commit nhỏ, mỗi commit một việc, chỉ commit khi `mkdocs build --strict` và `npm test` đều đạt. Không gộp nhiều chủ đề vào một đợt (đợt v14 gộp ba việc vào 147 file nên khó thấy chỗ hỏng).
- Không push, không sửa lịch sử của `main`, không xóa file ngoài phạm vi. Không sửa `.claude/` và `site/`. Thư mục `_imslp/` (không đưa lên git) chỉ được đọc, trừ khi giai đoạn nói khác.
- Nếu agent làm trong một git worktree riêng: thư mục `_imslp/` (không đưa lên git) và `plans/` (khi chưa được commit) không có trong worktree; đọc chúng ở thư mục dự án gốc `/Users/mitu/Desktop/work/projects/opus-zero/`.
- Commit message tiếng Việt: một dòng tóm tắt, rồi các gạch đầu dòng.
- Báo cáo cuối giai đoạn: `plans/bao-cao-v15/giai-doan-N.md`, gồm file đã sửa và lý do, kết quả build và test (dán dòng tóm tắt), số đo nếu có, chỗ chưa chắc chắn hoặc đã bỏ qua, nguồn đã dùng để kiểm chứng.

### Nội dung

- Tiếng Việt, gọi người đọc là "bạn", câu ngắn, in đậm thuật ngữ ở lần xuất hiện đầu, dùng bảng cho so sánh và kế hoạch. Không quảng cáo, không emoji.
- Tên nốt: "Đô (C)", "Đô giữa (C4)", "Sol trưởng", "La thứ"; ký hiệu ♯ ♭ ♮; quãng tám theo ký hiệu khoa học (C4 là Đô giữa).
- Cấp độ: "khoảng ABRSM Grade N", kèm chặng 1–7 theo bảng ở `docs/piano/lo-trinh.md`. Mức độ khó của Henle chỉ ghi khi đã đọc trên trang henle.de của đúng tác phẩm.
- Không bịa năm, số danh mục, trích dẫn, bản thu (năm, hãng) hay con số. Không chắc thì kiểm chứng hoặc bỏ đi. Mỗi trang kết thúc bằng mục "## Nguồn" với nguồn thật.
- Khuông nhạc (khối ```abc): chỉ chép tác phẩm thật khi đã đối chiếu từng nốt với nguồn công cộng (Mutopia, IMSLP) và ghi ấn bản trên trang. Không đối chiếu được thì soạn bài tập chuẩn bị và ghi "soạn cho trang này".
- Bản quyền: tác phẩm còn bảo hộ thì không chép khuông nhạc, tên nốt của giai điệu hay lời. Bản thu chỉ nhận phạm vi công cộng, CC0, CC BY, CC BY-SA; không nhận NC, ND.
- Giấy phép dùng cá nhân (chỉ để học và luyện tập) mà chủ site có với một số bài không cho phép đăng công khai. Repo và site đều công khai, nên tài liệu thuộc loại này chỉ để trong thư mục riêng ngoài git, không đưa vào `docs/`; chỗ nào cần chúng thì ghi vào báo cáo để chủ site tự xử lý.
- Mạng: gửi User-Agent có link repo (`https://github.com/mtuann/opus-zero`), tôn trọng giới hạn tần suất (Wikimedia trả 429 khi gọi dồn). Không vượt cơ chế tải của IMSLP: bản thu IMSLP do bạn tải tay vào `_imslp/`.
- Thêm, bớt hoặc đổi tên trang thì cập nhật: nav trong `mkdocs.yml`; `hooks/books.py` nếu trang thuộc một cuốn sách in; các trang mục lục liên quan; con số (kiểm thử G1 sẽ báo); `hooks/redirects.py` (biến `REDIRECTS`) nếu địa chỉ cũ đã tồn tại.

## 3. Thứ tự

| Bước | Giai đoạn | Cỡ | Cần xong trước |
|---|---|---|---|
| 1 | G0. Sổ tay cho agent, kiểm tra ABC, mốc đo ban đầu | nhỏ | |
| 2 | G1. Kiểm thử con số, cấp độ, anchor | vừa | G0 |
| 3 | G2. Hiệu năng và trợ năng | vừa | G0 |
| 3 | G3. Dọn trùng lặp còn lại | nhỏ | G1 |
| 4 | G4a. Đưa công cụ âm thanh vào `tools/audio/` | vừa | G0 |
| 5 | G4b. Bản thu cho 7 hướng dẫn nghe nhạc piano | vừa | G4a |
| 6 | G5. Chơi theo tai; bài phổ biến ngoài nhạc cổ điển | vừa | G1 |
| 7 | G6. Bài học tác phẩm mới, mỗi lô 3 bài | lớn | G1, G4a |
| bất kỳ lúc nào | G7. Việc bạn quyết | nhỏ | quyết định của bạn |
| bất kỳ lúc nào | Việc lẻ ở mục Tiến độ: `nguon`, `mermaid` | nhỏ | |
| cuối | G8. Phát hành v15 | nhỏ | các giai đoạn đã chọn |

G2 và G3 làm song song được vì ít đụng file chung. Các giai đoạn khác nên gộp vào `main` lần lượt, để tránh xung đột ở `mkdocs.yml`, `docs/index.md` và `README.md`. G7.2 (tạo release) nên làm ngay vì không phụ thuộc giai đoạn nào.

## G0. Sổ tay cho agent, kiểm tra ABC, mốc đo ban đầu

**Mục tiêu:** agent sau tự có đủ ngữ cảnh khi mở repo; có số đo để so sánh.

1. Tạo `AGENTS.md` ở gốc repo và `CLAUDE.md` chỉ một dòng `@AGENTS.md`. Nhiều agent (Codex, Copilot…) tự đọc `AGENTS.md`; Claude Code đọc `CLAUDE.md`, và dòng `@AGENTS.md` nạp cùng nội dung. `AGENTS.md` gồm:
    - Dự án: site MkDocs Material tiếng Việt, học piano cổ điển cho người lớn từ con số 0. Trục chính là mục Piano; các mục khác phục vụ việc nghe và hiểu.
    - Cấu trúc thư mục (lấy từ README), lệnh build và kiểm thử (mục 2 ở trên).
    - Quy tắc nội dung và bản quyền (mục 2).
    - Mẫu trang, lấy từ trang thật hiện nay, không chép mẫu cũ:
        - Bài học tác phẩm, đối chiếu `docs/piano/tac-pham/beethoven-op49-2.md` và `chopin-nocturne-op9-2.md`: hàng chip `oz-piece`; hộp `??? info oz-piece-info` với các dòng Nhà soạn nhạc · Tác phẩm · Sáng tác / xuất bản · Giọng · nhịp · tốc độ · Hình thức · Độ khó · Kỹ năng chính · Bản nhạc; các mục Vì sao nên học bài này, Bối cảnh, Nghe trước khi tập (kết thúc bằng khối `oz-listen`), Theo dõi khi nghe, Cấu trúc (hình `p-<slug>`), Chỗ khó và cách tập, Bài tập chuẩn bị, Kế hoạch tập, Diễn tấu, Lỗi thường gặp, Học tiếp, Kiểm tra nhanh, Nguồn.
        - Hướng dẫn nghe, đối chiếu `docs/nghe-nhac/debussy-preludes.md`.
        - Trang hòa âm bên phím, đối chiếu `docs/piano/hoa-am/ket.md`.
    - Quy ước ABC: thứ tự dòng đầu khối X, T, M, L, Q, rồi K cuối cùng; số chỉ nhịp bằng số (2/2, không dùng C|); khuông kép dùng `%%score {RH LH}` với `V:RH clef=treble` và `V:LH clef=bass`, mỗi dòng nhạc bắt đầu bằng `[V:RH]` hoặc `[V:LH]`; số ngón `!1!` đến `!5!`; bàn đạp viết `"_Ped."` và `"_*"` (abcjs không hỗ trợ `!ped!`); không dùng `!8va(!`, nhịp chấm kiểu `>`/`<`, dấu lặng nhiều ô `Z`; mọi ô nhịp đủ độ dài, trừ ô lấy đà và ô cuối.
    - Khối đặc biệt: khối ```quiz (dòng `?` câu hỏi, `+` đáp án đúng, `-` đáp án sai, `>` giải thích); khối bản thu `<div class="oz-listen" data-rec="…">` (định dạng ở G4a); hình `<!-- fig:TÊN -->`; các công cụ nhúng như `oz-piano`, `oz-metronome`.
    - Checklist "thêm một bài học tác phẩm" và "thêm một hướng dẫn nghe" (các nơi phải cập nhật, xem G6).
    - Tài liệu tham khảo: hai bản hướng dẫn viết nội dung đã dùng cho các agent ở v12–v14, chép ở `_imslp/_scripts/briefs/`. Khi bản cũ khác trang thật hiện nay, trang thật là chuẩn.
2. Thêm `tests/abc_warn.mjs` (bản cũ để tham khảo: `_imslp/_scripts/abc/abcwarn.cjs`): đọc mọi khối ```abc trong `docs/` bằng `abcjs.parseOnly`, in khối có cảnh báo (file và số thứ tự khối), thoát mã lỗi nếu có. Đưa vào nhóm `nhanh` trong `tests/run.mjs`. Hiện `tests/abc_bars.py` chỉ kiểm độ dài ô nhịp. Nếu trang hiện có báo cảnh báo thật, sửa (đối chiếu nguồn) hoặc ghi vào danh sách bỏ qua kèm lý do.
3. Ghi mốc đo vào `plans/v15-do-luong.md`: kết quả `mkdocs build --strict` và `npm test`; Lighthouse ba trang theo cách đo ở G2.0; dung lượng `site/search/search_index.json` (hiện khoảng 4,2 MB chưa nén) trước và sau khi nén gzip.

**Xong khi:**

- [ ] `AGENTS.md` đủ để một agent mới viết một bài học tác phẩm mà không cần hỏi thêm.
- [ ] `tests/abc_warn.mjs` chạy trong `npm test` và đạt.
- [ ] Có bảng mốc đo.

## G1. Kiểm thử tự động cho con số, cấp độ và anchor

### G1.1 Con số viết tay: `tests/counts.py` (nhóm `nhanh`)

**Nguồn sự thật:**

- Nav trong `mkdocs.yml`. Đọc bằng PyYAML (đã có vì MkDocs dùng) với một constructor bỏ qua các tag `!!python/name`, để biết trang nào thuộc nhóm nào.
- `BOOKS` trong `hooks/books.py`.
- Danh sách `PAGES` trong `tests/a11y.mjs`.
- Số mục "## Chặng" trong `docs/piano/lo-trinh.md`.

**Bảng đăng ký `CLAIMS`:** mỗi dòng gồm file, biểu thức tìm và khóa của giá trị thật. Các khóa tối thiểu, với giá trị hiện tại và chỗ đang ghi:

| Khóa | Giá trị thật (hiện tại) | Chỗ đang ghi |
|---|---|---|
| Bài học tác phẩm | số trang trong `docs/piano/tac-pham/`, trừ `index.md` (34) | README, `docs/index.md`, `docs/piano/index.md` (2 chỗ), `docs/piano/tac-pham/index.md` ("34 tác phẩm theo cấp độ", "cả 34 bài"), `docs/bat-dau/sach-in.md`, `hooks/books.py` |
| Hướng dẫn nghe | số hướng dẫn trong nav (42) | README, `docs/index.md`, `docs/bat-dau/sach-in.md`, `hooks/books.py` |
| Hướng dẫn nghe nhạc piano | số trang trong nhóm nav "Nhạc piano" (16) | README, `docs/index.md` (2 chỗ), `docs/bat-dau/sach-in.md`, `hooks/books.py`, `docs/bat-dau/lo-trinh-nghe.md` ("16 hướng dẫn") |
| Bài nhạc lý | số bài có số thứ tự trong nav Nhạc lý (32) | README, `docs/nhac-ly/index.md` ("Sau 32 bài") |
| Bài nền tảng | số bài trong ba phần đầu của Nhạc lý (14) | `docs/nhac-ly/index.md` |
| Bài ôn tập | 3 | README, `docs/nhac-ly/15-tiet-tau-nang-cao.md` |
| Trang kỹ thuật | nhóm nav Piano › Kỹ thuật (10) | README |
| Trang tập luyện | nhóm nav Piano › Tập luyện (6) | README |
| Trang hình thức | nhóm nav Hình thức & thể loại, trừ trang mục lục (9) | README |
| Trang hòa âm bên phím | nhóm nav Hòa âm bên phím (5) | README |
| Cuốn sách | số phần tử của `BOOKS` (7) | `docs/bat-dau/sach-in.md` ("Bảy cuốn") |
| Chặng | số mục "## Chặng" trong lộ trình (7) | nhiều trang ("7 chặng", "Bảy chặng") |
| Trang kiểm tra trợ năng | số phần tử `PAGES` trong `tests/a11y.mjs` (41) | README |
| Tác phẩm piano nên nghe | số dòng trong danh sách tác phẩm của `docs/piano/nghe-si.md` (30) | `docs/piano/nghe-si.md`, `docs/nghe-nhac/index.md` |
| Bài học có hướng dẫn nghe cùng tác phẩm | số cặp bài học và hướng dẫn nghe cùng một tác phẩm (5) | `docs/piano/tac-pham/index.md` ("Năm bài học…") |
| Công cụ | đếm các bộ chọn công cụ trong `RULES` của `docs/assets/js/loader.js` có xuất hiện trong `docs/`, trừ abc, mermaid, quiz, practice; con số trong câu "Hơn N công cụ" phải nhỏ hơn số đếm | `docs/index.md` |

**Bắt buộc đăng ký:** quét `docs/**/*.md` (trừ `docs/cap-nhat.md` và `docs/blog/`, là phần lịch sử), `README.md` và `hooks/books.py`, tìm mọi cụm "số (kể cả số viết bằng chữ: năm, sáu, bảy, mười…) + danh từ đếm" (hướng dẫn nghe, bài học, bài nhạc lý, bài ôn tập, trang, công cụ, cuốn, tác phẩm piano, chặng…). Cụm nào không có trong `CLAIMS` và không nằm trong danh sách bỏ qua có ghi lý do thì kiểm thử báo lỗi. Ví dụ bỏ qua: "260 trang" (bản thảo *Messiah* của Handel), "8 trang" trong bài 20, "10 bài đầu tiên" (tên trang).

Thông báo lỗi chỉ rõ file, dòng, số đang ghi và số thật, ví dụ: `docs/index.md:69 ghi "42 hướng dẫn nghe" nhưng nav có 43`.

### G1.2 Cấp độ bài học: `tests/levels.py` (nhóm `nhanh`)

Tám nơi ghi cấp hoặc chặng của từng bài:

1. Trang bài học: chip `oz-chip--level` ("≈ Grade 5") và dòng "Độ khó" trong hộp thông tin.
2. `docs/piano/tac-pham/index.md`: cột "Grade X (chặng N)".
3. `mkdocs.yml`: nhóm nav, từ "Sơ cấp (≈ Grade 1–2)" đến "Sau Grade 8".
4. `docs/piano/tac-pham-theo-cap.md`: mục của từng chặng.
5. `docs/assets/js/practice.js`: bảng chặng → bài.
6. `docs/piano/lo-trinh.md`: bảng tổng quan (cột "Tác phẩm tiêu biểu") và hàng "Tác phẩm" của từng chặng. Không kiểm hàng "Nghe": hàng này cố ý giới thiệu bài của chặng sau.
7. `docs/piano/thay-va-thi.md`: bảng Grade ↔ chặng.
8. `hooks/books.py`: chương của cuốn `piano-tac-pham` xếp theo chặng không giảm.

Quy tắc:

- Một bài thuộc đúng một chặng ở mọi nơi.
- Chuỗi Grade ở chip, ở hộp thông tin và ở `tac-pham/index.md` giống nhau, sau khi chuẩn hóa "≈", khoảng trắng và chữ "khoảng ABRSM".
- Chặng hợp với Grade theo bảng quy đổi: chặng 1 trước Grade 1; chặng 2 là Grade 1–2; chặng 3 là Grade 3; chặng 4 là Grade 4–5; chặng 5 là Grade 6; chặng 6 là Grade 7–8; chặng 7 là sau Grade 8. Với khoảng Grade (ví dụ "Grade 3–4"), chặng phải chứa ít nhất một đầu của khoảng. "Grade 8 trở lên" và "Sau Grade 8" là chặng 7.

### G1.3 Anchor

- Thử thêm vào `mkdocs.yml`:

    ```yaml
    validation:
      anchors: warn
    ```

    Với MkDocs 1.6 và `--strict`, link tới một anchor không tồn tại sẽ thành lỗi build.
- Nếu cách này báo nhầm (id do JavaScript sinh, trang chuyển hướng…), thay bằng `tests/anchors.py`: quét `site/`, mọi `href` nội bộ (kể cả phần `#…`) phải trỏ tới file và id có thật; bỏ qua `404.html` vì trang này dùng đường dẫn tuyệt đối có tiền tố `/opus-zero/`. Script kiểm tra đã dùng ở v14: `_imslp/_scripts/qa/links.py`.
- Xác nhận đích có `#mục` trong `REDIRECTS` được kiểm lúc build (hooks/redirects.py), nếu chưa thì thêm vào kiểm thử.

### G1.4 Tài liệu

Cập nhật bảng kiểm thử trong README và mục "con số viết tay" trong `AGENTS.md` (cách đăng ký một con số mới).

**Xong khi:**

- [ ] Ba kiểm thử chạy trong `npm test` và đạt trên cây hiện tại.
- [ ] Báo cáo có bằng chứng kiểm thử bắt được lỗi: tạm sửa một con số, tạm thêm một cụm chưa đăng ký, tạm đổi chặng của một bài ở một nơi, tạm làm hỏng một anchor (hoàn tác trước khi commit).
- [ ] Ma trận CI đúng (không đổi nếu không thêm nhóm).

## G2. Hiệu năng và trợ năng

### G2.0 Cách đo (dùng lại ở mọi lần đo)

- Ghim một phiên bản Lighthouse và ghi số phiên bản vào bảng. Lệnh mẫu:

    ```bash
    npx lighthouse@<phiên-bản> <url> --only-categories=performance,accessibility,best-practices,seo \
      --output=json --output-path=<file>.json --chrome-flags="--headless=new" --quiet
    ```

    Mặc định là điện thoại và mạng 4G chậm mô phỏng.
- Mỗi trang chạy 3 lần, lấy trung vị. Ghi bốn điểm, LCP, TBT, CLS và tổng dung lượng tải.
- Ba trang: trang chủ, `piano/tac-pham/fur-elise/`, `nghe-nhac/debussy-preludes/`.
- Đo trên site thật sau khi deploy là chuẩn. Khi đo trên máy, phải dùng máy chủ có nén (ví dụ `npx serve site`), vì `python3 -m http.server` không nén và làm số đo xấu đi. Ghi rõ đo ở đâu.

### G2.1 Hoãn tải chỉ mục tìm kiếm

- Đã kiểm tra trên Material 9.7.6 (bản repo đang dùng): khi trang có ô tìm kiếm, bundle gọi ngay hàm tải `search/search_index.json`. Hàm này dùng `XMLHttpRequest` (không phải `fetch`), và theme không có tùy chọn hoãn. Chỉ mục hiện khoảng 4,2 MB chưa nén, khoảng 1,2 MB khi nén.
- Cách làm: trong `overrides/main.html`, block `extrahead` (chạy trước bundle), thêm một script nhỏ bọc `XMLHttpRequest.prototype.open` và `send`. Với yêu cầu có URL kết thúc bằng `search/search_index.json`, giữ lời gọi `send` cho tới khi một trong các điều kiện sau xảy ra:
    1. Người đọc mở tìm kiếm: `focusin` trên `.md-search__input`, bấm nhãn `label[for="__search"]`, hoặc gõ phím tắt mà Material dùng để mở tìm kiếm (f, s, /).
    2. Trang đã `load` xong và trình duyệt rảnh (`requestIdleCallback`, dự phòng bằng `setTimeout` khoảng 5 giây).
    3. URL có tham số `h=` (người đọc đến từ kết quả tìm kiếm, cần tô sáng từ khóa).

    Mọi yêu cầu khác đi qua nguyên vẹn. Script phải đúng với `navigation.instant`: chỉ mục chỉ tải một lần trong cả phiên.
- Không đổi `hooks/search_vi.py` (thu gọn chỉ mục chỉ bớt khoảng 13%). `docs/sw.js` hiện không precache chỉ mục: giữ như vậy.
- Kiểm thử: `tests/search.mjs` vẫn đạt. Thêm một luồng trong `tests/browser.mjs`: chưa mở tìm kiếm thì chưa gửi yêu cầu tải chỉ mục, mở thì gửi. Kiểm tra tay: tìm có dấu và không dấu, phím tắt, chuyển trang rồi tìm, chế độ mất mạng sau lần ghé đầu.

### G2.2 Khuông nhạc và công cụ khởi tạo khi gần màn hình

- Hiện tại: `docs/assets/js/loader.js` tải script theo nhu cầu của từng trang; mỗi công cụ đăng ký hàm khởi tạo qua `OZReady` và khởi tạo mọi phần tử ngay; `docs/assets/js/abc.js` vẽ mọi khối `.abc-notation` cùng lúc. Trang Für Elise khựng khoảng 380 ms.
- Làm: dùng `IntersectionObserver` (rootMargin khoảng 600px) để vẽ từng khối abc và khởi tạo từng công cụ nặng khi nó tới gần màn hình. Khối nằm trong màn hình đầu vẽ ngay. Giữ chỗ trống có chiều cao gần đúng để bố cục không nhảy.
- Ràng buộc:
    - In: trước khi in (`beforeprint`, nút "In bài này" trong `docs/assets/js/print.js`) phải vẽ hết. Sách in (`hooks/books.py`) không dùng chế độ lười.
    - Link tới một mục (`#theo-doi-khi-nghe`…): vùng đích phải vẽ xong trước khi cuộn tới.
    - Kiểm thử chờ `window.OZLoader.done`: cần một chế độ "vẽ hết" cho kiểm thử (ví dụ một biến toàn cục đặt trước khi tải), để `tests/browser.mjs` vẫn kiểm được mọi khuông nhạc và công cụ.
    - `navigation.instant`: tạo lại observer sau mỗi lần chuyển trang.

### G2.3 Font

- Hiện tại: `theme.font` tải Be Vietnam Pro và JetBrains Mono từ Google Fonts; Literata (độ đậm 500 và 600) tải bằng `@import` ở dòng đầu `docs/assets/css/opus.css`, tạo chuỗi chờ CSS → CSS của font → file font.
- Làm:
    1. Bỏ `@import`. Literata chỉ giữ một độ đậm nếu chỗ dùng độ đậm còn lại đổi được mà không xấu (xem các chỗ dùng biến `--oz-heading`).
    2. Bật plugin `privacy` (có sẵn trong Material 9.7.6) để tải font về lúc build và phục vụ từ chính site: bớt kết nối ra ngoài, dùng được khi mất mạng, không gửi địa chỉ IP của người đọc cho Google. Plugin quét `url(...)` trong CSS; nếu Literata vẫn không được tải về, tự host file woff2 (bộ ký tự latin và vietnamese) trong `docs/assets/fonts/` với `@font-face` và `font-display: swap`, kèm giấy phép OFL của font.
    3. Cân nhắc bỏ JetBrains Mono (site gần như không có mã) bằng font hệ thống cho `code`.
    4. Nếu đổi danh sách tài nguyên cần cho chế độ mất mạng, tăng `VERSION` ở cả `docs/sw.js` và `docs/assets/js/loader.js` (`tests/site_static.py` kiểm tra hai số khớp nhau).
- Kiểm tra: chữ tiếng Việt có dấu hiển thị đúng ở tiêu đề (Literata) và thân bài; khi bật privacy, không còn yêu cầu nào tới `fonts.googleapis.com` hay `fonts.gstatic.com`.

### G2.4 Trợ năng lên 100

- Lấy đúng phần tử bị báo trong kết quả Lighthouse: nhãn của hộp tìm kiếm (có thể là ô ẩn `#__search` hoặc ô nhập) và link chỉ phân biệt bằng màu (quy tắc `link-in-text-block`).
- Sửa nhãn bằng `hooks/a11y.py` hoặc override partial của Material.
- Gạch chân link trong bài bằng CSS, ví dụ `.md-typeset a:not(.md-button):not(.headerlink) { text-decoration: underline; text-underline-offset: .15em; text-decoration-thickness: from-font; }`. Kiểm tra không làm xấu chip, nút, thẻ, bảng mục lục và chân trang.
- `tests/a11y.mjs` chạy axe trong jsdom (quy tắc về màu bị tắt) nên không bắt được hai lỗi này: ghi kết quả Lighthouse vào báo cáo.

### G2.5 (Tùy chọn) Mermaid

`loader.js` tải mermaid từ CDN với phiên bản trôi (`mermaid@11`). Ghim phiên bản chính xác, hoặc đưa vào `docs/assets/js/vendor/` như abcjs để dùng được khi mất mạng.

### Không làm

Thời gian nhớ đệm 10 phút của GitHub Pages: không đổi được, và service worker đã bù cho các lần ghé sau.

**Xong khi:**

- [ ] Mỗi mục G2.1 đến G2.4 là một commit riêng.
- [ ] Có bảng đo trước và sau trong `plans/v15-do-luong.md`.
- [ ] Trợ năng đạt 100 trên ba trang.
- [ ] Hiệu năng trang chủ và trang Für Elise tăng rõ (mục tiêu từ 80 trở lên; ghi số thật, kể cả khi chưa đạt). Trên trang chủ, `search_index.json` không còn nằm trong các yêu cầu trước LCP.
- [ ] Không có lỗi trong console; in một bài vẫn đủ khuông nhạc; `npm test` đạt.

## G3. Dọn trùng lặp còn lại

### G3.1 Hình thức nhỏ và Minuet–trio

- Phân vai:
    - Bài nhạc lý 31 (`docs/nhac-ly/31-hinh-thuc-nho.md`) là nơi chi tiết của các hình thức nhỏ: hai đoạn, hai đoạn có tái hiện, ba đoạn, hình thức ca khúc.
    - `docs/hinh-thuc/minuet-trio.md` là nơi chi tiết của minuet–trio (cấu trúc, bài nghe *Eine kleine Nachtmusik*).
    - `docs/hinh-thuc/scherzo.md` là nơi chi tiết của scherzo.
- Bài 31, mục "Minuet và trio": giữ 2–3 câu và bảng ba khối (minuet, trio, minuet da capo; mỗi khối là hình thức hai đoạn có tái hiện), bỏ phần lặp, thêm link sang trang Minuet và Trio. Đoạn về scherzo rút còn một câu và link sang trang Scherzo. Giữ các câu quiz còn đúng với phần còn lại.
- Trang Minuet và Trio: thêm một câu nói mỗi khối là hình thức hai đoạn có tái hiện, kèm link về mục tương ứng của bài 31. Chuyện tên gọi "trio" chỉ giữ ở một nơi.
- Trang Scherzo: link bài 31 ở chỗ nói về khung ABA.
- `docs/hinh-thuc/index.md`: trong bảng "Các hình thức cơ bản", các dòng Hai đoạn, Ba đoạn, Minuet và trio dẫn tới mục tương ứng ở bài 31 và trang Minuet và Trio. Cân nhắc rút hai mục "## Hình thức sonata" và "## Fugue" trên trang mục lục còn 1–2 câu, vì đã có trang riêng.

### G3.2 Hai trang nhà soạn nhạc

- 19 người có mặt ở cả `docs/lich-su/nha-soan-nhac.md` và `docs/piano/nha-soan-nhac.md`: Bach, Handel, Haydn, Mozart, Beethoven, Schubert, Mendelssohn, Chopin, Schumann, Liszt, Brahms, Tchaikovsky, Grieg, Debussy, Rachmaninoff, Ravel, Bartók, Prokofiev, Shostakovich.
- Mỗi mục ở trang Lịch sử thêm một dòng cuối, ví dụ "Nhạc cho piano: xem [Nhà soạn nhạc cho piano](../piano/nha-soan-nhac.md#…)". Mỗi mục ở trang Piano thêm "Cuộc đời và các tác phẩm khác: [Nhà soạn nhạc](../lich-su/nha-soan-nhac.md#…)". Lấy id từ HTML đã build, không đoán.
- Clara Schumann chỉ có ở trang Piano: link sang đúng mục trong `docs/lich-su/nu-nha-soan-nhac.md`.

### Không làm

Hai bài Minuet của Petzold (xem mục 1).

**Xong khi:**

- [ ] Mọi link mới qua kiểm thử anchor của G1.
- [ ] Bài 31 và mục Hình thức link qua lại.
- [ ] Build và test đạt.

## G4a. Đưa công cụ âm thanh vào `tools/audio/`

**Bối cảnh:** bản thu của 34 bài học và 11 hướng dẫn nghe (v12–v14) được tìm, chuyển mã và căn mốc bằng các script nằm ngoài repo. Bản gốc (chưa dọn) đã được chép vào `_imslp/_scripts/` (không đưa lên git), mục lục ở `_imslp/_scripts/README.md`: `audio/` (Commons, IMSLP), `align/` (căn mốc, kèm bản nhạc số đã dùng trong `align/src/` và bộ mốc đã xác minh tay `align/evalset.py`). Dọn lại theo đặc tả dưới đây; không chạy lại nguyên trạng vì đường dẫn viết cứng theo máy ảo cũ. Script cũ cắt phần đuôi theo ngưỡng −45 dB nên làm mất tiếng ngân ở cuối hai file (đã sửa tay sau đó).

1. `tools/audio/README.md`: quy trình thêm một bản thu, từ tìm kiếm tới căn mốc và kiểm tra.
2. `tools/audio/commons.py`: tìm và tra file trên Wikimedia Commons qua API (`action=query`, `prop=imageinfo|videoinfo`, `iiprop=url|extmetadata`, `viprop=derivatives`). Lấy `LicenseShortName`, `LicenseUrl`, trang mô tả file và link MP3 chuyển mã (derivative có `transcodekey` là mp3). Có bộ nhớ đệm, User-Agent kèm link repo, nghỉ khoảng 2,5 giây giữa các yêu cầu, thử lại khi gặp 429.
3. Danh sách giấy phép được nhận (một nơi duy nhất trong code): phạm vi công cộng (kể cả PDM), CC0, CC BY và CC BY-SA từ 2.0 đến 4.0. Không nhận NC, ND.
4. `tools/audio/attach.py`: ghi khối bản thu vào trang dưới dạng `<div class="oz-listen" data-rec="…"></div>`, trong đó `data-rec` là JSON đã escape HTML, các khóa theo thứ tự:
    - `by`: người chơi;
    - `note` (tùy chọn): ghi chú, ví dụ "file dừng ở khoảng 6:24";
    - `lic`: tên giấy phép, phạm vi công cộng ghi "phạm vi công cộng";
    - `licUrl`: link giấy phép;
    - `page`: trang mô tả file hoặc trang tác phẩm ở nguồn;
    - `parts`: mảng phần, mỗi phần `{t: tên phần nếu có nhiều phần, mp3: URL hoặc đường dẫn tương đối, src: file gốc nếu cần, d: độ dài tính bằng giây}`;
    - `ref`: mảng mốc tham khảo, mỗi phần tử là số giây hoặc `null`, theo thứ tự các dòng của bảng "Theo dõi khi nghe"; bỏ các `null` ở cuối.

    Khi chỉ thay bản thu bằng một file cùng nội dung, giữ `ref` cũ.
5. `tools/audio/transcode.py` cho bản thu IMSLP bạn tải tay vào `_imslp/`:
    - MP3 tối đa 128 kbps.
    - Cắt khoảng lặng đầu nhưng giữ 0,5 giây trước nốt đầu.
    - Ở đuôi chỉ cắt khi im lặng thật (khoảng −60 dB) kéo dài; giữ ít nhất 3 giây sau khi tiếng tắt và thêm fade-out ngắn vào phần đã im.
    - Ghi thẻ ID3: tên, người chơi, giấy phép, nguồn.
    - Thêm một dòng vào `docs/assets/audio/NGUON.txt` theo mẫu: `<file>.mp3 — <tên tác phẩm>; trình bày: <người chơi>; giấy phép <tên> (<link>); nguồn: <link trang file IMSLP>`.
    - Đường dẫn trong `data-rec` tương đối theo vị trí trang: từ `piano/tac-pham/<slug>/` là `../../../assets/audio/<file>.mp3`.
6. `tools/audio/check_audio.py`:
    - Mọi file trong `docs/assets/audio/` có dòng trong `NGUON.txt`.
    - Mọi `data-rec` có đủ `lic`, `licUrl`, `page`.
    - `d` khớp độ dài file (lệch không quá 0,5 giây).
    - 0,25 giây cuối không to hơn khoảng −50 dBFS (bắt lỗi cắt cụt đuôi).

    Script cần ffmpeg: chạy tay, hoặc trong CI khi có ffmpeg. Không đưa vào `npm test` nếu làm chậm kiểm thử.
7. `tools/audio/align/`: căn mốc tham khảo cho bảng "Theo dõi khi nghe".
    - Đầu vào: bản nhạc dạng số (MIDI, MusicXML, MEI, kern) và bản thu. Nguồn đã dùng: piano-midi.de, bộ dữ liệu ASAP, KernScores (các bản Humdrum của Craig Sapp), DCML, Mutopia. Ghi nguồn và giấy phép của từng bộ trong `tools/audio/align/NGUON.md`; không commit file bản nhạc số cỡ lớn, viết script tải.
    - Cách căn: DTW giữa đặc trưng chroma và khởi âm của bản thu với bản nhạc (librosa, partitura, mido, numpy, scipy). Mỗi dòng bảng ứng với một ô nhịp hoặc một phách cụ thể.
    - Đối chiếu: căn lần hai bằng một nguồn bản nhạc khác hoặc một bộ tham số khác. Hai kết quả lệch không quá 2 giây mới nhận; dòng còn lại ghi `null` (trang hiện "chưa có") hoặc kiểm tra tay trên phổ âm thanh.
    - Ghi `ref` vào trang bằng `attach.py`.
    - `tools/audio/requirements.txt` riêng, không đưa vào `requirements.txt` của site.

**Xong khi:**

- [ ] Chạy lại `transcode.py` trên một file cũ cho kết quả không cụt đuôi.
- [ ] `check_audio.py` sạch trên các file hiện có, hoặc liệt kê lỗi thật để sửa.
- [ ] README trong `tools/audio/` đủ để một agent khác thêm một bản thu từ đầu đến cuối.

## G4b. Bản thu cho 7 hướng dẫn nghe nhạc piano

**Trang:** `docs/nghe-nhac/scarlatti-sonata.md`, `mozart-k331.md`, `mozart-concerto-21.md`, `grieg-concerto.md`, `mussorgsky-tranh.md` (bản piano, không phải bản phối dàn nhạc của Ravel), `rachmaninoff-2.md`, `gershwin-rhapsody.md`. Giữ nguyên `part-spiegel.md`: tác phẩm còn bản quyền, người học tự dán link.

Mỗi trang:

1. Tìm trên Commons (theo nhận xét, đã có ứng viên cho cả các trang trừ Scarlatti), Musopen, IMSLP. Đọc giấy phép trên trang mô tả của từng file. Lưu ý bản quyền của chính bản thu: ở Mỹ, bản thu xuất bản từ 1923 đến 1946 được bảo hộ 100 năm, nên bản *Rhapsody in Blue* năm 1924 của Gershwin đã vào phạm vi công cộng từ năm 2025, còn bản Concerto số 2 do Rachmaninoff chơi năm 1929 thì phải tới năm 2030. Chỉ nhận file có giấy phép hợp lệ ghi trên trang.
2. Tác phẩm nhiều chương: mỗi chương là một phần trong `parts`, theo đúng thứ tự trang hướng dẫn dùng.
3. Scarlatti: tìm đúng các sonata mà trang hướng dẫn nói tới. Nếu bản thu chỉ có trên IMSLP, ghi tên file vào báo cáo để bạn tải tay vào `_imslp/`, rồi chuyển mã bằng `transcode.py`.
4. Căn mốc cho bảng "Theo dõi khi nghe" nếu có bản nhạc số đáng tin; dòng không căn được để `null`.
5. Thêm một dòng cho cả đợt vào mục v15 của `docs/cap-nhat.md`.

**Xong khi:**

- [ ] 7 trang phát được bản thu, ghi người chơi, giấy phép và nguồn.
- [ ] Mốc tham khảo đã được đối chiếu theo G4a.
- [ ] Build và test đạt.

**G4c (tùy chọn, nếu còn thời gian):** 24 hướng dẫn nghe dàn nhạc, thính phòng và giọng hát chưa có bản thu. Musopen có nhiều bản CC0 và phạm vi công cộng. Làm theo lô 6 trang.

## G5. Chơi theo tai; bài phổ biến ngoài nhạc cổ điển

### G5.1 Bài luyện tai thứ sáu: `docs/luyen-tai/choi-bang-tai.md`, "Chơi theo tai bên phím đàn"

Nội dung, bám vào mục Piano:

1. Tìm một giai điệu quen trên phím: hát trước, xác định nốt đầu so với chủ âm, tìm từng bước. Bắt đầu bằng giai điệu đã học ở 10 bài đầu tiên (`docs/piano/10-bai-dau-tien.md`).
2. Đệm I–IV–V: nghe bè trầm, chọn hợp âm ở chỗ đổi hợp âm, đệm tay trái theo các mẫu ở `docs/piano/hop-am-rai.md` và `docs/piano/hoa-am/dem-giai-dieu.md`; liên hệ `docs/luyen-tai/nghe-tien-trinh.md`.
3. Chơi lại một câu vừa nghe (dùng `docs/luyen-tap/chep-giai-dieu.md` và `docs/luyen-tap/hat-lai.md`).
4. Dịch giọng giai điệu vừa tìm sang Sol trưởng và Fa trưởng.
5. Nghe trong đầu câu đầu tiên trước khi chơi (liên hệ `docs/piano/hoc-thuoc-bieu-dien.md`).
6. Thói quen 10 phút mỗi ngày, bảng tiến độ 4 tuần, quiz, nguồn.

Chỉ dùng giai điệu dân gian hoặc đã hết bản quyền. Có thể dùng dân ca Việt Nam khuyết danh, ghi rõ bản ghi chép giai điệu đã dùng.

Cập nhật: nav (Luyện tập › Luyện tai); `docs/luyen-tai/index.md` (lộ trình 6 bài); `docs/luyen-tap/index.md` nếu có liệt kê; hàng "Tai" ở chặng 2 hoặc 3 của `docs/piano/lo-trinh.md`; một tháng phù hợp trong `docs/bat-dau/lo-trinh-choi.md`; link từ `docs/piano/hoa-am/dem-giai-dieu.md`; kiểm tra `docs/assets/js/plan.js` có danh sách bài luyện tai hay không.

Bảng "Gắn quãng với giai điệu quen thuộc" trong `docs/luyen-tai/index.md`: thêm ví dụ lấy từ tiết mục của site (10 bài đầu tiên, các bài học tác phẩm), chỉ khi chắc chắn về quãng mở đầu.

### G5.2 Mở rộng "Bài phổ biến ngoài nhạc cổ điển"

Mục `#ngoai-co-dien` trong `docs/piano/tac-pham-theo-cap.md` hiện chỉ có *Mariage d'Amour*. Thêm:

- *River Flows in You* và *Kiss the Rain* (Yiruma);
- *Comptine d'un autre été: l'après-midi* (Yann Tiersen);
- *Nuvole bianche* (Ludovico Einaudi);
- một bài của Joe Hisaishi cho phim Ghibli (chọn bài có bản piano chính thức).

Mỗi bài theo mẫu của mục *Mariage d'Amour*: tác giả, năm, xuất xứ (album, phim); cấp ước lượng, nói rõ là bản gốc hay bản soạn dễ; kỹ năng cần và chỗ khó điển hình; nên học bài cổ điển nào trước hoặc song song (link bài học có sẵn); nơi mua bản nhạc được cấp phép (nhà xuất bản chính thức, cửa hàng bản nhạc số được cấp phép); bản thu chính thức (kênh của tác giả hoặc hãng).

Bản quyền: không chép khuông nhạc, tên nốt hay giai điệu; không link bản nhạc chép lậu. Kiểm chứng các nhầm lẫn phổ biến bằng nguồn đáng tin (như *Mariage d'Amour* hay bị gán cho Chopin). Từ câu hỏi về nhạc phim trong `docs/bat-dau/hoi-dap.md`, link sang mục này.

**Xong khi:**

- [ ] Trang mới có trong nav và các trang mục lục.
- [ ] Con số được cập nhật (kiểm thử G1 xanh).
- [ ] Không chép nội dung còn bản quyền.

## G6. Bài học tác phẩm mới (mỗi lô 3 bài)

**Hiện trạng:** 34 bài; theo thời kỳ: 17 Lãng mạn, 8 Cổ điển, 7 Baroque, 1 cuối thế kỷ 19 (Satie), 1 Ấn tượng (*Clair de lune*); theo chặng: chặng 2 và 4 có 7 bài, chặng 3 và 5 có 6, chặng 6 có 5, chặng 7 có 3. Chưa có nhà soạn nhạc nữ, chưa có tác phẩm Việt Nam.

**Tiêu chí chọn bài**, theo thứ tự:

1. Bản nhạc đã hết bảo hộ ở Việt Nam và ở Mỹ (nơi đặt GitHub Pages), để in được trích đoạn:
    - Việt Nam: Luật Sở hữu trí tuệ, Điều 27: suốt cuộc đời tác giả và 50 năm tiếp theo năm tác giả mất, nên tính đến năm 2026 là tác giả mất từ năm 1975 trở về trước.
    - Mỹ: tính đến năm 2026, tác phẩm xuất bản từ năm 1930 trở về trước.
    - Dùng đúng ấn bản đã hết bảo hộ, ví dụ ấn bản gốc 1909–1910 của *For Children* (Bartók), không dùng bản sửa năm 1945.
2. Có bản thu giấy phép mở, để giữ chuẩn "bài học nào cũng có bản thu".
3. Lấp đúng khoảng trống về chặng và thời kỳ.
4. Có giá trị dạy học rõ: có trong chương trình thi cấp (ABRSM, Trinity) hoặc danh mục sư phạm.

**Các lô đề xuất.** Agent xác minh cấp độ, ấn bản và bản thu trước khi viết; đổi bài nếu không đạt tiêu chí 1–2.

- **Lô A, thế kỷ 20, chặng 2–5:** Bartók, *For Children* (2–3 bài ngắn trong một bài học); một bài trong *Children's Corner* của Debussy (ví dụ *The Little Shepherd*); một bài thế kỷ 20 dễ khác đạt tiêu chí 1 (ví dụ một bài trong *Children's Album* Op. 98 của Gretchaninov).
- **Lô B, nhà soạn nhạc nữ:** Clara Schumann, Fanny Hensel, Cécile Chaminade, mỗi người một bài vừa chặng 3–6; link với `docs/lich-su/nu-nha-soan-nhac.md`. Với Fanny Hensel, chọn bài đã in khi bà còn sống hoặc ngay sau khi bà mất, vì nhiều bài chỉ có ấn bản hiện đại còn bảo hộ.
- **Lô C, những bài người học hay hỏi (chặng 5–7):** Chopin, Nocturne Đô♯ thứ (*Lento con gran espressione*, in sau khi ông mất); Debussy, Arabesque số 1; Chopin, Valse Op. 64 số 2; Mozart, *Alla turca* (chương 3 của K. 331, link sang hướng dẫn nghe K. 331); Rachmaninoff, Prelude Đô♯ thứ Op. 3 số 2 (có thể vào chặng 7, chặng đang ít bài). Chọn 3 bài cho v15, phần còn lại để v16.
- **Lô D, Việt Nam (tùy chọn):** 2–3 bài soạn mới của site trên giai điệu dân ca khuyết danh (chặng 1–2), soạn hai tay có số ngón như 10 bài đầu tiên, ghi "soạn cho trang này" và nguồn giai điệu (dân ca có nhiều dị bản: chọn một bản ghi chép đã in). Kèm một mục giới thiệu tác phẩm piano của nhạc sĩ Việt Nam (chỉ mô tả, link bản thu và ấn bản chính thức, không chép nhạc), nối với `docs/lich-su/viet-nam.md`.

**Mỗi bài học phải có:**

- [ ] `docs/piano/tac-pham/<slug>.md` theo mẫu bài học trong `AGENTS.md`, độ dài tương đương các bài cùng chặng.
- [ ] Trích đoạn thật đã đối chiếu từng nốt (ghi ấn bản; công cụ đã dùng ở v12–v14 để so với file LilyPond của Mutopia: `_imslp/_scripts/abc/oz_tools_local/lyrel.py` và `_imslp/_scripts/abc/ozchk/`); bài tập chuẩn bị soạn riêng; ABC không có cảnh báo (`tests/abc_warn.mjs`) và ô nhịp đủ (`tests/abc_bars.py`).
- [ ] Hình cấu trúc `p-<slug>` thêm vào `tools/figures.py` (`form_map`), rồi chạy `python3 tools/figures.py`.
- [ ] Bản thu (`data-rec`) và mốc tham khảo theo G4a. Nếu không tìm được bản thu giấy phép mở, báo trong báo cáo trước khi viết bài.
- [ ] Cấp độ thống nhất ở 8 nơi (G1.2): trang bài học; `docs/piano/tac-pham/index.md`; nhóm nav trong `mkdocs.yml`; `docs/piano/tac-pham-theo-cap.md`; `docs/assets/js/practice.js`; `docs/piano/lo-trinh.md` (nếu đưa vào hàng "Tác phẩm"); `docs/piano/thay-va-thi.md` (nếu có trong bảng); `hooks/books.py` (cuốn `piano-tac-pham`, đúng thứ tự chặng).
- [ ] Con số "34 bài học" được cập nhật ở mọi nơi (kiểm thử G1 sẽ báo).
- [ ] Mục "Học tiếp" của 1–2 bài liền trước cùng chặng có link tới bài mới; trang Nhà soạn nhạc cho piano cũng vậy nếu tác giả có mục ở đó.
- [ ] Mục "Kiểm tra nhanh" (quiz) và mục "Nguồn" với nguồn thật.

**Quy trình:** mỗi lô một nhánh, mỗi bài một commit. Claude review xong lô trước mới làm lô sau.

## G7. Việc bạn quyết

Ghi lựa chọn của bạn ngay trong mục này (đánh dấu ô), rồi giao cho agent.

### G7.1 Giấy phép cho phần chữ

Bạn chọn ngày 22/10/2026: CC BY-SA 4.0.

- [x] (Đề xuất) Nội dung theo CC BY-SA 4.0, mã theo MIT: người khác được dùng lại, kể cả với mục đích thương mại, miễn ghi nguồn và chia sẻ lại theo cùng giấy phép.
- [ ] Nội dung theo CC BY-NC-SA 4.0: cấm dùng thương mại; theo nhiều định nghĩa, nội dung khi đó không còn được coi là "nội dung mở".
- [ ] Giữ như hiện nay (chỉ MIT, không nói gì về nội dung).

Khi đã chọn: thêm file giấy phép cho nội dung (ví dụ `LICENSE-CONTENT`) và một mục trong README; sửa `copyright:` trong `mkdocs.yml` để chân trang ghi rõ (ví dụ "Nội dung: CC BY-SA 4.0 · Mã nguồn: MIT"); ghi ngoại lệ: bản thu, hình và trích đoạn của bên thứ ba giữ giấy phép riêng (xem `docs/assets/audio/NGUON.txt` và nguồn ở từng trang).

### G7.2 GitHub Release (nên làm ngay)

Tạo release `v14` trỏ vào `ed69d89` (commit của phiên bản 14; từ 22/10/2026 site chạy thêm G0–G4a, phần này thuộc v15), nội dung lấy từ mục Phiên bản 14 trong `docs/cap-nhat.md`, ví dụ:

```bash
gh release create v14 --target ed69d892aeff1e85a0c3497e5a0f09549369e36a --title "Phiên bản 14" --notes-file <file-ghi-chú>
```

Kết quả: hết lỗi 404 trong console ở mọi trang, góc trang hiện số phiên bản. Từ nay mỗi phiên bản một release (xem G8).

### G7.3 Kênh góp ý không cần tài khoản GitHub

Bạn chọn ngày 22/10/2026: để sau, giữ GitHub Issues như hiện nay. Cùng ngày, bạn cũng chọn không thêm bộ đếm lượt xem.

- [ ] (Đề xuất) Google Form: người góp ý không cần tài khoản, bạn nhận thư báo khi có góp ý mới.
- [ ] Một địa chỉ email riêng cho dự án (không dùng email cá nhân).
- [ ] Một nhóm hoặc trang mạng xã hội.

Khi đã chọn: link ở chân trang (`extra.social` trong `mkdocs.yml`), ở Hỏi đáp, Tài nguyên, Tài liệu tham khảo và Cập nhật; gợi ý nội dung góp ý (trang nào, sai gì, đề xuất gì).

### G7.4 Video minh họa kỹ thuật

1. Agent lập danh sách đề cử trước, 2–3 video cho mỗi trang trong nhóm Kỹ thuật, cộng trang Tư thế và thế tay và trang Bàn đạp. Mỗi video ghi kênh, tiêu đề, thời lượng, đoạn nên xem (mốc thời gian), lý do chọn, ngôn ngữ. Tiêu chí: giáo viên, nhạc viện, hội đồng thi hoặc nhà xuất bản uy tín (ví dụ Graham Fitch, đã có trong tài liệu tham khảo của site); kênh tồn tại lâu; nội dung khớp trang; không phải video bán khóa học.
2. Bạn duyệt danh sách, rồi agent mới thêm vào trang.
3. Thêm dưới dạng link kèm một dòng mô tả và đoạn nên xem, không nhúng iframe: không làm chậm trang, không gửi dữ liệu cho YouTube khi người đọc chưa bấm.
4. Kiểm tra link: lychee trong `.github/workflows/link-check.yml` không phát hiện được video bị gỡ, vì trang xem video của YouTube vẫn trả mã 200. Thêm một script hỏi oEmbed (`https://www.youtube.com/oembed?url=<link>&format=json`), báo lỗi khi nhận mã 4xx, chạy trong cùng workflow hằng tuần và mở issue như lychee.

### G7.5 Blog

Bạn chọn ngày 22/10/2026: mỗi phiên bản một bài.

- [x] (Đề xuất) Mỗi phiên bản một bài "Có gì mới ở phiên bản N", bắt đầu từ v15. Dễ duy trì vì nội dung đã có sẵn ở trang Cập nhật.
- [ ] Ẩn khỏi menu cho tới khi có đủ bài.
- [ ] Giữ như hiện nay.

## G8. Phát hành v15

1. Gộp các nhánh đã review vào `main` theo thứ tự ở mục 3.
2. Chạy `mkdocs build --strict`, `npm test`, lychee trên máy (tùy chọn) và Lighthouse ba trang; ghi số cuối cùng vào `plans/v15-do-luong.md`.
3. Viết mục "Phiên bản 15" trong `docs/cap-nhat.md` cho người đọc site (thay đổi gì với họ), không phải nhật ký kỹ thuật. Cập nhật README (cấu trúc, bảng kiểm thử).
4. Bài blog (nếu G7.5 chọn) và release `v15` (nếu đã làm G7.2).
5. Push: bạn làm.

## Bảo trì ngoài v15

- Tháng 1/2027: chương trình piano ABRSM 2027–2028 bắt đầu được dùng (chương trình 2025–2026 còn hiệu lực đến 31/12/2027). Rà `docs/piano/thay-va-thi.md` và `docs/tai-nguyen.md` theo checklist hằng quý ở trang Cập nhật.
- Hằng quý: checklist ở cuối `docs/cap-nhat.md`, kể cả mở tay các link mà kiểm tra tự động bỏ qua (abrsm.org, Oxford Music Online).
- Hằng tuần, tự động: workflow *Kiểm tra link và bản thu* kiểm link ra ngoài, và đối chiếu mọi bản thu với Wikimedia Commons (file bị xóa, đổi độ dài, đổi giấy phép). Có lỗi thì mở hoặc cập nhật một issue.
- **Công cụ build** (đã kiểm ngày 22/10/2026):
    - **Material for MkDocs** đang ở giai đoạn bảo trì cuối (issue #8523, mở ngày 6/11/2025). Ngày 16/9/2026, nhóm phát triển gia hạn việc sửa lỗi nghiêm trọng và lỗi bảo mật tới 5/5/2027; lỗi nhỏ có thể không được sửa. Bản 9.7.0 ra ngày 11/11/2025. Bản mới nhất là 9.7.7 (17/7/2026): sửa lỗ hổng XSS trong gợi ý tìm kiếm. Site đã nâng từ 9.7.6 lên 9.7.7 (việc lẻ `khoa-goi`).
    - **MkDocs:** 1.6.1 (30/8/2024) vẫn là bản 1.x mới nhất. MkDocs 2.0 đang ở bản thử (2.0.dev6, ngày 15/9/2026) và không tương thích: bỏ hệ plugin, cấu hình bằng TOML, viết lại hệ theme, không có cách chuyển dự án cũ. Từ bản 9.7.5, Material giới hạn `mkdocs<2`. `requirements.txt` đã khóa mọi gói (việc lẻ `khoa-goi`).
    - **Zensical**, do nhóm làm Material phát triển: bản 0.0.71 (16/10/2026). Nó đọc được `mkdocs.yml` và có thay thế cho plugin blog từ bản 0.0.64. Trang tương thích chưa nói gì về hook Python, mà site dùng 5 hook (`search_vi`, `books`, `a11y`, `redirects`, `meta`). Plugin không có trong danh sách hỗ trợ thì bị bỏ qua. Vì vậy chưa chuyển được.
    - **Việc cần làm:** rà lại vào quý 1/2027, trước ngày 5/5/2027. Thử build bằng Zensical trên một nhánh riêng, xem từng hook và `overrides/main.html` còn chạy không, rồi quyết định chuyển hay giữ Material đã khóa phiên bản.
    - **Nguồn:**
        - [issue #8523](https://github.com/squidfunk/mkdocs-material/issues/8523);
        - [What MkDocs 2.0 means for documentation projects](https://squidfunk.github.io/mkdocs-material/blog/2026/02/18/mkdocs-2.0/);
        - [Zensical: tương thích](https://zensical.org/compatibility) và [plugin](https://zensical.org/compatibility/plugins);
        - lịch sử phát hành trên PyPI của `mkdocs`, `mkdocs-material`, `zensical`.

## Ý tưởng để sau (không thuộc v15)

- **Lấy ý kiến người học thật**, theo nhận xét ngày 22/10/2026: đến nay mọi lần sửa đều xuất phát từ rà soát. Issue duy nhất trên GitHub là do công cụ kiểm tra link mở. Sau v15 nên:
    - mở kênh góp ý (G7.3, hiện bạn để sau);
    - nhờ vài người ở các trình độ khác nhau theo lộ trình vài tuần, ghi lại chỗ họ vướng;
    - chọn việc cho v16 theo phản hồi đó.
- Trích đoạn từ bản gốc, đã đối chiếu từng nốt, cho những bài học hiện chỉ có bài tập soạn riêng. Đếm sơ bộ ngày 22/10/2026 có khoảng 13 bài, ví dụ *Clair de lune*, *Träumerei*, Ballade số 1.
- Một tệp dữ liệu duy nhất cho các bài học (tên, chặng, Grade, thời kỳ), từ đó sinh nhóm nav, bảng mục lục và `practice.js` bằng hook, thay cho việc kiểm thử 8 nơi.
- Mở rộng hướng dẫn nghe *Ánh trăng* thành cả ba chương (bài học hiện chỉ có chương 1).
- Mỗi trang thời kỳ trong mục Lịch sử thêm một khối ngắn "Nhạc phím thời này": nhạc cụ, thể loại, bài nên nghe và nên chơi.
- Nhạc lý: hộp "Trên phím đàn" cho bài 15–32; nhịp 2/2, 3/8, 6/4; đọc nhiều bè trên một khuông; canon và mô phỏng (chuẩn bị cho Bach).
- Thêm bài cho chặng 7.

## Lời giao việc mẫu

> Bạn làm **Giai đoạn N** trong `plans/ke-hoach-v15.md` của repo opus-zero. Đọc `AGENTS.md`, `README.md`, các mục "Tiến độ" và "Quy tắc chung", và mục Giai đoạn N trong kế hoạch. Tạo nhánh `v15/gN-<tên-ngắn>` từ `main`. Chỉ sửa trong phạm vi giai đoạn; gặp việc ngoài phạm vi thì ghi vào báo cáo, không tự làm. Không push. Khi xong: chạy `mkdocs build --strict` và `npm test` (đều phải đạt), commit, rồi viết báo cáo `plans/bao-cao-v15/giai-doan-N.md`: file đã sửa và lý do, kết quả build và test, số đo (nếu có), chỗ chưa chắc chắn, nguồn đã dùng để kiểm chứng.

## Claude review những gì

- Diff chỉ nằm trong phạm vi giai đoạn, không có file thừa.
- Tự chạy lại build và kiểm thử.
- Kiểm chứng ngẫu nhiên ít nhất 5 sự kiện trên mỗi trang mới hoặc sửa nhiều: năm, số danh mục, cấp độ, người chơi và giấy phép bản thu.
- Đối chiếu trích đoạn khuông nhạc với nguồn ghi trên trang.
- Bản quyền: giấy phép bản thu; không chép nhạc còn bảo hộ.
- Con số, cấp độ, link và anchor: kiểm thử G1 phải xanh.
- Giọng văn và thuật ngữ thống nhất với các trang hiện có.
