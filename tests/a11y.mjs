// Kiểm tra khả năng tiếp cận (axe-core) trên các trang tiêu biểu, sau khi công cụ đã khởi tạo.
// Bỏ qua các quy tắc cần trình duyệt thật để tính (tương phản màu, kích thước vùng chạm).
import fs from "node:fs";
import path from "node:path";
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";

const SITE = path.resolve(new URL("../site", import.meta.url).pathname);
const ORIGIN = "https://mtuann.github.io/opus-zero/";
const ABCJS = fs.readFileSync(new URL("../node_modules/abcjs/dist/abcjs-basic-min.js", import.meta.url), "utf8");
const AXE = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
class Loader extends ResourceLoader {
  fetch(url) {
    if (url.includes("cdn.jsdelivr.net/npm/abcjs")) return Promise.resolve(Buffer.from(ABCJS));
    if (url.startsWith(ORIGIN) && /\/assets\/js\/[\w-]+\.js/.test(url)) return Promise.resolve(fs.readFileSync(path.join(SITE, url.slice(ORIGIN.length).split("?")[0])));
    return Promise.resolve(Buffer.from(""));
  }
}
const PAGES = ["index.html", "nhac-ly/02-khuong-nhac-khoa/index.html", "nhac-ly/08-hoa-bieu/index.html", "luyen-tap/index.html", "luyen-tap/doc-not/index.html",
  "luyen-tap/ban-phim/index.html", "luyen-tap/tiet-tau/index.html", "luyen-tap/choi-theo/index.html", "luyen-tap/chep-giai-dieu/index.html", "luyen-tap/thu-am/index.html",
  "luyen-tap/nhat-ky/index.html", "nhan-dien/luyen-nghe/index.html", "nhan-dien/nghe-mu/index.html", "nghe-nhac/ravel-bolero/index.html", "nhac-ly/tu-dien/index.html",
  "bat-dau/kiem-tra-dau-vao/index.html", "lich-su/dong-thoi-gian/index.html"];
let total = 0;
const seen = {};
for (const rel of PAGES) {
  const vc = new VirtualConsole();
  const dom = new JSDOM(fs.readFileSync(path.join(SITE, rel), "utf8"), { url: ORIGIN + rel.replace(/index\.html$/, ""), runScripts: "dangerously", resources: new Loader(), pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) { w.AudioContext = function () { this.currentTime = 0; const n = () => ({ connect: (x) => x || n(), gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, start() {}, stop() {}, frequency: { value: 0 } }); this.createGain = n; this.createOscillator = n; this.destination = {}; this.resume = () => {}; }; } });
  await new Promise((r) => dom.window.addEventListener("load", r));
  await new Promise((r) => setTimeout(r, 300));
  dom.window.eval(AXE);
  const res = await dom.window.axe.run(dom.window.document.querySelector("article") || dom.window.document, {
    rules: { "color-contrast": { enabled: false }, "target-size": { enabled: false }, "region": { enabled: false } } });
  for (const v of res.violations) {
    const key = v.id;
    seen[key] = seen[key] || { help: v.help, impact: v.impact, pages: new Set(), sample: v.nodes[0] && v.nodes[0].html.slice(0, 120) };
    seen[key].pages.add(rel); total += v.nodes.length;
  }
  dom.window.close();
}
for (const [id, v] of Object.entries(seen)) console.log(`✗ [${v.impact}] ${id}: ${v.help} — ${v.pages.size} trang, ví dụ: ${v.sample}`);
console.log(`a11y: ${PAGES.length} trang, ${Object.keys(seen).length} loại vi phạm, ${total} phần tử`);
process.exit(total ? 1 : 0);
