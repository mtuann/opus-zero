"""Hook MkDocs: tạo các "cuốn sách" in được (site/sach/*.html) từ các trang đã build.

Mỗi cuốn là một trang HTML độc lập: bìa, mục lục, mỗi chương bắt đầu trang mới, khuông nhạc
được vẽ bằng abcjs, quiz chuyển thành câu hỏi in kèm đáp án, đáp án ẩn được mở sẵn,
công cụ tương tác bị lược bỏ, mọi đường dẫn đổi thành địa chỉ đầy đủ để bấm được trong PDF.
Người đọc mở trang và chọn In → Lưu dưới dạng PDF.
"""
import datetime
import html
import os
import re
from urllib.parse import urljoin

L = lambda *names: ["nhac-ly/%s/" % n for n in names]
BOOKS = [
    ("nhac-ly-co-ban", "Nhạc lý cơ bản", "Bài 1–14 và ba bài ôn tập: từ tên nốt đến hòa âm chức năng và ký hiệu biểu diễn.",
     L("01-cao-do-ten-not", "02-khuong-nhac-khoa", "03-truong-do", "04-nhip", "05-dau-hoa", "on-tap-1", "06-gam-truong", "07-gam-thu",
       "08-hoa-bieu", "09-quang", "on-tap-2", "10-hop-am-ba", "11-hop-am-bay", "12-hoa-am-chuc-nang", "13-ket", "14-ky-hieu-bieu-dien", "on-tap-3")),
    ("nhac-ly-nang-cao", "Nhạc lý nâng cao", "Bài 15–32 và âm học: tiết tấu nâng cao, điệu thức, chuyển giọng, hòa âm bốn bè, đối âm, kết cấu, hình thức.",
     L("15-tiet-tau-nang-cao", "16-dieu-thuc-ngu-cung", "17-khoa-do-dich-giong", "18-am-ngoai-hop-am", "19-at-phu-chuyen-giong", "20-doc-tong-pho", "am-hoc",
       "21-hoa-am-bon-be", "22-doi-am", "23-hop-am-muon", "24-napoli-sau-tang", "25-be-tram-so", "26-phan-tich", "27-ky-hieu-hop-am",
       "28-ket-cau", "29-chuoi-hoa-am", "30-phat-trien-motip", "31-hinh-thuc-nho", "32-ky-thuat-the-ky-20")),
    ("tom-tat-thuat-ngu", "Tóm tắt và thuật ngữ", "Tờ tóm tắt nhạc lý và từ điển hơn 100 thuật ngữ.",
     ["bat-dau/tom-tat/", "nhac-ly/tu-dien/"]),
    ("lich-su", "Lịch sử nhạc cổ điển", "Các thời kỳ, nhà soạn nhạc, opera, nhạc cổ điển và nhạc truyền thống Việt Nam.",
     ["lich-su/", "lich-su/thoi-ky/trung-co/", "lich-su/thoi-ky/phuc-hung/", "lich-su/thoi-ky/baroque/", "lich-su/thoi-ky/co-dien/",
      "lich-su/thoi-ky/lang-man/", "lich-su/thoi-ky/the-ky-20/", "lich-su/duong-dai/", "lich-su/nha-soan-nhac/", "lich-su/nu-nha-soan-nhac/",
      "lich-su/opera/", "lich-su/viet-nam/", "lich-su/nhac-truyen-thong-viet-nam/"]),
    ("huong-dan-nghe", "Hướng dẫn nghe", "Cách đọc tên tác phẩm và bản thu, cùng 32 hướng dẫn nghe từng bước, có chỗ để ghi mốc thời gian bằng tay.",
     ["nghe-nhac/doc-ten-tac-pham/"] + ["nghe-nhac/%s/" % n for n in [
         "vivaldi-mua-xuan", "vivaldi-mua-dong", "bach-prelude-c", "bach-cello-1", "bach-air", "handel-hallelujah", "haydn-94", "mozart-40", "mozart-nu-hoang-bong-dem", "mozart-requiem",
         "mozart-eine-kleine", "beethoven-5", "beethoven-op132", "beethoven-moonlight", "schubert-erlkonig", "schubert-ca-hoi", "chopin-nocturne", "mendelssohn-violin", "bizet-habanera",
         "tchaikovsky-ho-thien-nga", "tchaikovsky-1812", "brahms-4", "dvorak-9-largo", "grieg-buoi-sang", "puccini-nessun-dorma", "debussy-clair-de-lune", "rachmaninoff-2", "ravel-bolero",
         "gershwin-rhapsody", "stravinsky-sacre", "shostakovich-5", "part-spiegel"]]),
]
LETTERS = "ABCDEFGH"


