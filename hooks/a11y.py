"""Hook MkDocs: vá nhỏ về trợ năng (a11y) cho HTML của trang.

pymdownx.tasklist (custom_checkbox) sinh ô đánh dấu
`<label class="task-list-control"><input type="checkbox" disabled/>…</label>`
không có nhãn. Trong HTML tĩnh, ô bị khóa và chỉ để trang trí, nên được ẩn khỏi
trình đọc màn hình (chữ của mục vẫn được đọc bình thường). Khi JavaScript chạy,
docs/assets/js/practice.js mở khóa ô, bỏ thuộc tính ẩn, gắn nhãn bằng chữ của mục
và lưu trạng thái đã đánh dấu. Nhờ vậy quy tắc "label" của axe không báo lỗi ở cả hai trường hợp.

Hộp tìm kiếm của Material là `<div class="md-search" role="dialog">` không có tên (quy tắc
"aria-dialog-name" của Lighthouse và axe), và ô ẩn `<input id="__search">` bật/tắt hộp này cũng không
có tên (quy tắc "label" của axe; trên trình duyệt ô bị ẩn nhưng vẫn nên có tên): thêm aria-label="Tìm kiếm"
vào cả hai, ở mọi trang.
"""
import re

_OPEN = '<label class="task-list-control">'


def on_page_content(html, **kwargs):
    if _OPEN not in html:
        return html
    return html.replace(_OPEN, '<label class="task-list-control" aria-hidden="true">')


_SEARCH = re.compile(r'(<div class="md-search"[^>]*role="dialog"|<input class="md-toggle" data-md-toggle="search")(?![^>]*aria-label)')


def on_post_page(output, **kwargs):
    return _SEARCH.sub(r'\1 aria-label="Tìm kiếm"', output, count=2)


def on_post_template(output, template_name, **kwargs):
    """Trang 404 dựng từ template tĩnh, không qua on_post_page."""
    return on_post_page(output) if template_name == "404.html" else output
