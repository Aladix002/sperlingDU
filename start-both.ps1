# PowerShell script na spustenie API aj Client naraz
Write-Host "🚀 Spúšťam SperlingDU API a Client..." -ForegroundColor Green

# Spustenie API v pozadí
Write-Host "📡 Spúšťam API..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'SperlingDU.API'; dotnet run" -WindowStyle Normal

# Počkanie 3 sekundy aby sa API stihol spustiť
Start-Sleep -Seconds 3

# Spustenie Client v pozadí
Write-Host "🌐 Spúšťam Client..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'SperlingDU.CLIENT'; npm run dev" -WindowStyle Normal

Write-Host "✅ Oba projekty sa spúšťajú!" -ForegroundColor Green
Write-Host "📡 API: http://localhost:5027" -ForegroundColor Blue
Write-Host "🌐 Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host "⏸️  Stlačte Enter pre ukončenie..." -ForegroundColor Yellow
Read-Host