def quiz_html(raw, chap):
    qs, cur = [], None
    for line in html.unescape(raw).splitlines():
        line = line.strip()
        if not line:
            continue
        tag, text = line[0], line[1:].strip()
        if tag == "?":
            cur = {"q": text, "opts": [], "why": ""}
            qs.append(cur)
        elif cur and tag in "+-":
            cur["opts"].append((text, tag == "+"))
        elif cur and tag == ">":
            cur["why"] = (cur["why"] + " " + text).strip()
    if not qs:
        return "", ""
    body = ['<div class="book-quiz"><p><strong>Kiểm tra nhanh</strong> <span class="muted">(đáp án ở cuối chương)</span></p><ol>']
    keys = []
    for i, q in enumerate(qs, 1):
        body.append("<li>%s<ol type=\"A\">%s</ol></li>" % (html.escape(q["q"]), "".join("<li>%s</li>" % html.escape(o[0]) for o in q["opts"])))
        right = [LETTERS[j] for j, o in enumerate(q["opts"]) if o[1]]
        keys.append("<li><strong>%d. %s</strong>%s</li>" % (i, ", ".join(right), (" — " + html.escape(q["why"])) if q["why"] else ""))
    body.append("</ol></div>")
    return "".join(body), '<div class="book-answers"><p><strong>Đáp án kiểm tra nhanh</strong></p><ol class="plain">%s</ol></div>' % "".join(keys)


def clean(article, url, chap, site_url):
    a = article
    a = re.sub(r'<a [^>]*class="md-content__button[^"]*"[^>]*>.*?</a>', "", a, flags=re.S)
    a = re.sub(r'<a class="headerlink"[^>]*>.*?</a>', "", a, flags=re.S)
    a = re.sub(r'<div class="oz-placement">.*?</div>', "", a, flags=re.S)
    answers = []

    def q(m):
        body, key = quiz_html(m.group(1), chap)
        if key:
            answers.append(key)
        return body
    a = re.sub(r'<div class="oz-quiz">(.*?)</div>', q, a, flags=re.S)
    # Tiêu đề chỉ dẫn tới một công cụ tương tác (không in được): bỏ cả tiêu đề và công cụ
    a = re.sub(r'<h2[^>]*>(?:(?!</h2>).)*</h2>\s*(?:<p>(?:(?!</p>).)*</p>\s*)?<div class="oz-[\w-]+"[^>]*>\s*</div>', "", a, flags=re.S)
    a = re.sub(r'<div class="oz-[\w-]+"(?: [^>]*)?>\s*</div>', "", a)
    a = re.sub(r"<details([^>]*)>", r"<details\1 open>", a)
    # id và đường dẫn: thêm tiền tố chương để không trùng, đổi link tương đối thành địa chỉ đầy đủ
    a = re.sub(r'id="([^"]+)"', lambda m: 'id="c%d-%s"' % (chap, m.group(1)), a)

    def href(m):
        h = html.unescape(m.group(1))
        if h.startswith("#"):
            return 'href="#c%d-%s"' % (chap, h[1:])
        if re.match(r"^[a-z]+:", h):
            return 'href="%s"' % html.escape(h)
        return 'href="%s"' % html.escape(urljoin(site_url + url, h))
    a = re.sub(r'href="([^"]*)"', href, a)
    return a + "".join(answers)


