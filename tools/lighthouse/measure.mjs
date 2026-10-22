// Đo Lighthouse 12.2.1 (điện thoại, 4G chậm mô phỏng) ba trang của plans/v15-do-luong.md, mỗi trang N lần,
// in một dòng bảng cho mỗi trang: điểm hiệu năng (trung vị, rồi từng lần), trợ năng, thực hành tốt, SEO,
// FCP, LCP, TBT, CLS, tổng tải, dung lượng các yêu cầu bắt đầu trước LCP, lúc chỉ mục tìm kiếm được yêu cầu.
//   node tools/lighthouse/measure.mjs <gốc-url> [số lần, mặc định 3]
//   ví dụ: node tools/lighthouse/measure.mjs https://localhost:8443/opus-zero/   (sau khi chạy serve.mjs)
//          node tools/lighthouse/measure.mjs https://mtuann.github.io/opus-zero/  (site thật)
// Kết quả JSON từng lần nằm trong thư mục tạm (in ở cuối).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [base, runsArg] = process.argv.slice(2);
if (!base) { console.error("Cần gốc-url, ví dụ https://localhost:8443/opus-zero/"); process.exit(2); }
const RUNS = Number(runsArg || 3);
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), "opus-zero-lh-"));
const PAGES = [["Trang chủ", ""], ["Bài học Für Elise", "piano/tac-pham/fur-elise/"], ["Debussy: Préludes", "nghe-nhac/debussy-preludes/"]];
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const flags = "--headless=new" + (base.startsWith("https://localhost") ? " --ignore-certificate-errors" : "");

console.log("| Trang | Hiệu năng | Trợ năng | Thực hành tốt | SEO | FCP | LCP | TBT | CLS | Tổng tải | Tải trước LCP | Chỉ mục tìm kiếm |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const [name, page] of PAGES) {
  const runs = [];
  for (let i = 1; i <= RUNS; i++) {
    const file = path.join(OUT, `${page.replace(/\W+/g, "-") || "trang-chu"}-${i}.json`);
    execFileSync("npx", ["lighthouse@12.2.1", base + page, "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json", "--output-path=" + file, "--chrome-flags=" + flags, "--quiet"], { stdio: "ignore", timeout: 240000 });
    const { audits: a, categories: c } = JSON.parse(fs.readFileSync(file, "utf8"));
    const lcp = a.metrics.details.items[0].observedLargestContentfulPaint;
    const requests = a["network-requests"].details.items;
    const index = requests.find((r) => /search_index\.json/.test(r.url));
    runs.push({
      perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100),
      fcp: a["first-contentful-paint"].numericValue, lcp: a["largest-contentful-paint"].numericValue,
      tbt: a["total-blocking-time"].numericValue, cls: a["cumulative-layout-shift"].numericValue,
      bytes: a["total-byte-weight"].numericValue,
      before: requests.filter((r) => r.networkRequestTime < lcp).reduce((s, r) => s + (r.transferSize || 0), 0),
      index: !index ? "không tải" : index.networkRequestTime < lcp ? "trước LCP" : "sau LCP",
    });
  }
  const m = (k) => median(runs.map((r) => r[k]));
  const s = (ms) => (ms / 1000).toFixed(1).replace(".", ",") + " s";
  console.log(`| ${name} | ${m("perf")} (${runs.map((r) => r.perf).join("/")}) | ${m("a11y")} | ${m("bp")} | ${m("seo")} | ${s(m("fcp"))} | ${s(m("lcp"))} | `
    + `${Math.round(m("tbt"))} ms | ${m("cls").toFixed(3).replace(".", ",")} | ${Math.round(m("bytes") / 1024)} KiB | ${Math.round(m("before") / 1024)} KiB | ${runs.map((r) => r.index).join(", ")} |`);
}
console.log(`\nJSON từng lần: ${OUT}`);
