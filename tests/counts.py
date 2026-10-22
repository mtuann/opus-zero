#!/usr/bin/env python3
"""Kiểm tra con số viết tay ("34 bài học tác phẩm", "Bảy cuốn", "Hơn 20 công cụ"...).

1. CLAIMS: mỗi chỗ ghi một con số của site là một dòng (file, mẫu, khóa). Mẫu là biểu thức chính quy,
   so với từng dòng của file, có {N} ở chỗ con số (chữ số, hoặc số viết bằng chữ như "Bảy", "ba mươi tư").
   Con số phải bằng giá trị thật TRUTH[khóa]; khóa bắt đầu bằng "<" (câu "Hơn N ...") thì phải nhỏ hơn.
2. Bắt buộc đăng ký: mọi cụm "số + danh từ đếm" (SITE_NOUNS, COMMON_NOUNS) trong FILES phải nằm trong
   một chỗ khớp của CLAIMS, hoặc của IGNORE (kèm lý do). Không quét khoảng ("2–3 bài"), số một, và số
   viết bằng chữ từ hai đến bốn đi với danh từ chung: trong văn xuôi, "hai bài", "ba bài" hầu như luôn
   là cách nói thường ("chơi ba bài cho người thân nghe"), không phải con số của site.
3. Dòng CLAIMS hoặc IGNORE không còn khớp chỗ nào cũng là lỗi, để hai danh sách không cũ đi.

Đăng ký một con số mới: thêm giá trị thật vào TRUTH (nếu chưa có khóa phù hợp) và một dòng vào CLAIMS.
Cụm "số + danh từ" không phải con số của site (số bài trong một tập nhạc, "260 trang" bản thảo...):
thêm một dòng vào IGNORE, ghi lý do.
"""
import fnmatch
import importlib.util
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def die(msg):
    sys.exit("counts: " + msg)


# --- Số viết bằng chữ ---
UNITS = {"một": 1, "hai": 2, "ba": 3, "bốn": 4, "năm": 5, "sáu": 6, "bảy": 7, "tám": 8, "chín": 9}
_U = "|".join(UNITS)
NUM_WORD = r"(?:(?:%s) mươi(?: (?:mốt|tư|lăm|%s))?|mười(?: (?:lăm|%s))?|%s)" % (_U, _U, _U, _U)
NUM = r"(?:\d+|%s)" % NUM_WORD


def value(s):
    s = s.lower()
    if s.isdigit():
        return int(s)
    w = s.split()
    last = dict(UNITS, mốt=1, tư=4, lăm=5)
    if w[0] == "mười":
        return 10 + (last[w[1]] if len(w) > 1 else 0)
    if len(w) > 1 and w[1] == "mươi":
        return UNITS[w[0]] * 10 + (last[w[2]] if len(w) > 2 else 0)
    return UNITS[w[0]]


# --- Nguồn sự thật ---
class _NavLoader(yaml.SafeLoader):
    pass


# mkdocs.yml có tag !!python/name (emoji, superfences) mà safe_load không đọc được: bỏ qua giá trị của chúng.
_NavLoader.add_multi_constructor("tag:yaml.org,2002:python/", lambda loader, suffix, node: None)
NAV = yaml.load(read("mkdocs.yml"), Loader=_NavLoader)["nav"]


def nav(*titles):
    """Các mục con của một nhóm nav, tìm theo đường tiêu đề."""
    items = NAV
    for t in titles:
        items = next((v for it in items if isinstance(it, dict) for k, v in it.items() if k == t), None)
        if not isinstance(items, list):
            die("nav không có nhóm " + " › ".join(titles))
    return items


def pages(items):
    """Mọi trang trong một danh sách mục nav, kể cả trong các nhóm con."""
    out = []
    for it in items:
        for v in (it.values() if isinstance(it, dict) else [it]):
            out += pages(v) if isinstance(v, list) else [v]
    return out


def groups(items):
    """Các nhóm con trực tiếp của một nhóm nav."""
    return [v for it in items if isinstance(it, dict) for v in it.values() if isinstance(v, list)]


def no_index(ps):
    return [p for p in ps if not p.endswith("index.md")]


def count(pattern, rel):
    return len(re.findall(pattern, read(rel), re.M))


