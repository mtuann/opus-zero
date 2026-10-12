/* Luyện tai gam và điệu thức. */
(function () {
  "use strict";
  const SETS = {
    mm: { name: "Trưởng và thứ tự nhiên", items: ["major", "natural"] },
    minors: { name: "Ba dạng gam thứ", items: ["natural", "harmonic", "melodic"] },
    modes: { name: "Điệu thức thường gặp", items: ["major", "natural", "dorian", "mixolydian", "lydian", "phrygian"] },
    penta: { name: "Ngũ cung và gam 7 nốt", items: ["pentaMajor", "pentaMinor", "major", "natural"] }
  };
  const HINT = {
    major: "sáng", natural: "tối", harmonic: "bước nhảy lạ gần cuối", melodic: "lên như trưởng ở cuối",
    dorian: "thứ nhưng sáng ở bậc 6", mixolydian: "trưởng nhưng hạ bậc 7", lydian: "trưởng có bậc 4 nâng",
    phrygian: "thứ, bước đầu chỉ nửa cung", pentaMajor: "5 nốt, sáng", pentaMinor: "5 nốt, tối"
  };
  function mount(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const S = OZTheory.SCALES;
    root.innerHTML =
      '<div class="oz-row"><label>Bộ gam <select data-k="set">' + Object.keys(SETS).map(function (k) { return '<option value="' + k + '">' + SETS[k].name + "</option>"; }).join("") + '</select></label>' +
      '<label>Hướng <select data-k="dir"><option value="up">Đi lên</option><option value="updown">Lên rồi xuống</option></select></label></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="again">Nghe lại</button></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn gam"></div><div class="oz-feedback" aria-live="polite">Bấm “Câu mới” để nghe một gam.</div><div class="oz-stats"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const answers = root.querySelector(".oz-answers"), fb = root.querySelector(".oz-feedback"), stats = root.querySelector(".oz-stats");
    let q = null, first = true; const session = { right: 0, total: 0 };
    function build() {
      answers.innerHTML = "";
      SETS[ctl("set").value].items.forEach(function (t) {
        const b = document.createElement("button"); b.className = "oz-btn"; b.dataset.t = t;
        b.innerHTML = S[t].name + "<small> " + HINT[t] + "</small>"; answers.appendChild(b);
      });
    }
    function mids() {
      const base = q.root;
      const steps = S[q.t].steps.concat([12]);
      let list = steps.map(function (s) { return base + s; });
      if (ctl("dir").value === "updown") {
        const down = (q.t === "melodic" ? S.natural.steps : S[q.t].steps).slice().reverse().map(function (s) { return base + s; });
        list = list.concat(down);
      }
      return list;
    }
    function play() {
      if (!q || !window.OZAudio) return; const c = OZAudio.getCtx(); if (!c) return;
      mids().forEach(function (m, i) { OZAudio.playNote(m, c.currentTime + i * 0.3, 0.5); });
    }
    function newQ() {
      const items = SETS[ctl("set").value].items;
      q = { t: items[Math.floor(Math.random() * items.length)], root: 55 + Math.floor(Math.random() * 8), done: false };
      first = true; fb.textContent = "Gam gì đây?"; fb.className = "oz-feedback";
      answers.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-correct", "is-wrong"); b.disabled = false; });
      play();
    }
    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-t]"); if (!b || !q || q.done) return;
      if (b.dataset.t === q.t) {
        q.done = true; if (first) { session.total++; session.right++; }
        b.classList.add("is-correct"); fb.textContent = "Đúng: " + S[q.t].name.toLowerCase() + "."; fb.className = "oz-feedback ok";
        if (window.OZProgress) OZProgress.record("scales", 1);
      } else {
        if (first) { session.total++; first = false; }
        b.classList.add("is-wrong"); b.disabled = true; fb.textContent = "Chưa đúng. Nghe lại, chú ý bậc 3, 6 và 7."; fb.className = "oz-feedback bad"; play();
      }
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "new") newQ(); if (b.dataset.act === "again") play();
    });
    ctl("set").addEventListener("change", function () { build(); q = null; });
    build();
  }
  function init() { document.querySelectorAll(".oz-scale-trainer").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
