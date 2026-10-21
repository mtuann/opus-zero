"""Sinh các hình minh họa tĩnh (SVG/HTML) và chèn vào trang Markdown.

Mỗi hình nằm giữa hai dấu  <!-- fig:TÊN -->  …  <!-- /fig:TÊN -->  trong file .md.
Chạy lại script này sau khi sửa dữ liệu bên dưới:  python3 tools/figures.py
Hình dùng màu cụ thể và currentColor để hiển thị đúng ở chế độ sáng, tối và khi in.
"""
import html, math, os, re

DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs")
FONT = 'font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"'
NAMES_VI = ["Đô", "Đô♯", "Rê", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "Si♭", "Si"]
NAMES_EN = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"]
def note(m): return "%s%d" % (NAMES_EN[m % 12], m // 12 - 1)
def svg(w, h, label, body, cls="oz-fig"):
    return ('<svg class="%s" viewBox="0 0 %d %d" role="img" aria-label="%s" xmlns="http://www.w3.org/2000/svg" %s>%s</svg>'
            % (cls, w, h, html.escape(label, quote=True), FONT, body))
def t(x, y, s, size=9, anchor="start", weight="400", fill="currentColor", op=1):
    return '<text x="%.1f" y="%.1f" font-size="%s" text-anchor="%s" font-weight="%s" fill="%s"%s>%s</text>' % (
        x, y, size, anchor, weight, fill, "" if op == 1 else ' fill-opacity="%s"' % op, html.escape(s))
def figure(inner, caption):
    return '<figure class="oz-figure">%s<figcaption>%s</figcaption></figure>' % (inner, caption)

# ---------------------------------------------------------------- Âm vực
FAM = {"dây": "#7aa6d6", "gỗ": "#8cc49a", "đồng": "#e0b45e", "gõ": "#c9a0dc", "phím": "#b0b0b0", "giọng": "#e98f7a", "gảy": "#9fd0d0"}
RANGES_ORCH = [
    ("Piano", "phím", 21, 108), ("Violin", "dây", 55, 100), ("Viola", "dây", 48, 88), ("Cello", "dây", 36, 81),
    ("Contrabass", "dây", 28, 67), ("Harp", "gảy", 23, 104), ("Piccolo", "gỗ", 74, 108), ("Sáo", "gỗ", 60, 96),
    ("Oboe", "gỗ", 58, 93), ("Clarinet (B♭)", "gỗ", 50, 94), ("Bassoon", "gỗ", 34, 76), ("Kèn horn", "đồng", 35, 77),
    ("Trumpet (B♭)", "đồng", 52, 84), ("Trombone", "đồng", 40, 77), ("Tuba", "đồng", 26, 65), ("Timpani", "gõ", 38, 60),
    ("Guitar", "gảy", 40, 83)]
RANGES_VOICE = [("Soprano", "giọng", 60, 84), ("Mezzo-soprano", "giọng", 57, 81), ("Alto", "giọng", 53, 77),
                ("Tenor", "giọng", 48, 72), ("Baritone", "giọng", 45, 69), ("Bass", "giọng", 40, 64)]
def ranges_svg(rows, label, lo=21, hi=108):
    W, L, R, RH, TOP = 660, 112, 14, 15, 22
    span = W - L - R
    x = lambda m: L + (m - lo) / (hi - lo) * span
    H = TOP + len(rows) * RH + 26
    b = []
    for c in range(24, 109, 12):
        if lo <= c <= hi:
            b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="currentColor" stroke-opacity="%s"%s/>' % (
                x(c), TOP - 4, x(c), H - 20, ".55" if c == 60 else ".15", ' stroke-dasharray="3 2"' if c == 60 else ""))
            b.append(t(x(c), H - 8, note(c) + (" (Đô giữa)" if c == 60 else ""), 8, "middle", "600" if c == 60 else "400", op=.8))
    for i, (name, fam, a, z) in enumerate(rows):
        y = TOP + i * RH
        b.append(t(L - 6, y + 10, name, 9, "end"))
        b.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" rx="3" fill="%s"/>' % (x(a), y + 2, x(z) - x(a), RH - 5, FAM[fam]))
        if x(a) - L < 24:   # thanh bắt đầu sát lề trái: ghi nốt thấp bên trong thanh
            b.append(t(x(a) + 3, y + 10, note(a), 7, "start", "600", "#1b1b1b"))
        else:
            b.append(t(x(a) - 3, y + 10, note(a), 7, "end", op=.75))
        b.append(t(x(z) + 3, y + 10, note(z), 7, "start", op=.75))
    fams = sorted(set(r[1] for r in rows), key=list(FAM).index)
    lx = L
    for f in fams:
        b.append('<rect x="%d" y="4" width="10" height="9" rx="2" fill="%s"/>' % (lx, FAM[f]))
        b.append(t(lx + 14, 12, f, 8)); lx += 14 + 8 * len(f) + 18
    return svg(W, H, label, "".join(b))

# ---------------------------------------------------------------- Dàn nhạc
def sector(cx, cy, r1, r2, a1, a2, fill, label, size=9):
    def p(r, a): return cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a))
    x1, y1 = p(r2, a1); x2, y2 = p(r2, a2); x3, y3 = p(r1, a2); x4, y4 = p(r1, a1)
    # Trục y của SVG hướng xuống: góc toán học tăng = ngược chiều kim đồng hồ trên màn hình (sweep-flag 0)
    d = "M%.1f %.1f A%d %d 0 0 0 %.1f %.1f L%.1f %.1f A%d %d 0 0 1 %.1f %.1f Z" % (x1, y1, r2, r2, x2, y2, x3, y3, r1, r1, x4, y4)
    mx, my = p((r1 + r2) / 2, (a1 + a2) / 2)
    out = '<path d="%s" fill="%s" stroke="#fff" stroke-width="1.5"/>' % (d, fill)
    for k, line in enumerate(label.split("|")):
        out += t(mx, my + 3 + (k - (label.count("|")) / 2) * 10, line, size, "middle", "600", "#1b1b1b")
    return out
def seating_svg():
    cx, cy = 300, 300
    b = []
    S, W, B, P = FAM["dây"], FAM["gỗ"], FAM["đồng"], FAM["gõ"]
    b.append(sector(cx, cy, 40, 120, 125, 180, S, "Violin 1"))
    b.append(sector(cx, cy, 40, 120, 90, 125, S, "Violin 2"))
    b.append(sector(cx, cy, 40, 120, 55, 90, S, "Viola"))
    b.append(sector(cx, cy, 40, 120, 0, 55, S, "Cello"))
    b.append(sector(cx, cy, 120, 175, 0, 30, S, "Contra-|bass", 8))
    b.append(sector(cx, cy, 120, 175, 150, 180, FAM["gảy"], "Harp", 8))
    b.append(sector(cx, cy, 120, 175, 90, 150, W, "Sáo|Oboe"))
    b.append(sector(cx, cy, 120, 175, 30, 90, W, "Clarinet|Bassoon"))
    b.append(sector(cx, cy, 175, 230, 120, 180, B, "Kèn horn"))
    b.append(sector(cx, cy, 175, 230, 60, 120, B, "Trumpet"))
    b.append(sector(cx, cy, 175, 230, 0, 60, B, "Trombone|Tuba"))
    b.append(sector(cx, cy, 230, 280, 40, 140, P, "Timpani · bộ gõ"))
    b.append('<circle cx="%d" cy="%d" r="16" fill="currentColor"/>' % (cx, cy - 4))
    b.append(t(cx, cy + 22, "Nhạc trưởng", 9, "middle", "600"))
    b.append(t(cx, cy + 36, "▼ phía khán giả ▼", 8, "middle", op=.6))
    return svg(600, 340, "Sơ đồ chỗ ngồi thường gặp của dàn nhạc giao hưởng nhìn từ trên xuống: bộ dây phía trước, bộ gỗ ở giữa, bộ đồng phía sau, bộ gõ sau cùng",
               "".join(b), "oz-fig oz-fig-wide")

# ---------------------------------------------------------------- Violin, guitar
def fingerboard_svg(strings, frets, label, title_note, fret_names):
    """strings: [(tên dây, [nốt ở dây buông, phím/ngón 1..n]; None = bỏ trống)]"""
    LBL, OPEN, NUT, STEP = 96, 122, 146, 92   # cột tên dây | dây buông | lược đàn | khoảng phím
    n = len(strings); W = NUT + frets * STEP + 10; H = 40 + n * 30
    b = []
    for f in range(frets + 1):
        xx = NUT + f * STEP
        b.append('<line x1="%d" y1="28" x2="%d" y2="%d" stroke="currentColor" stroke-width="%s" stroke-opacity="%s"/>' % (xx, xx, 28 + (n - 1) * 30, 4 if f == 0 else 1.2, .9 if f == 0 else .35))
        if f < frets: b.append(t(xx + STEP / 2, 18, fret_names[f], 8, "middle", op=.7))
    b.append(t(OPEN, 18, "dây buông", 8, "middle", op=.7))
    for i, (sname, notes) in enumerate(strings):
        y = 28 + i * 30
        b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="currentColor" stroke-width="%.1f" stroke-opacity=".75"/>' % (OPEN - 14, y, W - 6, y, 1 + (n - 1 - i) * .35 if n == 6 else 1 + i * .4))
        b.append(t(LBL, y + 4, sname, 9, "end", "600"))
        for k, nm in enumerate(notes):
            if nm is None: continue
            xx = OPEN if k == 0 else NUT + (k - 1) * STEP + STEP / 2
            fill = "#f3e3b8" if k == 0 else "#7aa6d6"
            b.append('<circle cx="%.1f" cy="%d" r="11" fill="%s" stroke="#1b1b1b" stroke-opacity=".4"/>' % (xx, y, fill))
            b.append(t(xx, y + 3.5, nm, 8 if len(nm) < 4 else 7, "middle", "600", "#1b1b1b"))
    return svg(W, H, label, "".join(b), "oz-fig oz-fig-wide")
def violin_svg():
    # Thế bấm thứ nhất, ngón 2 "cao" (như Rê trưởng, La trưởng): dây buông, ngón 1, 2, 3, 4
    strings = [("Mi (E5)", ["Mi", "Fa♯", "Sol♯", "La", "Si"]), ("La (A4)", ["La", "Si", "Đô♯", "Rê", "Mi"]),
               ("Rê (D4)", ["Rê", "Mi", "Fa♯", "Sol", "La"]), ("Sol (G3)", ["Sol", "La", "Si", "Đô", "Rê"])]
    return fingerboard_svg(strings, 4, "Cần đàn violin, thế bấm thứ nhất: các nốt trên từng dây với dây buông và ngón 1 đến 4 (ngón 2 cao, như ở Rê trưởng và La trưởng)",
                           "", ["ngón 1", "ngón 2", "ngón 3", "ngón 4"])
def guitar_svg():
    strings = [("1 · Mi (E4)", ["Mi", "Fa", None, "Sol"]), ("2 · Si (B3)", ["Si", "Đô", None, "Rê"]),
               ("3 · Sol (G3)", ["Sol", None, "La", None]), ("4 · Rê (D3)", ["Rê", None, "Mi", "Fa"]),
               ("5 · La (A2)", ["La", None, "Si", "Đô"]), ("6 · Mi (E2)", ["Mi", "Fa", None, "Sol"])]
    return fingerboard_svg(strings, 3, "Cần đàn guitar, thế bấm thứ nhất: các nốt tự nhiên trên 6 dây ở phím 0 đến 3", "", ["phím 1", "phím 2", "phím 3"])

