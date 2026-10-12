/* Nghe kèm bản thu: dán link YouTube, nghe và bấm "Ghi mốc" ngay trong bảng "Theo dõi khi nghe".
   Mốc được lưu trong trình duyệt và có thể xuất ra Markdown để dán vĩnh viễn vào trang. */
(function () {
  "use strict";
  let apiPromise = null;

  function loadApi() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve, reject) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () { if (prev) prev(); resolve(); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = function () { apiPromise = null; reject(new Error("api")); };
      document.head.appendChild(s);
    });
    return apiPromise;
  }

  /* Lấy mã video từ các dạng link YouTube thường gặp */
  function videoId(url) {
    const s = String(url || "").trim();
    const m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/.exec(s);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
  }
  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
  }

  /* Dòng đang nghe: mốc gần nhất không muộn hơn thời điểm đang phát (cho phép sớm 0,25 giây) */
  function activeRow(t, marks) {
    let best = -1, bt = -1;
    Object.keys(marks).forEach(function (i) { const v = marks[i]; if (v <= t + 0.25 && v > bt) { bt = v; best = Number(i); } });
    return best;
  }

  function findTable(root) {
    const article = root.closest("article") || document;
    const heads = article.querySelectorAll("h2");
    for (let i = 0; i < heads.length; i++) {
      if (/Theo dõi khi nghe/.test(heads[i].textContent)) {
        let el = heads[i].nextElementSibling;
        while (el && el.tagName !== "H2") {
          const t = el.tagName === "TABLE" ? el : el.querySelector && el.querySelector("table");
          if (t) return t;
          el = el.nextElementSibling;
        }
      }
    }
    return null;
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const key = location.pathname;
    const store = function () { return window.OZProgress ? OZProgress.getStore("listen", {}) : {}; };
    const mine = function () { return store()[key] || { url: "", marks: {} }; };
    const save = function (v) { if (!window.OZProgress) return; const all = store(); all[key] = v; OZProgress.setStore("listen", all); };

    root.innerHTML =
      '<p class="oz-stats">Chọn một bản thu trên YouTube, dán link vào đây, rồi bấm <strong>Ghi mốc</strong> trong bảng bên dưới mỗi khi nghe thấy sự kiện tương ứng. Mốc được lưu trên máy bạn; bấm vào mốc để tua đến đó.</p>' +
      '<div class="oz-row"><input type="url" class="oz-input" placeholder="https://www.youtube.com/watch?v=..." aria-label="Link YouTube của bản thu">' +
      '<button class="oz-btn oz-btn--primary" data-act="load">Tải bản thu</button>' +
      '<button class="oz-btn" data-act="export">Xuất mốc ra Markdown</button></div>' +
      '<div class="oz-video" hidden><div class="oz-yt"></div></div>' +
      '<div class="oz-feedback" aria-live="polite"></div>';
    const input = root.querySelector("input"), fb = root.querySelector(".oz-feedback");
    const box = root.querySelector(".oz-video");
    let player = null;
    input.value = mine().url || "";

    const table = findTable(root);
    const cells = [];
    if (table) {
      table.querySelectorAll("tbody tr").forEach(function (tr, i) {
        const td = tr.querySelector("td");
        if (!td || td.textContent.trim() !== "…") return;
        td.classList.add("oz-mark-cell");
        cells.push({ i: i, td: td, tr: tr });
      });
    }
    function renderCells() {
      const marks = mine().marks || {};
      cells.forEach(function (c) {
        c.td.innerHTML = "";
        if (marks[c.i] !== undefined) {
          const t = document.createElement("button");
          t.className = "oz-btn oz-time"; t.textContent = fmt(marks[c.i]); t.title = "Tua đến mốc này";
          t.addEventListener("click", function () { if (player && player.seekTo) { player.seekTo(marks[c.i], true); player.playVideo(); } else fb.textContent = "Bấm “Tải bản thu” trước để tua đến mốc."; });
          const x = document.createElement("button");
          x.className = "oz-btn oz-time-x"; x.textContent = "×"; x.title = "Xóa mốc"; x.setAttribute("aria-label", "Xóa mốc");
          x.addEventListener("click", function () { const v = mine(); delete v.marks[c.i]; save(v); renderCells(); });
          c.td.appendChild(t); c.td.appendChild(x);
        } else {
          const b = document.createElement("button");
          b.className = "oz-btn oz-time-add"; b.textContent = "Ghi mốc";
          b.addEventListener("click", function () {
            if (!player || !player.getCurrentTime) { fb.textContent = "Hãy dán link và bấm “Tải bản thu” trước."; fb.className = "oz-feedback bad"; return; }
            const v = mine(); v.marks = v.marks || {}; v.marks[c.i] = Math.round(player.getCurrentTime()); save(v); renderCells();
            fb.textContent = "Đã ghi mốc " + fmt(v.marks[c.i]) + "."; fb.className = "oz-feedback ok";
          });
          c.td.appendChild(b);
        }
      });
    }
    renderCells();
    if (!cells.length) fb.textContent = "Trang này không có bảng mốc thời gian; bạn vẫn có thể nghe bản thu ở đây.";

    /* Bản đồ nghe chạy theo bản thu: tô sáng dòng có mốc gần nhất trước thời điểm đang phát.
       Chỉ chạy khi có trình phát, dừng khi rời trang; mỗi 400 ms chỉ đổi lớp CSS nếu dòng thay đổi. */
    let timer = 0, current = -1;
    function follow() {
      clearInterval(timer);
      timer = setInterval(function () {
        if (!root.isConnected) { clearInterval(timer); return; }
        if (!player || !player.getCurrentTime) return;
        const marks = mine().marks || {};
        const r = Object.keys(marks).length ? activeRow(player.getCurrentTime(), marks) : -1;
        if (r === current) return;
        current = r;
        cells.forEach(function (c) { c.tr.classList.toggle("oz-now", c.i === r); });
      }, 400);
    }
    function load() {
      const id = videoId(input.value);
      if (!id) { fb.textContent = "Link chưa đúng. Hãy dán link YouTube dạng youtube.com/watch?v=… hoặc youtu.be/…"; fb.className = "oz-feedback bad"; return; }
      const v = mine(); if (v.url !== input.value.trim()) { v.url = input.value.trim(); save(v); }
      fb.textContent = "Đang tải…"; fb.className = "oz-feedback";
      loadApi().then(function () {
        box.hidden = false;
        if (player && player.loadVideoById) { player.loadVideoById(id); fb.textContent = ""; return; }
        player = new YT.Player(root.querySelector(".oz-yt"), {
          host: "https://www.youtube-nocookie.com",
          videoId: id, width: "100%", height: "100%",
          playerVars: { rel: 0, modestbranding: 1 },
          events: { onReady: function () { fb.textContent = "Sẵn sàng. Bấm phát rồi “Ghi mốc” khi nghe thấy từng sự kiện. Dòng đang nghe sẽ được tô sáng theo các mốc đã ghi."; fb.className = "oz-feedback ok"; follow(); } }
        });
      }).catch(function () { fb.textContent = "Không tải được trình phát YouTube. Kiểm tra kết nối mạng."; fb.className = "oz-feedback bad"; });
    }
    function exportMd() {
      const marks = mine().marks || {};
      if (!table) return;
      const head = Array.prototype.map.call(table.querySelectorAll("thead th"), function (h) { return h.textContent.trim(); });
      const rows = Array.prototype.map.call(table.querySelectorAll("tbody tr"), function (tr, i) {
        const tds = Array.prototype.map.call(tr.querySelectorAll("td"), function (td, j) {
          return j === 0 && td.classList.contains("oz-mark-cell") ? (marks[i] !== undefined ? fmt(marks[i]) : "…") : td.textContent.trim().replace(/\|/g, "\\|");
        });
        return "| " + tds.join(" | ") + " |";
      });
      const md = "Bản thu: " + (mine().url || "(chưa có link)") + "\n\n| " + head.join(" | ") + " |\n|" + head.map(function () { return "---"; }).join("|") + "|\n" + rows.join("\n") + "\n";
      const done = function () { fb.textContent = "Đã sao chép. Dán vào file .md của trang này để lưu vĩnh viễn."; fb.className = "oz-feedback ok"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(md).then(done, function () { window.prompt("Sao chép đoạn sau:", md); });
      else window.prompt("Sao chép đoạn sau:", md);
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "load") load();
      if (b.dataset.act === "export") exportMd();
    });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") load(); });
  }

  window.OZListen = { videoId: videoId, fmt: fmt, activeRow: activeRow };
  function init() { document.querySelectorAll(".oz-listen").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
