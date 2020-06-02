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
 * Determine if an event (mousedown + mouseup combination) is considered a click.
 *
 * @param {Object} mouseUp   MouseUp event object.
 * @param {Object} mouseDown MouseDown event object.
 * @return {boolean} If the event is considered a click.
 */
function isMouseUpAClick(mouseUp, mouseDown) {
  if (undefined === mouseDown?.clientX || undefined === mouseDown?.clientY) {
    return false;
  }

  const { clientX, clientY, timeStamp } = mouseDown;
  const timingDifference = mouseUp.timeStamp - timeStamp;

  const distanceMoved =
    Math.abs(mouseUp.clientX - clientX) + Math.abs(mouseUp.clientY - clientY);
  return !(timingDifference > 300 || distanceMoved > 4);
}

export default isMouseUpAClick;
