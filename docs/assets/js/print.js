/* Nút "In bài này" cho các trang bài học: mở mọi đáp án đang thu gọn, vẽ hết khuông nhạc rồi in. */
(function () {
  "use strict";
  function init() {
    if (!/\/nhac-ly\/\d{2}-|\/nhac-ly\/on-tap-|\/bat-dau\/tom-tat\//.test(location.pathname)) return;
    const h1 = document.querySelector("article h1");
    if (!h1 || document.querySelector(".oz-print-btn")) return;
    const b = document.createElement("button");
    b.className = "oz-btn oz-print-btn";
    b.textContent = "In bài này";
    b.addEventListener("click", function () {
      const closed = Array.prototype.filter.call(document.querySelectorAll("article details"), function (d) { return !d.open; });
      closed.forEach(function (d) { d.open = true; });
      /* Vẽ mọi khuông và công cụ còn chờ tới gần màn hình rồi mới in */
      (window.OZLoader && window.OZLoader.all ? window.OZLoader.all() : Promise.resolve()).then(function () {
        window.print();
        setTimeout(function () { closed.forEach(function (d) { d.open = false; }); }, 500);
      });
    });
    h1.after(b);
  }
  (window.OZReady || function (f) { document.addEventListener("DOMContentLoaded", f); })(init);
})();
