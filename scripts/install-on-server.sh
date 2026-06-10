#!/usr/bin/env bash
# Установка на VPS через веб-консоль хостинга (без SSH с вашего Mac).
# Запуск на сервере: bash install-on-server.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/agentum-realtors}"
REPO_URL="${REPO_URL:-https://github.com/zifro481-star/agentum-for-rieltorov.git}"
BRANCH="${BRANCH:-main}"

echo "==> Обновление системы и установка зависимостей"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ca-certificates curl git nginx openssl

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

systemctl enable docker nginx
systemctl start docker nginx

echo "==> Клонирование / обновление проекта"
mkdir -p "$(dirname "$APP_DIR")"
if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" fetch origin
  git -C "$APP_DIR" reset --hard "origin/${BRANCH}"
else
  rm -rf "$APP_DIR"
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

mkdir -p "$APP_DIR/data"

echo "==> .env.production"
if [[ ! -f "$APP_DIR/.env.production" ]]; then
  ADMIN_PASS="$(openssl rand -hex 8)"
  SESSION_SECRET="$(openssl rand -hex 24)"
  cat >"$APP_DIR/.env.production" <<EOF
ADMIN_PASSWORD=${ADMIN_PASS}
ADMIN_SESSION_SECRET=${SESSION_SECRET}

NEXT_PUBLIC_MANYASHA_ENABLED=true
NEXT_PUBLIC_MANYASHA_START_OPEN=false
MANYASHA_LLM_PROVIDER=auto
MANYASHA_LLM_TIMEOUT_SECONDS=12
GEMINI_API_KEY=${GEMINI_API_KEY:-}
GEMINI_MODEL=gemini-2.5-flash-lite
EOF
  echo "Создан .env.production. Пароль админки: ${ADMIN_PASS}"
  echo "Сохраните его — он больше не будет показан."
fi

echo "==> Nginx (только HTTP, без редиректа на HTTPS)"
cat >/etc/nginx/sites-available/agentum-realtors <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/agentum-realtors /etc/nginx/sites-enabled/agentum-realtors

# Убираем глобальный редирект на HTTPS (если был у другого сайта)
if grep -q 'return 301 https' /etc/nginx/nginx.conf 2>/dev/null; then
  sed -i.bak 's/return 301 https/# disabled return 301 https/' /etc/nginx/nginx.conf || true
fi

nginx -t
systemctl reload nginx

echo "==> Docker"
cd "$APP_DIR"
docker compose down 2>/dev/null || true
docker compose build
docker compose up -d

echo ""
echo "Готово."
echo "Сайт: http://$(curl -fsS ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
echo "Админка: /admin"
echo "Маняша: /api/manyasha/health"
docker compose ps
