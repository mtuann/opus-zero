/* Luyện tai: nghe hai nốt và đoán quãng. */
(function () {
  "use strict";
  const NAMES = {
    1: "2 thứ", 2: "2 trưởng", 3: "3 thứ", 4: "3 trưởng", 5: "4 đúng", 6: "4 tăng / 5 giảm",
    7: "5 đúng", 8: "6 thứ", 9: "6 trưởng", 10: "7 thứ", 11: "7 trưởng", 12: "8 đúng"
  };
  const SETS = {
    start: [4, 7, 12],
    basic: [3, 4, 5, 7, 12],
    more: [2, 3, 4, 5, 7, 9, 12],
    all: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  };

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row">' +
      '<label>Bộ quãng <select data-k="set">' +
      '<option value="start">Khởi động: 3 trưởng, 5 đúng, 8 đúng</option>' +
      '<option value="basic">Cơ bản: thêm 3 thứ, 4 đúng</option>' +
      '<option value="more">Mở rộng: thêm 2 trưởng, 6 trưởng</option>' +
      '<option value="all">Tất cả 12 quãng</option></select></label>' +
      '<label>Cách phát <select data-k="mode"><option value="up">Lần lượt, đi lên</option><option value="down">Lần lượt, đi xuống</option><option value="harm">Cùng lúc</option></select></label>' +
      "</div>" +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="again">Nghe lại</button></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn quãng"></div>' +
      '<div class="oz-feedback" aria-live="polite">Bấm “Câu mới” để nghe hai nốt.</div>' +
      '<div class="oz-stats"></div>';

    const answers = root.querySelector(".oz-answers");
    const feedback = root.querySelector(".oz-feedback");
    const stats = root.querySelector(".oz-stats");
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    let q = null;
    let firstTry = true;
    const session = { right: 0, total: 0 };

    function build() {
      answers.innerHTML = "";
      SETS[ctl("set").value].forEach(function (n) {
        const b = document.createElement("button");
        b.className = "oz-btn";
        b.dataset.n = String(n);
        b.textContent = NAMES[n];
        answers.appendChild(b);
      });
    }

    function play() {
      if (!q || !window.OZAudio) return;
      const c = OZAudio.getCtx();
      if (!c) { feedback.textContent = "Trình duyệt này không hỗ trợ Web Audio."; return; }
      const t = c.currentTime;
      const mode = ctl("mode").value;
      const top = q.root + q.n;
      if (mode === "harm") {
        OZAudio.playNote(q.root, t, 1.6, 0.18);
        OZAudio.playNote(top, t, 1.6, 0.18);
      } else if (mode === "down") {
        OZAudio.playNote(top, t, 0.9);
        OZAudio.playNote(q.root, t + 0.8, 1.2);
      } else {
        OZAudio.playNote(q.root, t, 0.9);
        OZAudio.playNote(top, t + 0.8, 1.2);
      }
    }

    function updateStats() {
      const day = window.OZProgress ? OZProgress.getDay(OZProgress.load(), OZProgress.today()) : { intervals: 0 };
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total +
        ". Hôm nay đã nhận đúng " + (day.intervals || 0) + " quãng.";
    }

    function newQ() {
      const set = SETS[ctl("set").value];
      const n = set[Math.floor(Math.random() * set.length)];
      q = { n: n, root: 55 + Math.floor(Math.random() * 13), done: false }; /* gốc từ G3 đến G4 */
      firstTry = true;
      answers.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-correct", "is-wrong"); b.disabled = false; });
      feedback.textContent = "Quãng gì đây?";
      feedback.className = "oz-feedback";
      play();
    }

    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-n]");
      if (!b || !q || q.done) return;
      const n = Number(b.dataset.n);
      if (n === q.n) {
        q.done = true;
        if (firstTry) { session.total++; session.right++; if (window.OZProgress && OZProgress.skill) OZProgress.skill("intervals", true); }
        b.classList.add("is-correct");
        if (window.OZProgress) OZProgress.record("intervals", 1);
        feedback.textContent = "Đúng, quãng " + NAMES[q.n] + " (" + q.n + " nửa cung). Bấm “Câu mới” để tiếp tục.";
        feedback.className = "oz-feedback ok";
      } else {
        if (firstTry) { session.total++; firstTry = false; if (window.OZProgress && OZProgress.skill) OZProgress.skill("intervals", false); }
        b.classList.add("is-wrong");
        b.disabled = true;
        feedback.textContent = "Chưa đúng. Nghe lại và thử lựa chọn khác.";
        feedback.className = "oz-feedback bad";
        play();
      }
      updateStats();
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      if (b.dataset.act === "new") newQ();
      if (b.dataset.act === "again") play();
    });
    ctl("set").addEventListener("change", function () { build(); q = null; feedback.textContent = "Bấm “Câu mới” để nghe hai nốt."; feedback.className = "oz-feedback"; });

    build();
    updateStats();
  }

  function init() { document.querySelectorAll(".oz-interval-trainer").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
