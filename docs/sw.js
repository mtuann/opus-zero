/* Service worker: cho phép mở lại các trang đã xem và dùng công cụ luyện tập khi không có mạng.
   Khi sửa nhiều JS/CSS, tăng V ở đây VÀ trong docs/assets/js/loader.js (hai số phải khớp nhau). */
const V = 11;
const VERSION = "opus-zero-v" + V;
/* Khung ứng dụng lưu sẵn ngay từ lần thăm đầu: trang chủ, bộ tải và abcjs đi kèm trong repo */
const PRECACHE = ["./", "assets/js/loader.js", "assets/js/vendor/abcjs-basic-min.js?v=" + V];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isPage(req) {
  return req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;

  if (isPage(req)) {
    /* Trang: ưu tiên bản mới từ mạng, mất mạng thì dùng bản đã lưu */
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./")))
    );
    return;
  }

  /* Tài nguyên (CSS, JS, font, âm thanh): dùng bản đã lưu ngay, cập nhật ngầm */
  event.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(req).then((hit) => {
        const update = fetch(req)
          .then((res) => {
            if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || update;
      })
    )
  );
});
