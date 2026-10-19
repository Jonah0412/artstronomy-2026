#!/usr/bin/env python3
"""Local-only preview. Run from anywhere; never serves the wrong working folder."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


def main():
    site = Path(__file__).resolve().parent / 'site'
    if not (site / 'index.html').is_file():
        raise SystemExit('Extract the whole preview ZIP first. The site/index.html file is missing.')

    class Handler(SimpleHTTPRequestHandler):
        extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                          '.wasm': 'application/wasm', '.js': 'text/javascript',
                          '.mjs': 'text/javascript', '.webp': 'image/webp'}
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store')
            super().end_headers()

    handler = partial(Handler, directory=str(site))
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 4173), handler)
    except OSError:
        # An old preview can keep port 4173 occupied; do not reuse its wrong root.
        server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    url = f'http://127.0.0.1:{server.server_port}/'
    print(f'ARTStronomy Observatory P0 — unpublished preview\n{url}\nKeep this window open. Control-C stops the preview.', flush=True)
    timer = threading.Timer(.5, lambda: webbrowser.open(url))
    timer.daemon = True
    timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nPreview stopped. Your public website has not changed.')
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
