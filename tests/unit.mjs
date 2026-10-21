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
test("người mới: bắt đầu bên đàn, vẫn có bài nhạc lý đầu tiên, khóa kỹ năng nâng cao", () => {
  const r = P.compute({ today: "2026-10-12", skills: {}, lessons: {}, cardsDue: 0 });
  assert.equal(r.plan[0].kind, "piano");
  assert.match(r.plan[0].url, /hai-tuan-dau/);
  assert.ok(r.plan.some((p) => /Cao độ và tên nốt/.test(p.name)));
  assert.ok(r.rows.find((x) => x.id === "chords").unlocked === false);
});
test("bài đang tập lên đầu kế hoạch (bài lâu chưa tập trước), gam theo chặng và đổi mỗi tuần", () => {
  const r = P.compute({ today: "2026-10-12", skills: {}, lessons: {}, cardsDue: 0, piano: { stage: 3, rep: {
    "piano/tac-pham/fur-elise/": { name: "Für Elise", status: "learning", last: "2026-10-11" },
    "piano/tac-pham/minuet-sol/": { name: "Minuet", status: "learning", last: "2026-10-01" },
    "piano/tac-pham/mozart-k545/": { name: "K. 545", status: "done", last: "2026-09-01" } } } });
  assert.equal(r.plan[0].kind, "piano");
  assert.match(r.plan[0].name, /^Khởi động: gam .+ trưởng và .+ thứ/);
  assert.deepEqual([...r.plan.filter((p) => p.kind === "piece").map((p) => p.name)], ["Tập bài: Minuet", "Tập bài: Für Elise"]);
  assert.ok(r.plan.filter((p) => p.kind === "skill").length <= 2);
  assert.notEqual(P.warmup(3, "2026-10-12").name, P.warmup(3, "2026-10-19").name);
  assert.equal(P.warmup(3, "2026-10-12").name, P.warmup(3, "2026-10-18").name);
});

