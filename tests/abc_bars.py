"""Kiểm tra độ dài từng ô nhịp trong mọi khối ```abc của docs/ (và các đoạn tổng hợp nếu truyền file JSON)."""
import re, glob, json, sys
from fractions import Fraction as F

def parse_len(s, i):
    # duration after a note: digits, '/', digits
    m = re.match(r'(\d*)(/*)(\d*)', s[i:])
    num, slashes, den = m.group(1), m.group(2), m.group(3)
    i += len(m.group(0))
    v = F(int(num)) if num else F(1)
    if slashes:
        d = int(den) if den else 2 ** len(slashes)
        v = v / d
    return v, i

def bar_lengths(body, L):
    s = re.sub(r'"[^"]*"', '', body)       # annotations / chord symbols
    s = re.sub(r'![^!]*!', '', s)           # decorations
    s = re.sub(r'\[[A-Z]:[^\]]*\]', '', s)  # inline fields
    bars, cur, i, trip = [], F(0), 0, 0
    while i < len(s):
        c = s[i]
        if c == '(' and i+1 < len(s) and s[i+1].isdigit():
            trip = int(s[i+1]); i += 2; continue
        if c in '|:]' or c == '[' and i+1 < len(s) and s[i+1] in '|12':
            j = i
            while j < len(s) and s[j] in '|:]12[': j += 1
            if '|' in s[i:j]:
                bars.append(cur); cur = F(0)
            i = j; continue
        if c == '[':  # chord
            j = s.index(']', i)
            inner = s[i+1:j]
            m = re.match(r"[_^=]*[A-Ga-gz][,']*", inner)
            k = m.end() if m else 0
            dur_in, _ = parse_len(inner, k)
            d, i = parse_len(s, j+1)
            val = L * dur_in * d
            if trip:
                val = val * F(2, 3); trip -= 1
            cur += val; continue
        if c in '_^=':
            i += 1; continue
        if c in 'ABCDEFGabcdefgzx':
            i += 1
            while i < len(s) and s[i] in ",'": i += 1
            d, i = parse_len(s, i)
            val = L * d
            if trip:
                val = val * F(2, 3); trip -= 1
            cur += val; continue
        i += 1
    if cur: bars.append(cur)
    return bars

def check(abc, name):
    L = F(1, 8); M = None; voices = {}; probs = []
    lines = abc.split('\n')
    for ln in lines:
        if re.match(r'^L:', ln): L = F(ln[2:].strip())
        elif re.match(r'^M:', ln):
            v = ln[2:].strip(); M = None if v in ('none', '') else (F(4,4) if v == 'C' else F(v))
    if M is None: return []
    body = [ln for ln in lines if not re.match(r'^[A-Za-z]:', ln) and not ln.startswith('%%') and ln.strip()]
    for ln in body:
        mv = re.match(r'^\[V:([^\]]+)\]\s*(.*)$', ln)
        key = mv.group(1) if mv else '_'
        txt = mv.group(2) if mv else ln
        voices.setdefault(key, []).append(txt)
    for v, parts in voices.items():
        bl = bar_lengths(' '.join(parts), L)
        for bi, b in enumerate(bl):
            if b != M and not (bi == 0 and b < M) and not (bi == len(bl)-1 and b < M):
                probs.append(f"{name} voice {v} bar {bi+1}: {b} != {M}")
    return probs

allp = []
import os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
for f in sorted(glob.glob(os.path.join(ROOT, '**', '*.md'), recursive=True)):
    txt = open(f).read()
    for n, blk in enumerate(re.findall(r'```abc\n(.*?)```', txt, re.S)):
        allp += check(blk, os.path.relpath(f, ROOT) + f"#{n+1}")
if len(sys.argv) > 1:
    ex = json.load(open(sys.argv[1]))
    for k, a in ex.items(): allp += check(a, "EX:" + k)
print("\n".join(allp) if allp else "abc_bars: mọi ô nhịp đều đúng độ dài")
sys.exit(1 if allp else 0)
