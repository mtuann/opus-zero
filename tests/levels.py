#!/usr/bin/env python3
"""Kiểm tra cấp độ (Grade) và chặng của từng bài học tác phẩm ở mọi nơi ghi chúng.

Chặng của một bài do docs/piano/tac-pham-theo-cap.md quyết định: bài nằm ở ô đầu của một hàng trong
mục "## Chặng N". Mọi nơi khác phải khớp:
1. Trang bài học: chip oz-chip--level và dòng "Độ khó" ghi cùng một Grade; "chặng N" trong dòng
   "Độ khó" (nếu có) đúng chặng.
2. docs/piano/tac-pham/index.md: cột "Grade X (chặng N)", Grade giống chip.
3. mkdocs.yml: nhóm nav "Sơ cấp (≈ Grade 1–2)"... "Sau Grade 8".
4. docs/piano/tac-pham-theo-cap.md: mỗi bài ở đúng một mục chặng.
5. docs/assets/js/practice.js: SUGGEST (chặng → bài).
6. docs/piano/lo-trinh.md: bảng tổng quan và các dòng trong mục "## Chặng N", trừ hàng "Nghe"
   (hàng này cố ý giới thiệu bài của chặng sau).
7. docs/piano/thay-va-thi.md: bảng Grade ↔ chặng.
8. hooks/books.py: chương của cuốn piano-tac-pham xếp theo chặng không giảm, đủ mọi bài.
Thêm: link tới một bài học có ghi "(chặng N)" ngay sau, ở bất kỳ trang nào; và nhãn Grade của từng
chặng (tiêu đề mục, nhóm nav, các bảng quy đổi) đúng bảng STAGES.

Grade phải hợp với chặng theo STAGES; với khoảng Grade ("Grade 3–4"), chặng phải chứa ít nhất một
đầu của khoảng. "Grade 8 trở lên" và "Sau Grade 8" là chặng 7.
"""
import importlib.util
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

# Chặng → (nhãn Grade, Grade thấp nhất, Grade cao nhất). Giống bảng ở docs/piano/lo-trinh.md và AGENTS.md.
STAGES = {1: ("trước Grade 1", 0, 0), 2: ("Grade 1–2", 1, 2), 3: ("Grade 3", 3, 3), 4: ("Grade 4–5", 4, 5),
          5: ("Grade 6", 6, 6), 6: ("Grade 7–8", 7, 8), 7: ("Sau Grade 8", 9, 9)}
GRADE = re.compile(r"(?:trước|sau)\s+(?:ABRSM\s+)?Grade\s+\d+|Grade\s+\d+(?:\s*[–-]\s*\d+)?(?:\s+trở lên)?", re.I)
LINK = re.compile(r"tac-pham/([a-z0-9-]+)\.md")

fails = []
checked = 0


def fail(msg):
    fails.append(msg)
    print("x", msg)


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def norm(g):
    """"≈ Grade 4-5", "khoảng ABRSM Grade 4–5" → "Grade 4–5"; "Sau Grade 8", "sau ABRSM Grade 8" → "sau Grade 8"."""
    g = re.sub(r"≈|\bkhoảng\b|\bABRSM\b", " ", g, flags=re.I)
    g = re.sub(r"\s+", " ", g.replace("-", "–")).strip().lower().replace(" – ", "–")
    return g.replace("grade", "Grade")


def span(g):
    """Grade thấp nhất và cao nhất của một chuỗi Grade đã chuẩn hóa."""
    if g.startswith("trước"):
        return 0, 0
    if g.startswith("sau") or g.endswith("trở lên"):
        return 9, 9
    n = [int(x) for x in re.findall(r"\d+", g)]
    return min(n), max(n)


def fits(g, stage):
    lo, hi = span(g)
    _, a, b = STAGES[stage]
    return a <= lo <= b or a <= hi <= b


def stage_of_label(text):
    """Chặng có nhãn Grade nằm trong `text` ("Sơ cấp (≈ Grade 1–2)" → 2), hoặc None."""
    m = GRADE.search(text)
    labels = {norm(v[0]): k for k, v in STAGES.items()}
    return labels.get(norm(m.group(0))) if m else None


def lines_of(rel):
    return list(enumerate(read(rel).splitlines(), 1))


LESSONS = sorted(p.stem for p in (DOCS / "piano/tac-pham").glob("*.md") if p.name != "index.md")
WHERE = "docs/piano/tac-pham-theo-cap.md"

