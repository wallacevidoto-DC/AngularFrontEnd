@echo off
setlocal enabledelayedexpansion

:: ============================================================
::               EXIGIR ADMINISTRADOR
:: ============================================================
>nul 2>&1 net session
if %errorLevel% neq 0 (
    echo.
    echo [!] Este script precisa ser executado como ADMINISTRADOR.
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title Configurando HTTPS, SSL, URLACL e Firewall

set PORTA1=5173
set PORTA2=5000

echo ===============================================
echo      OBTENDO IP LOCAL
echo ===============================================
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /R /C:"IPv4"') do set TMP=%%A
set IP=%TMP: =%
echo IP Detectado: %IP%
echo.

:: ============================================================
::                GERAR CERTIFICADO
:: ============================================================
echo ===============================================
echo   CRIANDO CERTIFICADO SELF-SIGNED
echo ===============================================

for /f %%A in ('powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "(New-SelfSignedCertificate -DnsName 'localhost','%IP%' -CertStoreLocation 'cert:\LocalMachine\My').Thumbprint"') do (
    set THUMB=%%A
)

echo Thumbprint do Certificado: %THUMB%
echo.

:: ============================================================
::       REMOVER SSL BINDINGS ANTIGOS
:: ============================================================
echo Removendo SSL Bindings anteriores...
netsh http delete sslcert ipport=0.0.0.0:%PORTA1% >nul 2>&1
netsh http delete sslcert ipport=0.0.0.0:%PORTA2% >nul 2>&1
echo OK.
echo.

:: ============================================================
::            CRIAR NOVOS SSL BINDINGS
:: ============================================================
echo Criando SSL Bind para %PORTA1% e %PORTA2%...

set APPID1={11111111-1111-1111-1111-111111111111}
set APPID2={22222222-2222-2222-2222-222222222222}

netsh http add sslcert ipport=0.0.0.0:%PORTA1% certhash=%THUMB% appid=%APPID1%
netsh http add sslcert ipport=0.0.0.0:%PORTA2% certhash=%THUMB% appid=%APPID2%
echo OK.
echo.

:: ============================================================
::       REMOVER URLACL ANTIGOS
:: ============================================================
echo Removendo URLACL antigos...
netsh http delete urlacl url=http://+:%PORTA1%/ >nul 2>&1
netsh http delete urlacl url=http://+:%PORTA2%/ >nul 2>&1
netsh http delete urlacl url=https://+:%PORTA1%/ >nul 2>&1
netsh http delete urlacl url=https://+:%PORTA2%/ >nul 2>&1
echo OK.
echo.

:: ============================================================
::         ADICIONAR NOVOS URLACL COM SDDL
:: ============================================================
echo Criando novos URLACL...

set SDDL=D:(A;;GX;;;BU)

netsh http add urlacl url=http://+:%PORTA1%/ sddl=%SDDL%
netsh http add urlacl url=http://+:%PORTA2%/ sddl=%SDDL%
netsh http add urlacl url=https://+:%PORTA1%/ sddl=%SDDL%
netsh http add urlacl url=https://+:%PORTA2%/ sddl=%SDDL%
echo OK.
echo.

:: ============================================================
::             FIREWALL
:: ============================================================
echo Criando regras de Firewall...

netsh advfirewall firewall add rule name="DEV_PORT_%PORTA1%" dir=in action=allow protocol=TCP localport=%PORTA1%
netsh advfirewall firewall add rule name="DEV_PORT_%PORTA2%" dir=in action=allow protocol=TCP localport=%PORTA2%
echo OK.
echo.

echo ===============================================
echo   CONFIGURAÇÃO FINALIZADA COM SUCESSO!
echo ===============================================
echo IP: %IP%
echo Thumbprint: %THUMB%
echo Portas: %PORTA1% e %PORTA2%
echo HTTPS e WSS prontos!
pause
