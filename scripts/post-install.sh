#!/bin/bash

echo "Running post install hook..."
yarn rn-nodeify --hack --install
node ./scripts/fix-qr-code-workaround.js
exit 0
