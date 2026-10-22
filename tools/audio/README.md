# Công cụ bản thu

Các script ở đây tìm bản thu có giấy phép mở, đưa bản thu vào trang (khối `oz-listen` với `data-rec`), chuyển mã bản thu IMSLP để lưu trên site, kiểm tra toàn bộ bản thu của site, và căn mốc tham khảo cho bảng "Theo dõi khi nghe". Chúng thay cho các script cũ của v12–v14 trong `_imslp/_scripts/` (giữ lại để tham khảo, đừng chạy).

| File | Việc | Cần |
|---|---|---|
| `licenses.py` | Danh sách giấy phép được nhận (nơi duy nhất trong code): phạm vi công cộng (kể cả PDM), CC0, CC BY và CC BY-SA từ 2.0 đến 4.0. Không nhận NC, ND | Python 3.10+ |
| `commons.py` | Tìm và tra file trên Wikimedia Commons; in JSON khối bản thu cho `attach.py` | Python, mạng |
| `transcode.py` | Chuyển mã bản thu tải tay (IMSLP) thành MP3 trong `docs/assets/audio/`, ghi `NGUON.txt` | Python, ffmpeg |
| `attach.py` | Ghi khối bản thu (hoặc chỉ mốc `ref`) vào trang, kiểm tra trước khi ghi | Python |
| `check_audio.py` | Kiểm tra mọi file, `NGUON.txt` và mọi `data-rec`; `--network` đối chiếu với Commons | Python, ffmpeg |
| `align/` | Căn mốc tham khảo bằng bản nhạc số (DTW) | `requirements.txt` |
| `net.py`, `page.py`, `sound.py` | Phần dùng chung: tải có User-Agent và nghỉ giữa các yêu cầu, đọc và ghi khối bản thu, đo âm lượng | |

Các lệnh dưới đây chạy từ thư mục gốc của repo. Bộ nhớ đệm (câu trả lời API, bản thu tải về, bản nhạc số, đặc trưng, hình kiểm tra) nằm ngoài repo, ở `~/.cache/opus-zero/` (đổi bằng biến `OZ_AUDIO_CACHE`).

## Thêm một bản thu, từ đầu đến cuối

### 1. Kiểm tra bản quyền và chọn bản thu

Đọc mục Bản quyền của `AGENTS.md` trước. Tóm tắt: tác phẩm phải hết bảo hộ ở cả Việt Nam và Mỹ. Bản thu phải có giấy phép trong danh sách của `licenses.py`. Ở Mỹ, bản thu xuất bản từ 1923 đến 1946 được bảo hộ 100 năm (bản 1924 vào phạm vi công cộng năm 2025, bản 1929 phải tới năm 2030). Đọc giấy phép trên **trang mô tả của từng file**; danh sách tìm kiếm chỉ là bản tóm tắt.

Tìm trên Commons (Musopen đăng nhiều bản CC0 và phạm vi công cộng ở đây):

```bash
python3 tools/audio/commons.py search "Mozart sonata K. 331"
python3 tools/audio/commons.py info "File:Tên file.ogg"
```

`search` đánh dấu ✓ cho giấy phép được nhận, ✗ cho giấy phép không được nhận. Chọn bản chơi đúng tác phẩm, đúng chương, nghe được trọn (ghi chú trong `note` nếu file dừng giữa chừng, ví dụ "file dừng ở khoảng 6:24"). Tác phẩm nhiều chương thì mỗi chương là một phần, theo đúng thứ tự trang dùng.

Bản thu chỉ có trên IMSLP: ghi tên file và link trang file vào báo cáo để chủ site tải tay vào `_imslp/`. Không tải tự động từ IMSLP.

### 2a. Bản thu Commons: ghi vào trang

```bash
python3 tools/audio/commons.py rec --by "Kimiko Ishizaka" "File:A.ogg" "File:B.ogg" --t "Prelude" --t "Fugue" > /tmp/rec.json
python3 tools/audio/attach.py docs/piano/tac-pham/<slug>.md --json /tmp/rec.json
```

`rec` lấy MP3 chuyển mã của Commons (`mp3`), file gốc (`src`), độ dài (`d`), giấy phép và link giấy phép, trang mô tả file đầu tiên (`page`). Lệnh báo lỗi nếu một file không có MP3, giấy phép không được nhận, hoặc các file khác giấy phép nhau. Sửa `by` cho đúng cách ghi người chơi trên site, ví dụ "Frank Lévy (Musopen)".

### 2b. Bản thu IMSLP: chuyển mã, ghi nguồn, ghi vào trang

