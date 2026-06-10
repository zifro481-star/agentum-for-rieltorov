#!/usr/bin/env python3
"""Деплой на VPS по паролю root (если SSH-ключ ещё не добавлен)."""
from __future__ import annotations

import os
import sys
from pathlib import Path

import paramiko

SERVER_HOST = os.environ.get("SERVER_HOST", "72.56.38.62")
SERVER_USER = os.environ.get("SERVER_USER", "root")
SERVER_PASSWORD = os.environ.get("SERVER_PASSWORD", "")
APP_DIR = os.environ.get("APP_DIR", "/var/www/agentum-realtors")
PROJECT_DIR = Path(__file__).resolve().parent.parent


def run_remote(client: paramiko.SSHClient, script: str) -> None:
    stdin, stdout, stderr = client.exec_command(f"bash -s <<'REMOTE'\n{script}\nREMOTE")
    out = stdout.read().decode()
    err = stderr.read().decode()
    code = stdout.channel.recv_exit_status()
    if out:
        print(out, end="")
    if err:
        print(err, end="", file=sys.stderr)
    if code != 0:
        raise RuntimeError(f"Remote command failed with exit code {code}")


def upload_tree(sftp: paramiko.SFTPClient, local: Path, remote: str) -> None:
    excludes = {
        "node_modules",
        ".next",
        ".git",
        ".env.local",
        "data/leads.json",
        ".venv-rembg",
        ".node",
        ".cursor",
    }

    def should_skip(path: Path) -> bool:
        parts = set(path.parts)
        return bool(parts & excludes) or any(
            part in excludes for part in path.relative_to(local).as_posix().split("/")
        )

    for root, dirs, files in os.walk(local):
        root_path = Path(root)
        dirs[:] = [d for d in dirs if not should_skip(root_path / d)]
        rel = root_path.relative_to(local).as_posix()
        remote_dir = remote if rel == "." else f"{remote}/{rel}"
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            sftp.mkdir(remote_dir)
        for name in files:
            local_file = root_path / name
            if should_skip(local_file):
                continue
            sftp.put(str(local_file), f"{remote_dir}/{name}")


def main() -> int:
    password = SERVER_PASSWORD or (sys.argv[1] if len(sys.argv) > 1 else "")
    if not password:
        print("Укажите пароль: SERVER_PASSWORD=... python3 scripts/deploy-with-password.py", file=sys.stderr)
        return 1

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            SERVER_HOST,
            username=SERVER_USER,
            password=password,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )
    except paramiko.AuthenticationException:
        print("Ошибка: неверный пароль или root недоступен по SSH.", file=sys.stderr)
        return 1

    print(f"==> Подключено к {SERVER_USER}@{SERVER_HOST}")

    run_remote(
        client,
        """
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
""",
    )

    print("==> Загрузка файлов")
    sftp = client.open_sftp()
    upload_tree(sftp, PROJECT_DIR, APP_DIR)
    sftp.close()

    env_local = PROJECT_DIR / ".env.local"
    if env_local.exists():
        sftp = client.open_sftp()
        sftp.put(str(env_local), f"{APP_DIR}/.env.production")
        sftp.put(str(PROJECT_DIR / "deploy" / "nginx.conf"), "/etc/nginx/sites-available/agentum-realtors")
        sftp.close()

    run_remote(
        client,
        f"""
set -euo pipefail
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/agentum-realtors /etc/nginx/sites-enabled/agentum-realtors
if grep -q 'return 301 https' /etc/nginx/nginx.conf 2>/dev/null; then
  sed -i.bak 's/return 301 https/# disabled return 301 https/' /etc/nginx/nginx.conf || true
fi
nginx -t
systemctl reload nginx
cd {APP_DIR}
docker compose down 2>/dev/null || true
docker compose build --pull
docker compose up -d
docker compose ps
""",
    )

    pubkey = Path.home() / ".ssh" / "id_ed25519.pub"
    if pubkey.exists():
        key = pubkey.read_text().strip()
        run_remote(
            client,
            f"""
mkdir -p /root/.ssh
chmod 700 /root/.ssh
grep -qxF '{key}' /root/.ssh/authorized_keys 2>/dev/null || echo '{key}' >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
""",
        )

    client.close()
    print(f"\nГотово: http://{SERVER_HOST}")
    print(f"Админка: http://{SERVER_HOST}/admin")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
