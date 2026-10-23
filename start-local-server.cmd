@echo off
setlocal

cd /d "%~dp0"

if exist ".env" (
    for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
        if not "%%A"=="" set "%%A=%%B"
    )
)

set "NODE_EXE=C:\Users\tom\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

echo Manjanilchi local server
echo URL: http://127.0.0.1:8000/index.html
echo.
echo Keep this window open while using the site.
echo Press Ctrl+C to stop the server.
echo.

"%NODE_EXE%" local-server.js

echo.
pause
