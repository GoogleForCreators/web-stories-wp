/*
 * Copyright 2021 Google LLC
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
import toggleElement from './toggleElement';
import setSelectedElements from './setSelectedElements';

function toggleLayer(
  state,
  { elementId, metaKey, shiftKey, withLinked = false }
) {
  // Meta pressed. Toggle this layer in the selection.
  if (metaKey) {
    return toggleElement(state, { elementId, withLinked });
  }

  // No special key pressed - just selected this layer and nothing else.
  if (state.selection.length <= 0 || !shiftKey) {
    return setSelectedElements(state, {
      elementIds: [elementId],
      withLinked,
    });
  }

  // Shift key pressed with any element selected:
  // select everything between this layer and the first selected layer
  const firstId = state.selection[0];
  const currentPage = state.pages.find(({ id }) => id === state.current);
  const pageElementIds = currentPage.elements.map((el) => el.id);
  const firstIndex = pageElementIds.findIndex((id) => id === firstId);
  const clickedIndex = pageElementIds.findIndex((id) => id === elementId);
  const lowerIndex = Math.min(firstIndex, clickedIndex);
  const higherIndex = Math.max(firstIndex, clickedIndex);
  const elementIds = pageElementIds.slice(lowerIndex, higherIndex + 1);
  // reverse selection if firstId isn't first anymore
  if (firstId !== elementIds[0]) {
    elementIds.reverse();
  }

  return setSelectedElements(state, {
    elementIds,
    withLinked,
  });
}

export default toggleLayer;
