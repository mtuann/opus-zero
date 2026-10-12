/* Lõi nhạc lý dùng chung: tên nốt, gam, hợp âm, hóa biểu, đổi sang ký hiệu ABC. */
(function () {
  "use strict";
  const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
  const SOLFEGE = ["Đô", "Rê", "Mi", "Fa", "Sol", "La", "Si"];
  const NAT = [0, 2, 4, 5, 7, 9, 11];
  const ACC_SYM = { "-2": "𝄫", "-1": "♭", "0": "", "1": "♯", "2": "𝄪" };
  const ACC_ABC = { "-2": "__", "-1": "_", "0": "", "1": "^", "2": "^^" };

  /* Công thức tính theo nửa cung từ chủ âm */
  const SCALES = {
    major: { name: "Gam trưởng", steps: [0, 2, 4, 5, 7, 9, 11] },
    natural: { name: "Gam thứ tự nhiên", steps: [0, 2, 3, 5, 7, 8, 10] },
    harmonic: { name: "Gam thứ hòa âm", steps: [0, 2, 3, 5, 7, 8, 11] },
    melodic: { name: "Gam thứ giai điệu (đi lên)", steps: [0, 2, 3, 5, 7, 9, 11] },
    dorian: { name: "Điệu Dorian", steps: [0, 2, 3, 5, 7, 9, 10] },
    phrygian: { name: "Điệu Phrygian", steps: [0, 1, 3, 5, 7, 8, 10] },
    lydian: { name: "Điệu Lydian", steps: [0, 2, 4, 6, 7, 9, 11] },
    mixolydian: { name: "Điệu Mixolydian", steps: [0, 2, 4, 5, 7, 9, 10] },
    locrian: { name: "Điệu Locrian", steps: [0, 1, 3, 5, 6, 8, 10] },
    pentaMajor: { name: "Ngũ cung trưởng", steps: [0, 2, 4, 7, 9], letters: [0, 1, 2, 4, 5] },
    pentaMinor: { name: "Ngũ cung thứ", steps: [0, 3, 5, 7, 10], letters: [0, 2, 3, 4, 6] }
  };
  /* Hợp âm: [bậc chữ cái so với nốt gốc, số nửa cung] */
  const CHORDS = {
    maj: { name: "Hợp âm trưởng", sym: "", tones: [[0, 0], [2, 4], [4, 7]] },
    min: { name: "Hợp âm thứ", sym: "m", tones: [[0, 0], [2, 3], [4, 7]] },
    dim: { name: "Hợp âm giảm", sym: "°", tones: [[0, 0], [2, 3], [4, 6]] },
    aug: { name: "Hợp âm tăng", sym: "+", tones: [[0, 0], [2, 4], [4, 8]] },
    maj7: { name: "Hợp âm bảy trưởng", sym: "maj7", tones: [[0, 0], [2, 4], [4, 7], [6, 11]] },
    dom7: { name: "Hợp âm bảy át", sym: "7", tones: [[0, 0], [2, 4], [4, 7], [6, 10]] },
    min7: { name: "Hợp âm bảy thứ", sym: "m7", tones: [[0, 0], [2, 3], [4, 7], [6, 10]] },
    hdim7: { name: "Hợp âm bảy nửa giảm", sym: "ø7", tones: [[0, 0], [2, 3], [4, 6], [6, 10]] },
    dim7: { name: "Hợp âm bảy giảm", sym: "°7", tones: [[0, 0], [2, 3], [4, 6], [6, 9]] }
  };

  /* 15 giọng trưởng theo vòng quãng năm. n > 0: số dấu thăng, n < 0: số dấu giáng */
  const KEYS = [
    { tonic: "C", n: 0, minor: "A" }, { tonic: "G", n: 1, minor: "E" }, { tonic: "D", n: 2, minor: "B" },
    { tonic: "A", n: 3, minor: "F#" }, { tonic: "E", n: 4, minor: "C#" }, { tonic: "B", n: 5, minor: "G#" },
    { tonic: "F#", n: 6, minor: "D#" }, { tonic: "C#", n: 7, minor: "A#" },
    { tonic: "F", n: -1, minor: "D" }, { tonic: "Bb", n: -2, minor: "G" }, { tonic: "Eb", n: -3, minor: "C" },
    { tonic: "Ab", n: -4, minor: "F" }, { tonic: "Db", n: -5, minor: "Bb" }, { tonic: "Gb", n: -6, minor: "Eb" },
    { tonic: "Cb", n: -7, minor: "Ab" }
  ];
  const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
  const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

  /* "F#4", "Bb3", "C" → { l: chỉ số chữ cái, a: dấu hóa, o: quãng tám } */
  function parse(s) {
    const m = /^([A-Ga-g])(##|bb|#|b|x)?(-?\d+)?$/.exec(String(s).trim());
    if (!m) return null;
    const a = { "#": 1, "##": 2, x: 2, b: -1, bb: -2 }[m[2]] || 0;
    return { l: LETTERS.indexOf(m[1].toUpperCase()), a: a, o: m[3] === undefined ? 4 : Number(m[3]) };
  }
  function midi(n) { return 12 * (n.o + 1) + NAT[n.l] + n.a; }
  function midiOf(s) { const n = parse(s); return n ? midi(n) : null; }
  function letterName(n) { return LETTERS[n.l] + ACC_SYM[n.a]; }
  function viName(n) { return SOLFEGE[n.l] + ACC_SYM[n.a]; }
  function sci(n) { return letterName(n) + n.o; }
  function abc(n, explicitAcc) {
    let s = (explicitAcc === false ? "" : ACC_ABC[n.a]);
    const L = LETTERS[n.l];
    if (n.o >= 5) s += L.toLowerCase() + "'".repeat(n.o - 5);
    else s += L + ",".repeat(4 - n.o);
    return s;
  }
  function keyAbc(name) { return name.replace("#", "#").replace(/b$/, "b"); }

  /* Xây chuỗi nốt có tên đúng (mỗi chữ cái một lần) từ nốt gốc và công thức */
  function spell(root, pattern) {
    const r = typeof root === "string" ? parse(root) : root;
    const rootPc = NAT[r.l] + r.a;
    return pattern.map(function (p) {
      const step = p[0], semis = p[1];
      const l = (r.l + step) % 7;
      const o = r.o + Math.floor((r.l + step) / 7);
      let a = (rootPc + semis) - (NAT[l] + 12 * Math.floor((r.l + step) / 7));
      return { l: l, a: a, o: o };
    });
  }
  function scale(root, type) {
    const sc = SCALES[type];
    const letters = sc.letters || sc.steps.map(function (_, i) { return i; });
    return spell(root, sc.steps.map(function (s, i) { return [letters[i], s]; }).concat([[7, 12]]));
  }
  function chord(root, type) { return spell(root, CHORDS[type].tones); }

  /* Dấu hóa theo hóa biểu cho từng chữ cái */
  function keyAccidentals(n) {
    const acc = [0, 0, 0, 0, 0, 0, 0];
    if (n > 0) SHARP_ORDER.slice(0, n).forEach(function (L) { acc[LETTERS.indexOf(L)] = 1; });
    if (n < 0) FLAT_ORDER.slice(0, -n).forEach(function (L) { acc[LETTERS.indexOf(L)] = -1; });
    return acc;
  }
  function keyByTonic(t) { return KEYS.filter(function (k) { return k.tonic === t; })[0]; }
  function prettyKey(t) { const n = parse(t + "4"); return letterName(n); }
  function prettyKeyVi(t) { const n = parse(t + "4"); return viName(n); }
  function sigText(n) {
    if (n === 0) return "không có dấu hóa";
    const list = (n > 0 ? SHARP_ORDER.slice(0, n) : FLAT_ORDER.slice(0, -n))
      .map(function (L) { return L + (n > 0 ? "♯" : "♭"); });
    return Math.abs(n) + (n > 0 ? " dấu thăng: " : " dấu giáng: ") + list.join(", ");
  }

  window.OZTheory = {
    LETTERS: LETTERS, SOLFEGE: SOLFEGE, NAT: NAT, SCALES: SCALES, CHORDS: CHORDS, KEYS: KEYS,
    SHARP_ORDER: SHARP_ORDER, FLAT_ORDER: FLAT_ORDER,
    parse: parse, midi: midi, midiOf: midiOf, letterName: letterName, viName: viName, sci: sci, abc: abc,
    spell: spell, scale: scale, chord: chord, keyAccidentals: keyAccidentals, keyByTonic: keyByTonic,
    prettyKey: prettyKey, prettyKeyVi: prettyKeyVi, sigText: sigText, keyAbc: keyAbc
  };
})();
