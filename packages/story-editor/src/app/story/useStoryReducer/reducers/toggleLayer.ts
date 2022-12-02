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
 * External dependencies
 */
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import type {
  ToggleLayerProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
import { toggleElement } from './toggleElement';
import { setSelectedElements } from './setSelectedElements';

export const toggleLayer = (
  draft: ReducerStateDraft,
  { elementId, metaKey, shiftKey, withLinked = false }: ToggleLayerProps
) => {
  // Meta pressed. Toggle this layer in the selection.
  if (metaKey) {
    toggleElement(draft, { elementId, withLinked });
    return;
  }

  // No special key pressed - just selected this layer and nothing else.
  if (draft.selection.length <= 0 || !shiftKey) {
    setSelectedElements(draft, {
      elementIds: [elementId],
      withLinked,
    });
    return;
  }

  // Shift key pressed with any element selected:
  // select everything between this layer and the first selected layer
  const firstId = draft.selection[0];
  const currentPage = draft.pages.find(({ id }) => id === draft.current);
  if (!currentPage) {
    return;
  }
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

  setSelectedElements(draft, {
    elementIds,
    withLinked,
  });
};

export default produce<ReducerState, [ToggleLayerProps]>(toggleLayer);