TEMPLATE = """<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Opus Zero</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,600;1,400&family=Literata:opsz,wght@7..72,600&display=swap" rel="stylesheet">
<style>
:root {{ --ink:#1f3a5f; --muted:#555; --line:#ccc; }}
* {{ box-sizing: border-box; }}
body {{ font-family: "Be Vietnam Pro", system-ui, sans-serif; color:#111; line-height:1.55; max-width: 46rem; margin: 0 auto; padding: 1.5rem; font-size: 11pt; }}
h1, h2, h3 {{ font-family: "Literata", Georgia, serif; color: var(--ink); line-height:1.25; }}
h1 {{ font-size: 1.7rem; }} h2 {{ font-size: 1.25rem; margin-top: 1.6rem; }} h3 {{ font-size: 1.05rem; }}
a {{ color: var(--ink); }}
table {{ border-collapse: collapse; width: 100%; margin: 0.8rem 0; font-size: 0.92em; }}
th, td {{ border: 1px solid var(--line); padding: 0.3rem 0.45rem; text-align: left; vertical-align: top; }}
th {{ background: #f2f4f7; }}
code {{ font-size: 0.9em; }}
.admonition, details {{ border-left: 4px solid var(--ink); background: #f6f8fb; padding: 0.4rem 0.8rem; margin: 0.8rem 0; }}
.admonition-title, summary {{ font-weight: 600; }}
.oz-fig {{ display: block; width: 100%; height: auto; margin: 0.4rem 0; }} .oz-fig-circle {{ max-width: 70mm; margin: 0.4rem auto; }}
figure {{ margin: 0.8rem 0 1.1rem; break-inside: avoid; }} figcaption {{ font-size: 0.85em; color: var(--muted); margin-top: 0.25rem; }}
.oz-fig-wide {{ max-width: 100%; }} .oz-fig-mid {{ max-width: 90mm; }} .oz-print-only {{ display: block; }}
.oz-form-map {{ display: flex; flex-wrap: wrap; gap: 2px; width: 100%; break-inside: avoid; }}
.oz-seg {{ display: flex; flex-direction: column; justify-content: center; padding: 0.25rem; min-height: 11mm; border-radius: 4px; font-size: 0.78em; text-align: center; line-height: 1.2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
.oz-seg small {{ font-size: 0.85em; opacity: .8; }} 
.k-a {{ background: #a9c7e8; }} .k-b {{ background: #f1d9a0; }} .k-c {{ background: #e9b3a6; }} .k-dev {{ background: #c9b6dd; }} .k-cad {{ background: #b6dcc1; }} .k-coda {{ background: #d6d6d6; }} .k-intro, .k-x {{ background: #ececec; }}
.oz-anatomy {{ display: flex; flex-wrap: wrap; gap: 0.3rem; }} .oz-anatomy span {{ display: flex; flex-direction: column; border-radius: 6px; padding: 0.3rem 0.5rem; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
.oz-anatomy i {{ font-style: normal; font-size: 0.75em; }} .p1 {{ background: #a9c7e8; }} .p2 {{ background: #f1d9a0; }} .p3 {{ background: #e9b3a6; }} .p4 {{ background: #c9b6dd; }} .p5 {{ background: #b6dcc1; }} .p6 {{ background: #e3e3e3; }}
.oz-ks-grid {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.3rem; }} .oz-ks {{ display: flex; flex-direction: column; align-items: center; border: 1px solid var(--line); border-radius: 6px; padding: 0.2rem; font-size: 0.8em; break-inside: avoid; }} .oz-ks-svg {{ width: 100%; height: auto; }} .oz-ks-n {{ align-self: flex-end; font-size: 0.8em; color: var(--muted); }}
.oz-fig-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }}
.abc-notation {{ margin: 0.6rem 0 1rem; white-space: pre; font-family: monospace; font-size: 0; }}
.abc-notation svg {{ font-size: initial; max-width: 100%; }}
.book-quiz {{ border: 1px solid var(--line); padding: 0.5rem 1rem; margin: 1rem 0; }}
.book-quiz ol ol {{ margin: 0.2rem 0 0.5rem; }}
.book-answers {{ font-size: 0.9em; border-top: 2px solid var(--line); margin-top: 1.4rem; padding-top: 0.4rem; }}
ol.plain {{ list-style: none; padding-left: 0; }}
.muted {{ color: var(--muted); font-weight: 400; }}
.cover {{ min-height: 60vh; display: flex; flex-direction: column; justify-content: center; border-bottom: 3px double var(--ink); margin-bottom: 1.5rem; }}
.cover h1 {{ font-size: 2.6rem; margin: 0.2rem 0; }}
.toc ol {{ columns: 2; column-gap: 2rem; }}
.chapter {{ break-before: page; }}
.toolbar {{ position: sticky; top: 0; background: #fff; border-bottom: 1px solid var(--line); padding: 0.5rem 0; margin-bottom: 1rem; z-index: 2; }}
.toolbar button {{ font: inherit; padding: 0.45rem 0.9rem; border-radius: 8px; border: 1px solid var(--ink); background: var(--ink); color: #fff; cursor: pointer; }}
.toolbar button[disabled] {{ opacity: 0.5; cursor: wait; }}
@media print {{
  body {{ max-width: none; padding: 0; }}
  .toolbar {{ display: none; }}
  a {{ text-decoration: none; }}
  h2, h3 {{ break-after: avoid; }}
  table, .abc-notation, .book-quiz, .admonition, details {{ break-inside: avoid; }}
  .toc {{ break-after: page; }}
  @page {{ size: A4; margin: 15mm 14mm; }}
}}
</style></head>
<body>
<div class="toolbar"><button id="print" disabled>Đang vẽ khuông nhạc…</button> <span class="muted">Chọn “Lưu dưới dạng PDF” trong hộp thoại in để có file PDF.</span></div>
<section class="cover"><p class="muted">Opus Zero</p><h1>{title}</h1><p>{desc}</p>
<p class="muted">Bản in ngày {date} · {chapters} chương · Bản trực tuyến: <a href="{site}">{site}</a></p></section>
<nav class="toc"><h2>Mục lục</h2><ol>{toc}</ol></nav>
{body}
<script src="../assets/js/vendor/abcjs-basic-min.js"></script>
<script>
(function () {{
  var btn = document.getElementById("print");
  function done() {{ document.body.setAttribute("data-ready", "1"); btn.disabled = false; btn.textContent = "In / Lưu PDF"; }}
  try {{
    if (window.ABCJS) document.querySelectorAll(".abc-notation").forEach(function (el) {{
      var src = el.textContent.trim(); el.textContent = "";
      ABCJS.renderAbc(el, src, {{ responsive: "resize", foregroundColor: "#000", paddingleft: 0, paddingright: 0 }});
    }});
  }} catch (e) {{ console.error(e); }}
  done();
  btn.addEventListener("click", function () {{ window.print(); }});
}})();
</script>
</body></html>
"""


