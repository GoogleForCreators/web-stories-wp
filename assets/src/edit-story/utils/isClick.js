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
 * Determine if an event (mouseup) is considered a click.
 *
 * @param {Object} evt         Event object.
 * @param {number} time        Initial time of the event,
 * @param {Object} coordinates Initial coordinates.
 * @return {boolean} If the event is considered a click.
 */
function isClick(evt, time, coordinates) {
  const timingDifference = window.performance.now() - time;
  if (!coordinates?.x || !coordinates?.y) {
    return false;
  }

  const { x, y } = coordinates;

  const distanceMoved = Math.abs(evt.clientX - x) + Math.abs(evt.clientY - y);
  return !(timingDifference > 300 || distanceMoved > 4);
}

export default isClick;
