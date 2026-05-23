#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
NODE_DIR="$DIR/.tools/node-v22.15.1-darwin-arm64"

if [ ! -x "$NODE_DIR/bin/npm" ]; then
  echo "Node.js не найден. Установите Node.js: https://nodejs.org"
  echo "Или запустите: curl -fsSL https://nodejs.org/dist/v22.15.1/node-v22.15.1-darwin-arm64.tar.gz | tar -xz -C .tools"
  exit 1
fi

export PATH="$NODE_DIR/bin:$PATH"
cd "$DIR"

if [ ! -d "node_modules" ]; then
  echo "Устанавливаю зависимости..."
  npm install
fi

echo "Останавливаю старый сервер..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "Очищаю кэш сборки..."
rm -rf .next

echo "Запускаю сервер на http://localhost:3000"
npm run dev
