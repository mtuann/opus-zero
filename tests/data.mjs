// Kiểm thử logic gộp dữ liệu (sao lưu / khôi phục) bằng dữ liệu ngẫu nhiên.
// Đây là phần có thể làm mất dữ liệu học của người dùng nếu sai, nên kiểm thử theo tính chất.
import fs from "node:fs";
import vm from "node:vm";
import strict from "node:assert/strict";
// Dữ liệu tạo trong vm có prototype khác; so sánh theo nội dung (JSON) thay vì theo prototype.
const plain = (x) => JSON.parse(JSON.stringify(x));
const assert = Object.assign((v, m) => strict.ok(v, m), strict, { deepEqual: (a, b, m) => strict.deepEqual(plain(a), plain(b), m) });

const win = {};
vm.runInContext(fs.readFileSync(new URL("../docs/assets/js/data.js", import.meta.url), "utf8"), vm.createContext({ window: win, JSON, Math, Object, Array, String, Number }));
const { merge, normalize, describe } = win.OZData;

let seed = 7;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const date = () => "2026-" + String(1 + Math.floor(rnd() * 10)).padStart(2, "0") + "-" + String(1 + Math.floor(rnd() * 28)).padStart(2, "0");
function gen() {
  const days = {};
  for (let i = 0; i < 1 + rnd() * 15; i++) days[date()] = { tasks: { "doc-not": rnd() < .5, nghe: rnd() < .3 }, note: rnd() < .3 ? pick(["Tập gam Sol", "Nghe Mozart 40", "Khó phần hóa biểu"]) : "", notes: Math.floor(rnd() * 30), intervals: Math.floor(rnd() * 20), minutes: Math.floor(rnd() * 10) };
  const store = { lessons: {}, skills: {}, cards: {}, noteStats: {}, blindLog: [], listen: {} };
  for (const l of ["01-cao-do-ten-not", "02-khuong-nhac-khoa", "08-hoa-bieu"]) if (rnd() < .5) store.lessons["/opus-zero/nhac-ly/" + l + "/"] = date();
  for (const s of ["notes", "intervals", "rhythm"]) if (rnd() < .6) store.skills[s] = { n: Math.floor(rnd() * 50), c: 0, ema: rnd(), last: date() };
  for (const c of ["Allegro", "Largo", "forte"]) if (rnd() < .6) store.cards[c] = { box: Math.floor(rnd() * 5), due: date(), added: date() };
  for (const k of ["treble:30", "bass:20"]) if (rnd() < .6) store.noteStats[k] = [Math.floor(rnd() * 20), Math.floor(rnd() * 5)];
  for (let i = 0; i < rnd() * 4; i++) store.blindLog.push({ d: date(), t: pick(["Bach", "Mozart", "Chopin"]), gp: pick(["baroque", "classical"]), ge: "solo", gc: "", ap: "baroque" });
  if (rnd() < .5) store.listen["/opus-zero/nghe-nhac/ravel-bolero/"] = { url: rnd() < .5 ? "https://youtu.be/abcdefghijk" : "", marks: { 0: 5, 2: Math.floor(rnd() * 99) } };
  if (rnd() < .3) store.placement = { done: true };
  store.checks = {};
  for (const pg of ["piano/lo-trinh/", "bat-dau/lo-trinh-choi/"]) if (rnd() < .6) { store.checks[pg] = {}; for (const it of ["a1", "b2", "c3"]) if (rnd() < .5) store.checks[pg][it] = date(); }
  store.repertoire = {};
  for (const pc of ["piano/tac-pham/fur-elise/", "piano/tac-pham/minuet-sol/"]) if (rnd() < .6) store.repertoire[pc] = { name: pc, status: pick(["learning", "done", "removed"]), since: date(), last: date(), n: Math.floor(rnd() * 9), updated: date() + "T0" + Math.floor(rnd() * 10) + ":00:00Z" };
  if (rnd() < .5) store.pianoLevel = { stage: 1 + Math.floor(rnd() * 7), date: date(), updated: date() + "T12:00:00Z" };
  store.skillHist = {};
  for (const sk of ["notes", "rhythm"]) if (rnd() < .7) { store.skillHist[sk] = {}; for (let i = 0; i < 1 + rnd() * 5; i++) { const n = Math.floor(rnd() * 20); store.skillHist[sk][date()] = [n, Math.floor(rnd() * (n + 1))]; } }
  return { days, store };
}
const numbers = (p) => Object.fromEntries(Object.entries(p.days).map(([d, x]) => [d, [x.notes || 0, x.intervals || 0, x.minutes || 0]]));
let checks = 0;
for (let i = 0; i < 300; i++) {
  const phone = gen(), laptop = gen();
  const a = merge(laptop, phone).merged;
  // 1. Bất biến: gộp lại cùng file không thay đổi gì
  assert.deepEqual(merge(a, phone).merged, a); checks++;
  const r2 = merge(a, phone).report; assert.equal(Object.values(r2).reduce((s, v) => s + v, 0), 0); checks++;
  // 2. Gộp với chính mình: không thay đổi
  assert.deepEqual(merge(laptop, laptop).merged.days, laptop.days); checks++;
  // 3. Không mất dữ liệu: mọi ngày, mọi bài, mọi lần nghe mù của cả hai máy đều còn; số liệu không giảm
  for (const p of [phone, laptop]) {
    for (const [d, x] of Object.entries(p.days)) {
      assert.ok(a.days[d]); assert.ok((a.days[d].notes || 0) >= (x.notes || 0)); assert.ok((a.days[d].minutes || 0) >= (x.minutes || 0));
      for (const [t, v] of Object.entries(x.tasks)) if (v) assert.equal(a.days[d].tasks[t], true);
      if (x.note) assert.ok(a.days[d].note.includes(x.note));
    }
    for (const l of Object.keys(p.store.lessons)) assert.ok(a.store.lessons[l]);
    for (const b of p.store.blindLog) assert.ok(a.store.blindLog.some((x) => x.d === b.d && x.t === b.t && x.gp === b.gp));
    for (const [c, v] of Object.entries(p.store.cards)) assert.ok(a.store.cards[c].box >= v.box);
    for (const [k, v] of Object.entries(p.store.skills)) assert.ok((a.store.skills[k].last || "") >= (v.last || ""));
    for (const [k, days] of Object.entries(p.store.skillHist)) for (const [d, v] of Object.entries(days)) assert.ok(a.store.skillHist[k][d][0] >= v[0]);
  }
  checks++;
  // 4. Thứ tự gộp không đổi số liệu theo ngày
  assert.deepEqual(numbers(merge(phone, laptop).merged), numbers(merge(laptop, phone).merged)); checks++;
}
// 5. Định dạng file
assert.deepEqual(normalize({ days: {}, store: {} }).progress, { days: {}, store: {} });
assert.throws(() => normalize({ hello: 1 }), /định dạng/);
assert.throws(() => normalize("không phải object"));
assert.equal(normalize({ format: "opus-zero-backup", progress: { days: {} }, recordings: [{ id: 1 }] }).recordings.length, 1);
// 6. Gộp vào máy mới (trống) cho đúng dữ liệu
const fresh = gen(); assert.deepEqual(numbers(merge({ days: {} }, fresh).merged), numbers(fresh));
assert.equal(describe(merge({ days: {} }, fresh).merged).lessons, Object.keys(fresh.store.lessons).length);
// 7. Ghi chú khác nhau ở hai máy: giữ cả hai
const m = merge({ days: { "2026-10-01": { note: "máy tính" } } }, { days: { "2026-10-01": { note: "điện thoại" } } }).merged;
assert.ok(m.days["2026-10-01"].note.includes("máy tính") && m.days["2026-10-01"].note.includes("điện thoại"));
console.log(`data: 300 cặp dữ liệu ngẫu nhiên, ${checks} lần kiểm tra tính chất, cùng các trường hợp đặc biệt: đều đạt`);
