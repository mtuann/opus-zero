/* Bộ tải theo nhu cầu: mỗi trang chỉ tải những công cụ nó thực sự dùng.
   Các script được tải song song nhưng chạy đúng thứ tự phụ thuộc (async = false). */
(function () {
  "use strict";
  const VERSION = "12";
  const me = document.currentScript || document.querySelector('script[src*="assets/js/loader.js"]');
  const BASE = me ? me.src.replace(/loader\.js.*$/, "") : "assets/js/";
  /* abcjs đi kèm trong repo (docs/assets/js/vendor/) để dùng được khi mất mạng; mermaid vẫn tải từ CDN */
  const EXT = { abcjs: "vendor/abcjs-basic-min.js", mermaid: "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js" };
  /* [bộ chọn CSS, các script cần, theo thứ tự phụ thuộc] */
  const RULES = [
    [".abc-notation", ["abcjs", "abc"]],
    [".mermaid", ["mermaid"]],
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
  const requested = {};
  const readyFns = [];

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
      const ext = EXT[name];
      s.src = ext ? (ext.indexOf("http") === 0 ? ext : BASE + ext + "?v=" + VERSION) : (BASE + name + ".js?v=" + VERSION);
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
  function scan() {
    const list = needed();
    Promise.all(list.map(load)).then(function () {
      if (window.mermaid && document.querySelector('.mermaid:not([data-processed])')) {
        try { window.mermaid.initialize({ startOnLoad: false }); window.mermaid.run(); }
        catch (e) { console.error(e); }
      }
      readyFns.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    });
  }
  window.OZReady = OZReady;
  window.OZLoader = { needed: needed, RULES: RULES, load: load };
  if (window.document$) window.document$.subscribe(scan);
  else if (document.readyState !== "loading") scan();
  else document.addEventListener("DOMContentLoaded", scan);
})();
