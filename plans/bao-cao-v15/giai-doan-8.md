# Báo cáo giai đoạn 8: hoàn tất và chuẩn bị phát hành v15

Đợt làm từ tối 22/10 đến 23/10/2026, sau khi bạn push `main` (`7cea23b`).

Theo yêu cầu của bạn:
- Làm mọi việc làm được: việc nhỏ trước, rồi lần lượt các phần lớn.
- Cuối cùng bạn review một lần.
- G6 và G4c hoãn sang v16; chỉ chạy xong phần khảo sát và chép vào `plans/v16/`.

Mỗi việc làm trên một nhánh riêng. Việc nào xong (build và kiểm thử đạt) thì được gộp kiểu fast-forward vào nhánh tích hợp `v15/tich-hop`. `main` vẫn đúng bản bạn đã push.

## Đã gộp vào `v15/tich-hop`

| Commit | Việc | Báo cáo hoặc chi tiết |
|---|---|---|
| `377adab` | Việc lẻ `kiem-link` | Workflow chỉ kiểm link http(s). Bỏ qua abrsm.org và Oxford Music Online vì hai site chặn robot; hai nơi này kiểm tay theo quý. Mỗi loại lỗi giữ một issue: có lỗi thì cập nhật, hết lỗi thì tự đóng. Thêm job đối chiếu bản thu với Commons hằng tuần. Link vnam.edu.vn (chứng chỉ hết hạn ngày 14/10/2026) chuyển sang bản lưu trên Internet Archive. |
| `17536dd` | Việc lẻ `khoa-goi` | `requirements.txt` khóa 30 gói, đúng bộ gói mà lần deploy của `7cea23b` đã cài. Kiểm tra 8 của `tests/site_static.py` chặn dòng chưa khóa. |
| `7df3812` | Việc lẻ `mermaid` | Đã kiểm trên Chrome có mạng: Material vẽ đủ 5 sơ đồ cả trước lẫn sau khi bỏ quy tắc thừa. `VERSION` 18 → 19. |
| `1787f02` | G7.1, giấy phép | Phần chữ theo CC BY-SA 4.0 (`LICENSE-CONTENT`), mã nguồn vẫn MIT. Chân trang, trang Tài liệu tham khảo, README và bìa sách in đều ghi giấy phép. |
| `b2bf406`, `35c60dd` | Kế hoạch | Tiến độ, các lựa chọn G7, việc lẻ mới, mục bảo trì công cụ build; hoãn G6 và G4c. |
| `3ed25d8` | Material 9.7.6 → 9.7.7 | Bản vá lỗ hổng XSS trong gợi ý tìm kiếm. Site bật `search.suggest` nên bị ảnh hưởng. Các gói kéo theo không đổi. |
| `4815d92`, `dd018dc` | Khảo sát G4c, G6 cho v16 | `plans/v16/khao-sat-g4c.md`, `plans/v16/khao-sat-g6.md` |
| `76e99d6` → `09c38cc` | G5 | `plans/bao-cao-v15/giai-doan-5.md` |
| `6e037a5` → `9a365c3` | Việc lẻ `g4b-con-lai` | `plans/bao-cao-v15/viec-le-g4b-con-lai.md` |
| `d834799` → `95e1afa` | Việc lẻ `nguon` | `plans/bao-cao-v15/viec-le-nguon.md` |
| `0294abc` | G8 | Mục Phiên bản 15 trên trang Cập nhật, bài blog "Có gì mới ở phiên bản 15" (G7.5), README, `AGENTS.md`. |
| (commit của báo cáo này) | G8 | Số đo cuối, ghi chú release, mục Tiến độ. |

## Review trước khi gộp

