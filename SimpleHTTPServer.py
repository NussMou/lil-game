import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

HandlerClass = SimpleHTTPRequestHandler
ServerClass = HTTPServer
Protocol = "HTTP/1.0"

if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 8000

server_address = ('127.0.0.1', port)

HandlerClass.protocol_version = Protocol
httpd = ServerClass(server_address, HandlerClass)

sa = httpd.socket.getsockname()
print(f"Serving HTTP on {sa[0]} port {sa[1]}...")
httpd.serve_forever()
