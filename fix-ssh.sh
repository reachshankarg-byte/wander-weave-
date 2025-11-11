#!/bin/bash
echo "Fixing SSH agent..."

# Kill any existing agents
taskkill /F /IM ssh-agent.exe 2>/dev/null

# Clear environment
unset SSH_AGENT_PID
unset SSH_AUTH_SOCK

# Start new agent and capture output
temp_file=$(mktemp)
ssh-agent -s > "$temp_file"

# Source the environment variables
source "$temp_file"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Test
echo "Testing connection to GitHub..."
ssh -T git@github.com

# Clean up
rm -f "$temp_file"
