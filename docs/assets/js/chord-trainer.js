/* Luyện tai hợp âm: nghe và đoán loại hợp âm. */
(function () {
  "use strict";
  const SETS = {
    two: ["maj", "min"],
    triads: ["maj", "min", "dim", "aug"],
    sevenths: ["maj7", "dom7", "min7", "hdim7", "dim7"]
  };
  const HINT = {
    maj: "sáng, vững", min: "tối, buồn", dim: "căng, bất ổn", aug: "lơ lửng, kỳ lạ",
    maj7: "mềm, mơ màng", dom7: "căng, muốn đi tiếp", min7: "êm, hơi buồn", hdim7: "u tối, lưng chừng", dim7: "rất căng, kịch tính"
  };

  function mount(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const C = OZTheory.CHORDS;
    root.innerHTML =
      '<div class="oz-row"><label>Bộ hợp âm <select data-k="set"><option value="two">Trưởng và thứ</option><option value="triads">4 loại hợp âm ba</option><option value="sevenths">5 loại hợp âm bảy</option></select></label>' +
      '<label>Cách phát <select data-k="mode"><option value="block">Cùng lúc</option><option value="arp">Rải từng nốt</option><option value="both">Rải rồi cùng lúc</option></select></label></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="again">Nghe lại</button></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn loại hợp âm"></div>' +
      '<div class="oz-feedback" aria-live="polite">Bấm “Câu mới” để nghe một hợp âm.</div><div class="oz-stats"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    const answers = root.querySelector(".oz-answers");
    const fb = root.querySelector(".oz-feedback");
    const stats = root.querySelector(".oz-stats");
    const session = { right: 0, total: 0 };
    let q = null, first = true;

    function build() {
      answers.innerHTML = "";
      SETS[ctl("set").value].forEach(function (t) {
        const b = document.createElement("button");
        b.className = "oz-btn"; b.dataset.t = t;
        b.innerHTML = C[t].name.replace("Hợp âm ", "") + "<small> " + HINT[t] + "</small>";
        answers.appendChild(b);
      });
    }
    function play() {
      if (!q || !window.OZAudio) return;
      const c = OZAudio.getCtx(); if (!c) return;
      const t0 = c.currentTime;
      const mids = C[q.t].tones.map(function (x) { return q.root + x[1]; });
      const mode = ctl("mode").value;
      let t = t0;
      if (mode !== "block") { mids.forEach(function (m, i) { OZAudio.playNote(m, t0 + i * 0.35, 0.7); }); t = t0 + mids.length * 0.35 + 0.15; }
      if (mode !== "arp") mids.forEach(function (m) { OZAudio.playNote(m, t, 1.8, 0.13); });
    }
    function newQ() {
      const set = SETS[ctl("set").value];
      q = { t: set[Math.floor(Math.random() * set.length)], root: 52 + Math.floor(Math.random() * 12), done: false };
      first = true;
      answers.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-correct", "is-wrong"); b.disabled = false; });
      fb.textContent = "Hợp âm gì đây?"; fb.className = "oz-feedback";
      play();
    }
    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-t]");
      if (!b || !q || q.done) return;
      if (b.dataset.t === q.t) {
        q.done = true;
        if (first) { session.total++; session.right++; if (window.OZProgress && OZProgress.skill) OZProgress.skill("chords", true); }
        b.classList.add("is-correct");
        if (window.OZProgress) OZProgress.record("chords", 1);
        const names = OZTheory.chord({ l: 0, a: 0, o: 4 }, q.t).length;
        fb.textContent = "Đúng: " + C[q.t].name.toLowerCase() + " (" + names + " nốt). Bấm “Câu mới” để tiếp tục.";
        fb.className = "oz-feedback ok";
      } else {
        if (first) { session.total++; first = false; if (window.OZProgress && OZProgress.skill) OZProgress.skill("chords", false); }
        b.classList.add("is-wrong"); b.disabled = true;
        fb.textContent = "Chưa đúng. Nghe lại và chú ý màu sắc của hợp âm."; fb.className = "oz-feedback bad";
        play();
      }
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      if (b.dataset.act === "new") newQ();
      if (b.dataset.act === "again") play();
    });
    ctl("set").addEventListener("change", function () { build(); q = null; fb.textContent = "Bấm “Câu mới” để nghe một hợp âm."; fb.className = "oz-feedback"; });
    build();
  }
  function init() { document.querySelectorAll(".oz-chord-trainer").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
