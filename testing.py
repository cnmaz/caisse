import socket
import time

s=socket.socket()
s.connect(('192.168.34.21',8888))
e = "CZ0040300CJ012247300123456CA00201CB0042500CD0010CE003978".encode()
print("→"+str(e))
print(" "+e.hex())
s.send(e)
while True:
    r = s.recv(256)
    print("←"+str(r))
    print(" "+r.hex())
    if len(r)==0:
        break
s.close()
time.sleep(2)