# --- 4. Tác phẩm theo cấp độ: nơi quyết định chặng ---
STAGE = {}
stage = None
for i, line in lines_of(WHERE):
    h = re.match(r"## Chặng (\d+)\.", line)
    if h:
        stage = int(h.group(1))
        if stage_of_label(line) != stage:
            fail("%s:%d: tiêu đề chặng %d không ghi đúng \"%s\"" % (WHERE, i, stage, STAGES[stage][0]))
        continue
    if line.startswith("## "):
        stage = None
    if stage and line.startswith("|"):
        for slug in LINK.findall(line.split("|")[1]):
            if slug in STAGE and STAGE[slug] != stage:
                fail("%s: %s ở cả chặng %d và chặng %d" % (WHERE, slug, STAGE[slug], stage))
            STAGE[slug] = stage
for slug in LESSONS:
    if slug not in STAGE:
        fail("%s: bài học %s không nằm ở ô đầu hàng nào trong các mục \"## Chặng N\"" % (WHERE, slug))


def check(slug, stage, where):
    global checked
    checked += 1
    if slug not in LESSONS:
        fail("%s: link tới bài học không có: %s" % (where, slug))
    elif slug in STAGE and stage != STAGE[slug]:
        fail("%s: %s ghi chặng %d nhưng Tác phẩm theo cấp độ xếp ở chặng %d" % (where, slug, stage, STAGE[slug]))


# --- 1. Trang bài học ---
CHIP = {}
for slug in LESSONS:
    rel = "docs/piano/tac-pham/%s.md" % slug
    text = read(rel)
    chip = re.search(r'<span class="oz-chip oz-chip--level">(.*?)</span>', text)
    row = re.search(r"^\s*\| Độ khó \|(.*)\|\s*$", text, re.M)
    if not chip or not GRADE.search(chip.group(1).split("(")[0]):
        fail("%s: không có chip oz-chip--level ghi Grade" % rel)
        continue
    CHIP[slug] = g = norm(GRADE.search(chip.group(1).split("(")[0]).group(0))
    if slug in STAGE and not fits(g, STAGE[slug]):
        fail("%s: \"%s\" không hợp với chặng %d (%s)" % (rel, g, STAGE[slug], STAGES[STAGE[slug]][0]))
    if not row:
        fail("%s: không có dòng \"Độ khó\" trong hộp thông tin" % rel)
        continue
    grades = [norm(m) for m in GRADE.findall(row.group(1))]
    lows, highs = zip(*map(span, grades)) if grades else ((), ())
    # Dòng "Độ khó" ghi Grade chính trước; trang dạy nhiều bài (Op. 68) có thể ghi Grade từng bài, khi đó lấy cả khoảng.
    if not grades or (grades[0] != g and (min(lows), max(highs)) != span(g)):
        fail("%s: chip ghi \"%s\" nhưng dòng \"Độ khó\" ghi \"%s\"" % (rel, g, ", ".join(grades) or "không có Grade"))
    for n in re.findall(r"chặng (\d+)", row.group(1)):
        check(slug, int(n), rel + " (dòng \"Độ khó\")")

# --- 2. Bảng ở tac-pham/index.md ---
rel = "docs/piano/tac-pham/index.md"
seen = {}
for i, line in lines_of(rel):
    m = re.match(r"\| \[[^\]]*\]\(([a-z0-9-]+)\.md\) \| ([^|]*?) \(chặng (\d+)\) \|", line)
    if not m:
        continue
    slug, g, n = m.group(1), norm(m.group(2)), int(m.group(3))
    seen[slug] = seen.get(slug, 0) + 1
    check(slug, n, "%s:%d" % (rel, i))
    if slug in CHIP and g != CHIP[slug]:
        fail("%s:%d: %s ghi \"%s\" nhưng chip trên trang bài học ghi \"%s\"" % (rel, i, slug, g, CHIP[slug]))
for slug in LESSONS:
    if seen.get(slug, 0) != 1:
        fail("%s: bài học %s có %d dòng trong bảng (phải đúng 1)" % (rel, slug, seen.get(slug, 0)))

# --- 3. Nav ---
class _NavLoader(yaml.SafeLoader):
    pass


_NavLoader.add_multi_constructor("tag:yaml.org,2002:python/", lambda loader, suffix, node: None)
nav = yaml.load(read("mkdocs.yml"), Loader=_NavLoader)["nav"]
for title in ("Piano", "Tác phẩm", "Bài học tác phẩm"):
    nav = next(v for it in nav if isinstance(it, dict) for k, v in it.items() if k == title)
