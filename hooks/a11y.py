"""Hook MkDocs: vá nhỏ về trợ năng (a11y) cho HTML sinh từ Markdown.

pymdownx.tasklist (custom_checkbox) sinh ô đánh dấu
`<label class="task-list-control"><input type="checkbox" disabled/>…</label>`
không có nhãn. Trong HTML tĩnh, ô bị khóa và chỉ để trang trí, nên được ẩn khỏi
trình đọc màn hình (chữ của mục vẫn được đọc bình thường). Khi JavaScript chạy,
docs/assets/js/practice.js mở khóa ô, bỏ thuộc tính ẩn, gắn nhãn bằng chữ của mục
và lưu trạng thái đã đánh dấu. Nhờ vậy quy tắc "label" của axe không báo lỗi ở cả hai trường hợp.
"""

_OPEN = '<label class="task-list-control">'


def on_page_content(html, **kwargs):
    if _OPEN not in html:
        return html
    return html.replace(_OPEN, '<label class="task-list-control" aria-hidden="true">')
