/* Âm học: chuỗi bồi âm (.oz-overtones) và so sánh hệ lên dây (.oz-tuning). */
(function () {
  "use strict";
  const NAMES = ["Đô", "Đô♯", "Rê", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "Si♭", "Si"];
  const LET = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];

  function tone(c, freq, t, dur, gain, type) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.03);
    g.gain.setValueAtTime(gain, t + Math.max(0.05, dur - 0.15));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function nearest(freq) {
    const m = 69 + 12 * Math.log2(freq / 440), r = Math.round(m);
    return { name: NAMES[((r % 12) + 12) % 12] + " (" + LET[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1) + ")", cents: Math.round((m - r) * 100) };
  }

  function mountOvertones(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Âm cơ bản <select data-k="f"><option value="65.406">Đô2 (65,4 Hz)</option><option value="110">La2 (110 Hz)</option><option value="130.81">Đô3 (130,8 Hz)</option></select></label>' +
      '<button class="oz-btn oz-btn--primary" data-act="seq">Nghe lần lượt 1–16</button><button class="oz-btn" data-act="mix">Nghe các bồi âm đã chọn cùng lúc</button></div>' +
      '<div class="oz-ot-grid" role="group" aria-label="Các bồi âm"></div>' +
      '<p class="oz-stats">Bấm vào từng ô để nghe một bồi âm. Đánh dấu nhiều ô rồi nghe cùng lúc để thấy âm sắc thay đổi: cùng một cao độ, nhưng tỉ lệ bồi âm khác nhau cho ra "giọng" khác nhau, giống như sáo và oboe.</p>';
    const grid = root.querySelector(".oz-ot-grid"), sel = root.querySelector('[data-k="f"]');
    function build() {
      const f = Number(sel.value);
      grid.innerHTML = "";
      for (let n = 1; n <= 16; n++) {
        const nr = nearest(f * n);
        const cell = document.createElement("div");
        cell.className = "oz-ot";
        cell.innerHTML = '<label><input type="checkbox" ' + (n <= 4 ? "checked" : "") + ' data-n="' + n + '"> ' + n + '</label>' +
          '<button class="oz-btn" data-play="' + n + '">' + nr.name + '</button>' +
          '<small>' + (f * n).toFixed(1) + " Hz" + (Math.abs(nr.cents) >= 5 ? ", lệch " + (nr.cents > 0 ? "+" : "") + nr.cents + " cent" : "") + "</small>";
        grid.appendChild(cell);
      }
    }
    root.addEventListener("click", function (e) {
      const c = window.OZAudio && OZAudio.getCtx(); if (!c) return;
      const f = Number(sel.value), t = c.currentTime + 0.05;
      const p = e.target.closest("button[data-play]");
      if (p) { tone(c, f * Number(p.dataset.play), t, 1.2, 0.2); return; }
      const a = e.target.closest("button[data-act]"); if (!a) return;
      if (a.dataset.act === "seq") for (let n = 1; n <= 16; n++) tone(c, f * n, t + (n - 1) * 0.45, 0.5, 0.18);
      if (a.dataset.act === "mix") {
        const ns = Array.prototype.map.call(grid.querySelectorAll("input:checked"), function (x) { return Number(x.dataset.n); });
        ns.forEach(function (n) { tone(c, f * n, t, 2.2, 0.25 / Math.max(1, ns.length) / Math.sqrt(n) * 2); });
      }
    });
    sel.addEventListener("change", build);
    build();
  }

  function mountTuning(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const base = 261.63; /* Đô4 */
    const items = [
      ["5 đúng bình quân", base * Math.pow(2, 7 / 12), "700 cent"],
      ["5 đúng thuần (3:2)", base * 3 / 2, "702,0 cent"],
      ["3 trưởng bình quân", base * Math.pow(2, 4 / 12), "400 cent"],
      ["3 trưởng thuần (5:4)", base * 5 / 4, "386,3 cent"]
    ];
    root.innerHTML = '<p class="oz-stats">Mỗi nút phát Đô4 cùng nốt trên trong 3 giây. Hãy nghe kỹ: quãng 3 trưởng bình quân có tiếng "rung" (phách) nhanh, còn quãng thuần đứng yên, trong veo.</p><div class="oz-row"></div>';
    const row = root.querySelector(".oz-row");
    items.forEach(function (it) {
      const b = document.createElement("button");
      b.className = "oz-btn"; b.innerHTML = it[0] + "<small> " + it[2] + "</small>";
      b.addEventListener("click", function () {
        const c = window.OZAudio && OZAudio.getCtx(); if (!c) return;
        const t = c.currentTime + 0.05;
        tone(c, base, t, 3, 0.16, "sawtooth"); tone(c, it[1], t, 3, 0.16, "sawtooth");
      });
      row.appendChild(b);
    });
  }

  window.OZAcoustics = { nearest: nearest };
  function init() {
    document.querySelectorAll(".oz-overtones").forEach(mountOvertones);
    document.querySelectorAll(".oz-tuning").forEach(mountTuning);
  }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
