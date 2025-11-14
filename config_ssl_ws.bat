@echo off
echo ================================
echo  CONFIGURANDO HTTPS PARA O SERVIDOR
echo ================================
echo.

REM --- Criar certificado HTTPS de desenvolvimento ---
echo Criando certificado HTTPS...
dotnet dev-certs https --trust

echo Obtendo hash do certificado...
for /f "tokens=2 delims= " %%A in ('certutil -store My ^| findstr /C:"Cert Hash"') do (
    set CERTHASH=%%A
)

if "%CERTHASH%"=="" (
    echo ERRO: Nao foi possivel obter o Cert Hash!
    pause
    exit /b
)

echo Certificado encontrado com hash: %CERTHASH%
echo.

REM --- Criar GUID para registro SSL ---
set APPID_PRODUCAO={f1a0f0c1-1111-4444-9999-aaaaaaaa0001}
set APPID_DEV={f1a0f0c1-2222-4444-9999-aaaaaaaa0002}

echo Limpando registros antigos...
netsh http delete sslcert ipport=0.0.0.0:5000 >nul 2>&1
netsh http delete sslcert ipport=0.0.0.0:5173 >nul 2>&1
netsh http delete urlacl url=https://+:5000/ >nul 2>&1
netsh http delete urlacl url=https://+:5173/ >nul 2>&1
echo OK.
echo.

REM ============================================
echo REGISTRANDO HTTPS NA PORTA 5000 (PRODUCAO)
REM ============================================
netsh http add urlacl url=https://+:5000/ user=Everyone
netsh http add sslcert ipport=0.0.0.0:5000 certhash=%CERTHASH% appid=%APPID_PRODUCAO%

echo.

REM ============================================
echo REGISTRANDO HTTPS NA PORTA 5173 (DESENVOLVIMENTO / WEBSOCKET)
REM ============================================
netsh http add urlacl url=https://+:5173/ user=Everyone
netsh http add sslcert ipport=0.0.0.0:5173 certhash=%CERTHASH% appid=%APPID_DEV%

echo.
echo ============================================
echo  🔒 HTTPS CONFIGURADO COM SUCESSO!
echo ============================================
echo Porta produção : 5000 (https://localhost:5000)
echo Porta dev/ws  : 5173 (https://localhost:5173)
echo.
pause
