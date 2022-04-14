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
import {
  useIsomorphicLayoutEffect,
  createRef,
  useMemo,
} from '@googleforcreators/react';

function useKeyFocus(ref, stops, currentStopIndex) {
  const numStops = stops.length;
  // Make sure proper stop is focused if any is focused
  const stopRefs = useMemo(
    () => Array.from({ length: numStops }).map(createRef),
    [numStops]
  );
  useIsomorphicLayoutEffect(() => {
    if (ref.current.contains(document.activeElement)) {
      stopRefs[currentStopIndex].current.focus();
    }
  }, [currentStopIndex, stopRefs, numStops, ref]);

  return stopRefs;
}

export default useKeyFocus;
