#!/usr/bin/env bash
# Полная установка через веб-консоль VPS (Timeweb → Консоль).
# Скопируйте и вставьте целиком в консоль сервера kvmhi-171.
set -euo pipefail

export GEMINI_API_KEY="${GEMINI_API_KEY:-AQ.Ab8RN6LWxD8JQ4NmcDh13gHH7t5roVA6JFLzd3C1u7OHXUbohQ}"
export SSH_PUBLIC_KEY="${SSH_PUBLIC_KEY:-ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAou0IFrKKibWZ9miRXFOfsVmib9oRXqPc4yieGe0EXK zifro481-star@github}"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"
export ADMIN_SESSION_SECRET="${ADMIN_SESSION_SECRET:-change-me-to-random-string}"

curl -fsSL https://raw.githubusercontent.com/zifro481-star/agentum-for-rieltorov/main/scripts/install-on-server.sh | bash
