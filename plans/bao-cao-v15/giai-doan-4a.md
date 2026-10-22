# Báo cáo giai đoạn 4a: đưa công cụ âm thanh vào `tools/audio/`

Nhánh: `v15/g4a-cong-cu-am-thanh` (tạo từ `main` tại `a265e3f`, sau khi gộp G3). Mỗi commit đều qua `mkdocs build --strict` và `npm test`:

| Commit | Việc |
|---|---|
| `99a362d` | Giấy phép, Commons, ghi khối bản thu, chuyển mã (mục 2–5 của kế hoạch) |
| `7a856e5` | `check_audio.py` (mục 6); bản `--static` chạy trong nhóm `nhanh` |
| `74b5938` | Căn mốc `tools/audio/align/` (mục 7) |
| `5909305` | `tools/audio/README.md` (mục 1); AGENTS.md và README trỏ tới |
| `851dd79` | Sửa theo lần thử README với một agent độc lập (mục Thử README) |

Trang nội dung trong `docs/` không đổi: giai đoạn này chỉ thêm công cụ.

## File đã sửa và lý do

| File | Việc |
|---|---|
| `tools/audio/licenses.py` | Danh sách giấy phép được nhận, nơi duy nhất trong code: phạm vi công cộng (kể cả PDM), CC0, CC BY và CC BY-SA 2.0–4.0 (kể cả bản theo quốc gia); không nhận NC, ND. Đọc tên giấy phép kiểu Commons ("CC BY-SA 4.0", "PDM-owner"), IMSLP ("Creative Commons Attribution-ShareAlike 4.0") và kiểu ghi trên trang ("phạm vi công cộng"); kiểm `licUrl` đúng loại và phiên bản |
| `tools/audio/net.py` | Tải có User-Agent kèm link repo, nghỉ 2,5 giây giữa các yêu cầu tới Wikimedia, thử lại khi gặp 429 và 5xx (chờ theo `Retry-After`). Bộ nhớ đệm ngoài repo: `~/.cache/opus-zero` (đổi bằng `OZ_AUDIO_CACHE`) |
| `tools/audio/commons.py` | `search`, `info`, `rec` trên Commons API (`prop=imageinfo|videoinfo`, `iiprop=url|size|mime|extmetadata`, `viprop=derivatives`); lấy `LicenseShortName`, `LicenseUrl`, trang mô tả, MP3 chuyển mã (`transcodekey` mp3), bỏ phần `?utm_…` API mới gắn vào link file; theo tên chuẩn hóa và tên đổi hướng |
| `tools/audio/page.py` | Đọc và ghi khối `oz-listen` (thứ tự khóa by, note, lic, licUrl, page, parts, ref; escape HTML), bảng "Theo dõi khi nghe", đường dẫn tương đối tới `docs/assets/audio/` |
| `tools/audio/attach.py` | Ghi khối bản thu (`--json` từ `commons.py rec`, hoặc `--part` cho file lưu trên site) hoặc chỉ mốc (`--ref`); kiểm trước khi ghi: giấy phép, file có thật, `d`, tên phần, mốc tăng dần, không nhiều hơn số dòng bảng, không quá độ dài bản thu. Thay bản thu thì bỏ mốc cũ (in ra); `--keep-ref` khi file mới cùng nội dung |
| `tools/audio/transcode.py`, `sound.py` | Chuyển mã bản thu IMSLP theo đặc tả (mục bên dưới); thêm `--start` để chuyển mã lại một file đã có mốc mà không làm lệch mốc |
| `tools/audio/check_audio.py` | Các phép kiểm của mục 6, thêm so sánh với file gốc trong `_imslp/` và `--network` (đối chiếu Commons) |
| `tests/run.mjs` | Nhóm `nhanh` chạy `check_audio.py --static` |
| `tools/audio/align/` | `core.py` (đặc trưng và DTW), `scores.py` và `hand.py` (đọc bản nhạc số), `pieces.py` (cấu hình 42 trang), `run.py`, `fetch.py` và `sources.json` (52 file, link ghim theo commit, sha256), `explore.py` (xem tay), `plot.py`, `evalset.py`, `NGUON.md` |
| `tools/audio/requirements.txt`, `.gitignore` | Thư viện của phần căn mốc, cài trong `.venv-audio/` riêng (không đưa lên git) |
| `tools/audio/README.md` | Quy trình thêm một bản thu từ đầu đến cuối, cách căn mốc, thêm cấu hình |
| `AGENTS.md`, `README.md` | Thư mục `tools/audio/`, `check_audio` trong nhóm `nhanh` và bản đầy đủ chạy tay, không sửa `data-rec` bằng tay, checklist bài học trỏ tới quy trình |

