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
 * External dependencies
 */
import { useCallback } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { useStory, storyReducers } from '../../../../app';
import useFocusCanvas from '../../../canvas/useFocusCanvas';

function useLayerSelection(layer) {
  const { id: elementId } = layer;
  const isSelected = useStory((value) =>
    value.state.selectedElementIds.includes(elementId)
  );
  const updateStateWithReducer = useStory(
    (value) => value.actions.updateStateWithReducer
  );

  const focusCanvas = useFocusCanvas();

  const handleClick = useCallback(
    (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      updateStateWithReducer({
        reducer: (state) => {
          // Meta pressed. Toggle this layer in the selection.
          if (evt.metaKey) {
            return storyReducers.toggleElement(state, { elementId });
          }

          // No special key pressed - just selected this layer and nothing else.
          if (state.selection.length <= 0 || !evt.shiftKey) {
            return storyReducers.setSelectedElementsById(state, {
              elementIds: [elementId],
            });
          }

          // Shift key pressed with any element selected:
          // select everything between this layer and the first selected layer
          const firstId = state.selection[0];
          const currentPage = state.pages.find(
            ({ id }) => id === state.current
          );
          const pageElementIds = currentPage.elements.map((el) => el.id);
          const firstIndex = pageElementIds.findIndex((id) => id === firstId);
          const clickedIndex = pageElementIds.findIndex(
            (id) => id === elementId
          );
          const lowerIndex = Math.min(firstIndex, clickedIndex);
          const higherIndex = Math.max(firstIndex, clickedIndex);
          const elementIds = pageElementIds.slice(lowerIndex, higherIndex + 1);
          // reverse selection if firstId isn't first anymore
          if (firstId !== elementIds[0]) {
            elementIds.reverse();
          }

          return storyReducers.setSelectedElementsById(state, {
            elementIds,
          });
        },
      });

      // In any case, revert focus to selected element(s)
      focusCanvas();
    },
    [updateStateWithReducer, elementId, focusCanvas]
  );

  return { isSelected, handleClick };
}

export default useLayerSelection;
