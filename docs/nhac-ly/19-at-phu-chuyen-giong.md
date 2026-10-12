# 19. Át phụ và chuyển giọng

Ở [bài 12](12-hoa-am-chuc-nang.md), hợp âm V kéo mạnh về I. Bài này mở rộng ý tưởng đó: **mọi hợp âm** đều có thể có một "hợp âm V của riêng nó", và từ đó âm nhạc có thể **chuyển hẳn sang giọng mới**.

## Át phụ

Lấy hợp âm **V của Sol trưởng** (là Rê trưởng, D) và chèn nó trước hợp âm G trong một bản nhạc ở Đô trưởng. Hợp âm D chứa **Fa♯**, nốt không có trong Đô trưởng, nhưng nó đóng vai **cảm âm tạm thời** kéo lên Sol. Ta gọi D là **át phụ** của V, ký hiệu **V/V** (đọc: "năm của năm").

```abc
X:1
T:I – V/V – V – I trong Đô trưởng (D7 là át phụ của G)
L:1/2
M:4/2
Q:1/2=60
K:C
[C,EGc] [D,^FAc] [G,DGB] [C,EGc] |]
```

Tương tự, có thể có **V/ii, V/iii, V/IV, V/vi**: hợp âm át của bất kỳ hợp âm trưởng hoặc thứ nào trong giọng.

| Át phụ | Trong Đô trưởng | Dẫn đến | Nốt "lạ" |
|---|---|---|---|
| V/V | D hoặc D7 | G | Fa♯ |
| V/vi | E hoặc E7 | Am | Sol♯ |
| V/ii | A hoặc A7 | Dm | Đô♯ |
| V/IV | C7 | F | Si♭ |

Ngoài hợp âm V, **hợp âm vii°** (hoặc vii°7) cũng có thể làm "át phụ": hợp âm **cảm âm phụ**. Ví dụ **vii°/V** trong Đô trưởng là Fa♯ – La – Đô (hoặc Fa♯ – La – Đô – Mi♭, hợp âm bảy giảm), dẫn về G vì Fa♯ là cảm âm của Sol.

**Mẹo nhận ra át phụ:** khi thấy một **dấu hóa bất thường** xuất hiện rồi biến mất ngay, đặc biệt là một nốt thăng đi lên nửa cung, rất có thể đó là cảm âm của một át phụ.

Át phụ làm hợp âm đích được **"chủ âm hóa" tạm thời** (tonicization): trong một khoảnh khắc, G nghe như chủ âm, rồi nhạc vẫn ở Đô trưởng.

## Chuyển giọng

Khi giọng mới được **khẳng định đủ lâu**, thường bằng một kết trọn ở giọng mới, ta nói bản nhạc đã **chuyển giọng** (modulation).

### Giọng gần

Các giọng **chỉ khác 0–1 dấu hóa** là giọng gần, chuyển qua lại rất tự nhiên. Với Đô trưởng, các giọng gần là: Sol trưởng (giọng át), Fa trưởng (giọng hạ át), La thứ (song song), Mi thứ, Rê thứ. Trên [vòng quãng năm](../luyen-tap/vong-quang-nam.md), chúng là hàng xóm của nhau.

### Chuyển giọng qua hợp âm chung

Cách mượt nhất: tìm một hợp âm **thuộc cả hai giọng** làm "bản lề" (pivot chord).

Ví dụ Đô trưởng → Sol trưởng: hợp âm **Am** là vi của Đô trưởng và cũng là ii của Sol trưởng.

```abc
X:1
T:Đô trưởng → Sol trưởng qua hợp âm chung Am
L:1/2
M:4/2
Q:1/2=66
K:C
[C,EGc] [F,FAc] [A,EAc] [D,D^FA] | [G,DGB]4 |]
```

Đọc theo hai giọng:

| Hợp âm | C | F | **Am** | D | G |
|---|---|---|---|---|---|
| Đô trưởng | I | IV | **vi** | | |
| Sol trưởng | | | **ii** | V | I |

### Chuyển giọng trực tiếp

Đôi khi nhạc đổi giọng **đột ngột**, không cần bản lề, thường ở chỗ bắt đầu câu mới. Ví dụ nổi tiếng: nhiều bài hát pop "nâng tông" lên nửa cung ở điệp khúc cuối. Trong nhạc cổ điển, đầu phần phát triển của [Mozart Giao hưởng số 40](../nghe-nhac/mozart-40.md) chuyển đột ngột sang một giọng rất xa.

## Bản đồ giọng gần

