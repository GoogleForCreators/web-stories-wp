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

interface TraceProps {
  [key: string]: {
    label: string;
    category: string;
    isReported?: boolean;
    time?: number;
  };
}

const TRACES: TraceProps = {};
const OBSERVED_EVENTS = ['click', 'pointerdown', 'pointerup'];
const OBSERVED_ENTRY_TYPE = 'event';
let performanceObserver: PerformanceObserver;

interface UsePerformanceTrackingProps {
  node: Node;
  eventData: { label: string; category: string };
  eventType: string;
}

function usePerformanceTracking({
  node,
  eventData,
  eventType = 'click',
}: UsePerformanceTrackingProps) {
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

  useEffect(() => {
    if (!node || !supportsPerformanceObserving) {
      return undefined;
    }
    const { label = '', category } = eventData;
    const el = node;
    const traceEvent = (e: Event) => {
      TRACES[e.timeStamp] = { category, label, time: e.timeStamp };
    };
    el.addEventListener(eventType, traceEvent);

    return () => {
      el.removeEventListener(eventType, traceEvent);
    };
  }, [eventData, node, eventType, supportsPerformanceObserving]);
}

export default usePerformanceTracking;
