/* Âm thanh dùng chung cho mọi công cụ.
   Mặc định dùng mẫu âm piano thật (Salamander Grand Piano, Alexander Holm, CC BY 3.0);
   tự dùng âm tổng hợp khi mẫu chưa tải xong hoặc khi người dùng chọn. */
(function () {
  "use strict";
  const KEY = "opus-zero:sound";
  const NAMES = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];
  let ctx = null, master = null, loading = null;
  const buffers = {};               /* midi -> AudioBuffer */
  const listeners = [];

  function base() {
    const s = document.querySelector('script[src*="assets/js/audio.js"]');
    return s ? s.src.replace(/js\/audio\.js.*$/, "samples/piano/") : "assets/samples/piano/";
  }
  function sampleList() {
    const list = [];
    for (let m = 21; m <= 108; m += 3) { /* La0 (21) … Đô8 (108), mỗi 3 nửa cung */
      const n = NAMES[m % 12], o = Math.floor(m / 12) - 1;
      list.push([m, n + o]);
    }
    return list;
  }
  function mode() {
    try { return localStorage.getItem(KEY) || "piano"; } catch (e) { return "piano"; }
  }
  function setMode(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* bỏ qua */ }
    if (v === "piano") load();
    listeners.forEach(function (f) { f(status()); });
  }
  function status() {
    const n = Object.keys(buffers).length;
    return { mode: mode(), loaded: n, total: sampleList().length, ready: n === sampleList().length };
  }
  function onStatus(f) { listeners.push(f); }

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      /* Bộ nén nhẹ để hợp âm nhiều nốt không bị rè (vượt ngưỡng) */
      if (ctx.createDynamicsCompressor) {
        const comp = ctx.createDynamicsCompressor();
        try { comp.threshold.value = -10; comp.knee.value = 12; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.2; } catch (e) { /* bỏ qua */ }
        master.connect(comp); comp.connect(ctx.destination);
      } else master.connect(ctx.destination);
      if (mode() === "piano") load();
    }
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx;
  }
  function out() { getCtx(); return master || (ctx && ctx.destination); }

  function load() {
    if (loading || !ctx || typeof fetch !== "function" || !ctx.decodeAudioData) return loading;
    const b = base();
    loading = Promise.all(sampleList().map(function (s) {
      return fetch(b + s[1] + ".mp3")
        .then(function (r) { if (!r.ok) throw new Error("http"); return r.arrayBuffer(); })
        .then(function (ab) { return new Promise(function (res, rej) { ctx.decodeAudioData(ab, res, rej); }); })
        .then(function (buf) { buffers[s[0]] = buf; listeners.forEach(function (f) { f(status()); }); })
        .catch(function () { /* thiếu một mẫu: các nốt gần đó dùng mẫu khác */ });
    }));
    return loading;
  }

  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function nearestSample(m) {
    let best = null, bd = 99;
    Object.keys(buffers).forEach(function (k) { const d = Math.abs(Number(k) - m); if (d < bd) { bd = d; best = Number(k); } });
    return bd <= 4 ? best : null;
  }

  function playSynth(c, midi, t, d, peak) {
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    g.gain.exponentialRampToValueAtTime(peak * 0.35, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    g.connect(out());
    const f = midiToFreq(midi);
    [["triangle", 1, 1], ["sine", 2, 0.25]].forEach(function (spec) {
      const o = c.createOscillator(), og = c.createGain();
      o.type = spec[0]; o.frequency.value = f * spec[1]; og.gain.value = spec[2];
      o.connect(og).connect(g); o.start(t); o.stop(t + d + 0.05);
    });
  }

  /* Phát một nốt: midi, thời điểm bắt đầu (giây theo AudioContext), độ dài, âm lượng 0–1 */
  function playNote(midi, when, dur, gain) {
    const c = getCtx();
    if (!c) return;
    const t = (when === undefined ? c.currentTime : when) + 0.02;
    const d = dur || 1.0, peak = gain || 0.22;
    const s = mode() === "piano" ? nearestSample(midi) : null;
    if (s === null) { playSynth(c, midi, t, d, peak); return; }
    const src = c.createBufferSource(), g = c.createGain();
    src.buffer = buffers[s];
    src.playbackRate.value = Math.pow(2, (midi - s) / 12);
    const vol = Math.min(1, peak * 3.2);
    g.gain.setValueAtTime(vol, t);
    g.gain.setValueAtTime(vol, t + Math.max(0.05, d - 0.05));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.35);
    src.connect(g).connect(out());
    src.start(t); src.stop(t + d + 0.4);
  }

  function click(when, accent) {
    const c = getCtx();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "square"; o.frequency.value = accent ? 1500 : 1000;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(accent ? 0.3 : 0.18, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
    o.connect(g).connect(out());
    o.start(when); o.stop(when + 0.06);
  }

  /* Hộp chọn âm thanh: .oz-sound-setting */
  function mountSetting(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML = '<div class="oz-row"><span class="oz-stats">Âm thanh cho các công cụ:</span>' +
      '<label><input type="radio" name="oz-sound" value="piano"> Đàn piano thật (mẫu âm)</label>' +
      '<label><input type="radio" name="oz-sound" value="synth"> Âm tổng hợp (nhẹ, không cần tải)</label>' +
      '<button class="oz-btn" data-act="test">Nghe thử</button></div><div class="oz-stats oz-sound-status"></div>';
    const st = root.querySelector(".oz-sound-status");
    root.querySelectorAll('input[name="oz-sound"]').forEach(function (r) { r.checked = r.value === mode(); r.addEventListener("change", function () { setMode(r.value); }); });
    function show(s) {
      st.textContent = s.mode === "synth" ? "Đang dùng âm tổng hợp." :
        (s.ready ? "Đã tải đủ " + s.total + " mẫu âm piano." : (s.loaded ? "Đang tải mẫu âm: " + s.loaded + "/" + s.total + "…" : "Mẫu âm piano (khoảng 2 MB) sẽ được tải khi bạn bấm phát lần đầu."));
    }
    onStatus(show); show(status());
    root.querySelector('[data-act="test"]').addEventListener("click", function () {
      const c = getCtx(); if (!c) return;
      const go = function () { const t = c.currentTime; [60, 64, 67, 72].forEach(function (m, i) { playNote(m, t + i * 0.3, 0.8); }); [60, 64, 67, 72].forEach(function (m) { playNote(m, t + 1.3, 1.5, 0.12); }); };
      if (mode() === "piano" && !status().ready && loading) loading.then(go); else go();
    });
  }
  function init() { document.querySelectorAll(".oz-sound-setting").forEach(mountSetting); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);

  window.OZAudio = { getCtx: getCtx, playNote: playNote, click: click, midiToFreq: midiToFreq, output: out, mode: mode, setMode: setMode, status: status, onStatus: onStatus, load: function () { getCtx(); return load(); } };
})();
