/* Lưu tiến độ luyện tập trong trình duyệt (localStorage). Dữ liệu chỉ nằm trên máy của bạn. */
(function () {
  "use strict";
  const KEY = "opus-zero:v1";

  function today() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (data && typeof data === "object" && data.days) return data;
    } catch (e) { /* bỏ qua: storage bị chặn hoặc hỏng */ }
    return { days: {} };
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }

  function getDay(data, key) {
    if (!data.days[key]) data.days[key] = { tasks: {}, note: "", notes: 0, intervals: 0, minutes: 0 };
    return data.days[key];
  }

  /* Ghi lại một hoạt động trong ngày, ví dụ record("notes", 1) */
  function record(field, amount) {
    const data = load();
    const d = getDay(data, today());
    d[field] = (d[field] || 0) + (amount || 1);
    save(data);
    document.dispatchEvent(new CustomEvent("oz:progress"));
  }

  function setTask(task, done) {
    const data = load();
    getDay(data, today()).tasks[task] = !!done;
    save(data);
    document.dispatchEvent(new CustomEvent("oz:progress"));
  }

  function setNote(text) {
    const data = load();
    getDay(data, today()).note = text;
    save(data);
  }

  /* Mức độ hoạt động của một ngày: 0–3 */
  function level(d) {
    if (!d) return 0;
    let score = Object.values(d.tasks || {}).filter(Boolean).length;
    if ((d.notes || 0) >= 10) score += 1;
    if ((d.intervals || 0) >= 10) score += 1;
    if ((d.minutes || 0) >= 5) score += 1;
    if ((d.chords || 0) + (d.keysigs || 0) + (d.rhythms || 0) + (d.melodies || 0) + (d.builds || 0) + (d.scales || 0) + (d.styles || 0) >= 10) score += 1;
    if ((d.cards || 0) >= 10 || (d.quizzes || 0) >= 1) score += 1;
    if (score === 0) return 0;
    if (score <= 1) return 1;
    if (score <= 3) return 2;
    return 3;
  }

  function streak() {
    const data = load();
    let count = 0;
    const d = new Date();
    /* Hôm nay chưa tập thì vẫn tính chuỗi đến hôm qua. */
    const fmt = function (x) {
      return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
    };
    if (level(data.days[fmt(d)]) === 0) d.setDate(d.getDate() - 1);
    while (level(data.days[fmt(d)]) > 0) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  /* Kho dữ liệu dài hạn (không theo ngày): thống kê nốt, bài đã học, thẻ ghi nhớ. */
  function getStore(name, fallback) {
    const data = load();
    return (data.store && data.store[name] !== undefined) ? data.store[name] : fallback;
  }
  function setStore(name, value) {
    const data = load();
    if (!data.store) data.store = {};
    data.store[name] = value;
    save(data);
    document.dispatchEvent(new CustomEvent("oz:progress"));
  }

  /* Theo dõi năng lực từng kỹ năng: số lần, số đúng, độ chính xác trượt (EMA), lần luyện cuối */
  function skill(id, ok) {
    const data = load();
    if (!data.store) data.store = {};
    const all = data.store.skills || {};
    const s = all[id] || { n: 0, c: 0, ema: 0.5, last: "" };
    s.n++; if (ok) s.c++;
    s.ema = s.n === 1 ? (ok ? 0.7 : 0.3) : s.ema * 0.85 + (ok ? 1 : 0) * 0.15;
    s.last = today();
    all[id] = s; data.store.skills = all;
    save(data);
    document.dispatchEvent(new CustomEvent("oz:progress"));
  }

  window.OZProgress = { skill: skill, getStore: getStore, setStore: setStore, KEY: KEY, today: today, load: load, save: save, getDay: getDay, record: record, setTask: setTask, setNote: setNote, level: level, streak: streak };
})();
