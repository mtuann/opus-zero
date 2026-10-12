// Xuất các đoạn nhạc tổng hợp trong recognition.js ra JSON để abc_bars.py kiểm tra.
import fs from "node:fs";
import vm from "node:vm";
const win = {};
const ctx = vm.createContext({ window: win, document: { querySelectorAll: () => [], addEventListener() {} }, console });
vm.runInContext(fs.readFileSync(new URL("../docs/assets/js/recognition.js", import.meta.url), "utf8"), ctx);
const out = {};
for (const [k, v] of Object.entries(win.OZRecognition.EX)) out[k] = v.abc;
fs.writeFileSync(new URL("./.examples.json", import.meta.url), JSON.stringify(out));
console.log("extract-examples:", Object.keys(out).length, "đoạn");
