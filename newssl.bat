@echo off
title Configurando HTTPS + Firewall
echo ===============================================
echo      CRIANDO CERTIFICADO SELF-SIGNED
echo ===============================================

set DNS1=localhost
set DNS2=192.168.13.10
set PORTA1=5173
set PORTA2=5000

echo Criando certificado para %DNS1% e %DNS2%...
for /f "tokens=2 delims==" %%i in ('powershell -command ^
    "(New-SelfSignedCertificate -DnsName '%DNS1%','%DNS2%' -CertStoreLocation 'cert:\LocalMachine\My').Thumbprint"') do (
    set THUMB=%%i
)

echo Thumbprint encontrado: %THUMB%

echo.
echo ===============================================
echo      REMOVENDO SSL ANTIGOS (se existirem)
echo ===============================================

netsh http delete sslcert ipport=0.0.0.0:%PORTA1% >nul 2>&1
netsh http delete sslcert ipport=0.0.0.0:%PORTA2% >nul 2>&1

echo Feito.

echo.
echo ===============================================
echo      ADICIONANDO NOVOS SSL BINDINGS
echo ===============================================

set APPID1={12345678-90AB-CDEF-1234-567890ABCDEF}
set APPID2={12345678-1234-1234-1234-123412341234}

echo Vinculando certificado à porta %PORTA1%...
netsh http add sslcert ipport=0.0.0.0:%PORTA1% certhash=%THUMB% appid=%APPID1%

echo Vinculando certificado à porta %PORTA2%...
netsh http add sslcert ipport=0.0.0.0:%PORTA2% certhash=%THUMB% appid=%APPID2%

echo.
echo ===============================================
echo      CONFIGURANDO FIREWALL (TCP/UDP)
echo ===============================================

echo Criando regras para porta %PORTA1%...
netsh advfirewall firewall add rule name="WSS %PORTA1% TCP" dir=in action=allow protocol=TCP localport=%PORTA1%
netsh advfirewall firewall add rule name="WSS %PORTA1% UDP" dir=in action=allow protocol=UDP localport=%PORTA1%

echo Criando regras para porta %PORTA2%...
netsh advfirewall firewall add rule name="WSS %PORTA2% TCP" dir=in action=allow protocol=TCP localport=%PORTA2%
netsh advfirewall firewall add rule name="WSS %PORTA2% UDP" dir=in action=allow protocol=UDP localport=%PORTA2%

echo.
echo ===============================================
echo          CONFIGURAÇÃO FINALIZADA!
echo ===============================================
echo Certificado: %THUMB%
echo Portas configuradas: %PORTA1% e %PORTA2%
echo Firewall liberado: TCP e UDP
echo.
pause
