/* Vẽ các khối ```abc thành khuông nhạc kèm trình phát luyện tập (abcjs):
   tốc độ (%), lặp lại, nghe từng tay, tiếng gõ nhịp; khuông tự xuống dòng trên màn hình hẹp;
   chế độ "giá nhạc" phóng to khuông và giữ màn hình sáng khi tập. */
(function () {
  "use strict";
  const NARROW = 620; /* khung hẹp hơn mức này (px) thì để abcjs tự ngắt dòng cho nốt đủ to */

  /* Con trỏ: tô sáng nốt đang phát (dùng chung cho mọi khuông có trình phát abcjs) */
  function cursor() {
    let lit = [];
    const off = function () { lit.forEach(function (e) { e.classList.remove("oz-playing"); }); lit = []; };
    return {
      onStart: off,
      onFinished: off,
      onEvent: function (ev) {
        off();
        (ev.elements || []).forEach(function (grp) { (grp || []).forEach(function (e) { if (e && e.classList) { e.classList.add("oz-playing"); lit.push(e); } }); });
      }
    };
  }
  window.OZAbc = { cursor: cursor };

  function fg() { return getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000"; }

  /* Tiêu đề (T: ở phần đầu) hiển thị bằng HTML: tự xuống dòng, không bị cắt khi khuông co lại */
  function splitTitle(src) {
    const titles = [], out = [];
    let head = true;
    src.split("\n").forEach(function (l) {
      if (head && /^T:/.test(l)) { titles.push(l.slice(2).trim()); return; }
      if (/^K:/.test(l)) head = false;
      out.push(l);
    });
    return { title: titles.join(" · "), src: out.join("\n") };
  }

  /* Số phách mỗi ô cho tiếng gõ nhịp (6/8 → 2 phách, 3/8 → 1) */
  function beats(visual) {
    let m = null;
    try { m = visual.getMeterFraction(); } catch (e) { /* không có số chỉ nhịp */ }
    const num = (m && m.num) || 4, den = (m && m.den) || 4;
    if (den === 8 && num % 3 === 0) return Math.max(1, num / 3);
    return Math.max(1, Math.min(12, num));
  }
  function drum(n) {
    const hits = [], notes = [], vel = [];
    for (let i = 0; i < n; i++) { hits.push("d"); notes.push(i ? 77 : 76); vel.push(i ? 60 : 95); }
    return hits.join("") + " " + notes.join(" ") + " " + vel.join(" ");
  }
  /* Các bè thuộc từng khuông: [[0], [1]] với hai khuông một bè; khuông có bè chồng (&) có nhiều số */
  function staffVoices(visual) {
    const line = (visual.lines || []).filter(function (l) { return l.staff; })[0];
    if (!line) return [];
    let i = 0;
    return line.staff.map(function (st) {
      const n = (st.voices || []).length || 1, r = [];
      for (let k = 0; k < n; k++) r.push(i++);
      return r;
    });
  }

  function width(el) { return el.clientWidth || (el.parentNode && el.parentNode.clientWidth) || 0; }
  function draw(el) {
    const st = el._oz, w = width(el);
    const o = { responsive: "resize", foregroundColor: fg(), paddingleft: 0, paddingright: 0, add_classes: true };
    if (st.stand && w) { o.staffwidth = Math.max(320, Math.round(w / 1.3)); o.wrap = { minSpacing: 1.6, maxSpacing: 2.4, preferredMeasuresPerLine: 4 }; }
    else if (w && w < NARROW) { o.staffwidth = Math.max(260, Math.round(w * 1.15)); o.wrap = { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 }; }
    st.narrow = !st.stand && !!o.wrap;
    st.w = w;
    el.textContent = "";
    st.visual = ABCJS.renderAbc(el, st.src, o)[0];
    st.voices = staffVoices(st.visual);
  }
  function params(st) {
    const p = {};
    if (st.voices.length === 2 && st.hand !== "both") p.voicesOff = st.hand === "rh" ? st.voices[1] : st.voices[0];
    if (st.click) { p.drum = drum(beats(st.visual)); p.drumBars = 1; p.drumIntro = 1; }
    return p;
  }
  function tune(el, user) {
    const st = el._oz;
    if (!st.ctrl) return;
    st.ctrl.setTune(st.visual, !!user, params(st)).catch(function () {
      st.audio.textContent = "Không tải được âm thanh. Kiểm tra kết nối mạng rồi tải lại trang.";
    });
  }
  function redraw(el) {
    const st = el._oz;
    if (st.ctrl) { try { st.ctrl.pause(); } catch (e) { /* chưa phát */ } }
    draw(el);
    tune(el, false);
  }

  /* ---- Chế độ giá nhạc ---- */
  let lock = null;
  function wake(on) {
    if (on && navigator.wakeLock && navigator.wakeLock.request) {
      navigator.wakeLock.request("screen").then(function (l) { lock = l; }).catch(function () { /* trình duyệt từ chối */ });
    } else if (!on && lock) { lock.release().catch(function () {}); lock = null; }
  }
  function stand(el, on) {
    const st = el._oz;
    if (on) document.querySelectorAll(".oz-abc.oz-stand .abc-notation").forEach(function (x) { if (x !== el && x._oz) stand(x, false); });
    st.stand = on;
    st.wrap.classList.toggle("oz-stand", on);
    document.documentElement.classList.toggle("oz-stand-open", !!document.querySelector(".oz-abc.oz-stand"));
    const b = st.wrap.querySelector('[data-k="stand"]');
    if (b) { b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "Thoát giá nhạc" : "Giá nhạc"; }
    redraw(el);
    wake(on);
    if (on) { st.wrap.scrollTop = 0; if (b) b.focus(); }
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    const el = document.querySelector(".oz-abc.oz-stand .abc-notation");
    if (el && el._oz) stand(el, false);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && document.querySelector(".oz-abc.oz-stand")) wake(true);
  });

  function tools(el) {
    const st = el._oz, bar = document.createElement("div");
    bar.className = "oz-abc-tools";
    let h = "";
    if (st.ctrl && st.voices.length === 2) {
      h += '<span class="oz-hands" role="group" aria-label="Nghe tay nào">' +
        [["both", "Hai tay"], ["rh", "Tay phải"], ["lh", "Tay trái"]].map(function (x) {
          return '<button type="button" data-hand="' + x[0] + '" aria-pressed="' + (x[0] === "both") + '">' + x[1] + "</button>";
        }).join("") + "</span>";
    }
    if (st.ctrl) h += '<label class="oz-check"><input type="checkbox" data-k="click"> Gõ nhịp</label>';
    h += '<button type="button" data-k="stand" aria-pressed="false" title="Phóng to khuông và giữ màn hình sáng khi tập (Esc để thoát)">Giá nhạc</button>';
    bar.innerHTML = h;
    st.wrap.appendChild(bar);
    bar.addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.hand) {
        st.hand = b.dataset.hand;
        bar.querySelectorAll("[data-hand]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        tune(el, true);
      } else if (b.dataset.k === "stand") stand(el, !st.stand);
    });
    const c = bar.querySelector('[data-k="click"]');
    if (c) c.addEventListener("change", function () { st.click = c.checked; tune(el, true); });
  }

  function mount(el) {
    if (el._oz) return;
    el.style.minHeight = "";
    if (!el.dataset.src) el.dataset.src = el.textContent.trim();
    el.dataset.rendered = "1";
    const t = splitTitle(el.dataset.src);
    const st = el._oz = { src: t.src, hand: "both", click: false, stand: false };
    const wrap = st.wrap = document.createElement("div");
    wrap.className = "oz-abc";
    el.parentNode.insertBefore(wrap, el);
    if (t.title) {
      const cap = document.createElement("p");
      cap.className = "oz-abc-title";
      cap.textContent = t.title;
      wrap.appendChild(cap);
    }
    wrap.appendChild(el);
    draw(el);
    if (ABCJS.synth && ABCJS.synth.supportsAudio()) {
      st.audio = document.createElement("div");
      st.audio.className = "abc-audio";
      wrap.appendChild(st.audio);
      st.ctrl = new ABCJS.synth.SynthController();
      st.ctrl.load(st.audio, cursor(), { displayPlay: true, displayRestart: true, displayProgress: true, displayLoop: true, displayWarp: true });
      tune(el, false);
    }
    tools(el);
  }

  window.OZAbc.mount = function (el) { if (window.ABCJS) mount(el); };

  /* Chiều cao tạm (px) cho khuông chưa vẽ, gần với chiều cao thật (đo trên các trang của site): phần tiêu đề và
     trình phát, cộng số hệ khuông × số khuông mỗi hệ. Khung hẹp thì abcjs tự xuống dòng, khoảng 4 ô nhịp một hệ. */
  function guess(el) {
    const music = (el.dataset.src || el.textContent).split("\n").filter(function (l) { return l.trim() && !/^\s*%/.test(l) && !/^[A-Za-z]:/.test(l); });
    const voice = function (l) { const m = /^\s*\[V:\s*([^\]\s]+)/.exec(l); return m ? m[1] : ""; };
    const ids = [];
    music.forEach(function (l) { if (ids.indexOf(voice(l)) < 0) ids.push(voice(l)); });
    const staves = Math.max(1, ids.length), narrow = width(el) < NARROW;
    let systems = Math.max(1, Math.round(music.length / staves));
    if (narrow) {
      const first = music.filter(function (l) { return voice(l) === ids[0]; }).join(" ").replace(/\[V:[^\]]*\]|"[^"]*"|![^!]*!/g, "");
      systems = Math.max(systems, Math.ceil(first.split("|").filter(function (s) { return /[A-Ga-gz]/.test(s); }).length / 4));
    }
    return narrow ? 230 + systems * staves * 85 : 170 + systems * staves * 75;
  }

  /* Mỗi khuông vẽ khi tới gần màn hình (OZLoader.whenNear); không có bộ tải thì vẽ ngay */
  function render() {
    if (!window.ABCJS) return;
    const near = (window.OZLoader && window.OZLoader.whenNear) || function (el, fn) { fn(); };
    document.querySelectorAll(".abc-notation").forEach(function (el) {
      if (el._oz) return;
      if (!el.style.minHeight) el.style.minHeight = guess(el) + "px";
      near(el, function () { mount(el); });
    });
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(render);

  /* Vẽ lại khi đổi sáng/tối (màu nốt) và khi khung đổi qua lại mức hẹp (xoay màn hình, đổi cỡ cửa sổ). */
  new MutationObserver(function () {
    setTimeout(function () { document.querySelectorAll(".abc-notation").forEach(function (el) { if (el._oz) redraw(el); }); }, 50);
  }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
  let rt = null;
  if (window.addEventListener) window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      document.querySelectorAll(".abc-notation").forEach(function (el) {
        const st = el._oz;
        const w = width(el);
        if (st && Math.abs(w - (st.w || 0)) > 40 && (st.stand || (w < NARROW) !== st.narrow)) redraw(el);
      });
    }, 250);
  });
})();
