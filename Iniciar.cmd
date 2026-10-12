@echo off
cd /d "%~dp0"
call npm run db:start
if errorlevel 1 goto error
call npm start
:error
pause
