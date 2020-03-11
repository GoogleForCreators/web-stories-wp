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

// These functions are used as wrapper to allow test library to simulate events
// correctly even though pointer events are not supported by jsdom library

export function getPageX(evt) {
  return evt.pageX || evt.clientX;
}

export function getPageY(evt) {
  return evt.pageY || evt.clientY;
}

export function setPointerCapture(evt) {
  // Ignore reason: PointerEvents don't work in JSDOM
  // istanbul ignore if
  if (evt.target.setPointerCapture) {
    evt.target.setPointerCapture(evt.pointerId);
  }
}

export function releasePointerCapture(evt) {
  // Ignore reason: PointerEvents don't work in JSDOM
  // istanbul ignore if
  if (evt.target.releasePointerCapture) {
    evt.target.releasePointerCapture(evt.pointerId);
  }
}
