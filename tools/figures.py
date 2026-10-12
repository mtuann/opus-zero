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
            s = re.sub(r"<!-- fig:([\w-]+) -->(?:\n.*?\n<!-- /fig:\1 -->)?", rep, s, flags=re.S)
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
