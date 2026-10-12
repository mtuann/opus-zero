/* Chấm điểm khi chơi theo hoặc hát theo: hàm thuần, không phụ thuộc trình duyệt. */
(function (root) {
  "use strict";
  function freqToMidi(f) { return 69 + 12 * Math.log2(f / 440); }
  function median(a) { const s = a.slice().sort(function (x, y) { return x - y; }); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN; }

  /* expected: [{t0, dur, midi}] (giây); frames: [{t, f}] từ micro.
     opts.octaveFree: bỏ qua quãng tám (giọng nam/nữ, guitar); opts.tol: dung sai (cent, mặc định 50). */
  function assessPitch(expected, frames, opts) {
    opts = opts || {};
    const tol = opts.tol || 50;
    return expected.map(function (n) {
      const a = n.t0 + n.dur * 0.2, b = n.t0 + n.dur * 0.85;
      const ms = frames.filter(function (fr) { return fr.t >= a && fr.t <= b && fr.f > 0; }).map(function (fr) { return freqToMidi(fr.f); });
      if (ms.length < 2) return { midi: n.midi, status: "missing" };
      let got = median(ms);
      let diff = (got - n.midi) * 100;
      if (opts.octaveFree) { while (diff > 600) diff -= 1200; while (diff < -600) diff += 1200; }
      diff = Math.round(diff);
      const status = Math.abs(diff) <= tol ? "ok" : (diff > 0 ? "high" : "low");
      return { midi: n.midi, got: got, cents: diff, status: status };
    });
  }

  /* events: [{t, midi}] từ đàn MIDI. Mỗi nốt mong đợi ghép với lần bấm gần nhất trong cửa sổ thời gian. */
  function assessMidi(expected, events, beatSec, opts) {
    opts = opts || {};
    const win = Math.max(0.12, beatSec * 0.35);
    const used = {};
    const res = expected.map(function (n) {
      let best = -1, bd = 1e9;
      events.forEach(function (e, i) {
        if (used[i]) return;
        const d = Math.abs(e.t - n.t0);
        if (d <= win && d < bd) { bd = d; best = i; }
      });
      if (best < 0) return { midi: n.midi, status: "missing" };
      used[best] = true;
      const e = events[best];
      const pitchOk = opts.octaveFree ? ((e.midi - n.midi) % 12 + 12) % 12 === 0 : e.midi === n.midi;
      return { midi: n.midi, got: e.midi, offset: Math.round((e.t - n.t0) * 1000), status: pitchOk ? "ok" : (e.midi > n.midi ? "high" : "low") };
    });
    const extra = events.filter(function (e, i) { return !used[i]; }).length;
    return { notes: res, extra: extra };
  }

  /* Hát lại một nốt: lấy cao độ ổn định nhất trong các khung có tiếng */
  function stablePitch(frames) {
    const ms = frames.filter(function (f) { return f.f > 0; }).map(function (f) { return freqToMidi(f.f); });
    if (ms.length < 5) return null;
    const med = median(ms);
    const near = ms.filter(function (m) { return Math.abs(m - med) < 0.5; });
    return near.length >= ms.length * 0.5 ? median(near) : null;
  }

  function summary(notes) {
    const ok = notes.filter(function (n) { return n.status === "ok"; }).length;
    return { ok: ok, total: notes.length, pct: notes.length ? Math.round(100 * ok / notes.length) : 0 };
  }

  root.OZAssess = { assessPitch: assessPitch, assessMidi: assessMidi, stablePitch: stablePitch, summary: summary, freqToMidi: freqToMidi, median: median };
})(typeof window !== "undefined" ? window : this);
