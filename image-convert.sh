#!/usr/bin/env bash
# Simple script to convert hero image to WebP and generate responsive sizes.
# Requires: cwebp (https://developers.google.com/speed/webp)
# Usage: ./image-convert.sh input.jpg

set -euo pipefail
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path/to/hero.jpg"
  exit 1
fi
IN=$1
BASENAME=$(basename "$IN" | sed 's/\.[^.]*$//')
OUT_DIR="images"
mkdir -p "$OUT_DIR"

# Generate sizes
cwebp -q 80 "$IN" -o "$OUT_DIR/${BASENAME}-1600.webp"
cwebp -q 80 -resize 1600 0 "$IN" -o "$OUT_DIR/${BASENAME}-1600.webp"
cwebp -q 80 -resize 1200 0 "$IN" -o "$OUT_DIR/${BASENAME}-1200.webp"
cwebp -q 80 -resize 800 0 "$IN" -o "$OUT_DIR/${BASENAME}-800.webp"

# Also copy/resample JPG fallbacks (optional)
sips -s format jpeg "$IN" --out "$OUT_DIR/${BASENAME}-1600.jpg" >/dev/null 2>&1 || cp "$IN" "$OUT_DIR/${BASENAME}-1600.jpg"
sips -s format jpeg "$IN" --resampleWidth 1200 --out "$OUT_DIR/${BASENAME}-1200.jpg" >/dev/null 2>&1 || cp "$IN" "$OUT_DIR/${BASENAME}-1200.jpg"
sips -s format jpeg "$IN" --resampleWidth 800 --out "$OUT_DIR/${BASENAME}-800.jpg" >/dev/null 2>&1 || cp "$IN" "$OUT_DIR/${BASENAME}-800.jpg"

echo "Generated WebP and JPG variants in $OUT_DIR/"
