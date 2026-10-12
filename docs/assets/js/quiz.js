/* Quiz cuối bài (khối ```quiz) và trạng thái bài đã học (.oz-lesson-status). */
(function () {
  "use strict";
  function lessonKey(path) {
    let p = path.replace(/index\.html$/, "");
    if (!p.endsWith("/")) p += "/";
    return p;
  }
  function getLessons() { return window.OZProgress ? OZProgress.getStore("lessons", {}) : {}; }

  function parse(src) {
    const qs = [];
    let q = null;
    src.split(/\r?\n/).forEach(function (raw) {
      const line = raw.trim();
      if (!line) return;
      const tag = line[0], text = line.slice(1).trim();
      if (tag === "?") { q = { q: text, opts: [], why: "" }; qs.push(q); }
      else if (q && (tag === "+" || tag === "-")) q.opts.push({ t: text, ok: tag === "+" });
      else if (q && tag === ">") q.why += (q.why ? " " : "") + text;
    });
    return qs.filter(function (x) { return x.opts.some(function (o) { return o.ok; }); });
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const qs = parse(root.dataset.src || root.textContent);
    root.dataset.src = root.textContent;
    root.textContent = "";
    root.classList.add("oz-tool");
    const key = lessonKey(location.pathname);
    const head = document.createElement("div");
    head.className = "oz-quiz-head";
    root.appendChild(head);
    let solved = 0, firstRight = 0;

    function updateHead() {
      const done = getLessons()[key];
      head.innerHTML = "<strong>Kiểm tra nhanh</strong> <span class='oz-stats'>" + qs.length + " câu" +
        (done ? ", đã hoàn thành ngày " + done : "") + "</span>";
    }
    qs.forEach(function (item, qi) {
      const box = document.createElement("div");
      box.className = "oz-quiz-q";
      box.innerHTML = "<p><strong>" + (qi + 1) + ".</strong> " + esc(item.q) + "</p>";
      const row = document.createElement("div");
      row.className = "oz-row";
      const fb = document.createElement("div");
      fb.className = "oz-feedback";
      let first = true, done = false;
      shuffle(item.opts.slice()).forEach(function (o) {
        const b = document.createElement("button");
        b.className = "oz-btn";
        b.textContent = o.t;
        b.addEventListener("click", function () {
          if (done) return;
          if (o.ok) {
            done = true; solved++;
            if (first) firstRight++;
            b.classList.add("is-correct");
            fb.textContent = "Đúng. " + item.why; fb.className = "oz-feedback ok";
            row.querySelectorAll("button").forEach(function (x) { x.disabled = x !== b; });
            if (solved === qs.length) finish();
          } else {
            first = false;
            b.classList.add("is-wrong"); b.disabled = true;
            fb.textContent = "Chưa đúng, thử lại."; fb.className = "oz-feedback bad";
          }
        });
        row.appendChild(b);
      });
      box.appendChild(row); box.appendChild(fb);
      root.appendChild(box);
    });
    const result = document.createElement("div");
    result.className = "oz-quiz-result";
    result.setAttribute("aria-live", "polite");
    root.appendChild(result);

    function finish() {
      result.textContent = "Hoàn thành! Đúng ngay lần đầu " + firstRight + "/" + qs.length + " câu." +
        (firstRight === qs.length ? " Bạn đã sẵn sàng cho bài tiếp theo." : " Nên đọc lại các phần còn sai trước khi sang bài mới.");
      if (window.OZProgress) {
        const l = getLessons();
        if (!l[key]) { l[key] = OZProgress.today(); OZProgress.setStore("lessons", l); }
        OZProgress.record("quizzes", 1);
      }
      updateHead();
    }
    updateHead();
  }

  function mountStatus(root) {
    const lessons = getLessons();
    let total = 0, done = 0;
    root.querySelectorAll("a[href]").forEach(function (a) {
      const k = lessonKey(new URL(a.href, location.href).pathname);
      if (k.indexOf("/nhac-ly/") < 0 || /\/nhac-ly\/$/.test(k)) return;
      total++;
      const old = a.parentNode.querySelector(".oz-done");
      if (old) old.remove();
      if (lessons[k]) {
        done++;
        const s = document.createElement("span");
        s.className = "oz-done"; s.textContent = "đã học";
        s.title = "Hoàn thành quiz ngày " + lessons[k];
        a.after(s);
      }
    });
    let bar = root.querySelector(".oz-lesson-bar");
    if (!bar) { bar = document.createElement("p"); bar.className = "oz-lesson-bar oz-stats"; root.prepend(bar); }
    bar.innerHTML = "Đã hoàn thành <strong>" + done + "/" + total + "</strong> bài. Một bài được tính là xong khi bạn làm hết quiz cuối bài." +
      '<span class="oz-progress"><span style="width:' + (total ? Math.round(100 * done / total) : 0) + '%"></span></span>';
  }

  window.OZQuiz = { parse: parse, lessonKey: lessonKey };
  function init() {
    document.querySelectorAll(".oz-quiz").forEach(mount);
    document.querySelectorAll(".oz-lesson-status").forEach(mountStatus);
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
