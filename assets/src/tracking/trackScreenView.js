/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { config } from './shared';
import track from './track';
import isTrackingEnabled from './isTrackingEnabled';

/**
 * Send an Analytics screen_view event.
 *
 * @todo Provide more data like app_version?
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/screens
 *
 * @param {string} screenName Screen name.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackScreenView(screenName) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }

  const eventData = {
    app_name: config.appName,
    screen_name: screenName,
  };

  return track('screen_view', eventData);
}

export default trackScreenView;
