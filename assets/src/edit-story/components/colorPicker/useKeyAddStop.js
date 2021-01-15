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
import { useKeyDownEffect } from '../../../design-system';

function truncate(val, pos) {
  return Number(val.toFixed(pos));
}

function getNewStopPosition(stops, currentStopIndex) {
  const numStops = stops.length;
  const isLastStopFocussed = currentStopIndex === numStops - 1;
  if (isLastStopFocussed && stops[currentStopIndex].position < 1) {
    // If last stop is focussed, and the last stop is not at the end
    // insert new stop at the very end!
    return 1;
  }
  if (currentStopIndex === 0 && stops[0].position > 0) {
    // If first stop is focussed, and the first stop is not at the start
    // insert new stop at the very start!
    return 0;
  }

  // Other insert new stop half-way betweeen current and next
  // (or current and previous if last).
  const preStop = isLastStopFocussed
    ? stops[currentStopIndex - 1]
    : stops[currentStopIndex];
  const postStop = isLastStopFocussed
    ? stops[currentStopIndex]
    : stops[currentStopIndex + 1];
  return preStop.position + (postStop.position - preStop.position) / 2;
}

function useKeyAddStop(ref, onAdd, stops, currentStopIndex) {
  useKeyDownEffect(
    ref,
    'enter',
    () => onAdd(truncate(getNewStopPosition(stops, currentStopIndex), 4)),
    [onAdd, stops, currentStopIndex]
  );
}

export default useKeyAddStop;
