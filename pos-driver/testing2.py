import socket
import binascii

s = socket.socket()
# print("Bind:")
# s.bind(('', 0))
# s.connect(("192.168.0.10", 8888))
s.connect(("192.168.34.21", 8888))
s.settimeout(30)
s.setblocking(True)

e = "\x05".encode()
print(">"+e.hex())
s.send(e)
while True:
    r = s.recv(1)
    if len(r) == 0:
        break
    print("<"+r.hex())

print("---")
