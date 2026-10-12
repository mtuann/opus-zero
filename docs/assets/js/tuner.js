/* Máy lên dây qua micro (Web Audio + tự tương quan). Âm thanh chỉ được xử lý trên máy bạn. */
(function () {
  "use strict";
  const PC = ["Đô", "Đô♯", "Rê", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "Si♭", "Si"];
  const PCL = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
  const STRINGS = {
    violin: [["Sol (G3)", 55], ["Rê (D4)", 62], ["La (A4)", 69], ["Mi (E5)", 76]],
    guitar: [["Mi (E2)", 40], ["La (A2)", 45], ["Rê (D3)", 50], ["Sol (G3)", 55], ["Si (B3)", 59], ["Mi (E4)", 64]]
  };
  let activeStop = null;

  /* Ước lượng tần số cơ bản; trả về -1 nếu không rõ */
  function detect(buf, rate) {
    let rms = 0;
    for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
    if (Math.sqrt(rms / buf.length) < 0.01) return -1;
    let a = 0, b = buf.length - 1;
    const th = 0.2;
    for (let i = 0; i < buf.length / 2; i++) if (Math.abs(buf[i]) < th) { a = i; break; }
    for (let i = 1; i < buf.length / 2; i++) if (Math.abs(buf[buf.length - i]) < th) { b = buf.length - i; break; }
    const x = buf.slice(a, b), n = x.length;
    const c = new Float32Array(n);
    for (let lag = 0; lag < n; lag++) { let s = 0; for (let i = 0; i < n - lag; i++) s += x[i] * x[i + lag]; c[lag] = s; }
    let d = 0;
    while (d < n - 1 && c[d] > c[d + 1]) d++;
    let max = -1, pos = -1;
    for (let i = d; i < n; i++) if (c[i] > max) { max = c[i]; pos = i; }
    if (pos <= 0 || pos >= n - 1) return -1;
    const x1 = c[pos - 1], x2 = c[pos], x3 = c[pos + 1];
    const A = (x1 + x3 - 2 * x2) / 2, B = (x3 - x1) / 2;
    const T0 = A ? pos - B / (2 * A) : pos;
    return rate / T0;
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Nhạc cụ <select data-k="inst"><option value="chromatic">Tự do (mọi nốt)</option><option value="violin">Violin</option><option value="guitar">Guitar</option></select></label>' +
      '<button class="oz-btn oz-btn--primary" data-act="toggle">Bật micro</button></div>' +
      '<div class="oz-tuner-display"><div class="oz-tuner-note">–</div><div class="oz-tuner-freq oz-stats">Chưa nghe thấy âm thanh</div>' +
      '<div class="oz-meter" aria-hidden="true"><span class="oz-meter-mid"></span><span class="oz-needle"></span></div>' +
      '<div class="oz-tuner-cents oz-stats" aria-live="polite"></div></div>' +
      '<div class="oz-row oz-ref"></div>' +
      '<p class="oz-stats">Kim ở giữa và chữ chuyển màu xanh là đúng cao độ (lệch dưới 5 cent). Âm thanh từ micro chỉ được xử lý trong trình duyệt, không ghi âm và không gửi đi đâu.</p>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const noteEl = root.querySelector(".oz-tuner-note"), freqEl = root.querySelector(".oz-tuner-freq");
    const centsEl = root.querySelector(".oz-tuner-cents"), needle = root.querySelector(".oz-needle");
    const ref = root.querySelector(".oz-ref"), toggle = root.querySelector('[data-act="toggle"]');
    let stream = null, raf = 0, analyser = null, buf = null, smooth = null;

    function refButtons() {
      ref.innerHTML = "";
      const list = STRINGS[ctl("inst").value];
      if (!list) return;
      const lab = document.createElement("span"); lab.className = "oz-stats"; lab.textContent = "Nghe dây chuẩn:"; ref.appendChild(lab);
      list.forEach(function (s) {
        const b = document.createElement("button"); b.className = "oz-btn"; b.textContent = s[0];
        b.addEventListener("click", function () { if (window.OZAudio) OZAudio.playNote(s[1], undefined, 2.5, 0.25); });
        ref.appendChild(b);
      });
    }
    function loop() {
      analyser.getFloatTimeDomainData(buf);
      const f = detect(buf, analyser.context.sampleRate);
      if (f > 25 && f < 4200) {
        smooth = smooth ? smooth * 0.75 + f * 0.25 : f;
        let m = 69 + 12 * Math.log2(smooth / 440);
        const list = STRINGS[ctl("inst").value];
        let target = Math.round(m);
        if (list) target = list.reduce(function (best, s) { return Math.abs(s[1] - m) < Math.abs(best - m) ? s[1] : best; }, list[0][1]);
        const cents = Math.round((m - target) * 100);
        const pc = ((target % 12) + 12) % 12;
        noteEl.textContent = PC[pc] + " " + PCL[pc] + (Math.floor(target / 12) - 1);
        freqEl.textContent = smooth.toFixed(1) + " Hz";
        const clamped = Math.max(-50, Math.min(50, cents));
        needle.style.left = (50 + clamped) + "%";
        const ok = Math.abs(cents) < 5;
        noteEl.classList.toggle("in-tune", ok);
        centsEl.textContent = ok ? "Đúng cao độ" : (cents < 0 ? "Thấp " + (-cents) + " cent: lên dây căng hơn" : "Cao " + cents + " cent: chùng dây xuống");
      }
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null; smooth = null;
      toggle.textContent = "Bật micro";
      if (activeStop === stop) activeStop = null;
    }
    function start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { centsEl.textContent = "Trình duyệt này không hỗ trợ micro. Hãy thử Chrome, Edge, Firefox hoặc Safari bản mới."; return; }
      const c = window.OZAudio && OZAudio.getCtx(); if (!c) return;
      navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (s) {
        if (activeStop) activeStop();
        activeStop = stop;
        stream = s;
        const src = c.createMediaStreamSource(s);
        analyser = c.createAnalyser(); analyser.fftSize = 2048;
        buf = new Float32Array(analyser.fftSize);
        src.connect(analyser);
        toggle.textContent = "Tắt micro";
        centsEl.textContent = "Đang nghe… hãy gảy hoặc kéo một dây.";
        loop();
      }).catch(function () {
        centsEl.textContent = "Không mở được micro. Hãy cho phép trang dùng micro trong cài đặt trình duyệt rồi thử lại.";
      });
    }
    toggle.addEventListener("click", function () { stream ? stop() : start(); });
    ctl("inst").addEventListener("change", refButtons);
    if (window.location$) window.location$.subscribe(function () { stop(); });
    refButtons();
  }
  window.OZTuner = { detect: detect };
  function init() { document.querySelectorAll(".oz-tuner").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