def section(rel, heading, item):
    """Số dòng khớp `item` trong mục có tiêu đề khớp `heading`, tới tiêu đề cùng cấp hoặc cao hơn kế tiếp."""
    text = read(rel)
    m = re.search(heading, text, re.M)
    if not m:
        die("%s không có tiêu đề khớp %r" % (rel, heading))
    level = len(m.group(0)) - len(m.group(0).lstrip("#"))
    rest = text[m.end():]
    end = re.search(r"^#{1,%d} " % level, rest, re.M)
    return len(re.findall(item, rest[:end.start()] if end else rest, re.M))


def js_array(rel, name, item):
    """Số phần tử khớp `item` trong mảng hoặc đối tượng `const name = ...` của một file JS (tới dòng "];" hay "};")."""
    src = read(rel)
    m = re.search(r"const %s = [\[{](.*?)\n\s*[\]}];" % name, src, re.S)
    if not m:
        die("%s không có const %s" % (rel, name))
    return len(re.findall(item, m.group(1), re.M))


spec = importlib.util.spec_from_file_location("books_hook", ROOT / "hooks" / "books.py")
books_hook = importlib.util.module_from_spec(spec)
spec.loader.exec_module(books_hook)

LESSONS = sorted("docs/piano/tac-pham/" + p.name for p in (DOCS / "piano/tac-pham").glob("*.md") if p.name != "index.md")
NHAC_LY = nav("Nhạc lý")
NUMBERED = re.compile(r"nhac-ly/\d+-")


def lesson_guide_pairs():
    """Cặp bài học và hướng dẫn nghe cùng một tác phẩm: cùng nhà soạn nhạc và có chung một số danh mục
    (Op. 27, D. 899, S. 541...) giữa dòng "Tác phẩm" của bài học và dòng "Tên đầy đủ" của hướng dẫn."""
    cat = re.compile(r"\b(Op\.|K\.|BWV|D\.|S\.|Hob\.|WoO|L\.|HWV|RV|Anh\.)\s*(\d+[a-z]?)")

    def row(text, name):
        m = re.search(r"^\s*\|\s*%s\s*\|(.*)\|\s*$" % re.escape(name), text, re.M)
        return m.group(1) if m else ""

    def names(s):
        return {w for w in re.findall(r"[\w-]{3,}", re.sub(r"\(.*", "", s)) if w[0].isupper()}
    guides = []
    for p in sorted((DOCS / "nghe-nhac").glob("*.md")):
        t = p.read_text(encoding="utf-8")
        if row(t, "Tên đầy đủ"):
            guides.append((p.stem, names(row(t, "Nhà soạn nhạc")), set(cat.findall(row(t, "Tên đầy đủ")))))
    out = []
    for rel in LESSONS:
        t = read(rel)
        who, works = names(row(t, "Nhà soạn nhạc")), set(cat.findall(row(t, "Tác phẩm")))
        out += [(rel, g) for g, gwho, gworks in guides if who & gwho and works & gworks]
    return out


def tools():
    """Bộ chọn công cụ trong RULES của loader.js có dùng trong docs/ (trừ khuông nhạc, mermaid, quiz, danh sách việc)."""
    src = read("docs/assets/js/loader.js")
    rules = re.findall(r'\[\s*"([^"]+)",\s*\[([^\]]*)\]\]', src.split("const RULES")[1].split("];")[0])
    md = "\n".join(p.read_text(encoding="utf-8") for p in DOCS.rglob("*.md"))
    fences = {"oz-placement": "placement"}  # công cụ chèn bằng khối ```tên thay vì <div class>
    found = set()
    for sel, scripts in rules:
        if re.findall(r'"([\w-]+)"', scripts)[-1] in ("abc", "mermaid", "quiz", "practice"):
            continue
        for cls in re.findall(r"\.([\w-]+)", sel):
            if re.search(r'class="(?:[^"]* )?%s[ "]' % re.escape(cls), md) or \
                    (cls in fences and re.search(r"^```%s" % fences[cls], md, re.M)):
                found.add(cls)
    return found


def period_works():
    """Số tác phẩm trong mục "## N tác phẩm để nghe" của từng trang thời kỳ; phải bằng nhau ở mọi trang."""
    n = {p.stem: section(p.relative_to(ROOT).as_posix(), r"^## \d+ tác phẩm để nghe", r"^\d+\. ")
         for p in sorted((DOCS / "lich-su/thoi-ky").glob("*.md"))}
    if len(set(n.values())) == 1:
        return (n.popitem()[1], "số tác phẩm trong mục \"tác phẩm để nghe\" của mỗi trang thời kỳ")
    return (None, "các trang thời kỳ có số tác phẩm để nghe khác nhau: " + ", ".join("%s %d" % kv for kv in n.items()))