## Build và kiểm thử

- `mkdocs build --strict` (sau commit cuối): `INFO - Documentation built in 2.40 seconds`, không cảnh báo.
- `npm test` (sau commit cuối): `Kiểm thử: 4 nhóm chạy song song trong 15.2 giây, mọi nhóm đều đạt`; dòng mới trong nhóm `nhanh`: `check_audio --static: 13 file trên site, 45 trang có bản thu, 0 lỗi`.
- `python3 tools/audio/check_audio.py`: `13 file trên site (13 so được với file gốc trong _imslp/), 45 trang có bản thu (95 phần trên mạng), 0 lỗi`, kèm 3 dòng "chú ý" (mục Phát hiện). Khoảng 4 giây.
- `python3 tools/audio/check_audio.py --network`: 0 lỗi. Cả 95 phần trên mạng (90 file Commons) còn trên Commons, độ dài khớp `d` tới 0,0 giây, giấy phép trên Commons đúng giấy phép ghi trên trang.

## Số đo

### Chuyển mã: đuôi file

Chạy `transcode.py --out-dir` trên ba file gốc trong `_imslp/`, so với quy tắc cũ (cắt ở chỗ `silencedetect=noise=-45dB` báo im lặng, cộng 2 giây, không làm nhỏ dần):

| File | Dài (gốc) | Tiếng tắt (dưới −60 dBFS) | Quy tắc cũ cắt ở | `transcode.py` mới |
|---|---|---|---|---|
| Tchaikovsky: Cầu nguyện buổi sáng | 80,25 s | 76,75 s | 74,61 s: mất 2,1 giây tiếng ngân | Không cắt đuôi (chỉ 3,5 giây im lặng) |
| Burgmüller: La candeur | 111,18 s | 104,75 s | 105,26 s: dừng đột ngột ở mức −62 dBFS | Cắt ở 107,75 s, làm nhỏ dần 1 giây cuối |
| Grieg: Arietta | 87,83 s | 87,20 s | Không cắt | Không cắt (file gốc dừng 0,6 giây sau khi tiếng tắt) |

`check_audio.py --tail` trên ba file mới: 0,25 giây cuối to nhất −85,7, −80,0 và −61,7 dBFS.

### Căn mốc: chạy lại toàn bộ

- Chạy `align/run.py` cho cả 42 cấu hình: 41 cho ra đúng từng mốc đang ghi trên trang, gồm 12 mốc của Debussy: Préludes, tính lại bằng kiểu dòng `"start"` mới. Cấu hình còn lại lệch 1 mốc (Cầu nguyện buổi sáng, mục Phát hiện).
- `align/evalset.py` (14 mốc đã xác minh tay trên 6 bản thu): code cũ và code mới cho ra đúng từng con số, ở cả 6 bộ tham số. Bộ thường: trung bình |sai số| 1,12 giây, lớn nhất 5,13; bộ khởi âm: 1,80 và 19,21.
- 38/52 file trong `sources.json` trùng từng byte với file đã dùng ở v12–v14 (`_imslp/_scripts/align/src/`). Hai file kern Chopin (bản in đầu) trên GitHub nay khác ở ghi chú biên tập và siêu dữ liệu, cao độ và trường độ không đổi. 11 MIDI Mutopia nay lấy bản Mutopia dựng sẵn (xem mục Phát hiện). File kern đúng của K. 545 là file mới.