# ---------------------------------------------------------------- Bàn phím và điệu thức
def keyboard_modes_svg():
    W, H, BW, BH = 54, 100, 30, 60
    whites = [m for m in range(60, 73) if m % 12 in (0, 2, 4, 5, 7, 9, 11)]
    pos = {}; b = []; x = 0
    MODES = {62: ("Dorian", "#7aa6d6"), 64: ("Phrygian", "#c9a0dc"), 65: ("Lydian", "#8cc49a"), 67: ("Mixolydian", "#e0b45e"),
             69: ("Aeolian", "#e98f7a"), 71: ("Locrian", "#b0b0b0"), 60: ("Ionian", "#f3e3b8")}
    vi = {0: "Đô", 2: "Rê", 4: "Mi", 5: "Fa", 7: "Sol", 9: "La", 11: "Si"}
    for m in whites:
        pos[m] = x
        fill = MODES[m][1] if m in MODES else "#fff"
        b.append('<rect x="%d" y="1" width="%d" height="%d" rx="2" fill="%s" stroke="#444"/>' % (x + 1, W, H, fill))
        b.append(t(x + 1 + W / 2, H - 8, vi[m % 12], 10, "middle", fill="#222"))
        x += W
    for m in range(60, 73):
        if m % 12 in (1, 3, 6, 8, 10) and m - 1 in pos:
            b.append('<rect x="%.1f" y="1" width="%d" height="%d" rx="1.5" fill="#222"/>' % (pos[m - 1] + W - BW / 2 + 1, BW, BH))
    for i, (m, (name, col)) in enumerate(sorted(MODES.items())):
        cx = pos[m] + 1 + W / 2
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="currentColor" stroke-opacity=".4"/>' % (cx, H + 2, cx, H + 10 + (i % 2) * 14))
        b.append(t(cx, H + 20 + (i % 2) * 14, name, 10, "middle", "600"))
    return svg(x + 2, H + 42, "Bảy điệu thức trên phím trắng: Ionian bắt đầu từ Đô, Dorian từ Rê, Phrygian từ Mi, Lydian từ Fa, Mixolydian từ Sol, Aeolian từ La, Locrian từ Si", "".join(b), "oz-fig oz-fig-wide")

# ---------------------------------------------------------------- Vòng quãng năm (bản tĩnh)
def circle_svg():
    majors = ["C", "G", "D", "A", "E", "B", "F♯/G♭", "D♭", "A♭", "E♭", "B♭", "F"]
    minors = ["a", "e", "b", "f♯", "c♯", "g♯", "e♭/d♯", "b♭", "f", "c", "g", "d"]
    sig = ["0", "1♯", "2♯", "3♯", "4♯", "5♯", "6♯/6♭", "5♭", "4♭", "3♭", "2♭", "1♭"]
    cx = cy = 110; p = []
    for r in (104, 66, 34):
        p.append('<circle cx="%d" cy="%d" r="%d" fill="none" stroke="currentColor" stroke-opacity=".35"/>' % (cx, cy, r))
    for i in range(12):
        a = math.radians(i * 30 - 90)
        p.append(t(cx + 86 * math.cos(a), cy + 86 * math.sin(a) + 1, majors[i], 9 if len(majors[i]) > 2 else 12, "middle", "600"))
        p.append(t(cx + 86 * math.cos(a), cy + 86 * math.sin(a) + 11, sig[i], 6.5, "middle", op=.7))
        p.append(t(cx + 51 * math.cos(a), cy + 51 * math.sin(a) + 3, minors[i], 7.5 if len(minors[i]) > 2 else 9.5, "middle"))
        a2 = math.radians(i * 30 - 75)
        p.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="currentColor" stroke-opacity=".2"/>' % (
            cx + 66 * math.cos(a2), cy + 66 * math.sin(a2), cx + 104 * math.cos(a2), cy + 104 * math.sin(a2)))
    p.append(t(cx, cy - 2, "ngoài: trưởng", 7, "middle")); p.append(t(cx, cy + 8, "trong: thứ", 7, "middle"))
    return svg(220, 220, "Vòng quãng năm: vòng ngoài là giọng trưởng kèm số dấu hóa, vòng trong là giọng thứ song song", "".join(p), "oz-fig oz-fig-circle")

# ---------------------------------------------------------------- Chức năng hòa âm
def functions_svg():
    b = []
    nodes = [(170, 30, "CHỦ", "I · vi", "#f3e3b8"), (290, 140, "HẠ ÁT", "IV · ii", "#8cc49a"), (50, 140, "ÁT", "V · V7 · vii°", "#e98f7a")]
    b.append('<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>')
    # mũi tên và vị trí nhãn (đặt ra ngoài để không đè lên mũi tên)
    arrows = [((215, 48), (275, 112), "rời nhà", (268, 70, "start")), ((245, 155), (110, 155), "chuẩn bị", (177, 172, "middle")),
              ((70, 112), (130, 48), "về nhà", (72, 70, "end"))]
    for (x1, y1), (x2, y2), lab, (lx, ly, anc) in arrows:
        b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="currentColor" stroke-width="1.6" marker-end="url(#ar)"/>' % (x1, y1, x2, y2))
        b.append(t(lx, ly, lab, 9, anc, op=.85))
    for x, y, a, s, col in nodes:
        b.append('<rect x="%d" y="%d" width="80" height="40" rx="10" fill="%s" stroke="#1b1b1b" stroke-opacity=".3"/>' % (x - 40 + (0 if x == 170 else 0), y - 20 + 0, col))
        b.append(t(x, y - 3, a, 10, "middle", "700", "#1b1b1b")); b.append(t(x, y + 12, s, 9, "middle", fill="#1b1b1b"))
    return svg(340, 182, "Vòng chức năng hòa âm: Chủ (I, vi) rời nhà sang Hạ át (IV, ii), chuẩn bị cho Át (V, V7, vii°), rồi về nhà ở Chủ", "".join(b), "oz-fig oz-fig-mid")

# ---------------------------------------------------------------- Dòng thời gian
PER = {"Trung cổ": "#d9c9a3", "Phục hưng": "#c7d9a3", "Baroque": "#e0b45e", "Cổ điển": "#7aa6d6", "Lãng mạn": "#e98f7a",
       "Thế kỷ 20": "#c9a0dc", "Đương đại": "#9fd0d0"}
def periods_svg():
    data = [("Trung cổ", "~500–1400", "Hildegard · Machaut"), ("Phục hưng", "~1400–1600", "Josquin · Palestrina"),
            ("Baroque", "~1600–1750", "Vivaldi · Bach · Handel"), ("Cổ điển", "~1750–1820", "Haydn · Mozart · Beethoven"),
            ("Lãng mạn", "~1820–1900", "Chopin · Brahms · Tchaikovsky"), ("Thế kỷ 20", "~1900–2000", "Debussy · Stravinsky"),
            ("Đương đại", "2000–nay", "Pärt · Adams · Shaw")]
    w = 96; b = []
    for i, (n, yrs, who) in enumerate(data):
        x = i * w
        b.append('<rect x="%d" y="0" width="%d" height="84" fill="%s" stroke="#fff" stroke-width="2"/>' % (x, w, PER[n]))
        b.append(t(x + w / 2, 20, n, 10, "middle", "700", "#1b1b1b"))
        b.append(t(x + w / 2, 34, yrs, 8, "middle", fill="#1b1b1b"))
        for k, part in enumerate(who.split(" · ")):
            b.append(t(x + w / 2, 48 + k * 10, part, 7.5, "middle", fill="#1b1b1b"))
    return svg(7 * w, 86, "Bảy thời kỳ của nhạc cổ điển phương Tây từ Trung cổ đến đương đại, mỗi thời kỳ kèm vài nhà soạn nhạc tiêu biểu", "".join(b), "oz-fig oz-fig-wide")
def lifespans_svg():
    src = open(os.path.join(DOCS, "lich-su", "dong-thoi-gian.md"), encoding="utf-8").read()
    rows = []
    for m in re.finditer(r"^\| ([^|]+?) \| (\d{3,4}) \| (\d{3,4}|) ?\| ([^|]+?) \|$", src, re.M):
        name, a, z, per = m.group(1), int(m.group(2)), (int(m.group(3)) if m.group(3) else 2026), m.group(4).split("/")[0].strip()
        rows.append((a, z, name, per))
    lo, hi, L, W, RH = 1650, 2030, 150, 680, 11
    rows = sorted(r for r in rows if r[1] > lo + 10)   # chỉ những người còn sống sau 1660 (trục bắt đầu từ 1650)
    x = lambda y: L + (y - lo) / (hi - lo) * (W - L - 10)
    H = 30 + len(rows) * RH + 10
    b = []
    for y in range(1650, 2031, 50):
        b.append('<line x1="%.1f" y1="16" x2="%.1f" y2="%d" stroke="currentColor" stroke-opacity=".15"/>' % (x(y), x(y), H - 6))
        b.append(t(x(y), 12, str(y), 8, "middle", op=.7))
    for i, (a, z, name, per) in enumerate(rows):
        yy = 22 + i * RH
        a2 = max(a, lo)
        col = PER.get(per, "#b0b0b0")
        b.append(t(L - 6, yy + 8, name, 8, "end"))
        b.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" rx="2" fill="%s"/>' % (x(a2), yy + 1, x(z) - x(a2), RH - 3, col))
        if a < lo: b.append(t(x(lo) + 2, yy + 8, "← %d" % a, 6.5, fill="#1b1b1b"))
    return svg(W, H, "Biểu đồ vòng đời các nhà soạn nhạc từ năm 1650 đến nay, tô màu theo thời kỳ; nhà soạn nhạc sinh trước 1650 có mũi tên chỉ năm sinh", "".join(b), "oz-fig oz-fig-wide")

# ---------------------------------------------------------------- Boléro
def bolero_svg():
    b = ['<polygon points="40,62 640,10 640,114" fill="#e0b45e" fill-opacity=".35" stroke="#b5832a"/>']
    steps = ["Sáo", "Clarinet", "Bassoon", "Clarinet Mi♭", "Oboe d'amore", "Trumpet + sáo", "Saxophone", "Horn + celesta + piccolo", "…", "Cả dàn nhạc"]
    for i, s in enumerate(steps):
        xx = 50 + i * 64
        b.append('<line x1="%d" y1="118" x2="%d" y2="124" stroke="currentColor" stroke-opacity=".5"/>' % (xx, xx))
        b.append('<text x="%d" y="132" font-size="7.5" fill="currentColor" transform="rotate(35 %d 132)">%s</text>' % (xx, xx, html.escape(s)))
    b.append(t(42, 58, "pp", 11, "start", "700")); b.append(t(590, 66, "fff", 12, "end", "700"))
    b.append('<line x1="600" y1="4" x2="600" y2="120" stroke="#b3412e" stroke-dasharray="3 2"/>')
    b.append(t(596, 0 + 12, "chuyển sang Mi trưởng, rồi đổ sụp", 8, "end", "600", "#b3412e"))
    b.append(t(40, 186, "Trống snare giữ cùng một tiết tấu từ đầu đến cuối; giai điệu A và B chuyền qua các nhạc cụ.", 8.5, op=.8))
    return svg(680, 196, "Boléro: một crescendo kéo dài suốt tác phẩm, giai điệu chuyền lần lượt từ sáo, clarinet, bassoon… đến cả dàn nhạc; gần cuối chuyển giọng một lần rồi kết", "".join(b), "oz-fig oz-fig-wide")


# ---------------------------------------------------------------- Bài 21: dẫn bè
VOICE_COL = {"S": "#b3412e", "A": "#b5832a", "T": "#2e7d4f", "B": "#2f5582"}
def voice_svg(chords, labels, voices, title, bad=None):
    """chords: [[B, T, A, S] midi]; vẽ mỗi bè thành một đường; bad: [(i, bè1, bè2)] cặp quãng song song cấm"""
    lo = min(min(c) for c in chords) - 2; hi = max(max(c) for c in chords) + 2
    W, L, H = 120 + 120 * (len(chords) - 1), 60, (hi - lo) * 6 + 40
    x = lambda i: L + i * 120
    y = lambda m: 10 + (hi - m) * 6
    b = []
    for i, lab in enumerate(labels):
        b.append('<line x1="%d" y1="6" x2="%d" y2="%d" stroke="currentColor" stroke-opacity=".1"/>' % (x(i), x(i), H - 22))
        b.append(t(x(i), H - 8, lab, 10, "middle", "700"))
    for vi, v in enumerate(voices):
        pts = [(x(i), y(c[vi])) for i, c in enumerate(chords)]
        b.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2.2"/>' % (" ".join("%.1f,%.1f" % p for p in pts), VOICE_COL[v]))
        for i, (px, py) in enumerate(pts):
            b.append('<circle cx="%.1f" cy="%.1f" r="9" fill="#fff" stroke="%s" stroke-width="1.6"/>' % (px, py, VOICE_COL[v]))
            b.append(t(px, py + 3, NAMES_VI[chords[i][vi] % 12].replace("♯", "#"), 6.5, "middle", "600", "#1b1b1b"))
        b.append(t(x(len(chords) - 1) + 16, pts[-1][1] + 3, v, 10, "start", "700", VOICE_COL[v]))
    for (i, v1, v2) in (bad or []):
        for j in (i, i + 1):
            pass
        a1, a2 = voices.index(v1), voices.index(v2)
        for (px1, py1, px2, py2) in [(x(i), y(chords[i][a1]), x(i + 1), y(chords[i + 1][a1])), (x(i), y(chords[i][a2]), x(i + 1), y(chords[i + 1][a2]))]:
            b.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#b3412e" stroke-width="5" stroke-opacity=".35"/>' % (px1, py1, px2, py2))
    return svg(W + 40, H, title, "".join(b), "oz-fig oz-fig-mid")