# Khóa → (giá trị thật, cách đếm), hoặc hàm nhận file của chỗ ghi (con số đếm trên chính trang đó).
TRUTH = {
    "bai-hoc": (len(LESSONS), "số bài học trong docs/piano/tac-pham/"),
    "bai-hoc-co-ban-thu": (sum('data-rec="' in read(r) for r in LESSONS), "số bài học có bản thu (data-rec)"),
    "bai-hoc-ban-thu-tren-site": (sum("assets/audio/" in read(r) for r in LESSONS), "số bài học dùng bản thu lưu trong docs/assets/audio/"),
    "ban-thu-tren-site": (len(list((DOCS / "assets/audio").glob("*.mp3"))), "số file MP3 trong docs/assets/audio/"),
    "cap-bai-hoc-huong-dan": (len(lesson_guide_pairs()), "số cặp bài học và hướng dẫn nghe cùng một tác phẩm"),
    "bai-dau-tien": (count(r"^## \d+\. ", "docs/piano/10-bai-dau-tien.md"), "số bài (## N.) trong 10 bài đầu tiên"),
    "huong-dan-nghe": (sum(len(pages(g)) for g in groups(nav("Nghe & nhận diện", "Hướng dẫn nghe"))), "số hướng dẫn nghe trong nav"),
    "huong-dan-nghe-piano": (len(pages(nav("Nghe & nhận diện", "Hướng dẫn nghe", "Nhạc piano"))), "số hướng dẫn trong nhóm nav Nhạc piano"),
    "bai-nhac-ly": (sum(bool(NUMBERED.match(p)) for p in pages(NHAC_LY)), "số bài nhạc lý có số thứ tự trong nav"),
    "nen-tang": (sum(bool(NUMBERED.match(p)) for g in groups(NHAC_LY)[:3] for p in pages(g)), "số bài có số thứ tự trong ba phần đầu của nav Nhạc lý"),
    "on-tap": (sum("/on-tap-" in p for p in pages(NHAC_LY)), "số bài ôn tập trong nav Nhạc lý"),
    "nghe-hieu-cau-truc": (len(pages(nav("Nhạc lý", "Nghe hiểu cấu trúc"))), "số bài trong nhóm nav Nhạc lý › Nghe hiểu cấu trúc"),
    "ky-thuat": (len(pages(nav("Piano", "Kỹ thuật"))), "số trang trong nhóm nav Piano › Kỹ thuật"),
    "tap-luyen": (len(pages(nav("Piano", "Tập luyện"))), "số trang trong nhóm nav Piano › Tập luyện"),
    "hoa-am": (len(pages(nav("Piano", "Hòa âm bên phím"))), "số trang trong nhóm nav Hòa âm bên phím"),
    "hinh-thuc": (len(no_index(pages(nav("Nghe & nhận diện", "Hình thức & thể loại")))), "số trang hình thức trong nav (trừ trang mục lục)"),
    "luyen-tai": (len(no_index(pages(nav("Luyện tập", "Luyện tai")))), "số bài luyện tai trong nav (trừ trang mục lục)"),
    "cuon": (len(books_hook.BOOKS), "số cuốn trong BOOKS (hooks/books.py)"),
    "chang": (count(r"^## Chặng \d+\.", "docs/piano/lo-trinh.md"), 'số mục "## Chặng" trong docs/piano/lo-trinh.md'),
    "a11y": (len(re.findall(r'"[^"]+\.html"', read("tests/a11y.mjs").split("const PAGES")[1].split("];")[0])), "số trang trong PAGES của tests/a11y.mjs"),
    "nhom-kiem-thu": (len(re.findall(r'^  "([\w-]+)": \[', read("tests/run.mjs").split("const GROUPS")[1].split("\n};")[0], re.M)), "số nhóm trong GROUPS của tests/run.mjs"),
    "nghe-si": (section("docs/piano/nghe-si.md", r"^## \d+ tác phẩm piano nên nghe", r"^\d+\. "), "số mục trong danh sách tác phẩm piano nên nghe (piano/nghe-si.md)"),
    "cong-cu": (len(tools()), "số công cụ (bộ chọn trong RULES của loader.js có dùng trong docs/)"),
    "tac-pham-de-nghe": period_works(),
    "nghe-mu": (js_array("docs/assets/js/recognition.js", "TRACKS", r'"id": "t\d+"'), "số bản thu trong TRACKS của recognition.js"),
    "doan-nhac": (js_array("docs/assets/js/recognition.js", "EX", r'^    "[\w-]+": \{'), "số đoạn nhạc trong EX của recognition.js"),
    "nha-soan-nhac-piano": (len(re.findall(r"\((?:\d{4}–\d{4}|sinh \d{4})\)", "\n".join(re.findall(r"^### .*", read("docs/piano/nha-soan-nhac.md"), re.M)))),
                            "số nhà soạn nhạc trong các mục ### ở piano/nha-soan-nhac.md"),
    "nha-soan-nhac": (count(r"^### ", "docs/lich-su/nha-soan-nhac.md"), "số mục ### ở lich-su/nha-soan-nhac.md"),
    "thuat-ngu": (count(r"^\| (?!Thuật ngữ \|)[^-|]", "docs/nhac-ly/tu-dien.md"), "số thuật ngữ trong các bảng của nhac-ly/tu-dien.md"),
    "bai-tap-ngon": (section("docs/piano/bai-tap-ngon.md", r"^## \S+ bài tập$", r"^### \d+\. "), 'số mục "### N." trong mục bài tập của piano/bai-tap-ngon.md'),
    "cong-cu-luyen-tai": (section("docs/luyen-tap/index.md", r"^## Luyện tai$", r"^:   "), "số công cụ trong mục Luyện tai của luyen-tap/index.md"),
    "bai-tap-trong-trang": lambda rel: (count(r"^### Bài \d+\. ", rel), 'số mục "### Bài N." trong trang'),
    "cong-cu-trong-trang": lambda rel: (count(r'<div class="oz-', rel), 'số công cụ (<div class="oz-…">) trong trang'),
}

