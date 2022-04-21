#!/usr/bin/env bash

set -e

#
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Custom deployment script for Pantheon environment.
# Adapted from original version at https://github.com/ampproject/amp-wp/pull/1042.

echo "Initializing deployment to Web Stories test environment"

PANTHEON_SITE="wordpress-amp"
PANTHEON_BRANCH="stories-new"
PANTHEON_UUID="6b7f1eeb-705b-4201-864d-2007030c8372"

cd "$(dirname "$0")/.."
project_dir="$(pwd)"
repo_dir="$HOME/deployment-targets/$PANTHEON_SITE"

echo "Setting up SSH configuration"

# Dynamic hosts through Pantheon mean constantly checking interactively
# that we mean to connect to an unknown host. We ignore those here.
echo "StrictHostKeyChecking no" > ~/.ssh/config

if ! grep -q "codeserver.dev.$PANTHEON_UUID.drush.in" ~/.ssh/known_hosts; then
    ssh-keyscan -p 2222 codeserver.dev.$PANTHEON_UUID.drush.in >> ~/.ssh/known_hosts
fi

if ! grep -q "codeserver.dev.$PANTHEON_UUID.drush.in" ~/.ssh/config; then
    echo "" >> ~/.ssh/config
    echo "Host $PANTHEON_SITE" >> ~/.ssh/config
    echo "  Hostname codeserver.dev.$PANTHEON_UUID.drush.in" >> ~/.ssh/config
    echo "  User codeserver.dev.$PANTHEON_UUID" >> ~/.ssh/config
    echo "  Port 2222" >> ~/.ssh/config
    echo "  KbdInteractiveAuthentication no" >> ~/.ssh/config
fi

echo "Fetching remote repository"

git config --global user.name "Travis CI"
git config --global user.email "travis-ci+$PANTHEON_SITE@example.org"

if [ ! -e "$repo_dir/.git" ]; then
    git clone -v ssh://codeserver.dev.$PANTHEON_UUID@codeserver.dev.$PANTHEON_UUID.drush.in:2222/~/repository.git "$repo_dir"
fi

cd "$repo_dir"
git fetch

if git rev-parse --verify --quiet "$PANTHEON_BRANCH" > /dev/null; then
    git checkout "$PANTHEON_BRANCH"
else
    git checkout -b "$PANTHEON_BRANCH"
fi

if git rev-parse --verify --quiet "origin/$PANTHEON_BRANCH" > /dev/null; then
    git reset --hard "origin/$PANTHEON_BRANCH"
fi

cd "$project_dir"

echo "Moving files to repository"
rsync -avz --delete ./build/web-stories/ "$repo_dir/wp-content/plugins/web-stories/"
git --no-pager log -1 --format="Build Web Stories plugin at %h: %s" > /tmp/commit-message.txt

echo "Committing changes"

# Commit and deploy.
cd "$repo_dir"
git add -A "wp-content/plugins/web-stories/"
git commit -F /tmp/commit-message.txt

echo "Pushing new build to remote repository"
git push origin $PANTHEON_BRANCH

echo "View site at http://$PANTHEON_BRANCH-$PANTHEON_SITE.pantheonsite.io/"
echo "Access Pantheon dashboard at https://dashboard.pantheon.io/sites/$PANTHEON_UUID#$PANTHEON_BRANCH"
