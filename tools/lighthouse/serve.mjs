// Máy chủ tĩnh để đo Lighthouse trên máy: phục vụ site/ dưới /opus-zero/ như GitHub Pages, qua HTTP/2 (TLS tự ký),
// nén gzip, Cache-Control: max-age=600. GitHub Pages dùng HTTP/2; đo qua HTTP/1.1 (npx serve, python3 -m http.server)
// làm Lighthouse tính sai: mọi file cùng nguồn phải chen nhau qua 6 kết nối (xem plans/v15-do-luong.md).
//   node tools/lighthouse/serve.mjs [thư mục site, mặc định site] [cổng, mặc định 8443]
// Chứng chỉ tự ký được tạo bằng openssl trong thư mục tạm; Chrome cần cờ --ignore-certificate-errors (measure.mjs đã thêm).
import http2 from "node:http2";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(process.argv[2] || "site");
const PORT = Number(process.argv[3] || 8443);
const PREFIX = "/opus-zero/";
const TLS = path.join(os.tmpdir(), "opus-zero-lighthouse");
if (!fs.existsSync(path.join(TLS, "cert.pem"))) {
  fs.mkdirSync(TLS, { recursive: true });
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "30", "-subj", "/CN=localhost",
    "-keyout", path.join(TLS, "key.pem"), "-out", path.join(TLS, "cert.pem")], { stdio: "ignore" });
}
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };
const TEXT = /^(text\/|application\/(json|javascript|manifest\+json|xml)|image\/svg)/;

http2.createSecureServer({ key: fs.readFileSync(path.join(TLS, "key.pem")), cert: fs.readFileSync(path.join(TLS, "cert.pem")), allowHTTP1: true }, (req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/opus-zero") { res.writeHead(301, { location: PREFIX }); return res.end(); }
  let file = path.join(ROOT, url.slice(PREFIX.length));
  if (!url.startsWith(PREFIX) || !file.startsWith(ROOT)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404, { "content-type": TYPES[".html"] }); return res.end(fs.readFileSync(path.join(ROOT, "404.html"))); }
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  const head = { "content-type": type, "cache-control": "max-age=600" };
  const body = fs.readFileSync(file);
  if (TEXT.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    res.writeHead(200, { ...head, "content-encoding": "gzip", vary: "Accept-Encoding" });
    return res.end(zlib.gzipSync(body, { level: 6 }));
  }
  res.writeHead(200, head);
  res.end(body);
}).listen(PORT, () => console.log(`Phục vụ ${ROOT} tại https://localhost:${PORT}${PREFIX}`));
