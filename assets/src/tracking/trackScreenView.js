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
import { config, gtag } from './shared';
import isTrackingEnabled from './isTrackingEnabled';

/**
 * Send an Analytics screen_view event.
 *
 * @param {string} screenName Screen name.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackScreenView(screenName) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }

  // TODO: Provide more data like app_version?
  // See https://developers.google.com/analytics/devguides/collection/gtagjs/screens
  const eventData = {
    app_name: config.appName,
    screen_name: screenName,
  };

  // eslint-disable-next-line no-console
  console.log('Tracking Screen View', screenName);

  return new Promise((resolve) => {
    // This timeout ensures a tracking event does not block the user
    // event if it is not sent (in time).
    // If this fails, it shouldn't reject the promise since event
    // tracking should not result in user-facing errors. It will just
    // trigger a console warning.
    const failTimeout = setTimeout(() => {
      global.console.warn(
        `Screen view event for screen "${screenName}" took too long to fire.`
      );
      resolve();
    }, 1000);

    gtag('event', 'screen_view', {
      ...eventData,
      event_callback: () => {
        clearTimeout(failTimeout);
        resolve();
      },
    });
  });
}

export default trackScreenView;
