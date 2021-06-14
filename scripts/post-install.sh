#!/bin/bash

echo "Running post install hook..."
yarn rn-nodeify --hack --install
node ./scripts/fix-qr-code-workaround.js
node ./scripts/fix-rn-ios-images-workaround.js
exit 0
