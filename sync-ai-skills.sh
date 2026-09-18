#!/usr/bin/env bash
# Installs/updates the global Claude Code skill set (writing, design, testing) on this machine.
# Uses the skills.sh CLI (https://skills.sh) — https://github.com/vercel-labs/skills
# Run any time: bash sync-ai-skills.sh

set -euo pipefail

SKILLS=(
  "cdeistopened/skill-stack@anti-ai-writing"
  "vercel-labs/agent-skills@web-design-guidelines"
  "vercel-labs/agent-skills@vercel-react-best-practices"
  "emilkowalski/skills@apple-design"
  "podo/design-agent-skills@ui-ux-pro-max"
  "dietrichgebert/ponytail@ponytail"
  "reason-machines/mcp-skills@playwright-mcp-server"
)

for skill in "${SKILLS[@]}"; do
  echo "==> Installing ${skill}"
  npx --yes skills add "${skill}" -g -y
done

echo "==> Done. Installed skills:"
npx --yes skills list -g