# (file hoặc mẫu tên file, mẫu có {N}, khóa). Mỗi dòng phải khớp ít nhất một chỗ.
CLAIMS = [
    ("README.md", r"{N} bài học tác phẩm", "bai-hoc"),
    ("AGENTS.md", r"{N} bài học tác phẩm", "bai-hoc"),
    ("AGENTS.md", r'"{N} bài học"', "bai-hoc"),
    ("docs/index.md", r"{N} bài học tác phẩm", "bai-hoc"),
    ("docs/piano/index.md", r"{N} bài học tác phẩm", "bai-hoc"),
    ("docs/piano/index.md", r"{N} tác phẩm được hướng dẫn tỉ mỉ", "bai-hoc"),
    ("docs/piano/tac-pham/index.md", r"^{N} tác phẩm, từ Minuet", "bai-hoc"),
    ("docs/piano/tac-pham/index.md", r"^## {N} tác phẩm theo cấp độ", "bai-hoc"),
    ("docs/piano/tac-pham/index.md", r"cả {N} bài đều có một bản thu", "bai-hoc"),
    ("docs/piano/tac-pham/index.md", r"cả {N} bài đều có một bản thu", "bai-hoc-co-ban-thu"),
    ("docs/bat-dau/sach-in.md", r"{N} bài học tác phẩm", "bai-hoc"),
    ("hooks/books.py", r"{N} bài học tác phẩm", "bai-hoc"),
    ("docs/piano/tac-pham/index.md", r"^{N} bài học có thêm hướng dẫn nghe", "cap-bai-hoc-huong-dan"),
    ("docs/tai-lieu-tham-khao.md", r"{N} bản thu từ IMSLP", "ban-thu-tren-site"),
    ("docs/tai-lieu-tham-khao.md", r"dùng cho {N} bài học, được lưu trên site", "bai-hoc-ban-thu-tren-site"),

    ("README.md", r"{N} bài hai tay", "bai-dau-tien"),
    ("AGENTS.md", r"{N} bài hai tay", "bai-dau-tien"),
    ("docs/index.md", r"{N} bài hai tay đầu tiên", "bai-dau-tien"),
    ("docs/piano/index.md", r"{N} bài hai tay có số ngón", "bai-dau-tien"),
    ("docs/bat-dau/sach-in.md", r"{N} bài hai tay có số ngón", "bai-dau-tien"),
    ("hooks/books.py", r"{N} bài hai tay có số ngón", "bai-dau-tien"),
    ("docs/piano/10-bai-dau-tien.md", r"trải {N} bài trong khoảng", "bai-dau-tien"),
    ("docs/piano/10-bai-dau-tien.md", r"^## Lộ trình {N} bài", "bai-dau-tien"),
    ("docs/piano/10-bai-dau-tien.md", r"^## Sau {N} bài", "bai-dau-tien"),
    ("docs/piano/10-bai-dau-tien.md", r"Chơi được {N} bài này", "bai-dau-tien"),
    ("docs/bat-dau/lo-trinh-choi.md", r"Xong cả {N} bài", "bai-dau-tien"),

    ("README.md", r"{N} hướng dẫn nghe", "huong-dan-nghe"),
    ("AGENTS.md", r'"{N} hướng dẫn nghe', "huong-dan-nghe"),
    ("docs/index.md", r"{N} hướng dẫn nghe", "huong-dan-nghe"),
    ("docs/bat-dau/sach-in.md", r"{N} hướng dẫn nghe", "huong-dan-nghe"),
    ("hooks/books.py", r"{N} hướng dẫn nghe", "huong-dan-nghe"),
    ("README.md", r"{N} về nhạc piano", "huong-dan-nghe-piano"),
    ("AGENTS.md", r"{N} về nhạc piano", "huong-dan-nghe-piano"),
    ("docs/index.md", r"{N} tác phẩm piano, từ Scarlatti", "huong-dan-nghe-piano"),
    ("docs/index.md", r"\({N} tác phẩm piano\)", "huong-dan-nghe-piano"),
    ("docs/bat-dau/sach-in.md", r"\({N} về nhạc piano\)", "huong-dan-nghe-piano"),
    ("hooks/books.py", r"\({N} về nhạc piano\)", "huong-dan-nghe-piano"),
    ("docs/bat-dau/lo-trinh-nghe.md", r"\({N} hướng dẫn, theo thứ tự thời gian", "huong-dan-nghe-piano"),
    ("docs/nghe-nhac/index.md", r"^{N} hướng dẫn về \*\*nhạc piano\*\*", "huong-dan-nghe-piano"),

    ("README.md", r"{N} bài nhạc lý", "bai-nhac-ly"),
    ("docs/index.md", r"{N} bài từ tên nốt", "bai-nhac-ly"),
    ("docs/nhac-ly/index.md", r"^## Sau {N} bài này", "bai-nhac-ly"),
    ("docs/bat-dau/sach-in.md", r"Bài 15–{N} và âm học", "bai-nhac-ly"),
    ("hooks/books.py", r"Bài 15–{N} và âm học", "bai-nhac-ly"),
    ("docs/nhac-ly/index.md", r"{N} bài \*\*nền tảng\*\*", "nen-tang"),
    ("docs/nhac-ly/15-tiet-tau-nang-cao.md", r"{N} bài nền tảng", "nen-tang"),
    ("docs/bat-dau/sach-in.md", r"Bài 1–{N} và ba bài ôn tập", "nen-tang"),
    ("hooks/books.py", r"Bài 1–{N} và ba bài ôn tập", "nen-tang"),
    ("README.md", r"{N} bài ôn tập", "on-tap"),
    ("docs/nhac-ly/15-tiet-tau-nang-cao.md", r"{N} bài ôn tập", "on-tap"),
    ("docs/bat-dau/sach-in.md", r"{N} bài ôn tập", "on-tap"),
    ("hooks/books.py", r"{N} bài ôn tập", "on-tap"),
    ("docs/nhac-ly/index.md", r"^{N} bài này lấp những mảnh", "nghe-hieu-cau-truc"),

    ("README.md", r"{N} trang kỹ thuật", "ky-thuat"),
    ("README.md", r"{N} trang tập luyện", "tap-luyen"),
    ("README.md", r"Hòa âm bên phím và ứng tác \({N} trang\)", "hoa-am"),
    ("README.md", r"{N} trang hình thức", "hinh-thuc"),
    ("docs/luyen-tai/index.md", r"^## Lộ trình {N} bài", "luyen-tai"),
    ("docs/luyen-tai/index.md", r"Sau {N} bài trên", "luyen-tai"),
    ("docs/bat-dau/sach-in.md", r"^{N} cuốn sách", "cuon"),
    ("AGENTS.md", r'"{N} cuốn"', "cuon"),

    ("AGENTS.md", r"lộ trình {N} chặng", "chang"),
    ("AGENTS.md", r'"{N} chặng"', "chang"),
    ("hooks/books.py", r"Lộ trình {N} chặng", "chang"),
    ("docs/bat-dau/bai-0.md", r"lộ trình {N} chặng", "chang"),
    ("docs/bat-dau/index.md", r"{N} chặng của \[lộ trình piano\]", "chang"),
    ("docs/piano/hai-tuan-dau.md", r"lộ trình {N} chặng", "chang"),
    ("docs/piano/index.md", r"lộ trình {N} chặng", "chang"),
    ("docs/piano/index.md", r"^{N} chặng, từ lần đầu chạm phím", "chang"),
    ("docs/piano/index.md", r"chia theo {N} chặng", "chang"),
    ("docs/piano/lo-trinh.md", r"\*\*{N} chặng\*\*", "chang"),
    ("docs/piano/tac-pham-theo-cap.md", r"theo đúng {N} chặng", "chang"),
    ("docs/piano/tac-pham/index.md", r"xếp theo {N} chặng", "chang"),
    ("docs/piano/thay-va-thi.md", r"thành {N} chặng", "chang"),
    ("docs/piano/the-loai.md", r"thang {N} chặng của site", "chang"),

    ("README.md", r"trên {N} trang tiêu biểu", "a11y"),
    ("README.md", r"{N} nhóm (?:song song|chạy song song)", "nhom-kiem-thu"),
    ("AGENTS.md", r"{N} nhóm song song", "nhom-kiem-thu"),
    ("docs/piano/nghe-si.md", r"{N} tác phẩm piano nên nghe", "nghe-si"),
    ("docs/nghe-nhac/index.md", r"{N} tác phẩm piano nên nghe", "nghe-si"),
    ("docs/index.md", r"Hơn {N} công cụ", "<cong-cu"),
    ("docs/lich-su/thoi-ky/*.md", r"^## {N} tác phẩm để nghe", "tac-pham-de-nghe"),
    ("docs/lich-su/index.md", r"{N} tác phẩm để nghe", "tac-pham-de-nghe"),
    ("docs/bat-dau/lo-trinh-nghe.md", r"mỗi trang có {N} tác phẩm để nghe", "tac-pham-de-nghe"),
    ("docs/nhan-dien/index.md", r"{N} bản thu thật", "nghe-mu"),
    ("docs/nhan-dien/nghe-mu.md", r"{N} bản thu thật", "nghe-mu"),
    ("docs/nhan-dien/index.md", r"qua {N} đoạn nhạc ngắn", "doan-nhac"),
    ("docs/nhan-dien/luyen-nghe.md", r"^{N} đoạn nhạc ngắn", "doan-nhac"),
    ("docs/piano/nha-soan-nhac.md", r"hơn {N} nhà soạn nhạc piano", "<nha-soan-nhac-piano"),
    ("docs/lich-su/nha-soan-nhac.md", r"khoảng {N} nhà soạn nhạc nên biết", "nha-soan-nhac"),
    ("hooks/books.py", r"hơn {N} thuật ngữ", "<thuat-ngu"),

    # Con số đếm trên chính trang
    ("docs/piano/bai-tap-ngon.md", r"^## {N} bài tập$", "bai-tap-ngon"),
    ("docs/piano/not-lap-not-kep.md", r"kèm {N} bài tập", "bai-tap-trong-trang"),
    ("docs/piano/quang-tam-buoc-nhay.md", r"kèm {N} bài tập", "bai-tap-trong-trang"),
    ("docs/luyen-tap/index.md", r"^{N} công cụ dưới đây", "cong-cu-luyen-tai"),
    ("docs/nhan-dien/luyen-nghe.md", r"^{N} công cụ luyện tai", "cong-cu-trong-trang"),
    ("docs/nhan-dien/nghe-mu.md", r"có {N} công cụ", "cong-cu-trong-trang"),
]

