# 22. Đối âm

**Đối âm** (counterpoint) là nghệ thuật viết **nhiều giai điệu độc lập** cùng lúc mà vẫn hòa hợp. Nếu [hòa âm bốn bè](21-hoa-am-bon-be.md) nghĩ theo chiều **dọc** (hợp âm), thì đối âm nghĩ theo chiều **ngang** (từng giai điệu). Đây là ngôn ngữ của nhạc Phục hưng và của [fugue](../hinh-thuc/fugue.md).

## Fux và "năm loại đối âm"

Năm 1725, nhà soạn nhạc Áo Johann Joseph Fux xuất bản *Gradus ad Parnassum*, giáo trình đối âm viết dưới dạng đối thoại thầy trò. Haydn, Mozart, Beethoven đều học từ cuốn sách này, và đến nay nó vẫn được dùng. Phương pháp: cho sẵn một giai điệu chậm, nốt tròn, gọi là **cantus firmus** (CF), rồi viết thêm một bè, tăng dần độ phức tạp qua **năm loại** (species):

| Loại | Bè đối âm so với CF | Học được |
|---|---|---|
| 1 | **Một nốt** chống một nốt | Chỉ dùng thuận tai; chuyển động giữa hai bè |
| 2 | **Hai nốt** chống một | Nốt lướt nghịch tai ở phách yếu |
| 3 | **Bốn nốt** chống một | Giai điệu linh hoạt, nốt thêu, nốt lướt |
| 4 | Nốt **lệch phách**, nối qua vạch nhịp | **Nốt treo** (xem [bài 18](18-am-ngoai-hop-am.md)) |
| 5 | **Tự do** (florid), kết hợp tất cả | Giai điệu như một bè thật |

## Quy tắc của loại 1

1. Chỉ dùng quãng **thuận**: 1, 3, 5, 6, 8 (trưởng, thứ hoặc đúng). Quãng 4 tính là nghịch khi đứng trên bè dưới.
2. **Bắt đầu và kết thúc** bằng quãng đúng (1, 5 hoặc 8); kết thúc bằng quãng 8 hoặc đồng âm.
3. **Cấm quãng 5 và quãng 8 song song**; tránh đi tới quãng đúng bằng chuyển động cùng chiều.
4. Ưu tiên **chuyển động ngược** và quãng 3, quãng 6 (nhưng không quá ba quãng 3 hoặc 6 liên tiếp).
5. Giai điệu chủ yếu đi **bước liền**; bước nhảy lớn nên đổi hướng ngay sau đó.
6. Gần cuối, nâng cảm âm để tạo kết (ở điệu Dorian trên Rê: Đô thành **Đô♯**).

## Ví dụ: đối âm loại 1 trên cantus firmus của Fux

Cantus firmus bên dưới là giai điệu ở điệu Dorian trên Rê mà Fux dùng làm ví dụ đầu tiên trong sách. Bè trên do site viết theo các quy tắc ở trên.

```abc
X:1
T:Đối âm loại 1 (bè trên) trên cantus firmus Dorian
L:1/1
M:2/2
Q:1/2=100
%%score (CP CF)
V:CP clef=treble name="Đối âm"
V:CF clef=treble name="CF"
K:C
[V:CP] A | d | c | d | B | d | c | e | d | ^c | d |]
[V:CF] D | F | E | D | G | F | A | G | F | E | D |]
```

Đọc quãng giữa hai bè từ trái sang phải: **5** – 6 – 6 – **8** – 3 – 6 – 3 – 6 – 6 – 6 – **8**. Quãng đúng ở đầu và cuối, giữa bài chủ yếu là quãng 3 và 6, và các quãng 8 đều được đến bằng chuyển động ngược.

Cùng ví dụ trên, vẽ thành hai đường để thấy quãng và kiểu chuyển động:

