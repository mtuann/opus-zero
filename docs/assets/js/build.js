/* Bài tập "viết" trên bàn phím: bấm chọn các nốt của gam hoặc hợp âm được yêu cầu, rồi kiểm tra. */
(function () {
  "use strict";
  const T = function () { return window.OZTheory; };
  const ROOTS = ["C", "D", "E", "F", "G", "A", "B", "Bb", "Eb", "Ab", "F#", "Db"];
  const SETS = {
    triads: { name: "Hợp âm ba (4 loại)", items: ["c:maj", "c:min", "c:dim", "c:aug"] },
    sevenths: { name: "Hợp âm bảy (5 loại)", items: ["c:maj7", "c:dom7", "c:min7", "c:hdim7", "c:dim7"] },
    major: { name: "Gam trưởng", items: ["s:major"] },
    minor: { name: "Ba dạng gam thứ", items: ["s:natural", "s:harmonic", "s:melodic"] },
    modes: { name: "Điệu thức và ngũ cung", items: ["s:dorian", "s:phrygian", "s:lydian", "s:mixolydian", "s:pentaMajor", "s:pentaMinor"] }
  };

  function mount(root) {
    if (root.dataset.ready || !window.OZTheory || !window.OZPiano) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Bài tập <select data-k="set">' + Object.keys(SETS).map(function (k) { return '<option value="' + k + '">' + SETS[k].name + "</option>"; }).join("") + "</select></label>" +
      '<label><input type="checkbox" data-k="easy" checked> Chỉ giọng ít dấu hóa</label></div>' +
      '<p class="oz-build-q"></p><div class="oz-kb"></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="check">Kiểm tra</button><button class="oz-btn" data-act="clear">Xóa chọn</button><button class="oz-btn" data-act="play">Nghe các nốt đã chọn</button><button class="oz-btn" data-act="next">Câu khác</button></div>' +
      '<div class="oz-feedback" aria-live="polite"></div><div class="oz-stats"></div>';
    const host = root.querySelector(".oz-kb");
    const chosen = new Set();
    const kb = OZPiano.keyboard(host, { lo: 60, hi: 83, hint: "Bấm phím để chọn hoặc bỏ chọn. Chọn trong một quãng tám, bắt đầu từ nốt gốc." });
    const svg = host.querySelector("svg");
    svg.addEventListener("pointerdown", function (e) {
      const k = e.target.closest(".oz-key"); if (!k) return;
      const m = Number(k.dataset.m);
      if (chosen.has(m)) chosen.delete(m); else chosen.add(m);
      kb.highlight(Array.from(chosen));
    });
    const qEl = root.querySelector(".oz-build-q"), fb = root.querySelector(".oz-feedback"), stats = root.querySelector(".oz-stats");
    let q = null; const session = { right: 0, total: 0 }; let first = true;

    function next() {
      const set = SETS[root.querySelector('[data-k="set"]').value];
      const pool = root.querySelector('[data-k="easy"]').checked ? ROOTS.slice(0, 8) : ROOTS;
      const item = set.items[Math.floor(Math.random() * set.items.length)].split(":");
      const r = pool[Math.floor(Math.random() * pool.length)];
      const notes = item[0] === "s" ? T().scale(r + "4", item[1]).slice(0, -1) : T().chord(r + "4", item[1]);
      q = { kind: item[0], type: item[1], r: r, notes: notes };
      const name = item[0] === "s" ? T().SCALES[item[1]].name + " " + T().prettyKeyVi(r) : T().CHORDS[item[1]].name + " " + T().prettyKeyVi(r) + " (" + T().prettyKey(r) + T().CHORDS[item[1]].sym + ")";
      qEl.innerHTML = "Bấm các nốt của: <strong>" + name + "</strong>";
      chosen.clear(); kb.highlight([]); fb.textContent = ""; fb.className = "oz-feedback"; first = true;
    }
    function pcs(list) { return Array.from(new Set(list.map(function (m) { return ((m % 12) + 12) % 12; }))).sort(function (a, b) { return a - b; }); }
    function check() {
      if (!q) return;
      const want = pcs(q.notes.map(T().midi)), got = pcs(Array.from(chosen));
      const ok = want.length === got.length && want.every(function (x, i) { return x === got[i]; });
      const names = q.notes.map(function (n) { return T().viName(n); }).join(" – ");
      if (ok) {
        if (first) { session.right++; session.total++; }
        fb.textContent = "Đúng: " + names + "."; fb.className = "oz-feedback ok";
        if (window.OZProgress) OZProgress.record("builds", 1);
        setTimeout(next, 1600);
      } else {
        if (first) { session.total++; first = false; }
        const missing = want.filter(function (x) { return got.indexOf(x) < 0; }).length;
        const extra = got.filter(function (x) { return want.indexOf(x) < 0; }).length;
        fb.textContent = "Chưa đúng: thiếu " + missing + " nốt, thừa " + extra + " nốt. Bấm Kiểm tra lần nữa sau khi sửa, hoặc Câu khác để xem đáp án.";
        fb.className = "oz-feedback bad";
      }
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      const a = b.dataset.act;
      if (a === "check") check();
      if (a === "clear") { chosen.clear(); kb.highlight([]); }
      if (a === "next") { if (q && fb.className.indexOf("ok") < 0) { fb.textContent = "Đáp án câu trước: " + q.notes.map(function (n) { return T().viName(n); }).join(" – ") + "."; } const keep = fb.textContent; next(); fb.textContent = keep; }
      if (a === "play" && window.OZAudio) { const c = OZAudio.getCtx(); if (!c) return; Array.from(chosen).sort(function (x, y) { return x - y; }).forEach(function (m, i) { OZAudio.playNote(m, c.currentTime + i * 0.3, 0.6); }); }
    });
    root.querySelector('[data-k="set"]').addEventListener("change", next);
    root.querySelector('[data-k="easy"]').addEventListener("change", next);
    next();
  }
  function init() { document.querySelectorAll(".oz-build").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