const S2 = load("sight2.js").OZSight2;
test("thị tấu hai tay: đủ phách, trong thế năm ngón, phách mạnh thuộc hợp âm, kết về chủ âm", () => {
  const CH = { I: [1, 3, 5], IV: [4, 6, 1], V: [5, 7, 2] };
  for (const lv of [1, 2, 3, 4]) for (let i = 0; i < 300; i++) {
    const ex = S2.gen(lv), n = ex.meter === "3/4" ? 3 : 4, strong = n === 3 ? [0] : [0, 2];
    for (const hand of [ex.rh, ex.lh]) for (const bar of hand) if (bar) {
      assert.equal(bar.reduce((s, x) => s + x[1], 0), n);
      for (const x of bar) assert.ok(x[0] >= 1 && x[0] <= 5, "ngoài thế năm ngón: " + x[0]);
    }
    const last = (lv === 1 ? ex.lh : ex.rh)[3];
    assert.equal(last[last.length - 1][0], 1);
    if (lv >= 2) ex.rh.forEach((bar, b) => { let t = 0; for (const x of bar) { if (strong.includes(t)) assert.ok(CH[ex.plan[b]].includes(x[0]), ex.abc); t += x[1]; } });
    assert.match(ex.abc, /%%score \{RH LH\}/);
    assert.equal((ex.abc.match(/\|\]/g) || []).length, 2);
  }
  assert.equal(S2.abcNote(28), "C"); assert.equal(S2.abcNote(17), "F,,"); assert.equal(S2.abcNote(36), "d");
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
test("đọc link YouTube và link file âm thanh", () => {
  assert.equal(L.audioUrl("https://example.org/nhac/a.mp3"), "https://example.org/nhac/a.mp3");
  assert.equal(L.audioUrl("https://commons.wikimedia.org/wiki/Special:FilePath/FurElise.ogg"), "https://commons.wikimedia.org/wiki/Special:FilePath/FurElise.ogg");
  assert.equal(L.audioUrl("https://example.org/a.mp3?x=1"), "https://example.org/a.mp3?x=1");
  assert.equal(L.audioUrl("https://youtu.be/dQw4w9WgXcQ"), null);
  assert.equal(L.audioUrl("https://example.org/trang.html"), null);
  assert.equal(L.audioUrl("ftp://example.org/a.mp3"), null);
  const s1 = L.switchSource({ url: "", marks: { 0: 3 } }, "https://youtu.be/dQw4w9WgXcQ");
  assert.deepEqual([s1.url, s1.marks[0]], ["https://youtu.be/dQw4w9WgXcQ", 3]);   /* bản đầu tiên nhận mốc đang có */
  const s2 = L.switchSource(s1, "file:ban-thu.mp3");
  assert.deepEqual([Object.keys(s2.marks).length, s2.byUrl["https://youtu.be/dQw4w9WgXcQ"][0]], [0, 3]);
  const s3 = L.switchSource(Object.assign({}, s2, { marks: { 1: 9 } }), "https://youtu.be/dQw4w9WgXcQ");
  assert.deepEqual([s3.marks[0], s3.byUrl["file:ban-thu.mp3"][1]], [3, 9]);  /* quay lại bản cũ: mốc cũ trở về */
  assert.equal(L.switchSource(s3, s3.url), s3);
  assert.equal(L.videoId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(L.videoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30"), "dQw4w9WgXcQ");
  assert.equal(L.videoId("không phải link"), null);
});
const VZ = load("viz.js").OZViz;
test("piano roll tô màu theo kết quả chấm", () => {
  const exp = [{ t0: 0, dur: .5, midi: 60, status: "ok" }, { t0: .5, dur: .5, midi: 62, status: "high" }, { t0: 1, dur: .5, midi: 64, status: "missing" }];
  const out = VZ.pianoRoll({ expected: exp, frames: [{ t: .1, f: 261.6 }, { t: .6, f: 300 }, { t: .7, f: -1 }] });
  assert.equal((out.match(/<rect /g) || []).length, 3);
  assert.ok(out.includes("#2e7d4f") && out.includes("#b3412e") && out.includes("#999"));
  assert.equal((out.match(/<circle /g) || []).length, 2); /* khung không có tiếng (f = -1) bị bỏ */
  assert.equal(VZ.pianoRoll({ expected: [] }), "");
});
test("dải nhịp: phân loại đúng, sớm, muộn, thừa", () => {
  const out = VZ.tapStrip({ expected: [1, 2, 3], taps: [1.01, 1.9, 3.1, 3.6], beat: 1, start: 1, beats: 4, tol: 0.15 });
  assert.ok(out.includes('fill="#2e7d4f"'));   /* 1.01: đúng lúc */
  assert.ok(out.includes('fill="#2f5582"'));   /* 1.9: sớm */
  assert.ok(out.includes('fill="#b3412e"'));   /* 3.1: muộn */
  assert.equal((out.match(/fill="none" stroke="#999"/g) || []).length, 1); /* 3.6: thừa */
});
test("bàn phím nhỏ và so sánh chép giai điệu", () => {
  const k = VZ.miniKeys([60, 64, 67]);
  assert.equal((k.match(/fill="#e0b45e"/g) || []).length, 3);
  const c = VZ.compareRoll([60, 62, 64], [60, 65, 64]);
  assert.equal((c.match(/<circle /g) || []).length, 1); /* chỉ nốt sai mới có chấm đỏ */
});
test("biểu đồ tuần cộng dồn đúng", () => {
  assert.equal(VZ.weekKey("2026-10-14"), "2026-10-12"); /* thứ Tư → thứ Hai cùng tuần */
  const w = VZ.weekly({ "2026-10-12": [10, 8], "2026-10-15": [10, 10], "2026-10-05": [4, 1], "2025-01-01": [99, 0] }, "2026-10-16", 12);
  assert.equal(w.length, 12);
  assert.deepEqual([w[11].n, w[11].c], [20, 18]);
  assert.deepEqual([w[10].n, w[10].c], [4, 1]);
  assert.equal(w.reduce((s, x) => s + x.n, 0), 24); /* dữ liệu quá 12 tuần bị bỏ */
});
const LS = load("listen.js").OZListen;
test("bản đồ nghe chọn đúng dòng đang nghe", () => {
  const marks = { 0: 5, 2: 40, 3: 90 };
  assert.equal(LS.activeRow(3, marks), -1);
  assert.equal(LS.activeRow(10, marks), 0);
  assert.equal(LS.activeRow(39.8, marks), 2); /* cho phép sớm 0,25 giây */
  assert.equal(LS.activeRow(500, marks), 3);
});
{
  const winA = {}; const ctxA = vm.createContext({ window: winA, document: { querySelectorAll: () => [], addEventListener() {}, body: { }, readyState: "complete" }, MutationObserver: function () { this.observe = () => {}; }, getComputedStyle: () => ({ getPropertyValue: () => "" }), console });
  vm.runInContext(fs.readFileSync(new URL("../docs/assets/js/abc.js", import.meta.url), "utf8"), ctxA);
  test("con trỏ khuông bật và tắt đúng nốt", () => {
    const mk = () => { const set = new Set(); return { classList: { add: (c) => set.add(c), remove: (c) => set.delete(c), has: (c) => set.has(c) } }; };
    const a = mk(), b = mk(), c = mk(), cur = winA.OZAbc.cursor();
    cur.onEvent({ elements: [[a, b]] });
    assert.ok(a.classList.has("oz-playing") && b.classList.has("oz-playing"));
    cur.onEvent({ elements: [[c]] });
    assert.ok(!a.classList.has("oz-playing") && c.classList.has("oz-playing"));
    cur.onFinished();
    assert.ok(!c.classList.has("oz-playing"));
  });
}
console.log("unit:", n, "nhóm kiểm thử đều đạt");
