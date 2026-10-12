/* Hình phản hồi dùng chung (không cần thư viện ngoài): piano roll cao độ, dải nhịp gõ,
   bàn phím nhỏ, so sánh chép giai điệu, biểu đồ tiến bộ theo tuần.
   Các hàm vẽ là hàm thuần trả về chuỗi SVG để kiểm thử dễ và chèn nhanh bằng innerHTML. */
(function (root) {
  "use strict";
  const NV = ["Đô", "Đô♯", "Rê", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "Si♭", "Si"];
  const COL = { ok: "#2e7d4f", high: "#b3412e", low: "#2f5582", missing: "#999", early: "#2f5582", late: "#b3412e", extra: "#999" };
  const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  const name = function (m) { m = Math.round(m); return NV[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); };
  const f2m = function (f) { return 69 + 12 * Math.log2(f / 440); };
  function svg(w, h, label, body) {
    return '<svg class="oz-viz" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(label) + '" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>";
  }
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (o.size || 9) + '" text-anchor="' + (o.anchor || "start") + '" fill="' + (o.fill || "currentColor") + '"' + (o.op ? ' fill-opacity="' + o.op + '"' : "") + ">" + esc(s) + "</text>";
  }

  /* Piano roll: ô = nốt đúng (màu theo kết quả), chấm = cao độ thật của bạn (micro) hoặc phím bấm (MIDI) */
  function pianoRoll(o) {
    const exp = o.expected || [], frames = o.frames || [], events = o.events || [];
    if (!exp.length) return "";
    const t0 = exp[0].t0 - 0.2, t1 = exp[exp.length - 1].t0 + exp[exp.length - 1].dur + 0.2;
    let lo = Math.min.apply(null, exp.map(function (n) { return n.midi; })) - 2, hi = Math.max.apply(null, exp.map(function (n) { return n.midi; })) + 2;
    const W = 640, H = Math.max(120, (hi - lo + 1) * 11 + 24), L = 44;
    const x = function (t) { return L + (t - t0) / (t1 - t0) * (W - L - 6); };
    const y = function (m) { return 6 + (hi - m) * ((H - 24) / (hi - lo)); };
    let b = "";
    for (let m = lo; m <= hi; m++) {
      const nat = [0, 2, 4, 5, 7, 9, 11].indexOf(((m % 12) + 12) % 12) >= 0;
      if (nat) b += '<line x1="' + L + '" x2="' + W + '" y1="' + y(m).toFixed(1) + '" y2="' + y(m).toFixed(1) + '" stroke="currentColor" stroke-opacity=".08"/>' + txt(L - 4, y(m) + 3, name(m), { size: 7.5, anchor: "end", op: 0.6 });
    }
    exp.forEach(function (n) {
      const c = COL[n.status] || "#999";
      b += '<rect x="' + x(n.t0).toFixed(1) + '" y="' + (y(n.midi) - 4.5).toFixed(1) + '" width="' + Math.max(2, x(n.t0 + n.dur) - x(n.t0) - 2).toFixed(1) + '" height="9" rx="2" fill="' + c + '" fill-opacity=".22" stroke="' + c + '"/>';
    });
    /* Micro: gấp cao độ về quãng tám gần nốt cần chơi nếu bỏ qua quãng tám */
    let pts = "";
    frames.forEach(function (fr) {
      if (!(fr.f > 0) || fr.t < t0 || fr.t > t1) return;
      let m = f2m(fr.f);
      if (o.octaveFree) {
        const cur = exp.filter(function (n) { return fr.t >= n.t0 && fr.t < n.t0 + n.dur; })[0];
        if (cur) { while (m - cur.midi > 6) m -= 12; while (cur.midi - m > 6) m += 12; }
      }
      if (m < lo - 0.5 || m > hi + 0.5) return;
      pts += '<circle cx="' + x(fr.t).toFixed(1) + '" cy="' + y(m).toFixed(1) + '" r="1.6"/>';
    });
    if (pts) b += '<g fill="currentColor" fill-opacity=".85">' + pts + "</g>";
    events.forEach(function (e) {
      if (e.t < t0 || e.t > t1) return;
      const m = Math.max(lo, Math.min(hi, e.midi));
      b += '<circle cx="' + x(e.t).toFixed(1) + '" cy="' + y(m).toFixed(1) + '" r="3.2" fill="currentColor"/>';
    });
    b += txt(L, H - 4, "Ô: nốt đúng (xanh lá = đạt, đỏ = cao, xanh dương = thấp, xám = thiếu) · chấm: " + (events.length ? "phím bạn bấm" : "cao độ bạn hát hoặc chơi"), { size: 8, op: 0.7 });
    return svg(W, H, "Piano roll so sánh nốt cần chơi với cao độ thực tế của bạn", b);
  }

  /* Dải nhịp gõ: vạch = thời điểm đúng, chấm = lần gõ (xanh lá đúng, xanh dương sớm, đỏ muộn, xám thừa) */
  function tapStrip(o) {
    const exp = o.expected || [], taps = (o.taps || []).slice(), beat = o.beat, start = o.start, beats = o.beats || 8, tol = o.tol;
    const W = 640, H = 70, L = 10, x = function (t) { return L + (t - start + beat * 0.25) / (beat * (beats + 0.5)) * (W - 2 * L); };
    let b = "";
    for (let i = 0; i <= beats; i++) {
      const xx = x(start + i * beat);
      b += '<line x1="' + xx.toFixed(1) + '" x2="' + xx.toFixed(1) + '" y1="10" y2="56" stroke="currentColor" stroke-opacity="' + (i % 4 === 0 ? ".45" : ".15") + '"/>';
      if (i < beats) b += txt(xx + 2, 66, String(i % 4 + 1), { size: 8, op: 0.6 });
    }
    const used = {};
    exp.forEach(function (e) {
      b += '<line x1="' + x(e).toFixed(1) + '" x2="' + x(e).toFixed(1) + '" y1="16" y2="50" stroke="currentColor" stroke-width="2.5"/>';
      let best = -1, bd = 1e9;
      taps.forEach(function (t, i) { const d = Math.abs(t - e); if (!used[i] && d < bd) { bd = d; best = i; } });
      if (best >= 0 && bd <= tol) {
        used[best] = true;
        const d = taps[best] - e, kind = Math.abs(d) < 0.03 ? "ok" : (d < 0 ? "early" : "late");
        b += '<circle cx="' + x(taps[best]).toFixed(1) + '" cy="33" r="5" fill="' + COL[kind] + '"/>';
      }
    });
    taps.forEach(function (t, i) { if (!used[i]) b += '<circle cx="' + x(t).toFixed(1) + '" cy="33" r="4" fill="none" stroke="' + COL.extra + '" stroke-width="2"/>'; });
    return svg(W, H, "Dải thời gian: vạch đen là lúc cần gõ, chấm là lúc bạn gõ; xanh lá đúng, xanh dương sớm, đỏ muộn, vòng xám là gõ thừa", b) +
      '<p class="oz-viz-legend"><span style="color:' + COL.ok + '">●</span> đúng lúc <span style="color:' + COL.early + '">●</span> sớm <span style="color:' + COL.late + '">●</span> muộn <span style="color:' + COL.extra + '">○</span> thừa · vạch đen: lúc cần gõ</p>';
  }

  /* Bàn phím nhỏ tô các nốt vừa nghe; colors: mảng màu tương ứng (tùy chọn) */
  function miniKeys(notes, opt) {
    opt = opt || {};
    if (!notes.length) return "";
    let lo = Math.min.apply(null, notes) - 2, hi = Math.max.apply(null, notes) + 2;
    while ([1, 3, 6, 8, 10].indexOf(((lo % 12) + 12) % 12) >= 0) lo--;
    while ([1, 3, 6, 8, 10].indexOf(((hi % 12) + 12) % 12) >= 0) hi++;
    const KW = 18, KH = 64, BW = 11, BH = 40;
    const set = {}; notes.forEach(function (m, i) { set[m] = (opt.colors && opt.colors[i]) || "#e0b45e"; });
    let x = 0, wb = "", bb = "", lab = "";
    const pos = {};
    for (let m = lo; m <= hi; m++) {
      if ([1, 3, 6, 8, 10].indexOf(((m % 12) + 12) % 12) >= 0) continue;
      pos[m] = x;
      wb += '<rect x="' + (x + 0.5) + '" y="0.5" width="' + KW + '" height="' + KH + '" rx="2" fill="' + (set[m] || "#fff") + '" stroke="#555"/>';
      if (set[m]) lab += txt(x + KW / 2 + 0.5, KH + 11, NV[((m % 12) + 12) % 12], { size: 8, anchor: "middle" });
      x += KW;
    }
    for (let m = lo; m <= hi; m++) {
      if ([1, 3, 6, 8, 10].indexOf(((m % 12) + 12) % 12) < 0 || pos[m - 1] === undefined) continue;
      const bx = pos[m - 1] + KW - BW / 2 + 0.5;
      bb += '<rect x="' + bx.toFixed(1) + '" y="0.5" width="' + BW + '" height="' + BH + '" rx="1.5" fill="' + (set[m] || "#222") + '" stroke="#222"/>';
      if (set[m]) lab += txt(bx + BW / 2, KH + 11, NV[((m % 12) + 12) % 12], { size: 8, anchor: "middle" });
    }
    return svg(x + 1, KH + 14, opt.label || ("Các nốt: " + notes.map(name).join(", ")), wb + bb + lab);
  }

  /* Chép giai điệu: mỗi cột một nốt; ô = nốt đúng, chấm = nốt bạn chép */
  function compareRoll(correct, entered) {
    if (!correct.length) return "";
    const all = correct.concat(entered.filter(function (m) { return m !== undefined; }));
    const lo = Math.min.apply(null, all) - 1, hi = Math.max.apply(null, all) + 1;
    const W = 60 + correct.length * 52, H = (hi - lo + 1) * 11 + 30, L = 44;
    const y = function (m) { return 6 + (hi - m) * 11; };
    let b = "";
    for (let m = lo; m <= hi; m++) if ([0, 2, 4, 5, 7, 9, 11].indexOf(((m % 12) + 12) % 12) >= 0)
      b += '<line x1="' + L + '" x2="' + W + '" y1="' + y(m) + '" y2="' + y(m) + '" stroke="currentColor" stroke-opacity=".08"/>' + txt(L - 4, y(m) + 3, name(m), { size: 7.5, anchor: "end", op: 0.6 });
    correct.forEach(function (m, i) {
      const cx = L + 26 + i * 52, ok = entered[i] === m, c = ok ? COL.ok : COL.high;
      b += '<rect x="' + (cx - 20) + '" y="' + (y(m) - 4.5) + '" width="40" height="9" rx="2" fill="' + c + '" fill-opacity=".22" stroke="' + c + '"/>';
      if (entered[i] !== undefined && !ok) b += '<circle cx="' + cx + '" cy="' + y(entered[i]) + '" r="4" fill="' + COL.high + '"/>' +
        '<line x1="' + cx + '" x2="' + cx + '" y1="' + y(entered[i]) + '" y2="' + y(m) + '" stroke="' + COL.high + '" stroke-dasharray="2 2"/>';
      b += txt(cx, H - 6, String(i + 1), { size: 8, anchor: "middle", op: 0.6 });
    });
    return svg(W, H, "So sánh: ô là nốt đúng (xanh lá nếu bạn chép đúng), chấm đỏ là nốt bạn chép sai", b);
  }

  /* Biểu đồ tiến bộ: độ chính xác theo tuần cho từng kỹ năng (đường nhỏ) */
  function weekKey(iso) {
    const p = iso.split("-").map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    const day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
  }
  function weekly(hist, today, weeks) {
    const out = [], end = weekKey(today);
    const e = new Date(end + "T00:00:00Z");
    for (let i = weeks - 1; i >= 0; i--) { const d = new Date(e); d.setUTCDate(d.getUTCDate() - 7 * i); out.push({ w: d.toISOString().slice(0, 10), n: 0, c: 0 }); }
    const idx = {}; out.forEach(function (o, i) { idx[o.w] = i; });
    Object.keys(hist || {}).forEach(function (day) { const k = idx[weekKey(day)]; if (k !== undefined) { out[k].n += hist[day][0] || 0; out[k].c += hist[day][1] || 0; } });
    return out;
  }
  function spark(points, label) {
    const W = 220, H = 54, L = 4, R = 30;
    const x = function (i) { return L + i / (points.length - 1) * (W - L - R); }, y = function (p) { return 6 + (1 - p) * (H - 18); };
    let line = "", dots = "", last = null, lastX = 0;
    points.forEach(function (p, i) {
      if (!p.n) return;
      const pc = p.c / p.n;
      line += (line ? "L" : "M") + x(i).toFixed(1) + " " + y(pc).toFixed(1);
      dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(pc).toFixed(1) + '" r="2"/>';
      last = pc; lastX = x(i);
    });
    let b = '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0.8) + '" y2="' + y(0.8) + '" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="3 3"/>' + txt(L + 1, y(0.8) - 2, "80%", { size: 6.5, op: 0.5 });
    b += '<path d="' + line + '" fill="none" stroke="#b5832a" stroke-width="2"/><g fill="#b5832a">' + dots + "</g>";
    if (last !== null) b += txt(lastX + 5, y(last) + 3, Math.round(last * 100) + "%", { size: 8.5 });
    return svg(W, H, label, b);
  }
  function trendsHtml(histAll, today, names) {
    const ids = Object.keys(histAll || {}).filter(function (k) { return Object.keys(histAll[k] || {}).length; });
    if (!ids.length) return '<p class="oz-stats">Chưa có dữ liệu. Biểu đồ sẽ xuất hiện sau vài ngày luyện tập.</p>';
    return '<div class="oz-trends-grid">' + ids.map(function (id) {
      const w = weekly(histAll[id], today, 12), total = w.reduce(function (s, p) { return s + p.n; }, 0);
      return '<div class="oz-trend"><b>' + esc(names[id] || id) + '</b><small> · ' + total + " lượt trong 12 tuần</small>" + spark(w, "Độ chính xác theo tuần của kỹ năng " + (names[id] || id)) + "</div>";
    }).join("") + '</div><p class="oz-stats">Mỗi điểm là độ chính xác của một tuần (12 tuần gần nhất); đường nét đứt: mốc 80%.</p>';
  }

  root.OZViz = { pianoRoll: pianoRoll, tapStrip: tapStrip, miniKeys: miniKeys, compareRoll: compareRoll, weekly: weekly, weekKey: weekKey, trendsHtml: trendsHtml, name: name };

  if (typeof document === "undefined" || !document.createElement) return;
  /* Hiện hình phản hồi ngay dưới một phần tử (thường là dòng phản hồi); clear() để xóa */
  function slot(after) {
    let el = after.nextElementSibling;
    if (!el || !el.classList.contains("oz-reveal")) { el = document.createElement("div"); el.className = "oz-reveal"; after.after(el); }
    return el;
  }
  root.OZViz.show = function (after, html) { if (after && html) slot(after).innerHTML = html; };
  root.OZViz.clear = function (after) { const el = after && after.nextElementSibling; if (el && el.classList.contains("oz-reveal")) el.innerHTML = ""; };
  function mountTrends(el) {
    if (!window.OZProgress) return;
    const names = {};
    if (window.OZPlan) OZPlan.SKILLS.forEach(function (s) { names[s[0]] = s[1]; });
    const render = function () { el.innerHTML = trendsHtml(OZProgress.getStore("skillHist", {}), OZProgress.today(), names); };
    if (!el.dataset.ready) { el.dataset.ready = "1"; document.addEventListener("oz:progress", render); }
    render();
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(function () { document.querySelectorAll(".oz-trends").forEach(mountTrends); });
})(typeof window !== "undefined" ? window : this);
