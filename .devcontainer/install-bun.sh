#!/bin/bash

# Install unzip if not already installed
apt-get update && apt-get install -y unzip

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add Bun to the path for the current session
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Verify installation
bun --version

echo "Bun installation completed!"