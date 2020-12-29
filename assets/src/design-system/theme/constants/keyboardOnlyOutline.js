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

// These are used to control styles based on if a keyboard is in use.
// To target an element's styles purely for keyboard users use `THEME_CONSTANTS.KEYBOARD_ONLY.KEYBOARD_USER_SELECTOR`
export const KEYBOARD_USER_CLASS = `useskeyboard`;
export const KEYBOARD_USER_SELECTOR = `.${KEYBOARD_USER_CLASS}`;

export const ACCEPTED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
  'Digit1',
  'Digit2',
  'Digit3',
];
