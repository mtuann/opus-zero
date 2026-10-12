/* Máy đếm nhịp với lịch phát chính xác (lookahead scheduling). */
(function () {
  "use strict";
  const MARKS = [
    [40, "Largo — rất chậm, rộng rãi"], [60, "Larghetto — khá chậm"], [66, "Adagio — chậm, thong thả"],
    [76, "Andante — vừa phải, như bước đi"], [108, "Moderato — vừa"], [120, "Allegro — nhanh, vui"],
    [168, "Presto — rất nhanh"], [200, "Prestissimo — cực nhanh"]
  ];
  let active = null; /* chỉ một máy đếm nhịp chạy một lúc */

  function markFor(bpm) {
    let m = MARKS[0][1];
    MARKS.forEach(function (x) { if (bpm >= x[0]) m = x[1]; });
    return m;
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    root.innerHTML =
      '<div class="oz-row"><button class="oz-btn" data-act="minus" aria-label="Giảm 1 BPM">−</button>' +
      '<span class="oz-bpm" aria-live="polite">80</span>' +
      '<button class="oz-btn" data-act="plus" aria-label="Tăng 1 BPM">+</button>' +
      '<span class="oz-stats">nhịp mỗi phút (BPM)</span></div>' +
      '<input type="range" min="30" max="240" value="80" aria-label="Tốc độ (BPM)">' +
      '<div class="oz-stats oz-mark"></div>' +
      '<div class="oz-row"><label>Số phách mỗi ô nhịp <select data-k="beats"><option>2</option><option>3</option><option selected>4</option><option>6</option></select></label>' +
      '<label><input type="checkbox" data-k="accent" checked> Nhấn phách đầu</label></div>' +
      '<div class="oz-beats" aria-hidden="true"></div>' +
      '<div class="oz-row"><button class="oz-btn oz-btn--primary" data-act="toggle">Bắt đầu</button><button class="oz-btn" data-act="tap">Gõ để đo tốc độ</button></div>';

    const bpmEl = root.querySelector(".oz-bpm");
    const range = root.querySelector('input[type="range"]');
    const mark = root.querySelector(".oz-mark");
    const beatsEl = root.querySelector(".oz-beats");
    const toggle = root.querySelector('[data-act="toggle"]');
    const beatsSel = root.querySelector('[data-k="beats"]');
    const accentChk = root.querySelector('[data-k="accent"]');

    let bpm = 80, running = false, nextTime = 0, beat = 0, timer = null, startedAt = 0, taps = [];
    const queue = [];

    function setBpm(v) {
      bpm = Math.max(30, Math.min(240, Math.round(v)));
      bpmEl.textContent = String(bpm);
      range.value = String(bpm);
      mark.textContent = markFor(bpm);
    }
    function drawBeats() {
      beatsEl.innerHTML = "";
      for (let i = 0; i < Number(beatsSel.value); i++) beatsEl.appendChild(document.createElement("span")).className = "oz-beat";
    }
    function light(i) {
      beatsEl.querySelectorAll(".oz-beat").forEach(function (s, j) {
        s.classList.toggle("on", j === i);
        s.classList.toggle("accent", j === 0 && accentChk.checked);
      });
    }
    function schedule() {
      const c = OZAudio.getCtx();
      while (nextTime < c.currentTime + 0.12) {
        const n = Number(beatsSel.value);
        OZAudio.click(nextTime, beat % n === 0 && accentChk.checked);
        queue.push({ t: nextTime, i: beat % n });
        beat++;
        nextTime += 60 / bpm;
      }
    }
    function frame() {
      if (!running) return;
      const c = OZAudio.getCtx();
      while (queue.length && queue[0].t <= c.currentTime) light(queue.shift().i);
      requestAnimationFrame(frame);
    }
    function stop() {
      if (!running) return;
      running = false;
      clearInterval(timer);
      queue.length = 0;
      light(-1);
      toggle.textContent = "Bắt đầu";
      const mins = Math.floor((Date.now() - startedAt) / 60000);
      if (mins > 0 && window.OZProgress) OZProgress.record("minutes", mins);
      if (active === stop) active = null;
    }
    function start() {
      if (!window.OZAudio || !OZAudio.getCtx()) return;
      if (active) active();
      active = stop;
      running = true;
      beat = 0;
      startedAt = Date.now();
      nextTime = OZAudio.getCtx().currentTime + 0.08;
      schedule();
      timer = setInterval(schedule, 25);
      toggle.textContent = "Dừng";
      requestAnimationFrame(frame);
    }

    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      const a = b.dataset.act;
      if (a === "toggle") running ? stop() : start();
      if (a === "minus") setBpm(bpm - 1);
      if (a === "plus") setBpm(bpm + 1);
      if (a === "tap") {
        const now = performance.now();
        taps = taps.filter(function (t) { return now - t < 2500; });
        taps.push(now);
        if (taps.length >= 2) {
          const gaps = taps.slice(1).map(function (t, i) { return t - taps[i]; });
          setBpm(60000 / (gaps.reduce(function (s, g) { return s + g; }, 0) / gaps.length));
        }
      }
    });
    range.addEventListener("input", function () { setBpm(Number(range.value)); });
    beatsSel.addEventListener("change", function () { beat = 0; drawBeats(); });
    if (window.location$) window.location$.subscribe(function () { stop(); });

    setBpm(80);
    drawBeats();
  }

  function init() { document.querySelectorAll(".oz-metronome").forEach(mount); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
