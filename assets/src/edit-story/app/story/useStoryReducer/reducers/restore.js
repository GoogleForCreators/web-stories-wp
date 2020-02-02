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
 * Restore internal state completely from given state.
 *
 * Some validation is performed:
 *
 * - `pages` must be an array (if not, nothing happens).
 * - `current` must point to a legal page, if at least one page exists.
 * - `selection` is a unique array.
 * - `story` is an object.
 *
 * @param {Object} state Current state
 * @param {Object} payload New state to set.
 * @return {Object} New state
 */
function restore(state, { pages, current, selection, story, capabilities }) {
  if (!Array.isArray(pages) || pages.length === 0) {
    return state;
  }

  const newStory = typeof story === 'object' ? story : {};
  const newCapabilities = typeof capabilities === 'object' ? capabilities : {};
  const newCurrent = pages.some(({ id }) => id === current)
    ? current
    : pages[0].id;
  const newSelection = Array.isArray(selection) ? [...new Set(selection)] : [];

  return {
    pages,
    current: newCurrent,
    selection: newSelection,
    story: newStory,
    capabilities: newCapabilities,
  };
}

export default restore;
