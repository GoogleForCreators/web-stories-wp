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
 * Checks if the native copy paste should proceed,
 * either if text is selected or if there's focus on a text/number input.
 *
 * @return {boolean} If native handling is expected.
 */
function nativeCopyPasteExpected() {
  const { activeElement } = globalThis.document || {};
  const { tagName, type, contentEditable } = activeElement;

  // If it's an input in focus, do native handling.
  if (
    'true' === contentEditable ||
    'textarea' === tagName.toLowerCase() ||
    ('input' === tagName.toLowerCase() &&
      ['text', 'number', 'search', 'email', 'tel', 'url'].includes(type))
  ) {
    return true;
  }

  const selection = window.getSelection();
  const range = selection.rangeCount ? selection.getRangeAt(0) : null;

  return Boolean(range && !range.collapsed);
}

export default nativeCopyPasteExpected;
