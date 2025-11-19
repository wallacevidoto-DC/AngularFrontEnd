@echo off
:: ============================================
::    FORCE RUN AS ADMIN
:: ============================================
>nul 2>&1 net session
if %errorLevel% neq 0 (
    echo.
    echo [!] Este script precisa ser executado como ADMINISTRADOR.
    echo     Reiniciando com privilegios de Administrador...
    echo.
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title Configurando HTTPS, SSL, URLACL e Firewall

echo ===============================================
echo        OBTENDO IP LOCAL DA MAQUINA
echo ===============================================
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /R /C:"IPv4"') do (
    set TMP=%%A
)
set IP=%TMP: =%
echo IP Detectado: %IP%
echo.

set DNS1=localhost
set DNS2=%IP%
set PORTA1=5173
set PORTA2=5000
pause
echo ===============================================
echo        CRIANDO CERTIFICADO SELF-SIGNED
echo ===============================================
for /f "tokens=2 delims==" %%i in ('powershell -command ^
    "(New-SelfSignedCertificate -DnsName '%DNS1%','%DNS2%' -CertStoreLocation 'cert:\LocalMachine\My').Thumbprint"') do (
    set THUMB=%%i
)

echo Certificado criado com Thumbprint: %THUMB%
echo.
pause
echo ===============================================
echo        REMOVENDO SSL BINDINGS ANTIGOS
echo ===============================================
netsh http delete sslcert ipport=0.0.0.0:%PORTA1% >nul 2>&1
netsh http delete sslcert ipport=0.0.0.0:%PORTA2% >nul 2>&1
echo Feito.
echo.
pause
echo ===============================================
echo        CRIANDO NOVOS SSL BINDINGS
echo ===============================================
set APPID1={11111111-1111-1111-1111-111111111111}
set APPID2={22222222-2222-2222-2222-222222222222}

netsh http add sslcert ipport=0.0.0.0:%PORTA1% certhash=%THUMB% appid=%APPID1%
netsh http add sslcert ipport=0.0.0.0:%PORTA2% certhash=%THUMB% appid=%APPID2%
echo SSL Bind OK.
echo.
pause
echo ===============================================
echo        REMOVENDO URLACL ANTIGOS
echo ===============================================
netsh http delete urlacl url=http://+:%PORTA1%/ >nul 2>&1
netsh http delete urlacl url=http://+:%PORTA2%/ >nul 2>&1
netsh http delete urlacl url=https://+:%PORTA1%/ >nul 2>&1
netsh http delete urlacl url=https://+:%PORTA2%/ >nul 2>&1
echo Feito.
echo.
pause
echo ===============================================
echo        ADICIONANDO NOVOS URLACL
echo ===============================================
netsh http add urlacl url=http://+:%PORTA1%/ user=Everyone
netsh http add urlacl url=http://+:%PORTA2%/ user=Everyone
netsh http add urlacl url=https://+:%PORTA1%/ user=Everyone
netsh http add urlacl url=https://+:%PORTA2%/ user=Everyone
echo URLACL OK.
echo.
pause
echo ===============================================
echo        REGRAS DE FIREWALL
echo ===============================================
netsh advfirewall firewall add rule name="WSS %PORTA1% TCP" dir=in action=allow protocol=TCP localport=%PORTA1%
netsh advfirewall firewall add rule name="WSS %PORTA1% UDP" dir=in action=allow protocol=UDP localport=%PORTA1%

netsh advfirewall firewall add rule name="WSS %PORTA2% TCP" dir=in action=allow protocol=TCP localport=%PORTA2%
netsh advfirewall firewall add rule name="WSS %PORTA2% UDP" dir=in action=allow protocol=UDP localport=%PORTA2%
echo Firewall OK.
echo.
pause
echo ===============================================
echo       CONFIGURACAO FINALIZADA COM SUCESSO
echo ===============================================
echo IP usado: %IP%
echo Certificado Thumbprint: %THUMB%
echo Portas configuradas: %PORTA1% e %PORTA2%
echo HTTPS e WSS prontos para uso!
echo.
pause
