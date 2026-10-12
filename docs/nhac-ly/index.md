# Nhạc lý

Nhạc lý là "ngữ pháp" của âm nhạc: cách ghi lại âm thanh lên giấy và cách các âm thanh kết hợp với nhau. 14 bài **nền tảng** đi từ con số 0, sau mỗi phần có một bài **ôn tập** tổng hợp, 6 bài **nâng cao**, một bài **âm học**, 7 bài **trung cấp** và 5 bài **nghe hiểu cấu trúc**. Mỗi bài có ví dụ bấm nghe được, bài tập có đáp án, công cụ luyện tập đi kèm và một quiz ngắn ở cuối. Làm xong quiz thì bài được đánh dấu "đã học".

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

## Phần 6: Trung cấp

Dành cho bạn đã vững 20 bài trước. Nên đọc [Âm học cơ bản](am-hoc.md) trước khi bắt đầu.

21. [Hòa âm bốn bè](21-hoa-am-bon-be.md)
22. [Đối âm](22-doi-am.md)
23. [Hợp âm mượn](23-hop-am-muon.md)
24. [Hợp âm Napoli và hợp âm sáu tăng](24-napoli-sau-tang.md)
25. [Bè trầm số](25-be-tram-so.md)
26. [Phân tích một tác phẩm](26-phan-tich.md)
27. [Ký hiệu hợp âm pop và jazz](27-ky-hieu-hop-am.md)

## Phần 7: Nghe hiểu cấu trúc

Năm bài này lấp những mảnh còn thiếu để **nghe hiểu** một tác phẩm thật, và là nền lý thuyết cho mục [Nhận diện](../nhan-dien/index.md). Có thể học ngay sau phần Nâng cao, không cần chờ hết phần Trung cấp.

28. [Kết cấu âm nhạc](28-ket-cau.md)
29. [Chuỗi hòa âm](29-chuoi-hoa-am.md)
30. [Phát triển môtip và cấu trúc câu](30-phat-trien-motip.md)
31. [Hình thức nhỏ](31-hinh-thuc-nho.md)
32. [Kỹ thuật thế kỷ 20](32-ky-thuat-the-ky-20.md)

## Sau 32 bài này thì học gì?

- **Lý thuyết tập hợp** (set theory) và phân tích nhạc vô điệu tính: phần "Twentieth- and Twenty-First-Century Techniques" của [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/).
- **Đối âm nâng cao**: canon, fugue hai và ba bè.
- **Phối khí**: viết cho dàn nhạc, bắt đầu từ việc chép lại một đoạn tổng phổ.
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
