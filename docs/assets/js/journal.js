/* Nhật ký luyện tập: chuỗi ngày, bản đồ nhiệt 16 tuần, việc cần làm hôm nay, ghi chú. */
(function () {
  "use strict";
  const TASKS = [
    ["dan", "Tập đàn: khởi động, gam và bài đang tập (20–45 phút)"],
    ["doc-not", "Đọc nốt 5 phút (tự đánh dấu khi đọc đúng 10 nốt)"],
    ["luyen-tai", "Luyện tai 5 phút (tự đánh dấu khi nhận đúng 10 quãng hoặc hợp âm)"],
    ["nhac-ly", "Học hoặc ôn nhạc lý 10 phút (tự đánh dấu khi làm xong một quiz hoặc ôn 10 thẻ thuật ngữ)"],
    ["nghe", "Nghe chủ động một tác phẩm và ghi vài dòng"]
  ];

  function fmt(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function todayLine(d) {
    const parts = [];
    [["notes", "nốt đọc đúng"], ["intervals", "quãng"], ["chords", "hợp âm"], ["keysigs", "hóa biểu"],
     ["rhythms", "tiết tấu gõ đúng"], ["scales", "gam nhận đúng"], ["builds", "gam/hợp âm tự xây"], ["melodies", "giai điệu thị tấu"], ["styles", "câu nhận diện"], ["cards", "thẻ thuật ngữ"],
     ["quizzes", "quiz bài học"], ["minutes", "phút máy đếm nhịp"], ["piano", "buổi tập bài"], ["readings", "bài thị tấu hai tay"], ["checks", "mục đã đánh dấu xong"]].forEach(function (f) {
      if (d[f[0]]) parts.push(d[f[0]] + " " + f[1]);
    });
    return parts.length ? "Hôm nay: " + parts.join(", ") + "." : "Hôm nay chưa có hoạt động nào.";
  }

  /* Số bài đang tập và đã chơi được (từ nút trên các bài học tác phẩm) */
  function pieces() {
    const rep = OZProgress.getStore("repertoire", {}) || {};
    const n = function (st) { return Object.keys(rep).filter(function (k) { return rep[k] && rep[k].status === st; }).length; };
    const a = n("learning"), b = n("done");
    if (!a && !b) return "";
    return " " + (a ? "Đang tập " + a + " bài" + (b ? ", đã chơi được " + b + " bài." : ".") : "Đã chơi được " + b + " bài.");
  }

  /* Tóm tắt nhỏ cho trang chủ */
  function mountSummary(root) {
    if (!window.OZProgress) return;
    root.classList.add("oz-tool", "oz-summary-box");
    function render() {
      const data = OZProgress.load();
      const d = OZProgress.getDay(data, OZProgress.today());
      const s = OZProgress.streak();
      const lessons = Object.keys(OZProgress.getStore("lessons", {})).length;
      const cards = OZProgress.getStore("cards", {});
      const today = OZProgress.today();
      const due = Object.keys(cards).filter(function (k) { return cards[k].due <= today; }).length;
      root.innerHTML = '<span class="oz-streak">' + (s ? "Chuỗi " + s + " ngày" : "Bắt đầu chuỗi ngày hôm nay") + "</span>" +
        "<p class='oz-stats'>" + todayLine(d) + pieces() + " Đã hoàn thành " + lessons + " bài nhạc lý." +
        (due ? " Có " + due + " thẻ thuật ngữ cần ôn." : "") + "</p>";
    }
    if (!root.dataset.ready) { root.dataset.ready = "1"; document.addEventListener("oz:progress", render); }
    render();
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-tool");
    if (!window.OZProgress) { root.textContent = "Không tải được bộ lưu tiến độ."; return; }

    root.innerHTML =
      '<div class="oz-row"><span class="oz-streak"></span></div>' +
      '<div class="oz-heat" role="img"></div>' +
      '<div class="oz-stats oz-today-stats"></div>' +
      "<h2>Hôm nay</h2>" +
      '<div class="oz-checklist"></div>' +
      '<label for="oz-note" class="oz-stats">Ghi chú hôm nay: học được gì, chỗ nào còn khó</label>' +
      '<textarea id="oz-note" placeholder="Ví dụ: đã thuộc các nốt trên dòng kẻ khóa Sol, còn nhầm Rê và Fa ở khe."></textarea>' +
      '<p class="oz-stats">Dữ liệu chỉ lưu trong trình duyệt này. Sao lưu, chuyển sang máy khác hoặc xóa: xem <a class="oz-data-link" href="#">Dữ liệu của tôi</a>.</p>';

    const streakEl = root.querySelector(".oz-streak");
    const heat = root.querySelector(".oz-heat");
    const todayStats = root.querySelector(".oz-today-stats");
    const list = root.querySelector(".oz-checklist");
    const note = root.querySelector("textarea");

    TASKS.forEach(function (t) {
      const l = document.createElement("label");
      l.innerHTML = '<input type="checkbox" data-task="' + t[0] + '"> ' + t[1];
      list.appendChild(l);
    });

    function refresh() {
      const data = OZProgress.load();
      const key = OZProgress.today();
      const d = OZProgress.getDay(data, key);

      /* Tự đánh dấu khi đạt mốc trong công cụ luyện tập */
      let changed = false;
      if ((d.notes || 0) >= 10 && !d.tasks["doc-not"]) { d.tasks["doc-not"] = true; changed = true; }
      if ((d.intervals || 0) + (d.chords || 0) + (d.scales || 0) >= 10 && !d.tasks["luyen-tai"]) { d.tasks["luyen-tai"] = true; changed = true; }
      if (((d.quizzes || 0) >= 1 || (d.cards || 0) >= 10) && !d.tasks["nhac-ly"]) { d.tasks["nhac-ly"] = true; changed = true; }
      if (changed) OZProgress.save(data);

      list.querySelectorAll("input").forEach(function (c) { c.checked = !!d.tasks[c.dataset.task]; });
      if (document.activeElement !== note) note.value = d.note || "";

      const s = OZProgress.streak();
      streakEl.textContent = s === 0 ? "Chưa có chuỗi ngày nào. Hôm nay là ngày đầu tiên." : "Chuỗi " + s + " ngày liên tiếp";
      todayStats.textContent = todayLine(d);

      /* Bản đồ nhiệt: 16 tuần, mỗi cột là một tuần bắt đầu từ thứ Hai */
      heat.innerHTML = "";
      const end = new Date();
      const start = new Date(end);
      const dow = (end.getDay() + 6) % 7; /* thứ Hai = 0 */
      start.setDate(end.getDate() - dow - 7 * 15);
      let active = 0;
      for (let x = new Date(start); x <= end; x.setDate(x.getDate() + 1)) {
        const k = fmt(x);
        const lv = OZProgress.level(data.days[k]);
        if (lv) active++;
        const cell = document.createElement("span");
        if (lv) cell.className = "l" + lv;
        if (k === key) cell.classList.add("today");
        cell.title = k + (lv ? "" : ": chưa luyện tập");
        heat.appendChild(cell);
      }
      heat.setAttribute("aria-label", "Đã luyện tập " + active + " ngày trong 16 tuần gần nhất");
    }

    list.addEventListener("change", function (e) {
      if (e.target.dataset.task) OZProgress.setTask(e.target.dataset.task, e.target.checked);
    });
    let tmr = null;
    note.addEventListener("input", function () {
      clearTimeout(tmr);
      tmr = setTimeout(function () { OZProgress.setNote(note.value); refresh(); }, 400);
    });
    const dl = root.querySelector(".oz-data-link"), mf = document.querySelector('link[rel="manifest"]');
    if (dl) dl.href = (mf ? new URL(".", mf.href).href : "../../") + "luyen-tap/du-lieu/";
    document.addEventListener("oz:progress", refresh);
    refresh();
  }

  function init() {
    document.querySelectorAll(".oz-journal").forEach(mount);
    document.querySelectorAll(".oz-summary").forEach(mountSummary);
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
