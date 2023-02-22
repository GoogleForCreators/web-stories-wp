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
 * Starts a timer and returns a callback to stop it and send an analytics timing_complete event.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings
 * @param eventName The event nae (e.g. 'load_items').
 * @return Callback to stop timer and send tracking event.
 */
function getTimeTracker(eventName: string): () => void {
  const before = window.performance.now();
  return () => {
    const after = window.performance.now();
    const value = after - before;

    void trackEvent(eventName, {
      value,
    });
  };
}

export default getTimeTracker;
