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
 * Send an Analytics tracking event.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
 * @see  https://support.google.com/analytics/answer/1033068#Anatomy
 *
 * @param {string} eventName The event name (e.g. 'search').
 * @param {string} eventCategory The event category (e.g. 'editor'). GA defaults this to 'engagement'.
 * @param {string} [eventLabel] The event label (e.g. 'search_term').
 * @param {string} [eventValue] The event value (e.g. the actual search term).
 * @param {Object<*>} [additionalData] Additional event data to send.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackEvent(
  eventName,
  eventCategory,
  eventLabel = '',
  eventValue = '',
  additionalData = {}
) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }

  const eventData = {
    send_to: config.trackingId,
    event_category: eventCategory,
    event_label: eventLabel,
    event_value: eventValue,
    ...additionalData,
  };

  return track(eventName, eventData);
}

export default trackEvent;
