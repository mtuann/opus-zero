/* Nhận diện bằng tai: đoán phong cách (.oz-style-trainer), ví dụ phong cách (.oz-style-example),
   nhận biết kết (.oz-cadence-trainer), nhận biết kết cấu (.oz-texture-trainer),
   nghe mù với bản thu thật (.oz-blind) và phiếu nghe mù (.oz-blind-log). */
(function () {
  "use strict";
  const PERIODS = { baroque: "Baroque", classical: "Cổ điển", romantic: "Lãng mạn", impressionist: "Ấn tượng", modern: "Thế kỷ 20" };
  const ENSEMBLES = { solo: "Một nhạc cụ (có thể có đệm)", chamber: "Nhóm thính phòng (mỗi bè một người)", orchestra: "Dàn nhạc", concerto: "Dàn nhạc và nghệ sĩ độc tấu" };

  /* ---------- 10 đoạn nhạc tổng hợp, viết theo đặc trưng từng thời kỳ ---------- */
  const H = function (prog) { return "%%score {1 2}\nV:1 clef=treble\n%%MIDI program " + prog + "\nV:2 clef=bass\n%%MIDI program " + prog + "\n"; };
  const EX = {
    "baroque-1": { period: "baroque", prog: 6, abc: "X:1\nL:1/16\nM:4/4\nQ:1/4=80\n" + H(6) + "K:G\n[V:1] G2B2 d2g2 f2a2 d2f2 | e2g2 c2e2 d2f2 B2d2 | c2e2 A2c2 B2d2 G2B2 | A4 !trill!A3G G8 |]\n[V:2] G,4 B,4 D,4 D4 | C,4 C4 B,,4 B,4 | A,,4 A,4 G,,4 G,4 | D,4 D4 G,,8 |]",
      clues: ["Harpsichord", "Chuyển động móc kép liên tục, đều như máy", "Chuỗi đi xuống: cùng một hình nốt lặp lại thấp dần (xem bài 29)", "Bè trầm nhảy quãng 8, đi đều từng phách", "Láy rền (trill) ở kết"] },
    "baroque-2": { period: "baroque", prog: 6, abc: "X:1\nL:1/8\nM:4/4\nQ:1/4=88\n" + H(6) + "K:Dm\n[V:1] D2 A2 F E D ^C | D E F G A4 | F2 E2 D G F E | F G A _B c4 | d2 ^c2 d4 |]\n[V:2] z8 | z8 | D,2 A,2 F, E, D, ^C, | D, E, F, G, A,4 | B,2 A,2 D,4 |]",
      clues: ["Harpsichord", "Mở đầu bằng một giai điệu đơn độc, rồi bè thứ hai vào bằng chính giai điệu đó: phức điệu mô phỏng, kiểu fugue", "Giọng thứ với cảm âm Đô♯", "Hai bè độc lập, quan trọng ngang nhau"] },
    "classical-1": { period: "classical", prog: 0, abc: "X:1\nL:1/8\nM:4/4\nQ:1/4=112\n" + H(0) + "K:C\n[V:1] E2 G2 c3 B | A2 c2 G4 | F2 A2 E2 G2 | D6 z2 | E2 G2 c3 B | A2 c2 G4 | F2 D2 G2 B,2 | C6 z2 |]\n[V:2] C,G,E,G, C,G,E,G, | F,A,CA, E,G,CG, | F,A,CA, C,G,E,G, | B,,G,D,G, B,,G,D,G, | C,G,E,G, C,G,E,G, | F,A,CA, E,G,CG, | D,F,A,F, G,,D,B,,D, | C,G,E,G, C,4 |]",
      clues: ["Piano", "Tay trái đệm kiểu Alberti (thấp – cao – giữa – cao)", "Câu nhạc 4 + 4 ô nhịp: câu hỏi dừng ở kết nửa, câu trả lời kết trọn", "Chủ điệu rõ ràng, giai điệu đơn giản, hòa âm I – IV – V"] },
    "classical-2": { period: "classical", prog: 0, abc: "X:1\nL:1/4\nM:3/4\nQ:1/4=126\n" + H(0) + "K:G\n[V:1] d B G | c A F | G B d | A3 | d B G | c A F | G A F | G3 |]\n[V:2] G, [B,D] [B,D] | D, [A,C] [A,C] | G, [B,D] [B,D] | D, [F,A,] [F,A,] | G, [B,D] [B,D] | D, [A,C] [A,C] | E, C, D, | G,3 |]",
      clues: ["Nhịp 3/4 kiểu minuet, đệm \"bùm – chát – chát\"", "Hai câu 4 ô nhịp cân đối, kết nửa rồi kết trọn", "Hòa âm đơn giản, trong sáng, gần như chỉ có I và V"] },
    "romantic-1": { period: "romantic", prog: 0, abc: "X:1\nL:1/8\nM:3/4\nQ:1/4=60\n" + H(0) + "K:C\n[V:1] e4 c' b | _b4 a g | f4 e d | ^g4 b d' | c'4 a f | c'4 _a f | \"^rit.\"b4 ^g e | a6 |]\n[V:2] A,,E,CEC E, | ^C,G,_B,E_B, G, | D,A,FAF A, | E,,B,,^G,D^G, B,, | F,,C,A,FA, C, | F,,C,_A,F_A, C, | E,,B,,^G,D^G, B,, | A,,E,C A,3 |]",
      clues: ["Tay trái rải hợp âm trải rộng hơn một quãng 8", "Hợp âm bảy giảm ở ô nhịp 2 (nửa cung, căng thẳng)", "Hợp âm mượn Fa thứ sau Fa trưởng ở ô nhịp 6 (xem bài 23)", "Giai điệu có bước nhảy rộng, giàu cảm xúc; chậm dần (rit.) trước kết"] },
    "romantic-2": { period: "romantic", prog: 48, abc: "X:1\nL:1/4\nM:4/4\nQ:1/4=60\n" + H(48) + "K:C\n[V:1] !p![EGc]4 | !crescendo(![_E_Ac]4 | !crescendo)![E^GB]4 | !f![EGc]4 |]\n[V:2] C,4 | _A,,4 | E,4 | C,4 |]",
      clues: ["Dàn dây, âm thanh dày và ấm", "Các hợp âm trưởng cách nhau quãng 3 (Đô – La♭ – Mi – Đô): liên hệ quãng 3 nửa cung, rất được Schubert, Liszt, Wagner yêu thích", "Mỗi bè chỉ dịch nửa cung, nhưng màu sắc đổi hẳn", "To dần rồi bùng lên"] },
    "impressionist-1": { period: "impressionist", prog: 0, abc: "X:1\nL:1/4\nM:4/4\nQ:1/4=60\n" + H(0) + "K:C\n[V:1] !pp![DFAc]2 [EGBd]2 | [FAce]2 [EGBd]2 | [DFAc]2 [CEGB]2 | [DFAc]4 |]\n[V:2] C,,4- | C,,4- | C,,4- | C,,4 |]",
      clues: ["Rất nhỏ (pp)", "Các hợp âm bảy trượt song song cùng một hình dạng (planing), không theo quy tắc dẫn bè", "Một nốt trầm giữ suốt (âm nền)", "Không có kết, không có cảm giác \"về nhà\""] },
    "impressionist-2": { period: "impressionist", prog: 0, abc: "X:1\nL:1/4\nM:4/4\nQ:1/4=66\n" + H(0) + "K:C\n[V:1] !pp!c2 _B2 | _A2 ^F2 | E2 D2 | C4 |]\n[V:2] [C,E,^G,]4- | [C,E,^G,]4- | [C,E,^G,]4- | [C,E,^G,]4 |]",
      clues: ["Giai điệu đi xuống theo gam toàn cung (xem bài 32)", "Hợp âm tăng ngân suốt bên dưới", "Mơ hồ, không có chủ âm rõ ràng"] },
    "modern-1": { period: "modern", prog: 12, abc: "X:1\nL:1/8\nM:4/4\nQ:1/4=132\n" + H(12) + "K:C\n[V:1] e b d' b e b d' b | e b d' b e b d' b | e b d' e' e b d' e' | e b d' e' e b d' e' | e b d' e' ^f' e' d' b | e b d' e' ^f' e' d' b |]\n[V:2] [E,B,]8 | [E,B,]8 | [E,B,]8 | [E,B,]8 | [E,B,]8 | [E,B,]8 |]",
      clues: ["Marimba", "Một mẫu ngắn lặp đi lặp lại (ostinato)", "Mẫu thay đổi rất chậm, từng nốt một (quá trình cộng dồn)", "Hòa âm gần như đứng yên: chủ nghĩa tối giản"] },
    "modern-2": { period: "modern", prog: 48, abc: "X:1\nL:1/8\nM:2/4\nQ:1/4=104\n" + H(48) + "K:C\n[V:1] [_EG_B_d]2 [_EG_B_d] [_EG_B_d] | !>![_EG_B_d] [_EG_B_d] [_EG_B_d] !>![_EG_B_d] | [_EG_B_d] !>![_EG_B_d] [_EG_B_d]2 | [_EG_B_d] [_EG_B_d] !>![_EG_B_d] [_EG_B_d] |]\n[V:2] [_F,,_A,,_C,]2 [_F,,_A,,_C,] [_F,,_A,,_C,] | !>![_F,,_A,,_C,] [_F,,_A,,_C,] [_F,,_A,,_C,] !>![_F,,_A,,_C,] | [_F,,_A,,_C,] !>![_F,,_A,,_C,] [_F,,_A,,_C,]2 | [_F,,_A,,_C,] [_F,,_A,,_C,] !>![_F,,_A,,_C,] [_F,,_A,,_C,] |]",
      clues: ["Dàn dây dậm một hợp âm nghịch tai lặp đi lặp lại", "Hai hợp âm khác giọng chồng lên nhau (đa điệu tính, kiểu Stravinsky)", "Trọng âm rơi vào những chỗ không đoán trước, không theo phách mạnh"] }
  };

  function fg() { return getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000"; }

  /* Vẽ một ví dụ (có thể ẩn) và gắn trình phát abcjs */
  function renderExample(host, ex, audioHost) {
    host.innerHTML = "";
    if (!window.ABCJS) { host.textContent = "Không tải được thư viện khuông nhạc."; return null; }
    const visual = ABCJS.renderAbc(host, ex.abc, { responsive: "resize", foregroundColor: fg(), paddingleft: 0, paddingright: 0 })[0];
    audioHost.innerHTML = "";
    if (ABCJS.synth && ABCJS.synth.supportsAudio()) {
      const ctrl = new ABCJS.synth.SynthController();
      ctrl.load(audioHost, window.OZAbc ? OZAbc.cursor() : null, { displayPlay: true, displayRestart: true, displayProgress: true });
      ctrl.setTune(visual, false).catch(function () { audioHost.textContent = "Không tải được âm thanh."; });
      return ctrl;
    }
    return null;
  }

  function mountExample(root) {
    if (root.dataset.ready) return;
    const ex = EX[root.dataset.id];
    if (!ex) return;
    root.dataset.ready = "1";
    root.innerHTML = '<div class="oz-ex-staff"></div><div class="abc-audio"></div><p class="oz-stats"></p>';
    renderExample(root.querySelector(".oz-ex-staff"), ex, root.querySelector(".abc-audio"));
    root.querySelector(".oz-stats").textContent = "Dấu hiệu: " + ex.clues.join("; ") + ".";
  }

  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function mountStyle(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<p class="oz-stats">Nghe một đoạn ngắn (bấm nút phát), rồi đoán thời kỳ. Khuông nhạc và các dấu hiệu chỉ hiện sau khi bạn trả lời.</p>' +
      '<div class="abc-audio"></div><div class="oz-ex-staff oz-hidden-staff" aria-hidden="true"></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn thời kỳ"></div>' +
      '<div class="oz-feedback" aria-live="polite"></div><ul class="oz-clues" hidden></ul>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="next">Đoạn khác</button></div><div class="oz-stats oz-score"></div>';
    const answers = root.querySelector(".oz-answers"), fb = root.querySelector(".oz-feedback"), clues = root.querySelector(".oz-clues");
    const staff = root.querySelector(".oz-ex-staff"), audio = root.querySelector(".abc-audio"), score = root.querySelector(".oz-score");
    Object.keys(PERIODS).forEach(function (k) {
      const b = document.createElement("button"); b.className = "oz-btn"; b.dataset.p = k; b.textContent = PERIODS[k]; answers.appendChild(b);
    });
    let order = shuffle(Object.keys(EX)), idx = -1, cur = null, first = true, done = false, ctrl = null;
    const session = { right: 0, total: 0 };
    function next() {
      if (ctrl && ctrl.pause) try { ctrl.pause(); } catch (e) { /* bỏ qua */ }
      idx = (idx + 1) % order.length;
      if (idx === 0 && cur) order = shuffle(order);
      cur = EX[order[idx]]; first = true; done = false;
      staff.classList.add("oz-hidden-staff"); clues.hidden = true; clues.innerHTML = "";
      answers.querySelectorAll("button").forEach(function (b) { b.disabled = false; b.classList.remove("is-correct", "is-wrong"); });
      fb.textContent = "Bấm nút phát ở trên để nghe."; fb.className = "oz-feedback";
      ctrl = renderExample(staff, cur, audio);
    }
    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-p]"); if (!b || done) return;
      if (b.dataset.p === cur.period) {
        done = true; if (first) { session.total++; session.right++; if (window.OZProgress && OZProgress.skill) OZProgress.skill("style", true); }
        b.classList.add("is-correct");
        fb.textContent = "Đúng: " + PERIODS[cur.period] + ". Các dấu hiệu:"; fb.className = "oz-feedback ok";
        if (window.OZProgress) OZProgress.record("styles", 1);
      } else {
        if (first) { session.total++; first = false; if (window.OZProgress && OZProgress.skill) OZProgress.skill("style", false); }
        b.classList.add("is-wrong"); b.disabled = true;
        fb.textContent = "Chưa đúng. Nghe lại: để ý nhạc cụ, kết cấu và hòa âm."; fb.className = "oz-feedback bad";
        return;
      }
      staff.classList.remove("oz-hidden-staff");
      clues.innerHTML = cur.clues.map(function (c) { return "<li>" + c + "</li>"; }).join(""); clues.hidden = false;
      score.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    });
    root.querySelector('[data-act="next"]').addEventListener("click", next);
    next();
  }

  /* ---------- Nhận biết kết (âm thanh tổng hợp) ---------- */
  const CAD = {
    pac: { name: "Kết trọn (V – I)", seq: ["I", "IV", "V", "I"] },
    hc: { name: "Kết nửa (… – V)", seq: ["I", "vi", "IV", "V"] },
    plagal: { name: "Kết plagal (IV – I)", seq: ["I", "V", "IV", "I"] },
    deceptive: { name: "Kết lừa (V – vi)", seq: ["I", "IV", "V", "vi"] }
  };
  const VOICING = { I: [48, 64, 67, 72], IV: [41, 65, 69, 72], V: [43, 62, 67, 71], vi: [45, 64, 69, 72] };
  function mountCadence(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="again">Nghe lại</button></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn loại kết"></div>' +
      '<div class="oz-feedback" aria-live="polite">Nghe 4 hợp âm và đoán loại kết ở hai hợp âm cuối.</div><div class="oz-stats"></div>';
    const answers = root.querySelector(".oz-answers"), fb = root.querySelector(".oz-feedback"), stats = root.querySelector(".oz-stats");
    Object.keys(CAD).forEach(function (k) { const b = document.createElement("button"); b.className = "oz-btn"; b.dataset.c = k; b.textContent = CAD[k].name; answers.appendChild(b); });
    let q = null, first = true; const session = { right: 0, total: 0 };
    function play() {
      if (!q || !window.OZAudio) return; const c = OZAudio.getCtx(); if (!c) return;
      const t0 = c.currentTime + 0.05;
      CAD[q.type].seq.forEach(function (deg, i) {
        VOICING[deg].forEach(function (m) { OZAudio.playNote(m + q.shift, t0 + i * 1.0, i === 3 ? 1.8 : 1.0, 0.12); });
      });
    }
    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-c]"); if (!b || !q || q.done) return;
      if (b.dataset.c === q.type) {
        q.done = true; if (first) { session.total++; session.right++; if (window.OZProgress && OZProgress.skill) OZProgress.skill("cadence", true); }
        b.classList.add("is-correct"); fb.textContent = "Đúng: " + CAD[q.type].seq.join(" → ") + ". Bấm “Câu mới” để tiếp tục."; fb.className = "oz-feedback ok";
        if (window.OZViz) { const last = CAD[q.type].seq.slice(-2); OZViz.show(fb, "<p class=\"oz-stats\">Hai hợp âm cuối: " + last.join(" → ") + " (xanh: hợp âm áp chót, vàng: hợp âm cuối)</p>" + OZViz.miniKeys(VOICING[last[0]].concat(VOICING[last[1]]).map(function (m) { return m + q.shift; }), { colors: VOICING[last[0]].map(function () { return "#a9c7e8"; }).concat(VOICING[last[1]].map(function () { return "#f1d9a0"; })), label: "Hai hợp âm cuối của kết trên phím đàn" })); }
        if (window.OZProgress) OZProgress.record("chords", 1);
      } else {
        if (first) { session.total++; first = false; if (window.OZProgress && OZProgress.skill) OZProgress.skill("cadence", false); }
        b.classList.add("is-wrong"); b.disabled = true; fb.textContent = "Chưa đúng. Chú ý hợp âm cuối: nghe như dừng hẳn, lơ lửng, hay rẽ hướng?"; fb.className = "oz-feedback bad"; play();
      }
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "new") {
        const types = Object.keys(CAD);
        q = { type: types[Math.floor(Math.random() * types.length)], shift: Math.floor(Math.random() * 12) - 5, done: false };
        first = true; answers.querySelectorAll("button").forEach(function (x) { x.disabled = false; x.classList.remove("is-correct", "is-wrong"); });
        fb.textContent = "Kết gì đây?"; fb.className = "oz-feedback"; if (window.OZViz) OZViz.clear(fb); play();
      }
      if (b.dataset.act === "again") play();
    });
  }

  /* ---------- Nhận biết kết cấu: cùng giai điệu Frère Jacques ---------- */
  const FJ = [[60,1],[62,1],[64,1],[60,1],[60,1],[62,1],[64,1],[60,1],[64,1],[65,1],[67,2],[64,1],[65,1],[67,2],
              [67,.5],[69,.5],[67,.5],[65,.5],[64,1],[60,1],[67,.5],[69,.5],[67,.5],[65,.5],[64,1],[60,1],[60,1],[55,1],[60,2],[60,1],[55,1],[60,2]];
  const TEX = { mono: "Đơn âm", homo: "Chủ điệu", poly: "Phức điệu", hetero: "Dị âm" };
  function mountTexture(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="new">Câu mới</button><button class="oz-btn" data-act="again">Nghe lại</button></div>' +
      '<div class="oz-row oz-answers" role="group" aria-label="Chọn kết cấu"></div>' +
      '<div class="oz-feedback" aria-live="polite">Cùng một giai điệu được phát theo một trong bốn kết cấu. Hãy đoán kết cấu (xem bài 28).</div><div class="oz-stats"></div>';
    const answers = root.querySelector(".oz-answers"), fb = root.querySelector(".oz-feedback"), stats = root.querySelector(".oz-stats");
    Object.keys(TEX).forEach(function (k) { const b = document.createElement("button"); b.className = "oz-btn"; b.dataset.t = k; b.textContent = TEX[k]; answers.appendChild(b); });
    let q = null, first = true; const session = { right: 0, total: 0 };
    function line(notes, t0, beat, shift, gain, upto) {
      let t = t0, n = 0;
      notes.forEach(function (x) { if (upto && n >= upto) return; OZAudio.playNote(x[0] + shift, t, x[1] * beat * 0.95, gain); t += x[1] * beat; n += x[1]; });
    }
    function play() {
      if (!q || !window.OZAudio) return; const c = OZAudio.getCtx(); if (!c) return;
      const beat = q.beat, t0 = c.currentTime + 0.05, s = q.shift;
      if (q.type === "mono") line(FJ, t0, beat, s, 0.22, 16);
      if (q.type === "homo") {
        line(FJ, t0, beat, s, 0.22, 16);
        const chords = [[48,52,55],[48,52,55],[48,52,55],[48,52,55],[48,52,55],[43,47,50],[48,52,55],[43,47,50]];
        chords.forEach(function (ch, i) { ch.forEach(function (m) { OZAudio.playNote(m + s, t0 + i * 2 * beat, 2 * beat * 0.95, 0.09); }); });
      }
      if (q.type === "poly") { line(FJ, t0, beat, s, 0.2, 24); line(FJ, t0 + 8 * beat, beat, s - 12, 0.2, 16); }
      if (q.type === "hetero") {
        line(FJ, t0, beat, s, 0.2, 16);
        let t = t0, n = 0;
        FJ.forEach(function (x) {
          if (n >= 16) return;
          const m = x[0] + s + 12, d = x[1] * beat;
          if (x[1] >= 1) { OZAudio.playNote(m, t, d * 0.45, 0.12); OZAudio.playNote(m + 2, t + d * 0.5, d * 0.22, 0.12); OZAudio.playNote(m, t + d * 0.75, d * 0.22, 0.12); }
          else OZAudio.playNote(m, t, d * 0.9, 0.12);
          t += d; n += x[1];
        });
      }
    }
    answers.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-t]"); if (!b || !q || q.done) return;
      if (b.dataset.t === q.type) {
        q.done = true; if (first) { session.total++; session.right++; if (window.OZProgress && OZProgress.skill) OZProgress.skill("texture", true); }
        b.classList.add("is-correct"); fb.textContent = "Đúng: " + TEX[q.type] + ". Bấm “Câu mới” để tiếp tục."; fb.className = "oz-feedback ok";
        if (window.OZProgress) OZProgress.record("styles", 1);
      } else {
        if (first) { session.total++; first = false; if (window.OZProgress && OZProgress.skill) OZProgress.skill("texture", false); }
        b.classList.add("is-wrong"); b.disabled = true; fb.textContent = "Chưa đúng. Đếm xem có mấy đường nét độc lập."; fb.className = "oz-feedback bad";
      }
      stats.textContent = "Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + ".";
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "new") {
        const types = Object.keys(TEX);
        q = { type: types[Math.floor(Math.random() * types.length)], shift: Math.floor(Math.random() * 7) - 3, beat: 0.38 + Math.random() * 0.12, done: false };
        first = true; answers.querySelectorAll("button").forEach(function (x) { x.disabled = false; x.classList.remove("is-correct", "is-wrong"); });
        fb.textContent = "Kết cấu gì đây?"; fb.className = "oz-feedback"; play();
      }
      if (b.dataset.act === "again") play();
    });
  }

  /* ---------- Nghe mù với bản thu thật (Wikimedia Commons, giấy phép mở) ---------- */
  const TRACKS = [
 {
  "id": "t1",
  "file": "Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/37/Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg/Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "baroque",
  "ok": [
   "baroque"
  ],
  "ensemble": "chamber",
  "title": "J. S. Bach, Brandenburg Concerto số 6, BWV 1051, chương 2 (Adagio ma non tanto)",
  "performer": "Advent Chamber Orchestra",
  "clue": "Hai viola song tấu, cello và harpsichord đệm: kết cấu phức điệu, bè trầm đi đều không ngừng, tiếng harpsichord lách tách phía sau. Chương chậm này chỉ dùng nhóm nhỏ, dù cả tác phẩm là concerto."
 },
 {
  "id": "t2",
  "file": "Brandenburg_Concerto_No._4_in_G,_Movement_I_(Allegro),_BWV_1049_(ISRC_USUAN1100303).oga",
  "page": "https://commons.wikimedia.org/wiki/File:Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3b/Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga/Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga",
    "type": "audio/ogg"
   }
  ],
  "period": "baroque",
  "ok": [
   "baroque"
  ],
  "ensemble": "concerto",
  "title": "J. S. Bach, Brandenburg Concerto số 4, BWV 1049, chương 1 (Allegro)",
  "performer": "Kevin MacLeod (incompetech.com)",
  "clue": "Một nhóm độc tấu (violin và hai sáo dọc) đối đáp với dàn dây: concerto grosso. Nhịp đều như máy, nhiều chuỗi, các đoạn tutti quay lại như ritornello."
 },
 {
  "id": "t3",
  "file": "Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga",
  "page": "https://commons.wikimedia.org/wiki/File:Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/ff/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga",
    "type": "audio/ogg"
   }
  ],
  "period": "baroque",
  "ok": [
   "baroque"
  ],
  "ensemble": "concerto",
  "title": "Vivaldi, Concerto \"Mùa xuân\" cung Mi trưởng, Op. 8 số 1, RV 269, chương 1 (Allegro)",
  "performer": "John Harrison (violin), Robert Turizziani chỉ huy, Wichita State University Chamber Players",
  "clue": "Dàn dây mở đầu đồng loạt bằng chủ đề tươi sáng, rồi violin độc tấu đối đáp xen kẽ các đoạn tutti quay lại (ritornello); chuyển động liên tục, nhiều chuỗi: concerto Baroque."
 },
 {
  "id": "t4",
  "file": "Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/4/44/Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg/Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "baroque",
  "ok": [
   "baroque"
  ],
  "ensemble": "concerto",
  "title": "J. S. Bach, Concerto violin cung Mi trưởng, BWV 1042, chương 2 (Adagio)",
  "performer": "Advent Chamber Orchestra, Jacques Israelievitch (violin)",
  "clue": "Violin độc tấu hát trên một bè trầm lặp lại trang nghiêm của dàn dây: dấu hiệu Baroque của bè trầm liên tục và bè trầm lặp."
 },
 {
  "id": "t5",
  "file": "Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/2/24/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "classical",
  "ok": [
   "classical"
  ],
  "ensemble": "orchestra",
  "title": "Mozart, Eine kleine Nachtmusik, K. 525, chương 1",
  "performer": "Advent Chamber Orchestra",
  "clue": "Mở đầu bằng hợp âm rải đi lên đồng loạt; câu nhạc ngắn, cân đối, hỏi – đáp; chủ điệu rõ ràng; tương phản to – nhỏ; hình thức sonata."
 },
 {
  "id": "t6",
  "file": "Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/16/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "classical",
  "ok": [
   "classical"
  ],
  "ensemble": "orchestra",
  "title": "Mozart, Giao hưởng số 40, K. 550, chương 4",
  "performer": "xem trang tệp",
  "clue": "Chủ đề hợp âm rải vọt lên (\"tên lửa\") rồi trả lời nhẹ nhàng: câu hỏi – câu trả lời kiểu Cổ điển; dàn nhạc Cổ điển cỡ nhỏ; tương phản mạnh nhẹ đột ngột; Sol thứ đầy kịch tính."
 },
 {
  "id": "t7",
  "file": "Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/68/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "classical",
  "ok": [
   "classical"
  ],
  "ensemble": "chamber",
  "title": "Mozart, Ngũ tấu đàn dây cung Sol thứ, K. 516, chương 4",
  "performer": "xem trang tệp",
  "clue": "Năm nhạc cụ dây, mỗi bè một người: nhạc thính phòng. Mở đầu Adagio u buồn ở Sol thứ, rồi chuyển sang Allegro Sol trưởng tươi sáng với giai điệu có đệm rõ ràng."
 },
 {
  "id": "t8",
  "file": "FurElise.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:FurElise.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7b/FurElise.ogg/FurElise.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/FurElise.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "classical",
  "ok": [
   "classical"
  ],
  "ensemble": "solo",
  "title": "Beethoven, Bagatelle \"Für Elise\" cung La thứ, WoO 59",
  "performer": "V. Gao (piano)",
  "clue": "Piano độc tấu; mở đầu bằng hình nốt láy móc đơn day dứt ở La thứ, xen kẽ các đoạn tươi sáng; cấu trúc rondo nhỏ, câu nhạc cân đối: Cổ điển."
 },
 {
  "id": "t9",
  "file": "Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fd/Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg/Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "romantic",
  "ok": [
   "romantic"
  ],
  "ensemble": "solo",
  "title": "Chopin, Nocturne cung Si trưởng, Op. 9 số 3",
  "performer": "Patrizia Prati (piano)",
  "clue": "Piano độc tấu; giai điệu dài như hát trên hợp âm rải rộng ở tay trái; rubato rõ; hòa âm nhiều nửa cung: Lãng mạn."
 },
 {
  "id": "t10",
  "file": "Claude_Debussy_-_Deuxième_Arabesque_-_Patrizia_Prati.ogg",
  "page": "https://commons.wikimedia.org/wiki/File:Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg",
  "sources": [
   {
    "src": "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg/Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg.mp3",
    "type": "audio/mpeg"
   },
   {
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg",
    "type": "audio/ogg"
   }
  ],
  "period": "impressionist",
  "ok": [
   "impressionist",
   "romantic"
  ],
  "ensemble": "solo",
  "title": "Debussy, Arabesque số 2 (khoảng 1890)",
  "performer": "Patrizia Prati (piano)",
  "clue": "Piano độc tấu, hình nốt lấp lánh, nhẹ như nước, hòa âm mềm và màu sắc. Đây là tác phẩm thời trẻ của Debussy, nằm giữa Lãng mạn muộn và Ấn tượng, nên cả hai câu trả lời đều được tính đúng."
 }
];
  function mountBlind(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const opt = function (obj) { return Object.keys(obj).map(function (k) { return '<option value="' + k + '">' + obj[k] + "</option>"; }).join(""); };
    root.innerHTML =
      '<p class="oz-stats oz-blind-count"></p>' +
      '<audio controls preload="none" class="oz-audio"></audio>' +
      '<div class="oz-row"><label>Thời kỳ <select data-k="period"><option value="">– chọn –</option>' + opt(PERIODS) + "</select></label>" +
      '<label>Biên chế <select data-k="ens"><option value="">– chọn –</option>' + opt(ENSEMBLES) + "</select></label></div>" +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="check">Xem đáp án</button><button class="oz-btn" data-act="next">Bản khác</button></div>' +
      '<div class="oz-feedback" aria-live="polite"></div><div class="oz-blind-reveal" hidden></div><div class="oz-stats oz-score"></div>';
    const audio = root.querySelector("audio"), fb = root.querySelector(".oz-feedback"), reveal = root.querySelector(".oz-blind-reveal"), score = root.querySelector(".oz-score");
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    let order = shuffle(TRACKS.slice()), idx = -1, cur = null, checked = false;
    const stats = function () { return window.OZProgress ? OZProgress.getStore("blind", { right: 0, total: 0 }) : { right: 0, total: 0 }; };
    function next() {
      idx = (idx + 1) % order.length; cur = order[idx]; checked = false;
      audio.pause(); audio.innerHTML = cur.sources.map(function (s) { return '<source src="' + s.src + '" type="' + s.type + '">'; }).join(""); audio.load();
      ctl("period").value = ""; ctl("ens").value = ""; reveal.hidden = true; reveal.innerHTML = "";
      fb.textContent = "Nghe ít nhất 30–60 giây, chọn thời kỳ và biên chế, rồi bấm “Xem đáp án”."; fb.className = "oz-feedback";
      root.querySelector(".oz-blind-count").textContent = "Bản thu " + (idx + 1) + "/" + order.length + ". Tên tác phẩm được ẩn cho đến khi bạn trả lời.";
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "next") next();
      if (b.dataset.act === "check") {
        if (!ctl("period").value || !ctl("ens").value) { fb.textContent = "Hãy chọn cả thời kỳ và biên chế trước."; fb.className = "oz-feedback bad"; return; }
        const pOk = cur.ok.indexOf(ctl("period").value) >= 0, eOk = ctl("ens").value === cur.ensemble;
        if (!checked && window.OZProgress) {
          const st = stats(); st.total++; if (pOk) st.right++; OZProgress.setStore("blind", st); OZProgress.record("styles", 1); if (OZProgress.skill) OZProgress.skill("style", pOk);
        }
        checked = true;
        fb.textContent = (pOk ? "Thời kỳ: đúng. " : "Thời kỳ: chưa đúng. ") + (eOk ? "Biên chế: đúng." : "Biên chế: chưa đúng.");
        fb.className = "oz-feedback " + (pOk && eOk ? "ok" : "bad");
        reveal.innerHTML = "<p><strong>" + cur.title + "</strong><br>Thời kỳ: " + PERIODS[cur.period] + ". Biên chế: " + ENSEMBLES[cur.ensemble] + ".</p><p>" + cur.clue + "</p>" +
          '<p class="oz-stats">Biểu diễn: ' + cur.performer + '. Nguồn và giấy phép: <a href="' + cur.page + '" target="_blank" rel="noopener">trang tệp trên Wikimedia Commons</a>.</p>';
        reveal.hidden = false;
        const st = stats(); score.textContent = "Tổng cộng (mọi lần): đoán đúng thời kỳ " + st.right + "/" + st.total + ".";
      }
    });
    audio.addEventListener("error", function () { fb.textContent = "Không phát được bản thu này. Bấm “Bản khác”."; fb.className = "oz-feedback bad"; }, true);
    next();
  }

  /* ---------- Phiếu nghe mù cho bản thu của riêng bạn ---------- */
  function mountLog(root) {
    if (root.dataset.ready || !window.OZProgress) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const opt = function (obj) { return Object.keys(obj).map(function (k) { return '<option value="' + k + '">' + obj[k] + "</option>"; }).join(""); };
    root.innerHTML =
      '<p class="oz-stats">Bước 1: trước khi biết tên tác phẩm, ghi dự đoán.</p>' +
      '<div class="oz-row"><label>Thời kỳ <select data-k="g-p">' + opt(PERIODS) + '</select></label><label>Biên chế <select data-k="g-e">' + opt(ENSEMBLES) + '</select></label>' +
      '<input class="oz-input" data-k="g-c" placeholder="Đoán tác giả (nếu muốn)"></div>' +
      '<p class="oz-stats">Bước 2: sau khi biết đáp án, ghi tên thật và thời kỳ thật.</p>' +
      '<div class="oz-row"><input class="oz-input" data-k="a-t" placeholder="Tên tác phẩm thật"><label>Thời kỳ thật <select data-k="a-p">' + opt(PERIODS) + '</select></label>' +
      '<button class="oz-btn oz-btn--primary" data-act="save">Lưu</button></div>' +
      '<div class="oz-feedback" aria-live="polite"></div><div class="oz-log-table"></div>';
    const ctl = function (k) { return root.querySelector('[data-k="' + k + '"]'); }, fb = root.querySelector(".oz-feedback"), tbl = root.querySelector(".oz-log-table");
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function render() {
      const log = OZProgress.getStore("blindLog", []);
      if (!log.length) { tbl.innerHTML = ""; return; }
      const right = log.filter(function (r) { return r.gp === r.ap; }).length;
      tbl.innerHTML = '<p class="oz-stats">Đã ghi ' + log.length + " lần nghe mù; đoán đúng thời kỳ " + right + "/" + log.length + ".</p>" +
        "<table><thead><tr><th>Ngày</th><th>Tác phẩm</th><th>Đoán</th><th>Thật</th></tr></thead><tbody>" +
        log.slice(-15).reverse().map(function (r) { return "<tr><td>" + r.d + "</td><td>" + esc(r.t) + "</td><td>" + PERIODS[r.gp] + (r.gc ? " (" + esc(r.gc) + ")" : "") + "</td><td>" + PERIODS[r.ap] + (r.gp === r.ap ? " ✓" : "") + "</td></tr>"; }).join("") + "</tbody></table>";
    }
    root.querySelector('[data-act="save"]').addEventListener("click", function () {
      if (!ctl("a-t").value.trim()) { fb.textContent = "Hãy ghi tên tác phẩm thật."; fb.className = "oz-feedback bad"; return; }
      const log = OZProgress.getStore("blindLog", []);
      log.push({ d: OZProgress.today(), t: ctl("a-t").value.trim().slice(0, 120), gp: ctl("g-p").value, ge: ctl("g-e").value, gc: ctl("g-c").value.trim().slice(0, 60), ap: ctl("a-p").value });
      OZProgress.setStore("blindLog", log);
      OZProgress.record("styles", 1);
      fb.textContent = "Đã lưu."; fb.className = "oz-feedback ok"; ctl("a-t").value = ""; ctl("g-c").value = ""; render();
    });
    render();
  }

  window.OZRecognition = { EX: EX, CAD: CAD, VOICING: VOICING, FJ: FJ, TRACKS: TRACKS };
  function init() {
    document.querySelectorAll(".oz-style-example").forEach(mountExample);
    document.querySelectorAll(".oz-style-trainer").forEach(mountStyle);
    document.querySelectorAll(".oz-cadence-trainer").forEach(mountCadence);
    document.querySelectorAll(".oz-texture-trainer").forEach(mountTexture);
    document.querySelectorAll(".oz-blind").forEach(mountBlind);
    document.querySelectorAll(".oz-blind-log").forEach(mountLog);
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
