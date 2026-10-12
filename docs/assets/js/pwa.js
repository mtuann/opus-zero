/* Đăng ký service worker để site dùng được như ứng dụng và khi mất mạng. */
(function () {
  "use strict";
  if (!("serviceWorker" in navigator)) return;
  const secure = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const link = document.querySelector('link[rel="manifest"]');
  if (!secure || !link) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register(new URL("sw.js", link.href).href).catch(function () { /* bỏ qua */ });
  });
})();