```bash
python3 tools/audio/transcode.py "_imslp/PMLP1776-grieg_arietta.mp3" --name grieg-arietta \
    --page docs/piano/tac-pham/grieg-arietta.md --work "Grieg: Arietta Op. 12 số 1" \
    --by "Luis Kolodin" --lic "CC BY-SA 4.0"
# in ra: {"mp3": "../../../assets/audio/grieg-arietta.mp3", "d": 86.83}
python3 tools/audio/attach.py docs/piano/tac-pham/grieg-arietta.md --by "Luis Kolodin" --lic "CC BY-SA 4.0" \
    --source "https://imslp.org/wiki/File:PMLP1776-grieg_arietta.mp3" \
    --part '{"mp3":"../../../assets/audio/grieg-arietta.mp3","d":86.83}'
```

`transcode.py`:

- MP3 tối đa 128 kbps.
- Đầu file: cắt khoảng lặng nhưng giữ 0,5 giây trước nốt đầu.
- Cuối file: chỉ cắt khi đã im hẳn (dưới −60 dBFS) hơn 3,5 giây; giữ 3 giây sau khi tiếng tắt và làm nhỏ dần giây cuối, nằm trọn trong phần đã im.
- Ghi thẻ ID3 (tên tác phẩm, người chơi, giấy phép, nguồn).
- Ghi một dòng vào `docs/assets/audio/NGUON.txt`, thay dòng cũ cùng tên file.
- Link nguồn suy ra từ tên file IMSLP (`PMLP…`); tên file khác thì thêm `--source`.

Thử trước bằng `--out-dir /tmp/thu`: lệnh ghi file vào thư mục đó và không sửa `NGUON.txt`. Câu "Thay đổi" ở đầu `NGUON.txt` mô tả cách xử lý chung; nếu thêm file mới, sửa câu đó cho đúng (cắt đầu, cắt đuôi, làm nhỏ dần).

Bản thu nhiều file (nhiều chương): chạy `transcode.py` cho từng file, thêm `--t "Tên phần"`. Rồi `attach.py` với nhiều `--part`, theo thứ tự. `page` lúc này là trang tác phẩm trên IMSLP. Ví dụ ở `piano/tac-pham/schumann-album.md`.

Chuyển mã lại một file đã có mốc (sửa đuôi, đổi bitrate): làm theo các bước sau, nếu không mọi mốc sẽ lệch.

1. Lấy số giây đã cắt ở đầu (dòng "cắt đầu") bằng `python3 tools/audio/check_audio.py -v`.
2. Chạy lại với `--start <số đó>`.
3. Ghi lại bằng `attach.py ... --keep-ref`.

### 3. Mốc tham khảo

Mỗi số trong `ref` là thời điểm (giây, tính liền qua các phần) của một dòng trong bảng "Theo dõi khi nghe", theo đúng thứ tự dòng. Dòng nào không chắc thì để `null` (trang hiện "chưa có"). **Mốc phải đúng hoặc bỏ trống.** Hai cách lấy mốc:

- Căn bằng bản nhạc số: xem mục Căn mốc bên dưới. Đây là cách đã dùng cho mọi trang hiện có.
- Đo tay rồi ghi: `python3 tools/audio/attach.py <trang> --ref "1,13,null,33"`. Đo bằng `align/explore.py onsets` (khởi âm từng cao độ) hoặc nghe nhiều lần. Ghi cách đo vào báo cáo.

Thay bản thu thì `attach.py` bỏ mốc cũ (in ra để bạn biết). Chỉ thêm `--keep-ref` khi file mới cùng nội dung với file cũ.

### 4. Kiểm tra

```bash
python3 tools/audio/check_audio.py             # file, NGUON.txt, data-rec, độ dài, đuôi file
python3 tools/audio/check_audio.py --network   # thêm: file Commons còn đó, độ dài và giấy phép khớp
mkdocs build --strict && npm test
```

`check_audio.py` không nằm trong `npm test` vì cần ffmpeg (và mạng với `--network`). Đuôi file được kiểm hai cách:

- 0,25 giây cuối không to hơn −50 dBFS: bắt được chỗ cắt khi nhạc còn to.
- Khi file gốc có trong `_imslp/`: so với file gốc, file trên site không được dừng trước khi tiếng tắt. Cách này bắt được cả lỗi của script cũ (cắt theo ngưỡng −45 dB rồi cộng 2 giây, mất tiếng ngân ở mức khoảng −60 dBFS), lỗi mà ngưỡng −50 dBFS bỏ sót.

Cuối cùng ghi vào báo cáo: bản thu đã chọn, giấy phép, link trang mô tả, những dòng để `null` và lý do.

## Căn mốc (`align/`)

Cài môi trường riêng (thư viện nặng, không trộn với môi trường của site):

```bash
python3 -m venv .venv-audio && .venv-audio/bin/pip install -r tools/audio/requirements.txt
.venv-audio/bin/python tools/audio/align/fetch.py --from _imslp/_scripts/align/src   # bản nhạc số đã dùng
```

