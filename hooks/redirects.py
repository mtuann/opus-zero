"""Hook MkDocs: trang chuyển hướng cho các địa chỉ cũ đã đổi chỗ.

Khi một trang chuyển sang địa chỉ mới, thêm một dòng vào REDIRECTS để liên kết
và dấu trang cũ vẫn dùng được. Trang chuyển hướng được ghi sau khi build xong,
nên không có trong mục lục, tìm kiếm hay sitemap (tests/browser.mjs bỏ qua chúng).
"""

import html
import os

from mkdocs.exceptions import PluginError

# Địa chỉ cũ → địa chỉ mới, tương đối với gốc site, kết thúc bằng "/".
# Địa chỉ mới có thể kèm "#mục" để đưa thẳng tới công cụ đã được gộp vào trang khác.
REDIRECTS = {
    "nghe-nhac/bach-prelude-c/": "piano/tac-pham/bach-prelude-do/",
    "nghe-nhac/chopin-nocturne/": "piano/tac-pham/chopin-nocturne-op9-2/",
    "nghe-nhac/debussy-clair-de-lune/": "piano/tac-pham/debussy-clair-de-lune/",
    "bat-dau/lo-trinh/": "bat-dau/lo-trinh-nghe/#nhanh-nhac-ly",
    "luyen-tap/quang/": "luyen-tai/nghe-quang/#luyen-voi-cong-cu",
    "luyen-tap/hop-am/": "luyen-tai/nghe-hop-am/#luyen-voi-cong-cu",
    "luyen-tap/gam/": "luyen-tai/nghe-gam/#luyen-voi-cong-cu",
    "luyen-tap/vong-quang-nam/": "luyen-tap/hoa-bieu/#vong-quang-nam",
    "luyen-tap/giay-ke-khuong/": "luyen-tap/phieu-bai-tap/#giay-ke-khuong",
    "luyen-tap/pho-am-thanh/": "nhac-ly/am-hoc/#am-sac",
    "luyen-tap/len-day/": "luyen-tap/hat-lai/#may-len-day",
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
        page, _, anchor = new.partition("#")
        target = os.path.join(site_dir, page, "index.html")
        if not os.path.exists(target):
            raise PluginError(f"redirects: không có trang đích {page} (cho {old})")
        if anchor:
            with open(target, encoding="utf-8") as f:
                if f'id="{anchor}"' not in f.read():
                    raise PluginError(f"redirects: trang {page} không có mục #{anchor} (cho {old})")
        out = os.path.join(site_dir, old, "index.html")
        if os.path.exists(out):
            raise PluginError(f"redirects: {old} đã là một trang thật; hãy bỏ dòng này khỏi REDIRECTS")
        rel = "../" * len(old.strip("/").split("/")) + new
        canonical = ""
        if site_url:
            canonical = '\n<link rel="canonical" href="' + html.escape(site_url.rstrip("/") + "/" + page) + '">'
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            f.write(PAGE.format(rel=html.escape(rel), canonical=canonical))