def voice_leading_figs():
    good = voice_svg([[48, 55, 64, 72], [53, 57, 65, 72], [43, 55, 62, 71], [48, 55, 64, 72]], ["I", "IV", "V", "I"], ["B", "T", "A", "S"],
                     "Dẫn bè I – IV – V – I ở Đô trưởng: bốn đường gần như đi ngang hoặc bước liền; soprano giữ Đô rồi Si đi lên Đô")
    bad = voice_svg([[48, 55, 64, 72], [50, 57, 65, 74]], ["C", "Dm"], ["B", "T", "A", "S"],
                    "Lỗi quãng song song: bass và tenor đi từ quãng 5 Đô–Sol sang quãng 5 Rê–La; bass và soprano đi từ quãng 8 Đô–Đô sang quãng 8 Rê–Rê", bad=[(0, "B", "T"), (0, "B", "S")])
    return figure(good, "Mỗi đường là một bè (S soprano, A alto, T tenor, B bass). Dẫn bè tốt: các đường đi gần, ít nhảy; nốt chung được giữ nguyên.") + \
           figure(bad, "Lỗi cần tránh (vạch đỏ): bass–tenor đi quãng 5 song song, bass–soprano đi quãng 8 song song. Cả bốn bè cùng đi lên cũng làm mất tính độc lập.")

# ---------------------------------------------------------------- Bài 22: đối âm
def counterpoint_svg():
    cf = [62, 65, 64, 62, 67, 65, 69, 67, 65, 64, 62]
    cp = [69, 74, 72, 74, 71, 74, 72, 76, 74, 73, 74]
    names = ["Rê", "Fa", "Mi", "Rê", "Sol", "Fa", "La", "Sol", "Fa", "Mi", "Rê"]
    nsp = ["La", "Rê", "Đô", "Rê", "Si", "Rê", "Đô", "Mi", "Rê", "Đô♯", "Rê"]
    iv = {0: "1", 2: "2", 3: "3", 4: "3", 5: "4", 7: "5", 8: "6", 9: "6", 12: "8", 11: "7", 10: "7"}
    W, L = 60 + 52 * 11, 50
    lo, hi = 60, 78
    x = lambda i: L + i * 52; y = lambda m: 14 + (hi - m) * 7
    b = []
    for i in range(11):
        d = cp[i] - cf[i]; simple = d % 12 if d != 12 else 12
        perfect = simple in (0, 7, 12)
        b.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/>' % (x(i), y(cp[i]), x(i), y(cf[i])))
        b.append(t(x(i) + 6, (y(cp[i]) + y(cf[i])) / 2 + 3, iv.get(simple, str(simple)), 10, "start", "700", "#b5832a" if perfect else "currentColor"))
    for i in range(10):
        a = cf[i + 1] - cf[i]; c = cp[i + 1] - cp[i]
        kind = "ngược" if a * c < 0 else ("xiên" if a == 0 or c == 0 else "cùng chiều")
        col = {"ngược": "#2e7d4f", "xiên": "#2f5582", "cùng chiều": "#999"}[kind]
        b.append(t((x(i) + x(i + 1)) / 2, 168, kind, 7.5, "middle", "600", col))
    for line, nm, col in ((cp, nsp, "#b3412e"), (cf, names, "#2f5582")):
        b.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2"/>' % (" ".join("%d,%.1f" % (x(i), y(m)) for i, m in enumerate(line)), col))
        for i, m in enumerate(line):
            b.append('<circle cx="%d" cy="%.1f" r="9" fill="#fff" stroke="%s" stroke-width="1.6"/>' % (x(i), y(m), col))
            b.append(t(x(i), y(m) + 3, nm[i], 6.5, "middle", "600", "#1b1b1b"))
    b.append(t(L - 14, y(cp[0]) + 3, "Đối âm", 8, "end", "700", "#b3412e")); b.append(t(L - 14, y(cf[0]) + 3, "CF", 8, "end", "700", "#2f5582"))
    return figure(svg(W, 178, "Đối âm loại 1: bè đối âm (đỏ) trên cantus firmus (xanh); số giữa hai bè là quãng, quãng đúng tô vàng; hàng dưới là kiểu chuyển động giữa hai nốt liên tiếp", "".join(b), "oz-fig oz-fig-wide"),
                  "Số giữa hai bè: quãng (vàng = quãng đúng, chỉ ở đầu, cuối và khi đến bằng chuyển động ngược). Hàng dưới: kiểu chuyển động; chuyển động ngược (xanh lá) chiếm phần lớn.")

# ---------------------------------------------------------------- Bài 28: piano roll kết cấu
FJ = [(60, 1), (62, 1), (64, 1), (60, 1), (60, 1), (62, 1), (64, 1), (60, 1), (64, 1), (65, 1), (67, 2), (64, 1), (65, 1), (67, 2)]
def roll(lines, title, beats=16, lo=46, hi=80):
    W, H = 300, 92
    x = lambda b: 6 + b / beats * (W - 12); y = lambda m: 6 + (hi - m) / (hi - lo) * (H - 22)
    b = ['<rect x="0" y="0" width="%d" height="%d" rx="6" fill="currentColor" fill-opacity=".04"/>' % (W, H - 14)]
    for notes, col in lines:
        for st, m, d in notes:
            if st >= beats: continue
            b.append('<rect x="%.1f" y="%.1f" width="%.1f" height="5" rx="1.5" fill="%s"/>' % (x(st), y(m) - 2.5, max(2, x(min(beats, st + d)) - x(st) - 1), col))
    b.append(t(W / 2, H - 2, title, 9, "middle", "700"))
    return svg(W, H, "Piano roll: " + title, "".join(b), "oz-fig")
def seq(notes, start=0, shift=0):
    out, tt = [], start
    for m, d in notes: out.append((tt, m + shift, d)); tt += d
    return out
def texture_figs():
    mel = seq(FJ)
    chords = []
    for i, ch in enumerate([[48, 52, 55]] * 5 + [[43, 47, 50], [48, 52, 55], [43, 47, 50]]):
        for m in ch: chords.append((i * 2, m, 2))
    het = []
    for st, m, d in mel:
        if d >= 1: het += [(st, m + 12, d * .5), (st + d * .5, m + 14, d * .25), (st + d * .75, m + 12, d * .25)]
        else: het.append((st, m + 12, d))
    A, B = "#2f5582", "#b5832a"
    cells = [roll([(mel, A)], "Đơn âm"), roll([(mel, A), (chords, B)], "Chủ điệu"),
             roll([(mel, A), (seq(FJ, 8, -12), B)], "Phức điệu (canon)"), roll([(mel, A), (het, B)], "Dị âm")]
    return '<figure class="oz-figure"><div class="oz-fig-grid">%s</div><figcaption>Cùng một giai điệu (xanh) trong bốn kết cấu, vẽ dạng piano roll: trục ngang là thời gian, trục dọc là cao độ. Màu vàng là phần thêm vào: hợp âm đệm, bè thứ hai vào sau, hoặc bản trang trí vang cùng lúc.</figcaption></figure>' % "".join(cells)

# ---------------------------------------------------------------- Bài 19: giọng gần
def keymap_svg():
    b = []
    pos = {"F": (90, 50), "C": (230, 50), "G": (370, 50), "Dm": (90, 150), "Am": (230, 150), "Em": (370, 150)}
    label = {"F": "Fa trưởng|1♭", "C": "Đô trưởng|giọng chính", "G": "Sol trưởng|1♯", "Dm": "Rê thứ|1♭", "Am": "La thứ|không dấu", "Em": "Mi thứ|1♯"}
    for a, c in [("F", "C"), ("C", "G"), ("Dm", "Am"), ("Am", "Em"), ("F", "Dm"), ("C", "Am"), ("G", "Em")]:
        (x1, y1), (x2, y2) = pos[a], pos[c]
        b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>' % (x1, y1, x2, y2))
    for k, (x0, y0) in pos.items():
        main = k == "C"
        b.append('<rect x="%d" y="%d" width="112" height="44" rx="10" fill="%s" stroke="#1b1b1b" stroke-opacity=".3"/>' % (x0 - 56, y0 - 22, "#f1d9a0" if main else ("#a9c7e8" if "m" not in k else "#c9b6dd")))
        l1, l2 = label[k].split("|")
        b.append(t(x0, y0 - 3, l1, 10, "middle", "700", "#1b1b1b")); b.append(t(x0, y0 + 12, l2, 8, "middle", fill="#1b1b1b"))
    b.append(t(230, 196, "Hàng trên: trưởng · hàng dưới: thứ song song · mỗi giọng khác giọng chính nhiều nhất 1 dấu hóa", 8.5, "middle", op=.75))
    return figure(svg(460, 204, "Năm giọng gần của Đô trưởng: Sol trưởng và Fa trưởng (cạnh nhau trên vòng quãng năm) cùng ba giọng thứ song song La thứ, Mi thứ, Rê thứ", "".join(b), "oz-fig oz-fig-mid"),
                  "Chuyển giữa các giọng gần nghe tự nhiên vì chỉ đổi một dấu hóa. Giọng xa (ví dụ Fa♯ trưởng, 6 thăng) tạo cảm giác bất ngờ.")

# ---------------------------------------------------------------- Âm học: phách
def beats_svg():
    f_c, f_e_et, f_e_just = 261.626, 329.628, 261.626 * 5 / 4
    W, H, L = 640, 150, 160
    out = []
    for row, (name, f2, col) in enumerate([("Quãng 3 thuần (5 : 4)", 4 * f_e_just, "#2e7d4f"), ("Quãng 3 bình quân", 4 * f_e_et, "#b3412e")]):
        f1 = 5 * f_c; df = abs(f2 - f1)
        y0 = 36 + row * 64; amp = 22
        pts_top, pts_bot = [], []
        for k in range(161):
            tt = k / 160 * 0.5
            env = abs(2 * math.cos(math.pi * df * tt)) / 2
            xx = L + k / 160 * (W - L - 10)
            pts_top.append("%.1f,%.1f" % (xx, y0 - amp * env)); pts_bot.append("%.1f,%.1f" % (xx, y0 + amp * env))
        out.append('<polygon points="%s" fill="%s" fill-opacity=".35" stroke="%s"/>' % (" ".join(pts_top + pts_bot[::-1]), col, col))
        out.append(t(L - 6, y0 - 4, name, 8.5, "end", "700"))
        out.append(t(L - 6, y0 + 9, ("lệch %.1f Hz → %.0f phách/giây" % (df, df)) if df > .05 else "trùng nhau → không phách", 7.5, "end", op=.75))
    for k in range(6):
        xx = L + k / 5 * (W - L - 10)
        out.append(t(xx, H - 4, "%.1f s" % (k * 0.1), 7.5, "middle", op=.6))
    return figure(svg(W, H, "Biên độ âm thanh khi bồi âm 5 của Đô4 gặp bồi âm 4 của Mi4: ở quãng thuần biên độ đứng yên, ở quãng bình quân biên độ dao động khoảng 10 lần mỗi giây", "".join(out), "oz-fig oz-fig-wide"),
                  "Vì sao quãng 3 bình quân nghe \"rung\": bồi âm 5 của Đô4 (1308,1 Hz) và bồi âm 4 của Mi4 bình quân (1318,5 Hz) lệch nhau khoảng 10,4 Hz, nên âm lượng dâng lên hạ xuống khoảng 10 lần mỗi giây. Ở quãng thuần, hai bồi âm trùng nhau nên âm thanh đứng yên.")

# ---------------------------------------------------------------- Sơ đồ cấu trúc (HTML)
KIND = {"a": "k-a", "b": "k-b", "c": "k-c", "dev": "k-dev", "cad": "k-cad", "coda": "k-coda", "intro": "k-intro", "x": "k-x"}
def form_map(caption, segs, note=""):
    """segs: [(nhãn, chú thích nhỏ, trọng số, loại)]"""
    cells = "".join('<div class="oz-seg %s" style="flex:%s 1 4.6rem"><b>%s</b>%s</div>' % (
        KIND[k], w, html.escape(lab), ("<small>%s</small>" % html.escape(sub)) if sub else "") for lab, sub, w, k in segs)
    return '<figure class="oz-figure"><div class="oz-form-map">%s</div><figcaption>%s%s</figcaption></figure>' % (
        cells, html.escape(caption), (" " + html.escape(note)) if note else "")

