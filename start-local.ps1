Set-Location -LiteralPath $PSScriptRoot
Write-Host 'Mo trang web tai http://127.0.0.1:5173 - Nhan Ctrl+C de dung.'
python -u -m http.server 5173 --bind 127.0.0.1
