#!/usr/bin/env python3
"""Kiểm tra tĩnh, chạy nhanh không cần build:
1. Mọi khối ```mermaid trong docs đều có quy tắc tải trong loader.js
   (quên quy tắc thì trang hiện mã thô).
2. Sách "Hướng dẫn nghe" (hooks/books.py) chứa đúng các guide trong nav
   (thêm guide mà quên sách thì sách in thiếu chương).
3. Mọi chương trong BOOKS đều có trang tương ứng trong nav.
4. VERSION trong docs/sw.js và docs/assets/js/loader.js khớp nhau.
5. Mọi file trong PRECACHE của sw.js đều tồn tại trong docs/.
6. Ma trận nhóm trong .github/workflows/test.yml khớp với các nhóm trong tests/run.mjs
   (thêm nhóm mà quên ma trận thì CI âm thầm bỏ qua nhóm đó).
7. Font tự host: không còn chỗ nào tải font từ Google Fonts (mkdocs.yml, overrides, hooks, docs/assets),
   mọi url() trong docs/assets/fonts/fonts.css và mọi font được nạp trước trong overrides/main.html
   trỏ tới file có thật.
8. requirements.txt khóa mọi gói bằng "==" (kể cả gói kéo theo), để build không tự đổi khi một gói lên bản mới.
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

# --- 6. nhóm kiểm thử: tests/run.mjs và ma trận CI khớp nhau ---
run_src = (ROOT / "tests/run.mjs").read_text(encoding="utf-8")
run_groups = re.findall(r'^  "([\w-]+)": \[', run_src.split("const GROUPS")[1].split("\n};")[0], re.M)
ci = re.search(r"^\s*group:\s*\[([^\]]*)\]", (ROOT / ".github/workflows/test.yml").read_text(encoding="utf-8"), re.M)
ci_groups = [g.strip().strip("'\"") for g in ci.group(1).split(",")] if ci else []
if not run_groups or sorted(run_groups) != sorted(ci_groups):
    fail("nhóm kiểm thử lệch nhau: tests/run.mjs có %s, ma trận trong test.yml có %s" % (run_groups, ci_groups))

# --- 7. Font tự host ---
for f in [ROOT / "mkdocs.yml", *(ROOT / "overrides").rglob("*.html"), *(ROOT / "hooks").glob("*.py"),
          *(ROOT / "docs/assets").rglob("*.css"), *(ROOT / "docs/assets/js").glob("*.js")]:
    if re.search(r"fonts\.(googleapis|gstatic)\.com", f.read_text(encoding="utf-8")):
        fail("%s tải font từ Google Fonts; font đã tự host trong docs/assets/fonts/" % f.relative_to(ROOT))
fonts_css = (ROOT / "docs/assets/fonts/fonts.css").read_text(encoding="utf-8")
for u in re.findall(r'url\("?([^")]+)"?\)', fonts_css):
    if not (ROOT / "docs/assets/fonts" / u).exists():
        fail("docs/assets/fonts/fonts.css dùng %s nhưng file không có" % u)
main_html = (ROOT / "overrides/main.html").read_text(encoding="utf-8")
preload = re.search(r'\{%-? for f in \[([^\]]*)\]', main_html)
for name in re.findall(r'"([\w-]+)"', preload.group(1)) if preload else []:
    if not (ROOT / "docs/assets/fonts" / (name + ".woff2")).exists():
        fail("overrides/main.html nạp trước font %s.woff2 nhưng file không có" % name)

# --- 8. requirements.txt khóa mọi gói ---
reqs = [l.strip() for l in (ROOT / "requirements.txt").read_text(encoding="utf-8").splitlines()
        if l.strip() and not l.lstrip().startswith("#")]
for l in reqs:
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*==[^\s=<>!~;]+", l):
        fail("requirements.txt: dòng %r chưa khóa phiên bản (dùng tên==phiên-bản)" % l)

print("site_static: %d kiểm tra, %d lỗi" % (8, len(fails)))
sys.exit(1 if fails else 0)
