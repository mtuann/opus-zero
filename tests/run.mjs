// Chạy kiểm thử theo nhóm; các nhóm chạy song song, mỗi nhóm một tiến trình con.
//   npm test               → mọi nhóm cùng lúc, in kết quả từng nhóm khi nhóm đó xong
//   npm test -- a11y       → chỉ một nhóm, in trực tiếp (GitHub Actions dùng cách này: mỗi nhóm là một job)
// Cần build site trước (mkdocs build): browser.mjs và a11y.mjs đọc thư mục site/.
// Thêm hoặc đổi tên nhóm thì sửa cả ma trận `group` trong .github/workflows/test.yml (tests/site_static.py kiểm tra hai nơi khớp nhau).
import { spawn } from "node:child_process";
import os from "node:os";

const GROUPS = {
  "nhanh": [
    ["node", "tests/unit.mjs"],
    ["node", "tests/data.mjs"],
    ["python3", "tests/site_static.py"],
    ["node", "tests/search.mjs"],
    ["node", "tests/extract-examples.mjs"],
    ["python3", "tests/abc_bars.py", "tests/.examples.json"],
    ["node", "tests/abc_warn.mjs"],
    ["python3", "tools/figures.py", "--check"],
    ["node", "tests/browser.mjs", "--flows"],
  ],
  "trang-1": [["node", "tests/browser.mjs", "--pages", "1/2"]],
  "trang-2": [["node", "tests/browser.mjs", "--pages", "2/2"]],
  "a11y": [["node", "tests/a11y.mjs"]],
};

const want = process.argv.slice(2);
if (want.includes("--list")) { console.log(Object.keys(GROUPS).join(" ")); process.exit(0); }
for (const g of want) if (!GROUPS[g]) { console.error(`Không có nhóm "${g}". Các nhóm: ${Object.keys(GROUPS).join(", ")}`); process.exit(2); }
const names = want.length ? want : Object.keys(GROUPS);
const live = names.length === 1;

function exec(cmd, args, sink) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: live ? "inherit" : ["ignore", "pipe", "pipe"] });
    if (!live) { p.stdout.on("data", sink); p.stderr.on("data", sink); }
    p.on("error", (e) => { sink(`${cmd}: ${e.message}\n`); resolve(1); });
    p.on("close", (code) => resolve(code === null ? 1 : code));
  });
}

async function runGroup(name) {
  const t0 = Date.now();
  let out = "", bad = 0;
  const sink = (d) => { out += d; };
  for (const [cmd, ...args] of GROUPS[name]) {
    const code = await exec(cmd, args, sink);
    if (code) {
      bad++;
      const msg = `✗ ${cmd} ${args.join(" ")} (mã thoát ${code})\n`;
      if (live) process.stdout.write(msg); else out += msg;
    }
  }
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  if (!live) process.stdout.write(`\n── ${name} · ${sec} giây · ${bad ? bad + " lệnh lỗi" : "đạt"}\n${out}`);
  return bad;
}

const t0 = Date.now();
const limit = Math.max(1, Math.min(names.length, (os.availableParallelism ? os.availableParallelism() : os.cpus().length)));
const queue = [...names];
let failed = 0;
await Promise.all(Array.from({ length: limit }, async () => {
  while (queue.length) if (await runGroup(queue.shift())) failed++;
}));
if (!live) console.log(`\nKiểm thử: ${names.length} nhóm chạy song song trong ${((Date.now() - t0) / 1000).toFixed(1)} giây, ${failed ? failed + " nhóm có lỗi" : "mọi nhóm đều đạt"}`);
process.exit(failed ? 1 : 0);
