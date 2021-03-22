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
import { config } from './shared';
import isTrackingEnabled from './isTrackingEnabled';
import track from './track';

/**
 * Send an Analytics tracking event.
 *
 * Note: Only use custom events if the existing events don't handle your use case.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 * @see https://support.google.com/analytics/answer/9267735
 * @see https://support.google.com/analytics/answer/9310895?hl=en
 *
 * @param {string} eventName The event name (e.g. 'search'). The value that will appear as the event action in Google Analytics Event reports.
 * @param {Object<*>} [eventParameters] Event parameters.
 * @return {Promise<void>} Promise that always resolves.
 */
async function trackEvent(eventName, eventParameters = {}) {
  if (!(await isTrackingEnabled())) {
    return Promise.resolve();
  }

  let gtagEventParameters = {};

  // Universal Analytics backwards compatibility.
  const {
    search_type,
    duration,
    title_length,
    unread_count,
    ...rest
  } = eventParameters;
  if (search_type) {
    gtagEventParameters = {
      ...rest,
      event_label: search_type,
    };
  } else if (duration) {
    gtagEventParameters = {
      ...rest,
      value: duration,
    };
  } else if (title_length) {
    gtagEventParameters = {
      ...rest,
      value: title_length,
    };
  } else if (unread_count) {
    gtagEventParameters = {
      ...rest,
      value: unread_count,
    };
  }

  if (Object.values(gtagEventParameters).length) {
    track(eventName, { ...gtagEventParameters, send_to: config.trackingId });
    track(eventName, { ...eventParameters, send_to: config.trackingIdGA4 });
    return Promise.resolve();
  }

  return track(eventName, eventParameters);
}

export default trackEvent;
