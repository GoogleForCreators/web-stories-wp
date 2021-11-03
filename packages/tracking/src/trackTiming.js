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
import trackEvent from './trackEvent';
import { config } from './shared';

/**
 * Track event timing for performance measuring.
 *
 * @param {string} category Category for categorizing the user timing variables into groups.
 * @param {number} time Duration in milliseconds.
 * @param {string} label Label that allows extra flexibility in reports.
 * @param {string} eventName Event name, e.g. click or mousedown.
 */
function trackTiming(category, time, label = '', eventName = 'click') {
  // Universal Analytics has a special `timing_complete` event which
  // does not exist in GA4.
  trackEvent('timing_complete', {
    name: eventName,
    value: time,
    event_category: category,
    event_label: label,
    send_to: config.trackingId,
  });
  trackEvent(eventName, {
    value: time,
    event_category: category,
    event_label: label,
    send_to: config.trackingIdGA4,
  });
}

export default trackTiming;
