/* Nghe kèm bản thu: link YouTube, link file âm thanh (.mp3, .ogg…) hoặc file trên máy; bấm "Ghi mốc" ngay trong
   bảng "Theo dõi khi nghe". Trang có thể gợi ý sẵn một bản thu giấy phép mở: data-audio (mp3), data-audio-ogg,
   data-credit, data-page. Mốc lưu trong trình duyệt, riêng cho từng bản thu, và xuất được ra Markdown. */
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
  /* Link trực tiếp tới một file âm thanh (kể cả dạng Special:FilePath của Wikimedia Commons) */
  const EXT = { mp3: "audio/mpeg", ogg: "audio/ogg", oga: "audio/ogg", opus: "audio/ogg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", flac: "audio/flac", webm: "audio/webm" };
  function audioExt(url) {
    const m = /\.([a-z0-9]{2,4})(?:[?#].*)?$/i.exec(String(url || "").trim());
    return m && EXT[m[1].toLowerCase()] ? m[1].toLowerCase() : null;
  }
  function audioUrl(url) {
    const s = String(url || "").trim();
    if (!/^https?:\/\/[^\s/]+\.[^\s/]+\/\S+$/i.test(s) || videoId(s)) return null;
    return audioExt(s) || /\/Special:FilePath\//.test(s) ? s : null;
  }
  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Đổi bản thu: cất mốc của bản cũ vào byUrl, lấy lại mốc đã có của bản mới (thuần, để kiểm thử) */
  function switchSource(v, k) {
    v = v || { url: "", marks: {} };
    if (v.url === k) return v;
    if (!v.url) return Object.assign({}, v, { url: k });   /* bản thu đầu tiên nhận luôn các mốc đang có */
    const by = Object.assign({}, v.byUrl || {});
    if (v.url && v.marks && Object.keys(v.marks).length) by[v.url] = v.marks;
    const out = { url: k, marks: by[k] || {} };
    delete by[k];
    if (Object.keys(by).length) out.byUrl = by;
    return out;
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
    const def = root.dataset.audio ? { url: root.dataset.audio, ogg: root.dataset.audioOgg || "", credit: root.dataset.credit || "", page: root.dataset.page || "" } : null;

    root.innerHTML =
      '<p class="oz-stats">Nghe một bản thu: dán link YouTube hoặc link tới một file âm thanh (.mp3, .ogg…), hoặc chọn một file trên máy bạn. Rồi bấm <strong>Ghi mốc</strong> trong bảng bên dưới mỗi khi nghe thấy sự kiện tương ứng. Mốc được lưu trên máy bạn, riêng cho từng bản thu; bấm vào mốc để tua đến đó.</p>' +
      (def ? '<p class="oz-stats">Bản thu gợi ý: ' + esc(def.credit || "bản thu có giấy phép mở") +
        (def.page ? ' (<a href="' + esc(def.page) + '" target="_blank" rel="noopener">nguồn và giấy phép</a>)' : "") +
        '. <button class="oz-btn" data-act="default">Nghe bản này</button></p>' : "") +
      '<div class="oz-row"><input type="url" class="oz-input" placeholder="Link YouTube hoặc link file .mp3, .ogg" aria-label="Link bản thu: YouTube hoặc file âm thanh">' +
      '<button class="oz-btn oz-btn--primary" data-act="load">Tải bản thu</button>' +
      '<button class="oz-btn" data-act="file">Chọn file trên máy</button>' +
      '<input type="file" accept="audio/*" hidden aria-label="Chọn file âm thanh trên máy">' +
      '<button class="oz-btn" data-act="export">Xuất mốc ra Markdown</button></div>' +
      '<div class="oz-video" hidden><div class="oz-yt"></div></div>' +
      '<audio class="oz-audio" controls preload="none" hidden></audio>' +
      '<div class="oz-feedback" aria-live="polite"></div>';
    const input = root.querySelector('input[type="url"]'), fileIn = root.querySelector('input[type="file"]');
    const fb = root.querySelector(".oz-feedback"), box = root.querySelector(".oz-video"), audio = root.querySelector("audio");
    let yt = null, player = null, objUrl = null;
    const saved = mine().url || "";
    input.value = /^file:/.test(saved) || (def && saved === def.url) ? "" : saved;
    const say = function (msg, cls) { fb.textContent = msg; fb.className = "oz-feedback" + (cls ? " " + cls : ""); };
    const use = function (k) { const v = mine(); if (v.url !== k) { save(switchSource(v, k)); renderCells(); } };

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
          t.addEventListener("click", function () { if (player) player.seek(marks[c.i]); else say("Tải bản thu trước (bản gợi ý, link hoặc file trên máy) để tua đến mốc."); });
          const x = document.createElement("button");
          x.className = "oz-btn oz-time-x"; x.textContent = "×"; x.title = "Xóa mốc"; x.setAttribute("aria-label", "Xóa mốc");
          x.addEventListener("click", function () { const v = mine(); delete v.marks[c.i]; save(v); renderCells(); });
          c.td.appendChild(t); c.td.appendChild(x);
        } else {
          const b = document.createElement("button");
          b.className = "oz-btn oz-time-add"; b.textContent = "Ghi mốc";
          b.addEventListener("click", function () {
            if (!player) { say("Hãy chọn một bản thu trước: bản gợi ý, link YouTube, link file âm thanh hoặc file trên máy.", "bad"); return; }
            const v = mine(); v.marks = v.marks || {}; v.marks[c.i] = Math.round(player.time()); save(v); renderCells();
            say("Đã ghi mốc " + fmt(v.marks[c.i]) + ".", "ok");
          });
          c.td.appendChild(b);
        }
      });
    }
    renderCells();
    if (!cells.length) say("Trang này không có bảng mốc thời gian; bạn vẫn có thể nghe bản thu ở đây.");
    else if (/^file:/.test(saved)) say("Lần trước bạn nghe file “" + saved.slice(5) + "” trên máy. Chọn lại đúng file ấy để dùng các mốc đã ghi.");

    /* Bản đồ nghe chạy theo bản thu: tô sáng dòng có mốc gần nhất trước thời điểm đang phát.
       Chỉ chạy khi có trình phát, dừng khi rời trang; mỗi 400 ms chỉ đổi lớp CSS nếu dòng thay đổi. */
    let timer = 0, current = -1;
    function follow() {
      clearInterval(timer);
      timer = setInterval(function () {
        if (!root.isConnected) { clearInterval(timer); return; }
        if (!player) return;
        const marks = mine().marks || {};
        const r = Object.keys(marks).length ? activeRow(player.time(), marks) : -1;
        if (r === current) return;
        current = r;
        cells.forEach(function (c) { c.tr.classList.toggle("oz-now", c.i === r); });
      }, 400);
    }
    function stopVideo() { box.hidden = true; if (yt && yt.pauseVideo) { try { yt.pauseVideo(); } catch (e) { /* trình phát chưa sẵn sàng */ } } }
    function audioPlayer() {
      return { time: function () { return audio.currentTime || 0; },
        seek: function (t) { audio.currentTime = t; const p = audio.play(); if (p && p.catch) p.catch(function () {}); } };
    }
    /* Nguồn là file trên mạng: thẻ <source> cho từng định dạng, trình duyệt tự chọn cái phát được */
    function showAudio(list) {
      stopVideo();
      if (!audio.paused) audio.pause();
      audio.removeAttribute("src"); audio.innerHTML = "";
      list.forEach(function (u, j) {
        const s = document.createElement("source"); s.src = u;
        const ext = audioExt(u); if (ext) s.type = EXT[ext];
        if (j === list.length - 1) s.addEventListener("error", function () { say("Không phát được bản thu này. Hãy kiểm tra kết nối mạng; nếu là link bạn tự dán, link phải trỏ thẳng tới một file âm thanh (.mp3, .ogg…).", "bad"); });
        audio.appendChild(s);
      });
      audio.hidden = false; audio.load();
      player = audioPlayer(); follow();
    }
    function showYouTube(id) {
      if (!audio.paused) audio.pause();
      audio.hidden = true;
      say("Đang tải…");
      loadApi().then(function () {
        box.hidden = false;
        const ready = function () { player = { time: function () { return yt.getCurrentTime ? yt.getCurrentTime() : 0; }, seek: function (t) { yt.seekTo(t, true); yt.playVideo(); } }; follow(); };
        if (yt && yt.loadVideoById) { yt.loadVideoById(id); say(""); ready(); return; }
        yt = new YT.Player(root.querySelector(".oz-yt"), {
          host: "https://www.youtube-nocookie.com",
          videoId: id, width: "100%", height: "100%",
          playerVars: { rel: 0, modestbranding: 1 },
          events: { onReady: function () { say("Sẵn sàng. Bấm phát rồi “Ghi mốc” khi nghe thấy từng sự kiện. Dòng đang nghe sẽ được tô sáng theo các mốc đã ghi.", "ok"); ready(); } }
        });
      }).catch(function () { say("Không tải được trình phát YouTube. Kiểm tra kết nối mạng.", "bad"); });
    }
    function load() {
      const raw = input.value.trim(), id = videoId(raw), au = id ? null : audioUrl(raw);
      if (!id && !au) { say("Link chưa đúng. Hãy dán link YouTube (youtube.com/watch?v=… hoặc youtu.be/…) hoặc link trực tiếp tới một file âm thanh (.mp3, .ogg…).", "bad"); return; }
      use(raw);
      if (id) showYouTube(id);
      else { showAudio([au]); say("Sẵn sàng. Bấm phát ▶ rồi “Ghi mốc” khi nghe thấy từng sự kiện.", "ok"); }
    }
    function loadDefault() {
      use(def.url); input.value = "";
      showAudio(def.ogg ? [def.url, def.ogg] : [def.url]);
      say("Đã tải bản thu gợi ý. Bấm phát ▶; mốc của bản này được lưu riêng.", "ok");
    }
    fileIn.addEventListener("change", function () {
      const f = fileIn.files && fileIn.files[0]; if (!f) return;
      if (objUrl) URL.revokeObjectURL(objUrl);
      objUrl = URL.createObjectURL(f);
      use("file:" + f.name); input.value = "";
      stopVideo();
      if (!audio.paused) audio.pause();
      audio.innerHTML = ""; audio.src = objUrl; audio.hidden = false; audio.load();
      player = audioPlayer(); follow();
      say("Đang dùng file “" + f.name + "” trên máy bạn; file không được gửi đi đâu. Mốc được lưu theo tên file, lần sau chọn lại đúng file này để dùng tiếp.", "ok");
    });
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
      const u = mine().url || "";
      const src = /^file:/.test(u) ? "file trên máy (" + u.slice(5) + ")" : (u || "(chưa có link)");
      const md = "Bản thu: " + src + "\n\n| " + head.join(" | ") + " |\n|" + head.map(function () { return "---"; }).join("|") + "|\n" + rows.join("\n") + "\n";
      const done = function () { say("Đã sao chép. Dán vào file .md của trang này để lưu vĩnh viễn.", "ok"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(md).then(done, function () { window.prompt("Sao chép đoạn sau:", md); });
      else window.prompt("Sao chép đoạn sau:", md);
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "load") load();
      if (b.dataset.act === "default") loadDefault();
      if (b.dataset.act === "file") fileIn.click();
      if (b.dataset.act === "export") exportMd();
    });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") load(); });
  }

  window.OZListen = { videoId: videoId, audioUrl: audioUrl, switchSource: switchSource, fmt: fmt, activeRow: activeRow };
  function init() { document.querySelectorAll(".oz-listen").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
