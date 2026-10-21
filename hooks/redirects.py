"""Hook MkDocs: trang chuyển hướng cho các địa chỉ cũ đã đổi chỗ.

Khi một trang chuyển sang địa chỉ mới, thêm một dòng vào REDIRECTS để liên kết
và dấu trang cũ vẫn dùng được. Trang chuyển hướng được ghi sau khi build xong,
nên không có trong mục lục, tìm kiếm hay sitemap (tests/browser.mjs bỏ qua chúng).
"""

import html
import os

from mkdocs.exceptions import PluginError

# Địa chỉ cũ → địa chỉ mới, tương đối với gốc site, kết thúc bằng "/".
REDIRECTS = {
    "nhac-cu/piano/": "piano/",
    "nhac-cu/cach-tap/": "piano/cach-tap/",
    "nhac-cu/mua-dan-chon-thay/": "piano/chon-dan/",
}

PAGE = """<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Trang đã chuyển</title>
<meta name="robots" content="noindex">{canonical}
<meta http-equiv="refresh" content="0; url={rel}">
</head>
<body>
<p>Trang này đã chuyển đến <a href="{rel}">địa chỉ mới</a>.</p>
</body>
</html>
"""


def on_post_build(config, **kwargs):
    site_dir = config["site_dir"]
    site_url = config.get("site_url") or ""
    for old, new in REDIRECTS.items():
        if not os.path.exists(os.path.join(site_dir, new, "index.html")):
            raise PluginError(f"redirects: không có trang đích {new} (cho {old})")
        out = os.path.join(site_dir, old, "index.html")
        if os.path.exists(out):
            raise PluginError(f"redirects: {old} đã là một trang thật; hãy bỏ dòng này khỏi REDIRECTS")
        rel = "../" * len(old.strip("/").split("/")) + new
        canonical = ""
        if site_url:
            canonical = '\n<link rel="canonical" href="' + html.escape(site_url.rstrip("/") + "/" + new) + '">'
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            f.write(PAGE.format(rel=html.escape(rel), canonical=canonical))
