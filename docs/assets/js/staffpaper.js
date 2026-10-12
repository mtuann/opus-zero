/* Giấy kẻ khuông nhạc in được (.oz-staffpaper). */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  function page(n, kind) {
    /* Trang A4 210 × 297 mm, lề 15 mm */
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 210 297");
    svg.setAttribute("class", "oz-paper-page");
    const top = 18, bottom = 285, left = 15, right = 195, gap = 2; /* khoảng cách dòng 2 mm */
    const per = kind === "grand" ? Math.floor(n / 2) : n;
    const blockH = kind === "grand" ? 8 * gap + 10 : 4 * gap;
    const step = (bottom - top - blockH) / Math.max(1, per - 1);
    for (let s = 0; s < per; s++) {
      const y0 = top + s * step;
      const staves = kind === "grand" ? [y0, y0 + 4 * gap + 10] : [y0];
      staves.forEach(function (y) {
        for (let i = 0; i < 5; i++) {
          const l = document.createElementNS(NS, "line");
          l.setAttribute("x1", left); l.setAttribute("x2", right);
          l.setAttribute("y1", y + i * gap); l.setAttribute("y2", y + i * gap);
          l.setAttribute("stroke", "#000"); l.setAttribute("stroke-width", "0.18");
          svg.appendChild(l);
        }
      });
      if (kind === "grand") {
        [left, right].forEach(function (x) {
          const v = document.createElementNS(NS, "line");
          v.setAttribute("x1", x); v.setAttribute("x2", x); v.setAttribute("y1", y0); v.setAttribute("y2", y0 + 8 * gap + 10);
          v.setAttribute("stroke", "#000"); v.setAttribute("stroke-width", x === left ? "0.35" : "0.18");
          svg.appendChild(v);
        });
      }
    }
    return svg;
  }
  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Loại <select data-k="kind"><option value="single">Khuông đơn</option><option value="grand">Khuông kép (piano)</option></select></label>' +
      '<label>Số khuông mỗi trang <select data-k="n"><option>8</option><option selected>10</option><option>12</option></select></label>' +
      '<button class="oz-btn oz-btn--primary" data-act="print">In giấy kẻ khuông</button></div>' +
      '<div class="oz-print-area oz-paper"></div>';
    const area = root.querySelector(".oz-paper");
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    function draw() { area.innerHTML = ""; area.appendChild(page(Number(ctl("n").value), ctl("kind").value)); }
    root.addEventListener("change", draw);
    root.querySelector('[data-act="print"]').addEventListener("click", function () {
      document.body.classList.add("oz-printing");
      area.classList.add("oz-print-now");
      window.print();
      setTimeout(function () { document.body.classList.remove("oz-printing"); area.classList.remove("oz-print-now"); }, 500);
    });
    draw();
  }
  function init() { document.querySelectorAll(".oz-staffpaper").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
