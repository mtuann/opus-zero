"""Hook MkDocs: mô tả ngắn cho từng trang (công cụ tìm kiếm, ảnh xem trước khi chia sẻ link).

Trang không khai báo `description` ở phần đầu sẽ lấy đoạn văn đầu tiên đủ dài, bỏ thẻ HTML
và cắt ở khoảng 160 ký tự. Material dùng mô tả này cho <meta name="description">;
overrides/main.html dùng nó cho các thẻ Open Graph và Twitter.
"""
import html as _html
import re

_P = re.compile(r"<p\b[^>]*>(.*?)</p>", re.S)


def _text(fragment):
    t = _html.unescape(re.sub(r"<[^>]+>", "", fragment))
    return re.sub(r"\s+", " ", t).strip()


def describe(content, limit=160):
    for m in _P.finditer(content):
        t = _text(m.group(1))
        if len(t) < 60:
            continue
        if len(t) <= limit:
            return t
        return t[:limit].rsplit(" ", 1)[0].rstrip(",;:–-") + "…"
    return ""


def on_page_content(html, page, **kwargs):
    if not page.is_homepage and not page.meta.get("description"):
        d = describe(html)
        if d:
            page.meta["description"] = d
    return html
