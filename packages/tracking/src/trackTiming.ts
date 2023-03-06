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

/**
 * Track event timing for performance measuring.
 *
 * @param category Category for categorizing the user timing variables into groups.
 * @param time Duration in milliseconds.
 * @param label Label that allows extra flexibility in reports.
 * @param eventName Event name, e.g. click or mousedown.
 */
function trackTiming(
  category: string,
  time: number,
  label = '',
  eventName = 'click'
): void {
  void trackEvent(eventName, {
    value: time,
    event_category: category,
    event_label: label,
  });
}

export default trackTiming;
