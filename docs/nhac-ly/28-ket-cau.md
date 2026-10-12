# 28. Kết cấu âm nhạc

**Kết cấu** (texture) mô tả **có bao nhiêu đường nét âm nhạc vang lên cùng lúc và chúng liên hệ với nhau thế nào**. Nó giống như cách dệt của một tấm vải: một sợi, nhiều sợi song song, hay nhiều sợi đan chéo. Đây là một trong những manh mối nhanh nhất để [nhận diện thời kỳ](../nhan-dien/index.md): nghe kết cấu, bạn thường đoán được nhạc thuộc Trung cổ, Baroque hay Cổ điển chỉ sau vài giây.

## Bốn loại kết cấu

Tất cả ví dụ dưới đây dùng cùng một giai điệu (*Frère Jacques*) để bạn chỉ chú ý đến kết cấu.

### Đơn âm (monophony)

**Một giai điệu duy nhất**, không có đệm. Nhiều người cùng hát một giai điệu (kể cả cách nhau quãng 8) vẫn là đơn âm.

```abc
X:1
T:Đơn âm
L:1/8
M:4/4
Q:1/4=100
K:C
C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |]
```

*Gặp ở:* thánh ca Gregorian, Debussy *Syrinx* cho sáo độc tấu, phần mở đầu một fugue (chủ đề vang lên một mình).

### Chủ điệu (homophony)

**Một giai điệu chính** cùng **phần đệm hợp âm**. Phần đệm có thể là những hợp âm cùng tiết tấu với giai điệu (như thánh ca bốn bè), hoặc hình đệm riêng (như bè Alberti của Mozart, hợp âm rải của Chopin).

```abc
X:2
T:Chủ điệu
L:1/8
M:4/4
Q:1/4=100
%%score {M A}
V:M clef=treble
V:A clef=bass
K:C
[V:M] C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |]
[V:A] [C,G,]4 [C,G,]4 | [C,G,]4 [C,G,]4 | [C,G,]4 [B,,G,]4 | [C,G,]4 [B,,G,]4 |]
```

*Gặp ở:* phần lớn nhạc Cổ điển và Lãng mạn, thánh ca, gần như mọi bài hát pop.

### Phức điệu (polyphony)

**Nhiều giai điệu độc lập** vang cùng lúc, bè nào cũng quan trọng. Loại phổ biến nhất là **phức điệu mô phỏng**: các bè lần lượt bắt chước cùng một giai điệu, như canon và fugue.

```abc
X:3
T:Phức điệu (canon hai bè)
L:1/8
M:4/4
Q:1/4=100
%%score (V1 V2)
V:V1 clef=treble
V:V2 clef=treble
K:C
[V:V1] C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |
[V:V2] z8 | z8 | C2D2 E2C2 | C2D2 E2C2 |]
```

*Gặp ở:* nhạc Phục hưng, fugue và invention của Bach, các đoạn phát triển trong giao hưởng.

### Dị âm (heterophony)

**Cùng một giai điệu**, nhưng **mỗi người chơi một phiên bản hơi khác**, có người trang trí thêm, có người giản lược, vang lên cùng lúc. Các bè lúc trùng nhau, lúc tách ra.

```abc
X:4
T:Dị âm
L:1/8
M:4/4
Q:1/4=90
%%score (V1 V2)
V:V1 clef=treble
V:V2 clef=treble
K:C
[V:V1] C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |]
[V:V2] cd d/e/d e2dc | cd d/e/d e2dc | ef f/g/f g4 | ef f/g/f g4 |]
```

*Gặp ở:* **nhạc truyền thống Việt Nam** (đờn ca tài tử, nhã nhạc: các nhạc cụ cùng chơi một bài bản theo cách riêng, xem [trang này](../lich-su/nhac-truyen-thong-viet-nam.md)), gamelan, nhạc Ả Rập; trong nhạc cổ điển phương Tây thì hiếm.

## Nghe kết cấu như thế nào?

1. **Đếm số đường nét độc lập** bạn theo dõi được. Một: đơn âm. Một rõ ràng, các bè khác "đứng sau": chủ điệu. Hai trở lên ngang hàng nhau: phức điệu.
2. **Thử hát theo**: nếu chỉ có một giai điệu để hát, đó là đơn âm hoặc chủ điệu. Nếu bạn phải chọn một trong nhiều giai điệu, đó là phức điệu.
3. **Để ý sự thay đổi**: nhiều tác phẩm đổi kết cấu liên tục. Một fugue bắt đầu đơn âm rồi thành phức điệu; một chương giao hưởng có thể chuyển từ chủ điệu sang phức điệu ở phần phát triển.

Luyện tai bằng [công cụ nhận biết kết cấu](../nhan-dien/luyen-nghe.md).

## Ngoài loại kết cấu: độ dày và âm vực

- **Dày hay mỏng**: bao nhiêu nhạc cụ, bao nhiêu nốt vang cùng lúc.
- **Âm vực**: các bè dồn sát nhau hay trải rộng từ rất trầm đến rất cao (dàn nhạc Lãng mạn cuối thế kỷ 19 thường trải rất rộng).

```quiz
? Một dàn hợp xướng cùng hát một giai điệu, nam và nữ cách nhau quãng 8. Đó là kết cấu gì?
+ Đơn âm
- Chủ điệu
- Phức điệu
> Vẫn chỉ có một giai điệu.
? Bè Alberti của Mozart đệm cho giai điệu tay phải tạo kết cấu gì?
+ Chủ điệu
- Phức điệu
- Dị âm
> Một giai điệu chính và phần đệm.
? Fugue chủ yếu có kết cấu gì?
- Đơn âm
- Chủ điệu
+ Phức điệu
> Nhiều bè độc lập bắt chước nhau.
? Kết cấu nào đặc trưng cho đờn ca tài tử?
+ Dị âm
- Chủ điệu
- Đơn âm
> Các nhạc cụ cùng chơi một bài bản theo cách riêng.
```
