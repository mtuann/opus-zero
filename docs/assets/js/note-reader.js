/* Công cụ luyện đọc nốt: hiện một nốt ngẫu nhiên trên khuông, bạn chọn tên nốt. */
(function () {
  "use strict";
  const SOLFEGE = ["Đô", "Rê", "Mi", "Fa", "Sol", "La", "Si"];
  const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
  const SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const CLEF_NAMES = { treble: "khóa Sol", bass: "khóa Fa", alto: "khóa Đô alto", tenor: "khóa Đô tenor" };
  /* Mỗi nốt được đánh số theo bậc: giá trị = quãng tám * 7 + vị trí chữ cái (C=0 … B=6). */
  const RANGES = {
    treble: { basic: [29, 39], ledger: [26, 42] }, /* D4–G5 | A3–C6 */
    bass:   { basic: [17, 27], ledger: [14, 30] }, /* F2–B3 | C2–E4 */
    alto:   { basic: [23, 33], ledger: [20, 36] }, /* E3–G4 | B2–D5 (dòng giữa = Đô giữa) */
    tenor:  { basic: [21, 31], ledger: [18, 34] }  /* C3–E4 | G2–B4 (dòng 4 = Đô giữa) */
  };

  function info(v) {
    const idx = ((v % 7) + 7) % 7;
    const oct = Math.floor(v / 7);
    return { idx: idx, oct: oct, midi: 12 * (oct + 1) + SEMIS[idx], sci: LETTERS[idx] + oct };
  }

  function abcPitch(v) {
    const i = info(v);
    let s = LETTERS[i.idx];
    if (i.oct >= 5) {
      s = s.toLowerCase() + "'".repeat(i.oct - 5);
    } else {
      s = s + ",".repeat(4 - i.oct);
    }
    return s;
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row">' +
      '<label>Khóa <select data-k="clef"><option value="treble">Khóa Sol</option><option value="bass">Khóa Fa</option><option value="both">Sol và Fa</option><option value="alto">Khóa Đô (alto)</option><option value="tenor">Khóa Đô (tenor)</option></select></label>' +
      '<label>Phạm vi <select data-k="range"><option value="basic">Trong khuông</option><option value="ledger">Thêm dòng kẻ phụ</option></select></label>' +
      '<label>Tên nốt <select data-k="names"><option value="sol">Đô Rê Mi</option><option value="let">C D E</option></select></label>' +
      '<label><input type="checkbox" data-k="sound" checked> Phát âm thanh</label>' +
      '<label><input type="checkbox" data-k="adaptive" checked> Ưu tiên nốt hay sai</label>' +
      "</div>" +
      '<div class="oz-staff" aria-live="polite"></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn tên nốt"></div>' +
      '<div class="oz-feedback" aria-live="polite"></div>' +
      '<div class="oz-row"><button class="oz-btn" data-act="skip">Bỏ qua</button><button class="oz-btn" data-act="hear">Nghe nốt này</button></div>' +
      '<div class="oz-stats"></div>';

    const staff = root.querySelector(".oz-staff");
    const answers = root.querySelector(".oz-answers");
    const feedback = root.querySelector(".oz-feedback");
    const stats = root.querySelector(".oz-stats");
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };

    let current = null;
    let currentClef = "treble";
    let firstTry = true;
    let locked = false;
    const session = { right: 0, total: 0 };

    function label(idx) {
      return ctl("names").value === "sol"
        ? SOLFEGE[idx] + "<small>" + LETTERS[idx] + "</small>"
        : LETTERS[idx] + "<small>" + SOLFEGE[idx] + "</small>";
    }

    function buildAnswers() {
      answers.innerHTML = "";
      for (let i = 0; i < 7; i++) {
        const b = document.createElement("button");
        b.className = "oz-btn oz-answer-btn";
        b.dataset.idx = String(i);
        b.innerHTML = label(i);
        b.title = "Phím tắt: " + LETTERS[i] + " hoặc " + (i + 1);
        answers.appendChild(b);
      }
    }

    function statKey(clef, v) { return clef + ":" + v; }
    function noteStats() { return window.OZProgress ? OZProgress.getStore("noteStats", {}) : {}; }
    function bump(wrong) {
      if (window.OZProgress && OZProgress.skill) OZProgress.skill("notes", !wrong);
      if (!window.OZProgress) return;
      const st = noteStats();
      const k = statKey(currentClef, current);
      const e = st[k] || [0, 0];
      e[0]++; if (wrong) e[1]++;
      st[k] = e;
      OZProgress.setStore("noteStats", st);
    }
    function weakest() {
      const st = noteStats();
      return Object.keys(st).filter(function (k) { return st[k][0] >= 3 && st[k][1] > 0; })
        .sort(function (a, b) { return st[b][1] / st[b][0] - st[a][1] / st[a][0]; })
        .slice(0, 3)
        .map(function (k) {
          const p = k.split(":"); const i = info(Number(p[1]));
          return SOLFEGE[i.idx] + " " + i.sci + " (" + CLEF_NAMES[p[0]] + ", sai " + Math.round(100 * st[k][1] / st[k][0]) + "%)";
        });
    }

    function updateStats() {
      const day = window.OZProgress ? OZProgress.getDay(OZProgress.load(), OZProgress.today()) : { notes: 0 };
      const pct = session.total ? Math.round((session.right / session.total) * 100) : 0;
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total +
        (session.total ? " (" + pct + "%)" : "") + ". Hôm nay đã đọc đúng " + (day.notes || 0) + " nốt.";
      const w = weakest();
      if (w.length) stats.textContent += " Hay sai nhất: " + w.join("; ") + ".";
    }

    function draw() {
      staff.innerHTML = "";
      if (!window.ABCJS) {
        staff.textContent = "Không tải được thư viện vẽ khuông nhạc. Kiểm tra kết nối mạng rồi tải lại trang.";
        return;
      }
      const fg = getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000";
      const src = "X:1\nM:none\nL:1/1\nK:C clef=" + currentClef + "\nx/4 " + abcPitch(current) + " x/4|]";
      ABCJS.renderAbc(staff, src, { staffwidth: 200, scale: 1.5, foregroundColor: fg, paddingleft: 0, paddingright: 0 });
      const svg = staff.querySelector("svg");
      if (svg) {
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "Một nốt nhạc trên khuông " + CLEF_NAMES[currentClef]);
        svg.style.maxWidth = "420px";
        svg.style.display = "block";
        svg.style.margin = "0 auto";
      }
    }

    function next() {
      const clefSel = ctl("clef").value;
      currentClef = clefSel === "both" ? (Math.random() < 0.5 ? "treble" : "bass") : clefSel;
      const r = RANGES[currentClef][ctl("range").value];
      const st = noteStats();
      const cands = [], weights = [];
      for (let x = r[0]; x <= r[1]; x++) {
        if (x === current && r[1] > r[0]) continue;
        const e = st[statKey(currentClef, x)];
        let w = 1;
        if (ctl("adaptive").checked) w = e ? 1 + 4 * (e[1] + 1) / (e[0] + 2) : 1.6; /* nốt chưa gặp hoặc hay sai xuất hiện nhiều hơn */
        cands.push(x); weights.push(w);
      }
      let pick = Math.random() * weights.reduce(function (a, b) { return a + b; }, 0);
      let v = cands[0];
      for (let j = 0; j < cands.length; j++) { pick -= weights[j]; if (pick <= 0) { v = cands[j]; break; } }
      current = v;
      firstTry = true;
      locked = false;
      feedback.textContent = "";
      feedback.className = "oz-feedback";
      answers.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-correct", "is-wrong"); b.disabled = false; });
      draw();
    }

    function hear() {
      if (window.OZAudio && current !== null) OZAudio.playNote(info(current).midi, undefined, 1.2);
    }

    function answer(idx) {
      if (locked || current === null) return;
      const i = info(current);
      const btn = answers.querySelector('[data-idx="' + idx + '"]');
      if (idx === i.idx) {
        locked = true;
        btn.classList.add("is-correct");
        if (firstTry) { session.total++; session.right++; bump(false); }
        if (window.OZProgress) OZProgress.record("notes", 1);
        feedback.textContent = "Đúng. Đây là " + SOLFEGE[i.idx] + " (" + i.sci + ").";
        feedback.className = "oz-feedback ok";
        if (ctl("sound").checked) hear();
        updateStats();
        setTimeout(next, 900);
      } else {
        if (firstTry) { session.total++; firstTry = false; bump(true); }
        btn.classList.add("is-wrong");
        btn.disabled = true;
        feedback.textContent = "Chưa đúng. Đếm dòng và khe từ dưới lên rồi thử lại.";
        feedback.className = "oz-feedback bad";
        updateStats();
      }
    }

    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-idx]");
      if (b) answer(Number(b.dataset.idx));
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      if (b.dataset.act === "skip") next();
      if (b.dataset.act === "hear") hear();
    });
    ["clef", "range"].forEach(function (k) { ctl(k).addEventListener("change", next); });
    ctl("names").addEventListener("change", buildAnswers);

    /* Trả lời bằng đàn MIDI: bấm đúng phím (cùng tên nốt) trên đàn thật */
    if (window.OZMidi) OZMidi.on(function (ev) {
      if (ev.type !== "on" || !root.isConnected || current === null) return;
      const pc = ((ev.midi % 12) + 12) % 12, idx = SEMIS.indexOf(pc);
      if (idx < 0) { feedback.textContent = "Phím đen: nốt trên khuông là một nốt tự nhiên (phím trắng)."; feedback.className = "oz-feedback bad"; return; }
      answer(idx);
    });

    root.tabIndex = 0;
    root.addEventListener("keydown", function (e) {
      if (e.target.matches("select, input, textarea")) return;
      const k = e.key.toUpperCase();
      let idx = LETTERS.indexOf(k);
      if (idx < 0 && /^[1-7]$/.test(e.key)) idx = Number(e.key) - 1;
      if (idx >= 0) { e.preventDefault(); answer(idx); }
    });

    buildAnswers();
    next();
    updateStats();
  }

  function init() { document.querySelectorAll(".oz-note-reader").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
