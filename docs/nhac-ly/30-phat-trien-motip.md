# 30. Phát triển môtip và cấu trúc câu

Làm sao một ý tưởng vài nốt có thể trở thành cả một chương giao hưởng? Câu trả lời là **phát triển môtip**: lấy một ý tưởng ngắn rồi biến đổi nó theo những cách có hệ thống. Hiểu các kỹ thuật này, bạn sẽ nghe ra "logic" trong nhạc Beethoven, Brahms, và nhận ra vì sao nhạc của họ nghe chặt chẽ đến vậy.

## Môtip là gì?

**Môtip** là ý tưởng âm nhạc **ngắn nhất còn nhận ra được**: vài nốt với một tiết tấu và đường nét đặc trưng. Ví dụ nổi tiếng nhất: bốn nốt mở đầu [Giao hưởng số 5 của Beethoven](../nghe-nhac/beethoven-5.md).

```abc
X:1
T:Môtip gốc
L:1/8
M:2/4
Q:1/2=100
K:Cm
z G G G | E4 |]
```

## Tám cách biến đổi

| Kỹ thuật | Làm gì | Ví dụ với môtip trên |
|---|---|---|
| **Nhắc lại** | Lặp nguyên vẹn | Sol Sol Sol Mi♭, lặp lại |
| **Chuỗi** | Lặp ở cao độ khác (xem [bài 29](29-chuoi-hoa-am.md)) | Fa Fa Fa Rê (Beethoven làm đúng như vậy ở ô nhịp 3–5) |
| **Đảo** | Lật ngược hướng: đi xuống thành đi lên | Sol Sol Sol **Si** (đi lên quãng 3 thay vì đi xuống) |
| **Ngược** | Chơi từ cuối về đầu | Mi♭ Sol Sol Sol |
| **Nới rộng** (augmentation) | Kéo dài trường độ, thường gấp đôi | Mỗi nốt dài gấp đôi, nghe trang trọng hơn |
| **Thu hẹp** (diminution) | Rút ngắn trường độ | Nhanh gấp đôi, nghe gấp gáp |
| **Chia nhỏ** (fragmentation) | Chỉ giữ một mảnh | Chỉ còn "Sol Sol Sol" lặp lại |
| **Đổi quãng** | Giữ tiết tấu, đổi khoảng cách | Sol Sol Sol **Đô** (nhảy xuống quãng 5) |

```abc
X:2
T:Chuỗi, đảo, nới rộng, chia nhỏ
L:1/8
M:2/4
Q:1/2=100
K:Cm
"^chuỗi" z F F F | D4 | "^đảo" z G G G | =B4 | "^nới rộng" z2 G2 | G2 G2 | E4- | E4 | "^chia nhỏ" z G G G | z G G G | z G G G | G4 |]
```

Trong chương 1 Giao hưởng số 5, Beethoven dùng gần như tất cả các kỹ thuật này. Phần phát triển (xem [Hình thức sonata](../hinh-thuc/sonata.md)) đặc biệt dùng nhiều **chia nhỏ**: môtip bị cắt ngắn dần, chuyền qua lại giữa các bè, căng thẳng tăng dần.

## Cấu trúc câu nhạc: "câu" và "đoạn"

Ở [bài 13](13-ket.md), bạn đã gặp **đoạn nhạc** (period): câu hỏi kết nửa, câu trả lời kết trọn. Nhạc Cổ điển còn một cấu trúc phổ biến không kém, gọi là **câu** (sentence), thường dài 8 ô nhịp:

| Phần | Ô nhịp | Nội dung |
|---|---|---|
| **Trình bày** (presentation) | 1–4 | Một **ý cơ bản** 2 ô nhịp, rồi **nhắc lại** ngay (có thể ở hợp âm khác) |
| **Tiếp nối** (continuation) | 5–8 | **Chia nhỏ** ý cơ bản thành mảnh ngắn hơn, nhịp điệu dồn dập hơn, rồi kết bằng một **kết** |

Ví dụ kinh điển: 8 ô nhịp mở đầu Sonata piano số 1 của Beethoven, Op. 2 số 1 (Fa thứ): một hợp âm rải đi lên 2 ô nhịp, nhắc lại ở hợp âm át, rồi các mảnh ngắn dần dồn tới kết nửa.

**So sánh:** đoạn nhạc nghe như **hỏi – đáp**; câu nghe như **nói – nhắc lại – rồi dồn tới**.

## Mở rộng câu nhạc

Nhà soạn nhạc hay "kéo dài" một câu để tạo bất ngờ hoặc nhấn mạnh: **kéo dài trước kết** (lặp lại hợp âm tiền át), **kết lừa** rồi làm lại (xem [bài 13](13-ket.md)), hoặc thêm một **đoạn đuôi** (codetta) sau kết. Khi nghe một câu nhạc dài hơn 8 ô nhịp "bình thường", hãy tìm xem đoạn nào được thêm vào.

## Bài tập

1. Lấy môtip đầu của *Ode to Joy* (Mi Mi Fa Sol) và viết bản đảo, bản ngược, bản nới rộng.
2. Nghe 8 ô nhịp đầu Beethoven Op. 2 số 1, đếm: ý cơ bản, nhắc lại, rồi chia nhỏ.

??? success "Đáp án câu 1"
    Đảo (bắt đầu từ Mi): Mi Mi Rê Đô. Ngược: Sol Fa Mi Mi. Nới rộng: Mi Mi Fa Sol với mỗi nốt dài gấp đôi.

```quiz
? Lật ngược hướng của các quãng trong môtip gọi là gì?
+ Đảo
- Ngược
- Chuỗi
> Đi xuống thành đi lên và ngược lại.
? Chỉ giữ lại một mảnh của môtip và lặp lại nó gọi là gì?
- Nới rộng
+ Chia nhỏ
- Đổi quãng
> Kỹ thuật yêu thích của Beethoven ở phần phát triển.
? Trong cấu trúc "câu", phần trình bày gồm những gì?
+ Một ý cơ bản và lần nhắc lại của nó
- Câu hỏi và câu trả lời
- Chủ đề 1 và chủ đề 2
> Phần tiếp nối mới chia nhỏ và dẫn tới kết.
? Kéo dài trường độ của môtip gọi là gì?
+ Nới rộng
- Thu hẹp
- Chuỗi
> Augmentation.
```
