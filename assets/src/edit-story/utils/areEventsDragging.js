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
 * Determine if two mouse events are part of a dragging action or not.
 *
 * It can be any two mouse event such as down and up or dragstart and drag.
 *
 * @param {Object} firstEvent   First mouse event object.
 * @param {Object} secondEvent  Second mouse event object.
 * @return {boolean} Returns true iff the events are considered part of dragging
 */
function areEventsDragging(firstEvent, secondEvent) {
  const { clientX, clientY, timeStamp } = firstEvent;
  const timingDifference = secondEvent.timeStamp - timeStamp;

  const distanceMoved =
    Math.abs(secondEvent.clientX - clientX) +
    Math.abs(secondEvent.clientY - clientY);
  return timingDifference > 300 || distanceMoved > 4;
}

export default areEventsDragging;