seen = {}
for item in nav:
    if not isinstance(item, dict):
        continue
    (title, items), = item.items()
    n = stage_of_label(title)
    if n is None:
        fail("mkdocs.yml: nhóm nav \"%s\" không có nhãn Grade của chặng nào" % title)
        continue
    for it in items:
        path = list(it.values())[0] if isinstance(it, dict) else it
        slug = path.rsplit("/", 1)[-1][:-3]
        seen[slug] = seen.get(slug, 0) + 1
        check(slug, n, "mkdocs.yml (nhóm \"%s\")" % title)
for slug in LESSONS:
    if seen.get(slug, 0) != 1:
        fail("mkdocs.yml: bài học %s nằm trong %d nhóm nav (phải đúng 1)" % (slug, seen.get(slug, 0)))

# --- 5. practice.js ---
rel = "docs/assets/js/practice.js"
for i, line in lines_of(rel):
    m = re.match(r"\s*(\d+): \[\[", line)
    if m:
        for slug in re.findall(r"piano/tac-pham/([a-z0-9-]+)/", line):
            check(slug, int(m.group(1)), "%s:%d (SUGGEST)" % (rel, i))

# --- 6. Lộ trình ---
rel = "docs/piano/lo-trinh.md"
stage = None
for i, line in lines_of(rel):
    h = re.match(r"## Chặng (\d+)\.", line)
    if h:
        stage = int(h.group(1))
        if GRADE.search(line) and stage_of_label(line) != stage:
            fail("%s:%d: tiêu đề chặng %d không ghi đúng \"%s\"" % (rel, i, stage, STAGES[stage][0]))
        continue
    if line.startswith("## "):
        stage = None
    row = re.match(r"\| (\d+)\. [^|]*\| ([^|]*) \|", line)  # bảng tổng quan: | 2. Sơ cấp | Grade 1–2 | ...
    if row:
        n = int(row.group(1))
        if "Grade" in row.group(2) and stage_of_label(row.group(2)) != n:
            fail("%s:%d: bảng tổng quan ghi chặng %d là \"%s\" (phải là \"%s\")" % (rel, i, n, row.group(2).strip(), STAGES[n][0]))
        for slug in LINK.findall(line):
            check(slug, n, "%s:%d (bảng tổng quan)" % (rel, i))
    elif stage and not line.startswith("| Nghe |"):
        for slug in LINK.findall(line):
            check(slug, stage, "%s:%d (mục chặng %d)" % (rel, i, stage))

# --- 7. Thầy và thi: bảng Grade ↔ chặng ---
rel = "docs/piano/thay-va-thi.md"
for i, line in lines_of(rel):
    row = re.match(r"\s*\| ([^|]*) \| (\d+)\. [^|]*\|(.*)", line)
    if row:
        n = int(row.group(2))
        if "Grade" in row.group(1) and stage_of_label(row.group(1)) != n:
            fail("%s:%d: bảng ghi chặng %d là \"%s\" (phải là \"%s\")" % (rel, i, n, row.group(1).strip(), STAGES[n][0]))
        for slug in LINK.findall(row.group(3)):
            check(slug, n, "%s:%d" % (rel, i))

# --- 8. Sách in ---
spec = importlib.util.spec_from_file_location("books_hook", ROOT / "hooks" / "books.py")
books_hook = importlib.util.module_from_spec(spec)
spec.loader.exec_module(books_hook)
chapters = [c.split("/")[2] for c in dict((b[0], b[3]) for b in books_hook.BOOKS)["piano-tac-pham"] if c.startswith("piano/tac-pham/")]
if sorted(chapters) != LESSONS:
    fail("hooks/books.py: cuốn piano-tac-pham thiếu %s, thừa %s"
         % (sorted(set(LESSONS) - set(chapters)) or "không", sorted(set(chapters) - set(LESSONS)) or "không"))
for a, b in zip(chapters, chapters[1:]):
    if a in STAGE and b in STAGE and STAGE[b] < STAGE[a]:
        fail("hooks/books.py: cuốn piano-tac-pham xếp %s (chặng %d) sau %s (chặng %d)" % (b, STAGE[b], a, STAGE[a]))

# --- Link tới bài học kèm "(chặng N)" ở mọi trang ---
for p in sorted(DOCS.rglob("*.md")):
    rel = p.relative_to(ROOT).as_posix()
    if rel.startswith(("docs/cap-nhat.md", "docs/blog/")):
        continue
    for i, line in lines_of(rel):
        for slug, n in re.findall(r"tac-pham/([a-z0-9-]+)\.md(?:#[^)]*)?\)\**\s*\(chặng (\d+)\)", line):
            check(slug, int(n), "%s:%d" % (rel, i))

print("levels: %d bài học, %d chỗ ghi chặng đã kiểm, %d lỗi" % (len(LESSONS), checked, len(fails)))
sys.exit(1 if fails else 0)
