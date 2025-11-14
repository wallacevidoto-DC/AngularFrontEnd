New-SelfSignedCertificate -DnsName "localhost","192.168.13.10" -CertStoreLocation "cert:\LocalMachine\My" 
netsh http add sslcert ipport=0.0.0.0:5173 certhash=2CA6C5587AD6181135C7F15C2EF2C7B6E7627089 appid="{12345678-90AB-CDEF-1234-567890ABCDEF}"
netsh http add sslcert ipport=0.0.0.0:4200 certhash=2CA6C5587AD6181135C7F15C2EF2C7B6E7627089 appid="{12345678-1234-1234-1234-123412341234}" 
netsh http add sslcert ipport=0.0.0.0:5000 certhash=2CA6C5587AD6181135C7F15C2EF2C7B6E7627089 appid="{12345678-1234-1234-1234-123412341234}" 





netsh advfirewall firewall add rule name="WSS 5173" dir=in action=allow protocol=TCP localport=5173
netsh advfirewall firewall add rule name="WSS 5173 UDP" dir=in action=allow protocol=UDP localport=5173

