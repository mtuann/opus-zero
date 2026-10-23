/* Bộ tải theo nhu cầu: mỗi trang chỉ tải những công cụ nó thực sự dùng.
   Các script được tải song song nhưng chạy đúng thứ tự phụ thuộc (async = false).
   Khởi tạo khi gần màn hình: công cụ nằm xa màn hình đầu chỉ được tải khi người đọc cuộn tới cách nó khoảng 600px;
   khuông nhạc (abc.js) và ví dụ phong cách (recognition.js) cũng vẽ từng khối như vậy, qua OZLoader.whenNear.
   Những gì nằm phía trên chỗ đang đọc, kể cả phần trước đích của một link #mục, được khởi tạo ngay; trước khi in thì vẽ hết.
   Mọi thứ khởi tạo ngay từ đầu khi trình duyệt không có IntersectionObserver, hoặc khi window.OZ_EAGER = true (kiểm thử). */
(function () {
  "use strict";
  const VERSION = "19";
  const me = document.currentScript || document.querySelector('script[src*="assets/js/loader.js"]');
  const BASE = me ? me.src.replace(/loader\.js.*$/, "") : "assets/js/";
  /* abcjs đi kèm trong repo (docs/assets/js/vendor/) để dùng được khi mất mạng */
  const EXT = { abcjs: "vendor/abcjs-basic-min.js" };
  /* [bộ chọn CSS, các script cần, theo thứ tự phụ thuộc].
     Sơ đồ mermaid không đi qua bộ tải này: Material tự tải mermaid và vẽ mọi khối ```mermaid khi mở trang. */
  const RULES = [
    [".abc-notation", ["abcjs", "abc"]],
    [".oz-midi-status", ["midi"]],
    [".oz-note-reader", ["abcjs", "midi", "note-reader"]],
    [".oz-interval-trainer", ["viz", "interval-trainer"]],
    [".oz-chord-trainer", ["theory", "viz", "chord-trainer"]],
    [".oz-scale-trainer", ["theory", "viz", "scale-trainer"]],
    [".oz-metronome", ["metronome"]],
    [".oz-piano, .oz-piano-explorer", ["theory", "midi", "piano"]],
    [".oz-build", ["theory", "midi", "piano", "build"]],
    [".oz-circle, .oz-keysig-quiz", ["abcjs", "theory", "circle"]],
    [".oz-rhythm", ["abcjs", "viz", "rhythm"]],
    [".oz-sight", ["abcjs", "theory", "midi", "tuner", "mic", "assess", "viz", "sight-reading"]],
    [".oz-sight2", ["abcjs", "abc", "sight2"]],
    [".oz-tuner", ["tuner"]],
    [".oz-quiz, .oz-lesson-status", ["quiz"]],
    [".oz-placement", ["placement"]],
    [".oz-worksheet-gen", ["abcjs", "theory", "worksheet"]],
    [".oz-timeline", ["timeline"]],
    [".oz-listen", ["listen"]],
    [".oz-overtones, .oz-tuning", ["acoustics"]],
    [".oz-staffpaper", ["staffpaper"]],
    [".oz-style-example, .oz-style-trainer, .oz-cadence-trainer, .oz-texture-trainer, .oz-blind, .oz-blind-log", ["abcjs", "abc", "viz", "recognition"]],
    [".oz-playalong, .oz-singback", ["abcjs", "midi", "tuner", "mic", "assess", "viz", "playalong"]],
    [".oz-dictation", ["theory", "midi", "piano", "viz", "dictation"]],
    [".oz-recorder", ["recorder"]],
    [".oz-spectrum", ["tuner", "mic", "spectrum"]],
    [".oz-plan, .oz-skills", ["plan"]],
    [".oz-trends", ["plan", "viz"]],
    [".oz-flashcards", ["flashcards"]],
    [".oz-journal, .oz-summary", ["journal"]],
    [".oz-data", ["data"]],
    [".task-list-item, .oz-piece, .oz-repertoire, .oz-piano-level", ["practice"]]
  ];
  /* Luôn tải ngay, dù ở xa màn hình: công cụ giữ và hiện trạng thái của người học (quiz, danh sách việc, kế hoạch,
     nhật ký, dữ liệu, đàn MIDI). Gọi theo script cuối của quy tắc. */
  const NOW = /^(midi|quiz|plan|journal|data|practice)$/;
  const MARGIN = 600;
  const requested = {};
  const readyFns = [];
  const pending = new Map(); /* phần tử đang chờ tới gần màn hình → hàm khởi tạo */
  let io = null, printing = false;

  /* Mỗi công cụ đăng ký hàm khởi tạo ở đây; hàm được gọi ngay và sau mỗi lần chuyển trang */
  function OZReady(fn) {
    readyFns.push(fn);
    if (document.readyState !== "loading") { try { fn(); } catch (e) { console.error(e); } }
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function load(name) {
    if (requested[name]) return requested[name];
    requested[name] = new Promise(function (res) {
      const s = document.createElement("script");
      s.src = BASE + (EXT[name] || name + ".js") + "?v=" + VERSION;
      s.async = false;
      s.onload = function () { res(true); };
      s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
    return requested[name];
  }
  function needed() {
    const out = [];
    RULES.forEach(function (r) {
      if (document.querySelector(r[0])) r[1].forEach(function (d) { if (out.indexOf(d) < 0) out.push(d); });
    });
    return out;
  }
  function ready() {
    readyFns.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }
  function loadAll(names) {
    return Promise.all(names.map(load)).then(ready);
  }

  /* ---- Khởi tạo khi gần màn hình ---- */
  function eager() { return !!window.OZ_EAGER || !("IntersectionObserver" in window) || printing; }
  function target() {
    let id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* để nguyên */ }
    return id ? document.getElementById(id) : null;
  }
  /* Phần tử ở gần hoặc phía trên màn hình, hay nằm trước đích của link #mục: khởi tạo ngay */
  function ahead(el) {
    if (el.getBoundingClientRect().top < window.innerHeight + MARGIN) return true;
    const t = target();
    return !!t && t !== el && !!(el.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
  }
  /* Trình duyệt không tự giữ chỗ đang đọc khi phần phía trên đổi chiều cao (không có overflow-anchor, như Safari):
     phần tử ở phía trên màn hình lớn lên khi vẽ thì tự cuộn bù */
  const ANCHOR = !!(window.CSS && CSS.supports && CSS.supports("overflow-anchor", "auto"));
  function run(el) {
    const fn = pending.get(el);
    if (!fn) return;
    pending.delete(el);
    if (io) io.unobserve(el);
    const above = !ANCHOR && el.getBoundingClientRect().bottom <= 0;
    const h = above ? document.documentElement.scrollHeight : 0;
    try { fn(); } catch (e) { console.error(e); }
    if (above) window.scrollBy(0, document.documentElement.scrollHeight - h);
  }
  /* Gọi fn() khi el tới gần màn hình, hoặc gọi ngay nếu el đã ở phía trên chỗ đang đọc */
  function whenNear(el, fn) {
    if (pending.has(el)) { pending.set(el, fn); return; }
    if (eager() || ahead(el)) { try { fn(); } catch (e) { console.error(e); } return; }
    pending.set(el, fn);
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) run(e.target); });
    }, { rootMargin: MARGIN + "px 0px" });
    io.observe(el);
  }
  /* Khởi tạo các phần tử đang chờ: tất cả, hoặc chỉ những phần tử phía trên chỗ đang đọc */
  function flush(all) {
    Array.from(pending.keys()).forEach(function (el) { if (all || ahead(el)) run(el); });
  }
  /* Đích của link #mục bị đẩy xuống vì phần phía trên vừa được vẽ: cuộn lại cho đúng */
  function keep(t, top) {
    if (t && Math.abs(t.getBoundingClientRect().top - top) > 2) t.scrollIntoView();
  }

  function scan() {
    if (io) { io.disconnect(); io = null; }
    pending.clear();
    const now = [], later = [];
    RULES.forEach(function (r) {
      const els = Array.prototype.slice.call(document.querySelectorAll(r[0]));
      if (!els.length) return;
      if (eager() || NOW.test(r[1][r[1].length - 1]) || els.some(ahead)) r[1].forEach(function (d) { if (now.indexOf(d) < 0) now.push(d); });
      else later.push([r[1], els]);
    });
    const t = target(), top = t ? t.getBoundingClientRect().top : 0;
    /* done: xong khi mọi công cụ cần ngay đã khởi tạo (kiểm thử chờ mốc này thay vì chờ cố định) */
    window.OZLoader.done = loadAll(now).then(function () { keep(t, top); });
    later.forEach(function (x) {
      const go = function () { loadAll(x[0]); };
      x[1].forEach(function (el) { whenNear(el, go); });
    });
    /* Khuông nhạc ở xa: tải sẵn abcjs khi trình duyệt rảnh (chưa vẽ), để khi in vẽ kịp mọi khuông */
    if (later.some(function (x) { return x[0].indexOf("abc") >= 0; })) {
      const pre = function () { loadAll(["abcjs", "abc"]); };
      const idle = function () { if (window.requestIdleCallback) requestIdleCallback(pre, { timeout: 5000 }); else setTimeout(pre, 3000); };
      if (document.readyState === "complete") idle(); else window.addEventListener("load", idle, { once: true });
    }
  }
  window.addEventListener("beforeprint", function () { printing = true; flush(true); });
  window.addEventListener("afterprint", function () { printing = false; });
  window.addEventListener("hashchange", function () {
    const t = target();
    if (!t || !pending.size) return;
    const top = t.getBoundingClientRect().top;
    flush(false);
    keep(t, top);
  });

  window.OZReady = OZReady;
  window.OZLoader = {
    needed: needed, RULES: RULES, load: load, done: Promise.resolve(), whenNear: whenNear,
    /* Tải và khởi tạo mọi thứ còn chờ (nút "In bài này" gọi trước khi in) */
    all: function () {
      printing = true;
      return loadAll(needed()).then(function () { flush(true); printing = false; });
    }
  };
  if (window.document$) window.document$.subscribe(scan);
  else if (document.readyState !== "loading") scan();
  else document.addEventListener("DOMContentLoaded", scan);
})();