# (file hoặc mẫu tên file, mẫu, lý do): cụm "số + danh từ" không phải con số của site.
IGNORE = [
    ("*", r"10 bài đầu tiên", "tên trang 10 bài đầu tiên"),
    ("docs/piano/tac-pham/*.md", r"[Nn]ghe \d bản thu", "việc của tuần đầu trong kế hoạch tập"),
    ("docs/bat-dau/hoi-dap.md", r"ít nhất 9 bài đầu", "khuyên học tới bài 9 (Quãng), không phải số trang"),
    ("docs/hinh-thuc/symphonic-poem.md", r"13 tác phẩm như vậy", "số symphonic poem của Liszt"),
    ("docs/lich-su/nha-soan-nhac.md", r"600 tác phẩm", "số tác phẩm của Mozart"),
    ("docs/lich-su/nha-soan-nhac.md", r"153 bài piano", "số bài của Mikrokosmos"),
    ("docs/lich-su/nhac-truyen-thong-viet-nam.md", r"20 bài bản tổ", "thuật ngữ đờn ca tài tử"),
    ("docs/luyen-tai/nghe-quang.md", r"theo 4 nhóm", "bốn nhóm quãng trong bài"),
    ("docs/luyen-tap/thi-tau-hai-tay.md", r"bốn trong năm bài gần nhất", "quy tắc lên cấp của công cụ thị tấu"),
    ("docs/nghe-nhac/debussy-preludes.md", r"mười bốn tác phẩm piano", "số bài Debussy thu cho Welte-Mignon năm 1912"),
    ("docs/nghe-nhac/handel-hallelujah.md", r"260 trang", "độ dài bản thảo Messiah"),
    ("docs/nghe-nhac/index.md", r"Ba tác phẩm piano trong bảng", "kể tên ngay trong ngoặc"),
    ("docs/nghe-nhac/mussorgsky-tranh.md", r"400 tác phẩm", "số tác phẩm trong triển lãm Hartmann"),
    ("docs/nhac-ly/20-doc-tong-pho.md", r"8 trang đầu", "đoạn tổng phổ để theo dõi"),
    ("docs/piano/bai-tap-ngon.md", r"\((?:1873, )?\d+ bài|hết 40 bài của Op\. 299", "số bài trong các tập étude"),
    ("docs/piano/cach-tap.md", r"vượt hai chặng", "lời khuyên về độ khó"),
    ("docs/piano/choi-cung-nguoi-khac.md", r"28 bài ngắn|21 bài, bốn tập|Năm bài cho trẻ em|Sáu bài cho cô bé", "số bài trong các tập nhạc bốn tay"),
    ("docs/piano/hoa-am/index.md", r"ba bài nhạc lý", "kể tên ngay sau dấu hai chấm"),
    ("docs/piano/hoa-am/index.md", r"hai cuốn \*Versuch", "sách của C. P. E. Bach"),
    ("docs/piano/hoa-am/ket.md", r"24 bài khác nhau", "hình ảnh so sánh với 24 giọng"),
    ("docs/piano/lo-trinh.md", r"chơi 3 bài cho người thân|trọn 3 bài như một buổi hòa nhạc", "chương trình biểu diễn nhỏ cuối chặng"),
    ("docs/piano/nha-soan-nhac.md", r"48 bài hát không lời|trong 66 bài|153 bài trong 6 tập", "số bài trong các tập nhạc"),
    ("docs/piano/tac-pham-theo-cap.md", r"cao hơn hai chặng", "lời khuyên về độ khó"),
    ("docs/piano/tac-pham-theo-cap.md", r"Mười bài vừa sức", "lời khuyên chọn bài"),
    ("docs/piano/tac-pham/bach-prelude-bwv939.md", r"bốn chặng", "bốn chặng hòa âm của bài"),
    ("docs/piano/tac-pham/bach-prelude-fugue-do-thu.md", r"hai bài học bổ sung cho nhau", "prelude và fugue như hai bài học"),
    ("docs/piano/tac-pham/burgmuller-*.md", r"\(25 bài luyện dễ", "số bài của Op. 100"),
    ("docs/piano/tac-pham/grieg-arietta.md", r"gồm 8 bài|Tám bài trong tập|66 bài", "số bài của Op. 12 và của cả bộ Lyric Pieces"),
    ("docs/piano/tac-pham/mendelssohn-thuyen-ca.md", r"mỗi tập sáu bài", "số bài mỗi tập Lieder ohne Worte"),
    ("docs/piano/tac-pham/minuet-sol*.md", r"hai cuốn sổ tay", "sổ tay của Anna Magdalena Bach"),
    ("docs/piano/tac-pham/musette-re.md", r"hai cuốn sổ tay", "sổ tay của Anna Magdalena Bach"),
    ("docs/piano/tac-pham/schumann-album.md", r"43 bài", "số bài của Op. 68"),
    ("docs/piano/tac-pham/schumann-album.md", r"ba bài nền tảng cho người mới", "ba bài của Op. 68 mà trang này dạy"),
    ("docs/piano/tac-pham/schumann-traumerei.md", r"gồm 13 bài", "số bài của Kinderszenen"),
    ("docs/piano/tac-pham/tchaikovsky-*.md", r"24 bài", "số bài của Op. 39"),
    ("docs/piano/thay-va-thi.md", r"[34] bài(?: \(| chơi liền| kèm phần kỹ thuật|\.)", "cấu trúc bài thi ABRSM"),
    ("docs/piano/tieng-dan.md", r"Có ba công cụ", "ba cách nối legato, kể ngay bên dưới"),
]

