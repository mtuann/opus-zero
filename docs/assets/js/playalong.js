/* Chơi theo (.oz-playalong) và hát lại (.oz-singback): site nghe bạn qua micro hoặc đàn MIDI. */
(function () {
  "use strict";
  const NAMES = ["Đô", "Đô♯", "Rê", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "Si♭", "Si"];
  const nm = function (m) { return NAMES[((Math.round(m) % 12) + 12) % 12] + (Math.floor(Math.round(m) / 12) - 1); };
  /* Giai điệu: [midi, phách] ở Đô trưởng; cùng các bài trong "10 bài đầu tiên" */
  const SONGS = {
    twinkle: { name: "Twinkle, Twinkle (Ah! vous dirai-je, maman)", notes: [[60,1],[60,1],[67,1],[67,1],[69,1],[69,1],[67,2],[65,1],[65,1],[64,1],[64,1],[62,1],[62,1],[60,2]] },
    lightly: { name: "Hänschen klein (Lightly Row)", notes: [[67,1],[64,1],[64,2],[65,1],[62,1],[62,2],[60,1],[62,1],[64,1],[65,1],[67,1],[67,1],[67,2]] },
    lune: { name: "Au clair de la lune", notes: [[60,1],[60,1],[60,1],[62,1],[64,2],[62,2],[60,1],[64,1],[62,1],[62,1],[60,4]] },
    ode: { name: "Ode to Joy (Beethoven)", notes: [[64,1],[64,1],[65,1],[67,1],[67,1],[65,1],[64,1],[62,1],[60,1],[60,1],[62,1],[64,1],[64,1.5],[62,0.5],[62,2]] },
    scale: { name: "Gam Đô trưởng đi lên", notes: [[60,1],[62,1],[64,1],[65,1],[67,1],[69,1],[71,1],[72,1]] }
  };
  const INSTR = {
    piano: { name: "Piano, sáo, giọng nữ (như viết)", shift: 0, octaveFree: false },
    voice: { name: "Giọng hát (bỏ qua quãng tám)", shift: 0, octaveFree: true },
    violin: { name: "Violin (lên Rê trưởng, +2)", shift: 2, octaveFree: false },
    guitar: { name: "Guitar (âm thật thấp một quãng tám)", shift: -12, octaveFree: true }
  };
  const LET = ["C", "^C", "D", "_E", "E", "F", "^F", "G", "^G", "A", "_B", "B"];
  function toAbc(notes, shift) {
    const s = (shift % 12 + 12) % 12;
    const letters = s === 2 ? ["C", "^C", "D", "_E", "E", "F", "F", "G", "^G", "A", "_B", "B"] : LET; /* Rê trưởng: Fa♯, Đô♯ đã có trong hóa biểu */
    const fix = s === 2 ? { 1: "C", 6: "F" } : {};
    let beats = 0;
    return notes.map(function (n) {
      const m = n[0] + s, pc = m % 12, o = Math.floor(m / 12) - 1;
      let p = fix[pc] || letters[pc];
      p = o >= 5 ? p.replace(/[A-G]/, function (c) { return c.toLowerCase(); }) + "'".repeat(o - 5) : p + ",".repeat(4 - o);
      const d = n[1] * 2;
      beats += n[1];
      const bar = beats % 4 === 0 ? " |" : "";
      return p + (d === 1 ? "" : String(d)) + bar;
    }).join(" ");
  }
  function fg() { return getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000"; }
  function skill(id, ok) { if (window.OZProgress && OZProgress.skill) OZProgress.skill(id, ok); }

  function resultRow(results) {
    return '<div class="oz-result-row">' + results.map(function (r) {
      const cls = r.status === "ok" ? "ok" : (r.status === "missing" ? "miss" : "bad");
      const lab = r.status === "ok" ? "✓" : r.status === "missing" ? "thiếu" : r.cents !== undefined ? (r.cents > 0 ? "+" : "") + r.cents + "¢" : (r.got !== undefined ? nm(r.got) : "?");
      return '<span class="oz-res ' + cls + '" title="' + nm(r.midi) + '"><b>' + nm(r.midi) + "</b>" + lab + "</span>";
    }).join("") + "</div>";
  }

  function mountPlay(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const opt = function (o) { return Object.keys(o).map(function (k) { return '<option value="' + k + '">' + o[k].name + "</option>"; }).join(""); };
    root.innerHTML =
      '<div class="oz-row"><label>Bài <select data-k="song">' + opt(SONGS) + '</select></label><label>Nhạc cụ <select data-k="inst">' + opt(INSTR) + '</select></label>' +
      '<label>Tốc độ <select data-k="bpm"><option>50</option><option selected>66</option><option>80</option><option>96</option></select></label>' +
      '<label>Nghe bằng <select data-k="src"><option value="mic">Micro</option><option value="midi">Đàn MIDI</option></select></label></div>' +
      '<div class="oz-midi-status" hidden></div>' +
      '<div class="oz-pa-staff"></div>' +
      '<div class="oz-row"><button class="oz-btn" data-act="demo">Nghe mẫu</button><button class="oz-btn oz-btn--primary" data-act="go">Bắt đầu (đếm 4 nhịp)</button><button class="oz-btn" data-act="stop" hidden>Dừng</button></div>' +
      '<div class="oz-feedback" aria-live="polite">Chọn bài, bấm “Bắt đầu”, nghe 4 tiếng đếm rồi chơi (hoặc hát) theo nhịp.</div><div class="oz-pa-result"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const fb = root.querySelector(".oz-feedback"), out = root.querySelector(".oz-pa-result"), staff = root.querySelector(".oz-pa-staff");
    const midiBox = root.querySelector(".oz-midi-status");
    let running = null;
    function draw() {
      if (!window.ABCJS) return;
      const ins = INSTR[ctl("inst").value];
      const key = ins.shift === 2 ? "D" : "C";
      ABCJS.renderAbc(staff, "X:1\nL:1/8\nM:4/4\nK:" + key + (ctl("inst").value === "guitar" ? " clef=treble-8" : "") + "\n" + toAbc(SONGS[ctl("song").value].notes, ins.shift === -12 ? 0 : ins.shift).replace(/ \|$/, "") + " |]", { responsive: "resize", foregroundColor: fg(), paddingleft: 0, paddingright: 0 });
    }
    function expected(t0, beat) {
      const ins = INSTR[ctl("inst").value]; let t = t0;
      return SONGS[ctl("song").value].notes.map(function (n) { const e = { t0: t, dur: n[1] * beat, midi: n[0] + ins.shift }; t += n[1] * beat; return e; });
    }
    function demo() {
      const c = window.OZAudio && OZAudio.getCtx(); if (!c) return;
      const beat = 60 / Number(ctl("bpm").value);
      expected(c.currentTime + 0.1, beat).forEach(function (n) { OZAudio.playNote(n.midi, n.t0, n.dur * 0.95); });
    }
    function finish() {
      if (!running) return;
      const r = running; running = null;
      r.unsub(); root.querySelector('[data-act="stop"]').hidden = true; root.querySelector('[data-act="go"]').hidden = false;
      const ins = INSTR[ctl("inst").value];
      let notes, extraTxt = "";
      if (r.src === "midi") { const res = OZAssess.assessMidi(r.exp, r.events, r.beat, { octaveFree: ins.octaveFree }); notes = res.notes; if (res.extra) extraTxt = " Bấm thừa " + res.extra + " phím."; }
      else notes = OZAssess.assessPitch(r.exp, r.frames, { octaveFree: ins.octaveFree });
      const sm = OZAssess.summary(notes);
      out.innerHTML = resultRow(notes) + (window.OZViz ? OZViz.pianoRoll({ expected: r.exp.map(function (e, i) { return Object.assign({}, e, { status: notes[i].status }); }), frames: r.frames, events: r.events, octaveFree: ins.octaveFree }) : "");
      const missing = notes.filter(function (n) { return n.status === "missing"; }).length;
      fb.textContent = "Đúng " + sm.ok + "/" + sm.total + " nốt (" + sm.pct + "%)." + extraTxt +
        (missing > sm.total / 2 ? (r.src === "mic" ? " Site nghe được rất ít: kiểm tra micro, chơi to hơn, hoặc đeo tai nghe nếu bật nghe mẫu." : " Hãy kiểm tra kết nối đàn.") : (sm.pct === 100 ? " Tuyệt vời! Thử tăng tốc độ." : " Ô màu đỏ: số cent cao (+) hoặc thấp (−) so với nốt đúng; 100 cent = nửa cung."));
      fb.className = "oz-feedback " + (sm.pct >= 80 ? "ok" : "bad");
      skill("play", sm.pct >= 80);
      if (window.OZProgress) OZProgress.record("melodies", 1);
    }
    function go() {
      const c = window.OZAudio && OZAudio.getCtx(); if (!c || running) return;
      const src = ctl("src").value, beat = 60 / Number(ctl("bpm").value);
      const begin = function () {
        const t0 = c.currentTime + 0.15;
        for (let i = 0; i < 4; i++) OZAudio.click(t0 + i * beat, i === 0);
        const start = t0 + 4 * beat, exp = expected(start, beat);
        const end = exp[exp.length - 1].t0 + exp[exp.length - 1].dur;
        running = { src: src, exp: exp, beat: beat, frames: [], events: [], unsub: function () {} };
        if (src === "midi") running.unsub = OZMidi.on(function (ev) { if (ev.type === "on" && running) running.events.push({ t: ev.t, midi: ev.midi }); });
        else running.unsub = OZMic.on(function (fr) { if (running) running.frames.push(fr); });
        root.querySelector('[data-act="stop"]').hidden = false; root.querySelector('[data-act="go"]').hidden = true;
        fb.textContent = "1 – 2 – 3 – 4… chơi!"; fb.className = "oz-feedback"; out.innerHTML = "";
        setTimeout(finish, (end - c.currentTime + 0.5) * 1000);
      };
      if (src === "midi") {
        if (!window.OZMidi || !OZMidi.supported()) { fb.textContent = "Trình duyệt này không hỗ trợ MIDI. Hãy dùng Chrome hoặc Edge, hoặc chọn Micro."; fb.className = "oz-feedback bad"; return; }
        OZMidi.connect().then(begin).catch(function () { fb.textContent = "Chưa kết nối được đàn MIDI."; fb.className = "oz-feedback bad"; });
      } else {
        if (!window.OZMic) return;
        OZMic.start().then(begin).catch(function () { fb.textContent = "Không mở được micro. Hãy cho phép trang dùng micro rồi thử lại."; fb.className = "oz-feedback bad"; });
      }
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "demo") demo();
      if (b.dataset.act === "go") go();
      if (b.dataset.act === "stop") finish();
    });
    root.addEventListener("change", function (e) {
      if (e.target.dataset.k === "src") midiBox.hidden = e.target.value !== "midi";
      if (e.target.dataset.k === "song" || e.target.dataset.k === "inst") { draw(); out.innerHTML = ""; }
    });
    draw();
  }

  /* Hát lại: nghe hai nốt, hát lại nốt thứ hai */
  const IV = { 2: "2 trưởng", 3: "3 thứ", 4: "3 trưởng", 5: "4 đúng", 7: "5 đúng", 9: "6 trưởng", 12: "8 đúng" };
  function mountSing(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Giọng <select data-k="range"><option value="low">Nam (trầm)</option><option value="high" selected>Nữ, trẻ em (cao)</option></select></label>' +
      '<label>Bài <select data-k="mode"><option value="unison">Hát lại một nốt</option><option value="interval">Hát quãng đi lên</option></select></label></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="again">Nghe lại</button><button class="oz-btn" data-act="sing">Hát (3 giây)</button></div>' +
      '<div class="oz-meter" aria-hidden="true"><span class="oz-meter-mid"></span><span class="oz-needle"></span></div>' +
      '<div class="oz-feedback" aria-live="polite">Bấm “Câu mới”, nghe, rồi bấm “Hát” và ngân nốt cần hát (âm “a” hoặc “la”).</div><div class="oz-stats"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const fb = root.querySelector(".oz-feedback"), stats = root.querySelector(".oz-stats"), needle = root.querySelector(".oz-needle");
    let q = null; const session = { ok: 0, n: 0 };
    function play() {
      if (!q) return; const c = OZAudio.getCtx(); if (!c) return;
      const t = c.currentTime + 0.05;
      if (q.iv) { OZAudio.playNote(q.root, t, 0.9); OZAudio.playNote(q.target, t + 1.0, 1.2); }
      else OZAudio.playNote(q.target, t, 1.5);
    }
    function newQ() {
      const base = ctl("range").value === "low" ? 48 : 60;
      if (ctl("mode").value === "interval") {
        const ks = Object.keys(IV).map(Number), iv = ks[Math.floor(Math.random() * ks.length)];
        const r = base + Math.floor(Math.random() * Math.max(1, 12 - iv + 1));
        q = { root: r, iv: iv, target: r + iv };
        fb.textContent = "Nghe hai nốt (quãng " + IV[iv] + "), rồi hát lại nốt thứ hai.";
      } else { q = { target: base + Math.floor(Math.random() * 10) }; fb.textContent = "Nghe một nốt, rồi hát lại."; }
      fb.className = "oz-feedback"; play();
    }
    function sing() {
      if (!q) { newQ(); return; }
      if (!window.OZMic) return;
      OZMic.start().then(function () {
        const frames = []; fb.textContent = "Đang nghe… hãy ngân nốt " + nm(q.target).replace(/\d+$/, "") + "."; fb.className = "oz-feedback";
        const off = OZMic.on(function (fr) {
          frames.push(fr);
          if (fr.f > 0) { let d = (OZAssess.freqToMidi(fr.f) - q.target) * 100; while (d > 600) d -= 1200; while (d < -600) d += 1200; needle.style.left = (50 + Math.max(-50, Math.min(50, d / 2))) + "%"; }
        });
        setTimeout(function () {
          off();
          const got = OZAssess.stablePitch(frames);
          const voiced = frames.filter(function (f) { return f.f > 0; });
          if (window.OZViz && voiced.length) {
            const t0 = voiced[0].t, tEnd = voiced[voiced.length - 1].t;
            let dd = got === null ? 0 : (got - q.target) * 100;
            while (dd > 600) dd -= 1200; while (dd < -600) dd += 1200;   /* bỏ qua quãng tám, như phần chấm bên dưới */
            const st = got === null ? "missing" : (Math.abs(dd) <= 50 ? "ok" : (dd > 0 ? "high" : "low"));
            OZViz.show(fb, OZViz.pianoRoll({ expected: [{ t0: t0, dur: Math.max(0.5, tEnd - t0), midi: q.target, status: st }], frames: voiced, octaveFree: true }));
          }
          if (got === null) { fb.textContent = "Site chưa nghe rõ. Hãy hát to và giữ một nốt ổn định, ở nơi yên tĩnh."; fb.className = "oz-feedback bad"; return; }
          let d = Math.round((got - q.target) * 100); while (d > 600) d -= 1200; while (d < -600) d += 1200;
          const ok = Math.abs(d) <= 50;
          session.n++; if (ok) session.ok++;
          skill("sing", ok);
          fb.textContent = ok ? "Đúng! Lệch " + (d > 0 ? "+" : "") + d + " cent." : (d > 0 ? "Cao hơn " + d + " cent" : "Thấp hơn " + (-d) + " cent") + (Math.abs(d) >= 100 ? " (khoảng " + Math.round(Math.abs(d) / 100) + " nửa cung)." : ".") + " Nghe lại và thử lần nữa.";
          fb.className = "oz-feedback " + (ok ? "ok" : "bad");
          stats.textContent = "Lượt này: " + session.ok + "/" + session.n + " lần trong khoảng ±50 cent.";
        }, 3000);
      }).catch(function () { fb.textContent = "Không mở được micro. Hãy cho phép trang dùng micro."; fb.className = "oz-feedback bad"; });
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "new") newQ();
      if (b.dataset.act === "again") play();
      if (b.dataset.act === "sing") sing();
    });
  }

  window.OZPlayalong = { SONGS: SONGS, toAbc: toAbc };
  function init() { document.querySelectorAll(".oz-playalong").forEach(mountPlay); document.querySelectorAll(".oz-singback").forEach(mountSing); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