<!-- fig:counterpoint -->
<figure class="oz-figure"><svg class="oz-fig oz-fig-wide" viewBox="0 0 632 178" role="img" aria-label="Đối âm loại 1: bè đối âm (đỏ) trên cantus firmus (xanh); số giữa hai bè là quãng, quãng đúng tô vàng; hàng dưới là kiểu chuyển động giữa hai nốt liên tiếp" xmlns="http://www.w3.org/2000/svg" font-family="Be Vietnam Pro, DejaVu Sans, sans-serif"><line x1="50" y1="77.0" x2="50" y2="126.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="56.0" y="104.5" font-size="10" text-anchor="start" font-weight="700" fill="#b5832a">5</text><line x1="102" y1="42.0" x2="102" y2="105.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="108.0" y="76.5" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">6</text><line x1="154" y1="56.0" x2="154" y2="112.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="160.0" y="87.0" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">6</text><line x1="206" y1="42.0" x2="206" y2="126.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="212.0" y="87.0" font-size="10" text-anchor="start" font-weight="700" fill="#b5832a">8</text><line x1="258" y1="63.0" x2="258" y2="91.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="264.0" y="80.0" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">3</text><line x1="310" y1="42.0" x2="310" y2="105.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="316.0" y="76.5" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">6</text><line x1="362" y1="56.0" x2="362" y2="77.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="368.0" y="69.5" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">3</text><line x1="414" y1="28.0" x2="414" y2="91.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="420.0" y="62.5" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">6</text><line x1="466" y1="42.0" x2="466" y2="105.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="472.0" y="76.5" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">6</text><line x1="518" y1="49.0" x2="518" y2="112.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="524.0" y="83.5" font-size="10" text-anchor="start" font-weight="700" fill="currentColor">6</text><line x1="570" y1="42.0" x2="570" y2="126.0" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="576.0" y="87.0" font-size="10" text-anchor="start" font-weight="700" fill="#b5832a">8</text><text x="76.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#999">cùng chiều</text><text x="128.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#999">cùng chiều</text><text x="180.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#2e7d4f">ngược</text><text x="232.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#2e7d4f">ngược</text><text x="284.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#2e7d4f">ngược</text><text x="336.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#2e7d4f">ngược</text><text x="388.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#2e7d4f">ngược</text><text x="440.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#999">cùng chiều</text><text x="492.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#999">cùng chiều</text><text x="544.0" y="168.0" font-size="7.5" text-anchor="middle" font-weight="600" fill="#2e7d4f">ngược</text><polyline points="50,77.0 102,42.0 154,56.0 206,42.0 258,63.0 310,42.0 362,56.0 414,28.0 466,42.0 518,49.0 570,42.0" fill="none" stroke="#b3412e" stroke-width="2"/><circle cx="50" cy="77.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="50.0" y="80.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">La</text><circle cx="102" cy="42.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="102.0" y="45.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><circle cx="154" cy="56.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="154.0" y="59.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Đô</text><circle cx="206" cy="42.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="206.0" y="45.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><circle cx="258" cy="63.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="258.0" y="66.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Si</text><circle cx="310" cy="42.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="310.0" y="45.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><circle cx="362" cy="56.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="362.0" y="59.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Đô</text><circle cx="414" cy="28.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="414.0" y="31.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Mi</text><circle cx="466" cy="42.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="466.0" y="45.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><circle cx="518" cy="49.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="518.0" y="52.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Đô♯</text><circle cx="570" cy="42.0" r="9" fill="#fff" stroke="#b3412e" stroke-width="1.6"/><text x="570.0" y="45.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><polyline points="50,126.0 102,105.0 154,112.0 206,126.0 258,91.0 310,105.0 362,77.0 414,91.0 466,105.0 518,112.0 570,126.0" fill="none" stroke="#2f5582" stroke-width="2"/><circle cx="50" cy="126.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="50.0" y="129.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><circle cx="102" cy="105.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="102.0" y="108.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Fa</text><circle cx="154" cy="112.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="154.0" y="115.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Mi</text><circle cx="206" cy="126.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="206.0" y="129.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><circle cx="258" cy="91.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="258.0" y="94.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Sol</text><circle cx="310" cy="105.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="310.0" y="108.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Fa</text><circle cx="362" cy="77.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="362.0" y="80.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">La</text><circle cx="414" cy="91.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="414.0" y="94.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Sol</text><circle cx="466" cy="105.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="466.0" y="108.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Fa</text><circle cx="518" cy="112.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="518.0" y="115.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Mi</text><circle cx="570" cy="126.0" r="9" fill="#fff" stroke="#2f5582" stroke-width="1.6"/><text x="570.0" y="129.0" font-size="6.5" text-anchor="middle" font-weight="600" fill="#1b1b1b">Rê</text><text x="36.0" y="80.0" font-size="8" text-anchor="end" font-weight="700" fill="#b3412e">Đối âm</text><text x="36.0" y="129.0" font-size="8" text-anchor="end" font-weight="700" fill="#2f5582">CF</text></svg><figcaption>Số giữa hai bè: quãng (vàng = quãng đúng, chỉ ở đầu, cuối và khi đến bằng chuyển động ngược). Hàng dưới: kiểu chuyển động; chuyển động ngược (xanh lá) chiếm phần lớn.</figcaption></figure>
<!-- /fig:counterpoint -->

## Bài tập viết

1. Viết một bè đối âm loại 1 **dưới** cantus firmus trên (bè dưới bắt đầu bằng Rê, quãng 8 hoặc đồng âm).
2. Viết đối âm loại 2 (hai nốt trắng chống một nốt tròn) trên cùng cantus firmus. Nốt ở phách yếu có thể nghịch nếu là nốt lướt.
3. Hát một bè trong khi chơi bè kia trên [bàn phím piano](../luyen-tap/ban-phim.md).

```quiz
? Trong đối âm loại 1, quãng nào được tính là nghịch so với bè dưới?
+ Quãng 4
- Quãng 6
- Quãng 3
> Quãng 4 nghịch khi bè dưới là nền.
? Đối âm loại 4 dạy về điều gì?
+ Nốt treo
- Hợp âm bảy
- Tiết tấu liên ba
> Nốt lệch phách, nối qua vạch nhịp, rồi giải quyết xuống.
? Ai viết Gradus ad Parnassum (1725)?
- Bach
+ Johann Joseph Fux
- Mozart
> Giáo trình đối âm kinh điển.
? Đối âm loại 1 nên bắt đầu và kết thúc bằng quãng gì?
+ Quãng đúng (1, 5, 8)
- Quãng 3
- Quãng 6
> Kết thúc bằng quãng 8 hoặc đồng âm.
```

## Nguồn

- [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/); [musictheory.net](https://www.musictheory.net/lessons).
- Xem [tài liệu tham khảo](../tai-lieu-tham-khao.md).
