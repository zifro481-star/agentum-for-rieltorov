#!/usr/bin/env bash
# Исправляет цепочку SSL: только leaf + intermediate (без корневых CA).
set -euo pipefail

LIVE="${LIVE:-/etc/letsencrypt/live/lideryprava.ru}"
OUT="${OUT:-/etc/nginx/ssl/lideryprava-fullchain.pem}"

python3 - <<PY
from pathlib import Path
import re

live = Path("${LIVE}")
cert = live.joinpath("cert.pem").read_text()
chain = live.joinpath("chain.pem").read_text()
intermediates = re.findall(r"-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----", chain, re.S)
if not intermediates:
    raise SystemExit("intermediate certificate not found")

fixed = cert.strip() + "\n" + intermediates[0].strip() + "\n"
out = Path("${OUT}")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(fixed)
print(f"OK: {fixed.count('BEGIN CERTIFICATE')} certs -> {out}")
PY
