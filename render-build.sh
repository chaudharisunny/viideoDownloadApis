#!/usr/bin/env bash
set -o errexit

npm install

# Install Playwright browsers
npx playwright install chromium

# Install yt-dlp binary
mkdir -p bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod a+rx bin/yt-dlp
