/* Nhật ký luyện tập: chuỗi ngày, bản đồ nhiệt 16 tuần, việc cần làm hôm nay, ghi chú. */
(function () {
  "use strict";
  const TASKS = [
    ["doc-not", "Đọc nốt 5 phút (tự đánh dấu khi đọc đúng 10 nốt)"],
    ["luyen-tai", "Luyện tai 5 phút (tự đánh dấu khi nhận đúng 10 quãng)"],
    ["nhac-ly", "Học hoặc ôn một mục nhạc lý 10 phút"],
    ["nghe", "Nghe chủ động một tác phẩm và ghi vài dòng"]
  ];

  function fmt(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
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
      "<h3>Hôm nay</h3>" +
      '<div class="oz-checklist"></div>' +
      '<label for="oz-note" class="oz-stats">Ghi chú hôm nay: học được gì, chỗ nào còn khó</label>' +
      '<textarea id="oz-note" placeholder="Ví dụ: đã thuộc các nốt trên dòng kẻ khóa Sol, còn nhầm Rê và Fa ở khe."></textarea>' +
      '<div class="oz-row"><button class="oz-btn" data-act="export">Tải bản sao lưu (.json)</button>' +
      '<label class="oz-btn" style="cursor:pointer">Khôi phục từ bản sao lưu<input type="file" accept="application/json" hidden></label>' +
      '<button class="oz-btn" data-act="reset">Xóa toàn bộ dữ liệu</button></div>' +
      '<p class="oz-stats">Dữ liệu chỉ lưu trong trình duyệt này. Đổi máy hoặc xóa dữ liệu trình duyệt sẽ mất, nên thỉnh thoảng hãy tải bản sao lưu.</p>';

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
      if ((d.intervals || 0) >= 10 && !d.tasks["luyen-tai"]) { d.tasks["luyen-tai"] = true; changed = true; }
      if (changed) OZProgress.save(data);

      list.querySelectorAll("input").forEach(function (c) { c.checked = !!d.tasks[c.dataset.task]; });
      if (document.activeElement !== note) note.value = d.note || "";

      const s = OZProgress.streak();
      streakEl.textContent = s === 0 ? "Chưa có chuỗi ngày nào. Hôm nay là ngày đầu tiên." : "Chuỗi " + s + " ngày liên tiếp";
      todayStats.textContent = "Hôm nay: " + (d.notes || 0) + " nốt đọc đúng, " + (d.intervals || 0) + " quãng nhận đúng, " + (d.minutes || 0) + " phút dùng máy đếm nhịp.";

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
    root.addEventListener("click", function (e) {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      if (b.dataset.act === "export") {
        const blob = new Blob([JSON.stringify(OZProgress.load(), null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "opus-zero-" + OZProgress.today() + ".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      }
      if (b.dataset.act === "reset" && confirm("Xóa toàn bộ nhật ký luyện tập trong trình duyệt này? Không thể hoàn tác.")) {
        try { localStorage.removeItem(OZProgress.KEY); } catch (err) { /* bỏ qua */ }
        refresh();
      }
    });
    root.querySelector('input[type="file"]').addEventListener("change", function (e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      f.text().then(function (txt) {
        const data = JSON.parse(txt);
        if (!data || typeof data.days !== "object") throw new Error("bad");
        OZProgress.save(data);
        refresh();
      }).catch(function () {
        alert("File này không phải bản sao lưu của Opus Zero.");
      });
      e.target.value = "";
    });
    document.addEventListener("oz:progress", refresh);
    refresh();
  }

  function init() { document.querySelectorAll(".oz-journal").forEach(mount); }
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
