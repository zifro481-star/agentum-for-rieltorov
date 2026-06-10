#!/usr/bin/env bash
# Запуск облегчённой Маняши (API на порту 8001)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANYASHA_DIR="${MANYASHA_DIR:-$HOME/Downloads/manyasha-main}"
PROMPT_FILE="$PROJECT_DIR/prompts/manyasha-prompt.txt"

if [ ! -f "$MANYASHA_DIR/run_lite.sh" ]; then
  echo "Не найден $MANYASHA_DIR/run_lite.sh"
  echo "Укажите путь: MANYASHA_DIR=/path/to/manyasha-main $0"
  exit 1
fi

if [ -f "$PROMPT_FILE" ]; then
  export MANYASHA_PROMPT_FILE="$PROMPT_FILE"
fi

cd "$MANYASHA_DIR"
exec ./run_lite.sh
