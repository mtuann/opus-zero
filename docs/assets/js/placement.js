/* Bài kiểm tra đầu vào: khối ```placement, chia theo bài (dòng "@ số | tên | đường dẫn"). */
(function () {
  "use strict";
  function siteRoot() {
    const m = document.querySelector('link[rel="manifest"]');
    return m ? new URL(".", m.href).href : location.origin + "/";
  }
  function parse(src) {
    const groups = []; let g = null, q = null;
    src.split(/\r?\n/).forEach(function (raw) {
      const line = raw.trim(); if (!line) return;
      const tag = line[0], text = line.slice(1).trim();
      if (tag === "@") {
        const p = text.split("|").map(function (s) { return s.trim(); });
        g = { n: p[0], title: p[1], path: p[2], qs: [] }; groups.push(g);
      } else if (tag === "?" && g) { q = { q: text, opts: [] }; g.qs.push(q); }
      else if (q && (tag === "+" || tag === "-")) q.opts.push({ t: text, ok: tag === "+" });
    });
    return groups;
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const groups = parse(root.textContent);
    root.textContent = "";
    root.classList.add("oz-tool");
    const all = [];
    groups.forEach(function (g) { g.qs.forEach(function (q) { all.push({ g: g, q: q }); }); });
    let i = 0; const answers = [];
    const head = document.createElement("div"); head.className = "oz-stats";
    const body = document.createElement("div");
    root.appendChild(head); root.appendChild(body);

    function show() {
      if (i >= all.length) return finish();
      const item = all[i];
      head.textContent = "Câu " + (i + 1) + "/" + all.length + " (kiến thức bài " + item.g.n + ")";
      body.innerHTML = "<p><strong>" + item.q.q + "</strong></p>";
      const row = document.createElement("div"); row.className = "oz-row";
      shuffle(item.q.opts.slice()).concat([{ t: "Tôi chưa biết", ok: false, skip: true }]).forEach(function (o) {
        const b = document.createElement("button");
        b.className = "oz-btn"; b.textContent = o.t;
        b.addEventListener("click", function () { answers.push(o.ok); i++; show(); });
        row.appendChild(b);
      });
      body.appendChild(row);
    }
    function finish() {
      head.textContent = "Kết quả";
      let idx = 0; const perGroup = groups.map(function (g) {
        const res = answers.slice(idx, idx + g.qs.length); idx += g.qs.length;
        return { g: g, ok: res.every(Boolean), right: res.filter(Boolean).length, total: res.length };
      });
      const firstGap = perGroup.filter(function (r) { return !r.ok; })[0];
      const root = siteRoot();
      let html = "<table><thead><tr><th>Bài</th><th>Kết quả</th></tr></thead><tbody>" + perGroup.map(function (r) {
        return "<tr><td><a href='" + root + r.g.path + "'>" + r.g.n + ". " + r.g.title + "</a></td><td>" + (r.ok ? "Đã nắm" : "Cần học (" + r.right + "/" + r.total + ")") + "</td></tr>";
      }).join("") + "</tbody></table>";
      html = (firstGap
        ? "<p class='oz-feedback ok'>Gợi ý: bắt đầu từ <a href='" + root + firstGap.g.path + "'><strong>bài " + firstGap.g.n + ": " + firstGap.g.title + "</strong></a>." + (firstGap.g.n > 1 ? " Các bài trước đó bạn có thể đọc lướt và làm quiz cuối bài để đánh dấu đã học." : " Đây là điểm khởi đầu tốt cho người mới.") + "</p>"
        : "<p class='oz-feedback ok'>Bạn đã nắm chắc phần nền tảng. Hãy làm các bài ôn tập rồi chuyển sang <a href='" + root + "nhac-ly/15-tiet-tau-nang-cao/'>phần nâng cao</a>.</p>") + html;
      body.innerHTML = html;
      const again = document.createElement("button"); again.className = "oz-btn"; again.textContent = "Làm lại";
      again.addEventListener("click", function () { i = 0; answers.length = 0; show(); });
      body.appendChild(again);
      if (window.OZProgress) OZProgress.setStore("placement", { date: OZProgress.today(), start: firstGap ? firstGap.g.n : "done" });
    }
    show();
  }
  function init() { document.querySelectorAll(".oz-placement").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
