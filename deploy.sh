#!/usr/bin/env bash
set -euo pipefail

# Config
APP_DIR="/home/ubuntu/apps/bussiness"
PM2_NAME="bussiness"
PORT=3015

# Force use of Node 22 path since non-interactive SSH uses default system /usr/bin/node (v18)
export PATH="/home/ubuntu/.local/bin:/home/ubuntu/.hermes/node/bin:$PATH"

echo "=== CICD Deploy: Starting ==="
cd "$APP_DIR"

# 1. Fetch & Pull
echo "-> Fetching latest changes..."
git fetch origin main
echo "-> Pulling main..."
git reset --hard origin/main

# 2. Install dependencies
echo "-> Installing dependencies..."
npm install

# 3. Build application (constrained RAM)
echo "-> Building Next.js application..."
NODE_OPTIONS='--max-old-space-size=1024' npm run build

# 4. PM2 Management
echo "-> Checking and restarting PM2 process..."
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
    pm2 restart "$PM2_NAME"
else
    PORT=$PORT pm2 start npm --name "$PM2_NAME" -- start
fi

pm2 save

echo "=== CICD Deploy: Finished successfully! ==="
