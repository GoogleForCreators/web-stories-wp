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
 * External dependencies
 */
import { useEffect } from '@googleforcreators/react';
import { trackTiming } from '@googleforcreators/tracking';

const TRACES = {};
const OBSERVED_EVENTS = ['click', 'pointerdown', 'pointerup'];
const OBSERVED_ENTRY_TYPE = 'event';
let performanceObserver;

function usePerformanceTracking({ node, eventData, eventType = 'click' }) {
  const supportsPerformanceObserving =
    typeof PerformanceObserver !== 'undefined' &&
    PerformanceObserver.supportedEntryTypes.includes(OBSERVED_ENTRY_TYPE);

  // Start observing all events if not doing so already.
  if (!performanceObserver && supportsPerformanceObserving) {
    performanceObserver = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (
          OBSERVED_EVENTS.includes(entry.name) &&
          TRACES[entry.startTime]?.category &&
          !TRACES[entry.startTime]?.isReported
        ) {
          TRACES[entry.startTime].isReported = true;
          trackTiming(
            TRACES[entry.startTime].category,
            entry.duration,
            TRACES[entry.startTime].label,
            entry.name
          );
        }
      }
    });
    performanceObserver.observe({ entryTypes: [OBSERVED_ENTRY_TYPE] });
  }

  const { label, category } = eventData;
  useEffect(() => {
    if (!node || !supportsPerformanceObserving) {
      return undefined;
    }
    const el = node;
    const traceEvent = (e) => {
      TRACES[e.timeStamp] = { category, time: e.timeStamp };
      if (label) {
        TRACES[e.timeStamp].label = label;
      }
    };
    el.addEventListener(eventType, traceEvent);

    return () => {
      el.removeEventListener(eventType, traceEvent);
    };
  }, [category, label, node, eventType, supportsPerformanceObserving]);
}

export default usePerformanceTracking;
