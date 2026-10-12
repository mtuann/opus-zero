/* Dữ liệu của tôi (.oz-data): xem, sao lưu, khôi phục (gộp, không ghi đè) và xóa dữ liệu học.
   Hàm gộp là hàm thuần và "bất biến": gộp cùng một bản sao lưu nhiều lần cho kết quả như gộp một lần. */
(function (root) {
  "use strict";
  const PKEY = "opus-zero:v1", SOUND = "opus-zero:sound", MIDI = "opus-zero:midi-auto";
  const FORMAT = "opus-zero-backup";
  const NUM_FIELDS = ["notes", "intervals", "chords", "keysigs", "rhythms", "melodies", "cards", "quizzes", "minutes", "builds", "scales", "styles"];

  function isObj(x) { return x && typeof x === "object" && !Array.isArray(x); }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  /* Chấp nhận cả bản sao lưu cũ (chỉ có {days, store}) lẫn bản mới ({format, progress, …}) */
  function normalize(obj) {
    if (!isObj(obj)) throw new Error("Không phải file sao lưu hợp lệ.");
    if (obj.format === FORMAT) {
      if (!isObj(obj.progress) || !isObj(obj.progress.days)) throw new Error("File sao lưu bị thiếu dữ liệu tiến độ.");
      return { progress: obj.progress, settings: isObj(obj.settings) ? obj.settings : {}, recordings: Array.isArray(obj.recordings) ? obj.recordings : [], exported: obj.exported || "" };
    }
    if (isObj(obj.days)) return { progress: obj, settings: {}, recordings: [], exported: "" };
    throw new Error("Không nhận ra định dạng file. Hãy chọn file .json được tải từ Opus Zero.");
  }

  function mergeDay(a, b) {
    const out = clone(a || {});
    b = b || {};
    NUM_FIELDS.forEach(function (f) { const v = Math.max(Number(out[f]) || 0, Number(b[f]) || 0); if (v || f in out || f in b) out[f] = v; });
    out.tasks = Object.assign({}, out.tasks || {});
    Object.keys(b.tasks || {}).forEach(function (k) { out.tasks[k] = !!(out.tasks[k] || b.tasks[k]); });
    const na = (out.note || "").trim(), nb = (b.note || "").trim();
    if (!na) out.note = nb; else if (nb && na !== nb && na.indexOf(nb) < 0) out.note = nb.indexOf(na) >= 0 ? nb : na + "\n---\n" + nb;
    return out;
  }
  function laterIso(a, b) { return (a || "") >= (b || "") ? a : b; }

  /* Gộp tiến độ: trả về {merged, report} */
  function merge(local, incoming) {
    local = isObj(local) && isObj(local.days) ? local : { days: {} };
    const L = clone(local), I = clone(incoming);
    const rep = { daysAdded: 0, daysUpdated: 0, lessonsAdded: 0, skillsUpdated: 0, cardsUpdated: 0, blindLogAdded: 0, listenAdded: 0 };
    L.store = L.store || {};
    const S = L.store, IS = I.store || {};
    Object.keys(I.days || {}).forEach(function (d) {
      if (!L.days[d]) { L.days[d] = mergeDay({}, I.days[d]); rep.daysAdded++; return; }
      const m = mergeDay(L.days[d], I.days[d]);
      if (JSON.stringify(m) !== JSON.stringify(L.days[d])) { L.days[d] = m; rep.daysUpdated++; }
    });
    /* Bài đã học: hợp lại, giữ ngày sớm nhất */
    if (IS.lessons) { S.lessons = S.lessons || {}; Object.keys(IS.lessons).forEach(function (k) {
      if (!S.lessons[k]) { S.lessons[k] = IS.lessons[k]; rep.lessonsAdded++; } else if (IS.lessons[k] < S.lessons[k]) S.lessons[k] = IS.lessons[k]; }); }
    /* Năng lực: lấy bản luyện gần đây hơn; cùng ngày thì bản có nhiều lượt hơn */
    if (IS.skills) { S.skills = S.skills || {}; Object.keys(IS.skills).forEach(function (k) {
      const a = S.skills[k], b = IS.skills[k];
      if (!a || (b.last || "") > (a.last || "") || ((b.last || "") === (a.last || "") && (b.n || 0) > (a.n || 0))) { if (JSON.stringify(a) !== JSON.stringify(b)) { S.skills[k] = b; rep.skillsUpdated++; } } }); }
    /* Thẻ ghi nhớ: giữ tiến độ tốt hơn (hộp cao hơn; cùng hộp thì hạn ôn muộn hơn) */
    if (IS.cards) { S.cards = S.cards || {}; Object.keys(IS.cards).forEach(function (k) {
      const a = S.cards[k], b = IS.cards[k];
      if (!a || (b.box || 0) > (a.box || 0) || ((b.box || 0) === (a.box || 0) && (b.due || "") > (a.due || ""))) {
        if (JSON.stringify(a) !== JSON.stringify(b)) { S.cards[k] = Object.assign({}, b, { added: a && a.added && a.added < (b.added || "9") ? a.added : b.added }); rep.cardsUpdated++; } } }); }
    /* Thống kê từng nốt: lấy số lớn hơn (không cộng, để gộp lại nhiều lần vẫn đúng) */
    if (IS.noteStats) { S.noteStats = S.noteStats || {}; Object.keys(IS.noteStats).forEach(function (k) {
      const a = S.noteStats[k] || [0, 0], b = IS.noteStats[k] || [0, 0];
      S.noteStats[k] = (b[0] || 0) > (a[0] || 0) ? b.slice() : a.slice(); }); }
    /* Lịch sử năng lực theo ngày: mỗi (kỹ năng, ngày) lấy bản có nhiều lượt hơn */
    if (IS.skillHist) { S.skillHist = S.skillHist || {}; Object.keys(IS.skillHist).forEach(function (k) {
      const a = S.skillHist[k] = S.skillHist[k] || {}, b = IS.skillHist[k] || {};
      Object.keys(b).forEach(function (d) { if (!a[d] || (b[d][0] || 0) > (a[d][0] || 0)) a[d] = b[d].slice(); }); }); }
    if (IS.blind) { const a = S.blind || { right: 0, total: 0 }; S.blind = (IS.blind.total || 0) > (a.total || 0) ? IS.blind : a; }
    /* Phiếu nghe mù: nối lại, bỏ bản trùng */
    if (Array.isArray(IS.blindLog)) { S.blindLog = S.blindLog || [];
      const key = function (r) { return [r.d, r.t, r.gp, r.ge, r.gc, r.ap].join("|"); };
      const seen = {}; S.blindLog.forEach(function (r) { seen[key(r)] = 1; });
      IS.blindLog.forEach(function (r) { if (!seen[key(r)]) { S.blindLog.push(r); seen[key(r)] = 1; rep.blindLogAdded++; } });
      S.blindLog.sort(function (x, y) { return (x.d || "") < (y.d || "") ? -1 : (x.d || "") > (y.d || "") ? 1 : 0; }); }
    /* Mốc nghe: giữ link và mốc của máy này, thêm mốc còn thiếu */
    if (IS.listen) { S.listen = S.listen || {}; Object.keys(IS.listen).forEach(function (p) {
      const a = S.listen[p], b = IS.listen[p];
      if (!a) { S.listen[p] = b; rep.listenAdded++; return; }
      if (!a.url && b.url) a.url = b.url;
      a.marks = a.marks || {}; Object.keys(b.marks || {}).forEach(function (i) { if (a.marks[i] === undefined) a.marks[i] = b.marks[i]; }); }); }
    /* Các khóa khác (ví dụ kết quả kiểm tra đầu vào): giữ của máy này, thêm nếu chưa có */
    Object.keys(IS).forEach(function (k) {
      if (["lessons", "skills", "skillHist", "cards", "noteStats", "blind", "blindLog", "listen"].indexOf(k) >= 0) return;
      if (S[k] === undefined) S[k] = IS[k];
    });
    return { merged: L, report: rep };
  }

  function describe(p) {
    p = isObj(p) && isObj(p.days) ? p : { days: {} };
    const s = p.store || {}, days = Object.keys(p.days);
    const active = days.filter(function (d) { const x = p.days[d]; return NUM_FIELDS.some(function (f) { return x[f]; }) || Object.values(x.tasks || {}).some(Boolean) || (x.note || "").trim(); });
    return {
      days: active.length, first: active.sort()[0] || "", last: active.sort().slice(-1)[0] || "",
      lessons: Object.keys(s.lessons || {}).length, skills: Object.keys(s.skills || {}).length,
      cards: Object.keys(s.cards || {}).length, blindLog: (s.blindLog || []).length, listen: Object.keys(s.listen || {}).length,
      notes: active.filter(function (d) { return (p.days[d].note || "").trim(); }).length
    };
  }

  root.OZData = { merge: merge, normalize: normalize, describe: describe, FORMAT: FORMAT };

  /* ------------------------- Giao diện (chỉ chạy trong trình duyệt) ------------------------- */
  if (typeof document === "undefined" || !document.createElement) return;
  const DB = "opus-zero-recordings", STORE = "rec";
  function idb(mode, fn) {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return res(null);
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE, { keyPath: "id" }); };
      r.onerror = function () { rej(r.error); };
      r.onsuccess = function () { const t = r.result.transaction(STORE, mode); const q = fn(t.objectStore(STORE)); t.oncomplete = function () { res(q && q.result); }; t.onerror = function () { rej(t.error); }; };
    });
  }
  const allRecs = function () { return idb("readonly", function (s) { return s.getAll(); }).then(function (x) { return x || []; }).catch(function () { return []; }); };
  function blobToB64(blob) { return new Promise(function (res) { const fr = new FileReader(); fr.onload = function () { res(String(fr.result).split(",")[1] || ""); }; fr.readAsDataURL(blob); }); }
  function b64ToBlob(b64, type) { const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: type || "audio/webm" }); }
  function readLocal() { try { const r = localStorage.getItem(PKEY); const d = r ? JSON.parse(r) : null; return isObj(d) && isObj(d.days) ? d : { days: {} }; } catch (e) { return { days: {} }; } }
  function writeLocal(d) { localStorage.setItem(PKEY, JSON.stringify(d)); document.dispatchEvent(new CustomEvent("oz:progress")); }
  function today() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function mb(n) { return (n / 1048576).toFixed(1) + " MB"; }
  function summaryHtml(s, recs) {
    return "<ul>" +
      "<li>" + s.days + " ngày có luyện tập" + (s.first ? " (từ " + s.first + " đến " + s.last + ")" : "") + ", " + s.notes + " ngày có ghi chú</li>" +
      "<li>" + s.lessons + " bài đã hoàn thành quiz; năng lực của " + s.skills + " kỹ năng</li>" +
      "<li>" + s.cards + " thẻ thuật ngữ đang ôn; " + s.blindLog + " lần nghe mù; mốc nghe ở " + s.listen + " trang</li>" +
      (recs ? "<li>" + recs.n + " bản thu âm (" + mb(recs.bytes) + ")</li>" : "") + "</ul>";
  }

  function mount(rootEl) {
    if (rootEl.dataset.ready) return;
    rootEl.dataset.ready = "1";
    rootEl.classList.add("oz-tool");
    rootEl.innerHTML =
      "<h2>Đang lưu trên máy này</h2><div class=\"oz-data-summary\">Đang đọc…</div>" +
      "<h2>Tải bản sao lưu</h2>" +
      '<div class="oz-row"><label><input type="checkbox" data-k="rec"> Kèm bản thu âm (file sẽ lớn hơn nhiều)</label></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="export">Tải file sao lưu (.json)</button></div>' +
      "<h2>Khôi phục từ bản sao lưu</h2>" +
      '<p class="oz-stats">Dữ liệu trong file được <strong>gộp</strong> với dữ liệu trên máy này, không ghi đè. Bạn sẽ xem trước những gì thay đổi rồi mới xác nhận.</p>' +
      '<div class="oz-row"><label class="oz-btn">Chọn file sao lưu<input type="file" accept="application/json,.json" hidden data-k="file"></label></div>' +
      '<div class="oz-data-preview" hidden></div>' +
      '<div class="oz-feedback" aria-live="polite"></div>' +
      "<h2>Xóa dữ liệu</h2>" +
      '<div class="oz-row"><button class="oz-btn" data-act="wipe-progress">Xóa tiến độ học</button><button class="oz-btn" data-act="wipe-rec">Xóa mọi bản thu âm</button></div>';
    const fb = rootEl.querySelector(".oz-feedback"), sum = rootEl.querySelector(".oz-data-summary"), prev = rootEl.querySelector(".oz-data-preview");
    const say = function (t, ok) { fb.textContent = t; fb.className = "oz-feedback " + (ok === undefined ? "" : ok ? "ok" : "bad"); };
    function refresh() {
      return allRecs().then(function (recs) {
        sum.innerHTML = summaryHtml(describe(readLocal()), { n: recs.length, bytes: recs.reduce(function (s, r) { return s + (r.blob ? r.blob.size : 0); }, 0) });
      });
    }
    function download(name, text) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    }
    rootEl.querySelector('[data-act="export"]').addEventListener("click", function () {
      const withRec = rootEl.querySelector('[data-k="rec"]').checked;
      say("Đang chuẩn bị…");
      (withRec ? allRecs().then(function (recs) {
        return Promise.all(recs.map(function (r) { return blobToB64(r.blob).then(function (b) { return { id: r.id, label: r.label, date: r.date, dur: r.dur, mime: r.mime, data: b }; }); }));
      }) : Promise.resolve([])).then(function (recs) {
        const out = { format: FORMAT, version: 2, exported: new Date().toISOString(), progress: readLocal(),
          settings: { sound: localStorage.getItem(SOUND), midiAuto: localStorage.getItem(MIDI) }, recordings: recs };
        download("opus-zero-" + today() + (withRec ? "-kem-ban-thu" : "") + ".json", JSON.stringify(out));
        say("Đã tải file sao lưu" + (recs.length ? " (kèm " + recs.length + " bản thu)" : "") + ". Hãy giữ file ở nơi an toàn (Google Drive, email cho chính mình…).", true);
      });
    });
    rootEl.querySelector('[data-k="file"]').addEventListener("change", function (e) {
      const f = e.target.files && e.target.files[0]; e.target.value = "";
      if (!f) return;
      f.text().then(function (txt) {
        let inc;
        try { inc = normalize(JSON.parse(txt)); } catch (err) { prev.hidden = true; say(err.message || "File không đọc được.", false); return; }
        const res = merge(readLocal(), inc.progress), r = res.report;
        return allRecs().then(function (recs) {
          const have = {}; recs.forEach(function (x) { have[x.id] = 1; });
          const newRecs = inc.recordings.filter(function (x) { return x && x.id && !have[x.id] && x.data; });
          const changes = r.daysAdded + r.daysUpdated + r.lessonsAdded + r.skillsUpdated + r.cardsUpdated + r.blindLogAdded + r.listenAdded + newRecs.length;
          prev.hidden = false;
          prev.innerHTML = "<p><strong>File: " + f.name + "</strong>" + (inc.exported ? " (tạo lúc " + inc.exported.slice(0, 16).replace("T", " ") + ")" : "") + "</p>" +
            (changes ? "<p>Sau khi gộp sẽ:</p><ul>" +
              (r.daysAdded ? "<li>thêm " + r.daysAdded + " ngày luyện tập</li>" : "") + (r.daysUpdated ? "<li>bổ sung số liệu cho " + r.daysUpdated + " ngày đã có</li>" : "") +
              (r.lessonsAdded ? "<li>thêm " + r.lessonsAdded + " bài đã học</li>" : "") + (r.skillsUpdated ? "<li>cập nhật năng lực " + r.skillsUpdated + " kỹ năng (lấy bản mới hơn)</li>" : "") +
              (r.cardsUpdated ? "<li>cập nhật " + r.cardsUpdated + " thẻ thuật ngữ</li>" : "") + (r.blindLogAdded ? "<li>thêm " + r.blindLogAdded + " lần nghe mù</li>" : "") +
              (r.listenAdded ? "<li>thêm mốc nghe ở " + r.listenAdded + " trang</li>" : "") + (newRecs.length ? "<li>thêm " + newRecs.length + " bản thu âm</li>" : "") +
              '</ul><div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="apply">Gộp vào máy này</button><button class="oz-btn" data-act="cancel">Hủy</button></div>'
              : "<p>File này không có gì mới so với dữ liệu trên máy: không cần gộp.</p>");
          say("");
          const apply = prev.querySelector('[data-act="apply"]');
          if (apply) apply.addEventListener("click", function () {
            try { writeLocal(res.merged); } catch (err) { say("Không ghi được dữ liệu (bộ nhớ trình duyệt đầy?).", false); return; }
            if (inc.settings.sound && !localStorage.getItem(SOUND)) localStorage.setItem(SOUND, inc.settings.sound);
            Promise.all(newRecs.map(function (x) { return idb("readwrite", function (s) { return s.put({ id: x.id, label: x.label, date: x.date, dur: x.dur, mime: x.mime, blob: b64ToBlob(x.data, x.mime) }); }); }))
              .then(function () { prev.hidden = true; say("Đã gộp xong.", true); refresh(); })
              .catch(function () { prev.hidden = true; say("Đã gộp tiến độ, nhưng không lưu được bản thu âm.", false); refresh(); });
          });
          const cancel = prev.querySelector('[data-act="cancel"]');
          if (cancel) cancel.addEventListener("click", function () { prev.hidden = true; say("Đã hủy, không có gì thay đổi."); });
        });
      });
    });
    rootEl.querySelector('[data-act="wipe-progress"]').addEventListener("click", function () {
      if (!confirm("Xóa toàn bộ tiến độ học trên máy này? Nên tải file sao lưu trước. Không thể hoàn tác.")) return;
      localStorage.removeItem(PKEY); document.dispatchEvent(new CustomEvent("oz:progress")); say("Đã xóa tiến độ học.", true); refresh();
    });
    rootEl.querySelector('[data-act="wipe-rec"]').addEventListener("click", function () {
      if (!confirm("Xóa mọi bản thu âm trên máy này? Không thể hoàn tác.")) return;
      idb("readwrite", function (s) { return s.clear(); }).then(function () { say("Đã xóa mọi bản thu âm.", true); refresh(); });
    });
    refresh();
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(function () { document.querySelectorAll(".oz-data").forEach(mount); });
})(typeof window !== "undefined" ? window : this);
