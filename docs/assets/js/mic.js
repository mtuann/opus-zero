/* Micro dùng chung: mở một lần, nhiều công cụ đọc cao độ và âm lượng.
   Dùng thuật toán tự tương quan của tuner.js (OZTuner.detect). */
(function () {
  "use strict";
  let stream = null, analyser = null, buf = null, timer = 0, starting = null;
  const subs = [];
  function running() { return !!stream; }
  function start() {
    if (stream) return Promise.resolve();
    if (starting) return starting;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("unsupported"));
    const c = window.OZAudio && OZAudio.getCtx();
    if (!c) return Promise.reject(new Error("audio"));
    starting = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (s) {
      stream = s; starting = null;
      const src = c.createMediaStreamSource(s);
      analyser = c.createAnalyser(); analyser.fftSize = 2048;
      buf = new Float32Array(analyser.fftSize);
      src.connect(analyser);
      timer = setInterval(tick, 30);
    }).catch(function (e) { starting = null; throw e; });
    return starting;
  }
  function tick() {
    if (!analyser) return;
    analyser.getFloatTimeDomainData(buf);
    let rms = 0; for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / buf.length);
    const f = window.OZTuner ? OZTuner.detect(buf, analyser.context.sampleRate) : -1;
    const t = analyser.context.currentTime;
    subs.slice().forEach(function (fn) { fn({ t: t, f: f > 25 && f < 4200 ? f : -1, rms: rms }); });
  }
  function stop() {
    clearInterval(timer); timer = 0;
    if (stream) stream.getTracks().forEach(function (tr) { tr.stop(); });
    stream = null; analyser = null;
  }
  function on(fn) { subs.push(fn); return function () { const i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); if (!subs.length) stop(); }; }
  function node() { return analyser; }
  window.OZMic = { start: start, stop: stop, on: on, running: running, analyser: node };
  if (window.location$) window.location$.subscribe(function () { if (!subs.length) stop(); });
})();