## Đối chiếu tiêu chí "Xong khi"

- [x] Chạy lại `transcode.py` trên một file cũ cho kết quả không cụt đuôi (bảng trên; La candeur giữ đủ 3 giây sau khi tiếng tắt, Cầu nguyện buổi sáng giữ trọn đuôi).
- [x] `check_audio.py` sạch trên các file hiện có: 0 lỗi; 3 dòng chú ý liệt kê ở mục Phát hiện.
- [x] README trong `tools/audio/` đủ để một agent khác thêm một bản thu từ đầu đến cuối. Một agent độc lập chỉ được đọc AGENTS.md, README và `--help` đã làm thử với trang Mozart K. 331 (chỉ chạy `--dry-run`, không sửa repo). Lần thử đó tìm ra 4 chỗ phải đoán và một số lỗi; tất cả đã sửa ở `851dd79` (mục Thử README). Chưa cho agent khác thử lại lần hai.

## Thử README với một agent độc lập

Agent làm theo README để thêm bản thu cho `nghe-nhac/mozart-k331.md`: tìm trên Commons, `commons.py rec`, `attach.py --dry-run`, tìm bản nhạc số, xem chỉ số ô, so cách nối đoạn, viết thử cấu hình (không chạy `--write`), `check_audio.py` các chế độ. Những gì nó báo và cách đã sửa:

| Agent báo | Sửa |
|---|---|
| Ví dụ trong `attach.py --help` dùng `--page`, lệnh báo "unrecognized arguments" | Ví dụ dùng `--source` như tùy chọn thật |
| Không có lệnh đọc trang mô tả file; `artist` của `info` thường là nhà soạn nhạc; ✓ không bắt được bản dựng từ MIDI ("synthesized") hay năm thu; `search` dừng ở 20 kết quả mà không báo | Lệnh `commons.py page` (wikitext của trang mô tả), `--fresh`; `search` báo khi chạm giới hạn; README và docstring liệt kê những gì ✓ không kiểm |
| `explore.py bars` với file kern mà không có `--read`: "OSError: MThd not found" | Cách đọc đoán từ tên file |
| Số trong ngoặc vuông không phải số ô in (K. 331/III: ô 9 hiện [10]) | partitura đánh số ô liên tục ở `number`; số ô in nằm ở `name`. Nay nhãn là số ô in (rỗng cho ô lấy đà, kết 2, cadenza). Kiểm trên Nocturne Op. 9 số 2: hai ô cadenza không có số, đúng ghi chú cũ trong `pieces.py` |
| Nguồn mới phải sửa `sources.json` bằng tay, không có lệnh tính sha256 | `fetch.py --add` (tải, tính sha256, ghi `sources.json`); quy ước đặt tên trong `--help` |
| `structure`, `onsets`, `run.py` cần khối bản thu đã có trên trang | `explore.py` nhận thẳng file hoặc link âm thanh; README nói rõ phải ghi khối bản thu trước khi chạy `run.py` |
| `"start"` trong job có bản nhạc làm hỏng lệnh (`TypeError: ufunc 'floor'`) | `"start"` dùng được ở mọi job; vị trí sai thì báo lỗi rõ |
| Một job phải phủ trọn một phần bản thu, nên chương có chủ đề và biến tấu ở nhiều file kern không căn được | `join` nối nhiều file liền nhau; `explore.py bars a b ...` cho chỉ số ô liền qua các file |
| `k` của `structure` tùy `--qpm`; ba dấu hiệu chỉ ba cách khác nhau mà README không nói chọn thế nào | README và `explore.py --help`: `k` chỉ để so giữa các cách nối; khi các dấu hiệu không cùng chỉ một cách thì nghe lại hoặc xem `onsets` |
| Giây trong `fix`, `anchors`, `onsets` tính trong phần, còn `ref` liền qua các phần; khóa dòng tính từ 0 nhưng `run.py` in từ 1 | Ghi rõ trong README và docstring của `pieces.py` |
| Thêm file MP3 lưu trên site làm đổi con số "N bản thu từ IMSLP" mà `counts.py` kiểm | README mục 2b |
| README không nói dùng `.venv-audio/bin/python` cho phần căn mốc | Đầu README và mục Căn mốc |
| `evalset.py --help` chạy luôn bộ kiểm tra; `check_audio.py --help` nói "phải giữ 3 giây" trong khi chỉ in "chú ý" | `evalset.py` có `--help`; câu trong `check_audio.py` sửa cho đúng |

