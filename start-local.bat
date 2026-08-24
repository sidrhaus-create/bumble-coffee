@echo off
REM Bumble Coffee - локальный запуск (Windows): двойной клик по этому файлу.
cd /d "%~dp0"
set PORT=5173
start "" "http://localhost:%PORT%/index.html"
echo Сайт: http://localhost:%PORT%/index.html   (Ctrl+C - остановить)
python -m http.server %PORT%
