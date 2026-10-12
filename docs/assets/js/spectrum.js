/* Phổ âm thanh trực tiếp (.oz-spectrum): từ micro hoặc từ âm thanh site phát ra. */
(function () {
  "use strict";
  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="mic">Bật micro</button>' +
      '<button class="oz-btn" data-act="piano">Phát Đô3: piano mẫu</button><button class="oz-btn" data-act="synth">Phát Đô3: âm tổng hợp</button><button class="oz-btn" data-act="sine">Phát Đô3: sóng sin</button></div>' +
      '<canvas class="oz-spec" width="720" height="240" role="img" aria-label="Phổ tần số"></canvas>' +
      '<p class="oz-stats oz-spec-info">Trục ngang: tần số (thang log, 50–5000 Hz); trục dọc: cường độ. Các vạch mờ đánh dấu bồi âm 1, 2, 3… của âm cơ bản được phát hiện.</p>';
    const cv = root.querySelector("canvas"), g = cv.getContext && cv.getContext("2d"), info = root.querySelector(".oz-spec-info");
    let analyser = null, raf = 0, data = null, td = null, srcMode = "";
    function tap() {
      const c = OZAudio.getCtx(); if (!c) return null;
      if (!root._tap) { root._tap = c.createAnalyser(); root._tap.fftSize = 8192; root._tap.smoothingTimeConstant = 0.6; OZAudio.output().connect(root._tap); }
      return root._tap;
    }
    function draw() {
      if (!analyser || !g) return;
      if (!cv.isConnected) { cancelAnimationFrame(raf); return; }
      const W = cv.width, Hh = cv.height, sr = analyser.context.sampleRate, n = analyser.frequencyBinCount;
      if (!data || data.length !== n) { data = new Float32Array(n); td = new Float32Array(analyser.fftSize); }
      analyser.getFloatFrequencyData(data); analyser.getFloatTimeDomainData(td);
      const fgc = getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000";
      const acc = getComputedStyle(document.body).getPropertyValue("--md-accent-fg-color").trim() || "#b5832a";
      g.clearRect(0, 0, W, Hh);
      const fx = function (f) { return W * Math.log(f / 50) / Math.log(5000 / 50); };
      g.globalAlpha = 0.25; g.strokeStyle = fgc; g.lineWidth = 1;
      [100, 200, 500, 1000, 2000].forEach(function (f) { const x = fx(f); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, Hh); g.stroke(); g.fillStyle = fgc; g.fillText(f >= 1000 ? f / 1000 + "k" : String(f), x + 2, 10); });
      const f0 = window.OZTuner ? OZTuner.detect(td.slice(0, 2048), sr) : -1;
      if (f0 > 40 && f0 < 2000) {
        g.globalAlpha = 0.35; g.strokeStyle = acc; g.setLineDash([3, 3]);
        for (let h = 1; h <= 16 && f0 * h < 5000; h++) { const x = fx(f0 * h); g.beginPath(); g.moveTo(x, 14); g.lineTo(x, Hh); g.stroke(); }
        g.setLineDash([]);
        info.textContent = "Âm cơ bản khoảng " + f0.toFixed(1) + " Hz. Các vạch nét đứt là bồi âm 1, 2, 3… Hãy so độ cao của các đỉnh giữa piano, âm tổng hợp và sóng sin.";
      }
      g.globalAlpha = 1; g.strokeStyle = acc; g.lineWidth = 1.5; g.beginPath();
      for (let i = 1; i < n; i++) {
        const f = i * sr / analyser.fftSize; if (f < 50 || f > 5000) continue;
        const x = fx(f), y = Hh - Math.max(0, Math.min(1, (data[i] + 110) / 90)) * (Hh - 16);
        i === 1 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
      raf = requestAnimationFrame(draw);
    }
    function run(a) { analyser = a; cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b || !window.OZAudio) return;
      const c = OZAudio.getCtx(); if (!c) return;
      const a = b.dataset.act;
      if (a === "mic") {
        if (!window.OZMic) return;
        OZMic.start().then(function () { const mic = c.createAnalyser(); mic.fftSize = 8192; mic.smoothingTimeConstant = 0.6; root._micOff = OZMic.on(function () {}); OZMic.analyser().connect(mic); srcMode = "mic"; run(mic); }).catch(function () { info.textContent = "Không mở được micro."; });
        return;
      }
      run(tap()); srcMode = a;
      const t = c.currentTime + 0.05;
      if (a === "piano") { const prev = OZAudio.mode(); if (prev !== "piano") OZAudio.setMode("piano"); OZAudio.load(); OZAudio.playNote(48, t, 2.5, 0.3); }
      if (a === "synth") { const prev = OZAudio.mode(); OZAudio.setMode("synth"); OZAudio.playNote(48, t, 2.5, 0.3); OZAudio.setMode(prev); }
      if (a === "sine") { const o = c.createOscillator(), gg = c.createGain(); o.frequency.value = 130.81; gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(0.3, t + 0.03); gg.gain.exponentialRampToValueAtTime(0.0001, t + 2.5); o.connect(gg).connect(OZAudio.output()); o.start(t); o.stop(t + 2.6); }
    });
    if (window.location$) window.location$.subscribe(function () { cancelAnimationFrame(raf); if (root._micOff) root._micOff(); });
  }
  function init() { document.querySelectorAll(".oz-spectrum").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
