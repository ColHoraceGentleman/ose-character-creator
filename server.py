"""Simple HTTP server for OSE Character Creator."""

import io
import json
import os
import sys
import uuid
import zipfile
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from src.generator import generate_character

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
UI_DIR = os.path.join(os.path.dirname(__file__), "ui")
os.makedirs(OUTPUT_DIR, exist_ok=True)


class OSEHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=UI_DIR, **kwargs)

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

    def do_GET(self):
        parsed = urlparse(self.path)

        # Serve generated PDF for download
        if parsed.path.startswith("/download/"):
            filename = os.path.basename(parsed.path)
            filepath = os.path.join(OUTPUT_DIR, filename)
            if os.path.exists(filepath):
                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
                self.send_header("Access-Control-Allow-Origin", "*")
                with open(filepath, "rb") as f:
                    content = f.read()
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "File not found")
            return

        # Serve static UI files
        super().do_GET()

    def do_POST(self):
        if self.path == "/generate":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                options = json.loads(body)
            except json.JSONDecodeError:
                self.send_error(400, "Invalid JSON")
                return

            try:
                from src.pdf_output import fill_character_sheet
                num_characters = max(1, min(10, int(options.get("num_characters", 1))))

                characters = []
                pdf_filenames = []

                for i in range(num_characters):
                    character = generate_character(options)
                    filename = f"character_{uuid.uuid4().hex[:8]}.pdf"
                    output_path = os.path.join(OUTPUT_DIR, filename)
                    fill_character_sheet(character, output_path)
                    characters.append(character)
                    pdf_filenames.append(filename)

                if num_characters == 1:
                    response = {
                        "success": True,
                        "character": characters[0],
                        "pdf_url": f"/download/{pdf_filenames[0]}",
                        "num_characters": 1,
                    }
                else:
                    # Build a zip of all PDFs
                    zip_filename = f"party_{uuid.uuid4().hex[:8]}.zip"
                    zip_path = os.path.join(OUTPUT_DIR, zip_filename)
                    with zipfile.ZipFile(zip_path, "w") as zf:
                        for i, fname in enumerate(pdf_filenames, start=1):
                            fpath = os.path.join(OUTPUT_DIR, fname)
                            char_class = characters[i-1].get("character_class", "character")
                            zf.write(fpath, f"character_{i}_{char_class}.pdf")
                    response = {
                        "success": True,
                        "character": characters[0],  # show first for preview
                        "characters": characters,
                        "pdf_url": f"/download/{pdf_filenames[0]}",
                        "zip_url": f"/download/{zip_filename}",
                        "num_characters": num_characters,
                    }
            except Exception as e:
                import traceback
                response = {"success": False, "error": str(e), "trace": traceback.format_exc()}

            body = json.dumps(response).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_error(404, "Not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = HTTPServer(("localhost", port), OSEHandler)
    print(f"OSE Character Creator running at http://localhost:{port}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