`fetch.py` tải các file trong `align/sources.json` vào bộ nhớ đệm và chỉ nhận file đúng sha256. Nguồn piano-midi.de chặn tải tự động, còn KernScores đang bảo trì. Các file đó `fetch.py` liệt kê để tải tay, hoặc chép từ `--from` nếu có. Nguồn và giấy phép từng bộ: `align/NGUON.md`.

### Cách căn

`align/core.py` dựng đặc trưng (phổ theo nửa cung, chroma, khởi âm) cho cả bản thu và bản nhạc. Bản nhạc được kéo cho bằng độ dài bản thu, rồi DTW tìm đường khớp nhất. Mỗi dòng của bảng ứng với một vị trí ô nhịp (hoặc phách) trong bản nhạc.

Mỗi dòng được căn ba lần với ba bộ tham số: thường, có đặc trưng khởi âm, thô→mịn. Dòng được nhận khi hai lần lệch nhau không quá 2 giây. Nếu job có nguồn bản nhạc thứ hai (`check`), kết quả còn phải khớp nguồn đó trong 2 giây. Dòng không qua được thì ghi `null`, trừ khi bạn đo tay trên phổ và ghi vào `fix`.

Biến thể thô→mịn thường cho ra đúng như biến thể thường, nên "hai trong ba" nhiều khi chỉ là một ý kiến. Đối chiếu bằng một nguồn bản nhạc độc lập (`check`) chặt hơn, nên dùng khi có. Ở đợt kiểm tra 10/2026, cả hai cách đều từng sai ở một vài dòng (xem các `fix` có ghi "kiểm tra 10/2026" trong `pieces.py`). Vì vậy dòng nào có dấu ⚠ đều phải xem lại trên phổ.

### Thêm cấu hình cho một trang

1. Tìm bản nhạc số đúng tác phẩm (Mutopia, KernScores, ASAP, piano-midi.de...). Đọc giấy phép, thêm vào `align/NGUON.md` và `align/sources.json` (link GitHub ghim theo commit, sha256), rồi chạy `fetch.py <tên file>`.
2. Xem chỉ số ô: `python3 tools/audio/align/explore.py bars <file> [--read kern --qpm 80]`.
    - Ô 0 có thể là nhịp lấy đà.
    - MIDI có thể đã viết ra các dấu nhắc lại.
    - kern, MEI, MusicXML in số ô trên bản nhạc trong ngoặc vuông.
3. Biết bản thu chơi những dấu nhắc lại nào: nghe, hoặc so các cách nối đoạn bằng `explore.py structure <trang> <phần> <file> --segs "" --segs "[(0,7),(0,7),(8,23)]"`. Cách nối có chi phí thấp nhất, `k` gần 1 và biến thiên tốc độ nhỏ thường là cách bản thu đã chơi.
4. Thêm một mục vào `PIECES` trong `align/pieces.py` (docstring ở đầu file giải thích từng khóa): mỗi dòng của bảng là một vị trí, ví dụ `rows={0: "first", 1: 8, 2: (1, 0)}`. Đầu chương hoặc đầu bài trong một tập thì dùng `"start"` (tiếng đầu tiên của phần).
5. Chạy `python3 tools/audio/align/run.py <tên>`. Lệnh in mỗi dòng: mốc mới, mốc đang ghi trên trang, kết quả ba biến thể, dấu ⚠ khi chưa nhận.
6. Với dòng ⚠:
    - `run.py <tên> --plot` vẽ phổ kèm nốt đã căn (PNG trong bộ nhớ đệm, `plots/`).
    - `explore.py onsets <trang> <phần> <t0> <t1> Sol4:67 ...` liệt kê khởi âm của từng cao độ.
    - Tìm được thời điểm chắc chắn thì ghi vào `fix` kèm chú thích cách đo; không chắc thì để dòng đó `null`.
7. `run.py <tên> --write` ghi `ref` vào trang, rồi chạy `check_audio.py`, build và test.

Sửa `core.py` thì chạy `align/evalset.py`: 14 mốc đã xác minh tay trên 6 bản thu, in sai số của từng bộ tham số. Không để sai số tăng.

### Trạng thái hiện tại (10/2026)

`pieces.py` có cấu hình cho 42 trong 45 trang có bản thu. Ba trang chưa có mốc: *Eine kleine Nachtmusik*, Vivaldi "Mùa xuân", Chopin Valse La thứ. Chạy lại toàn bộ thì 41 cấu hình cho ra đúng từng mốc đang ghi trên trang. Riêng Tchaikovsky: Cầu nguyện buổi sáng, dòng 5: trang ghi 37, đo tay được 36,3 s (lệch 0,7 giây, trong ngưỡng 2 giây).
