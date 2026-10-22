// Mở từng trang đã build (site/) như trình duyệt thật: bộ tải tự nạp script theo nhu cầu.
// Kiểm tra: không có lỗi JavaScript, mọi khuông nhạc và công cụ đều khởi tạo, không tải script thừa,
// và một số luồng tương tác chính (đàn MIDI ảo, micro ảo, kế hoạch học).
import fs from "node:fs";
import path from "node:path";
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";

const SITE = path.resolve(new URL("../site", import.meta.url).pathname);
const ORIGIN = "https://mtuann.github.io/opus-zero/";
if (!fs.existsSync(SITE)) { console.error("Chưa có site/: hãy chạy `mkdocs build` trước."); process.exit(1); }
/* Chia việc để chạy song song (xem tests/run.mjs):
   --pages K/N  chỉ quét phần K trong N phần của danh sách trang, bỏ qua các luồng tương tác
   --flows      chỉ chạy các luồng tương tác
   (không có tham số: chạy cả hai, như trước) */
const ARGV = process.argv.slice(2);
const PAGES_ARG = ARGV.includes("--pages") ? ARGV[ARGV.indexOf("--pages") + 1] : null;
const [SHARD, SHARDS] = PAGES_ARG ? PAGES_ARG.split("/").map(Number) : [1, 1];
if (PAGES_ARG && !(SHARDS >= 1 && SHARD >= 1 && SHARD <= SHARDS)) { console.error("--pages cần dạng K/N, ví dụ 2/3"); process.exit(2); }
const RUN_SWEEP = !ARGV.includes("--flows"), RUN_FLOWS = !PAGES_ARG;

class Loader extends ResourceLoader {
  fetch(url) {
    if (url.startsWith(ORIGIN) && /\/assets\/(js|css)\/[\w\-\/]+\.(js|css)/.test(url)) {
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* Chờ trang "ổn định": bộ tải báo mọi công cụ đã khởi tạo (OZLoader.done, tối đa 5 giây),
   rồi thêm `extra` ms cho các hẹn giờ ngắn. Nhanh hơn nhiều so với chờ cố định 250 ms mỗi trang. */
async function settle(w, extra) {
  const done = w.OZLoader && w.OZLoader.done;
  if (done) await Promise.race([done, sleep(5000)]);
  await sleep(extra);
}
/* opts.query: thêm vào URL (ví dụ "?h=piano", "#muc"); opts.before(w): chạy trước mọi script của trang;
   opts.lazy: giữ chế độ khởi tạo khi gần màn hình (mặc định vẽ hết ngay, window.OZ_EAGER, để kiểm được mọi khuông và công cụ) */
async function open(rel, extra = 20, opts = {}) {
  const html = fs.readFileSync(path.join(SITE, rel), "utf8");
  const errors = [], requested = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => { if (!/Not implemented|Could not load|Could not parse CSS/.test(e.message)) errors.push(e.message); });
  vc.on("error", (e) => errors.push(String(e && e.message || e)));
  const dom = new JSDOM(html, { url: ORIGIN + rel.replace(/index\.html$/, "") + (opts.query || ""), runScripts: "dangerously", resources: new Loader(), pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      if (!opts.lazy) w.OZ_EAGER = true;
      if (opts.before) opts.before(w);
      fakeAudio(w);
      for (const k in storage) w.localStorage.setItem(k, storage[k]);
      const orig = w.document.createElement.bind(w.document);
      w.document.createElement = (t, o) => { const el = orig(t, o); if (String(t).toLowerCase() === "script") { const d = Object.getOwnPropertyDescriptor(w.HTMLScriptElement.prototype, "src"); Object.defineProperty(el, "src", { get() { return d.get.call(this); }, set(v) { requested.push(String(v)); d.set.call(this, v); } }); } return el; };
      w.addEventListener("error", (e) => errors.push(e.message));
    } });
  await new Promise((r) => dom.window.addEventListener("load", r));
  await settle(dom.window, extra);
  const w = dom.window;
  return { w, d: w.document, errors, requested, save() { for (let i = 0; i < w.localStorage.length; i++) { const k = w.localStorage.key(i); storage[k] = w.localStorage.getItem(k); } }, close() { w.close(); } };
}

const TOOL_CLASSES = ["oz-sight2", "oz-note-reader","oz-interval-trainer","oz-chord-trainer","oz-scale-trainer","oz-metronome","oz-piano-explorer","oz-build","oz-circle","oz-keysig-quiz","oz-rhythm","oz-sight","oz-tuner","oz-quiz","oz-placement","oz-worksheet-gen","oz-timeline","oz-listen","oz-overtones","oz-tuning","oz-staffpaper","oz-style-example","oz-style-trainer","oz-cadence-trainer","oz-texture-trainer","oz-blind","oz-blind-log","oz-playalong","oz-singback","oz-dictation","oz-recorder","oz-spectrum","oz-plan","oz-skills","oz-flashcards","oz-journal","oz-summary","oz-midi-status","oz-sound-setting"];
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f === "index.html" && !fs.readFileSync(p, "utf8").includes('http-equiv="refresh"')) pages.push(path.relative(SITE, p)); /* bỏ qua trang chuyển hướng (hooks/redirects.py) */ } })(SITE);

