/* Bàn phím piano: .oz-piano (nhúng vào bài học) và .oz-piano-explorer (xem gam, hợp âm). */
(function () {
  "use strict";
  const T = function () { return window.OZTheory; };
  const BLACK = [1, 3, 6, 8, 10];
  const PC_NAMES = ["Đô", "Đô♯/Rê♭", "Rê", "Rê♯/Mi♭", "Mi", "Fa", "Fa♯/Sol♭", "Sol", "Sol♯/La♭", "La", "La♯/Si♭", "Si"];
  const PC_LETTERS = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
  const SVGNS = "http://www.w3.org/2000/svg";

  function isBlack(m) { return BLACK.indexOf(((m % 12) + 12) % 12) >= 0; }
  function nameOf(m) {
    const pc = ((m % 12) + 12) % 12;
    return PC_NAMES[pc] + " (" + PC_LETTERS[pc] + Math.floor(m / 12 - 1) + ")";
  }

  /* Vẽ bàn phím; trả về đối tượng điều khiển */
  function keyboard(host, opts) {
    const lo = opts.lo, hi = opts.hi;
    const W = 24, H = 104, BW = 14, BH = 64;
    let whites = 0;
    for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites++;
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + (whites * W + 2) + " " + (H + 2));
    svg.setAttribute("class", "oz-keys");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Bàn phím piano: dùng phím mũi tên để chọn, Enter để bấm");
    const keys = {};
    const blackLayer = [];
    let x = 1;
    for (let m = lo; m <= hi; m++) {
      if (isBlack(m)) continue;
      const r = document.createElementNS(SVGNS, "rect");
      r.setAttribute("x", x); r.setAttribute("y", 1); r.setAttribute("width", W); r.setAttribute("height", H); r.setAttribute("rx", 3);
      r.setAttribute("class", "oz-key white");
      r.dataset.m = String(m);
      svg.appendChild(r);
      keys[m] = r;
      if (opts.labels !== false) {
        const t = document.createElementNS(SVGNS, "text");
        t.setAttribute("x", x + W / 2); t.setAttribute("y", H - 8);
        t.setAttribute("class", "oz-key-label");
        t.textContent = T().SOLFEGE[T().NAT.indexOf(m % 12)];
        svg.appendChild(t);
        r.label = t;
      }
      if (m + 1 <= hi && isBlack(m + 1)) blackLayer.push([m + 1, x + W - BW / 2]);
      x += W;
    }
    blackLayer.forEach(function (b) {
      const r = document.createElementNS(SVGNS, "rect");
      r.setAttribute("x", b[1]); r.setAttribute("y", 1); r.setAttribute("width", BW); r.setAttribute("height", BH); r.setAttribute("rx", 2);
      r.setAttribute("class", "oz-key black");
      r.dataset.m = String(b[0]);
      svg.appendChild(r);
      keys[b[0]] = r;
    });
    host.appendChild(svg);

    const info = document.createElement("div");
    info.className = "oz-stats oz-key-info";
    info.setAttribute("aria-live", "polite");
    info.textContent = opts.hint || "Bấm vào phím để nghe và xem tên nốt.";
    host.appendChild(info);

    function flash(m) {
      const k = keys[m];
      if (!k) return;
      k.classList.add("pressed");
      setTimeout(function () { k.classList.remove("pressed"); }, 260);
    }
    /* Bàn phím máy tính: Tab vào bàn phím đàn, mũi tên trái/phải chọn phím, Enter hoặc Space để bấm */
    const ordered = Object.keys(keys).map(Number).sort(function (a, b) { return a - b; });
    ordered.forEach(function (m, i) {
      const k = keys[m];
      k.setAttribute("tabindex", i === 0 ? "0" : "-1");
      k.setAttribute("role", "button");
      k.setAttribute("aria-label", nameOf(m));
    });
    svg.addEventListener("keydown", function (e) {
      const k = e.target.closest ? e.target.closest(".oz-key") : null;
      if (!k) return;
      const i = ordered.indexOf(Number(k.dataset.m));
      let j = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") j = Math.min(ordered.length - 1, i + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") j = Math.max(0, i - 1);
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = ordered.length - 1;
      if (j >= 0) { e.preventDefault(); k.setAttribute("tabindex", "-1"); const n = keys[ordered[j]]; n.setAttribute("tabindex", "0"); n.focus(); return; }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); press(Number(k.dataset.m)); }
    });
    function press(m) {
      if (window.OZAudio && !opts.silent) OZAudio.playNote(m, undefined, 1.2);
      flash(m);
      info.textContent = nameOf(m);
      if (opts.onKey) opts.onKey(m);
    }
    svg.addEventListener("pointerdown", function (e) {
      const k = e.target.closest ? e.target.closest(".oz-key") : null;
      if (!k) return;
      press(Number(k.dataset.m));
    });
    /* Phím được nhấn từ đàn MIDI cũng sáng lên trên bàn phím màn hình */
    if (window.OZMidi && opts.midi !== false) {
      OZMidi.on(function (ev) { if (ev.type === "on" && svg.isConnected) { flash(ev.midi); info.textContent = nameOf(ev.midi) + " (đàn MIDI)"; } });
    }

    return {
      highlight: function (list) {
        Object.keys(keys).forEach(function (m) { keys[m].classList.remove("hl"); });
        (list || []).forEach(function (m) { if (keys[m]) keys[m].classList.add("hl"); });
      },
      flash: flash,
      info: info
    };
  }

  function parseRange(s, dlo, dhi) {
    const p = String(s || "").split("-");
    let lo = T().midiOf(p[0]) || dlo, hi = T().midiOf(p[1]) || dhi;
    if (isBlack(lo)) lo--;
    if (isBlack(hi)) hi++;
    return [lo, hi];
  }

  function mountSimple(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-piano-wrap");
    const range = parseRange(root.dataset.range, 60, 72);
    const kb = keyboard(root, { lo: range[0], hi: range[1], labels: root.dataset.labels !== "off", hint: root.dataset.hint });
    const notes = (root.dataset.notes || "").split(/\s+/).filter(Boolean).map(T().midiOf).filter(function (m) { return m !== null; });
    kb.highlight(notes);
    if (notes.length) {
      const row = document.createElement("div");
      row.className = "oz-row";
      const play = document.createElement("button");
      play.className = "oz-btn";
      play.textContent = root.dataset.play === "chord" ? "Nghe hợp âm" : "Nghe các nốt được tô";
      play.addEventListener("click", function () {
        const c = OZAudio.getCtx(); if (!c) return;
        const t = c.currentTime;
        notes.forEach(function (m, i) {
          const at = root.dataset.play === "chord" ? t : t + i * 0.35;
          OZAudio.playNote(m, at, root.dataset.play === "chord" ? 1.8 : 0.6, root.dataset.play === "chord" ? 0.14 : 0.22);
          setTimeout(function () { kb.flash(m); }, (at - t) * 1000);
        });
      });
      row.appendChild(play);
      root.appendChild(row);
    }
  }

  const ROOTS = ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B"];

  function mountExplorer(root) {
    if (root.dataset.ready || !window.OZTheory) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const rootOpts = ROOTS.map(function (r) { return '<option value="' + r + '">' + T().prettyKeyVi(r) + " (" + T().prettyKey(r) + ")</option>"; }).join("");
    const typeOpts =
      '<optgroup label="Gam">' + Object.keys(T().SCALES).map(function (k) { return '<option value="s:' + k + '">' + T().SCALES[k].name + "</option>"; }).join("") + "</optgroup>" +
      '<optgroup label="Hợp âm">' + Object.keys(T().CHORDS).map(function (k) { return '<option value="c:' + k + '">' + T().CHORDS[k].name + "</option>"; }).join("") + "</optgroup>";
    root.innerHTML =
      '<div class="oz-row"><label>Nốt gốc <select data-k="root">' + rootOpts + '</select></label>' +
      '<label>Loại <select data-k="type">' + typeOpts + "</select></label>" +
      '<button class="oz-btn oz-btn--primary" data-act="play">Nghe</button></div>' +
      '<div class="oz-explorer-names" aria-live="polite"></div>' +
      '<div class="oz-kb"></div>';
    const kb = keyboard(root.querySelector(".oz-kb"), { lo: 48, hi: 84 });
    const names = root.querySelector(".oz-explorer-names");
    const rootSel = root.querySelector('[data-k="root"]');
    const typeSel = root.querySelector('[data-k="type"]');
    let current = [];

    function update() {
      const r = rootSel.value;
      const n = T().parse(r + "4");
      const start = T().midi(n) >= 66 ? r + "3" : r + "4"; /* giữ trong khung */
      const t = typeSel.value.split(":");
      const notes = t[0] === "s" ? T().scale(start, t[1]) : T().chord(start, t[1]);
      current = notes.map(T().midi);
      kb.highlight(current);
      const label = t[0] === "s" ? T().SCALES[t[1]].name + " " + T().prettyKeyVi(r) : T().CHORDS[t[1]].name + " " + T().prettyKeyVi(r) + " (" + T().prettyKey(r) + T().CHORDS[t[1]].sym + ")";
      names.innerHTML = "<strong>" + label + ":</strong> " + notes.map(function (x) { return T().viName(x) + " <small>" + T().letterName(x) + "</small>"; }).join(" – ");
    }
    function play() {
      const c = OZAudio.getCtx(); if (!c) return;
      const t = c.currentTime;
      const isChord = typeSel.value[0] === "c";
      current.forEach(function (m, i) {
        OZAudio.playNote(m, t + i * (isChord ? 0.3 : 0.32), 0.6);
        setTimeout(function () { kb.flash(m); }, i * (isChord ? 300 : 320));
      });
      if (isChord) current.forEach(function (m) { OZAudio.playNote(m, t + current.length * 0.3 + 0.2, 1.8, 0.13); });
    }
    rootSel.addEventListener("change", update);
    typeSel.addEventListener("change", update);
    root.querySelector('[data-act="play"]').addEventListener("click", play);
    update();
  }

  window.OZPiano = { keyboard: keyboard, nameOf: nameOf };
  function init() {
    document.querySelectorAll(".oz-piano").forEach(mountSimple);
    document.querySelectorAll(".oz-piano-explorer").forEach(mountExplorer);
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
