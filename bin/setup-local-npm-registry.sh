#!/usr/bin/env bash

#
# Copyright 2022 Google LLC
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

# Echo every command being executed
set -ex

registry_url=http://localhost:4873

echo "Starting up local npm registry..."

# Start local registry.
tmp_registry_log=`mktemp`

echo "Registry output file: $tmp_registry_log"

curdir=$(dirname "$0")

(nohup npx verdaccio --config "$curdir/verdaccio-config.yml" &>$tmp_registry_log &)

npm i --global verdaccio-memory

# Wait for Verdaccio to boot.
grep -q 'http address' <(tail -f $tmp_registry_log)

echo "Local registry up and running! ${registry_url}"

# Set registry to local registry
export NPM_CONFIG_REGISTRY="$registry_url"

echo "Logging in..."

# Log in to Verdaccio so we can publish packages
npx npm-cli-login -u admin -p password -e test@example.com -r $registry_url
