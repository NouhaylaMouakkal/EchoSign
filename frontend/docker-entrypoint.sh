#!/bin/sh

echo "Creating runtime.js with environment variables..."
cat <<EOF > /usr/share/nginx/html/assets/runtime.js
(function (window) {
  window.__env = window.__env || {};
  window.__env.openaiApiKey = "${openaiApiKey}";
  window.__env.text2signPublicURLroute = "${text2signPublicURLroute}";
  window.__env.sign2textPublicURLroute = "${sign2textPublicURLroute}";
})(this);
EOF

echo "Starting Nginx..."
exec "$@"