FORMS = {
 "form-sonata": form_map("Hình thức sonata (độ dài các phần chỉ minh họa).", [("Trình bày", "chủ đề 1 → chủ đề 2 (giọng mới)", 3, "a"), ("Phát triển", "nhiều giọng, căng thẳng", 2.2, "dev"), ("Tái hiện", "cả hai chủ đề ở giọng chính", 3, "a"), ("Coda", "", .8, "coda")]),
 "form-overview": "".join([
   form_map("Hai đoạn (binary).", [("A", "→ giọng át", 1, "a"), ("B", "→ về giọng chính", 1, "b")]),
   form_map("Ba đoạn (ternary).", [("A", "", 1, "a"), ("B", "tương phản", 1, "b"), ("A", "", 1, "a")]),
   form_map("Rondo.", [("A", "", 1, "a"), ("B", "", 1, "b"), ("A", "", 1, "a"), ("C", "", 1, "c"), ("A", "", 1, "a")]),
   form_map("Chủ đề và biến tấu.", [("Chủ đề", "", 1, "a")] + [("A'", "", 1, "b"), ("A''", "", 1, "c"), ("A'''", "", 1, "b"), ("…", "", .6, "x")]),
   form_map("Hình thức sonata.", [("Trình bày", "", 3, "a"), ("Phát triển", "", 2.2, "dev"), ("Tái hiện", "", 3, "a"), ("Coda", "", .8, "coda")])]),
 "form-small": "".join([
   form_map("Hai đoạn: mỗi phần có dấu nhắc lại.", [("‖: A :‖", "giọng chính → giọng át", 1, "a"), ("‖: B :‖", "đi xa → về giọng chính", 1, "b")]),
   form_map("Hai đoạn có tái hiện.", [("‖: A :‖", "→ giọng át", 1, "a"), ("‖: B", "đi xa", .8, "b"), ("A' :‖", "giọng chính", .8, "a")]),
   form_map("Ba đoạn: mỗi đoạn tự kết.", [("A", "trọn vẹn", 1, "a"), ("B", "tương phản rõ", 1, "c"), ("A", "trọn vẹn", 1, "a")]),
   form_map("Minuet và trio: A B A lớn, mỗi khối là hai đoạn có tái hiện.", [("Minuet", "‖:a:‖ ‖:b a':‖", 1, "a"), ("Trio", "‖:c:‖ ‖:d c':‖", 1, "c"), ("Minuet da capo", "không nhắc lại", 1, "a")])]),
 "form-variations-k265": form_map("Mozart, 12 biến tấu K. 265.", [("Chủ đề", "", 1, "a")] + [(str(i), "", 1, "c" if i == 8 else ("dev" if i == 11 else "b")) for i in range(1, 13)], "Ô màu khác: biến tấu 8 ở Đô thứ, biến tấu 11 Adagio."),
 "g-vivaldi": form_map("Mùa xuân, chương 1: hình thức ritornello (R = ritornello của cả dàn nhạc).", [("R", "", 1, "a"), ("Chim hót", "solo", 1.1, "b"), ("R", "", .7, "a"), ("Suối chảy", "", 1, "b"), ("R", "", .7, "a"), ("Bão", "giọng thứ", 1.3, "dev"), ("R", "giọng thứ", .7, "a"), ("Chim trở lại", "", 1, "b"), ("R", "", .8, "a")]),
 "g-bach-prelude": form_map("Prelude cung Đô trưởng, BWV 846 (35 ô nhịp; độ dài các ô gần đúng theo số ô nhịp).", [("Đô trưởng", "ô 1–4", 4, "a"), ("Đi xa: Sol trưởng", "ô 5–11", 7, "b"), ("Quay về, căng dần", "ô 12–23", 12, "dev"), ("Âm nền át", "ô 24–31", 8, "cad"), ("Âm nền chủ", "ô 32–35", 4, "coda")]),
 "g-haydn": form_map("Giao hưởng số 94, chương 2: chủ đề và 4 biến tấu.", [("Chủ đề", "hợp âm bất ngờ", 1.2, "a"), ("BT 1", "", 1, "b"), ("BT 2", "Đô thứ", 1, "c"), ("BT 3", "kèn gỗ", 1, "b"), ("BT 4", "cả dàn nhạc", 1, "b"), ("Coda", "", .7, "coda")]),
 "g-mozart40": form_map("Giao hưởng số 40, chương 1: hình thức sonata.", [("Trình bày", "Sol thứ → Si♭ trưởng", 2.4, "a"), ("(nhắc lại)", "", 2.4, "x"), ("Phát triển", "chuyển giọng đột ngột", 1.8, "dev"), ("Tái hiện", "cả hai chủ đề ở Sol thứ", 2.6, "a"), ("Coda", "", .5, "coda")]),
 "g-beethoven5": form_map("Giao hưởng số 5: hành trình từ Đô thứ đến Đô trưởng.", [("I. Allegro con brio", "Đô thứ · sonata", 1, "dev"), ("II. Andante con moto", "La♭ trưởng · biến tấu", 1.3, "b"), ("III. Scherzo", "Đô thứ", .9, "dev"), ("IV. Allegro", "Đô trưởng", 1.4, "a")], "Chương III nối thẳng sang chương IV (attacca)."),
 "g-op132": form_map("Tứ tấu Op. 132, chương 3.", [("A", "thánh ca, Lydian", 1.2, "a"), ("B", "“sức lực mới”, Rê trưởng", 1, "b"), ("A'", "", 1.2, "a"), ("B'", "", 1, "b"), ("A''", "“cảm xúc sâu thẳm nhất”", 1.4, "a")]),
 "g-trout": form_map("Ngũ tấu Con cá hồi, chương 4: ai chơi giai điệu?", [("Chủ đề", "đàn dây", 1, "a"), ("BT 1", "piano", 1, "b"), ("BT 2", "viola", 1, "b"), ("BT 3", "cello + bass", 1, "b"), ("BT 4", "Rê thứ", 1, "c"), ("BT 5", "cello, Si♭", 1, "b"), ("Allegretto", "đệm của ca khúc gốc", 1.2, "coda")]),
 "g-chopin": form_map("Nocturne Op. 9 số 2 (gần đúng).", [("A", "", 1, "a"), ("A", "trang trí", 1, "a"), ("B", "", 1, "b"), ("A", "", 1, "a"), ("B", "", 1, "b"), ("A", "", 1, "a"), ("Coda", "cadenza nhỏ", 1, "coda")]),
 "g-mendelssohn": form_map("Concerto violin cung Mi thứ: ba chương nối liền.", [("I. Trình bày", "violin vào ngay", 1.2, "a"), ("Phát triển", "", .8, "dev"), ("Cadenza", "trước tái hiện", .6, "cad"), ("Tái hiện", "", 1, "a"), ("→ bassoon", "", .3, "x"), ("II. Andante", "Đô trưởng", 1.4, "b"), ("cầu nối", "", .3, "x"), ("III. Allegro", "Mi trưởng", 1.5, "c")]),
 "g-habanera": form_map("Habanera: hai lời, mỗi lời theo sau bằng điệp khúc có hợp xướng.", [("Lời 1", "Carmen", 1, "a"), ("Điệp khúc", "+ hợp xướng", 1, "b"), ("Lời 2", "Carmen", 1, "a"), ("Điệp khúc", "+ hợp xướng", 1, "b")]),
 "g-brahms4": form_map("Giao hưởng số 4, chương 4: chủ đề 8 ô nhịp và 30 biến tấu (độ dài các ô gần đúng theo số biến tấu).", [("Chủ đề", "", 1, "a"), ("BT 1–11", "Mi thứ", 11, "b"), ("BT 12", "sáo", 1.2, "c"), ("BT 13–15", "Mi trưởng", 3, "c"), ("BT 16–30", "Mi thứ, dồn dập", 15, "dev"), ("Coda", "", 2, "coda")]),
 "g-dvorak": form_map("Giao hưởng số 9, chương 2 (Largo): hình thức ba đoạn.", [("Hợp âm mở đầu", "", .5, "intro"), ("A", "cor anglais, Rê♭ trưởng", 2, "a"), ("B", "Đô♯ thứ", 1.6, "c"), ("Đoạn sáng", "chủ đề ch. 1 vang lại", .8, "dev"), ("A", "cor anglais", 1.2, "a"), ("Kết", "", .4, "coda")]),
 "g-debussy": form_map("Clair de lune: ba đoạn.", [("A", "rất nhỏ, mơ hồ", 1, "a"), ("B", "hợp âm rải, dâng lên", 1, "b"), ("A'", "trở lại, tan dần", 1, "a")]),
 "g-rach2": form_map("Concerto piano số 2: ba chương.", [("I. Moderato", "Đô thứ · 8 hợp âm chuông", 1.2, "dev"), ("II. Adagio sostenuto", "Mi trưởng", 1.1, "b"), ("III. Allegro scherzando", "Đô thứ → Đô trưởng", 1.2, "a")]),
 "g-stravinsky": form_map("Le Sacre du printemps: hai phần.", [("Phần 1: Tôn thờ đất mẹ", "Khúc dạo đầu · Điềm báo mùa xuân …", 1, "a"), ("Phần 2: Lễ hiến tế", "… Vũ điệu hiến tế", 1, "dev")]),
 "g-shosta5": form_map("Giao hưởng số 5: bốn chương.", [("I. Moderato", "Rê thứ", 1.3, "dev"), ("II. Allegretto", "La thứ", .7, "b"), ("III. Largo", "Fa♯ thứ · không có kèn đồng", 1.2, "c"), ("IV. Allegro non troppo", "Rê thứ → Rê trưởng", 1, "a")]),
 "g-requiem": form_map("Mozart, Requiem: ai viết phần nào? Xanh: Mozart viết trọn. Vàng: Mozart viết bè hát và bè trầm, người khác hoàn thành phối khí (Lacrimosa: chỉ 8 ô nhịp đầu). Xám: chủ yếu Süssmayr. Đỏ: dùng lại nhạc Mozart ở phần mở đầu.",
   [("Introitus", "", 1, "a"), ("Kyrie", "", 1, "b"), ("Dies irae", "", 1, "b"), ("Tuba mirum", "", 1, "b"), ("Rex", "", .8, "b"), ("Recordare", "", 1, "b"), ("Confutatis", "", .8, "b"), ("Lacrimosa", "8 ô nhịp", .8, "b"), ("Offertorium", "", 1.2, "b"), ("Sanctus · Benedictus · Agnus Dei", "", 2.2, "x"), ("Communio", "dùng lại nhạc mở đầu", 1, "c")]),
}

# ---------------------------------------------------------------- Piano (mục Piano)
def piano88_svg():
    """Bàn phím 88 phím A0–C8: ghi tên mọi phím Đô, tô Đô giữa và La4."""
    WK, HW, HB, X0, Y0 = 12, 62, 39, 14, 30
    whites = [m for m in range(21, 109) if m % 12 in (0, 2, 4, 5, 7, 9, 11)]
    xs = {m: X0 + i * WK for i, m in enumerate(whites)}
    W = X0 * 2 + len(whites) * WK
    b = []
    for m in whites:
        fill = "#f3d27a" if m == 60 else ("#bcd6f2" if m == 69 else "#ffffff")
        b.append('<rect x="%d" y="%d" width="%d" height="%d" rx="1.5" fill="%s" stroke="#4a4a4a" stroke-width="0.6"/>' % (xs[m], Y0, WK, HW, fill))
    for m in range(22, 108):
        if m % 12 in (1, 3, 6, 8, 10):
            b.append('<rect x="%.1f" y="%d" width="7.4" height="%d" rx="1" fill="#1b1d22"/>' % (xs[m - 1] + WK - 3.7, Y0, HB))
    for m in whites:
        if m % 12 == 0 or m == 21:
            b.append(t(xs[m] + WK / 2, Y0 + HW + 11, note(m) if m != 21 else "A0", 7.5, "middle", "700" if m == 60 else "400"))
    for m, lab, anchor, dx in ((60, "Đô giữa (C4)", "middle", 0), (69, "La4 = 440 Hz", "start", -2)):
        cx = xs[m] + WK / 2
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="currentColor" stroke-opacity=".6"/>' % (cx, Y0 - 10, cx, Y0 - 1))
        b.append(t(cx + dx, Y0 - 13, lab, 8.5, anchor, "700" if m == 60 else "400"))
    yb = Y0 + HW + 27
    b.append(t(xs[60] - 6, yb, "← thường là vùng của tay trái", 8, "end", op=.75))
    b.append(t(xs[60] + WK + 6, yb, "thường là vùng của tay phải →", 8, "start", op=.75))
    return svg(W, Y0 + HW + 34, "Bàn phím piano 88 phím từ A0 đến C8; các phím Đô được ghi tên; Đô giữa (C4) tô vàng; La4 (440 Hz) tô xanh", "".join(b), "oz-fig oz-fig-wide")

