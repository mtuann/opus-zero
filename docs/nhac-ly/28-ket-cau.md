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

## Nhìn thấy kết cấu

<!-- fig:texture-rolls -->
<figure class="oz-figure"><div class="oz-fig-grid"><svg class="oz-fig" viewBox="0 0 300 92" role="img" aria-label="Piano roll: Đơn âm" xmlns="http://www.w3.org/2000/svg" font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"><rect x="0" y="0" width="300" height="78" rx="6" fill="currentColor" fill-opacity=".04"/><rect x="6.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="24.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="42.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="60.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="78.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="96.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="114.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="132.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="150.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="168.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="186.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="222.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="240.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="258.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><text x="150.0" y="90.0" font-size="9" text-anchor="middle" font-weight="700" fill="currentColor">Đơn âm</text></svg><svg class="oz-fig" viewBox="0 0 300 92" role="img" aria-label="Piano roll: Chủ điệu" xmlns="http://www.w3.org/2000/svg" font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"><rect x="0" y="0" width="300" height="78" rx="6" fill="currentColor" fill-opacity=".04"/><rect x="6.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="24.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="42.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="60.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="78.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="96.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="114.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="132.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="150.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="168.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="186.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="222.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="240.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="258.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="6.0" y="69.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="6.0" y="61.1" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="6.0" y="55.0" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="42.0" y="69.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="42.0" y="61.1" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="42.0" y="55.0" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="78.0" y="69.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="78.0" y="61.1" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="78.0" y="55.0" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="114.0" y="69.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="114.0" y="61.1" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="114.0" y="55.0" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="150.0" y="69.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="150.0" y="61.1" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="150.0" y="55.0" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="186.0" y="79.7" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="186.0" y="71.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="186.0" y="65.3" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="222.0" y="69.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="222.0" y="61.1" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="222.0" y="55.0" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="258.0" y="79.7" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="258.0" y="71.4" width="35.0" height="5" rx="1.5" fill="#b5832a"/><rect x="258.0" y="65.3" width="35.0" height="5" rx="1.5" fill="#b5832a"/><text x="150.0" y="90.0" font-size="9" text-anchor="middle" font-weight="700" fill="currentColor">Chủ điệu</text></svg><svg class="oz-fig" viewBox="0 0 300 92" role="img" aria-label="Piano roll: Phức điệu (canon)" xmlns="http://www.w3.org/2000/svg" font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"><rect x="0" y="0" width="300" height="78" rx="6" fill="currentColor" fill-opacity=".04"/><rect x="6.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="24.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="42.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="60.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="78.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="96.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="114.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="132.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="150.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="168.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="186.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="222.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="240.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="258.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="150.0" y="69.4" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="168.0" y="65.3" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="186.0" y="61.1" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="204.0" y="69.4" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="222.0" y="69.4" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="240.0" y="65.3" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="258.0" y="61.1" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="276.0" y="69.4" width="17.0" height="5" rx="1.5" fill="#b5832a"/><text x="150.0" y="90.0" font-size="9" text-anchor="middle" font-weight="700" fill="currentColor">Phức điệu (canon)</text></svg><svg class="oz-fig" viewBox="0 0 300 92" role="img" aria-label="Piano roll: Dị âm" xmlns="http://www.w3.org/2000/svg" font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"><rect x="0" y="0" width="300" height="78" rx="6" fill="currentColor" fill-opacity=".04"/><rect x="6.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="24.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="42.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="60.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="78.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="96.0" y="40.6" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="114.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="132.0" y="44.7" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="150.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="168.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="186.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="222.0" y="36.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="240.0" y="34.4" width="17.0" height="5" rx="1.5" fill="#2f5582"/><rect x="258.0" y="30.3" width="35.0" height="5" rx="1.5" fill="#2f5582"/><rect x="6.0" y="20.0" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="15.0" y="15.9" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="19.5" y="20.0" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="24.0" y="15.9" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="33.0" y="11.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="37.5" y="15.9" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="42.0" y="11.7" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="51.0" y="7.6" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="55.5" y="11.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="60.0" y="20.0" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="69.0" y="15.9" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="73.5" y="20.0" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="78.0" y="20.0" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="87.0" y="15.9" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="91.5" y="20.0" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="96.0" y="15.9" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="105.0" y="11.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="109.5" y="15.9" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="114.0" y="11.7" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="123.0" y="7.6" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="127.5" y="11.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="132.0" y="20.0" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="141.0" y="15.9" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="145.5" y="20.0" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="150.0" y="11.7" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="159.0" y="7.6" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="163.5" y="11.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="168.0" y="9.7" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="177.0" y="5.6" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="181.5" y="9.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="186.0" y="5.6" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="204.0" y="1.4" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="213.0" y="5.6" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="222.0" y="11.7" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="231.0" y="7.6" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="235.5" y="11.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="240.0" y="9.7" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="249.0" y="5.6" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="253.5" y="9.7" width="3.5" height="5" rx="1.5" fill="#b5832a"/><rect x="258.0" y="5.6" width="17.0" height="5" rx="1.5" fill="#b5832a"/><rect x="276.0" y="1.4" width="8.0" height="5" rx="1.5" fill="#b5832a"/><rect x="285.0" y="5.6" width="8.0" height="5" rx="1.5" fill="#b5832a"/><text x="150.0" y="90.0" font-size="9" text-anchor="middle" font-weight="700" fill="currentColor">Dị âm</text></svg></div><figcaption>Cùng một giai điệu (xanh) trong bốn kết cấu, vẽ dạng piano roll: trục ngang là thời gian, trục dọc là cao độ. Màu vàng là phần thêm vào: hợp âm đệm, bè thứ hai vào sau, hoặc bản trang trí vang cùng lúc.</figcaption></figure>
<!-- /fig:texture-rolls -->

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
