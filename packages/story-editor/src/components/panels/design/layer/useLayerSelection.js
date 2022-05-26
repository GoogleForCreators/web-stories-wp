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

function useLayerSelection(layer) {
  const { id: elementId } = layer;
  const { isSelected, toggleLayer } = useStory(({ state, actions }) => ({
    isSelected: state.selectedElementIds.includes(elementId),
    toggleLayer: actions.toggleLayer,
  }));
  const setRenamableLayer = useCanvas(
    ({ actions }) => actions.setRenamableLayer
  );

  const handleClick = useCallback(
    (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      toggleLayer({
        elementId,
        metaKey: evt.metaKey,
        shiftKey: evt.shiftKey,
      });

      const isDoubleClick = evt.detail === 2;
      if (isDoubleClick) {
        setRenamableLayer({ elementId: elementId });
      }
    },
    [toggleLayer, elementId, setRenamableLayer]
  );

  return { isSelected, handleClick };
}
export default useLayerSelection;