let fail = 0, textOnly = 0, textOnlyScripts = 0;
const mine = pages.filter((_, i) => i % SHARDS === SHARD - 1);
if (RUN_SWEEP) {
for (const rel of mine) {
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
console.log(`browser: ${mine.length}${SHARDS > 1 ? `/${pages.length} (phần ${SHARD}/${SHARDS})` : ""} trang, ${fail} trang có lỗi; ${textOnly} trang chỉ có chữ tải ${textOnlyScripts} script công cụ`);
}

/* ---- Luồng tương tác chính ---- */
const checks = [];
const check = (name, cond, info = "") => { checks.push([name, !!cond]); if (!cond) { fail++; console.log("✗", name, info); } };
if (RUN_FLOWS) {
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
  check("chơi theo: hiện piano roll cao độ", !!pa.querySelector(".oz-pa-result svg.oz-viz"));
  r.close();
}
{
  const r = await open("nhan-dien/luyen-nghe/index.html");
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
  /* Phản hồi trực quan: luyện quãng hiện bàn phím sau khi trả lời đúng; chép giai điệu hiện so sánh */
  const r = await open("luyen-tai/nghe-quang/index.html");
  const it = r.d.querySelector(".oz-interval-trainer");
  it.querySelector('[data-act="new"]').click();
  for (const b of it.querySelectorAll(".oz-answers button")) { b.click(); if (b.classList.contains("is-correct")) break; }
  check("luyện quãng: hiện bàn phím các nốt vừa nghe", !!it.querySelector(".oz-reveal svg"));
  it.querySelector('[data-act="new"]').click();
  check("luyện quãng: câu mới xóa hình cũ", !it.querySelector(".oz-reveal svg"));
  r.close();
}
{
  const r = await open("luyen-tap/chep-giai-dieu/index.html");
  const dc = r.d.querySelector(".oz-dictation");
  dc.querySelector('[data-act="new"]').click();
  const n = Number(dc.querySelector(".oz-feedback").textContent.match(/(\d+) nốt/)[1]);
  for (let i = 0; i < n; i++) r.w.OZMidi._emit({ type: "on", midi: 60, t: 0 });
  dc.querySelector('[data-act="check"]').click();
  check("chép giai điệu: hiện hình so sánh", !!dc.querySelector(".oz-reveal svg"));
  r.close();
}
{
  const r = await open("luyen-tai/nghe-tien-trinh/index.html");
  const ct = r.d.querySelector(".oz-cadence-trainer");
  ct.querySelector('[data-act="new"]').click();
  for (const b of ct.querySelectorAll(".oz-answers button")) { b.click(); if (b.classList.contains("is-correct")) break; }
  check("nhận biết kết: hiện hai hợp âm cuối trên phím đàn", !!ct.querySelector(".oz-reveal svg") && /→/.test(ct.querySelector(".oz-reveal").textContent));
  r.close();
}
{
  /* Trang Dữ liệu của tôi: khởi tạo và hiển thị tóm tắt */
  const r = await open("luyen-tap/du-lieu/index.html");
  check("trang Dữ liệu của tôi hiển thị tóm tắt", /ngày có luyện tập/.test(r.d.querySelector(".oz-data-summary").textContent), r.d.querySelector(".oz-data-summary").textContent);
  r.close();
}
{
  const p = await open("luyen-tap/index.html");
  check("kế hoạch học hiển thị", p.d.querySelectorAll(".oz-plan li").length >= 4);
  p.close();
  const r = await open("luyen-tap/nhat-ky/index.html");
  check("bảng năng lực ghi nhận lượt đoán phong cách", /\d+%/.test(r.d.querySelector(".oz-skills").textContent));
  check("biểu đồ tiến bộ theo tuần hiển thị", r.d.querySelectorAll(".oz-trends .oz-trend svg").length >= 1, r.d.querySelector(".oz-trends").textContent.slice(0, 80));
  r.close();
}
/* ---- Theo dõi việc tập piano: tự đánh giá chặng, bài đang tập, kế hoạch hôm nay ---- */
{
  let r = await open("bat-dau/kiem-tra-dau-vao/index.html");
  const boxes = [...r.d.querySelectorAll(".oz-piano-level input[type=checkbox]")];
  check("tự đánh giá piano: ô đánh dấu bấm được và có nhãn", boxes.length >= 15 && boxes.every((b) => !b.disabled && b.getAttribute("aria-label")), String(boxes.length));
  [0, 1, 2, 3, 4].forEach((i) => boxes[i] && boxes[i].click());
  const res = r.d.querySelector(".oz-level-result");
  check("tự đánh giá piano: tính ra chặng 3", res && /Chặng của bạn: 3\./.test(res.textContent), res && res.textContent.slice(0, 80));
  r.save(); r.close();
  r = await open("bat-dau/kiem-tra-dau-vao/index.html");
  check("ô đã đánh dấu được nhớ khi mở lại trang", r.d.querySelectorAll(".oz-piano-level input:checked").length === 5);
  r.close();
  r = await open("piano/tac-pham/fur-elise/index.html");
  const learn = r.d.querySelector('.oz-piece [data-a="learning"]');
  check("bài học tác phẩm có nút \"Tôi đang tập bài này\"", !!learn);
  if (learn) learn.click();
  const done = r.d.querySelector('.oz-piece [data-a="practiced"]');
  if (done) done.click();
  r.save(); r.close();
  r = await open("index.html");
  const items = [...r.d.querySelectorAll(".oz-plan li")].map((li) => li.textContent);
  check("kế hoạch hôm nay: gam của chặng 3 rồi bài đang tập", /Khởi động: gam/.test(items[0] || "") && /Für Elise/.test(items[1] || ""), items.slice(0, 3).join(" | "));
  const today = r.d.querySelector(".oz-home-today"), paths = r.d.querySelector(".oz-home-paths");
  check("trang chủ: khối Hôm nay lên đầu khi đã có dữ liệu", today && paths && (today.compareDocumentPosition(paths) & 4));
  r.close();
}
/* ---- Mốc tham khảo trong bảng "Theo dõi khi nghe": bật/tắt, nhớ theo trang, so với mốc của người học ---- */
{
  const page = "piano/tac-pham/fur-elise/index.html";
  let r = await open(page);
  const box = r.d.querySelector(".oz-listen .oz-ref-on");
  const rows = r.d.querySelectorAll(".oz-mark-cell").length;
  const refs = JSON.parse(r.d.querySelector(".oz-listen").dataset.rec).ref.filter((x) => x !== null).length;
  check("mốc tham khảo: có ô bật/tắt, mặc định ẩn", box && !box.checked && !r.d.querySelector(".oz-mark-cell .oz-ref"));
  box.click();
  check("mốc tham khảo: bật lên thì mỗi dòng có mốc", r.d.querySelectorAll(".oz-mark-cell .oz-ref-time").length === refs && refs === rows, refs + "/" + rows);
  const key = JSON.parse(r.d.querySelector(".oz-listen").dataset.rec).parts[0].mp3;
  r.w.OZProgress.setStore("listen", { [r.w.location.pathname]: { url: key, marks: { 0: 3, 1: 20 } } });
  r.save(); r.close();
  r = await open(page);
  const d = [...r.d.querySelectorAll(".oz-mark-cell .oz-ref-d")].map((x) => x.textContent);
  check("mốc tham khảo: nhớ trạng thái bật theo trang", r.d.querySelector(".oz-listen .oz-ref-on").checked);
  check("mốc tham khảo: so mốc của người học (khớp / muộn)", d[0] === "khớp" && /^muộn \d+ giây$/.test(d[1] || ""), d.join(" | "));
  check("mốc tham khảo: tóm tắt số mốc khớp", /So sánh: 1\/2 mốc/.test(r.d.querySelector(".oz-listen .oz-ref-sum").textContent), r.d.querySelector(".oz-listen .oz-ref-sum").textContent);
  r.d.querySelector(".oz-listen .oz-ref-on").click();
  check("mốc tham khảo: tắt thì ẩn hết", !r.d.querySelector(".oz-mark-cell .oz-ref"));
  r.save(); r.close();
  r = await open("nghe-nhac/mozart-eine-kleine/index.html");
  check("trang chưa có mốc tham khảo thì không có ô bật/tắt", !r.d.querySelector(".oz-listen .oz-ref-on") && !!r.d.querySelector(".oz-listen [data-act=default]"));
  r.close();
}
/* ---- Thị tấu hai tay ---- */
{
  const r = await open("luyen-tap/thi-tau-hai-tay/index.html");
  const box = r.d.querySelector(".oz-sight2");
  const svg1 = box && box.querySelector(".abc-notation svg");
  check("thị tấu hai tay: có bài trên khuông kép", !!svg1 && box.querySelectorAll(".abc-notation svg .abcjs-staff").length >= 2, box ? box.textContent.slice(0, 80) : "không có .oz-sight2");
  const sel = box && box.querySelector('[data-k="lv"]');
  if (sel) { sel.value = "3"; sel.dispatchEvent(new r.w.Event("change", { bubbles: true })); }
  const info = box ? box.querySelector('[data-k="info"]').textContent : "";
  check("thị tấu hai tay: đổi cấp tạo bài mới", box && box.querySelector(".abc-notation svg") !== svg1 && /nhịp (3|4)\/4/.test(info), info);
  const good = box && box.querySelector('[data-r="good"]');
  if (good) good.click();
  check("thị tấu hai tay: tự chấm được ghi lại", box && /1 bài hai tay/.test(box.querySelector('[data-k="stats"]').textContent), box && box.querySelector('[data-k="stats"]').textContent);
  r.save(); r.close();
}
/* ---- Chỉ mục tìm kiếm chỉ được tải khi mở tìm kiếm, khi đến từ kết quả tìm kiếm (?h=) hoặc khi trang rảnh ---- */
{
  const fakeXHR = (sent) => (w) => {
    w.XMLHttpRequest = function () {};
    Object.assign(w.XMLHttpRequest.prototype, { open(m, u) { this.u = String(u); }, send() { sent.push(this.u); }, addEventListener() {}, setRequestHeader() {} });
  };
  const ask = (w, u) => { const x = new w.XMLHttpRequest(); x.open("GET", ORIGIN + u); x.send(); };
  let sent = [];
  let r = await open("index.html", 20, { before: fakeXHR(sent) });
  ask(r.w, "search/search_index.json"); ask(r.w, "sitemap.xml");
  check("tìm kiếm: chưa mở thì chưa gửi yêu cầu tải chỉ mục, yêu cầu khác vẫn đi qua", sent.length === 1 && /sitemap\.xml$/.test(sent[0]), sent.join(" "));
  r.d.querySelector(".md-search__input").dispatchEvent(new r.w.FocusEvent("focusin", { bubbles: true }));
  check("tìm kiếm: mở ô tìm kiếm thì gửi yêu cầu tải chỉ mục", sent.length === 2 && /search_index\.json$/.test(sent[1]), sent.join(" "));
  r.close();
  sent = [];
  r = await open("index.html", 20, { before: fakeXHR(sent), query: "?h=piano" });
  ask(r.w, "search/search_index.json");
  check("tìm kiếm: đến từ kết quả tìm kiếm (?h=) thì tải chỉ mục ngay", sent.length === 1, sent.join(" "));
  r.close();
}
/* ---- Khởi tạo khi gần màn hình: IntersectionObserver giả, vị trí giả theo thứ tự phần tử trong trang (100px mỗi phần tử) ---- */
{
  const ios = [];
  const lazy = (w) => {
    ios.length = 0;
    w.requestIdleCallback = (fn) => setTimeout(fn, 0);
    w.IntersectionObserver = class { constructor(cb) { this.cb = cb; this.els = new Set(); ios.push(this); } observe(el) { this.els.add(el); } unobserve(el) { this.els.delete(el); } disconnect() { this.els.clear(); } };
    let order = null;
    w.Element.prototype.getBoundingClientRect = function () {
      if (!order) { order = new Map(); [...w.document.querySelectorAll("*")].forEach((e, i) => order.set(e, i)); }
      const top = (order.get(this) || 0) * 100 - (w.__scroll || 0);
      return { top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100 };
    };
  };
  /* "Cuộn" tới phần tử el rồi báo cho mọi observer những phần tử nằm trong khoảng 600px quanh màn hình */
  const scrollTo = (w, el) => {
    w.__scroll = 0; w.__scroll = el.getBoundingClientRect().top;
    for (const io of [...ios]) {
      const entries = [...io.els].map((e) => { const r = e.getBoundingClientRect(); return { target: e, isIntersecting: r.top < w.innerHeight + 600 && r.bottom > -600 }; });
      if (entries.length) io.cb(entries);
    }
  };
  const until = async (fn) => { for (let i = 0; i < 100 && !fn(); i++) await sleep(20); return fn(); };
  const page = "piano/tac-pham/fur-elise/index.html";
  let r = await open(page, 20, { lazy: true, before: lazy });
  const blocks = [...r.d.querySelectorAll(".abc-notation")];
  const drawn = () => blocks.filter((b) => b.querySelector("svg")).length;
  check("gần màn hình: lúc mở trang chưa vẽ khuông nào ở xa, chưa tải listen.js, công cụ trạng thái (oz-piece) vẫn chạy ngay",
    blocks.length === 4 && drawn() === 0 && !r.requested.some((u) => /listen\.js/.test(u)) && !!r.d.querySelector('.oz-piece[data-ready="1"]'), drawn() + " " + r.requested.join(" "));
  await until(() => r.w.ABCJS && r.w.OZAbc);
  check("gần màn hình: khi rảnh thì tải sẵn abcjs nhưng chưa vẽ", !!r.w.ABCJS && drawn() === 0 && blocks.every((b) => /px$/.test(b.style.minHeight)), String(drawn()));
  scrollTo(r.w, blocks[0]);
  check("gần màn hình: cuộn tới khuông đầu thì vẽ khuông đó, khuông cuối vẫn chờ", !!blocks[0].querySelector("svg") && !blocks[3].querySelector("svg") && blocks[0].style.minHeight === "", String(drawn()));
  scrollTo(r.w, r.d.querySelector(".oz-listen"));
  check("gần màn hình: cuộn tới khung nghe thì tải listen.js và khởi tạo", await until(() => r.d.querySelector(".oz-listen").dataset.ready === "1"));
  r.w.dispatchEvent(new r.w.Event("beforeprint"));
  check("gần màn hình: trước khi in thì vẽ hết", drawn() === 4, String(drawn()));
  r.close();
  r = await open(page, 20, { lazy: true, before: lazy, query: "#dien-tau" });
  await until(() => r.d.querySelectorAll(".abc-notation svg").length === 4);
  check("gần màn hình: mở link tới #dien-tau thì mọi khuông phía trên đích đã vẽ", r.d.querySelectorAll(".abc-notation svg").length === 4, String(r.d.querySelectorAll(".abc-notation svg").length));
  r.close();
  r = await open(page, 20, { lazy: true, before: lazy, query: "#bai-tap-chuan-bi" });
  await until(() => r.d.querySelectorAll(".abc-notation svg").length >= 1);
  await sleep(50);
  check("gần màn hình: mở link tới #bai-tap-chuan-bi thì chỉ khuông phía trên đích được vẽ ngay", r.d.querySelectorAll(".abc-notation svg").length === 1, String(r.d.querySelectorAll(".abc-notation svg").length));
  r.close();
}
/* ---- Sách in được ---- */
for (const f of fs.readdirSync(path.join(SITE, "sach"))) {
  const r = await open("sach/" + f);
  const abc = r.d.querySelectorAll(".abc-notation").length, svg = r.d.querySelectorAll(".abc-notation svg").length;
  const ok = !r.errors.length && abc === svg && r.d.body.getAttribute("data-ready") === "1" && r.d.querySelectorAll(".chapter").length > 0
    && r.d.querySelectorAll(".book-quiz").length === r.d.querySelectorAll(".book-answers").length;
  check("sách " + f + ": " + abc + " khuông, " + r.d.querySelectorAll(".chapter").length + " chương", ok, r.errors.join(" | ") + ` abc=${abc} svg=${svg}`);
  r.close();
}
console.log(`browser: ${checks.length} luồng tương tác, ${checks.filter((c) => !c[1]).length} lỗi`);
}
process.exit(fail ? 1 : 0);