SITE_NOUNS = ["hướng dẫn nghe", "hướng dẫn", "bài học tác phẩm", "bài học", "bài nhạc lý", "bài ôn tập", "bài nền tảng",
              "bài luyện tai", "công cụ", "cuốn", "chặng", "tác phẩm piano"]
COMMON_NOUNS = ["bài", "trang", "tác phẩm", "bản thu", "nhóm", "nhà soạn nhạc", "thuật ngữ", "đoạn nhạc"]
_NOUN = "|".join(re.escape(n) + (r"(?! (?:trí|trọng|nghiêm|phục|bị|nhã|điểm|sức)\b)" if n == "trang" else "")
                 for n in sorted(SITE_NOUNS + COMMON_NOUNS, key=len, reverse=True))
PHRASE = re.compile(r"(?<![\w.,/#–-])(%s) (%s)(?!\w)" % (NUM, _NOUN), re.I)

FILES = sorted(p.relative_to(ROOT).as_posix() for p in DOCS.rglob("*.md")
               if not p.relative_to(DOCS).as_posix().startswith(("cap-nhat.md", "blog/"))) + ["README.md", "AGENTS.md", "hooks/books.py"]

fails = []


def fail(msg):
    fails.append(msg)
    print("x", msg)


def files_of(pattern):
    return [f for f in FILES if fnmatch.fnmatch(f, pattern)]


