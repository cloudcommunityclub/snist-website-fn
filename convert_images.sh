#!/bin/bash
# Find all PNG, JPEG, and JPG files in public/assets and create WebP versions if they don't exist
find public/assets -type f \( -name "*.png" -o -name "*.jpeg" -o -name "*.jpg" \) | while read -r img; do
  webp_file="${img%.*}.webp"
  if [ ! -f "$webp_file" ]; then
    echo "Converting $img to WebP..."
    npx --yes cwebp-bin -q 80 "$img" -o "$webp_file"
  else
    echo "WebP version already exists for $img"
  fi
done
