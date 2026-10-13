#!/usr/bin/env python3
"""Kiểm tra tĩnh, chạy nhanh không cần build:
1. Mọi khối ```mermaid trong docs đều có quy tắc tải trong loader.js
   (quên quy tắc thì trang hiện mã thô).
2. Sách "Hướng dẫn nghe" (hooks/books.py) chứa đúng các guide trong nav
   (thêm guide mà quên sách thì sách in thiếu chương).
3. Mọi chương trong BOOKS đều có trang tương ứng trong nav.
4. VERSION trong docs/sw.js và docs/assets/js/loader.js khớp nhau.
5. Mọi file trong PRECACHE của sw.js đều tồn tại trong docs/.
"""
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
fails = []


def fail(msg):
    fails.append(msg)
    print("x", msg)


loader_src = (ROOT / "docs/assets/js/loader.js").read_text(encoding="utf-8")
sw_src = (ROOT / "docs/sw.js").read_text(encoding="utf-8")

# --- 1. mermaid ---
md_files = list((ROOT / "docs").rglob("*.md"))
with_mermaid = [p.relative_to(ROOT) for p in md_files
                if re.search(r"^```mermaid", p.read_text(encoding="utf-8"), re.M)]
if with_mermaid and '".mermaid"' not in loader_src:
    fail("có %d trang dùng ```mermaid nhưng loader.js thiếu quy tắc [\".mermaid\", ...]: %s"
         % (len(with_mermaid), ", ".join(str(p) for p in with_mermaid[:5])))

# --- nav ---
# Lấy đường dẫn .md bằng regex thay vì parse YAML: mkdocs.yml dùng tag !!python/name
# mà yaml.safe_load không đọc được. Mọi .md trong file này đều là trang trong nav.
nav_text = (ROOT / "mkdocs.yml").read_text(encoding="utf-8")
nav_pages = set(re.findall(r"[a-z0-9_\-/]+\.md", nav_text))

# --- 2. guide trong nav so với sách ---
NON_GUIDES = {"nghe-nhac/index.md", "nghe-nhac/doc-ten-tac-pham.md",
              "nghe-nhac/mau.md", "nghe-nhac/nghe-gi-tiep.md"}
nav_guides = {p[len("nghe-nhac/"):-len(".md")] for p in nav_pages
              if p.startswith("nghe-nhac/") and p not in NON_GUIDES}

spec = importlib.util.spec_from_file_location("books_hook", ROOT / "hooks" / "books.py")
books_hook = importlib.util.module_from_spec(spec)
spec.loader.exec_module(books_hook)
books = dict((b[0], b[3]) for b in books_hook.BOOKS)
book_guides = {c.split("/")[1] for c in books["huong-dan-nghe"]
               if c != "nghe-nhac/doc-ten-tac-pham/"}
for slug in sorted(nav_guides - book_guides):
    fail("guide '%s' có trong nav nhưng thiếu trong sách 'huong-dan-nghe' (hooks/books.py)" % slug)
for slug in sorted(book_guides - nav_guides):
    fail("sách 'huong-dan-nghe' liệt kê '%s' nhưng nav không còn trang này" % slug)

# --- 3. mọi chương sách đều có trang trong nav ---
# Chương dạng "lich-su/" (URL thư mục) tương ứng với "lich-su/index.md" trong nav.
for book_id, chapters in books.items():
    for c in chapters:
        base = c.rstrip("/")
        if base + ".md" not in nav_pages and base + "/index.md" not in nav_pages:
            fail("sách '%s' liệt kê '%s' nhưng nav không có trang này" % (book_id, c))

# --- 4. VERSION khớp nhau ---
m1 = re.search(r'const V\s*=\s*(\d+)', sw_src) or re.search(r'"opus-zero-v(\d+)"', sw_src)
m2 = re.search(r'const VERSION = "(\d+)"', loader_src)
if not m1 or not m2:
    fail("không đọc được VERSION trong sw.js hoặc loader.js")
elif m1.group(1) != m2.group(1):
    fail("VERSION lệch nhau: sw.js v%s, loader.js v%s (phải tăng cả hai cùng lúc)"
         % (m1.group(1), m2.group(1)))

# --- 5. PRECACHE tồn tại ---
for m in re.finditer(r'"(assets/[^"]+)"', sw_src.split("PRECACHE")[1].split("]")[0]):
    rel = m.group(1).split("?")[0]
    if not (ROOT / "docs" / rel).exists():
        fail("sw.js precache '%s' nhưng docs/%s không tồn tại" % (m.group(1), rel))

print("site_static: %d kiểm tra, %d lỗi" % (5, len(fails)))
sys.exit(1 if fails else 0)