def hands_svg():
    """Hai bàn tay úp trên phím, nhìn từ trên xuống, ghi số ngón 1–5."""
    skin, edge = "#f1d3b8", "#8a6a55"
    def hand(cx, mirror):
        s = -1 if mirror else 1
        out = []
        tx, ty, ang = cx - s * 42, 114, -42 * s
        out.append('<rect x="%.1f" y="%.1f" width="16" height="44" rx="8" fill="%s" stroke="%s" transform="rotate(%d %.1f %.1f)"/>' % (tx - 8, ty - 30, skin, edge, ang, tx, ty))
        out.append('<rect x="%.1f" y="78" width="80" height="60" rx="20" fill="%s" stroke="%s"/>' % (cx - 40, skin, edge))
        for n, dx, h in ((2, -27, 46), (3, -9, 54), (4, 9, 50), (5, 27, 38)):
            x = cx + s * dx
            out.append('<rect x="%.1f" y="%d" width="15" height="%d" rx="7.5" fill="%s" stroke="%s"/>' % (x - 7.5, 86 - h, h + 8, skin, edge))
            out.append(t(x, 86 - h + 13, str(n), 10, "middle", "700", "#1b1b1b"))
        r = math.radians(ang)
        lx, ly = tx + 21 * math.sin(r), ty - 21 * math.cos(r)
        out.append(t(lx, ly + 4, "1", 10, "middle", "700", "#1b1b1b"))
        out.append(t(cx, 158, "Tay trái" if mirror else "Tay phải", 10, "middle", "600"))
        return "".join(out)
    return svg(420, 166, "Số ngón tay khi chơi piano: ngón cái là 1, trỏ 2, giữa 3, áp út 4, út 5, ở cả hai tay", hand(110, True) + hand(310, False), "oz-fig oz-fig-mid")

def pedal_svg():
    """Bàn đạp nối (syncopated pedal): chân nhả đúng lúc hợp âm mới vang, rồi nhấn lại ngay sau."""
    X0, U = 96, 40
    yH, hH, yUp, yDn = 30, 26, 104, 128
    b = [t(X0 - 10, yH + 17, "Tay", 9, "end", "600"), t(X0 - 10, yUp + 4, "chân nhả", 8, "end", op=.75), t(X0 - 10, yDn + 4, "chân nhấn", 8, "end", op=.75)]
    for i, col in enumerate(("#7aa6d6", "#8cc49a", "#e0b45e")):
        x = X0 + i * 4 * U
        b.append('<rect x="%d" y="%d" width="%d" height="%d" rx="4" fill="%s"/>' % (x + 2, yH, 4 * U - 4, hH, col))
        b.append(t(x + 2 * U, yH + 17, "Hợp âm %d" % (i + 1), 9, "middle", "600", "#1b1b1b"))
    for k in (4, 8):
        x = X0 + k * U
        b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="currentColor" stroke-opacity=".45" stroke-dasharray="3 3"/>' % (x, yH - 4, x, yDn + 10))
    pts = [(0, yUp), (.5, yUp), (.5, yDn), (4, yDn), (4, yUp), (4.5, yUp), (4.5, yDn), (8, yDn), (8, yUp), (8.5, yUp), (8.5, yDn), (12, yDn), (12, yUp)]
    d = " ".join("%s%.1f %d" % ("M" if i == 0 else "L", X0 + p * U, y) for i, (p, y) in enumerate(pts))
    b.append('<path d="%s" fill="none" stroke="#b3412e" stroke-width="2.5" stroke-linejoin="round"/>' % d)
    b.append(t(X0 + 4 * U + 5, yUp - 8, "① nhả đúng lúc hợp âm mới vang", 8, "start", op=.85))
    b.append(t(X0 + 4.5 * U + 5, yDn + 16, "② nhấn lại ngay sau đó, khi ngón tay còn giữ phím", 8, "start", op=.85))
    b.append(t(X0 + 6 * U, 166, "thời gian →", 8, "middle", op=.6))
    return svg(X0 + 12 * U + 20, 172, "Sơ đồ bàn đạp nối: chân nhả bàn đạp đúng lúc tay đánh hợp âm mới và nhấn lại ngay sau đó", "".join(b), "oz-fig oz-fig-wide")

def keyboard_ranges_svg():
    """Âm vực đàn phím qua các thời kỳ, so với piano 88 phím."""
    rows = [("Thời Bach và Mozart", "Fa1–Fa6 · 5 quãng tám", 29, 89, "#d9c9a3"),
            ("Broadwood của Beethoven (1817)", "Đô1–Đô7 · 6 quãng tám", 24, 96, "#e0b45e"),
            ("Graf của Beethoven (1825)", "Đô1–Fa7 · 6½ quãng tám", 24, 101, "#e98f7a"),
            ("Piano hiện đại (88 phím)", "La0–Đô8 · 7¼ quãng tám", 21, 108, "#7aa6d6")]
    W, L, R, RH, TOP, lo, hi = 660, 190, 14, 24, 10, 21, 108
    x = lambda m: L + (m - lo) / (hi - lo) * (W - L - R)
    H = TOP + len(rows) * RH + 24
    b = []
    for c in range(24, 109, 12):
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="currentColor" stroke-opacity="%s"%s/>' % (
            x(c), TOP - 4, x(c), H - 18, ".55" if c == 60 else ".15", ' stroke-dasharray="3 2"' if c == 60 else ""))
        b.append(t(x(c), H - 6, note(c) + (" (Đô giữa)" if c == 60 else ""), 8, "middle", "600" if c == 60 else "400", op=.8))
    for i, (name, sub, a, z, col) in enumerate(rows):
        y = TOP + i * RH
        b.append(t(L - 8, y + 12, name, 9, "end", "600"))
        b.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" rx="3" fill="%s"/>' % (x(a), y + 2, x(z) - x(a), RH - 7, col))
        b.append(t((x(a) + x(z)) / 2, y + 13, sub, 8, "middle", "600", "#1b1b1b"))
    return svg(W, H, "Âm vực đàn phím qua các thời kỳ: thời Bach và Mozart Fa1–Fa6, Broadwood 1817 Đô1–Đô7, Graf 1825 Đô1–Fa7, piano hiện đại La0–Đô8", "".join(b), "oz-fig oz-fig-wide")

# ---------------------------------------------------------------- Kỹ thuật: tư thế, thế tay, luồn ngón
SKIN, SKIN_EDGE, CLOTH, CLOTH_EDGE = "#f1d3b8", "#8a6a55", "#9fb5cf", "#4a5d73"
def limb(pts, w, fill=SKIN, edge=SKIN_EDGE):
    """Một đoạn chi vẽ bằng nét dày bo tròn: viền trước, màu sau."""
    p = " ".join("%.1f,%.1f" % xy for xy in pts)
    style = 'fill="none" stroke-linecap="round" stroke-linejoin="round"'
    return ('<polyline points="%s" %s stroke="%s" stroke-width="%.1f"/>' % (p, style, edge, w + 2.4) +
            '<polyline points="%s" %s stroke="%s" stroke-width="%.1f"/>' % (p, style, fill, w))

def posture_svg():
    """Ngồi đúng trước đàn, nhìn ngang."""
    b = []
    b.append('<line x1="8" y1="280" x2="512" y2="280" stroke="currentColor" stroke-opacity=".35"/>')
    # đàn piano đứng: thân đàn, mặt phím, giá đỡ, bàn đạp
    b.append('<rect x="360" y="40" width="140" height="240" rx="4" fill="#d9c9a3" stroke="%s"/>' % SKIN_EDGE)
    b.append('<rect x="292" y="156" width="70" height="14" fill="#5b4636"/>')
    b.append('<rect x="292" y="148" width="70" height="8" rx="1.5" fill="#ffffff" stroke="#4a4a4a" stroke-width=".8"/>')
    b.append('<rect x="296" y="170" width="10" height="110" fill="#5b4636"/>')
    b.append('<rect x="300" y="268" width="62" height="6" rx="2" fill="#b0a48a" stroke="%s" stroke-width=".8"/>' % SKIN_EDGE)
    # ghế: tô nửa trước mặt ghế
    b.append('<rect x="70" y="196" width="110" height="10" rx="2" fill="#8a6a55"/>')
    b.append('<rect x="125" y="196" width="55" height="10" rx="2" fill="#b5832a" fill-opacity=".85"/>')
    b.append('<rect x="76" y="206" width="8" height="74" fill="#8a6a55"/><rect x="166" y="206" width="8" height="74" fill="#8a6a55"/>')
    # người: chân, thân, đầu, tay
    b.append(limb([(150, 192), (232, 197), (262, 270)], 20, CLOTH, CLOTH_EDGE))
    b.append(limb([(262, 271), (304, 273)], 9))
    b.append(limb([(150, 188), (160, 100)], 30, CLOTH, CLOTH_EDGE))
    b.append('<circle cx="170" cy="70" r="18" fill="%s" stroke="%s" stroke-width="1.2"/>' % (SKIN, SKIN_EDGE))
    b.append(limb([(163, 103), (200, 148)], 14, CLOTH, CLOTH_EDGE))
    b.append(limb([(200, 148), (272, 146), (292, 141)], 11))
    b.append(limb([(290, 142), (303, 147), (306, 149)], 6))
    # đường mặt phím kéo dài qua khuỷu tay
    b.append('<line x1="186" y1="150" x2="292" y2="150" stroke="#b3412e" stroke-width="1.2" stroke-dasharray="4 3"/>')
    b.append(t(284, 171, "khuỷu tay ngang mặt phím", 8.5, "end", "600", "#b3412e"))
    b.append(t(292, 112, "cẳng tay song song mặt phím,", 8.5, "middle"))
    b.append(t(292, 123, "cổ tay không võng", 8.5, "middle"))
    b.append(t(140, 70, "lưng thẳng,", 8.5, "end"))
    b.append(t(140, 81, "vai thả lỏng", 8.5, "end"))
    b.append(t(125, 226, "ngồi nửa trước", 8.5, "middle", "600"))
    b.append(t(125, 237, "mặt ghế", 8.5, "middle", "600"))
    b.append(t(282, 296, "bàn chân phẳng, chân phải gần bàn đạp, gót chạm sàn", 8.5, "middle"))
    b.append(t(430, 30, "đàn piano", 8.5, "middle", op=.7))
    return svg(520, 304, "Tư thế ngồi đúng trước đàn, nhìn ngang: ngồi nửa trước mặt ghế, lưng thẳng, khuỷu tay ngang mặt phím, cẳng tay song song mặt phím, bàn chân phẳng và chân phải gần bàn đạp", "".join(b), "oz-fig oz-fig-mid")

def handshape_svg():
    """Thế tay nhìn ngang: một hình đúng, hai lỗi hay gặp."""
    def key(ox):
        return ('<rect x="%d" y="130" width="80" height="6" fill="#5b4636"/>' % (ox + 110) +
                '<rect x="%d" y="118" width="80" height="12" rx="1.5" fill="#ffffff" stroke="#4a4a4a" stroke-width=".8"/>' % (ox + 110))
    panels = [
        ("ĐÚNG", "#2e7d4f", [(0, 100), (70, 101), (108, 93)], [(104, 95), (126, 103), (134, 113), (136, 118)], None,
         ["cổ tay ngang mặt phím, khớp gốc ngón", "thành vòm, chạm phím bằng đầu ngón"]),
        ("SAI: cổ tay võng", "#b3412e", [(0, 112), (70, 128), (106, 100)], [(103, 102), (124, 106), (134, 113), (137, 118)], (70, 128),
         ["cổ tay thấp hơn mặt phím,", "ngón phải với lên phím"]),
        ("SAI: gãy khớp đầu ngón", "#b3412e", [(0, 100), (70, 101), (108, 94)], [(104, 96), (126, 104), (135, 116), (152, 117)], (135, 116),
         ["khớp gần móng bẻ gập khi nhấn,", "tiếng yếu và không đều"]),
    ]
    b = []
    for i, (lab, col, arm, finger, ring, desc) in enumerate(panels):
        ox = i * 200
        b.append(key(ox))
        b.append(limb([(ox + x, y) for x, y in arm], 17))
        b.append(limb([(ox + x, y) for x, y in finger], 8))
        if i == 0:
            b.append('<path d="M%d 84 Q%d 74 %d 84" fill="none" stroke="#2e7d4f" stroke-width="1.2" stroke-dasharray="3 2"/>' % (ox + 78, ox + 96, ox + 114))
            b.append(t(ox + 96, 70, "vòm", 8, "middle", "600", "#2e7d4f"))
        if ring:
            b.append('<circle cx="%d" cy="%d" r="10" fill="none" stroke="#b3412e" stroke-width="1.6" stroke-dasharray="3 2"/>' % (ox + ring[0], ring[1]))
        b.append(t(ox + 100, 30, lab, 10, "middle", "700", col))
        for k, line in enumerate(desc):
            b.append(t(ox + 100, 158 + k * 11, line, 8.5, "middle"))
    return svg(600, 184, "Thế tay nhìn ngang: đúng là cổ tay ngang mặt phím, khớp gốc ngón thành vòm và chạm phím bằng đầu ngón; hai lỗi hay gặp là cổ tay võng xuống dưới mặt phím và gãy khớp đầu ngón khi nhấn", "".join(b), "oz-fig oz-fig-wide")

