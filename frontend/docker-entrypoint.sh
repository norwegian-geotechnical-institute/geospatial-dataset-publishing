#!/bin/sh
set -e

# ASVS 13.3.1: inject the key at runtime, not into image build layers.
# ASVS 1.2.3: serialize as JSON rather than interpolating into JavaScript.
carto_key_json=$(jq -cn --arg key "${CARTO_BASEMAP_API_KEY:-}" '$key')
printf 'window.CARTO_BASEMAP_API_KEY = %s;\n' "$carto_key_json" \
  > /usr/share/nginx/html/js/runtime-config.js

# Replace placeholder with runtime environment variable
if [ -n "$APPLICATIONINSIGHTS_CONNECTION_STRING" ]; then
  echo "Injecting Application Insights connection string..."
  sed -i "s|__APPINSIGHTS_CONN__|$APPLICATIONINSIGHTS_CONNECTION_STRING|g" /usr/share/nginx/html/index.html
else
  echo "No APPLICATIONINSIGHTS_CONNECTION_STRING provided!"
fi

# Start nginx
exec "$@"
