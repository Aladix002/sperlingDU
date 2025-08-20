@echo off
echo 🚀 Spúšťam SperlingDU API a Client...
echo.

echo 📡 Spúšťam API...
start "SperlingDU API" cmd /k "cd /d SperlingDU.API && dotnet run"

echo ⏳ Čakám 3 sekundy...
timeout /t 3 /nobreak >nul

echo 🌐 Spúšťam Client...
start "SperlingDU Client" cmd /k "cd /d SperlingDU.CLIENT && npm run dev"

echo.
echo ✅ Oba projekty sa spúšťajú!
echo 📡 API: http://localhost:5027
echo 🌐 Client: http://localhost:5173
echo.
pause