def thumbunder_svg():
    """Gam Đô trưởng đi lên: tay phải luồn ngón cái, tay trái vắt ngón 3."""
    WK, HW, HB, Y0 = 40, 110, 66, 30
    names = ["Đô", "Rê", "Mi", "Fa", "Sol", "La", "Si", "Đô"]
    hands = [("Tay phải, đi lên", 20, [1, 2, 3, 1, 2, 3, 4, 5], (0, 3, "under", "ngón cái luồn dưới bàn tay, sang Fa")),
             ("Tay trái, đi lên", 380, [5, 4, 3, 2, 1, 3, 2, 1], (2, 5, "over", "ngón 3 vắt qua ngón cái, sang La"))]
    b = []
    for title, x0, fingers, (a, z, kind, note_txt) in hands:
        b.append(t(x0 + 160, 18, title, 10, "middle", "700"))
        for i in range(8):
            fill = "#ffffff"
            b.append('<rect x="%d" y="%d" width="%d" height="%d" rx="2" fill="%s" stroke="#4a4a4a" stroke-width=".8"/>' % (x0 + i * WK, Y0, WK, HW, fill))
        for i in range(7):
            if i in (2, 6):
                continue
            b.append('<rect x="%.1f" y="%d" width="24" height="%d" rx="1.5" fill="#1b1d22"/>' % (x0 + (i + 1) * WK - 12, Y0, HB))
        for i, f in enumerate(fingers):
            cx = x0 + i * WK + WK / 2
            hot = i in (a, z)
            b.append('<circle cx="%.1f" cy="%d" r="10" fill="%s" stroke="%s" stroke-width="1"/>' % (cx, Y0 + 88, "#b5832a" if hot else "#e8eef5", "#1f3a5f"))
            b.append(t(cx, Y0 + 92, str(f), 10, "middle", "700", "#ffffff" if hot else "#1f3a5f"))
            b.append(t(cx, Y0 + HW + 12, names[i], 8, "middle", op=.8))
        xa, xz = x0 + a * WK + WK / 2, x0 + z * WK + WK / 2
        if kind == "under":
            d = "M%.1f %d Q%.1f %d %.1f %d" % (xa, Y0 + 100, (xa + xz) / 2, Y0 + 124, xz - 4, Y0 + 100)
        else:
            d = "M%.1f %d Q%.1f %d %.1f %d" % (xa, Y0 + 77, (xa + xz) / 2, Y0 + 44, xz - 4, Y0 + 78)
        b.append('<path d="%s" fill="none" stroke="#b3412e" stroke-width="2" marker-end="url(#oz-arr-thumb)"/>' % d)
        b.append(t(x0 + 160, Y0 + HW + 30, note_txt, 9, "middle", "600", "#b3412e"))
    defs = '<defs><marker id="oz-arr-thumb" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#b3412e"/></marker></defs>'
    return svg(720, Y0 + HW + 40, "Gam Đô trưởng đi lên, số ngón ghi trên từng phím. Tay phải 1 2 3 1 2 3 4 5: ngón cái luồn dưới bàn tay từ Đô sang Fa. Tay trái 5 4 3 2 1 3 2 1: ngón 3 vắt qua ngón cái từ Mi sang La", defs + "".join(b), "oz-fig oz-fig-wide")