Sau khi sửa, chạy lại 42 cấu hình và `evalset.py` cho đúng như trước (41/42 khớp từng mốc; `evalset` không đổi con số nào).

## Phát hiện

1. **Ngưỡng −50 dBFS của kế hoạch không bắt được lỗi cắt đuôi cũ.** Ở chỗ quy tắc cũ cắt, mức âm đã xuống khoảng −59 dBFS (Cầu nguyện buổi sáng) và −62 dBFS (La candeur). `check_audio.py` vẫn kiểm ngưỡng −50 dBFS (bắt được chỗ cắt khi nhạc còn to; thử cắt Arietta ở giây 40 thì báo −48,3 dBFS). Khi có file gốc trong `_imslp/`, công cụ so thêm điểm tắt tiếng với file gốc. Phép so này cho thấy không file nào trên site còn mất tiếng ngân: hai file đã sửa tay giữ 3,05 và 3,55 giây sau khi tiếng tắt.
2. **Ba file giữ ít hơn 3 giây im lặng ở cuối:** `bach-prelude-bwv939.mp3` (1,1 giây; file gốc có 8,0), `burgmuller-arabesque.mp3` (1,9; gốc 3,0), `minuet-sol-thu.mp3` (1,9; gốc 10,9). Tiếng đã tắt hẳn trước chỗ cắt: mức âm ở chỗ cắt là −69, −112 và −75 dBFS, nên không nghe thấy khác biệt. `check_audio.py` ghi là "chú ý", không phải lỗi. Tôi không chuyển mã lại: muốn làm thì dùng `transcode.py --start <số giây đã cắt ở đầu>` (lấy từ `check_audio.py -v`) để mốc không lệch.
3. **Nguồn đối chiếu của K. 545 ở v13 là nhầm file.** `kern_sonata16-1.krn` trong `_imslp/_scripts/align/src/` là một sonata khác: đầu file ghi "Piano Sonata No. 16 in B-flat major", K. Anh. 136. K. 545 trong kho của Craig Sapp là `sonata15-1.krn`. Nay `pieces.py` đối chiếu bằng file đúng. Các mốc K. 545 trên trang vẫn đúng: nguồn đối chiếu đúng lệch không quá 0,1 giây ở mọi dòng. Ở dòng Tái hiện, nó cho 74,7 giây, đúng bằng giá trị đã đo tay ở v13.
4. **Bốn dòng được tính lại khác trang; tôi kiểm tay trên khởi âm từng cao độ, ghi vào `fix` kèm chú thích:**
    - Chopin Prelude Mi thứ, dòng 3 (ô 12). Nguồn kern đối chiếu căn vào 41,9 giây, MIDI căn vào 45,9. Đo tay: Fa♯4 mở ô 10 và 11 ở 38,45 và 42,21 giây, Sol4 mở ô 12 ở 46,3, Rê5–Đô5–Si4 phách 4 ở 48,95–50,0. Vậy mốc 46 trên trang đúng, nguồn kern căn nhầm.
    - Burgmüller Arabesque, dòng 2 (đoạn A). Hai trong ba biến thể ra 2,0 giây, biến thể khởi âm ra 3,3. Đo tay: La4 mở đoạn A ở 3,44 giây, sau bốn hợp âm dẫn nhập. Mốc 3 trên trang đúng; quy tắc "hai trong ba" ở đây chọn sai.
    - Tchaikovsky Bài ca Pháp cổ, dòng 4: lần chạy mới ra 41,5 → 42. Đo tay: Fa♯4 + La4 ở 41,3 giây. Mốc 41 trên trang đúng.
    - Tchaikovsky Cầu nguyện buổi sáng, dòng 5 (ô 13): lần chạy mới ra 36. Đo tay: Mi♭5 + Si4 ở 36,3 giây. **Trang ghi 37, lệch 0,7 giây**, trong ngưỡng 2 giây nên để nguyên; muốn sửa thì `python3 tools/audio/align/run.py tchaikovsky-cau-nguyen-buoi-sang --write`.

    Ba dòng sau dùng MIDI Mutopia dựng sẵn thay cho bản tự dựng bằng LilyPond 2.25.12 ở v14. Hai bản cùng nốt và cùng vị trí, khác ở lực bấm, nên kết quả căn xê dịch dưới 1 giây. Biến thể thô→mịn thường cho ra đúng như biến thể thường, nên quy tắc "hai trong ba" nhiều khi chỉ là một ý kiến. README ghi lưu ý này và khuyên dùng nguồn đối chiếu độc lập (`check`).
