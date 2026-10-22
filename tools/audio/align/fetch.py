"""Tải bản nhạc số cần cho việc căn mốc vào scores/ của bộ nhớ đệm (xem net.py), theo danh sách sources.json.

    python3 tools/audio/align/fetch.py                       # mọi file trong sources.json
    python3 tools/audio/align/fetch.py cpm_elise.mid ...     # một vài file
    python3 tools/audio/align/fetch.py --from _imslp/_scripts/align/src   # chép từ thư mục có sẵn trước khi tải
    python3 tools/audio/align/fetch.py --status              # file nào đã có, file nào còn thiếu

Mỗi file phải khớp sha256 ghi trong sources.json (đúng bản đã dùng để căn mốc hiện có). File "manual" (site chặn
tải tự động hoặc tạm ngừng) thì tải tay bằng trình duyệt từ link in ra, đặt vào thư mục scores/ với đúng tên.
Nguồn và giấy phép của từng bộ: NGUON.md. Các file này không đưa lên git.
"""
import argparse
import hashlib
import json
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import net  # noqa: E402

SOURCES = json.loads((HERE / "sources.json").read_text(encoding="utf-8"))


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("names", nargs="*", help="tên file trong sources.json (bỏ trống: tất cả)")
    ap.add_argument("--from", dest="mirror", help="thư mục có sẵn các file cùng tên (chỉ nhận file đúng sha256)")
    ap.add_argument("--status", action="store_true")
    a = ap.parse_args()
    unknown = [n for n in a.names if n not in SOURCES]
    if unknown:
        sys.exit("không có trong sources.json: " + ", ".join(unknown))
    dest = net.cache_dir("scores")
    todo, manual, bad = a.names or sorted(SOURCES), [], []
    for name in todo:
        s = SOURCES[name]
        target = dest / name
        if target.exists() and sha256(target) == s["sha256"]:
            if a.status:
                print("có    %s" % name)
            continue
        if a.status:
            print("thiếu %s%s" % (name, " (tải tay)" if s.get("manual") else ""))
            continue
        if a.mirror and (Path(a.mirror) / name).exists():
            src = Path(a.mirror) / name
            if sha256(src) == s["sha256"]:
                shutil.copyfile(src, target)
                print("chép  %s" % name)
                continue
        if s.get("manual"):
            manual.append((name, s))
            continue
        tmp = dest / (name + ".new")
        tmp.unlink(missing_ok=True)
        try:
            net.download(s["url"], tmp)
        except Exception as e:                       # 404, máy chủ ngừng...: báo rồi làm tiếp file khác
            bad.append((name, None))
            print("LỖI  %s: %s (%s)" % (name, e, s["url"]))
            continue
        got = sha256(tmp)
        if got != s["sha256"]:
            bad.append((name, got))
            print("KHÁC  %s: sha256 %s, sources.json ghi %s (giữ ở %s)" % (name, got[:12], s["sha256"][:12], tmp))
            continue
        tmp.replace(target)
        print("tải   %s" % name)
    if manual:
        print("\nCần tải tay (đặt vào %s, giữ đúng tên):" % dest)
        for name, s in manual:
            print("  %s  <-  %s%s" % (name, s["url"], "  (%s)" % s["note"] if s.get("note") else ""))
    if any(got for _, got in bad):
        print("\nNguồn đã đổi so với bản dùng để căn mốc: so lại nội dung (explore.py bars) trước khi cập nhật sha256.")
    sys.exit(1 if (manual or bad) and not a.status else 0)


if __name__ == "__main__":
    main()
