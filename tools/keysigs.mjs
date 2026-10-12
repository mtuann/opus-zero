// Vẽ sẵn 15 hóa biểu (mỗi hóa biểu một khuông nhỏ) bằng abcjs và chèn vào trang giữa dấu <!-- fig:keysigs -->.
// Chạy: node tools/keysigs.mjs   (cần `npm ci` trước)
import fs from "node:fs";
import { JSDOM } from "jsdom";
const KEYS = [["C", "Đô trưởng", "La thứ", "không dấu"],
  ["G", "Sol trưởng", "Mi thứ", "1♯"], ["D", "Rê trưởng", "Si thứ", "2♯"], ["A", "La trưởng", "Fa♯ thứ", "3♯"], ["E", "Mi trưởng", "Đô♯ thứ", "4♯"],
  ["B", "Si trưởng", "Sol♯ thứ", "5♯"], ["F#", "Fa♯ trưởng", "Rê♯ thứ", "6♯"], ["C#", "Đô♯ trưởng", "La♯ thứ", "7♯"],
  ["F", "Fa trưởng", "Rê thứ", "1♭"], ["Bb", "Si♭ trưởng", "Sol thứ", "2♭"], ["Eb", "Mi♭ trưởng", "Đô thứ", "3♭"], ["Ab", "La♭ trưởng", "Fa thứ", "4♭"],
  ["Db", "Rê♭ trưởng", "Si♭ thứ", "5♭"], ["Gb", "Sol♭ trưởng", "Mi♭ thứ", "6♭"], ["Cb", "Đô♭ trưởng", "La♭ thứ", "7♭"]];
const dom = new JSDOM("<!doctype html><body></body>", { runScripts: "outside-only", pretendToBeVisual: true });
dom.window.eval(fs.readFileSync(new URL("../node_modules/abcjs/dist/abcjs-basic-min.js", import.meta.url), "utf8"));
const cells = KEYS.map(([k, maj, min, n]) => {
  const div = dom.window.document.createElement("div"); dom.window.document.body.appendChild(div);
  dom.window.ABCJS.renderAbc(div, `X:1\nL:1/4\nM:none\nK:${k}\nx4|]`, { staffwidth: 120, scale: 0.8, foregroundColor: "currentColor", paddingleft: 0, paddingright: 0, paddingtop: 0, paddingbottom: 0 });
  const svg = div.querySelector("svg");
  const w = svg.getAttribute("width"), h = svg.getAttribute("height");
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`); svg.removeAttribute("width"); svg.removeAttribute("height");
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "oz-ks-svg"); svg.removeAttribute("style");
  svg.querySelectorAll("title").forEach((x) => x.remove());
  return `<div class="oz-ks"><span class="oz-ks-n">${n}</span>${svg.outerHTML.replace(/&nbsp;/g, " ")}<b>${maj}</b><small>${min}</small></div>`;
});
const block = `<figure class="oz-figure"><div class="oz-ks-grid" role="img" aria-label="Mười lăm hóa biểu: Đô trưởng không dấu; Sol, Rê, La, Mi, Si, Fa thăng, Đô thăng trưởng có 1 đến 7 dấu thăng; Fa, Si giáng, Mi giáng, La giáng, Rê giáng, Sol giáng, Đô giáng trưởng có 1 đến 7 dấu giáng; kèm giọng thứ song song">${cells.join("")}</div><figcaption>Mười lăm hóa biểu. Dưới mỗi hóa biểu: giọng trưởng (đậm) và giọng thứ song song. Dấu hóa luôn được thêm theo đúng thứ tự.</figcaption></figure>`;
let changed = 0;
for (const f of ["docs/nhac-ly/08-hoa-bieu.md", "docs/bat-dau/tom-tat.md"]) {
  const p = new URL("../" + f, import.meta.url);
  const s = fs.readFileSync(p, "utf8");
  const out = s.replace(/<!-- fig:keysigs -->(?:\n[\s\S]*?\n<!-- \/fig:keysigs -->)?/, `<!-- fig:keysigs -->\n${block}\n<!-- /fig:keysigs -->`);
  if (out !== s) { fs.writeFileSync(p, out); changed++; }
}
console.log("keysigs: đã cập nhật", changed, "trang");
