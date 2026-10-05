#!/usr/bin/env bash
# One-click installer for manfred-bootstrap.
#
# Clones the repo into a temp dir, runs scripts/bootstrap.mjs with your
# arguments, then cleans up. Intended invocation:
#
#   curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-bootstrap/main/install.sh | bash -s -- new --name <project> --prefix STU --dir ./<project> --yes
#
# Env overrides: BOOTSTRAP_REPO (git URL), BOOTSTRAP_REF (branch or tag).
set -euo pipefail

BOOTSTRAP_REPO="${BOOTSTRAP_REPO:-https://github.com/Studio-Manfred/manfred-bootstrap.git}"
BOOTSTRAP_REF="${BOOTSTRAP_REF:-main}"

for bin in git node; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "error: '$bin' is required but was not found on PATH." >&2
    exit 1
  fi
done

WORKDIR="$(mktemp -d -t manfred-bootstrap.XXXXXXXX)"
trap 'rm -rf "$WORKDIR"' EXIT

git clone --depth 1 --branch "$BOOTSTRAP_REF" --quiet "$BOOTSTRAP_REPO" "$WORKDIR"

# No exec: exec would replace the shell and skip the EXIT trap (temp dir leak).
node "$WORKDIR/scripts/bootstrap.mjs" "$@"
