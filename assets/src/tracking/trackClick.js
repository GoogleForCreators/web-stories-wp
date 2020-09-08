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
import isTrackingEnabled from './isTrackingEnabled';
import track from './track';

/**
 * Send an Analytics tracking event for clicks.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
 *
 * @param {MouseEvent} event The actual click event.
 * @param {string} eventName The event name (e.g. 'search').
 * @param {string} eventCategory The event category (e.g. 'editor'). GA defaults this to 'engagement'.
 * @param {string} url The URL to track and navigate to.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackClick(event, eventName, eventCategory, url) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }

  event.preventDefault();

  const eventData = {
    send_to: config.trackingId,
    event_category: eventCategory,
    event_label: url,
  };

  return track(eventName, eventData).finally(() => {
    document.location = url;
  });
}

export default trackClick;