5. **Ba cấu hình cũ trỏ tới trang không còn:** `nghe-nhac/bach-prelude-c.md`, `chopin-nocturne.md`, `debussy-clair-de-lune.md` đã gộp vào bài học ở v14 (có trong `hooks/redirects.py`). Tôi bỏ ba cấu hình này. Trang Debussy: Préludes chưa có cấu hình; nay có (12 mốc là lúc có tiếng đầu tiên của từng bài, tính lại khớp cả 12).
6. **Nguồn bản nhạc số khó tải:** piano-midi.de trả mã 418 cho User-Agent của dự án (cả `robots.txt`), nên 18 file `cpm_*.mid` phải tải tay. Tôi không đổi User-Agent để vượt. KernScores (`kern.humdrum.org`) đang chuyển sang trang bảo trì của Viện Chopin, nên Invention số 1 phải lấy từ bản đã dùng. `fetch.py --from _imslp/_scripts/align/src` chép các file này (đúng sha256).

## Ghi chú cho G4b

Trong lần thử, agent thấy các ứng viên cho K. 331 trên Commons. Tôi đọc trang mô tả của ba nhóm đầu bằng `commons.py --fresh page`; chưa nghe file nào.

- Các file "Piano Sonata No. 11, Variation 1.ogg"… (Commons ghi phạm vi công cộng): trang mô tả ghi "Note that this is synthesized music, not a live recording", dựng từ MIDI của Mutopia. Không dùng được.
- Leonid Kreutzer ("PDP-CH - Leonid Kreutzer, piano - Piano Sonata No. 11 in A major, K 331-300i - Mozart - Gramophone-95178-b27304.flac", Commons ghi phạm vi công cộng): thu ở Berlin, phát hành "before 1933", ngày biểu diễn ghi 1933; nội dung "Theme with variations, Part 1", tức chỉ một phần của chương. Theo quy tắc 100 năm trong AGENTS.md, bản xuất bản từ 1926 trở về sau còn được bảo hộ ở Mỹ; phải xác định năm phát hành trước khi dùng, nhiều khả năng là chưa dùng được.
- Bernd Krueger, ba chương ("Mozart - Piano Sonata No. 11 in A major - I. Andante grazioso.ogg"…): CC BY-SA 3.0 DE; trang ghi nguồn http://www.piano-midi.de/mozart.htm, tức site MIDI của Krueger. Nhiều khả năng là âm thanh dựng từ MIDI, không phải người chơi; cần kiểm khi làm G4b.
- Chưa đọc trang: "Thema KV331Clavichord.ogg" (CC BY-SA 3.0, chơi trên clavichord), "Turkey March … JMC, Han.ogg" và "Sure, Ma's Version of 'Turkish March'….ogg" (CC BY-SA 4.0).

