/*
 * Copyright 2021 Google LLC
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
import { config } from '../shared';
import isTrackingEnabled from '../isTrackingEnabled';
import track from '../track';

/**
 * Send a Google Analytics 4 tracking event.
 *
 * Only use custom events if the existing events don't handle your use case.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 * @see https://support.google.com/analytics/answer/9267735
 * @see https://support.google.com/analytics/answer/9310895?hl=en
 *
 * @param {string} eventName The event name (e.g. 'search'). The value that will appear as the event action in Google Analytics Event reports.
 * @param {Object<*>} [eventParameters] Event parameters.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackEvent(eventName, eventParameters = {}) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }

  const eventData = {
    send_to: config.trackingIdGA4,
    ...eventParameters,
  };

  return track(eventName, eventData);
}

export default trackEvent;
