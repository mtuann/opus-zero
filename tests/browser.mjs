// Mở từng trang đã build (site/) như trình duyệt thật: bộ tải tự nạp script theo nhu cầu.
// Kiểm tra: không có lỗi JavaScript, mọi khuông nhạc và công cụ đều khởi tạo, không tải script thừa,
// và một số luồng tương tác chính (đàn MIDI ảo, micro ảo, kế hoạch học).
import fs from "node:fs";
import path from "node:path";
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";

const SITE = path.resolve(new URL("../site", import.meta.url).pathname);
const ORIGIN = "https://mtuann.github.io/opus-zero/";
const ABCJS = fs.readFileSync(new URL("../node_modules/abcjs/dist/abcjs-basic-min.js", import.meta.url), "utf8");
if (!fs.existsSync(SITE)) { console.error("Chưa có site/: hãy chạy `mkdocs build` trước."); process.exit(1); }

class Loader extends ResourceLoader {
  fetch(url) {
    if (url.includes("cdn.jsdelivr.net/npm/abcjs")) return Promise.resolve(Buffer.from(ABCJS));
    if (url.startsWith(ORIGIN) && /\/assets\/js\/[\w-]+\.js/.test(url)) {
      const rel = url.slice(ORIGIN.length).split("?")[0];
      return Promise.resolve(fs.readFileSync(path.join(SITE, rel)));
    }
    return Promise.resolve(Buffer.from("")); /* bundle của Material, font, mermaid…: bỏ qua */
  }
}
function fakeAudio(w) {
  w.AudioContext = function () {
    const self = this; this.currentTime = 0; this.state = "running"; this.destination = {}; this.sampleRate = 44100;
    const node = () => ({ connect: (x) => x || node(), gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, frequency: { value: 0 }, start() {}, stop() {}, type: "",
      threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 } });
    this.createGain = node; this.createOscillator = node; this.createDynamicsCompressor = node; this.resume = () => {};
    this.createBufferSource = () => Object.assign(node(), { playbackRate: { value: 1 }, buffer: null });
    this.createAnalyser = () => Object.assign(node(), { fftSize: 2048, frequencyBinCount: 1024, context: self, getFloatTimeDomainData() {}, getFloatFrequencyData() {} });
    this.decodeAudioData = (ab, ok) => ok({});
  };
  w.navigator.requestMIDIAccess = () => Promise.resolve({ inputs: new Map([["1", { name: "Đàn thử", onmidimessage: null }]]), onstatechange: null });
}
const storage = {};
async function open(rel, wait = 250) {
  const html = fs.readFileSync(path.join(SITE, rel), "utf8");
  const errors = [], requested = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => { if (!/Not implemented|Could not load|Could not parse CSS/.test(e.message)) errors.push(e.message); });
  vc.on("error", (e) => errors.push(String(e && e.message || e)));
  const dom = new JSDOM(html, { url: ORIGIN + rel.replace(/index\.html$/, ""), runScripts: "dangerously", resources: new Loader(), pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      fakeAudio(w);
      for (const k in storage) w.localStorage.setItem(k, storage[k]);
      const orig = w.document.createElement.bind(w.document);
      w.document.createElement = (t, o) => { const el = orig(t, o); if (String(t).toLowerCase() === "script") { const d = Object.getOwnPropertyDescriptor(w.HTMLScriptElement.prototype, "src"); Object.defineProperty(el, "src", { get() { return d.get.call(this); }, set(v) { requested.push(String(v)); d.set.call(this, v); } }); } return el; };
      w.addEventListener("error", (e) => errors.push(e.message));
    } });
  await new Promise((r) => dom.window.addEventListener("load", r));
  await new Promise((r) => setTimeout(r, wait));
  const w = dom.window;
  return { w, d: w.document, errors, requested, save() { for (let i = 0; i < w.localStorage.length; i++) { const k = w.localStorage.key(i); storage[k] = w.localStorage.getItem(k); } }, close() { w.close(); } };
}

const TOOL_CLASSES = ["oz-note-reader","oz-interval-trainer","oz-chord-trainer","oz-scale-trainer","oz-metronome","oz-piano-explorer","oz-build","oz-circle","oz-keysig-quiz","oz-rhythm","oz-sight","oz-tuner","oz-quiz","oz-placement","oz-worksheet-gen","oz-timeline","oz-listen","oz-overtones","oz-tuning","oz-staffpaper","oz-style-example","oz-style-trainer","oz-cadence-trainer","oz-texture-trainer","oz-blind","oz-blind-log","oz-playalong","oz-singback","oz-dictation","oz-recorder","oz-spectrum","oz-plan","oz-skills","oz-flashcards","oz-journal","oz-summary","oz-midi-status","oz-sound-setting"];
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f === "index.html") pages.push(path.relative(SITE, p)); } })(SITE);

