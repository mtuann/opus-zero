# Nhạc lý

Nhạc lý là "ngữ pháp" của âm nhạc: cách ghi lại âm thanh lên giấy và cách các âm thanh kết hợp với nhau. Các bài dưới đây đi từ con số 0, mỗi bài có ví dụ bấm nghe được và bài tập cuối bài.

## Phần 1 · Đọc nhạc

1. [Cao độ và tên nốt](01-cao-do-ten-not.md)
2. [Khuông nhạc và khóa](02-khuong-nhac-khoa.md)
3. [Trường độ và dấu lặng](03-truong-do.md)
4. [Nhịp và số chỉ nhịp](04-nhip.md)
5. [Cung, nửa cung và dấu hóa](05-dau-hoa.md)

## Phần 2 · Gam và giọng

6. [Gam trưởng](06-gam-truong.md)
7. Gam thứ — *sắp viết*
8. Hóa biểu và vòng quãng năm — *sắp viết*
9. Quãng — *sắp viết*

## Phần 3 · Hợp âm và hòa âm

10. Hợp âm ba — *sắp viết*
11. Hợp âm bảy và thể đảo — *sắp viết*
12. Hòa âm chức năng — *sắp viết*
13. Kết (cadence) — *sắp viết*

## Phần 4 · Ký hiệu biểu diễn

14. Tốc độ, sắc thái và cách diễn tấu — *sắp viết*

!!! tip "Cách viết thêm bài mới"
    Mỗi bài là một file Markdown trong thư mục `docs/nhac-ly/`. Muốn có khuông nhạc phát được âm thanh, viết một khối mã với ngôn ngữ `abc`, ví dụ:

    ````
    ```abc
    X:1
    L:1/4
    K:C
    C D E F | G4 |]
    ```
    ````

    Cú pháp ABC xem tại [abcnotation.com](https://abcnotation.com/learn). Nhớ thêm bài vào mục `nav` trong `mkdocs.yml`.
