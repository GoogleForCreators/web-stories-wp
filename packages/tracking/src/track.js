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
import { gtag } from './shared';

/**
 * Send an Analytics tracking event.
 *
 * @param {string} eventName Event name, either 'screen_view', 'timing_complete', or something custom.
 * @param {Object<*>?} [eventData] The event data to send.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function track(eventName, eventData = {}) {
  return new Promise((resolve) => {
    // This timeout ensures a tracking event does not block the user
    // event if it is not sent (in time).
    // If this fails, it shouldn't reject the promise since event
    // tracking should not result in user-facing errors. It will just
    // trigger a console warning.
    // See https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data
    const failTimeout = setTimeout(() => {
      global.console.warn(
        `[Web Stories] Tracking event "${eventName}" took too long to fire.`
      );
      resolve();
    }, 1000);

    gtag('event', eventName, {
      ...eventData,
      event_callback: () => {
        clearTimeout(failTimeout);
        resolve();
      },
    });
  });
}

export default track;
