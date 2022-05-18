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
import { useCallback } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../../../app';
import useFocusCanvas from '../../../canvas/useFocusCanvas';

function useLayerSelection(layer) {
  const { id: elementId } = layer;
  const { isSelected, toggleLayer, updateElementById } = useStory(
    ({ state, actions }) => ({
      isSelected: state.selectedElementIds.includes(elementId),
      toggleLayer: actions.toggleLayer,
      updateElementById: actions.updateElementById,
    })
  );
  const { renamableLayer, setRenamableLayer } = useCanvas(
    ({ state, actions }) => ({
      renamableLayer: state.renamableLayer,
      setRenamableLayer: actions.setRenamableLayer,
    })
  );

  const focusCanvas = useFocusCanvas();

  const handleClick = useCallback(
    (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const isDoubleClick = evt.detail === 2;

      toggleLayer({
        elementId,
        metaKey: evt.metaKey,
        shiftKey: evt.shiftKey,
      });

      if (isDoubleClick) {
        setRenamableLayer({ elementId: elementId });
      }

      // In any case, revert focus to selected element(s)
      if (renamableLayer) {
        focusCanvas();
      }
    },
    [toggleLayer, elementId, focusCanvas, updateElementById, renamableLayer, setRenamableLayer]
  );

  return { isSelected, handleClick };
}
export default useLayerSelection;
