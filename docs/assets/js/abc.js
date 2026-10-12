/* Vẽ các khối ```abc thành khuông nhạc và thêm nút phát âm thanh (abcjs). */
(function () {
  "use strict";

  /* force = true: vẽ lại mọi khuông (khi đổi sáng/tối); ngược lại chỉ vẽ khuông mới */
  function render(force) {
    if (!window.ABCJS) return;
    const fg = getComputedStyle(document.body).getPropertyValue("--md-default-fg-color").trim() || "#000";
    document.querySelectorAll(".abc-notation").forEach(function (el) {
      if (el.dataset.rendered && force !== true) return;
      el.dataset.rendered = "1";
      if (!el.dataset.src) el.dataset.src = el.textContent.trim();
      el.textContent = "";
      const visual = ABCJS.renderAbc(el, el.dataset.src, {
        responsive: "resize",
        foregroundColor: fg,
        paddingleft: 0,
        paddingright: 0,
        add_classes: true
      })[0];

      let audioEl = el.nextElementSibling;
      if (!audioEl || !audioEl.classList.contains("abc-audio")) {
        audioEl = document.createElement("div");
        audioEl.className = "abc-audio";
        el.after(audioEl);
      } else {
        return; /* đã có trình phát, chỉ vẽ lại màu */
      }
      if (ABCJS.synth && ABCJS.synth.supportsAudio()) {
        const ctrl = new ABCJS.synth.SynthController();
        ctrl.load(audioEl, null, { displayPlay: true, displayRestart: true, displayProgress: true });
        ctrl.setTune(visual, false).catch(function () {
          audioEl.textContent = "Không tải được âm thanh. Kiểm tra kết nối mạng rồi tải lại trang.";
        });
      }
    });
  }

  function init() { render(false); }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);

  /* Vẽ lại khi đổi chế độ sáng/tối để màu nốt nhạc khớp nền. */
  new MutationObserver(function () { setTimeout(function () { render(true); }, 50); })
    .observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
})();
