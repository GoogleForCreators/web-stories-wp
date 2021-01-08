#!/usr/bin/env bash

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

set -ex

# Pretty permalinks don't seem to work with wp-env.
#npm run wp-env run tests-cli "wp rewrite structure '/%postname%'"

npm run wp-env run tests-cli "wp theme activate twentynineteen"

npm run wp-env run tests-cli "wp plugin deactivate --all"
npm run wp-env run tests-cli "wp plugin activate web-stories"

# Create additional users.
npm run wp-env run tests-cli "wp user create author author@example.org --role=author --user_pass=password --quiet"

# Let's make sure we have some media in the media library to work with.

npm run wp-env run tests-cli "wp media import /var/www/html/wp-content/e2e-assets/lego-mov-video.mov"

# Since MOV files are not allowed in the editor, only the WEBM one needs a poster.
npm run wp-env run tests-cli "wp media import /var/www/html/wp-content/e2e-assets/lego-webm-video.webm --porcelain"

# TODO: Convert these commands to work with wp-env.
#WEBM_VIDEO_ID=$(wp media import /var/www/html/wp-content/e2e-assets/lego-webm-video.webm --porcelain)
#WEBM_VIDEO_POSTER_ID=$(wp media import /var/www/html/wp-content/e2e-assets/lego-webm-video-poster.jpg --post_id=$WEBM_VIDEO_ID --featured_image --porcelain)

# So the poster is marked as such and hidden in the editor.
#wp post term add $WEBM_VIDEO_POSTER_ID web_story_media_source "poster-generation" --quiet
#wp post meta add $WEBM_VIDEO_ID web_stories_poster_id $WEBM_VIDEO_POSTER_ID --quiet

npm run wp-env run tests-cli "wp media import /var/www/html/wp-content/e2e-assets/example-1.jpg"
npm run wp-env run tests-cli "wp media import /var/www/html/wp-content/e2e-assets/example-2.jpg"
npm run wp-env run tests-cli "wp media import /var/www/html/wp-content/e2e-assets/example-3.png"

npm run wp-env run tests-cli "wp option patch insert web_stories_experiments enableSVG 1"
npm run wp-env run tests-cli "wp media import /var/www/html/wp-content/e2e-assets/video-play.svg"
npm run wp-env run tests-cli "wp option patch insert web_stories_experiments enableSVG 0"