let fail = 0, textOnly = 0, textOnlyScripts = 0;
for (const rel of pages) {
  const r = await open(rel);
  const probs = [...r.errors];
  r.d.querySelectorAll(".abc-notation").forEach((el, i) => { if (!el.querySelector("svg")) probs.push("khuông nhạc #" + (i + 1) + " không hiển thị"); });
  for (const c of TOOL_CLASSES) r.d.querySelectorAll("." + c).forEach((el) => { if (!el.children.length && !el.dataset.ready) probs.push("công cụ ." + c + " không khởi tạo"); });
  const tools = r.requested.filter((u) => /assets\/js\//.test(u) || /abcjs/.test(u));
  const expected = new Set(r.w.OZLoader.needed());
  const extra = tools.map((u) => (u.match(/js\/([\w-]+)\.js/) || u.match(/(abcjs)/))[1]).filter((n) => !expected.has(n));
  if (extra.length) probs.push("tải thừa: " + extra.join(", "));
  if (!expected.size) { textOnly++; textOnlyScripts += tools.length; }
  if (probs.length) { fail++; console.log("✗", rel, probs.slice(0, 4).join(" | ")); }
  r.close();
}
console.log(`browser: ${pages.length} trang, ${fail} trang có lỗi; ${textOnly} trang chỉ có chữ tải ${textOnlyScripts} script công cụ`);

/* ---- Luồng tương tác chính ---- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const checks = [];
const check = (name, cond, info = "") => { checks.push([name, !!cond]); if (!cond) { fail++; console.log("✗", name, info); } };
{
  const r = await open("luyen-tap/doc-not/index.html");
  const nr = r.d.querySelector(".oz-note-reader");
  let ok = 0;
  for (let i = 0; i < 5; i++) { for (const m of [60, 62, 64, 65, 67, 69, 71]) { r.w.OZMidi._emit({ type: "on", midi: m, t: 0 }); if (nr.querySelector(".oz-feedback.ok")) { ok++; break; } } nr.querySelector('[data-act="skip"]').click(); }
  check("đọc nốt bằng đàn MIDI", ok === 5, ok);
  r.close();
}
{
  const r = await open("luyen-tap/choi-theo/index.html");
  const pa = r.d.querySelector(".oz-playalong");
  let feed = null;
  r.w.OZMic = { start: () => Promise.resolve(), on: (fn) => { feed = fn; return () => { feed = null; }; } };
  pa.querySelector('[data-act="go"]').click(); await sleep(20);
  const beat = 60 / 66; let t = 0.15 + 4 * beat;
  r.w.OZPlayalong.SONGS.twinkle.notes.forEach((n, i) => { for (let k = t; k < t + n[1] * beat; k += 0.03) if (i !== 6 && feed) feed({ t: k, f: 440 * Math.pow(2, (n[0] - 69) / 12), rms: .1 }); t += n[1] * beat; });
  pa.querySelector('[data-act="stop"]').click();
  check("chơi theo qua micro: 13/14 nốt", /Đúng 13\/14/.test(pa.querySelector(".oz-feedback").textContent), pa.querySelector(".oz-feedback").textContent);
  r.close();
}
{
  const r = await open("nhan-dien/luyen-nghe/index.html", 400);
  const st = r.d.querySelector(".oz-style-trainer");
  const hidden = st.querySelector(".oz-ex-staff").classList.contains("oz-hidden-staff");
  for (const b of st.querySelectorAll(".oz-answers button")) { b.click(); if (b.classList.contains("is-correct")) break; }
  check("đoán phong cách: ẩn rồi hiện khuông", hidden && !st.querySelector(".oz-ex-staff").classList.contains("oz-hidden-staff"));
  r.save(); r.close();
}
{
  const r = await open("luyen-tap/ban-phim/index.html");
  const keys = r.d.querySelectorAll(".oz-piano-explorer .oz-key");
  const first = [...keys].find((k) => k.getAttribute("tabindex") === "0");
  first.focus();
  first.dispatchEvent(new r.w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  const now = r.d.activeElement;
  now.dispatchEvent(new r.w.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  const info = r.d.querySelector(".oz-piano-explorer .oz-key-info").textContent;
  check("bàn phím piano dùng được bằng phím mũi tên và Enter", now !== first && now.getAttribute("tabindex") === "0" && /Đô♯|Rê/.test(info), info);
  r.close();
}
{
  /* Trang Dữ liệu của tôi: khởi tạo và hiển thị tóm tắt */
  const r = await open("luyen-tap/du-lieu/index.html");
  check("trang Dữ liệu của tôi hiển thị tóm tắt", /ngày có luyện tập/.test(r.d.querySelector(".oz-data-summary").textContent), r.d.querySelector(".oz-data-summary").textContent);
  r.close();
}
{
  const r = await open("luyen-tap/nhat-ky/index.html");
  check("kế hoạch học hiển thị", r.d.querySelectorAll(".oz-plan li").length >= 4);
  check("bảng năng lực ghi nhận lượt đoán phong cách", /\d+%/.test(r.d.querySelector(".oz-skills").textContent));
  r.close();
}
/* ---- Sách in được ---- */
for (const f of fs.readdirSync(path.join(SITE, "sach"))) {
  const r = await open("sach/" + f, 600);
  const abc = r.d.querySelectorAll(".abc-notation").length, svg = r.d.querySelectorAll(".abc-notation svg").length;
  const ok = !r.errors.length && abc === svg && r.d.body.getAttribute("data-ready") === "1" && r.d.querySelectorAll(".chapter").length > 0
    && r.d.querySelectorAll(".book-quiz").length === r.d.querySelectorAll(".book-answers").length;
  check("sách " + f + ": " + abc + " khuông, " + r.d.querySelectorAll(".chapter").length + " chương", ok, r.errors.join(" | ") + ` abc=${abc} svg=${svg}`);
  r.close();
}
console.log(`browser: ${checks.length} luồng tương tác, ${checks.filter((c) => !c[1]).length} lỗi`);
process.exit(fail ? 1 : 0);
