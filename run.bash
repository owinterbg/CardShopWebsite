#!/bin/bash

# run.bash - Launch frontend and backend services in development mode
set -euo pipefail

# Directories
FRONTEND_DIR="./frontend"
BACKEND_DIR="./backend"

# Logging helpers
log()   { echo -e "\033[1;32m[INFO]\033[0m $1"; }
error() { echo -e "\033[1;31m[ERROR]\033[0m $1" >&2; }

# Cleanup on exit
cleanup() {
  log "Shutting down services..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

# --- Start Backend ---
log "Starting Flask backend..."
(
  cd "$BACKEND_DIR"

  if [ ! -d "venv" ]; then
    error "Python virtual environment not found in backend/. Run: python3 -m venv venv"
    exit 1
  fi

  source venv/bin/activate

  if ! command -v flask &> /dev/null; then
    error "'flask' not found in virtual environment. Run: pip install flask flask-cors"
    exit 1
  fi

  export FLASK_APP=run.py
  export FLASK_ENV=development
  export PYTHONPATH=./backend

  flask run --debug --host=0.0.0.0 --port=5000
) &
BACKEND_PID=$!


# --- Start Frontend ---
log "Starting React frontend..."
(
  cd "$FRONTEND_DIR"

  if [ ! -f "package.json" ]; then
    error "No package.json found in frontend/. Did you run: npx create-react-app?"
    exit 1
  fi

  npm start
) &
FRONTEND_PID=$!

# --- Wait for Both ---
wait $BACKEND_PID $FRONTEND_PID
