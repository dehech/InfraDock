@echo off
REM ----------------------------------------
REM Script de lancement InfraDock
REM ----------------------------------------

echo Starting Docker Desktop...
START "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

REM Attend 10 secondes pour que Docker démarre
timeout /t 10 /nobreak

echo Starting Backend...
START "Backend - InfraDock" /D "D:\Documents\projets\InfraDock\backend" cmd /k "node app.js"

echo Starting Frontend...
START "Frontend - InfraDock" /D "D:\Documents\projets\InfraDock\frontend" cmd /k "npm start"

echo InfraDock launch script finished.
pause
