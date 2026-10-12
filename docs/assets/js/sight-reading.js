/* Đọc nhạc thị tấu: sinh giai điệu ngẫu nhiên 4 ô nhịp để hát hoặc đàn, rồi nghe đáp án. */
(function () {
  "use strict";
  const T = function () { return window.OZTheory; };
  /* Giá trị bậc của chủ âm: quãng tám * 7 + chữ cái */
  const KEYS = { C: { v: 28, n: 0 }, G: { v: 32, n: 1 }, F: { v: 31, n: -1 }, D: { v: 29, n: 2 }, Bb: { v: 34, n: -2 } };

  function noteOf(v, n) {
    const l = ((v % 7) + 7) % 7;
    return { l: l, a: T().keyAccidentals(n)[l], o: Math.floor(v / 7) };
  }

  function gen(keyName, level) {
    const k = KEYS[keyName];
    const lo = k.v - 2, hi = Math.min(k.v + (level >= 2 ? 9 : 5), 40); /* không vượt quá La5 */
    const durSets = { 1: [[1], [1], [2]], 2: [[1], [1], [2], [0.5, 0.5]], 3: [[1], [2], [0.5, 0.5], [1.5, 0.5], [3]] };
    const bars = [];
    let v = k.v + [0, 2, 4][Math.floor(Math.random() * 3)];
    for (let b = 0; b < 4; b++) {
      const bar = [];
      let left = 4;
      if (b === 3) { /* ô cuối: đi về chủ âm */
        const pre = Math.random() < 0.5 ? k.v + 1 : k.v - 1;
        bar.push([pre >= lo ? pre : k.v + 1, 2]);
        bar.push([k.v, 2]);
        bars.push(bar);
        break;
      }
      while (left > 0) {
        const fits = durSets[level].filter(function (d) {
          const len = d.reduce(function (a, c) { return a + c; }, 0);
          return len <= left && !(len === 1.5 + 0.5 && left !== 4 && left !== 2) && !(len === 3 && left !== 4);
        });
        const d = fits[Math.floor(Math.random() * fits.length)];
        d.forEach(function (dur) {
          bar.push([v, dur]);
          const r = Math.random();
          let step = r < 0.55 ? (Math.random() < 0.5 ? 1 : -1) : r < 0.8 ? (Math.random() < 0.5 ? 2 : -2) : r < 0.9 ? 0 : (Math.random() < 0.5 ? 4 : -3);
          if (level === 1 && Math.abs(step) > 2) step = step > 0 ? 2 : -2;
          v = Math.max(lo, Math.min(hi, v + step));
          left -= dur;
        });
      }
      bars.push(bar);
    }
    return { key: keyName, n: k.n, bars: bars };
  }

  function toAbc(m) {
    return m.bars.map(function (bar) {
      let t = 0, out = "", prevE = null, prevT = 0;
      bar.forEach(function (x) {
        const e = Math.round(x[1] * 2);
        const tok = T().abc(noteOf(x[0], m.n), false) + (e === 1 ? "" : String(e));
        const beam = prevE === 1 && e === 1 && Math.floor(prevT) === Math.floor(t);
        out += (out && !beam ? " " : "") + tok;
        prevE = e; prevT = t; t += x[1];
      });
      return out;
    }).join(" | ") + " |]";
  }

  function mount(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Giọng <select data-k="key"><option value="C">Đô trưởng</option><option value="G">Sol trưởng</option><option value="F">Fa trưởng</option><option value="D">Rê trưởng</option><option value="Bb">Si♭ trưởng</option></select></label>' +
      '<label>Cấp độ <select data-k="level"><option value="1">1: đen, trắng, bước gần</option><option value="2">2: thêm móc đơn, nhảy quãng</option><option value="3">3: thêm chấm dôi</option></select></label>' +
      '<label>Tốc độ <select data-k="bpm"><option>60</option><option selected>80</option><option>100</option></select></label></div>' +
      '<div class="oz-sight-staff"></div>' +
      '<div class="oz-row"><button class="oz-btn" data-act="tonic">Nghe chủ âm</button><button class="oz-btn" data-act="count">Đếm vào</button>' +
      '<button class="oz-btn oz-btn--primary" data-act="play">Nghe đáp án</button><button class="oz-btn" data-act="new">Giai điệu mới</button></div>' +
      '<p class="oz-stats">Cách tập: nghe chủ âm, nhìn giai điệu 30 giây, đọc tên nốt, rồi bấm “Đếm vào” và hát (hoặc đàn) theo nhịp. Cuối cùng bấm “Nghe đáp án” để kiểm tra.</p>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const staff = root.querySelector(".oz-sight-staff");
    let mel = null;
    function draw() {
      staff.innerHTML = "";
      if (!window.ABCJS) { staff.textContent = "Không tải được thư viện vẽ khuông nhạc."; return; }
      const fg = getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000";
      ABCJS.renderAbc(staff, "X:1\nM:4/4\nL:1/8\nK:" + mel.key + "\n" + toAbc(mel), { staffwidth: 480, scale: 1.1, foregroundColor: fg, paddingleft: 0, paddingright: 0, responsive: "resize" });
    }
    function fresh() { mel = gen(ctl("key").value, Number(ctl("level").value)); draw(); }
    function play(withNotes) {
      const c = window.OZAudio && OZAudio.getCtx(); if (!c) return;
      const beat = 60 / Number(ctl("bpm").value);
      const t0 = c.currentTime + 0.1;
      for (let i = 0; i < 4; i++) OZAudio.click(t0 + i * beat, i === 0);
      if (!withNotes) return;
      let t = t0 + 4 * beat;
      mel.bars.forEach(function (bar) {
        bar.forEach(function (x) { OZAudio.playNote(T().midi(noteOf(x[0], mel.n)), t, x[1] * beat * 0.95 + 0.1); t += x[1] * beat; });
      });
      if (window.OZProgress) OZProgress.record("melodies", 1);
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      const a = b.dataset.act;
      if (a === "new") fresh();
      if (a === "play") play(true);
      if (a === "count") play(false);
      if (a === "tonic" && window.OZAudio) OZAudio.playNote(T().midi(noteOf(KEYS[mel.key].v, mel.n)), undefined, 1.5);
    });
    ctl("key").addEventListener("change", fresh);
    ctl("level").addEventListener("change", fresh);
    fresh();
  }
  window.OZSight = { gen: gen, toAbc: toAbc };
  function init() { document.querySelectorAll(".oz-sight").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
