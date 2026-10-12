/* Dòng thời gian: vẽ biểu đồ đời sống các nhà soạn nhạc từ bảng có cột "Nhà soạn nhạc | Sinh | Mất | Thời kỳ". */
(function () {
  "use strict";
  const SVGNS = "http://www.w3.org/2000/svg";
  const PERIODS = [
    ["Trung cổ", 1050, 1400], ["Phục hưng", 1400, 1600], ["Baroque", 1600, 1750], ["Cổ điển", 1750, 1820],
    ["Lãng mạn", 1820, 1900], ["Thế kỷ 20", 1900, 2000], ["Đương đại", 2000, 2030]
  ];
  function el(tag, attrs, text) {
    const e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text) e.textContent = text;
    return e;
  }
  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const table = Array.prototype.filter.call((document.querySelector("article") || document).querySelectorAll("table"), function (t) {
      const th = t.querySelector("thead th"); return th && th.textContent.trim() === "Nhà soạn nhạc";
    })[0];
    if (!table) { root.textContent = "Không tìm thấy bảng dữ liệu."; return; }
    const nowY = new Date().getFullYear();
    const rows = Array.prototype.map.call(table.querySelectorAll("tbody tr"), function (tr) {
      const td = tr.querySelectorAll("td");
      const b = parseInt(td[1].textContent, 10), dRaw = td[2].textContent.trim();
      return { name: td[0].textContent.trim(), b: b, d: dRaw ? parseInt(dRaw, 10) : null, p: td[3].textContent.trim() };
    }).filter(function (r) { return !isNaN(r.b); }).sort(function (a, b) { return a.b - b.b; });
    const minY = 1080, maxY = 2030, W = 1100, rowH = 18, top = 34, left = 10;
    const H = top + rows.length * rowH + 20;
    const x = function (y) { return left + (y - minY) / (maxY - minY) * (W - left - 10); };
    const svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "oz-timeline-svg", role: "img", "aria-label": "Dòng thời gian " + rows.length + " nhà soạn nhạc" });
    PERIODS.forEach(function (p, i) {
      svg.appendChild(el("rect", { x: x(p[1]), y: 0, width: x(p[2]) - x(p[1]), height: H, class: "oz-tl-band b" + (i % 2) }));
      svg.appendChild(el("text", { x: (x(p[1]) + x(p[2])) / 2, y: 14, class: "oz-tl-period" }, p[0]));
    });
    for (let y = 1100; y <= 2000; y += 100) {
      svg.appendChild(el("text", { x: x(y), y: 28, class: "oz-tl-year" }, String(y)));
    }
    rows.forEach(function (r, i) {
      const y = top + i * rowH;
      const end = r.d || nowY;
      const g = el("g", { class: "oz-tl-row" });
      const t = el("title", {}, r.name + " (" + r.b + "–" + (r.d || "") + "), " + r.p);
      g.appendChild(t);
      g.appendChild(el("rect", { x: x(r.b), y: y + 3, width: Math.max(3, x(end) - x(r.b)), height: rowH - 6, rx: 3, class: "oz-tl-bar" + (r.d ? "" : " alive") }));
      const label = el("text", { x: x(end) + 5, y: y + rowH - 5, class: "oz-tl-name" }, r.name);
      if (x(end) > W - 150) { label.setAttribute("x", x(r.b) - 5); label.setAttribute("text-anchor", "end"); }
      g.appendChild(label);
      svg.appendChild(g);
    });
    const wrap = document.createElement("div");
    wrap.className = "oz-timeline-wrap";
    wrap.appendChild(svg);
    root.appendChild(wrap);
  }
  function init() { document.querySelectorAll(".oz-timeline").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
