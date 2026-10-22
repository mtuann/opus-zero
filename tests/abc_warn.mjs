// Đọc mọi khối ```abc trong docs/ bằng abcjs.parseOnly và báo khối có cảnh báo (cú pháp abcjs không hiểu,
// nốt không vẽ được…). tests/abc_bars.py chỉ kiểm độ dài ô nhịp; kiểm thử này bắt những lỗi abcjs bỏ qua lặng lẽ.
// Khối có cảnh báo đã biết và chấp nhận được thì ghi vào IGNORE kèm lý do.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ABCJS = require("abcjs");
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs");

/* "đường-dẫn-trong-docs#thứ-tự-khối" (đếm từ 1): lý do bỏ qua */
const IGNORE = {};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".md") ? [p] : [];
  });
}

let blocks = 0, bad = 0, ignored = 0;
for (const file of walk(ROOT).sort()) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const re = /```abc\n([\s\S]*?)```/g;
  let m, k = 0;
  const text = fs.readFileSync(file, "utf8");
  while ((m = re.exec(text))) {
    k++; blocks++;
    const tune = ABCJS.parseOnly(m[1])[0];
    const warnings = ((tune && tune.warnings) || []).map((w) => w.replace(/<[^>]+>/g, "").trim());
    if (!warnings.length) continue;
    const key = `${rel}#${k}`;
    if (IGNORE[key]) { ignored++; continue; }
    bad++;
    console.log(`✗ ${key}: ${warnings.join(" | ").slice(0, 400)}`);
  }
}
console.log(`abc_warn: ${blocks} khối, ${bad} khối có cảnh báo${ignored ? `, ${ignored} khối bỏ qua có lý do` : ""}`);
process.exit(bad ? 1 : 0);
