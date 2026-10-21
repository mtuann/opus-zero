/* Thị tấu hai tay (.oz-sight2): sinh bài 4 ô nhịp trên khuông kép theo 4 cấp, chơi trên đàn thật rồi tự chấm.
   Hàm sinh bài (OZSight2.gen) là hàm thuần, có kiểm thử trong tests/unit.mjs. */
(function (root) {
  "use strict";
  const LETTERS = "CDEFGAB";
  /* Bậc tuyệt đối: Đô4 = 28 (quãng tám × 7 + chữ cái) */
  function abcNote(v) {
    const l = LETTERS[((v % 7) + 7) % 7], o = Math.floor(v / 7);
    return o >= 5 ? l.toLowerCase() + "'".repeat(o - 5) : l + ",".repeat(4 - o);
  }
  /* giọng: [K: của abc, tên, chủ âm tay phải, chủ âm tay trái]; mỗi tay ở thế năm ngón từ chủ âm */
  const KEYS = {
    C: ["C", "Đô trưởng", 28, 21], G: ["G", "Sol trưởng", 32, 18], F: ["F", "Fa trưởng", 31, 17], D: ["D", "Rê trưởng", 29, 22],
    Am: ["Am", "La thứ", 33, 19], Dm: ["Dm", "Rê thứ", 29, 22], Em: ["Em", "Mi thứ", 30, 23]
  };
  const LEVELS = {
    1: { name: "Đô trưởng, hai tay lần lượt", keys: ["C"], meters: ["4/4"], q: 60 },
    2: { name: "tay trái giữ nốt dài", keys: ["C", "G", "F"], meters: ["4/4", "3/4"], q: 60 },
    3: { name: "tay trái theo hợp âm, có móc đơn", keys: ["C", "G", "F", "Am", "Dm"], meters: ["4/4", "3/4"], q: 66 },
    4: { name: "hợp âm rải, nhịp chấm dôi", keys: ["G", "D", "F", "Em", "Dm"], meters: ["4/4", "3/4"], q: 72 }
  };
  /* tiết tấu một ô (đơn vị: phách nốt đen) */
  const RHY = {
    "4/4": { 1: [[4], [2, 2], [1, 1, 2], [2, 1, 1], [1, 1, 1, 1]],
             2: [[2, 2], [1, 1, 2], [2, 1, 1], [1, 1, 1, 1], [3, 1]],
             3: [[1, 1, 1, 1], [0.5, 0.5, 1, 2], [1, 0.5, 0.5, 2], [2, 0.5, 0.5, 1], [1, 1, 2], [2, 1, 1]],
             4: [[1.5, 0.5, 1, 1], [1.5, 0.5, 2], [1, 1, 1.5, 0.5], [0.5, 0.5, 0.5, 0.5, 2], [2, 1, 1], [1, 0.5, 0.5, 2]] },
    "3/4": { 2: [[3], [2, 1], [1, 1, 1], [1, 2]],
             3: [[2, 1], [1, 1, 1], [0.5, 0.5, 1, 1], [1, 0.5, 0.5, 1], [1, 2]],
             4: [[1.5, 0.5, 1], [0.5, 0.5, 1, 1], [2, 1], [1, 1, 1], [1, 0.5, 0.5, 1]] }
  };
  const PLANS = [["I", "V", "V", "I"], ["I", "IV", "V", "I"], ["I", "I", "V", "I"]];
  const CHORD = { I: [1, 3, 5], IV: [4, 6, 1], V: [5, 7, 2] };
  /* tay trái theo hợp âm, các bậc nằm trong thế năm ngón (1–5) */
  const LH = {
    3: { "4/4": { I: [[1, 2], [5, 2]], IV: [[4, 2], [1, 2]], V: [[5, 2], [2, 2]] }, "3/4": { I: [[1, 2], [5, 1]], IV: [[4, 2], [1, 1]], V: [[5, 2], [2, 1]] } },
    4: { "4/4": { I: [[1, 1], [5, 1], [3, 1], [5, 1]], IV: [[4, 1], [1, 1], [4, 1], [1, 1]], V: [[5, 1], [2, 1], [4, 1], [2, 1]] },
         "3/4": { I: [[1, 1], [5, 1], [3, 1]], IV: [[4, 1], [1, 1], [4, 1]], V: [[5, 1], [2, 1], [4, 1]] } }
  };

  function pick(a, rnd) { return a[Math.floor(rnd() * a.length)]; }
  function clamp(d) { return Math.max(1, Math.min(5, d)); }
  function nearTone(tones, prev, rnd) {
    const best = Math.min.apply(null, tones.map(function (d) { return Math.abs(d - prev); }));
    let c = tones.filter(function (d) { return Math.abs(d - prev) <= best + 1; });
    const moved = c.filter(function (d) { return d !== prev; });
    if (moved.length && rnd() < 0.75) c = moved; /* tránh đứng yên một chỗ */
    return pick(c, rnd);
  }
  function stepFrom(prev, rnd, leaps) {
    const r = rnd();
    const s = r < 0.44 ? 1 : r < 0.88 ? -1 : r < 0.94 ? 0 : (rnd() < 0.5 ? 1 : -1) * (leaps ? 2 : 1);
    const d = prev + s;
    return d < 1 || d > 5 ? clamp(prev - s) : d;
  }
  /* Một ô giai điệu (bậc 1–5) theo hợp âm; phách mạnh luôn là âm của hợp âm.
     st = {prev, prev2}: hai nốt trước đó, để không lặp một nốt quá hai lần liền. */
  function melodyBar(chord, rhythm, st, strong, rnd, leaps, final) {
    const tones = chord ? CHORD[chord].filter(function (d) { return d >= 1 && d <= 5; }) : null;
    const out = [];
    let t = 0;
    rhythm.forEach(function (dur, i) {
      const isStrong = tones && strong.indexOf(t) >= 0;
      let d;
      if (final && i === rhythm.length - 1) d = 1;
      else if (isStrong) d = nearTone(tones, st.prev, rnd);
      else d = stepFrom(st.prev, rnd, leaps);
      if (!(final && i === rhythm.length - 1) && d === st.prev && st.prev === st.prev2) {
        const alt = isStrong ? tones.filter(function (x) { return x !== d; }) : [clamp(d + 1), clamp(d - 1)].filter(function (x) { return x !== d; });
        if (alt.length) d = nearTone(alt, st.prev, rnd);
      }
      out.push([d, dur]);
      st.prev2 = st.prev;
      st.prev = d;
      t += dur;
    });
    return out;
  }
  function len(m) { return m === "3/4" ? 3 : 4; }

  function gen(level, rnd) {
    rnd = rnd || Math.random;
    const L = LEVELS[level] || LEVELS[1];
    const key = pick(L.keys, rnd), meter = pick(L.meters, rnd), n = len(meter);
    const strong = meter === "3/4" ? [0] : [0, 2];
    const finalRhy = meter === "3/4" ? [3] : pick([[4], [2, 2]], rnd);
    const rh = [], lh = [];
    let plan = null;
    if (level <= 1) {
      /* hai ô tay phải rồi hai ô tay trái, mỗi tay một giai điệu ở thế năm ngón */
      const st = { prev: pick([1, 3, 5], rnd), prev2: 0 };
      for (let b = 0; b < 2; b++) { rh.push(melodyBar(null, pick(RHY["4/4"][1], rnd), st, strong, rnd, false, false)); lh.push(null); }
      const sl = { prev: pick([3, 5], rnd), prev2: 0 };
      rh.push(null); lh.push(melodyBar(null, pick(RHY["4/4"][1], rnd), sl, strong, rnd, false, false));
      rh.push(null); lh.push(melodyBar(null, finalRhy, sl, strong, rnd, false, true));
    } else {
      plan = pick(PLANS, rnd);
      const st = { prev: pick([1, 3, 5], rnd), prev2: 0 };
      plan.forEach(function (ch, b) {
        const last = b === 3;
        rh.push(melodyBar(ch, last ? finalRhy : pick(RHY[meter][level], rnd), st, strong, rnd, level >= 3, last));
        if (level === 2 || last) lh.push([[{ I: 1, IV: 4, V: 5 }[ch], n]]);
        else lh.push(LH[level][meter][ch].map(function (x) { return x.slice(); }));
      });
    }
    const k = KEYS[key];
    return { level: level, key: key, keyName: k[1], meter: meter, q: L.q, plan: plan, rh: rh, lh: lh, abc: toAbc(k, meter, L.q, rh, lh, n) };
  }

  function units(beats) { const u = Math.round(beats * 2); return u === 1 ? "" : String(u); }
  function voice(bars, tonic, n, finger) {
    let first = true;
    return bars.map(function (bar) {
      if (!bar) return "z" + units(n);
      let out = "", t = 0, prevE = false, prevBeat = -1;
      bar.forEach(function (x) {
        const tok = (first ? "!" + finger(x[0]) + "!" : "") + abcNote(tonic + x[0] - 1) + units(x[1]);
        first = false;
        const e = x[1] === 0.5, beam = e && prevE && Math.floor(t) === prevBeat;
        out += (out && !beam ? " " : "") + tok;
        prevE = e; prevBeat = Math.floor(t); t += x[1];
      });
      return out;
    }).join(" | ") + " |]";
  }
  function toAbc(k, meter, q, rh, lh, n) {
    return ["X:1", "M:" + meter, "L:1/8", "Q:1/4=" + q, "%%score {RH LH}", "V:RH clef=treble", "V:LH clef=bass", "K:" + k[0],
      "[V:RH] " + voice(rh, k[2], n, function (d) { return d; }),
      "[V:LH] " + voice(lh, k[3], n, function (d) { return 6 - d; })].join("\n");
  }

  /* ---------- Giao diện ---------- */
  const RATES = [["good", "Trôi chảy"], ["some", "Vấp vài chỗ"], ["bad", "Phải dừng nhiều"]];
  const FEED = {
    good: "Tốt. Bấm Bài mới để đọc tiếp.",
    some: "Lần sau nhìn kỹ hơn trước khi chơi và chọn tốc độ chậm hơn một chút.",
    bad: "Thử chậm hơn hẳn hoặc lùi một cấp: giữ nhịp quan trọng hơn đúng từng nốt."
  };
  function defaultLevel() {
    const P = root.OZProgress;
    const saved = P ? P.getStore("sight2Level", 0) : 0;
    if (saved) return saved;
    const lv = P ? P.getStore("pianoLevel", null) : null;
    return lv && lv.stage ? Math.max(1, Math.min(4, lv.stage)) : 1;
  }
  function mount(box) {
    if (box.dataset.ready) return;
    box.dataset.ready = "1";
    box.classList.add("oz-tool");
    const P = root.OZProgress;
    let level = defaultLevel(), ex = null, rated = false;
    box.innerHTML = '<div class="oz-row"><label>Cấp <select data-k="lv">' +
      [1, 2, 3, 4].map(function (l) { return '<option value="' + l + '"' + (l === level ? " selected" : "") + ">" + l + " · " + LEVELS[l].name + "</option>"; }).join("") +
      '</select></label><button type="button" class="oz-btn oz-btn--primary" data-k="new">Bài mới</button><span class="oz-stats" data-k="info"></span></div>' +
      '<div class="oz-sight2-score"></div>' +
      '<p class="oz-stats">Nhìn bài khoảng 30 giây, chơi một lượt không dừng, rồi mới bấm nghe để so sánh. Bạn chơi thế nào?</p>' +
      '<div class="oz-row" data-k="rate">' + RATES.map(function (r) { return '<button type="button" class="oz-btn" data-r="' + r[0] + '">' + r[1] + "</button>"; }).join("") + "</div>" +
      '<p class="oz-feedback" data-k="fb" aria-live="polite"></p><p class="oz-stats" data-k="stats"></p>';
    const q = function (s) { return box.querySelector(s); };
    function stats() {
      const hist = P ? P.getStore("sight2Hist", []) : [];
      const day = P ? (P.load().days[P.today()] || {}) : {};
      const recent = hist.slice(-10), good = recent.filter(function (h) { return h.r === "good"; }).length;
      q('[data-k="stats"]').textContent = (P ? "Hôm nay đã đọc " + (day.readings || 0) + " bài hai tay." : "") +
        (recent.length ? " Trong " + recent.length + " bài gần nhất: " + good + " bài trôi chảy." : "");
    }
    function fresh() {
      ex = gen(level);
      rated = false;
      const sc = q(".oz-sight2-score");
      sc.textContent = "";
      const el = document.createElement("div");
      el.className = "abc-notation";
      el.textContent = ex.abc;
      sc.appendChild(el);
      if (root.OZAbc && root.OZAbc.mount) root.OZAbc.mount(el);
      q('[data-k="info"]').textContent = ex.keyName + " · nhịp " + ex.meter + " · ♩ = " + ex.q;
      box.querySelectorAll("[data-r]").forEach(function (b) { b.disabled = false; });
      q('[data-k="fb"]').textContent = "";
      q('[data-k="fb"]').className = "oz-feedback";
    }
    q('[data-k="lv"]').addEventListener("change", function (e) {
      level = Number(e.target.value) || 1;
      if (P) P.setStore("sight2Level", level);
      fresh();
    });
    q('[data-k="new"]').addEventListener("click", fresh);
    q('[data-k="rate"]').addEventListener("click", function (e) {
      const b = e.target.closest("[data-r]");
      if (!b || rated || !ex) return;
      rated = true;
      const r = b.dataset.r;
      box.querySelectorAll("[data-r]").forEach(function (x) { x.disabled = true; });
      let msg = FEED[r];
      if (P) {
        P.skill("sight2", r === "good");
        P.record("readings", 1);
        const hist = P.getStore("sight2Hist", []);
        hist.push({ d: P.today(), l: level, r: r });
        P.setStore("sight2Hist", hist.slice(-50));
        const same = hist.filter(function (h) { return h.l === level; }).slice(-5);
        if (level < 4 && same.length === 5 && same.filter(function (h) { return h.r === "good"; }).length >= 4) msg += " Bốn trên năm bài gần nhất trôi chảy: bạn đã sẵn sàng lên cấp " + (level + 1) + ".";
      }
      const fb = q('[data-k="fb"]');
      fb.textContent = msg;
      fb.className = "oz-feedback " + (r === "good" ? "ok" : r === "bad" ? "bad" : "");
      stats();
    });
    fresh();
    stats();
  }

  root.OZSight2 = { gen: gen, LEVELS: LEVELS, KEYS: KEYS, abcNote: abcNote };
  function init() { document.querySelectorAll(".oz-sight2").forEach(mount); }
  (root.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})(window);
