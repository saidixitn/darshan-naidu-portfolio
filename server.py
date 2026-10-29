import http.server
import socketserver
import os
import mimetypes
import re

PORT = 3000
DIRECTORY = "/Users/saidixitnaidu/Downloads/social-media-portfolio"

# Add modern web mime types
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("image/avif", ".avif")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("video/mp4", ".MP4")

ROUTE_ALIASES = {
    "/work": "/darshan-design-portfolio/index.html",
    "/work/": "/darshan-design-portfolio/index.html",
    "/portfolio": "/darshan-design-portfolio/index.html",
    "/portfolio/": "/darshan-design-portfolio/index.html",
    "/darshan-design-portfolio": "/darshan-design-portfolio/index.html",
    "/darshan-design-portfolio/": "/darshan-design-portfolio/index.html",
    "/deztopia-design-portfolio": "/darshan-design-portfolio/index.html",
    "/deztopia-design-portfolio/": "/darshan-design-portfolio/index.html",
    "/about": "/about-darshan/index.html",
    "/about/": "/about-darshan/index.html",
    "/about-me": "/about-darshan/index.html",
    "/about-me/": "/about-darshan/index.html",
    "/about-darshan": "/about-darshan/index.html",
    "/about-darshan/": "/about-darshan/index.html",
    "/about-deztopia": "/about-darshan/index.html",
    "/about-deztopia/": "/about-darshan/index.html",
    "/contact": "/contact-darshan/index.html",
    "/contact/": "/contact-darshan/index.html",
    "/contact-darshan": "/contact-darshan/index.html",
    "/contact-darshan/": "/contact-darshan/index.html",
    "/contact-deztopia": "/contact-darshan/index.html",
    "/contact-deztopia/": "/contact-darshan/index.html",
    "/service": "/service/index.html",
    "/service/": "/service/index.html",
    "/services": "/service/index.html",
    "/services/": "/service/index.html",
    "/for-startups": "/service/index.html",
    "/for-startups/": "/service/index.html",
    "/gsap": "/gsap/index.html",
    "/gsap/": "/gsap/index.html",
    "/celebrations": "/celebrations/index.html",
    "/celebrations/": "/celebrations/index.html",
}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        clean_path = path.split("?")[0]
        if clean_path.startswith("/project/"):
            clean_path = clean_path.replace("/project/", "/projects/")
        if clean_path in ROUTE_ALIASES:
            clean_path = ROUTE_ALIASES[clean_path]
        return super().translate_path(clean_path)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_GET(self):
        full_path = self.translate_path(self.path)
        range_header = self.headers.get("Range")
        if range_header and os.path.isfile(full_path):
            self.handle_range_request(full_path, range_header)
            return

        super().do_GET()

    def handle_range_request(self, file_path, range_header):
        file_size = os.path.getsize(file_path)
        range_match = re.match(r"bytes=(\d+)-(\d*)", range_header)
        if not range_match:
            super().do_GET()
            return

        first_byte = int(range_match.group(1))
        last_byte = int(range_match.group(2)) if range_match.group(2) else file_size - 1
        if first_byte >= file_size or last_byte >= file_size or first_byte > last_byte:
            self.send_error(416, "Requested Range Not Satisfiable")
            return

        content_length = last_byte - first_byte + 1
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = "video/mp4" if file_path.lower().endswith(".mp4") else "application/octet-stream"

        self.send_response(206)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Range", f"bytes {first_byte}-{last_byte}/{file_size}")
        self.send_header("Content-Length", str(content_length))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        with open(file_path, "rb") as f:
            f.seek(first_byte)
            bytes_left = content_length
            while bytes_left > 0:
                chunk = f.read(min(bytes_left, 64 * 1024))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except BrokenPipeError:
                    break
                bytes_left -= len(chunk)

class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with ReusableTCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Darshan Portfolio Server running at http://localhost:{PORT}")
        httpd.serve_forever()
