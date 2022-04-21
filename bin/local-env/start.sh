#!/usr/bin/env bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Change to the expected directory
cd "$(dirname "$0")/../.."

# Check whether Node and NVM are installed
. "$(dirname "$0")/install-node-nvm.sh"

# Check whether Composer installed
. "$(dirname "$0")/install-composer.sh"

# Check whether Docker is installed and running
. "$(dirname "$0")/launch-containers.sh"

# Set up WordPress Development site.
# Note: we don't bother installing the test site right now, because that's
# done on every time `npm run test-e2e` is run.
. "$(dirname "$0")/install-wordpress.sh"


CURRENT_URL=$(wp option get siteurl | tr -d '\r')

echo -e "\nWelcome to the Web Stories development environment...\n"

# Give the user more context to what they should do next: Build the plugin and start testing!
echo -e "\nRun $(action_format "npm run dev") to build the latest version of the Web Stories plugin,"
echo -e "then open $(action_format "$CURRENT_URL") to get started!"

echo -e "\n\nAccess the above install using the following credentials:"
echo -e "Default username: $(action_format "admin"), password: $(action_format "password")"

if [ -z "$CI" ]; then
  if command -v xdg-open > /dev/null; then
    xdg-open "$CURRENT_URL"
  elif command -v open > /dev/null; then
    open "$CURRENT_URL"
  elif command -v xdg-open > /dev/null; then
    xdg-open "$CURRENT_URL"
  fi
fi
