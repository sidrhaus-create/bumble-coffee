#!/bin/bash
# Bumble Coffee — локальный запуск (macOS): двойной клик по этому файлу.
cd "$(dirname "$0")"
PORT=5173
( sleep 1; open "http://localhost:$PORT/index.html" ) &
echo "Сайт: http://localhost:$PORT/index.html   (Ctrl+C — остановить)"
python3 -m http.server $PORT
