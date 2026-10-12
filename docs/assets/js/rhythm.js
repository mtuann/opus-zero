/* Luyện tiết tấu: xem tiết tấu, nghe đếm vào, rồi gõ theo. Site chấm độ chính xác. */
(function () {
  "use strict";
  /* Đơn vị: 1/12 phách (nốt đen = 12). Mỗi ô (cell) là danh sách [độ dài, là nốt?, liên ba?]. */
  const CELLS = {
    1: [[[12, 1]], [[12, 1]], [[24, 1]], [[48, 1]]],
    2: [[[12, 1]], [[12, 1]], [[24, 1]], [[6, 1], [6, 1]], [[6, 1], [6, 1]], [[12, 0]]],
    3: [[[12, 1]], [[24, 1]], [[6, 1], [6, 1]], [[12, 0]], [[18, 1], [6, 1]], [[6, 1], [12, 1], [6, 1]], [[6, 0], [6, 1]]],
    4: [[[12, 1]], [[6, 1], [6, 1]], [[4, 1, 1], [4, 1, 1], [4, 1, 1]], [[4, 1, 1], [4, 1, 1], [4, 1, 1]], [[3, 1], [3, 1], [3, 1], [3, 1]],
        [[9, 1], [3, 1]], [[6, 1], [3, 1], [3, 1]], [[3, 1], [3, 1], [6, 1]], [[6, 0], [6, 1]], [[6, 1], [12, 1], [6, 1]]]
  };
  function len(c) { return c.reduce(function (s, x) { return s + x[0]; }, 0); }

  function gen(level, bars) {
    const out = [];
    for (let b = 0; b < bars; b++) {
      let left = 48;
      const bar = [];
      while (left > 0) {
        const pos = 48 - left;
        const opts = CELLS[level].filter(function (c) {
          const L = len(c);
          if (L > left) return false;
          if (L >= 24) return pos % L === 0; /* ô dài bắt đầu ở phách mạnh */
          return pos % 12 === 0 || L === 12 - (pos % 12);
        });
        const c = opts[Math.floor(Math.random() * opts.length)];
        c.forEach(function (x) { bar.push(x); });
        left -= len(c);
      }
      out.push(bar);
    }
    if (!out[0].some(function (x) { return x[1]; })) out[0][0] = [out[0][0][0], 1];
    return out;
  }
  const DUR = { 3: "", 6: "2", 9: "3", 12: "4", 18: "6", 24: "8", 48: "16" };
  function toAbc(bars) {
    return bars.map(function (bar) {
      let t = 0, out = "", prev = null, i = 0;
      while (i < bar.length) {
        const x = bar[i];
        if (x[2]) { /* nhóm liên ba: 3 nốt, mỗi nốt 4 đơn vị, viết như 3 móc đơn */
          const g = bar.slice(i, i + 3).map(function (y) { return (y[1] ? "B" : "z") + "2"; }).join("");
          out += (out ? " " : "") + "(3" + g;
          t += 12; i += 3; prev = null; continue;
        }
        const tok = (x[1] ? "B" : "z") + DUR[x[0]];
        const beam = prev && prev.note && x[1] && prev.d <= 6 && x[0] <= 6 && Math.floor(prev.t / 12) === Math.floor(t / 12);
        out += (out && !beam ? " " : "") + tok;
        prev = { d: x[0], t: t, note: x[1] };
        t += x[0]; i++;
      }
      return out;
    }).join(" | ") + " |]";
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Cấp độ <select data-k="level"><option value="1">1: tròn, trắng, đen</option><option value="2">2: thêm móc đơn, dấu lặng</option><option value="3">3: chấm dôi, đảo phách</option><option value="4">4: liên ba, móc kép</option></select></label>' +
      '<label>Tốc độ <select data-k="bpm"><option>60</option><option selected>72</option><option>90</option><option>108</option></select></label>' +
      '<label><input type="checkbox" data-k="click" checked> Giữ tiếng đếm khi gõ</label></div>' +
      '<div class="oz-rhythm-staff"></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="start">Bắt đầu gõ</button><button class="oz-btn" data-act="listen">Nghe mẫu</button><button class="oz-btn" data-act="new">Tiết tấu mới</button></div>' +
      '<button class="oz-tap" data-act="tap" aria-label="Gõ (hoặc nhấn phím cách)">Gõ<small>hoặc nhấn phím cách</small></button>' +
      '<div class="oz-feedback" aria-live="polite">Đọc tiết tấu, bấm “Bắt đầu gõ”, nghe 4 tiếng đếm vào rồi gõ theo.</div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const staff = root.querySelector(".oz-rhythm-staff");
    const fb = root.querySelector(".oz-feedback");
    const tapBtn = root.querySelector(".oz-tap");
    let bars = null, run = null;

    function draw() {
      staff.innerHTML = "";
      if (!window.ABCJS) { staff.textContent = "Không tải được thư viện vẽ khuông nhạc."; return; }
      const fg = getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000";
      ABCJS.renderAbc(staff, "X:1\nM:4/4\nL:1/16\nK:C clef=perc stafflines=1\n" + toAbc(bars), { staffwidth: 420, scale: 1.2, foregroundColor: fg, paddingleft: 0, paddingright: 0 });
    }
    function onsets() {
      const list = []; let t = 0;
      bars.forEach(function (bar) { bar.forEach(function (x) { if (x[1]) list.push(t / 12); t += x[0]; }); });
      return list;
    }
    function fresh() { bars = gen(Number(ctl("level").value), 2); draw(); fb.textContent = "Đọc tiết tấu, bấm “Bắt đầu gõ”, nghe 4 tiếng đếm vào rồi gõ theo."; fb.className = "oz-feedback"; }

    function schedule(withNotes, withClicks) {
      const c = OZAudio.getCtx(); if (!c) return null;
      const beat = 60 / Number(ctl("bpm").value);
      const t0 = c.currentTime + 0.15;
      for (let i = 0; i < 4; i++) OZAudio.click(t0 + i * beat, i === 0);
      const start = t0 + 4 * beat;
      if (withClicks) for (let i = 0; i < 8; i++) OZAudio.click(start + i * beat, i % 4 === 0);
      if (withNotes) onsets().forEach(function (o) { OZAudio.playNote(72, start + o * beat, 0.25, 0.25); });
      return { start: start, beat: beat, end: start + 8 * beat };
    }
    function startRun() {
      if (!window.OZAudio || run) return;
      const s = schedule(false, ctl("click").checked);
      if (!s) return;
      run = { s: s, taps: [] };
      tapBtn.classList.add("live");
      tapBtn.focus();
      fb.textContent = "1 – 2 – 3 – 4 … gõ!"; fb.className = "oz-feedback";
      setTimeout(finish, (s.end - OZAudio.getCtx().currentTime + 0.4) * 1000);
    }
    function tap() {
      if (!run) return;
      const t = OZAudio.getCtx().currentTime;
      if (t >= run.s.start - run.s.beat * 0.5) run.taps.push(t);
      tapBtn.classList.add("hit"); setTimeout(function () { tapBtn.classList.remove("hit"); }, 90);
    }
    function finish() {
      if (!run) return;
      const s = run.s, taps = run.taps.slice();
      run = null; tapBtn.classList.remove("live");
      const expected = onsets().map(function (o) { return s.start + o * s.beat; });
      const tol = Math.min(0.15, s.beat * 0.3);
      let hit = 0; const offs = [];
      expected.forEach(function (e) {
        let best = -1, bd = 1e9;
        taps.forEach(function (t, i) { const d = Math.abs(t - e); if (d < bd) { bd = d; best = i; } });
        if (best >= 0 && bd <= tol) { hit++; offs.push(taps[best] - e); taps.splice(best, 1); }
      });
      const extra = taps.length;
      const avg = offs.length ? Math.round(1000 * offs.reduce(function (a, b) { return a + b; }, 0) / offs.length) : 0;
      const tendency = Math.abs(avg) < 25 ? "rất đều" : (avg < 0 ? "hơi sớm, trung bình " + (-avg) + " ms" : "hơi muộn, trung bình " + avg + " ms");
      const good = hit === expected.length && extra === 0;
      fb.textContent = (good ? "Chính xác! " : "") + "Gõ trúng " + hit + "/" + expected.length + " nốt" + (extra ? ", gõ thừa " + extra + " lần" : "") + (offs.length ? ", " + tendency : "") + "." + (good ? " Bấm “Tiết tấu mới” để tiếp tục." : " Bấm “Nghe mẫu” rồi thử lại.");
      fb.className = "oz-feedback " + (good ? "ok" : "bad");
      if (good && window.OZProgress) OZProgress.record("rhythms", 1);
      if (window.OZProgress && OZProgress.skill) OZProgress.skill("rhythm", good); 
    }

    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const a = b.dataset.act;
      if (a === "new") fresh();
      if (a === "start") startRun();
      if (a === "listen" && window.OZAudio && !run) schedule(true, true);
    });
    tapBtn.addEventListener("pointerdown", function (e) { e.preventDefault(); tap(); });
    root.addEventListener("keydown", function (e) {
      if (e.code === "Space" && !e.target.matches("select, input, textarea")) { e.preventDefault(); if (!e.repeat) tap(); }
    });
    ctl("level").addEventListener("change", fresh);
    fresh();
  }
  window.OZRhythm = { gen: gen, toAbc: toAbc };
  function init() { document.querySelectorAll(".oz-rhythm").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
