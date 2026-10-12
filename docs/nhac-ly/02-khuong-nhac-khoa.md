# 2. Khuông nhạc và khóa

## Khuông nhạc

**Khuông nhạc** gồm **5 dòng kẻ** song song và **4 khe** giữa chúng. Dòng và khe được **đếm từ dưới lên**: dòng 1 là dòng thấp nhất.

Mỗi nốt được đặt hoặc *trên dòng* (dòng kẻ chạy qua giữa nốt) hoặc *trong khe*. Nốt càng cao trên khuông thì âm càng cao. Đi từ một dòng lên khe ngay trên nó là đi lên **một bậc** tên nốt (ví dụ từ Mi lên Fa).

## Khóa nhạc

Chỉ nhìn khuông thì chưa biết dòng nào là nốt gì. **Khóa nhạc** đặt ở đầu khuông cho biết điều đó.

### Khóa Sol

Khóa Sol (treble clef) có nét xoắn ôm lấy **dòng 2**, đánh dấu rằng nốt trên dòng 2 là **Sol (G4)**. Từ đó suy ra mọi nốt khác. Khóa Sol dùng cho âm cao: tay phải piano, violin, sáo, giọng nữ. Guitar cũng đọc khóa Sol, nhưng âm thực tế thấp hơn một quãng tám so với nốt viết.

Các nốt **trên dòng** khóa Sol, từ dưới lên: **Mi – Sol – Si – Rê – Fa** (E G B D F).

```abc
X:1
L:1/2
K:C
E G B d f |]
```

Các nốt **trong khe** khóa Sol: **Fa – La – Đô – Mi** (F A C E). Trong tiếng Anh, các khe ghép lại thành chữ *FACE*, rất dễ nhớ.

```abc
X:1
L:1/2
K:C
F A c e |]
```

### Khóa Fa

Khóa Fa (bass clef) có hai chấm nằm hai bên **dòng 4**, đánh dấu nốt trên dòng 4 là **Fa (F3)**. Khóa Fa dùng cho âm trầm: tay trái piano, cello, contrabass, giọng nam trầm.

Các nốt **trên dòng** khóa Fa: **Sol – Si – Rê – Fa – La** (G B D F A).

```abc
X:1
L:1/2
K:C clef=bass
G,, B,, D, F, A, |]
```

Các nốt **trong khe** khóa Fa: **La – Đô – Mi – Sol** (A C E G).

```abc
X:1
L:1/2
K:C clef=bass
A,, C, E, G, |]
```

!!! tip "Mẹo nhớ bằng tiếng Anh"
    Dòng khóa Sol: **E**very **G**ood **B**oy **D**oes **F**ine. Khe khóa Sol: **FACE**.
    Dòng khóa Fa: **G**ood **B**oys **D**o **F**ine **A**lways. Khe khóa Fa: **A**ll **C**ows **E**at **G**rass.

## Dòng kẻ phụ

Khi nốt cao hoặc thấp hơn khuông, ta vẽ thêm những đoạn dòng ngắn gọi là **dòng kẻ phụ**. Đọc chúng giống như đọc tiếp dòng và khe bình thường.

Nốt **Đô giữa (C4)** nằm trên **một dòng kẻ phụ ngay dưới khuông khóa Sol**, và cũng là **một dòng kẻ phụ ngay trên khuông khóa Fa**.

## Khuông kép (của piano)

Piano dùng hai khuông nối bằng dấu ngoặc: khóa Sol ở trên cho tay phải, khóa Fa ở dưới cho tay trái. Đô giữa nằm đúng ở giữa hai khuông.

```abc
X:1
L:1/4
M:4/4
%%score {RH LH}
V:RH clef=treble
V:LH clef=bass
K:C
[V:RH] C D E F | G4 |]
[V:LH] C, D, E, F, | G,4 |]
```

## Bài tập

1. Luyện với [công cụ đọc nốt](../luyen-tap/doc-not.md), chọn "Khóa Sol, Trong khuông" đến khi đúng 9/10 lần.
2. Làm tương tự với khóa Fa.
3. Sau đó chọn "Thêm dòng kẻ phụ" để mở rộng phạm vi.
4. Không nhìn bài: trong khóa Sol, nốt trên dòng 3 là gì? Trong khóa Fa, nốt trong khe 1 là gì?

??? success "Đáp án câu 4"
    Khóa Sol, dòng 3 là **Si (B4)**. Khóa Fa, khe 1 là **La (A2)**.