LINES = {f: read(f).splitlines() for f in FILES}
covered = {f: [] for f in FILES}  # các khoảng (dòng, đầu, cuối) đã được CLAIMS hoặc IGNORE nhận

# --- 1. CLAIMS ---
n_claims = 0
for pattern, regex, key in CLAIMS:
    rx = re.compile(regex.replace("{N}", r"((?!một\b)%s)" % NUM), re.I)  # "một bài học" là "a lesson", không phải con số
    truth = TRUTH[key.lstrip("<")]
    hits = 0
    for f in files_of(pattern):
        for i, line in enumerate(LINES[f], 1):
            for m in rx.finditer(line):
                hits += 1
                n_claims += 1
                covered[f].append((i, m.start(), m.end()))
                real, how = truth(f) if callable(truth) else truth
                got = value(m.group(1))
                if real is None:
                    fail('%s:%d ghi "%s" nhưng %s' % (f, i, m.group(0), how))
                elif key.startswith("<") and not got < real:
                    fail('%s:%d ghi "%s" nhưng %s chỉ là %d' % (f, i, m.group(0), how, real))
                elif not key.startswith("<") and got != real:
                    fail('%s:%d ghi "%s" nhưng %s là %d' % (f, i, m.group(0), how, real))
    if not hits:
        fail("CLAIMS (%s, %r) không còn khớp chỗ nào: sửa mẫu hoặc bỏ dòng này" % (pattern, regex))

