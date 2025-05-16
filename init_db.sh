#!/bin/bash

# Navigate to project root (this script should already be there)
echo "[+] Starting database initialization..."

# Ensure venv is activated
if [ ! -d "backend/venv" ]; then
  echo "[!] Virtual environment not found in backend/venv. Please create it first."
  exit 1
fi

source backend/venv/bin/activate

# Run the init script
python3 backend/init_db.py

# Deactivate environment
deactivate

echo "[✓] Database initialized using models."