PIANO_FIGS = {
 "piano-88": figure(piano88_svg(), "Bàn phím 88 phím: 52 phím trắng, 36 phím đen, từ La0 (A0) đến Đô8 (C8). Phím vàng là Đô giữa; phím xanh là La4, nốt chuẩn để lên dây (440 Hz)."),
 "hands": figure(hands_svg(), "Hai tay úp trên phím, nhìn từ trên xuống. Số ngón giống nhau ở hai tay; tay trái là ảnh gương của tay phải."),
 "tu-the-ngoi": figure(posture_svg(), "Ngồi đúng, nhìn ngang. Khuỷu tay ngang mặt phím (đường đứt nét), cẳng tay gần song song mặt phím, ngồi nửa trước mặt ghế (phần tô màu), hai bàn chân đặt vững."),
 "the-tay": figure(handshape_svg(), "Thế tay nhìn ngang. Bên trái là thế đúng; hai hình còn lại là hai lỗi người mới hay mắc nhất (vòng đứt nét chỉ chỗ sai)."),
 "luon-ngon": figure(thumbunder_svg(), "Gam Đô trưởng đi lên, số ngón ghi trên phím. Chỗ đổi vị trí tay tô màu: tay phải luồn ngón cái, tay trái vắt ngón 3. Khi đi xuống thì ngược lại: tay phải vắt ngón 3 qua ngón cái, tay trái luồn ngón cái."),
 "pedal-timing": figure(pedal_svg(), "Bàn đạp nối: chân nhả đúng lúc hợp âm mới vang (tay xuống, chân lên), rồi nhấn lại ngay sau đó. Nhờ vậy hai hợp âm nối liền mà không lẫn vào nhau."),
 "keyboard-ranges": figure(keyboard_ranges_svg(), "Âm vực đàn phím qua các thời kỳ, so với piano hiện đại (gần đúng). Đường nét đứt là Đô giữa."),
 # Bài học tác phẩm
 "p-minuet-sol": form_map("Minuet Sol trưởng, BWV Anh. 114: hai đoạn, mỗi đoạn 16 ô nhịp và đều nhắc lại.", [("‖: A, câu 1", "ô 1–8 · kết nửa ở Rê", 8, "a"), ("câu 2 :‖", "ô 9–16 · kết trọn ở Sol", 8, "a"), ("‖: B, câu 3", "ô 17–24 · sang Rê trưởng", 8, "b"), ("câu 4 :‖", "ô 25–32 · về Sol trưởng", 8, "b")]),
 "p-schumann-68": "".join([form_map("Số 1, Melodie (Đô trưởng, 4/4): các câu 4 ô.", [("a", "vang hai lần", 2, "a"), ("b", "", 1, "b"), ("a'", "kết ở Đô", 1, "a"), ("b", "", 1, "b"), ("a'", "kết ở Đô", 1, "a")]), form_map("Số 8, Wilder Reiter (La thứ, 6/8): ba đoạn, mỗi đoạn 8 ô.", [("A", "La thứ · giai điệu tay phải · nhắc lại", 2, "a"), ("B", "Fa trưởng · giai điệu tay trái", 1, "c"), ("A", "La thứ · giai điệu tay phải", 1, "a")]), form_map("Số 10, Fröhlicher Landmann (Fa trưởng, 4/4).", [("a", "4 ô · giai điệu tay trái · vang hai lần", 2, "a"), ("b", "6 ô · giai điệu cả hai tay · vang hai lần", 3, "b")])]),
 "p-clementi-36-1": form_map("Sonatina Op. 36 số 1: ba chương (độ rộng chỉ gần đúng).", [("I. Trình bày", "ô 1–15 · Đô → Sol trưởng", 15, "a"), ("Phát triển", "ô 16–23 · thoáng Đô thứ", 8, "dev"), ("Tái hiện", "ô 24–38 · về Đô trưởng", 15, "a"), ("II. Andante", "Fa trưởng · A B A'", 20, "b"), ("III. Vivace", "Đô trưởng · A B A + coda", 24, "c")], "Chương I: trình bày nhắc lại; phát triển và tái hiện nhắc lại cùng nhau."),
 "p-arabesque": form_map("Arabesque, Op. 100 số 2 (độ rộng gần đúng theo số ô nhịp).", [("Dẫn nhập", "2 ô · tay trái", 2, "intro"), ("‖: A :‖", "chùm nốt ở tay phải · p", 8, "a"), ("‖: B", "f · chùm nốt ở tay trái", 8, "b"), ("A' :‖", "a tempo · p", 8, "a"), ("Coda", "risoluto · f", 5, "coda")]),
 "p-valse-la-thu": form_map("Valse La thứ, B. 150: rondo nhỏ (độ rộng gần đúng theo số ô nhịp, chưa kể nhắc lại).", [("A", "La thứ · 16 ô", 16, "a"), ("B", "8 ô · nhắc lại", 8, "b"), ("A'", "La thứ", 16, "a"), ("C", "La trưởng · 16 ô · nhắc lại", 16, "c"), ("A''", "ba câu đầu", 12, "a"), ("Coda", "", 4, "coda")]),
 "p-fur-elise": form_map("Für Elise: rondo nhỏ A–B–A–C–A (độ dài các ô gần đúng theo số ô nhịp, không tính phần nhắc lại).", [("A", "La thứ · a, b + a", 22, "a"), ("B", "Fa trưởng · đường chạy móc ba", 16, "b"), ("A", "La thứ", 20, "a"), ("C", "nốt La trầm lặp lại", 18, "c"), ("Chuyển", "rải La thứ, nửa cung đi xuống", 5, "dev"), ("A", "La thứ · kết", 21, "a")]),
 "p-prelude-mi-thu": form_map("Prélude Mi thứ Op. 28 số 4: hai câu nhạc; câu sau bắt đầu như câu trước rồi lên cao trào (25 ô nhịp; độ dài các ô theo số ô nhịp).", [("Câu 1", "ô 1–12 · dừng ở hợp âm át", 12, "a"), ("Câu 2", "ô 13–15 · như ô 1", 3, "a"), ("Stretto, cao trào", "ô 16–18 · f", 3, "dev"), ("Lắng xuống", "ô 19–22 · smorz.", 4, "b"), ("Im lặng", "ô 23", 1, "x"), ("Kết", "ô 24–25 · pp", 2, "cad")]),
 "p-gymnopedie": form_map("Gymnopédie số 1: cả bài được chơi hai lượt gần như giống nhau, chỉ khác phần kết (độ dài các ô theo số ô nhịp).", [("Dạo đầu", "4 ô, chỉ tay trái", 4, "intro"), ("Câu 1", "8 ô", 8, "a"), ("Câu 2", "9 ô", 9, "a"), ("Đoạn giữa", "Đô♮, Fa♮", 10, "b"), ("Kết 1", "Rê trưởng", 8, "cad"), ("Lượt 2", "nhắc lại từ đầu", 31, "x"), ("Kết 2", "Fa♮ · Rê thứ", 8, "coda")]),
 "p-invention-1": form_map("Invention số 1 Đô trưởng: ba phần, mỗi phần khép bằng một kết (22 ô nhịp).", [("Phần 1", "ô 1–7 · Đô → Sol trưởng", 6.5, "a"), ("Phần 2", "ô 7–15 · chủ đề đảo → La thứ", 8, "b"), ("Phần 3", "ô 15–18 · nốt dài, chuỗi", 3.5, "dev"), ("Kết", "ô 19–22 · về Đô", 4, "coda")]),
 "p-k545": form_map("Mozart K. 545, chương 1 (73 ô nhịp; độ dài các ô theo số ô nhịp).", [("Chủ đề 1", "Đô trưởng · ô 1–4", 4, "a"), ("Đoạn chuyển", "chuỗi gam · ô 5–12", 8, "x"), ("Chủ đề 2 và kết", "Sol trưởng · ô 13–28", 16, "b"), ("Phát triển", "Sol thứ, Rê thứ, La thứ · ô 29–41", 13, "dev"), ("Tái hiện: chủ đề 1", "Fa trưởng → Đô · ô 42–57", 16, "a"), ("Chủ đề 2 và kết", "Đô trưởng · ô 58–73", 16, "b")], "Phần trình bày (ô 1–28) được nhắc lại."),
 "p-traumerei": form_map("Träumerei: 24 ô nhịp, sáu câu bốn ô; đoạn A đầu được nhắc lại.", [("A", "ô 1–8 · Fa trưởng", 8, "a"), ("A (nhắc lại)", "", 8, "a"), ("B", "ô 9–16 · Sol thứ → Si♭ → Rê thứ", 8, "b"), ("A'", "ô 17–24 · fermata gần cuối", 8, "a")]),
 "p-pathetique-2": form_map("Pathétique, chương 2: rondo (73 ô nhịp; độ dài các ô theo số ô nhịp).", [("A", "ô 1–16 · La♭ trưởng", 16, "a"), ("B", "ô 17–28 · Fa thứ → Mi♭", 12, "b"), ("A", "ô 29–36", 8, "a"), ("C", "ô 37–50 · La♭ thứ → Mi trưởng, chùm ba", 14, "c"), ("A", "ô 51–66 · đệm chùm ba", 16, "a"), ("Coda", "ô 66–73", 7, "coda")]),
 "p-mozart-k2": form_map("Mozart, Minuet Fa trưởng K. 2: đoạn A, đoạn B rời giọng, chủ đề trở lại (độ dài các ô theo số ô nhịp).", [("‖: A :‖", "Fa trưởng · ô 1–8 · kết nửa", 8, "a"), ("B", "sang Sol thứ rồi về Fa · ô 9–16", 8, "dev"), ("A'", "ô 17–20 · kết lừa", 4, "a"), ("Kết", "ô 21–24 · kết trọn", 4, "cad")]),
 "p-bach-bwv939": form_map("Bach, Prelude nhỏ Đô trưởng BWV 939: một mạch 16 ô, bốn chặng hòa âm (độ dài các ô theo số ô nhịp).", [("Nốt nền chủ", "ô 1–3", 3, "a"), ("Chuyền tay", "sang Sol trưởng · ô 4–8", 5, "dev"), ("Nốt nền át", "ô 9–12", 4, "cad"), ("Về Đô", "ô 13–16 · kết", 4, "a")]),
 "p-sonatina-sol": form_map("Sonatina Sol trưởng, Anh. 5 số 1: hai chương, mỗi chương A – B – A và coda (độ dài các ô theo số ô nhịp).", [("I. A", "Moderato · ô 1–8", 8, "a"), ("I. B", "quanh Rê bảy · ô 9–16", 8, "b"), ("I. A", "dolce · ô 17–24", 8, "a"), ("I. Coda", "ô 25–34", 10, "coda"), ("II. A", "Romanze · ô 1–8", 8, "a"), ("II. B", "Rê trưởng → Rê bảy · ô 9–21", 13, "c"), ("II. A", "ô 22–29", 8, "a"), ("II. Coda", "ô 29–40", 12, "coda")], "Chương I: ô 9–24 nhắc lại. Chương II: đoạn A nhắc lại; B và A nhắc lại cùng nhau."),
 "p-la-candeur": form_map("La candeur, Op. 100 số 1: hai đoạn có nhắc lại và một coda ngắn (độ rộng gần đúng theo số ô nhịp).", [("‖: A :‖", "ô 1–8 · tay phải hát, tay trái giữ hợp âm · dừng ở át âm", 8, "a"), ("‖: B :‖", "ô 9–16 · hai tay đổi vai · sf ở ô 14 · kết ở Đô trưởng", 8, "b"), ("Coda", "sau kết thứ hai · âm nền Đô · nhỏ dần đến pp", 6, "coda")], "Lần thứ hai, đoạn B rẽ sang kết thứ hai và đi thẳng vào coda."),
 "p-prelude-la-truong": form_map("Prélude La trưởng Op. 28 số 7: tám câu hai ô, câu nào cũng mở bằng một nhịp lấy đà (16 ô nhịp; độ dài các ô theo số ô nhịp).", [("Câu 1–2", "ô 1–4 · át → chủ", 4, "a"), ("Câu 3–4", "ô 5–8 · át → chủ", 4, "a"), ("Câu 5", "ô 9–10 · như câu 1", 2, "a"), ("Câu 6", "ô 11–12 · hợp âm rải lớn", 2, "dev"), ("Câu 7", "ô 13–14 · Si thứ → át", 2, "b"), ("Câu 8", "ô 15–16 · về La trưởng", 2, "cad")], "Hai nửa tám ô mở đầu giống nhau; từ ô 11 hòa âm đổi mỗi ô."),
 "p-arietta": form_map("Arietta Op. 12 số 1: một chủ đề nói hai lần, 23 ô nhịp (độ dài các ô theo số ô nhịp).", [("A · a", "ô 1–4 · chủ đề, Mi♭ trưởng", 4, "a"), ("b", "ô 5–8 · phát triển", 4, "dev"), ("c", "ô 9–12 · Sol thứ → Mi♭, hai lần kết", 4, "cad"), ("A' · a", "ô 13–16 · chủ đề, thêm nốt hoa mỹ", 4, "a"), ("b'", "ô 17–18 · rút gọn", 2, "dev"), ("c'", "ô 19–22 · nhóm kết", 4, "cad"), ("Coda", "ô 23 · mảnh chủ đề", 1, "coda")], "Theo phân tích của PTNA: A = ô 1–12, A' = ô 13–22; hình kết ở ô 9–10 xuất hiện bốn lần."),
 "p-minuet-sol-thu": form_map("Minuet Sol thứ, BWV Anh. 115: hai đoạn, mỗi đoạn 16 ô nhịp và đều nhắc lại.", [("‖: A, câu 1", "ô 1–8 · Sol thứ · kết nửa trên Rê", 8, "a"), ("câu 2 :‖", "ô 9–16 · kết ở Si♭ trưởng", 8, "a"), ("‖: B, câu 3", "ô 17–24 · Fa trưởng, Si♭ trưởng", 8, "b"), ("câu 4 :‖", "ô 25–32 · Đô thứ → Sol thứ", 8, "b")], "Khi chơi trọn cặp: Minuet Sol trưởng, Minuet Sol thứ, rồi Minuet Sol trưởng lần nữa (da capo)."),
 "p-musette-re": form_map("Musette Rê trưởng, BWV Anh. 126: hai đoạn có nhắc lại, rồi đoạn A trở lại (da capo); độ dài các ô theo số ô nhịp.", [("‖: A :‖", "ô 1–8 · Rê trưởng · bè trầm Rê", 8, "a"), ("‖: B", "ô 9–12 · La trưởng · bè trầm La", 4, "b"), ("âm nền Mi", "ô 13–18 · Rê♯", 6, "cad"), ("kết :‖", "ô 19–20 · La trưởng", 2, "b"), ("A da capo", "ô 1–8 · dừng ở dấu ngân", 8, "a")], "Đoạn B kết ở La trưởng (giọng át), nên đoạn A trở lại để bài kết ở Rê trưởng."),
 "p-bai-ca-phap-co": form_map("Bài ca Pháp cổ, Op. 39 số 16: A A B A, mỗi đoạn 8 ô nhịp.", [("A", "ô 1–8 · p · Sol thứ trên âm nền Sol", 8, "a"), ("A", "ô 9–16 · pp", 8, "a"), ("B", "ô 17–24 · hợp âm rải staccato · mf · dừng ở át âm", 8, "b"), ("A", "ô 25–32 · p · kết ở Sol thứ", 8, "a")], "Bài mở đầu bằng một nốt lấy đà (Rê); đoạn B dừng trên hợp âm Rê trưởng để đưa về A."),
 "p-cau-nguyen-buoi-sang": form_map("Cầu nguyện buổi sáng, Op. 39 số 1: hai câu tám ô và một coda tám ô trên âm nền Sol (24 ô nhịp; độ dài các ô theo số ô nhịp).", [("Câu 1", "ô 1–8 · kết ở Rê trưởng", 8, "a"), ("Câu 2", "ô 9–11 · như câu 1, rồi đi lên", 3, "a"), ("Cao trào", "ô 12–14 · f · vòng quãng năm", 3, "dev"), ("Kết câu 2", "ô 15–16 · kết trọn ở Sol trưởng", 2, "cad"), ("Coda", "ô 17–24 · âm nền Sol · pp", 8, "coda")], "Không có dấu nhắc lại; coda bắt đầu từ phách 3 của ô 16, khi bè trầm đã lặp nốt Sol."),
 "p-ballade-1": form_map("Chopin, Ballade số 1 (độ dài các ô gần đúng).", [("Largo", "ô 1–7", 7, "intro"), ("Chủ đề 1", "Sol thứ · từ ô 8", 28, "a"), ("Đoạn chuyển", "agitato", 32, "dev"), ("Chủ đề 2", "Mi♭ trưởng · từ ô 68", 26, "b"), ("Chủ đề 1", "La thứ", 12, "dev"), ("Chủ đề 2", "La trưởng · ff", 20, "b"), ("Đoạn nối và valse", "Mi♭ trưởng", 40, "c"), ("Chủ đề 2", "Mi♭ trưởng · ff", 28, "b"), ("Chủ đề 1", "Sol thứ · âm nền Rê", 14, "a"), ("Coda", "Presto con fuoco", 57, "coda")], "Hai chủ đề trở lại theo thứ tự đảo ngược."),
 "p-nocturne-9-2": form_map("Nocturne Op. 9 số 2: 34 ô nhịp; mỗi lần chủ đề trở lại được trang trí nhiều hơn (độ dài các ô theo số ô nhịp).", [("A", "ô 1–4", 4, "a"), ("A'", "ô 5–8 · thêm trang trí", 4, "a"), ("B", "ô 9–12 · quanh Si♭", 4, "b"), ("A''", "ô 13–16", 4, "a"), ("B'", "ô 17–20", 4, "b"), ("A'''", "ô 21–24 · trang trí nhiều nhất", 4, "a"), ("Coda", "ô 25–34 · cadenza nhỏ", 10, "coda")]),
 # Hướng dẫn nghe piano
 "g-goldberg": form_map("Biến tấu Goldberg, BWV 988: Aria, 30 biến tấu, Aria nhắc lại (độ dài các ô chỉ minh họa).", [("Aria", "sarabande · 32 ô", 1.2, "a"), ("BT 1–15", "canon ở 3, 6, 9, 12, 15 · BT 15 Sol thứ", 7, "b"), ("BT 16", "ouverture · mở nửa sau", 1, "intro"), ("BT 17–24", "canon ở 18, 21, 24 · BT 21 Sol thứ", 4.5, "b"), ("BT 25", "Sol thứ · Adagio", 1.6, "c"), ("BT 26–29", "canon ở 27 · rực rỡ", 2.5, "dev"), ("BT 30", "quodlibet", 1, "cad"), ("Aria da capo", "", 1.2, "a")], "Cứ ba biến tấu có một canon, khoảng cách giữa hai bè tăng dần từ đồng âm đến quãng 9."),
 "g-scarlatti": form_map("Sonata Scarlatti: hình thức hai đoạn, mỗi nửa nhắc lại.", [("‖: Nửa đầu", "giọng chính → giọng mới", 1.3, "a"), ("chất liệu kết :‖", "ở giọng mới", .8, "cad"), ("‖: Nửa sau", "đi xa hơn", 1.3, "dev"), ("chất liệu kết :‖", "về giọng chính", .8, "cad")], "Từ điểm crux, phần cuối của hai nửa “gieo vần” với nhau."),
 "g-k331": form_map("Sonata La trưởng K. 331: không chương nào ở hình thức sonata (độ dài các ô chỉ minh họa).", [("I. Chủ đề", "La trưởng · 6/8", 1, "a"), ("BT 1", "", .8, "b"), ("BT 2", "chùm ba", .8, "b"), ("BT 3", "La thứ", .8, "c"), ("BT 4", "vắt tay", .8, "b"), ("BT 5", "Adagio", 1.2, "b"), ("BT 6", "Allegro 4/4", .8, "b"), ("II. Menuetto", "trio Rê trưởng", 2.2, "a"), ("III. Alla turca", "La thứ ↔ La trưởng · coda", 2.2, "dev")]),
 "g-mozart21": form_map("Concerto piano số 21, K. 467: chương 1 có hai lần trình bày, của dàn nhạc rồi của piano (độ dài các ô gần đúng).", [("Dàn nhạc trình bày", "I · Đô trưởng · hành khúc", 1.2, "a"), ("Piano trình bày", "rẽ sang Sol thứ → Sol trưởng", 1.6, "b"), ("Phát triển", "", .9, "dev"), ("Tái hiện", "Đô trưởng", 1.4, "a"), ("Cadenza", "piano một mình", .6, "cad"), ("Coda", "", .4, "coda"), ("II. Andante", "Fa trưởng · dây gắn sordino, chùm ba", 2.6, "c"), ("III. Allegro vivace assai", "Đô trưởng · rondo, có cadenza ngắn", 2.4, "a")], "Cadenza của Mozart cho concerto này đã thất lạc; nghệ sĩ chơi cadenza của người khác hoặc tự soạn."),
 "g-pathetique": form_map("Sonata Pathétique, Op. 13: ba chương (độ dài các ô chỉ minh họa).", [("Grave", "mở đầu chậm · Đô thứ", .9, "intro"), ("Trình bày", "Allegro · chủ đề 2 ở Mi♭ thứ", 1.5, "a"), ("Grave", "vài ô nhịp", .35, "intro"), ("Phát triển", "", .8, "dev"), ("Tái hiện", "Đô thứ", 1.3, "a"), ("Coda", "Grave thoáng qua", .5, "coda"), ("II. Adagio cantabile", "La♭ trưởng · rondo A B A C A", 2.2, "b"), ("III. Rondo: Allegro", "Đô thứ · các đoạn xen ở Mi♭ và La♭ trưởng", 2, "a")], "Phần Grave quay lại hai lần trong chương 1: ở đầu phần phát triển và trong coda."),
 "g-impromptu": form_map("Impromptu Sol♭ trưởng, D. 899 số 3: ba đoạn (gần đúng).", [("A", "Sol♭ trưởng · giai điệu hát trên dòng đệm chảy đều", 2, "a"), ("B", "bắt đầu ở Mi♭ thứ · bè trầm nhấn, chuyển giọng liên tục", 1.6, "c"), ("A'", "Sol♭ trưởng · khép lại rất nhỏ", 1.8, "a")], "Dòng đệm hợp âm rải gần như không dừng suốt bài."),
 "g-kinderszenen": form_map("Kinderszenen, Op. 15: 13 cảnh nhỏ. Xanh dương: giọng trưởng; đỏ: giọng thứ; xanh lá: Träumerei, nằm đúng giữa; xám: lời kết.", [("1", "Xứ lạ · Sol trưởng", 1, "a"), ("2", "Chuyện kỳ lạ · Rê trưởng", 1, "a"), ("3", "Bịt mắt bắt dê · Si thứ", 1, "c"), ("4", "Nài nỉ · Rê trưởng", 1, "a"), ("5", "Đủ hạnh phúc · Rê trưởng", 1, "a"), ("6", "Sự kiện quan trọng · La trưởng", 1, "a"), ("7", "Träumerei · Fa trưởng", 1, "cad"), ("8", "Bên lò sưởi · Fa trưởng", 1, "a"), ("9", "Ngựa gỗ · Đô trưởng", 1, "a"), ("10", "Quá nghiêm trang · Sol♯ thứ", 1, "c"), ("11", "Dọa ma · Mi thứ / Sol trưởng", 1, "c"), ("12", "Thiu thiu ngủ · Mi thứ", 1, "c"), ("13", "Nhà thơ cất lời · Sol trưởng", 1, "coda")], "Chu trình mở và khép ở Sol trưởng; ba bản giọng thứ dồn về gần cuối (10–12), ngay trước lời kết."),
 "g-chopin-etude": form_map("Étude Op. 10 số 3 (Mi trưởng) và số 12 (Đô thứ), gần đúng.", [("Số 3 · A", "Mi trưởng · giai điệu và đệm trong một tay", 2, "a"), ("B", "poco più animato · nốt kép", 1.6, "b"), ("Hợp âm bảy giảm", "", .8, "dev"), ("Con bravura", "quãng sáu kép", .8, "c"), ("Bảy át kéo dài", "dẫn về chủ đề", .8, "cad"), ("A'", "rút gọn · tắt dần", 1.4, "a"), ("Số 12 · Mở đầu", "tay trái đổ xuống", .7, "intro"), ("A", "Đô thứ · quãng tám tay phải", 1.2, "c"), ("B", "chuyển giọng", 1, "dev"), ("A'", "", 1, "c"), ("Coda", "lắng xuống · kết Đô trưởng", .8, "coda")], "Ở số 12, tay trái chạy móc kép gần như không nghỉ từ đầu đến cuối."),
 "g-liebestraum": form_map("Liszt, Liebestraum số 3: một giai điệu hát ba lần, ngăn cách bởi hai cadenza (độ dài các ô gần đúng theo số ô nhịp).", [("A", "La♭ trưởng · giai điệu ở âm vực giữa", 23, "a"), ("Cadenza 1", "nốt nhỏ, không vạch nhịp", 2, "cad"), ("A'", "Si trưởng · più animato con passione", 11, "b"), ("Dồn lên cao trào", "sempre stringendo · quãng tám", 21, "dev"), ("Cadenza 2", "quãng ba gãy đi xuống", 2, "cad"), ("A''", "La♭ trưởng · lắng dần đến kết", 26, "a")]),
 "g-brahms-118-2": form_map("Brahms, Intermezzo Op. 118 số 2: ba đoạn A – B – A (độ dài các ô theo số ô nhịp).", [("A", "La trưởng · ô 1–48", 48, "a"), ("B", "Fa♯ thứ · canon · ô 49–56", 8, "c"), ("Hợp xướng", "Fa♯ trưởng · ô 57–64", 8, "b"), ("B'", "Fa♯ thứ trở lại · ô 65–76", 12, "c"), ("A'", "La trưởng · ô 77–116", 40, "a")], "Đoạn B tự nó cũng là ba đoạn nhỏ: Fa♯ thứ – Fa♯ trưởng – Fa♯ thứ."),
 "g-grieg": form_map("Grieg, Concerto piano cung La thứ (độ dài các ô gần đúng theo thời lượng).", [("I. Trình bày", "La thứ → Đô trưởng", 4, "a"), ("Phát triển", "", 2, "dev"), ("Tái hiện", "chủ đề 2 ở La trưởng", 3, "a"), ("Cadenza", "piano một mình", 2.5, "cad"), ("Coda", "", 1, "coda"), ("II. Adagio", "Rê♭ trưởng", 6.5, "b"), ("III. Halling", "La thứ, 2/4", 3, "c"), ("Chủ đề sáo", "Fa trưởng", 2.5, "b"), ("Halling trở lại", "", 2, "c"), ("Quasi presto", "3/4", 1, "dev"), ("Andante maestoso", "chủ đề sáo, La trưởng", 1.5, "coda")], "Chương II nối thẳng sang chương III."),
 "g-mussorgsky": form_map("Mussorgsky, Những bức tranh ở phòng triển lãm (bản piano): mười bức tranh nối với nhau bằng các Promenade (độ dài các ô gần đúng theo thời lượng).", [("Promenade", "Si♭ trưởng", 1.5, "a"), ("1. Gnomus", "", 2.5, "dev"), ("Promenade", "", .8, "a"), ("2. Lâu đài cổ", "", 4, "b"), ("Promenade", "", .5, "a"), ("3. Tuileries", "", 1, "c"), ("4. Bydło", "", 2.5, "dev"), ("Promenade", "", .7, "a"), ("5. Gà con", "", 1.2, "c"), ("6. Goldenberg và Schmuÿle", "", 2.2, "dev"), ("Promenade", "Ravel bỏ", 1.3, "a"), ("7. Limoges", "", 1.3, "c"), ("8. Catacombae", "", 1.7, "dev"), ("Cum mortuis", "Promenade, giọng thứ", 1.8, "a"), ("9. Baba Yaga", "", 3.3, "dev"), ("10. Cổng lớn Kiev", "Promenade trở lại", 5, "coda")], "Ô màu Promenade là chủ đề “người xem tranh”; Cum mortuis là biến thể của nó."),
}