def on_post_build(config, **kwargs):
    site_dir = config["site_dir"]
    site_url = config.get("site_url") or "/"
    out_dir = os.path.join(site_dir, "sach")
    os.makedirs(out_dir, exist_ok=True)
    today = datetime.date.today().strftime("%d/%m/%Y")
    for book_id, title, desc, pages in BOOKS:
        toc, parts = [], []
        for i, url in enumerate(pages, 1):
            path = os.path.join(site_dir, url, "index.html")
            if not os.path.exists(path):
                raise FileNotFoundError("books: không tìm thấy trang %s cho sách %s" % (url, book_id))
            src = open(path, encoding="utf-8").read()
            m = re.search(r'<article class="md-content__inner md-typeset">(.*?)</article>', src, re.S)
            if not m:
                raise ValueError("books: không đọc được nội dung %s" % url)
            h1 = re.search(r"<h1[^>]*>(.*?)</h1>", m.group(1), re.S)
            name = re.sub(r"<[^>]+>", "", h1.group(1)).replace("¶", "").strip() if h1 else url
            toc.append('<li><a href="#chuong-%d">%s</a></li>' % (i, html.escape(name)))
            parts.append('<section class="chapter" id="chuong-%d">%s</section>' % (i, clean(m.group(1), url, i, site_url)))
        page = TEMPLATE.format(title=html.escape(title), desc=html.escape(desc), date=today, chapters=len(pages),
                               site=html.escape(site_url), toc="".join(toc), body="\n".join(parts))
        with open(os.path.join(out_dir, book_id + ".html"), "w", encoding="utf-8") as f:
            f.write(page)
