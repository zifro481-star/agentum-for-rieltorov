#!/usr/bin/env bash
# Деплой лендинга на VPS: bash scripts/deploy.sh
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-72.56.38.62}"
SERVER_USER="${SERVER_USER:-root}"
SSH_TARGET="${SERVER_USER}@${SERVER_HOST}"
APP_DIR="${APP_DIR:-/var/www/agentum-realtors}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SSH_IDENTITY="${SSH_IDENTITY:-$HOME/.ssh/id_ed25519}"
SSH_OPTS=(-i "$SSH_IDENTITY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new)

echo "==> Проверка SSH: ${SSH_TARGET}"
if ! ssh "${SSH_OPTS[@]}" -o BatchMode=yes "$SSH_TARGET" "echo ok" >/dev/null 2>&1; then
  echo ""
  echo "Не удалось подключиться по SSH."
  echo "Добавьте ваш публичный ключ на сервер (панель VPS → SSH-ключи) или выполните:"
  echo "  ssh-copy-id ${SSH_TARGET}"
  echo ""
  echo "Ваш публичный ключ:"
  cat "${HOME}/.ssh/id_ed25519.pub" 2>/dev/null || cat "${HOME}/.ssh/id_rsa.pub" 2>/dev/null || echo "(ключ не найден)"
  exit 1
fi

echo "==> Подготовка сервера"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" bash -s <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ca-certificates curl git nginx rsync

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

systemctl enable docker nginx
systemctl start docker nginx
mkdir -p /var/www/agentum-realtors/data
REMOTE

echo "==> Загрузка файлов проекта"
rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .env.local \
  --exclude data/leads.json \
  --exclude .venv-rembg \
  --exclude .node \
  --exclude .cursor \
  -e "ssh ${SSH_OPTS[*]}" \
  "$PROJECT_DIR/" "${SSH_TARGET}:${APP_DIR}/"

echo "==> Настройка .env.production"
if [[ -f "$PROJECT_DIR/.env.local" ]]; then
  scp "${SSH_OPTS[@]}" "$PROJECT_DIR/.env.local" "${SSH_TARGET}:${APP_DIR}/.env.production"
else
  ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "test -f ${APP_DIR}/.env.production" || {
    echo "Создайте .env.local локально или .env.production на сервере"
    exit 1
  }
fi

echo "==> Nginx"
scp "${SSH_OPTS[@]}" "$PROJECT_DIR/deploy/nginx.conf" "${SSH_TARGET}:/etc/nginx/sites-available/agentum-realtors"
scp "${SSH_OPTS[@]}" "$PROJECT_DIR/deploy/nginx-proxy-snippet.conf" "${SSH_TARGET}:/etc/nginx/snippets/agentum-proxy.conf"
scp "${SSH_OPTS[@]}" "$PROJECT_DIR/deploy/nginx-ssl-site-snippet.conf" "${SSH_TARGET}:/etc/nginx/snippets/agentum-ssl-site.conf"
scp "${SSH_OPTS[@]}" "$PROJECT_DIR/deploy/nginx-limits.conf" "${SSH_TARGET}:/etc/nginx/conf.d/agentum-limits.conf"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" bash -s <<'REMOTE'
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/agentum-realtors /etc/nginx/sites-enabled/agentum-realtors
if [[ -f /var/www/agentum-realtors/scripts/fix-ssl-chain.sh ]]; then
  bash /var/www/agentum-realtors/scripts/fix-ssl-chain.sh
fi
nginx -t
systemctl reload nginx
REMOTE

echo "==> Сборка и запуск Docker"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail
cd ${APP_DIR}
find public -type f -exec chmod 644 {} \;
find public -type d -exec chmod 755 {} \;
docker compose down 2>/dev/null || true
docker compose build --pull
docker compose up -d
docker compose ps
REMOTE

echo ""
echo "Готово: http://${SERVER_HOST}"
echo "Админка: http://${SERVER_HOST}/admin"
echo "Проверка Маняши: http://${SERVER_HOST}/api/manyasha/health"
