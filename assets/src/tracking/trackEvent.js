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
 * Send an Analytics tracking event.
 *
 * @param {string} eventCategory The event category.
 * @param {string} eventName The event category.
 * @param {string} [eventLabel] The event category.
 * @param {string} [eventValue] The event category.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackEvent(
  eventCategory,
  eventName,
  eventLabel = '',
  eventValue = ''
) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }

  const eventData = {
    send_to: config.trackingId,
    event_category: eventCategory,
    event_label: eventLabel,
    event_value: eventValue,
    dimension1: config.siteUrl,
    dimension2: config.userIdHash,
  };

  // eslint-disable-next-line no-console
  console.log('Tracking Event', eventName, eventData);

  return new Promise((resolve) => {
    // This timeout ensures a tracking event does not block the user
    // event if it is not sent (in time).
    // If this fails, it shouldn't reject the promise since event
    // tracking should not result in user-facing errors. It will just
    // trigger a console warning.
    const failTimeout = setTimeout(() => {
      global.console.warn(
        `Tracking event "${eventName}" (category "${eventCategory}") took too long to fire.`
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

export default trackEvent;
