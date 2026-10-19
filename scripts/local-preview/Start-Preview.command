#!/bin/bash
set -e
preview_root="$(cd -- "$(dirname -- "$0")" && pwd)"
if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' 'Python 3 was not found. This preview needs Python 3; Node is not required.'
  read -r -p 'Press Return to close.'
  exit 1
fi
exec python3 "$preview_root/preview.py"