# --- 2. IGNORE ---
for pattern, regex, reason in IGNORE:
    rx = re.compile(regex)
    hits = 0
    for f in files_of(pattern):
        for i, line in enumerate(LINES[f], 1):
            for m in rx.finditer(line):
                hits += 1
                covered[f].append((i, m.start(), m.end()))
    if not hits:
        fail("IGNORE (%s, %r) không còn khớp chỗ nào: bỏ dòng này" % (pattern, regex))

# --- 3. Bắt buộc đăng ký ---
n_phrases = 0
for f in FILES:
    for i, line in enumerate(LINES[f], 1):
        for m in PHRASE.finditer(line):
            n = value(m.group(1))
            noun = m.group(2).lower()
            if n < 2 or (not m.group(1).isdigit() and n < 5 and noun in COMMON_NOUNS):
                continue
            n_phrases += 1
            if not any(li == i and a <= m.start() and m.end() <= b for li, a, b in covered[f]):
                fail('%s:%d có cụm "%s" chưa đăng ký: thêm vào CLAIMS (nếu là con số của site) hoặc IGNORE kèm lý do (tests/counts.py)'
                     % (f, i, m.group(0)))

print("counts: %d chỗ ghi con số đã kiểm, %d cụm số + danh từ đã quét, %d lỗi" % (n_claims, n_phrases, len(fails)))
sys.exit(1 if fails else 0)
