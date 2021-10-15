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
import { useEffect, useRef } from '@web-stories-wp/react';
import { trackTiming } from '@web-stories-wp/tracking';

function usePerformanceTracking({ element, eventId }) {
  const tracesTracker = useRef({});
  useEffect(() => {
    if (!element) {
      return undefined;
    }
    const el = element;
    const traces = tracesTracker.current;
    const traceClick = (e) => {
      if (!traces[e.timeStamp]) {
        traces[e.timeStamp] = {};
      }
      traces[e.timeStamp] = { id: eventId, time: e.timeStamp };
    };
    // @todo Support other events, too.
    el.addEventListener('click', traceClick);

    const performanceObserver = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (
          ['click'].includes(entry.name) &&
          traces[entry.startTime]?.id === eventId
        ) {
          trackTiming(eventId, entry.duration);
        }
      }
    });
    performanceObserver.observe({ entryTypes: ['event'] });
    return () => {
      el.removeEventListener('click', traceClick);
      performanceObserver.disconnect();
    };
  });
}

export default usePerformanceTracking;