FIGS = {
    "ranges-orchestra": figure(ranges_svg(RANGES_ORCH, "Âm vực thường dùng (âm thanh thật, gần đúng) của các nhạc cụ trong dàn nhạc, so với bàn phím piano"),
                               "Âm vực thường dùng (âm thanh thật, gần đúng). Đường nét đứt là Đô giữa."),
    "ranges-voices": figure(ranges_svg(RANGES_VOICE, "Âm vực thường dùng của sáu loại giọng hát", 36, 88),
                            "Âm vực thường dùng của các loại giọng (gần đúng; giọng chuyên nghiệp có thể rộng hơn)."),
    "ranges-satb": figure(ranges_svg([("Soprano", "giọng", 60, 79), ("Alto", "giọng", 55, 74), ("Tenor", "giọng", 48, 67), ("Bass", "giọng", 40, 60)], "Âm vực dùng cho bốn bè soprano, alto, tenor, bass trong bài tập hòa âm", 36, 84),
                          "Âm vực an toàn cho bài tập bốn bè: soprano Đô4–Sol5, alto Sol3–Rê5, tenor Đô3–Sol4, bass Mi2–Đô4."),
    "seating": figure(seating_svg(), "Một cách xếp chỗ thường gặp; mỗi dàn nhạc có thể bố trí khác (ví dụ violin 2 ngồi bên phải)."),
    "violin": figure(violin_svg(), "Thế bấm thứ nhất trên violin: tròn vàng là dây buông, tròn xanh là nốt bấm bằng ngón 1–4. Dây buông cách nhau quãng 5."),
    "guitar": figure(guitar_svg(), "Các nốt tự nhiên ở thế bấm thứ nhất trên guitar (dây 1 là dây mảnh nhất, ở trên). Âm thanh thật thấp hơn nốt viết một quãng tám."),
    "modes": figure(keyboard_modes_svg(), "Mỗi điệu thức là gam phím trắng bắt đầu từ một nốt khác. Phím tô màu là nốt bắt đầu."),
    "circle": figure(circle_svg(), "Theo chiều kim đồng hồ: thêm một dấu thăng; ngược chiều: thêm một dấu giáng."),
    "functions": figure(functions_svg(), "Câu chuyện cơ bản của hòa âm: ổn định → rời đi → căng thẳng → trở về."),
    "periods": figure(periods_svg(), "Các mốc năm là quy ước gần đúng; phong cách thay đổi dần dần."),
    "lifespans": figure(lifespans_svg(), "Vòng đời các nhà soạn nhạc từ năm 1650 (thanh kéo dài đến nay: còn sống), màu theo thời kỳ. Các nhà soạn nhạc trước đó (Hildegard, Machaut, Josquin, Palestrina, Monteverdi…) xem ở bảng dòng thời gian và trang các thời kỳ."),
    "bolero": figure(bolero_svg(), "Boléro: âm sắc và cường độ thay đổi, mọi thứ khác gần như đứng yên."),
}
FIGS.update(FORMS)
FIGS.update({"voice-leading": voice_leading_figs(), "counterpoint": counterpoint_svg(), "texture-rolls": texture_figs(), "keymap": keymap_svg(), "beats": beats_svg()})
FIGS.update(PIANO_FIGS)
EXTERNAL = {"keysigs"}   # sinh bởi tools/keysigs.mjs (cần abcjs)

def insert_all(check=False):
    changed = 0
    for root, _, files in os.walk(DOCS):
        for f in files:
            if not f.endswith(".md"): continue
            p = os.path.join(root, f); s = open(p, encoding="utf-8").read(); orig = s
            def rep(m):
                name = m.group(1)
                if name in EXTERNAL: return m.group(0)   # hình do script khác quản lý
                if name not in FIGS: raise KeyError("Hình chưa định nghĩa: %s (trong %s)" % (name, p))
                return "<!-- fig:%s -->\n%s\n<!-- /fig:%s -->" % (name, FIGS[name], name)
            s = re.sub(r"<!-- fig:([\w-]+) -->(?:\n(?:.*?\n)?<!-- /fig:\1 -->)?", rep, s, flags=re.S)
            if s != orig:
                changed += 1
                if check: print("figures: hình trong", os.path.relpath(p, DOCS), "chưa cập nhật; hãy chạy python3 tools/figures.py")
                else: open(p, "w", encoding="utf-8").write(s)
    if check:
        print("figures: mọi hình đã khớp với dữ liệu" if not changed else "figures: %d trang cần sinh lại hình" % changed)
        return changed
    print("figures: đã cập nhật", changed, "trang;", len(FIGS), "hình")

if __name__ == "__main__":
    import sys
    sys.exit(1 if insert_all(check="--check" in sys.argv) else 0)
