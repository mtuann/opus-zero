/* Thu âm buổi tập (.oz-recorder): ghi âm trong trình duyệt, lưu trên máy bằng IndexedDB, nghe lại và so sánh. */
(function () {
  "use strict";
  const DB = "opus-zero-recordings", STORE = "rec";
  function open() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error("idb"));
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE, { keyPath: "id" }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function tx(mode, fn) { return open().then(function (db) { return new Promise(function (res, rej) { const t = db.transaction(STORE, mode); const out = fn(t.objectStore(STORE)); t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); }; t.onerror = function () { rej(t.error); }; }); }); }
  const all = function () { return tx("readonly", function (s) { return s.getAll(); }); };
  const put = function (rec) { return tx("readwrite", function (s) { return s.put(rec); }); };
  const del = function (id) { return tx("readwrite", function (s) { return s.delete(id); }); };
  function fmt(sec) { sec = Math.round(sec); return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const ok = !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.indexedDB);
    root.innerHTML =
      '<div class="oz-row"><input class="oz-input" data-k="label" placeholder="Tên bản thu, ví dụ: Minuet Sol trưởng, ô 1–8"><button class="oz-btn oz-btn--primary" data-act="rec">● Thu</button><span class="oz-rec-time oz-stats"></span></div>' +
      '<div class="oz-feedback" aria-live="polite"></div>' +
      '<div class="oz-rec-compare" hidden><p class="oz-stats">So sánh hai bản thu (nghe lần lượt hoặc cùng lúc):</p><div class="oz-row oz-rec-ab"></div></div>' +
      '<div class="oz-rec-list"></div><p class="oz-stats oz-rec-storage"></p>';
    const fb = root.querySelector(".oz-feedback"), list = root.querySelector(".oz-rec-list"), timeEl = root.querySelector(".oz-rec-time");
    const cmp = root.querySelector(".oz-rec-compare"), ab = root.querySelector(".oz-rec-ab"), btn = root.querySelector('[data-act="rec"]');
    if (!ok) { fb.textContent = "Trình duyệt này không hỗ trợ thu âm. Hãy dùng Chrome, Edge, Firefox hoặc Safari bản mới."; fb.className = "oz-feedback bad"; btn.disabled = true; return; }
    let mr = null, chunks = [], startAt = 0, tick = 0, stream = null, urls = [], selected = [];
    function refresh() {
      urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = [];
      return all().then(function (recs) {
        recs.sort(function (a, b) { return b.id - a.id; });
        list.innerHTML = recs.length ? "" : '<p class="oz-stats">Chưa có bản thu nào.</p>';
        recs.forEach(function (r) {
          const u = URL.createObjectURL(r.blob); urls.push(u);
          const row = document.createElement("div"); row.className = "oz-rec-item";
          row.innerHTML = '<label><input type="checkbox" data-id="' + r.id + '"> <strong>' + esc(r.label) + '</strong></label> <span class="oz-stats">' + r.date + " · " + fmt(r.dur) + "</span>" +
            '<audio controls preload="metadata" src="' + u + '"></audio>' +
            '<div class="oz-row"><a class="oz-btn" download="' + esc(r.label.replace(/[^\w\- ]+/g, "_") || "ban-thu") + "." + (r.mime.indexOf("mp4") >= 0 ? "m4a" : "webm") + '" href="' + u + '">Tải về</a><button class="oz-btn" data-del="' + r.id + '">Xóa</button></div>';
          list.appendChild(row);
        });
        if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (e) { root.querySelector(".oz-rec-storage").textContent = "Bản thu được lưu trong trình duyệt trên máy này (" + (e.usage / 1048576).toFixed(1) + " MB đã dùng). Xóa dữ liệu trình duyệt sẽ mất bản thu; hãy tải về những bản muốn giữ."; });
      });
    }
    function stopRec() { if (mr && mr.state !== "inactive") mr.stop(); }
    btn.addEventListener("click", function () {
      if (mr && mr.state === "recording") { stopRec(); return; }
      navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (s) {
        stream = s; chunks = [];
        mr = new MediaRecorder(s);
        mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = function () {
          clearInterval(tick); timeEl.textContent = ""; btn.textContent = "● Thu";
          stream.getTracks().forEach(function (t) { t.stop(); });
          const blob = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
          const dur = (Date.now() - startAt) / 1000;
          const label = root.querySelector('[data-k="label"]').value.trim() || ("Bản thu " + new Date().toLocaleString("vi-VN"));
          put({ id: Date.now(), label: label.slice(0, 80), date: window.OZProgress ? OZProgress.today() : "", dur: dur, mime: blob.type, blob: blob }).then(function () {
            fb.textContent = "Đã lưu “" + label + "” (" + fmt(dur) + ")."; fb.className = "oz-feedback ok";
            if (window.OZProgress) OZProgress.record("minutes", Math.max(1, Math.round(dur / 60)));
            refresh();
          }).catch(function () { fb.textContent = "Không lưu được bản thu (bộ nhớ trình duyệt đầy?)."; fb.className = "oz-feedback bad"; });
        };
        mr.start(); startAt = Date.now(); btn.textContent = "■ Dừng";
        tick = setInterval(function () { timeEl.textContent = "Đang thu " + fmt((Date.now() - startAt) / 1000); }, 250);
        fb.textContent = ""; 
      }).catch(function () { fb.textContent = "Không mở được micro. Hãy cho phép trang dùng micro."; fb.className = "oz-feedback bad"; });
    });
    list.addEventListener("click", function (e) {
      const d = e.target.closest("[data-del]");
      if (d && confirm("Xóa bản thu này?")) del(Number(d.dataset.del)).then(refresh);
    });
    list.addEventListener("change", function (e) {
      if (!e.target.dataset.id) return;
      selected = Array.prototype.map.call(list.querySelectorAll("input[data-id]:checked"), function (x) { return x; });
      if (selected.length > 2) { e.target.checked = false; selected = selected.filter(function (x) { return x !== e.target; }); }
      ab.innerHTML = "";
      if (selected.length === 2) {
        selected.forEach(function (x) { const a = x.closest(".oz-rec-item").querySelector("audio").cloneNode(); a.controls = true; ab.appendChild(a); });
        const both = document.createElement("button"); both.className = "oz-btn"; both.textContent = "Phát lần lượt A rồi B";
        both.addEventListener("click", function () { const as = ab.querySelectorAll("audio"); as[0].currentTime = 0; as[0].play(); as[0].onended = function () { as[1].currentTime = 0; as[1].play(); }; });
        ab.appendChild(both);
      }
      cmp.hidden = selected.length !== 2;
    });
    if (window.location$) window.location$.subscribe(stopRec);
    refresh().catch(function () { fb.textContent = "Không mở được kho lưu trữ của trình duyệt (chế độ ẩn danh?)."; fb.className = "oz-feedback bad"; });
  }
  function init() { document.querySelectorAll(".oz-recorder").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
