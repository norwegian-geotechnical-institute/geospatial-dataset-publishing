#!/bin/sh
set -e

# Replace placeholder with runtime environment variable
if [ -n "$APPLICATIONINSIGHTS_CONNECTION_STRING" ]; then
  echo "Injecting Application Insights connection string..."
  sed -i "s|__APPINSIGHTS_CONN__|$APPLICATIONINSIGHTS_CONNECTION_STRING|g" /usr/share/nginx/html/index.html
else
  echo "No APPLICATIONINSIGHTS_CONNECTION_STRING provided!"
fi

# Start nginx
exec "$@"