- **G5:**
    - Kiểm ngẫu nhiên bốn sự kiện của mục bài phổ biến; cả bốn đúng:
        - *il porco rosso* thuộc danh sách B, Grade 8, ABRSM 2025–2026;
        - *Always with Me* (nhạc Youmi Kimura, lời Wakako Kaku) thuộc Grade 3;
        - tập Grade 6 của AMEB Piano for Leisure Series 4 có cả *Comptine* lẫn *Nuvole bianche*;
        - album *First Love* (2001) và *From the Yellow Room* (2003) của Yiruma.
    - Kiểm cả 12 ví dụ quãng trong bảng luyện tai, đối chiếu với khuông nhạc trên các trang của site; tất cả đúng.
    - Khi rebase lên nhánh tích hợp, giải một xung đột ở README: số trang kiểm trợ năng 41 → 42.
- **`g4b-con-lai`:** cấu trúc Valse La thứ khớp mô tả của Wikipedia ("16 ô nhắc lại" là A' và C gộp lại). Mình thêm một chi tiết, có kiểm trên IMSLP và Wikipedia: bài được in lần đầu năm 1860, là số 3 của tập *4 Pièces pour piano* đề tên Charlotte de Rothschild.
- **`nguon`:**
    - Sửa "giọng song song" thành "giọng cùng tên" là đúng. Wikipedia, mục Ternary form, ghi đoạn giữa thường ở giọng át hoặc giọng thứ cùng tên; trên site, "song song" nghĩa là giọng có cùng hóa biểu.
    - Agent ghi 8 chỗ chưa có nguồn. Mình bỏ hoặc viết chung lại cả 8 (commit `95e1afa`):
        - bỏ nhã nhạc khỏi ví dụ dị âm;
        - bỏ "ballad, nhạc pop" và Wagner, Liszt;
        - bè trầm của Pachelbel mô tả bằng bậc 1–5–6–3, đặt cạnh 1–7–6–3 của Romanesca;
        - viết bớt câu "gần như tất cả các kỹ thuật";
        - bỏ "khổ cuối hoặc khổ buồn" và Schubert;
        - *1812* không gán nhãn chủ đề 1, chủ đề 2;
        - *Hebrides* chỉ nói nhạc gợi sóng biển;
        - kèn horn của Giao hưởng số 5 viết đúng theo nguồn.

## Kiểm tra trên bản cuối

- `mkdocs build --strict`: không cảnh báo.
- `npm test`: chạy trên Python 3.12 với đúng bộ gói đã khóa (Material 9.7.7), như CI, ra "Kiểm thử: 4 nhóm chạy song song trong 11.9 giây, mọi nhóm đều đạt".
- `python3 tools/audio/check_audio.py --static --network`, chạy như job mới trong CI với bộ nhớ đệm trống: 2 yêu cầu API, 0 lỗi.
- Lighthouse tại máy qua HTTP/2: cả ba trang 99 / 100 / 100 / 100, cả 3 lần đo; chỉ mục tìm kiếm luôn tải sau LCP (bảng ở `plans/v15-do-luong.md`).
- Trên site thật (bản bạn đã push), kiểm bằng Chrome: các khối nghe chỉ dẫn link của K. 331, Mussorgsky, Debussy và Invention số 1 hiện đúng link; trang có bản thu thường vẫn có nút "Nghe bản này".

## Việc của bạn

1. **Review:**
    - `git log --oneline main..v15/tich-hop`;
    - các báo cáo `giai-doan-5.md`, `viec-le-nguon.md`, `viec-le-g4b-con-lai.md` và báo cáo này;
    - bản xem trước bằng `mkdocs serve` trên nhánh `v15/tich-hop`.
2. **Gộp:** `git switch main && git merge --ff-only v15/tich-hop`.
3. **Môi trường trên máy:** chạy `pip install -r requirements.txt` trong `.venv`, để máy dùng đúng bộ gói đã khóa (Material 9.7.7, `python-dateutil` 3.0.0). Môi trường căn mốc đã chuyển vào `.venv-audio/` (đã có trong `.gitignore`), bộ nhớ đệm ở `~/.cache/opus-zero`.
4. **Push:** `git push origin main`. Lệnh này deploy site.
5. **Sau khi deploy:**
    - Tạo release: `gh release create v15 --target <hash của main> --title "Phiên bản 15" --notes-file plans/bao-cao-v15/ghi-chu-release-v15.md`. Mình chạy giúp được nếu bạn muốn; release là nội dung công khai nên cần bạn đồng ý.
    - Đo trên site thật: `node tools/lighthouse/measure.mjs https://mtuann.github.io/opus-zero/ 3`.
    - Bấm chạy tay workflow *Kiểm tra link và bản thu* trong tab Actions. Issue #1 sẽ được cập nhật, hoặc tự đóng nếu hết lỗi.
6. **G7.4:** duyệt danh sách video đề cử. Video chỉ được thêm vào trang sau khi bạn duyệt.
7. **Tùy bạn:** ba nhánh cũ còn bốn file MP3 (`backup/main-co-audio`, `v15/g4b-ban-thu`, `v15/g7-2-release`). Đừng push chúng; xóa khi không cần nữa.

## Chỗ chưa chắc hoặc để lại

- **Link PDF của British Council** (trang Nhà soạn nhạc nữ, nguồn cho *Hồ Nguyệt Cô hoá cáo*): máy chủ không trả file (lỗi HTTP/2, hết thời gian chờ), và Internet Archive không có bản lưu. Mình giữ link. Kiểm tra hằng tuần sẽ báo nếu link vẫn hỏng.
- **Cấp độ lệch với danh sách thi**, do khảo sát G6 tìm ra, để v16 quyết. Chi tiết ở mục "Ghi chú ngoài phạm vi" của `plans/v16/khao-sat-g6.md`:
    - bài học Valse Si thứ Op. 69 số 2: site ghi Grade 5–6, ABRSM 2015–2016 xếp Grade 8;
    - *The Little Shepherd* và Nocturne Đô♯ thứ B. 49: site xếp chặng 5, ABRSM xếp Grade 7;
    - Nocturne Mi thứ Op. 72 số 1: site xếp chặng 5, ABRSM 2027–2028 xếp Grade 8.
- **`commons.py` báo sai giấy phép** khi trang mô tả có cả mẫu phạm vi công cộng cho tác phẩm và giấy phép CC cho bản thu. Khảo sát G6 gặp trường hợp này ở file Sonatina của Bartók. Cần sửa công cụ trước khi gắn bản thu ở v16.
- **Công cụ build:** rà lại Zensical vào quý 1/2027, trước khi Material hết hạn sửa lỗi nghiêm trọng (5/5/2027). Xem mục "Bảo trì ngoài v15" của kế hoạch.

## Nguồn đã dùng để kiểm chứng

- Material for MkDocs: issue #8523, bài "What MkDocs 2.0 means for documentation projects", ghi chú phát hành 9.7.5–9.7.7 (GitHub), lịch sử phát hành trên PyPI; Zensical: các trang tương thích và plugin.
- Creative Commons: toàn văn CC BY-SA 4.0 (`legalcode.txt`).
- Valse La thứ: Wikipedia ("Waltz in A minor, Op. posth."), trang tác phẩm trên IMSLP. Hình thức ba đoạn: Wikipedia ("Ternary form"). Romanesca, hình thức theo khổ: Wikipedia ("Romanesca", "Strophic form").
- G5: danh sách thi ABRSM 2025–2026 (qua trang nhà sách và Classic FM), AMEB Piano for Leisure Series 4 Grade 6, Qobuz và Deezer (album Yiruma).
- Issue #1 trên GitHub; kiểm tay bằng curl các link bị báo (abrsm.org, Oxford Music Online, vnam.edu.vn, British Council, vienamnhac.vn); Internet Archive (bản lưu vnam.edu.vn ngày 11/7/2024, đã đối chiếu nội dung).
