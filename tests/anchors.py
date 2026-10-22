#!/usr/bin/env python3
"""Link nội bộ mà `mkdocs build --strict` không kiểm được. Cần site/ đã build.

MkDocs đã kiểm mọi link Markdown, kể cả phần #mục (mkdocs.yml: validation.anchors), và
hooks/redirects.py kiểm đích của trang chuyển hướng lúc build. Kiểm thử này lo phần còn lại:
1. Đường dẫn trang viết trong JavaScript (SKILLS của plan.js, SUGGEST của practice.js...): trang phải
   có trong site/, #mục (nếu có) phải là id có thật trên trang đó.
2. href trong HTML viết tay trong Markdown (ví dụ nút "Mở sách" ở trang Sách in).
3. Đường dẫn MP3 tương đối trong data-rec của khối bản thu (file lưu trong docs/assets/audio/).
"""
import html
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS, SITE = ROOT / "docs", ROOT / "site"
if not (SITE / "index.html").exists():
    sys.exit("anchors: chưa có site/, hãy chạy mkdocs build trước")

fails = []
checked = 0


def fail(msg):
    fails.append(msg)
    print("x", msg)


def target_ok(where, path, anchor):
    """Báo lỗi nếu `path` (tương đối với gốc site/) không có, hoặc trang không có id `anchor`."""
    global checked
    checked += 1
    f = SITE / path
    if f.is_dir():
        f = f / "index.html"
    if not f.is_file():
        fail("%s: link tới %s nhưng site/ không có" % (where, path or "/"))
    elif anchor and not re.search(r'\bid="%s"' % re.escape(anchor), f.read_text(encoding="utf-8")):
        fail("%s: link tới %s#%s nhưng trang không có mục #%s" % (where, path, anchor, anchor))


# --- 1. Đường dẫn trang trong JavaScript ---
sections = sorted(d.name for d in DOCS.iterdir() if d.is_dir() and any(d.rglob("*.md")))
page = re.compile(r"""(?<=["'])((?:%s)(?:/[a-z0-9-]+)*/)(?:#([\w-]+))?(?=["'])""" % "|".join(map(re.escape, sections)))
for js in sorted((DOCS / "assets/js").glob("*.js")):
    rel = js.relative_to(ROOT).as_posix()
    for i, line in enumerate(js.read_text(encoding="utf-8").splitlines(), 1):
        for path, anchor in page.findall(line):
            target_ok("%s:%d" % (rel, i), path, anchor)

# --- 2. href trong HTML viết tay; 3. MP3 trong data-rec ---
href = re.compile(r'href="([^"]*)"')
for md in sorted(DOCS.rglob("*.md")):
    rel = md.relative_to(ROOT).as_posix()
    url = md.relative_to(DOCS).as_posix()[:-3]
    url = url[:-len("index")] if url == "index" or url.endswith("/index") else url + "/"  # use_directory_urls
    for i, line in enumerate(md.read_text(encoding="utf-8").splitlines(), 1):
        links = [h for h in href.findall(line) if not re.match(r"[a-z]+:|#|$", h)]
        for rec in re.findall(r'data-rec="([^"]*)"', line):
            try:
                parts = json.loads(html.unescape(rec)).get("parts", [])
            except ValueError:
                fail("%s:%d: data-rec không phải JSON hợp lệ" % (rel, i))
                continue
            links += [p["mp3"] for p in parts if p.get("mp3") and not re.match(r"[a-z]+:", p["mp3"])]
        for h in links:
            path, _, anchor = h.partition("#")
            path = os.path.normpath(os.path.join(url, path)).replace(os.sep, "/")
            target_ok("%s:%d" % (rel, i), "" if path == "." else path, anchor)

print("anchors: %d link trong JavaScript, HTML viết tay và data-rec, %d lỗi" % (checked, len(fails)))
sys.exit(1 if fails else 0)