Kern của K. 331 có ở kho Mozart của Craig Sapp (`sonata11-1a.krn`…, `sonata11-2.krn`, `sonata11-3.krn`), nối các biến tấu bằng `join`.

## Chỗ chưa chắc hoặc đã bỏ qua

- Giấy phép piano-midi.de (CC BY-SA 3.0 Đức) đọc qua bản trích trong tệp bản quyền của gói Debian `midicsv`, không đọc được trên chính site (chặn bot; bản lưu của Internet Archive lúc đó tạm ngừng). Đường dẫn từng file theo mẫu `midis/<tác giả>/<tên>.mid` (mẫu có trong tệp Debian), chưa mở thử từng link.
- Ba kho không ghi giấy phép (sonata Beethoven và Prelude Chopin của Craig Sapp; bản LilyPond Gymnopédie dùng để chép tay); Invention số 1 ghi "Rights to all derivative electronic formats reserved". Các file chỉ tải về máy để căn mốc, không đưa lên git hay lên site; `NGUON.md` ghi rõ điều này.
- `check_audio.py --static` trong `npm test` không có trong kế hoạch: kế hoạch chỉ nói không đưa bản cần ffmpeg vào nếu làm chậm. Bản `--static` không cần ffmpeg và chạy 0,1 giây, nên tôi thêm vào để CI bắt `data-rec` sai mẫu ở G4b, G6. Bản đầy đủ vẫn chạy tay; chưa thêm vào CI (cần cài ffmpeg trên runner).
- `check_audio.py --network` không gửi HEAD tới từng link MP3 chuyển mã. Nó chỉ hỏi API (file còn đó, độ dài, giấy phép), vì 95 yêu cầu HEAD với 2,5 giây nghỉ mỗi lần là khá lâu.
- Mốc của Goldberg và Kinderszenen vẫn là số đo cũ ghi cứng trong `pieces.py` (tiếng đầu tiên của từng phần, đo trên 300 KB đầu file), chưa tính lại bằng `"start"` vì phải tải 45 file.
- Câu "Thay đổi" ở đầu `NGUON.txt` mô tả cách xử lý của các file hiện có; khi thêm file mới bằng `transcode.py`, sửa câu đó cho đúng (README ghi việc này).
- Không dùng lại đường dựng MIDI bằng LilyPond (máy không cài LilyPond); `sources.json` ghi link file `.ly` gốc để dựng lại nếu cần.
- Ba trang có bản thu nhưng chưa có mốc: *Eine kleine Nachtmusik*, Vivaldi "Mùa xuân", Chopin Valse La thứ (không thuộc G4a).

## Nguồn đã dùng để kiểm chứng

- Kế hoạch `plans/ke-hoach-v15.md`, mục G4a; script cũ trong `_imslp/_scripts/` (`audio/`, `align/`), bản thu gốc trong `_imslp/`.
- Commons API (`commons.wikimedia.org/w/api.php`) cho 90 file Commons đang dùng.
- Giấy phép các bộ dữ liệu: README của ASAP (https://github.com/fosfrancesco/asap-dataset); `LICENSE.txt` của https://github.com/craigsapp/mozart-piano-sonatas và https://github.com/pl-wnifc/humdrum-chopin-first-editions; README và `LICENSE` của https://github.com/DCMLab/grieg_lyric_pieces; `LICENSE.md` của https://github.com/trompamusic-encodings/Beethoven_WoOAnh5_BreitkopfHaertel; trường `license`/`copyright` trong 12 file `.ly` của Mutopia (https://github.com/MutopiaProject/MutopiaProject); tệp bản quyền của gói Debian `midicsv` (https://metadata.ftp-master.debian.org/changelogs/main/m/midicsv/stable_copyright) cho câu giấy phép của piano-midi.de.
- Đầu file kern (`!!!COM`, `!!!OTL`, `!!!SCT`) để xác định đúng tác phẩm.
