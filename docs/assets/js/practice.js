/* Theo dõi việc tập piano, lưu trong trình duyệt qua OZProgress (đi cùng sao lưu ở "Dữ liệu của tôi"):
   - danh sách việc "- [ ]" trên mọi trang bấm được và được nhớ (store.checks);
   - thẻ đầu mỗi bài học tác phẩm (.oz-piece): "Tôi đang tập bài này", "Hôm nay đã tập", "Đã chơi được" (store.repertoire);
   - danh sách bài đang tập (.oz-repertoire);
   - tự đánh giá chặng piano (.oz-piano-level) để kế hoạch hôm nay gợi ý đúng gam và bài (store.pianoLevel). */
(function () {
  "use strict";
  const STAGES = [
    ["Khởi đầu", "trước Grade 1"], ["Sơ cấp", "≈ Grade 1–2"], ["Sơ trung cấp", "≈ Grade 3"], ["Trung cấp", "≈ Grade 4–5"],
    ["Trung cấp cao", "≈ Grade 6"], ["Nâng cao", "≈ Grade 7–8"], ["Sau Grade 8", "diploma trở lên"]
  ];
  /* Gợi ý bắt đầu cho từng chặng: [đường dẫn trong site, tên] */
  const SUGGEST = {
    1: [["piano/hai-tuan-dau/", "Hai tuần đầu tiên"], ["piano/10-bai-dau-tien/", "10 bài đầu tiên (hai tay)"]],
    2: [["piano/tac-pham/mozart-minuet-k2/", "Mozart: Minuet Fa trưởng, K. 2"], ["piano/tac-pham/minuet-sol/", "Petzold: Minuet Sol trưởng"], ["piano/tac-pham/schumann-album/", "Schumann: Album für die Jugend"]],
    3: [["piano/tac-pham/clementi-sonatina/", "Clementi: Sonatina Op. 36 số 1"], ["piano/tac-pham/burgmuller-arabesque/", "Burgmüller: Arabesque"], ["piano/tac-pham/bach-prelude-bwv939/", "Bach: Prelude nhỏ Đô trưởng, BWV 939"]],
    4: [["piano/tac-pham/fur-elise/", "Beethoven: Für Elise"], ["piano/tac-pham/bach-prelude-do/", "Bach: Prelude Đô trưởng"], ["piano/tac-pham/beethoven-op49-2/", "Beethoven: Sonata Op. 49 số 2"]],
    5: [["piano/tac-pham/mozart-k545/", "Mozart: Sonata K. 545"], ["piano/tac-pham/bach-invention-1/", "Bach: Invention số 1"], ["piano/tac-pham/schumann-traumerei/", "Schumann: Träumerei"], ["piano/tac-pham/beethoven-anh-trang/", "Beethoven: Ánh trăng, chương 1"]],
    6: [["piano/tac-pham/pathetique-adagio/", "Beethoven: Pathétique, chương 2"], ["piano/tac-pham/chopin-nocturne-op9-2/", "Chopin: Nocturne Op. 9 số 2"], ["piano/tac-pham/bach-prelude-fugue-do-thu/", "Bach: Prelude và fugue Đô thứ"], ["piano/tac-pham/debussy-clair-de-lune/", "Debussy: Clair de lune"]],
    7: [["piano/tac-pham/chopin-fantaisie-impromptu/", "Chopin: Fantaisie-Impromptu"], ["piano/tac-pham/liszt-liebestraum/", "Liszt: Liebestraum số 3"], ["piano/tac-pham/chopin-ballade-1/", "Chopin: Ballade số 1"], ["piano/tac-pham-theo-cap/", "Tác phẩm theo cấp độ"]]
  };

  function P() { return window.OZProgress; }
  function siteBase() {
    const l = document.querySelector('link[rel="manifest"]');
    return l ? new URL(".", l.href).href : new URL("./", location.href).href;
  }
  /* Đường dẫn trang tính từ gốc site, ví dụ "piano/lo-trinh/" */
  function pageKey() {
    let base = "/";
    try { base = new URL(siteBase()).pathname; } catch (e) { /* giữ "/" */ }
    let p = location.pathname.replace(/index\.html$/, "");
    if (p.indexOf(base) === 0) p = p.slice(base.length);
    return p;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function itemText(li) {
    const c = li.cloneNode(true);
    c.querySelectorAll("ul, ol, .task-list-control").forEach(function (x) { x.remove(); });
    return c.textContent.replace(/\s+/g, " ").trim();
  }
  function ago(iso) {
    if (!iso) return "";
    const t = P().today().split("-").map(Number), a = iso.split("-").map(Number);
    const d = Math.round((Date.UTC(t[0], t[1] - 1, t[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
    return d <= 0 ? "hôm nay" : d === 1 ? "hôm qua" : d + " ngày trước";
  }

  /* ---------- Danh sách việc ---------- */
  function mountChecks() {
    const items = document.querySelectorAll("li.task-list-item");
    if (!items.length) return;
    const key = pageKey(), seen = {};
    const mine = (P().getStore("checks", {}) || {})[key] || {};
    items.forEach(function (li) {
      const label = li.firstElementChild;
      if (!label || !label.classList.contains("task-list-control")) return;
      const input = label.querySelector("input[type=checkbox]");
      if (!input || input.dataset.oz) return;
      const text = itemText(li), h = hash(text);
      seen[h] = (seen[h] || 0) + 1;
      const id = h + (seen[h] > 1 ? "-" + seen[h] : "");
      input.dataset.oz = id;
      input.disabled = false;
      input.removeAttribute("tabindex");
      label.removeAttribute("aria-hidden");
      input.setAttribute("aria-label", text.slice(0, 160) || "Đánh dấu đã xong");
      input.checked = !!mine[id];
      li.classList.toggle("oz-checked", input.checked);
      input.addEventListener("change", function () {
        const all = P().getStore("checks", {}) || {}, m = all[key] || {};
        if (input.checked) m[id] = P().today(); else delete m[id];
        if (Object.keys(m).length) all[key] = m; else delete all[key];
        P().setStore("checks", all);
        if (input.checked) P().record("checks", 1);
        li.classList.toggle("oz-checked", input.checked);
        li.dispatchEvent(new CustomEvent("oz:check", { bubbles: true }));
      });
    });
  }

  /* ---------- Bài đang tập ---------- */
  function title() {
    const h = document.querySelector(".md-content h1");
    return h ? h.textContent.replace(/¶/g, "").trim() : document.title.split(" - ")[0];
  }
  function update(key, fn) {
    const rep = P().getStore("repertoire", {}) || {};
    const t = P().today();
    const r = rep[key] || { name: title(), since: t, n: 0, last: "" };
    fn(r, t);
    r.updated = new Date().toISOString();
    rep[key] = r;
    P().setStore("repertoire", rep);
  }
  function mountPiece(card) {
    if (card.dataset.ready) return;
    card.dataset.ready = "1";
    const key = pageKey();
    const box = document.createElement("div");
    box.className = "oz-piece-actions";
    card.appendChild(box);
    function render() {
      const r = (P().getStore("repertoire", {}) || {})[key];
      const st = r ? r.status : "";
      let h;
      if (st === "learning") {
        h = (r.last === P().today()
          ? '<button type="button" class="oz-btn" disabled>Đã ghi buổi tập hôm nay</button>'
          : '<button type="button" class="oz-btn oz-btn--primary" data-a="practiced">Hôm nay đã tập bài này</button>') +
          '<button type="button" class="oz-btn" data-a="done">Đã chơi được trọn bài</button>' +
          '<button type="button" class="oz-btn oz-btn--quiet" data-a="remove">Bỏ khỏi bài đang tập</button>';
      } else if (st === "done") {
        h = '<span class="oz-stats">Bạn đã chơi được bài này' + (r.doneOn ? " (" + esc(r.doneOn) + ")" : "") + ".</span>" +
          '<button type="button" class="oz-btn" data-a="learning">Tập lại</button>';
      } else {
        h = '<button type="button" class="oz-btn oz-btn--primary" data-a="learning">Tôi đang tập bài này</button>' +
          '<span class="oz-stats">Bài sẽ hiện trong kế hoạch hôm nay ở trang chủ.</span>';
      }
      if (r && r.n && st !== "removed") h += '<span class="oz-stats">Đã tập ' + r.n + " buổi, lần cuối " + ago(r.last) + ".</span>";
      box.innerHTML = h;
    }
    box.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-a]");
      if (!b) return;
      const a = b.dataset.a;
      update(key, function (r, t) {
        r.name = title();
        if (a === "learning") { if (!r.since || r.status === "removed") r.since = t; r.status = "learning"; }
        else if (a === "done") { r.status = "done"; r.doneOn = t; }
        else if (a === "practiced") { r.status = "learning"; if (r.last !== t) { r.n = (r.n || 0) + 1; r.last = t; P().record("piano", 1); } }
        else if (a === "remove") r.status = "removed";
      });
    });
    document.addEventListener("oz:progress", function () { if (document.body.contains(card)) render(); });
    render();
  }
  function mountRepertoire(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const compact = root.hasAttribute("data-compact");
    const base = siteBase();
    function render() {
      const rep = P().getStore("repertoire", {}) || {};
      const rows = Object.keys(rep).map(function (k) { return Object.assign({ key: k }, rep[k]); })
        .filter(function (r) { return r.status === "learning" || r.status === "done"; });
      const learning = rows.filter(function (r) { return r.status === "learning"; })
        .sort(function (a, b) { return (a.last || "") < (b.last || "") ? -1 : 1; });
      const done = rows.filter(function (r) { return r.status === "done"; })
        .sort(function (a, b) { return (a.doneOn || "") < (b.doneOn || "") ? 1 : -1; });
      if (compact && !rows.length) { root.hidden = true; return; }
      root.hidden = false;
      const li = function (r, extra) { return '<li><a href="' + base + esc(r.key) + '">' + esc(r.name || r.key) + '</a> <span class="oz-stats">' + extra + "</span></li>"; };
      let h = '<p class="oz-tool-title">Bài đang tập</p>';
      h += learning.length
        ? "<ul class=\"oz-rep-list\">" + learning.map(function (r) { return li(r, r.last ? "· " + r.n + " buổi · lần cuối " + ago(r.last) : "· mới thêm"); }).join("") + "</ul>"
        : '<p class="oz-stats">Chưa có bài nào. Mở một <a href="' + base + 'piano/tac-pham/">bài học tác phẩm</a> và bấm "Tôi đang tập bài này".</p>';
      if (done.length) h += '<p class="oz-tool-title">Đã chơi được</p><ul class="oz-rep-list">' + done.map(function (r) { return li(r, r.doneOn ? "· " + esc(r.doneOn) : ""); }).join("") + "</ul>";
      root.innerHTML = h;
    }
    document.addEventListener("oz:progress", function () { if (document.body.contains(root)) render(); });
    render();
  }

  /* ---------- Tự đánh giá chặng piano ---------- */
  function mountLevel(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const groups = Array.prototype.slice.call(root.querySelectorAll("ul.task-list"));
    const out = document.createElement("div");
    out.className = "oz-tool oz-level-result";
    out.setAttribute("aria-live", "polite");
    root.appendChild(out);
    const base = siteBase();
    function stage() {
      let s = 1;
      for (let i = 0; i < groups.length; i++) {
        const boxes = groups[i].querySelectorAll("input[type=checkbox]");
        let n = 0;
        boxes.forEach(function (b) { if (b.checked) n++; });
        if (boxes.length && n >= Math.ceil(boxes.length * 2 / 3)) s++; else break;
      }
      return Math.min(s, STAGES.length);
    }
    function render(save) {
      const s = stage(), info = STAGES[s - 1];
      const saved = P().getStore("pianoLevel", null);
      if (save) P().setStore("pianoLevel", { stage: s, date: P().today(), updated: new Date().toISOString() });
      const any = root.querySelector("ul.task-list input:checked");
      out.innerHTML = (any || save || saved
        ? "<p><strong>Chặng của bạn: " + s + ". " + info[0] + "</strong> (" + info[1] + ").</p>"
        : "<p>Chưa đánh dấu gì: nếu bạn mới bắt đầu, đó là <strong>chặng 1. Khởi đầu</strong>.</p>") +
        '<p class="oz-stats">Nên bắt đầu với: ' + SUGGEST[s].map(function (x) { return '<a href="' + base + x[0] + '">' + esc(x[1]) + "</a>"; }).join(", ") +
        '. Chi tiết từng chặng: <a href="' + base + 'piano/lo-trinh/">lộ trình piano</a>.</p>' +
        (save || saved ? '<p class="oz-stats">Đã lưu. Kế hoạch hôm nay ở trang chủ sẽ gợi ý gam và bài theo chặng này.</p>' : "");
    }
    root.addEventListener("oz:check", function () { render(true); });
    render(false);
  }

  function init() {
    if (!P()) return;
    mountChecks();
    document.querySelectorAll(".oz-piece").forEach(mountPiece);
    document.querySelectorAll(".oz-repertoire").forEach(mountRepertoire);
    document.querySelectorAll(".oz-piano-level").forEach(mountLevel);
  }
  window.OZPractice = { STAGES: STAGES, SUGGEST: SUGGEST, hash: hash };
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
