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
import track from './track';

/**
 * Send an Analytics screen_view event.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings
 *
 * @param {string} name The variable being recorded (e.g. 'load').
 * @param {number} value The number of milliseconds in elapsed time to report to Google Analytics (e.g. 20).
 * @param {string} eventCategory A string for categorizing all user timing variables into logical groups (e.g. 'JS Dependencies').
 * @param {string} eventLabel A string that can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN').
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackTimingComplete(name, value, eventCategory, eventLabel) {
  const eventData = {
    name,
    value,
    event_category: eventCategory,
    event_label: eventLabel,
  };

  return track('timing_complete', eventData);
}

export default trackTimingComplete;
