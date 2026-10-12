/* Kết nối đàn phím MIDI (Web MIDI API: Chrome, Edge, Opera; không có trên Safari/iOS).
   Phát sự kiện {type: "on"|"off", midi, vel, t} cho mọi công cụ đang lắng nghe. */
(function () {
  "use strict";
  const subs = [];
  let access = null, connecting = null, echo = true;
  const statusSubs = [];
  const KEY = "opus-zero:midi-auto";

  function supported() { return !!(navigator.requestMIDIAccess); }
  function inputs() { const a = []; if (access) access.inputs.forEach(function (i) { a.push(i); }); return a; }
  function status() {
    if (!supported()) return { state: "unsupported", text: "Trình duyệt này không hỗ trợ MIDI. Hãy dùng Chrome hoặc Edge trên máy tính." };
    if (!access) return { state: "off", text: "Chưa kết nối đàn MIDI." };
    const ins = inputs();
    return ins.length ? { state: "on", text: "Đã kết nối: " + ins.map(function (i) { return i.name; }).join(", ") + "." } : { state: "none", text: "Đã cho phép MIDI nhưng chưa thấy đàn nào. Cắm đàn qua USB rồi bật lại." };
  }
  function emit(ev) { subs.slice().forEach(function (f) { try { f(ev); } catch (e) { /* bỏ qua lỗi của từng công cụ */ } }); }
  function handle(msg) {
    const d = msg.data, cmd = d[0] & 0xf0, note = d[1], vel = d[2];
    const t = window.OZAudio && OZAudio.getCtx() ? OZAudio.getCtx().currentTime : performance.now() / 1000;
    if (cmd === 0x90 && vel > 0) {
      if (echo && window.OZAudio) OZAudio.playNote(note, undefined, 0.9, 0.12 + vel / 127 * 0.18);
      emit({ type: "on", midi: note, vel: vel, t: t });
    } else if (cmd === 0x80 || (cmd === 0x90 && vel === 0)) emit({ type: "off", midi: note, vel: 0, t: t });
  }
  function bind() { inputs().forEach(function (i) { i.onmidimessage = handle; }); statusSubs.forEach(function (f) { f(status()); }); }
  function connect() {
    if (!supported()) return Promise.reject(new Error("unsupported"));
    if (access) { bind(); return Promise.resolve(access); }
    if (connecting) return connecting;
    connecting = navigator.requestMIDIAccess().then(function (a) {
      access = a; a.onstatechange = bind; bind();
      try { localStorage.setItem(KEY, "1"); } catch (e) { /* bỏ qua */ }
      return a;
    }).catch(function (e) { connecting = null; throw e; });
    return connecting;
  }
  function on(f) { subs.push(f); return function () { const i = subs.indexOf(f); if (i >= 0) subs.splice(i, 1); }; }
  function onStatus(f) { statusSubs.push(f); }

  /* Ô trạng thái MIDI: .oz-midi-status */
  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    root.classList.add("oz-midi-box");
    root.innerHTML = '<button class="oz-btn" data-act="connect">Kết nối đàn MIDI</button> <label class="oz-stats"><input type="checkbox" data-k="echo" checked> Phát âm thanh khi bấm phím</label> <span class="oz-stats oz-midi-text"></span>';
    const txt = root.querySelector(".oz-midi-text");
    const show = function (s) { txt.textContent = s.text; root.dataset.state = s.state; };
    onStatus(show); show(status());
    root.querySelector('[data-k="echo"]').addEventListener("change", function (e) { echo = e.target.checked; });
    root.querySelector('[data-act="connect"]').addEventListener("click", function () {
      connect().catch(function () { show({ state: "off", text: supported() ? "Không được cấp quyền MIDI. Hãy cho phép trong cài đặt trình duyệt." : status().text }); });
    });
    /* Đã từng cho phép: tự kết nối lại khi mở trang */
    try { if (localStorage.getItem(KEY) === "1" && supported()) connect().catch(function () {}); } catch (e) { /* bỏ qua */ }
  }
  function init() { document.querySelectorAll(".oz-midi-status").forEach(mount); }
  window.OZMidi = { supported: supported, connect: connect, on: on, onStatus: onStatus, status: status, _emit: emit };
  if (window.document$) window.document$.subscribe(init); else document.addEventListener("DOMContentLoaded", init);
})();
