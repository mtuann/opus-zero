# Nhạc lý

Nhạc lý là "ngữ pháp" của âm nhạc: cách ghi lại âm thanh lên giấy và cách các âm thanh kết hợp với nhau. 14 bài **nền tảng** đi từ con số 0, sau mỗi phần có một bài **ôn tập** tổng hợp, và 6 bài **nâng cao** dành cho khi đã vững nền tảng. Mỗi bài có ví dụ bấm nghe được, bài tập có đáp án, công cụ luyện tập đi kèm và một quiz ngắn ở cuối. Làm xong quiz thì bài được đánh dấu "đã học".

Chưa biết bắt đầu từ đâu? Làm [bài kiểm tra đầu vào](../bat-dau/kiem-tra-dau-vao.md).

<div class="oz-lesson-status" markdown>

## Phần 1: Đọc nhạc

1. [Cao độ và tên nốt](01-cao-do-ten-not.md)
2. [Khuông nhạc và khóa](02-khuong-nhac-khoa.md)
3. [Trường độ và dấu lặng](03-truong-do.md)
4. [Nhịp và số chỉ nhịp](04-nhip.md)
5. [Cung, nửa cung và dấu hóa](05-dau-hoa.md)

[Ôn tập 1: Đọc nhạc](on-tap-1.md)

## Phần 2: Gam và giọng

6. [Gam trưởng](06-gam-truong.md)
7. [Gam thứ](07-gam-thu.md)
8. [Hóa biểu và vòng quãng năm](08-hoa-bieu.md)
9. [Quãng](09-quang.md)

[Ôn tập 2: Gam và giọng](on-tap-2.md)

## Phần 3: Hợp âm và hòa âm

10. [Hợp âm ba](10-hop-am-ba.md)
11. [Hợp âm bảy và thể đảo](11-hop-am-bay.md)
12. [Hòa âm chức năng](12-hoa-am-chuc-nang.md)
13. [Kết và câu nhạc](13-ket.md)

## Phần 4: Biểu diễn

14. [Ký hiệu biểu diễn](14-ky-hieu-bieu-dien.md)

[Ôn tập 3: Hợp âm, hòa âm và biểu diễn](on-tap-3.md)

## Phần 5: Nâng cao

15. [Tiết tấu nâng cao](15-tiet-tau-nang-cao.md)
16. [Điệu thức và gam ngũ cung](16-dieu-thuc-ngu-cung.md)
17. [Khóa Đô và dịch giọng](17-khoa-do-dich-giong.md)
18. [Âm ngoài hợp âm](18-am-ngoai-hop-am.md)
19. [Át phụ và chuyển giọng](19-at-phu-chuyen-giong.md)
20. [Đọc tổng phổ](20-doc-tong-pho.md)

</div>

Tra cứu và ôn thuật ngữ ở [từ điển thuật ngữ](tu-dien.md).

## Sau 20 bài này thì học gì?

- **Hòa âm bốn bè**: viết hợp âm cho soprano – alto – tenor – bass theo quy tắc dẫn bè. Tài liệu: phần hòa âm trong [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/).
- **Đối âm** (counterpoint): viết nhiều giai điệu độc lập cùng lúc, nền tảng để hiểu Bach. Kinh điển: *Gradus ad Parnassum* của Fux.
- **Hòa âm nửa cung và hòa âm thế kỷ 20**: hợp âm Napoli, hợp âm sáu tăng, gam toàn cung, nhạc 12 âm.
- **Phân tích tác phẩm**: chọn một sonata của Mozart hoặc Beethoven, tìm hình thức, giọng và hợp âm của từng đoạn.

!!! tip "Cách viết thêm bài mới"
    Mỗi bài là một file Markdown trong thư mục `docs/nhac-ly/`. Muốn có khuông nhạc phát được âm thanh, viết một khối mã với ngôn ngữ `abc`. Muốn có quiz, viết một khối mã với ngôn ngữ `quiz`:

    ````
    ```abc
    X:1
    L:1/4
    K:C
    C D E F | G4 |]
    ```

    ```quiz
    ? Câu hỏi
    + Đáp án đúng
    - Đáp án sai
    > Giải thích hiện ra khi trả lời đúng
    ```
    ````

    Muốn chèn bàn phím piano có tô sẵn nốt: `<div class="oz-piano" data-range="C4-C5" data-notes="C4 E4 G4"></div>`. Nhớ thêm bài vào mục `nav` trong `mkdocs.yml`.
