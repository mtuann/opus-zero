/* Chép giai điệu (.oz-dictation): nghe một câu nhạc ngắn rồi nhập lại bằng bàn phím màn hình hoặc đàn MIDI. */
(function () {
  "use strict";
  const LV = { 1: { name: "Cấp 1: 4 nốt, bước liền", n: 4 }, 2: { name: "Cấp 2: 6 nốt, có bước nhảy", n: 6 }, 3: { name: "Cấp 3: 8 nốt", n: 8 } };
  const SCALE = [0, 2, 4, 5, 7, 9, 11, 12];
  const NAMES = ["Đô", "Đô♯", "Rê", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "Si♭", "Si"];
  const nm = function (m) { return NAMES[((m % 12) + 12) % 12]; };
  function gen(level) {
    const n = LV[level].n, out = [60];
    let deg = 0;
    while (out.length < n - 1) {
      const r = Math.random();
      let step = level === 1 ? (r < 0.5 ? 1 : -1) : (r < 0.45 ? 1 : r < 0.75 ? -1 : r < 0.88 ? 2 : -2);
      if (level === 3 && Math.random() < 0.15) step = Math.random() < 0.5 ? 4 : -3;
      deg = Math.max(0, Math.min(7, deg + step));
      out.push(60 + SCALE[deg]);
    }
    out.push(Math.random() < 0.5 ? 60 : 72); /* kết ở chủ âm */
    return out;
  }
  function mount(root) {
    if (root.dataset.ready || !window.OZPiano) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Cấp độ <select data-k="lv">' + Object.keys(LV).map(function (k) { return '<option value="' + k + '">' + LV[k].name + "</option>"; }).join("") + '</select></label>' +
      '<button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="play">Nghe lại</button><button class="oz-btn" data-act="tonic">Nghe chủ âm Đô</button></div>' +
      '<div class="oz-midi-status"></div>' +
      '<p class="oz-dict-input oz-stats" aria-live="polite"></p><div class="oz-kb"></div>' +
      '<div class="oz-row"><button class="oz-btn" data-act="undo">Xóa nốt cuối</button><button class="oz-btn oz-btn--primary" data-act="check">Kiểm tra</button></div>' +
      '<div class="oz-feedback" aria-live="polite">Bấm “Câu mới”. Giai điệu luôn bắt đầu bằng Đô (Đô4); bạn nhập tất cả các nốt, kể cả nốt đầu.</div><div class="oz-stats oz-dict-stats"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const inp = root.querySelector(".oz-dict-input"), fb = root.querySelector(".oz-feedback"), st = root.querySelector(".oz-dict-stats");
    let q = null, entered = [], checked = false; const session = { ok: 0, n: 0 };
    function showInput() { inp.textContent = q ? "Đã nhập " + entered.length + "/" + q.length + ": " + (entered.length ? entered.map(nm).join(" – ") : "(chưa có)") : ""; }
    function add(m) { if (!q || checked || entered.length >= q.length) return; entered.push(m); showInput(); }
    OZPiano.keyboard(root.querySelector(".oz-kb"), { lo: 55, hi: 77, onKey: add, midi: false });
    if (window.OZMidi) OZMidi.on(function (ev) { if (ev.type === "on" && root.isConnected) add(ev.midi); });
    function play() { if (!q) return; const c = OZAudio.getCtx(); if (!c) return; const t = c.currentTime + 0.05; q.forEach(function (m, i) { OZAudio.playNote(m, t + i * 0.6, 0.55); }); }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      const a = b.dataset.act;
      if (a === "new") { q = gen(Number(ctl("lv").value)); entered = []; checked = false; fb.textContent = "Nghe, rồi nhập " + q.length + " nốt."; fb.className = "oz-feedback"; showInput(); play(); }
      if (a === "play") play();
      if (a === "tonic" && window.OZAudio) OZAudio.playNote(60, undefined, 1.2);
      if (a === "undo" && !checked) { entered.pop(); showInput(); }
      if (a === "check" && q) {
        if (entered.length < q.length) { fb.textContent = "Còn thiếu " + (q.length - entered.length) + " nốt."; fb.className = "oz-feedback bad"; return; }
        checked = true;
        let right = 0;
        const marks = q.map(function (m, i) { const ok = entered[i] === m; if (ok) right++; return (ok ? "✓ " : "✗ ") + nm(m) + (ok ? "" : " (bạn nhập " + nm(entered[i]) + ")"); });
        const ok = right === q.length;
        session.n++; if (ok) session.ok++;
        if (window.OZProgress) { if (OZProgress.skill) OZProgress.skill("dictation", ok); if (ok) OZProgress.record("melodies", 1); }
        fb.textContent = (ok ? "Hoàn toàn chính xác! " : "Đúng " + right + "/" + q.length + " nốt. ") + marks.join(" · ");
        fb.className = "oz-feedback " + (ok ? "ok" : "bad");
        st.textContent = "Lượt này: " + session.ok + "/" + session.n + " câu chép đúng hoàn toàn.";
      }
    });
  }
  window.OZDictation = { gen: gen };
  function init() { document.querySelectorAll(".oz-dictation").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
