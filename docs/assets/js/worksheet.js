/* Phiếu bài tập in được: sinh ngẫu nhiên đề + đáp án. */
(function () {
  "use strict";
  const T = function () { return window.OZTheory; };
  const SOL = ["Đô", "Rê", "Mi", "Fa", "Sol", "La", "Si"];
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function abcOfV(v) { const l = ((v % 7) + 7) % 7, o = Math.floor(v / 7); return T().abc({ l: l, a: 0, o: o }); }

  const TYPES = {
    notesTreble: { name: "Gọi tên nốt khóa Sol", make: function () {
      const vs = []; for (let i = 0; i < 16; i++) vs.push(rnd(26, 42));
      return { abc: "X:1\nL:1/4\nM:4/4\nK:C\n" + chunk(vs.map(abcOfV), 4), ans: vs.map(function (v) { return SOL[v % 7]; }) }; } },
    notesBass: { name: "Gọi tên nốt khóa Fa", make: function () {
      const vs = []; for (let i = 0; i < 16; i++) vs.push(rnd(14, 30));
      return { abc: "X:1\nL:1/4\nM:4/4\nK:C clef=bass\n" + chunk(vs.map(abcOfV), 4), ans: vs.map(function (v) { return SOL[v % 7]; }) }; } },
    intervals: { name: "Gọi tên quãng (hòa âm)", make: function () {
      const items = []; for (let i = 0; i < 12; i++) {
        const root = pick(["C4", "D4", "E4", "F4", "G4", "A4", "Bb3", "Eb4"]);
        const st = pick([[2, 3, "3 thứ"], [2, 4, "3 trưởng"], [1, 2, "2 trưởng"], [1, 1, "2 thứ"], [3, 5, "4 đúng"], [3, 6, "4 tăng"], [4, 6, "5 giảm"], [4, 7, "5 đúng"], [5, 8, "6 thứ"], [5, 9, "6 trưởng"], [6, 10, "7 thứ"], [6, 11, "7 trưởng"], [7, 12, "8 đúng"]]);
        const notes = T().spell(root, [[0, 0], [st[0], st[1]]]);
        items.push({ abc: "[" + notes.map(function (n) { return T().abc(n); }).join("") + "]4", ans: st[2] });
      }
      return { abc: "X:1\nL:1/4\nM:4/4\nK:C\n" + chunk(items.map(function (x) { return x.abc; }), 4), ans: items.map(function (x) { return x.ans; }) }; } },
    chords: { name: "Gọi tên hợp âm ba", make: function () {
      const items = []; for (let i = 0; i < 12; i++) {
        const root = pick(["C4", "D4", "E4", "F4", "G4", "A3", "Bb3", "Eb4", "B3"]);
        const t = pick(["maj", "maj", "min", "min", "dim", "aug"]);
        const notes = T().chord(root, t);
        items.push({ abc: "[" + notes.map(function (n) { return T().abc(n); }).join("") + "]4", ans: T().letterName(notes[0]) + T().CHORDS[t].sym + " (" + T().CHORDS[t].name.replace("Hợp âm ", "") + ")" });
      }
      return { abc: "X:1\nL:1/4\nM:4/4\nK:C\n" + chunk(items.map(function (x) { return x.abc; }), 4), ans: items.map(function (x) { return x.ans; }) }; } },
    keysigs: { name: "Đọc hóa biểu", make: function () {
      const ks = T().KEYS.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
      return { multi: ks.map(function (k) { return "X:1\nM:none\nL:1/4\nK:" + k.tonic + "\nx2|]"; }),
        ans: ks.map(function (k) { return T().prettyKeyVi(k.tonic) + " trưởng / " + T().prettyKeyVi(k.minor) + " thứ"; }) }; } }
  };
  function chunk(tokens, per) {
    const lines = [];
    for (let i = 0; i < tokens.length; i += per) lines.push(tokens.slice(i, i + per).join(" "));
    return lines.join(" |\n") + " |]";
  }

  function mount(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool", "oz-worksheet");
    root.innerHTML =
      '<div class="oz-row oz-noprint"><label>Loại bài <select data-k="type">' +
      Object.keys(TYPES).map(function (k) { return '<option value="' + k + '">' + TYPES[k].name + "</option>"; }).join("") +
      '</select></label><button class="oz-btn" data-act="new">Đề mới</button><button class="oz-btn" data-act="ans">Hiện/ẩn đáp án</button><button class="oz-btn oz-btn--primary" data-act="print">In phiếu</button></div>' +
      '<h3 class="oz-ws-title"></h3><p class="oz-stats">Họ tên: ____________________ Ngày: ____________ Điểm: ______</p>' +
      '<div class="oz-ws-body"></div><div class="oz-ws-ans" hidden></div>';
    const sel = root.querySelector('[data-k="type"]');
    const body = root.querySelector(".oz-ws-body"), ans = root.querySelector(".oz-ws-ans");
    function make() {
      const t = TYPES[sel.value], d = t.make();
      root.querySelector(".oz-ws-title").textContent = "Phiếu bài tập: " + t.name;
      body.innerHTML = ""; ans.innerHTML = "";
      const fg = getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000";
      if (d.multi) {
        const grid = document.createElement("div"); grid.className = "oz-ws-grid";
        d.multi.forEach(function (src, i) {
          const cell = document.createElement("div"); cell.className = "oz-ws-cell";
          const lab = document.createElement("div"); lab.textContent = (i + 1) + ". ______________";
          const st = document.createElement("div"); cell.appendChild(st); cell.appendChild(lab); grid.appendChild(cell);
          if (window.ABCJS) ABCJS.renderAbc(st, src, { staffwidth: 150, scale: 1, foregroundColor: fg, paddingleft: 0, paddingright: 0 });
        });
        body.appendChild(grid);
      } else {
        const st = document.createElement("div"); body.appendChild(st);
        if (window.ABCJS) ABCJS.renderAbc(st, d.abc, { responsive: "resize", foregroundColor: fg, paddingleft: 0, paddingright: 0 });
        const lines = document.createElement("p"); lines.className = "oz-stats";
        lines.textContent = "Viết đáp án dưới mỗi nốt/hợp âm, hoặc ghi theo thứ tự: " + d.ans.map(function (_, i) { return (i + 1) + ". ____"; }).join("  ");
        body.appendChild(lines);
      }
      ans.innerHTML = "<strong>Đáp án:</strong> " + d.ans.map(function (a, i) { return (i + 1) + ". " + a; }).join("; ");
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "new") make();
      if (b.dataset.act === "ans") ans.hidden = !ans.hidden;
      if (b.dataset.act === "print") window.print();
    });
    sel.addEventListener("change", make);
    make();
  }
  function init() { document.querySelectorAll(".oz-worksheet-gen").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
