/* Vòng quãng năm tương tác (.oz-circle) và quiz hóa biểu (.oz-keysig-quiz). */
(function () {
  "use strict";
  const T = function () { return window.OZTheory; };
  const SVGNS = "http://www.w3.org/2000/svg";
  /* Vị trí trên vòng theo chiều kim đồng hồ, bắt đầu từ Đô ở đỉnh */
  const RING = [
    ["C"], ["G"], ["D"], ["A"], ["E"], ["B", "Cb"], ["F#", "Gb"], ["Db", "C#"], ["Ab"], ["Eb"], ["Bb"], ["F"]
  ];
  const ROMAN_MAJOR = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  const TRIAD_MAJOR = ["maj", "min", "min", "maj", "maj", "min", "dim"];

  function fg() { return getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000"; }

  function drawSig(host, abcKey, clef) {
    host.innerHTML = "";
    if (!window.ABCJS) { host.textContent = "Không tải được thư viện vẽ khuông nhạc."; return; }
    ABCJS.renderAbc(host, "X:1\nM:none\nL:1/4\nK:" + abcKey + " clef=" + (clef || "treble") + "\nx2|]", {
      staffwidth: 170, scale: 1.3, foregroundColor: fg(), paddingleft: 0, paddingright: 0
    });
  }

  function mountCircle(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML = '<div class="oz-circle-grid"><div class="oz-circle-svg"></div><div class="oz-circle-info" aria-live="polite"></div></div>';
    const svgHost = root.querySelector(".oz-circle-svg");
    const infoEl = root.querySelector(".oz-circle-info");
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 320 320");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Vòng quãng năm");
    const cx = 160, cy = 160;
    const ring = function (r, cls) {
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", r); c.setAttribute("class", cls);
      svg.appendChild(c);
    };
    ring(150, "oz-ring-outer"); ring(100, "oz-ring-inner"); ring(56, "oz-ring-core");
    const buttons = [];
    RING.forEach(function (names, i) {
      const ang = (i * 30 - 90) * Math.PI / 180;
      const key = T().keyByTonic(names[0]);
      [[125, names[0], "major"], [78, key.minor, "minor"]].forEach(function (spec) {
        const g = document.createElementNS(SVGNS, "g");
        g.setAttribute("class", "oz-ck oz-ck-" + spec[2]);
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        const label = spec[2] === "major"
          ? names.map(function (n) { return T().prettyKey(n); }).join("/")
          : T().prettyKey(spec[1]).toLowerCase();
        g.setAttribute("aria-label", (spec[2] === "major" ? "Giọng " : "Giọng thứ ") + label);
        const c = document.createElementNS(SVGNS, "circle");
        c.setAttribute("cx", cx + spec[0] * Math.cos(ang)); c.setAttribute("cy", cy + spec[0] * Math.sin(ang));
        c.setAttribute("r", spec[2] === "major" ? 21 : 17);
        g.appendChild(c);
        const t = document.createElementNS(SVGNS, "text");
        t.setAttribute("x", cx + spec[0] * Math.cos(ang)); t.setAttribute("y", cy + spec[0] * Math.sin(ang) + 4);
        t.textContent = label;
        if (label.length > 3) t.setAttribute("font-size", "9");
        g.appendChild(t);
        g.dataset.major = names[0];
        g.dataset.mode = spec[2];
        svg.appendChild(g);
        buttons.push(g);
      });
    });
    const centre = document.createElementNS(SVGNS, "text");
    centre.setAttribute("x", cx); centre.setAttribute("y", cy + 4); centre.setAttribute("class", "oz-ring-label");
    centre.textContent = "Chọn một giọng";
    svg.appendChild(centre);
    svgHost.appendChild(svg);

    let current = null;
    function select(g) {
      buttons.forEach(function (b) { b.classList.toggle("sel", b === g); });
      const k = T().keyByTonic(g.dataset.major);
      const minorMode = g.dataset.mode === "minor";
      const tonic = minorMode ? k.minor : k.tonic;
      const scaleNotes = T().scale(tonic + "4", minorMode ? "natural" : "major");
      current = { k: k, minorMode: minorMode, notes: scaleNotes };
      const title = minorMode
        ? "Giọng " + T().prettyKeyVi(k.minor) + " thứ (" + T().prettyKey(k.minor) + " minor)"
        : "Giọng " + T().prettyKeyVi(k.tonic) + " trưởng (" + T().prettyKey(k.tonic) + " major)";
      const rel = minorMode
        ? "Giọng trưởng song song: " + T().prettyKeyVi(k.tonic) + " trưởng."
        : "Giọng thứ song song: " + T().prettyKeyVi(k.minor) + " thứ.";
      let chords = "";
      if (!minorMode) {
        chords = "<p><strong>Hợp âm các bậc:</strong> " + scaleNotes.slice(0, 7).map(function (n, i) {
          return ROMAN_MAJOR[i] + " = " + T().letterName(n) + T().CHORDS[TRIAD_MAJOR[i]].sym;
        }).join(", ") + "</p>";
      }
      let enh = "";
      const pos = RING.filter(function (r) { return r[0] === k.tonic; })[0];
      if (pos && pos.length > 1 && !minorMode) {
        const other = T().keyByTonic(pos[1]);
        enh = "<p>Cùng vị trí trên vòng: " + T().prettyKeyVi(other.tonic) + " trưởng (" + T().sigText(other.n) + "), đồng âm khác tên.</p>";
      }
      infoEl.innerHTML = "<h4>" + title + "</h4><div class='oz-sig'></div>" +
        "<p><strong>Hóa biểu:</strong> " + T().sigText(k.n) + ".</p>" +
        "<p><strong>Các nốt:</strong> " + scaleNotes.map(function (n) { return T().viName(n); }).join(" – ") + "</p>" +
        chords + "<p>" + rel + "</p>" + enh +
        '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="scale">Nghe gam</button>' +
        (minorMode ? "" : '<button class="oz-btn" data-act="prog">Nghe I – IV – V – I</button>') + "</div>";
      drawSig(infoEl.querySelector(".oz-sig"), (minorMode ? k.minor + "m" : k.tonic));
    }
    svg.addEventListener("click", function (e) { const g = e.target.closest(".oz-ck"); if (g) select(g); });
    svg.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.closest(".oz-ck")) { e.preventDefault(); select(e.target.closest(".oz-ck")); }
    });
    infoEl.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b || !current || !window.OZAudio) return;
      const c = OZAudio.getCtx(); if (!c) return;
      let t = c.currentTime;
      let mids = current.notes.map(T().midi);
      if (mids[0] > 66) mids = mids.map(function (m) { return m - 12; });
      if (b.dataset.act === "scale") {
        mids.forEach(function (m, i) { OZAudio.playNote(m, t + i * 0.32, 0.55); });
      } else {
        const r = mids[0];
        [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]].forEach(function (ch, i) {
          [r - 12 + ch[0]].concat(ch.map(function (x) { return r + x; })).forEach(function (m) { OZAudio.playNote(m, t + i * 0.9, 1.0, 0.11); });
        });
      }
    });
    select(buttons[0]);
  }

  function mountQuiz(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><label>Hỏi về <select data-k="mode"><option value="major">Giọng trưởng</option><option value="minor">Giọng thứ</option><option value="both">Cả hai</option></select></label>' +
      '<label>Phạm vi <select data-k="range"><option value="4">Đến 4 dấu hóa</option><option value="7" selected>Tất cả 15 giọng</option></select></label>' +
      '<label>Khóa <select data-k="clef"><option value="treble">Khóa Sol</option><option value="bass">Khóa Fa</option></select></label></div>' +
      '<div class="oz-sig-q"></div><p class="oz-q-text"></p>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn giọng"></div>' +
      '<div class="oz-feedback" aria-live="polite"></div>' +
      '<div class="oz-row"><button class="oz-btn" data-act="next">Câu khác</button></div><div class="oz-stats"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const answers = root.querySelector(".oz-answers");
    const fb = root.querySelector(".oz-feedback");
    const qText = root.querySelector(".oz-q-text");
    const stats = root.querySelector(".oz-stats");
    const session = { right: 0, total: 0 };
    let q = null, first = true, last = null;

    function next() {
      const max = Number(ctl("range").value);
      const pool = T().KEYS.filter(function (k) { return Math.abs(k.n) <= max; });
      let k;
      do { k = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && k === last);
      last = k;
      const modeSel = ctl("mode").value;
      const mode = modeSel === "both" ? (Math.random() < 0.5 ? "major" : "minor") : modeSel;
      q = { k: k, mode: mode, done: false };
      first = true;
      drawSig(root.querySelector(".oz-sig-q"), k.tonic, ctl("clef").value);
      qText.textContent = mode === "major" ? "Hóa biểu này là của giọng trưởng nào?" : "Hóa biểu này là của giọng thứ nào?";
      answers.innerHTML = "";
      pool.forEach(function (p) {
        const name = mode === "major" ? p.tonic : p.minor;
        const b = document.createElement("button");
        b.className = "oz-btn";
        b.dataset.k = p.tonic;
        b.innerHTML = T().prettyKeyVi(name) + (mode === "major" ? " trưởng" : " thứ") + "<small> " + T().prettyKey(name) + "</small>";
        answers.appendChild(b);
      });
      fb.textContent = ""; fb.className = "oz-feedback";
    }
    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-k]");
      if (!b || !q || q.done) return;
      if (b.dataset.k === q.k.tonic) {
        q.done = true;
        if (first) { session.total++; session.right++; if (window.OZProgress && OZProgress.skill) OZProgress.skill("keysig", true); }
        b.classList.add("is-correct");
        if (window.OZProgress) OZProgress.record("keysigs", 1);
        fb.textContent = "Đúng. " + T().sigText(q.k.n) + ". Giọng trưởng " + T().prettyKey(q.k.tonic) + ", giọng thứ song song " + T().prettyKey(q.k.minor) + ".";
        fb.className = "oz-feedback ok";
        setTimeout(next, 1400);
      } else {
        if (first) { session.total++; first = false; if (window.OZProgress && OZProgress.skill) OZProgress.skill("keysig", false); }
        b.classList.add("is-wrong"); b.disabled = true;
        fb.textContent = q.k.n > 0 ? "Chưa đúng. Mẹo: dấu thăng cuối cùng nằm ngay dưới chủ âm nửa cung." : (q.k.n < 0 ? "Chưa đúng. Mẹo: dấu giáng áp chót chính là tên giọng (trừ Fa trưởng có 1 dấu giáng)." : "Chưa đúng. Không có dấu hóa nào.");
        fb.className = "oz-feedback bad";
      }
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    });
    root.querySelector('[data-act="next"]').addEventListener("click", next);
    ["mode", "range", "clef"].forEach(function (k) { ctl(k).addEventListener("change", next); });
    next();
  }

  function init() {
    document.querySelectorAll(".oz-circle").forEach(mountCircle);
    document.querySelectorAll(".oz-keysig-quiz").forEach(mountQuiz);
  }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
