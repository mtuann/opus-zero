"""Hook MkDocs: cho phép tìm kiếm tiếng Việt không dấu.

Sau khi build, thêm vào chỉ mục tìm kiếm (site/search/search_index.json) một bản không dấu
của tiêu đề và nội dung mỗi mục, để gõ "hop am" cũng tìm ra "hợp âm". Bản không dấu của tiêu đề
được thêm vào cả trường tiêu đề (trong thẻ ẩn), để tiêu đề vẫn được ưu tiên khi gõ không dấu.
Nội dung hiển thị trên trang không thay đổi.
"""
import json
import os
import re
import unicodedata


def fold(text: str) -> str:
    text = text.replace("đ", "d").replace("Đ", "D")
    text = unicodedata.normalize("NFD", text)
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def on_post_build(config, **kwargs):
    path = os.path.join(config["site_dir"], "search", "search_index.json")
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        index = json.load(f)
    for doc in index.get("docs", []):
        title = doc.get("title", "")
        text = re.sub(r"<[^>]+>", " ", doc.get("text", ""))
        ftitle, ftext = fold(re.sub(r"<[^>]+>", " ", title)), fold(text)
        if ftitle != title or ftext != text:
            # Tiêu đề không dấu được lặp lại để giữ thứ hạng gần với tìm kiếm có dấu (tiêu đề được ưu tiên).
            extra = (ftitle + " ") * 3 + ftext
            doc["text"] = doc.get("text", "") + " <span hidden>" + extra + "</span>"
        if ftitle != re.sub(r"<[^>]+>", " ", title):
            # Thêm cả vào trường tiêu đề (ẩn khi hiển thị) để gõ không dấu vẫn được ưu tiên như tiêu đề có dấu;
            # khoảng trắng sau thẻ mở để từ đầu tiên không dính vào thẻ khi tách từ.
            doc["title"] = title + " <span hidden> " + ftitle + " </span>"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))
