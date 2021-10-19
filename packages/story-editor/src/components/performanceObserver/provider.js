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
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useEffect, useRef } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { trackTiming } from '@web-stories-wp/tracking';
import PerformanceObserverContext from './performanceObserverContext';

const OBSERVED_EVENTS = ['click', 'mousedown'];

function PerformanceObserverProvider({ children }) {
  const tracesObserver = useRef({});
  useEffect(() => {
    const traces = tracesObserver.current;
    const performanceObserver = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (
          OBSERVED_EVENTS.includes(entry.name) &&
          traces[entry.startTime]?.id
        ) {
          console.log(traces[entry.startTime]?.id);
          trackTiming(
            traces[entry.startTime].id,
            entry.duration,
            entry.category,
            entry.label
          );
        }
      }
    });
    performanceObserver.observe({ entryTypes: ['event'] });
    return () => {
      performanceObserver.disconnect();
    };
  });

  const value = {
    state: {
      traces: tracesObserver.current,
    },
  };

  return (
    <PerformanceObserverContext.Provider value={value}>
      {children}
    </PerformanceObserverContext.Provider>
  );
}
PerformanceObserverProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PerformanceObserverProvider;
