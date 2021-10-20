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
import { useEffect } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import usePerformanceObserver from '../components/performanceObserver/usePerformanceObserver';

function usePerformanceTracking({ node, eventData, eventType = 'click' }) {
  const { traces } = usePerformanceObserver(({ state: { traces } }) => ({
    traces,
  }));
  const { label, category } = eventData;
  useEffect(() => {
    if (!node) {
      return undefined;
    }
    const el = node;
    const traceEvent = (e) => {
      if (!traces[e.timeStamp]) {
        traces[e.timeStamp] = {};
      }
      traces[e.timeStamp] = { category, time: e.timeStamp };
      if (label) {
        traces[e.timeStamp].label = label;
      }
    };
    el.addEventListener(eventType, traceEvent);

    return () => {
      el.removeEventListener(eventType, traceEvent);
    };
  });
}

export default usePerformanceTracking;
