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
      '<div class="oz-row"><span class="oz-stats">Chơi và được chấm:</span><button class="oz-btn" data-act="grade-midi">Bằng đàn MIDI</button><button class="oz-btn" data-act="grade-mic">Bằng micro (hát hoặc nhạc cụ)</button><label class="oz-stats"><input type="checkbox" data-k="oct" checked> Bỏ qua quãng tám</label></div>' +
      '<div class="oz-feedback oz-grade" aria-live="polite"></div><div class="oz-grade-result"></div>' +
      '<p class="oz-stats">Cách tập: nghe chủ âm, nhìn giai điệu 30 giây, đọc tên nốt, rồi bấm “Đếm vào” và hát (hoặc đàn) theo nhịp. Muốn được chấm điểm, bấm một trong hai nút “Chơi và được chấm”. Cuối cùng bấm “Nghe đáp án” để so sánh.</p>';
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
    const gfb = root.querySelector(".oz-grade"), gres = root.querySelector(".oz-grade-result");
    let grading = null;
    function grade(src) {
      const c = window.OZAudio && OZAudio.getCtx(); if (!c || grading || !window.OZAssess) return;
      const begin = function () {
        const beat = 60 / Number(ctl("bpm").value), t0 = c.currentTime + 0.15;
        for (let i = 0; i < 4; i++) OZAudio.click(t0 + i * beat, i === 0);
        let t = t0 + 4 * beat; const exp = [];
        mel.bars.forEach(function (bar) { bar.forEach(function (x) { exp.push({ t0: t, dur: x[1] * beat, midi: T().midi(noteOf(x[0], mel.n)) }); t += x[1] * beat; }); });
        grading = { src: src, exp: exp, beat: beat, frames: [], events: [] };
        grading.off = src === "midi" ? OZMidi.on(function (ev) { if (ev.type === "on" && grading) grading.events.push({ t: ev.t, midi: ev.midi }); })
                                     : OZMic.on(function (fr) { if (grading) grading.frames.push(fr); });
        gfb.textContent = "1 – 2 – 3 – 4… bắt đầu!"; gfb.className = "oz-feedback oz-grade"; gres.innerHTML = "";
        setTimeout(function () {
          const g = grading; grading = null; g.off();
          const oct = ctl("oct").checked;
          const notes = g.src === "midi" ? OZAssess.assessMidi(g.exp, g.events, g.beat, { octaveFree: oct }).notes : OZAssess.assessPitch(g.exp, g.frames, { octaveFree: oct });
          const sm = OZAssess.summary(notes);
          gres.innerHTML = '<div class="oz-result-row">' + notes.map(function (r) {
            const cls = r.status === "ok" ? "ok" : r.status === "missing" ? "miss" : "bad";
            return '<span class="oz-res ' + cls + '">' + (r.status === "ok" ? "✓" : r.status === "missing" ? "thiếu" : (r.cents !== undefined ? (r.cents > 0 ? "+" : "") + r.cents + "¢" : "sai")) + "</span>";
          }).join("") + "</div>";
          gfb.textContent = "Đúng " + sm.ok + "/" + sm.total + " nốt (" + sm.pct + "%)." + (sm.pct === 100 ? " Xuất sắc!" : " Bấm “Nghe đáp án” để so sánh.");
          gfb.className = "oz-feedback oz-grade " + (sm.pct >= 80 ? "ok" : "bad");
          if (window.OZProgress && OZProgress.skill) OZProgress.skill("sight", sm.pct >= 80);
          if (window.OZProgress) OZProgress.record("melodies", 1);
        }, (t - c.currentTime + 0.5) * 1000);
      };
      const fail = function (msg) { gfb.textContent = msg; gfb.className = "oz-feedback oz-grade bad"; };
      if (src === "midi") {
        if (!window.OZMidi || !OZMidi.supported()) return fail("Trình duyệt này không hỗ trợ MIDI. Hãy dùng Chrome hoặc Edge, hoặc chấm bằng micro.");
        OZMidi.connect().then(begin).catch(function () { fail("Chưa kết nối được đàn MIDI."); });
      } else {
        if (!window.OZMic) return;
        OZMic.start().then(begin).catch(function () { fail("Không mở được micro. Hãy cho phép trang dùng micro."); });
      }
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      const a = b.dataset.act;
      if (a === "grade-midi") grade("midi");
      if (a === "grade-mic") grade("mic");
      if (a === "new") { fresh(); gres.innerHTML = ""; gfb.textContent = ""; }
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
