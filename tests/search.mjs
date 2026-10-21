// Mô phỏng ô tìm kiếm của site (lunr + gói tiếng Việt, cấu hình lấy từ search_index.json):
// gõ có dấu hay không dấu đều phải ra đúng trang.
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const lunr = require("lunr");
require("lunr-languages/lunr.stemmer.support")(lunr);
require("lunr-languages/lunr.vi")(lunr);
require("lunr-languages/lunr.multi")(lunr);

const data = JSON.parse(fs.readFileSync(new URL("../site/search/search_index.json", import.meta.url), "utf8"));
lunr.tokenizer.separator = new RegExp(data.config.separator);
const strip = (h) => h.replace(/<[^>]+>/g, " ");
const origWarn = console.warn; console.warn = () => {};
const index = lunr(function () {
  this.use(lunr.multiLanguage(...data.config.lang));
  this.pipeline.reset(); this.searchPipeline.reset();
  for (const p of data.config.pipeline) { this.pipeline.add(lunr[p]); this.searchPipeline.add(lunr[p]); }
  this.ref("location"); this.field("title", { boost: 1000 }); this.field("text");
  data.docs.forEach((d) => this.add({ location: d.location, title: strip(d.title), text: strip(d.text) }));
});
console.warn = origWarn;
/* [truy vấn, trang phải nằm trong 5 kết quả đầu] */
const CASES = [
  ["hợp âm ba", "nhac-ly/10-hop-am-ba/"], ["hop am ba", "nhac-ly/10-hop-am-ba/"],
  ["điệu thức", "nhac-ly/16-dieu-thuc-ngu-cung/"], ["dieu thuc", "nhac-ly/16-dieu-thuc-ngu-cung/"],
  ["doc not", "luyen-tap/doc-not/"], ["hoa bieu", "nhac-ly/08-hoa-bieu/"],
  ["dan bau", "lich-su/nhac-truyen-thong-viet-nam/"], ["dau van tay", "nhan-dien/dau-van-tay/"],
  ["nghe mu", "nhan-dien/nghe-mu/"], ["Boléro", "nghe-nhac/ravel-bolero/"],
  ["bàn đạp", "piano/ban-dap/"], ["ban dap", "piano/ban-dap/"], ["ngon bam", "piano/gam/"],
  ["lay tren lay duoi", "piano/not-hoa-my/"], ["Goldberg", "nghe-nhac/bach-goldberg/"],
  ["la candeur", "piano/tac-pham/burgmuller-la-candeur/"], ["schemata", "piano/hoa-am/mau-galant/"], ["ung tac", "piano/hoa-am/ung-tac/"],
  ["fantaisie impromptu", "piano/tac-pham/chopin-fantaisie-impromptu/"], ["gondellied", "piano/tac-pham/mendelssohn-thuyen-ca/"],
  ["quang tam", "piano/quang-tam-buoc-nhay/"], ["bốn tay", "piano/choi-cung-nguoi-khac/"], ["senza sordino", "piano/tac-pham/beethoven-anh-trang/"],
  ["máy lên dây", "luyen-tap/hat-lai/"], ["giay ke khuong", "luyen-tap/phieu-bai-tap/"], ["cathédrale engloutie", "nghe-nhac/debussy-preludes/"]
];
let bad = 0;
for (const [q, want] of CASES) {
  const res = index.search(q.toLowerCase().split(/\s+/).map((t) => "+" + t).join(" ")).map((r) => r.ref.split("#")[0]);
  const top = [...new Set(res)].slice(0, 5);
  if (!top.includes(want)) { bad++; console.log("✗ tìm", JSON.stringify(q), "không thấy", want, "trong 5 kết quả đầu:", top.join(", ")); }
}
console.log(`search: ${CASES.length} truy vấn, ${bad} lỗi`);
process.exit(bad ? 1 : 0);