<!-- fig:keymap -->
<figure class="oz-figure"><svg class="oz-fig oz-fig-mid" viewBox="0 0 460 204" role="img" aria-label="Năm giọng gần của Đô trưởng: Sol trưởng và Fa trưởng (cạnh nhau trên vòng quãng năm) cùng ba giọng thứ song song La thứ, Mi thứ, Rê thứ" xmlns="http://www.w3.org/2000/svg" font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"><line x1="90" y1="50" x2="230" y2="50" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><line x1="230" y1="50" x2="370" y2="50" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><line x1="90" y1="150" x2="230" y2="150" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><line x1="230" y1="150" x2="370" y2="150" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><line x1="90" y1="50" x2="90" y2="150" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><line x1="230" y1="50" x2="230" y2="150" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><line x1="370" y1="50" x2="370" y2="150" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><rect x="34" y="28" width="112" height="44" rx="10" fill="#a9c7e8" stroke="#1b1b1b" stroke-opacity=".3"/><text x="90.0" y="47.0" font-size="10" text-anchor="middle" font-weight="700" fill="#1b1b1b">Fa trưởng</text><text x="90.0" y="62.0" font-size="8" text-anchor="middle" font-weight="400" fill="#1b1b1b">1♭</text><rect x="174" y="28" width="112" height="44" rx="10" fill="#f1d9a0" stroke="#1b1b1b" stroke-opacity=".3"/><text x="230.0" y="47.0" font-size="10" text-anchor="middle" font-weight="700" fill="#1b1b1b">Đô trưởng</text><text x="230.0" y="62.0" font-size="8" text-anchor="middle" font-weight="400" fill="#1b1b1b">giọng chính</text><rect x="314" y="28" width="112" height="44" rx="10" fill="#a9c7e8" stroke="#1b1b1b" stroke-opacity=".3"/><text x="370.0" y="47.0" font-size="10" text-anchor="middle" font-weight="700" fill="#1b1b1b">Sol trưởng</text><text x="370.0" y="62.0" font-size="8" text-anchor="middle" font-weight="400" fill="#1b1b1b">1♯</text><rect x="34" y="128" width="112" height="44" rx="10" fill="#c9b6dd" stroke="#1b1b1b" stroke-opacity=".3"/><text x="90.0" y="147.0" font-size="10" text-anchor="middle" font-weight="700" fill="#1b1b1b">Rê thứ</text><text x="90.0" y="162.0" font-size="8" text-anchor="middle" font-weight="400" fill="#1b1b1b">1♭</text><rect x="174" y="128" width="112" height="44" rx="10" fill="#c9b6dd" stroke="#1b1b1b" stroke-opacity=".3"/><text x="230.0" y="147.0" font-size="10" text-anchor="middle" font-weight="700" fill="#1b1b1b">La thứ</text><text x="230.0" y="162.0" font-size="8" text-anchor="middle" font-weight="400" fill="#1b1b1b">không dấu</text><rect x="314" y="128" width="112" height="44" rx="10" fill="#c9b6dd" stroke="#1b1b1b" stroke-opacity=".3"/><text x="370.0" y="147.0" font-size="10" text-anchor="middle" font-weight="700" fill="#1b1b1b">Mi thứ</text><text x="370.0" y="162.0" font-size="8" text-anchor="middle" font-weight="400" fill="#1b1b1b">1♯</text><text x="230.0" y="196.0" font-size="8.5" text-anchor="middle" font-weight="400" fill="currentColor" fill-opacity="0.75">Hàng trên: trưởng · hàng dưới: thứ song song · mỗi giọng khác giọng chính nhiều nhất 1 dấu hóa</text></svg><figcaption>Chuyển giữa các giọng gần nghe tự nhiên vì chỉ đổi một dấu hóa. Giọng xa (ví dụ Fa♯ trưởng, 6 thăng) tạo cảm giác bất ngờ.</figcaption></figure>
<!-- /fig:keymap -->

## Chuyển giọng trong hình thức sonata

Đây là lý do hình thức sonata vận hành được: phần trình bày **chuyển sang giọng át** (hoặc giọng trưởng song song nếu ở giọng thứ) cho chủ đề 2, tạo xung đột giữa hai giọng; phần tái hiện đưa chủ đề 2 **về giọng chính**, giải quyết xung đột đó.

## Bài tập viết

1. Trong Sol trưởng, V/V là hợp âm gì? Nó chứa nốt "lạ" nào?
2. Tìm một hợp âm chung giữa Đô trưởng và Fa trưởng.
3. Nghe chương 1 [Mozart Giao hưởng số 40](../nghe-nhac/mozart-40.md): giọng của chủ đề 2 ở phần trình bày là gì?

??? success "Đáp án"
    1. A (La – Đô♯ – Mi), nốt lạ là Đô♯, cảm âm tạm thời của Rê.
    2. Ví dụ Dm (ii của Đô trưởng, vi của Fa trưởng), hoặc C (I của Đô, V của Fa), hoặc F (IV của Đô, I của Fa).
    3. Si♭ trưởng, giọng trưởng song song của Sol thứ.

```quiz
? V/V trong Đô trưởng là hợp âm gì?
+ D (Rê trưởng)
- G (Sol trưởng)
- Dm (Rê thứ)
> Hợp âm át của G là D.
? Dấu hiệu thường gặp của át phụ trên bản nhạc là gì?
+ Một dấu hóa bất thường xuất hiện rồi biến mất ngay
- Hóa biểu thay đổi
- Số chỉ nhịp thay đổi
> Thường là cảm âm tạm thời.
? Hợp âm Am thuộc những giọng nào sau đây?
+ Cả Đô trưởng (vi) và Sol trưởng (ii)
- Chỉ La thứ
- Chỉ Đô trưởng
> Đó là hợp âm chung để chuyển giọng.
? Giọng nào là giọng gần của Đô trưởng?
+ Sol trưởng
- Mi trưởng
- Fa♯ trưởng
> Chỉ khác một dấu hóa.
```

## Nguồn

- [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/); [musictheory.net](https://www.musictheory.net/lessons).
- Xem [tài liệu tham khảo](../tai-lieu-tham-khao.md).
