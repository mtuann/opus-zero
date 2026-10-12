// Kiểm thử đơn vị cho các hàm thuần: nhạc lý, chấm điểm, kế hoạch, sinh bài tập.
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

function load(...files) {
  const win = {};
  const ctx = vm.createContext({ window: win, document: { querySelectorAll: () => [], addEventListener() {}, readyState: "complete" }, console, Math, Date, JSON });
  for (const f of files) vm.runInContext(fs.readFileSync(new URL("../docs/assets/js/" + f, import.meta.url), "utf8"), ctx);
  return win;
}
let n = 0;
const test = (name, fn) => { fn(); n++; };

const T = load("theory.js").OZTheory;
const sci = (a) => a.map(T.sci).join(" ");
test("gam trưởng có tên nốt đúng", () => {
  assert.equal(sci(T.scale("F#4", "major")), "F♯4 G♯4 A♯4 B4 C♯5 D♯5 E♯5 F♯5");
  assert.equal(sci(T.scale("Eb4", "natural")), "E♭4 F4 G♭4 A♭4 B♭4 C♭5 D♭5 E♭5");
  assert.equal(sci(T.scale("D4", "pentaMajor")), "D4 E4 F♯4 A4 B4 D5");
});
test("hợp âm và cao độ midi", () => {
  assert.equal(sci(T.chord("B4", "dim7")), "B4 D5 F5 A♭5");
  assert.equal(T.midiOf("C4"), 60); assert.equal(T.midiOf("Cb4"), 59);
  assert.equal(T.sigText(-3), "3 dấu giáng: B♭, E♭, A♭");
});

const A = load("assess.js").OZAssess;
const mf = (m) => 440 * Math.pow(2, (m - 69) / 12);
test("chấm cao độ qua micro", () => {
  const exp = [{ t0: 0, dur: .5, midi: 60 }, { t0: .5, dur: .5, midi: 62 }, { t0: 1, dur: .5, midi: 64 }, { t0: 1.5, dur: .5, midi: 65 }];
  const fr = [];
  for (let t = 0; t < 2; t += .03) { let m = t < .5 ? 60 : t < 1 ? 62.3 : t < 1.5 ? 52 : null; fr.push({ t, f: m === null ? -1 : mf(m) }); }
  assert.deepEqual(A.assessPitch(exp, fr).map((r) => r.status), ["ok", "ok", "low", "missing"]);
  assert.deepEqual(A.assessPitch(exp, fr, { octaveFree: true }).map((r) => r.status), ["ok", "ok", "ok", "missing"]);
  assert.equal(A.assessPitch(exp, fr, { tol: 20 })[1].status, "high");
});
test("chấm phím MIDI theo thời gian", () => {
  const exp = [{ t0: 0, dur: .5, midi: 60 }, { t0: .5, dur: .5, midi: 62 }, { t0: 1, dur: .5, midi: 64 }];
  const r = A.assessMidi(exp, [{ t: .02, midi: 60 }, { t: .55, midi: 63 }, { t: 1.4, midi: 64 }], .5);
  assert.deepEqual(r.notes.map((x) => x.status), ["ok", "high", "missing"]);
  assert.equal(r.extra, 1);
});

const P = load("plan.js").OZPlan;
test("kế hoạch ưu tiên kỹ năng yếu và chỉ một kỹ năng mới", () => {
  const r = P.compute({ today: "2026-10-12", lessons: { "08-hoa-bieu": 1 }, cardsDue: 0, skills: {
    notes: { n: 40, ema: .95, last: "2026-10-12" }, intervals: { n: 30, ema: .45, last: "2026-10-11" }, rhythm: { n: 10, ema: .9, last: "2026-10-06" } } });
  const skills = r.plan.filter((p) => p.kind === "skill").map((p) => p.name);
  assert.equal(skills[0], "Nhận biết quãng");
  const fresh = r.rows.filter((x) => x.n === 0 && skills.includes(x.name));
  assert.ok(fresh.length <= 1);
});
test("người mới: bài học đầu tiên và khóa kỹ năng nâng cao", () => {
  const r = P.compute({ today: "2026-10-12", skills: {}, lessons: {}, cardsDue: 0 });
  assert.match(r.plan[0].name, /Cao độ và tên nốt/);
  assert.ok(r.rows.find((x) => x.id === "chords").unlocked === false);
});

const R = load("rhythm.js").OZRhythm;
test("tiết tấu sinh ra luôn đủ 4 phách mỗi ô", () => {
  for (const lv of [1, 2, 3, 4]) for (let i = 0; i < 200; i++) for (const bar of R.gen(lv, 2)) assert.equal(bar.reduce((s, x) => s + x[0], 0), 48);
});
const S = load("theory.js", "sight-reading.js").OZSight;
test("giai điệu thị tấu đủ 4 phách mỗi ô", () => {
  for (const k of ["C", "G", "F", "D", "Bb"]) for (const lv of [1, 2, 3]) for (let i = 0; i < 50; i++) for (const bar of S.gen(k, lv).bars) assert.equal(bar.reduce((s, x) => s + x[1], 0), 4);
});
const PA = load("playalong.js").OZPlayalong;
test("bài chơi theo chia hết ô 4/4", () => {
  for (const s of Object.values(PA.SONGS)) assert.equal(s.notes.reduce((a, x) => a + x[1], 0) % 4, 0);
});
const D = load("dictation.js").OZDictation;
test("chép giai điệu: đúng số nốt, bắt đầu ở Đô4", () => {
  for (const lv of [1, 2, 3]) for (let i = 0; i < 100; i++) { const m = D.gen(lv); assert.equal(m.length, { 1: 4, 2: 6, 3: 8 }[lv]); assert.equal(m[0], 60); }
});
const RC = load("recognition.js").OZRecognition;
test("dữ liệu nhận diện", () => {
  assert.equal(Object.keys(RC.EX).length, 10);
  assert.equal(RC.TRACKS.length, 10);
  assert.equal(RC.FJ.reduce((s, x) => s + x[1], 0), 32);
  for (const t of RC.TRACKS) assert.ok(t.sources.length >= 1 && t.page.startsWith("https://commons.wikimedia.org/"));
});
const L = load("listen.js").OZListen;
test("đọc link YouTube", () => {
  assert.equal(L.videoId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(L.videoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30"), "dQw4w9WgXcQ");
  assert.equal(L.videoId("không phải link"), null);
});
console.log("unit:", n, "nhóm kiểm thử đều đạt");
