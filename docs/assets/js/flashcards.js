/* Thẻ ghi nhớ có ôn tập ngắt quãng (hệ Leitner), lấy dữ liệu từ các bảng "Thuật ngữ" trên cùng trang. */
(function () {
  "use strict";
  const INTERVALS = [0, 1, 3, 7, 16, 35]; /* số ngày chờ theo từng hộp */
  const NEW_PER_DAY = 10;

  function addDays(iso, n) {
    const p = iso.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2] + n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function readDeck() {
    const deck = [];
    const scope = document.querySelector("article") || document;
    scope.querySelectorAll("table").forEach(function (tb) {
      const th = tb.querySelectorAll("thead th");
      if (!th.length || th[0].textContent.trim() !== "Thuật ngữ") return;
      const heads = Array.prototype.map.call(th, function (h) { return h.textContent.trim(); });
      tb.querySelectorAll("tbody tr").forEach(function (tr) {
        const td = tr.querySelectorAll("td");
        if (!td.length) return;
        deck.push({
          id: td[0].textContent.trim(),
          front: td[0].innerHTML,
          back: Array.prototype.slice.call(td, 1).map(function (c, i) { return "<p><span class='oz-stats'>" + heads[i + 1] + ":</span> " + c.innerHTML + "</p>"; }).join("")
        });
      });
    });
    return deck;
  }

  function mount(root) {
    if (root.dataset.ready || !window.OZProgress) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    const deck = readDeck();
    if (!deck.length) { root.textContent = "Không tìm thấy bảng thuật ngữ nào trên trang này."; return; }
    root.innerHTML =
      '<div class="oz-stats oz-fc-stats"></div>' +
      '<div class="oz-card" aria-live="polite"><div class="oz-card-front"></div><div class="oz-card-back" hidden></div></div>' +
      '<div class="oz-row oz-fc-actions"></div>';
    const statsEl = root.querySelector(".oz-fc-stats");
    const front = root.querySelector(".oz-card-front"), back = root.querySelector(".oz-card-back");
    const actions = root.querySelector(".oz-fc-actions");
    let queue = [], cur = null;

    function state() { return OZProgress.getStore("cards", {}); }
    function build() {
      const st = state(), today = OZProgress.today();
      const due = deck.filter(function (c) { return st[c.id] && st[c.id].due <= today; });
      const introducedToday = Object.keys(st).filter(function (k) { return st[k].added === today; }).length;
      const fresh = deck.filter(function (c) { return !st[c.id]; }).slice(0, Math.max(0, NEW_PER_DAY - introducedToday));
      queue = due.concat(fresh);
      const learned = Object.keys(st).filter(function (k) { return st[k].box >= 3; }).length;
      statsEl.textContent = "Bộ thẻ: " + deck.length + " thuật ngữ. Đã nhớ chắc: " + learned + ". Cần ôn hôm nay: " + due.length + ". Thẻ mới hôm nay: " + fresh.length + ".";
    }
    function show() {
      back.hidden = true;
      actions.innerHTML = "";
      if (!queue.length) {
        cur = null;
        front.innerHTML = "<strong>Xong phần ôn hôm nay.</strong>";
        back.hidden = false;
        back.innerHTML = "<p>Quay lại vào ngày mai: thẻ nhớ tốt sẽ được hỏi thưa dần (1, 3, 7, 16, 35 ngày).</p>";
        const again = document.createElement("button");
        again.className = "oz-btn"; again.textContent = "Ôn thêm 10 thẻ ngẫu nhiên";
        again.addEventListener("click", function () { queue = deck.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10).map(function (c) { return Object.assign({ extra: true }, c); }); show(); });
        actions.appendChild(again);
        return;
      }
      cur = queue[0];
      front.innerHTML = cur.front;
      back.innerHTML = cur.back;
      const flip = document.createElement("button");
      flip.className = "oz-btn oz-btn--primary"; flip.textContent = "Lật thẻ";
      flip.addEventListener("click", reveal);
      actions.appendChild(flip);
    }
    function reveal() {
      back.hidden = false;
      actions.innerHTML = "";
      [["again", "Chưa nhớ"], ["good", "Nhớ"]].forEach(function (a) {
        const b = document.createElement("button");
        b.className = "oz-btn" + (a[0] === "good" ? " oz-btn--primary" : "");
        b.textContent = a[1];
        b.addEventListener("click", function () { grade(a[0] === "good"); });
        actions.appendChild(b);
      });
    }
    function grade(good) {
      queue.shift();
      if (!cur.extra) {
        const st = state(), today = OZProgress.today();
        const s = st[cur.id] || { box: 0, added: today };
        s.box = good ? Math.min(s.box + 1, INTERVALS.length - 1) : 0;
        s.due = addDays(today, good ? INTERVALS[s.box] : 0);
        st[cur.id] = s;
        OZProgress.setStore("cards", st);
        if (!good) queue.push(cur); /* hỏi lại cuối buổi */
      }
      OZProgress.record("cards", 1);
      show();
    }
    root.addEventListener("keydown", function (e) {
      if (e.target.matches("input, select, textarea")) return;
      if (e.code === "Space" && cur && back.hidden) { e.preventDefault(); reveal(); }
      else if (cur && !back.hidden && (e.key === "1" || e.key === "2")) grade(e.key === "2");
    });
    root.tabIndex = 0;
    build(); show();
  }
  function init() { document.querySelectorAll(".oz-flashcards").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
