/* Kế hoạch học tự thích ứng (.oz-plan) và bảng năng lực (.oz-skills).
   Dựa trên: độ chính xác gần đây của từng kỹ năng, số ngày chưa luyện, bài học đã xong, thẻ đến hạn. */
(function () {
  "use strict";
  /* id, tên, đường dẫn, bài học cần xong để mở khóa (hoặc null), phút gợi ý */
  const SKILLS = [
    ["notes", "Đọc nốt", "luyen-tap/doc-not/", null, 5],
    ["rhythm", "Tiết tấu", "luyen-tap/tiet-tau/", null, 5],
    ["intervals", "Nhận biết quãng", "luyen-tai/nghe-quang/#luyen-voi-cong-cu", null, 5],
    ["keysig", "Hóa biểu", "luyen-tap/hoa-bieu/", "08-hoa-bieu", 4],
    ["scales", "Nhận biết gam", "luyen-tai/nghe-gam/#luyen-voi-cong-cu", "07-gam-thu", 4],
    ["chords", "Nhận biết hợp âm", "luyen-tai/nghe-hop-am/#luyen-voi-cong-cu", "10-hop-am-ba", 5],
    ["sight", "Thị tấu một bè", "luyen-tap/thi-tau/", "06-gam-truong", 5],
    ["sight2", "Thị tấu hai tay", "luyen-tap/thi-tau-hai-tay/", "02-khuong-nhac-khoa", 5],
    ["dictation", "Chép giai điệu", "luyen-tap/chep-giai-dieu/", "09-quang", 5],
    ["sing", "Hát lại", "luyen-tap/hat-lai/", "09-quang", 4],
    ["cadence", "Nhận biết kết", "luyen-tai/nghe-tien-trinh/#luyen-voi-cong-cu", "13-ket", 4],
    ["texture", "Nhận biết kết cấu", "nhan-dien/luyen-nghe/", "28-ket-cau", 4],
    ["style", "Đoán phong cách", "nhan-dien/luyen-nghe/", "28-ket-cau", 5],
    ["play", "Chơi theo", "luyen-tap/choi-theo/", null, 6]
  ];
  const LESSONS = ["01-cao-do-ten-not", "02-khuong-nhac-khoa", "03-truong-do", "04-nhip", "05-dau-hoa", "06-gam-truong", "07-gam-thu", "08-hoa-bieu", "09-quang",
    "10-hop-am-ba", "11-hop-am-bay", "12-hoa-am-chuc-nang", "13-ket", "14-ky-hieu-bieu-dien", "15-tiet-tau-nang-cao", "16-dieu-thuc-ngu-cung", "17-khoa-do-dich-giong",
    "18-am-ngoai-hop-am", "19-at-phu-chuyen-giong", "20-doc-tong-pho", "28-ket-cau", "29-chuoi-hoa-am", "30-phat-trien-motip", "31-hinh-thuc-nho",
    "21-hoa-am-bon-be", "22-doi-am", "23-hop-am-muon", "24-napoli-sau-tang", "25-be-tram-so", "26-phan-tich", "27-ky-hieu-hop-am", "32-ky-thuat-the-ky-20"];
  const LESSON_NAMES = { "01-cao-do-ten-not": "Cao độ và tên nốt", "02-khuong-nhac-khoa": "Khuông nhạc và khóa", "03-truong-do": "Trường độ và dấu lặng", "04-nhip": "Nhịp và số chỉ nhịp", "05-dau-hoa": "Cung, nửa cung và dấu hóa", "06-gam-truong": "Gam trưởng", "07-gam-thu": "Gam thứ", "08-hoa-bieu": "Hóa biểu và vòng quãng năm", "09-quang": "Quãng", "10-hop-am-ba": "Hợp âm ba", "11-hop-am-bay": "Hợp âm bảy và thể đảo", "12-hoa-am-chuc-nang": "Hòa âm chức năng", "13-ket": "Kết và câu nhạc", "14-ky-hieu-bieu-dien": "Ký hiệu biểu diễn", "15-tiet-tau-nang-cao": "Tiết tấu nâng cao", "16-dieu-thuc-ngu-cung": "Điệu thức và ngũ cung", "17-khoa-do-dich-giong": "Khóa Đô và dịch giọng", "18-am-ngoai-hop-am": "Âm ngoài hợp âm", "19-at-phu-chuyen-giong": "Át phụ và chuyển giọng", "20-doc-tong-pho": "Đọc tổng phổ", "21-hoa-am-bon-be": "Hòa âm bốn bè", "22-doi-am": "Đối âm", "23-hop-am-muon": "Hợp âm mượn", "24-napoli-sau-tang": "Napoli và sáu tăng", "25-be-tram-so": "Bè trầm số", "26-phan-tich": "Phân tích một tác phẩm", "27-ky-hieu-hop-am": "Ký hiệu hợp âm pop và jazz", "28-ket-cau": "Kết cấu âm nhạc", "29-chuoi-hoa-am": "Chuỗi hòa âm", "30-phat-trien-motip": "Phát triển môtip", "31-hinh-thuc-nho": "Hình thức nhỏ", "32-ky-thuat-the-ky-20": "Kỹ thuật thế kỷ 20" };

  function siteBase() {
    const l = document.querySelector('link[rel="manifest"]');
    return l ? new URL(".", l.href).href : new URL("./", location.href).href;
  }
  function daysSince(iso, today) {
    if (!iso) return 99;
    const a = iso.split("-").map(Number), b = today.split("-").map(Number);
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }
  function lessonsDone() {
    const l = window.OZProgress ? OZProgress.getStore("lessons", {}) : {};
    const done = {};
    Object.keys(l).forEach(function (k) { const m = /nhac-ly\/([^/]+)\/?$/.exec(k); if (m) done[m[1]] = l[k]; });
    return done;
  }

  /* Gam của tuần theo chặng piano: cặp giọng trưởng và giọng thứ song song, xoay vòng mỗi tuần */
  const KEYS_ALL = ["Đô trưởng và La thứ", "Sol trưởng và Mi thứ", "Rê trưởng và Si thứ", "La trưởng và Fa♯ thứ", "Mi trưởng và Đô♯ thứ", "Si trưởng và Sol♯ thứ",
    "Fa♯ trưởng và Rê♯ thứ", "Rê♭ trưởng và Si♭ thứ", "La♭ trưởng và Fa thứ", "Mi♭ trưởng và Đô thứ", "Si♭ trưởng và Sol thứ", "Fa trưởng và Rê thứ"];
  const KEYS_BY_STAGE = {
    2: ["Đô trưởng và La thứ", "Sol trưởng và Mi thứ", "Fa trưởng và Rê thứ", "Rê trưởng và Si thứ"],
    3: ["Đô trưởng và La thứ", "Sol trưởng và Mi thứ", "Fa trưởng và Rê thứ", "Rê trưởng và Si thứ", "La trưởng và Fa♯ thứ", "Si♭ trưởng và Sol thứ", "Mi♭ trưởng và Đô thứ", "Mi trưởng và Đô♯ thứ"]
  };
  const FIVE = ["Đô", "Sol", "Fa", "Rê", "La"];
  function weekIndex(today) {
    const a = today.split("-").map(Number);
    return Math.floor((Date.UTC(a[0], a[1] - 1, a[2]) / 86400000 + 3) / 7); /* tuần bắt đầu từ thứ Hai */
  }
  function warmup(stage, today) {
    const w = weekIndex(today);
    if (stage <= 1) return { kind: "piano", name: "Khởi động: thế tay năm ngón ở " + FIVE[w % FIVE.length] + " trưởng, từng tay rồi hai tay", url: "piano/nam-ngon/", mins: 5, reason: "khởi động tuần này" };
    const list = KEYS_BY_STAGE[stage] || KEYS_ALL;
    return { kind: "piano", name: "Khởi động: gam " + list[w % list.length] + (stage >= 4 ? ", hai tay, hai quãng tám" : ", từng tay rồi hai tay"), url: "piano/gam/", mins: 5, reason: "gam của tuần" };
  }
  function pianoItems(piano, today) {
    const rep = piano.rep || {};
    const learning = Object.keys(rep).filter(function (k) { return rep[k] && rep[k].status === "learning"; })
      .map(function (k) { return { url: k, name: rep[k].name || k, last: rep[k].last || "" }; })
      .sort(function (a, b) { return a.last < b.last ? -1 : a.last > b.last ? 1 : 0; });
    const stage = piano.stage || (learning.length ? 2 : 0);
    if (!stage) return [{ kind: "piano", name: "Bên đàn: Hai tuần đầu tiên", url: "piano/hai-tuan-dau/", mins: 15, reason: "bắt đầu từ đây nếu bạn mới học" }];
    const out = [warmup(stage, today)];
    learning.slice(0, 2).forEach(function (r) {
      const d = daysSince(r.last, today);
      out.push({ kind: "piece", name: "Tập bài: " + r.name, url: r.url, mins: learning.length > 1 ? 10 : 15, reason: !r.last ? "mới thêm" : d === 0 ? "đã tập hôm nay" : d + " ngày chưa tập" });
    });
    if (!learning.length) out.push({ kind: "piece", name: "Chọn một bài cho chặng " + stage, url: "piano/tac-pham-theo-cap/", mins: 5, reason: "chưa có bài đang tập" });
    return out;
  }

  /* Hàm thuần: nhận dữ liệu, trả kế hoạch. Dùng được cả trong kiểm thử. */
  function compute(state) {
    const today = state.today, skills = state.skills || {}, done = state.lessons || {};
    const rows = SKILLS.map(function (s) {
      const st = skills[s[0]] || { n: 0, c: 0, ema: 0.5, last: "" };
      const unlocked = st.n > 0 || !s[3] || !!done[s[3]];
      const days = daysSince(st.last, today);
      const weak = st.n < 5 ? 0.4 : 1 - st.ema;
      const stale = st.n === 0 ? 0.5 : Math.min(days, 7) / 7;
      let score = weak * 0.7 + stale * 0.3;
      if (st.n >= 5 && st.ema < 0.7) score += 0.2; /* ưu tiên sửa điểm yếu đã biết */
      if (s[0] === "play" && st.n === 0) score -= 0.4; /* cần micro hoặc đàn: chỉ gợi ý khi đã từng dùng */
      const reason = st.n === 0 ? "chưa luyện lần nào" : (st.n >= 5 && st.ema < 0.7 ? "độ chính xác gần đây " + Math.round(st.ema * 100) + "%" : (days >= 3 ? days + " ngày chưa luyện" : "duy trì"));
      return { id: s[0], name: s[1], url: s[2], mins: s[4], unlocked: unlocked, n: st.n, ema: st.ema, days: days, score: score, reason: reason };
    });
    const pick = [];
    let fresh = 0;
    rows.filter(function (r) { return r.unlocked; }).sort(function (a, b) { return b.score - a.score; }).forEach(function (r) {
      if (pick.length >= 3) return;
      if (r.n === 0) { if (fresh >= 1 && rows.some(function (x) { return x.unlocked && x.n > 0 && pick.indexOf(x) < 0; })) return; fresh++; }
      pick.push(r);
    });
    const plan = pianoItems(state.piano || {}, today);
    const next = LESSONS.filter(function (k) { return !done[k]; })[0];
    if (next) plan.push({ kind: "lesson", name: "Bài học: " + LESSON_NAMES[next], url: "nhac-ly/" + next + "/", mins: 8, reason: "bài tiếp theo chưa xong" });
    if (state.cardsDue > 0) plan.push({ kind: "cards", name: "Ôn " + state.cardsDue + " thẻ thuật ngữ", url: "nhac-ly/tu-dien/", mins: 3, reason: "thẻ đến hạn hôm nay" });
    pick.slice(0, 2).forEach(function (r) { plan.push({ kind: "skill", name: r.name, url: r.url, mins: r.mins, reason: r.reason }); });
    plan.push({ kind: "listen", name: "Nghe chủ động một tác phẩm", url: "nghe-nhac/", mins: 6, reason: "mỗi ngày một chút" });
    return { plan: plan, rows: rows, total: plan.reduce(function (s, p) { return s + p.mins; }, 0) };
  }

  function current() {
    const P = window.OZProgress;
    const cards = P ? P.getStore("cards", {}) : {};
    const t = P ? P.today() : "";
    const lv = P ? P.getStore("pianoLevel", null) : null;
    return compute({ today: t, skills: P ? P.getStore("skills", {}) : {}, lessons: lessonsDone(), cardsDue: Object.keys(cards).filter(function (k) { return cards[k].due <= t; }).length,
      piano: { stage: lv && lv.stage || 0, rep: P ? P.getStore("repertoire", {}) : {} } });
  }

  function mountPlan(root) {
    if (!window.OZProgress) return;
    root.classList.add("oz-tool");
    function render() {
      const r = current(), base = siteBase();
      root.innerHTML = '<p class="oz-stats">Buổi tập hôm nay (khoảng ' + r.total + " phút), bắt đầu bên đàn, rồi đến đọc nhạc, nhạc lý và nghe; site tự chọn dựa trên việc bạn đã tập:</p><ol class=\"oz-plan-list\">" +
        r.plan.map(function (p) { return '<li><a href="' + base + p.url + '">' + p.name + "</a> <span class=\"oz-stats\">· " + p.mins + " phút · " + p.reason + "</span></li>"; }).join("") + "</ol>";
    }
    if (!root.dataset.ready) { root.dataset.ready = "1"; document.addEventListener("oz:progress", render); }
    render();
  }
  function mountSkills(root) {
    if (!window.OZProgress) return;
    root.classList.add("oz-tool");
    function render() {
      const r = current(), base = siteBase();
      root.innerHTML = '<table class="oz-skill-table"><thead><tr><th>Kỹ năng</th><th>Độ chính xác gần đây</th><th>Số lần</th><th>Lần cuối</th></tr></thead><tbody>' +
        r.rows.map(function (x) {
          const pct = x.n ? Math.round(x.ema * 100) : null;
          return "<tr" + (x.unlocked ? "" : ' class="oz-locked"') + '><td><a href="' + base + x.url + '">' + x.name + "</a>" + (x.unlocked ? "" : ' <span class="oz-stats">(mở sau bài học tương ứng)</span>') + "</td><td>" +
            (pct === null ? '<span class="oz-stats">–</span>' : '<span class="oz-bar"><span style="width:' + pct + '%"></span></span> ' + pct + "%") +
            "</td><td>" + x.n + "</td><td>" + (x.n ? (x.days === 0 ? "hôm nay" : x.days + " ngày trước") : "–") + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    if (!root.dataset.ready) { root.dataset.ready = "1"; document.addEventListener("oz:progress", render); }
    render();
  }
  window.OZPlan = { compute: compute, SKILLS: SKILLS, warmup: warmup };
  /* Trang chủ: người đã từng tập thấy khối "Hôm nay" ngay dưới phần mở đầu; người mới thấy các lối vào trước. */
  function homeOrder() {
    const today = document.querySelector(".oz-home-today"), paths = document.querySelector(".oz-home-paths");
    if (!today || !paths || !window.OZProgress) return;
    const d = OZProgress.load(), st = d.store || {};
    const used = Object.keys(d.days || {}).length > 0 || Object.keys(st).some(function (k) { const v = st[k]; return v && (typeof v !== "object" || Object.keys(v).length); });
    if (used && today.compareDocumentPosition(paths) & Node.DOCUMENT_POSITION_PRECEDING) paths.parentNode.insertBefore(today, paths);
  }
  function init() { homeOrder(); document.querySelectorAll(".oz-plan").forEach(mountPlan); document.querySelectorAll(".oz-skills").forEach(mountSkills); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
