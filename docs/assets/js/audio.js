/* Âm thanh dùng chung cho các công cụ luyện tập (Web Audio API, không cần thư viện). */
(function () {
  "use strict";
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function midiToFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  /* Một nốt "giống đàn" đơn giản: hai dao động + đường bao tắt dần. */
  function playNote(midi, when, dur, gain) {
    const c = getCtx();
    if (!c) return;
    const t = (when === undefined ? c.currentTime : when) + 0.02;
    const d = dur || 1.0;
    const g = c.createGain();
    const peak = gain || 0.22;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    g.gain.exponentialRampToValueAtTime(peak * 0.35, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    g.connect(c.destination);

    const f = midiToFreq(midi);
    [["triangle", 1, 1], ["sine", 2, 0.25]].forEach(function (spec) {
      const o = c.createOscillator();
      const og = c.createGain();
      o.type = spec[0];
      o.frequency.value = f * spec[1];
      og.gain.value = spec[2];
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + d + 0.05);
    });
  }

  function click(when, accent) {
    const c = getCtx();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "square";
    o.frequency.value = accent ? 1500 : 1000;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(accent ? 0.3 : 0.18, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
    o.connect(g).connect(c.destination);
    o.start(when);
    o.stop(when + 0.06);
  }

  window.OZAudio = { getCtx: getCtx, playNote: playNote, click: click, midiToFreq: midiToFreq };
})();
