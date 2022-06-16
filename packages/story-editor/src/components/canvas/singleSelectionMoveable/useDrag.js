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
import { useUnits } from '@googleforcreators/units';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../../dropTargets';
import { useStory } from '../../../app';
import useElementOutOfCanvas from '../utils/useElementOutOfCanvas';
import useFullbleedMediaAsBackground from '../utils/useFullbleedMediaAsBackground';

function useSingleSelectionDrag({
  setIsDragging,
  resetMoveable,
  selectedElement,
  setTransformStyle,
  frame,
}) {
  const { isDropSource, handleDrag, handleDrop, setDraggingResource } =
    useDropTargets(
      ({
        actions: { handleDrag, handleDrop, isDropSource, setDraggingResource },
      }) => ({
        handleDrag,
        handleDrop,
        setDraggingResource,
        isDropSource,
      })
    );

  const { handleElementOutOfCanvas } = useElementOutOfCanvas();
  const { handleFullbleedMediaAsBackground } = useFullbleedMediaAsBackground({
    selectedElement,
  });

  const { updateSelectedElements } = useStory((state) => ({
    updateSelectedElements: state.actions.updateSelectedElements,
  }));

  const { editorToDataX, editorToDataY } = useUnits(
    ({ actions: { editorToDataX, editorToDataY } }) => ({
      editorToDataX,
      editorToDataY,
    })
  );

  const resetDragging = useCallback(
    (target) => {
      setIsDragging(false);
      setDraggingResource(null);
      resetMoveable(target);
    },
    [setIsDragging, setDraggingResource, resetMoveable]
  );

  const onDrag = ({ target, beforeTranslate, clientX, clientY }) => {
    setIsDragging(true);
    if (isDropSource(selectedElement.type)) {
      setDraggingResource(selectedElement.resource);
    }
    frame.translate = beforeTranslate;
    setTransformStyle(target, frame);
    if (isDropSource(selectedElement.type)) {
      handleDrag(
        selectedElement.resource,
        clientX,
        clientY,
        selectedElement.id
      );
    }
    return undefined;
  };

  const onDragStart = ({ set }) => {
    // Note: we can't set isDragging true here since a "click" is also considered dragStart.
    set(frame.translate);
    return undefined;
  };

  const onDragEnd = ({ target, isDrag }) => {
    if (!isDrag) {
      return false;
    }
    if (handleElementOutOfCanvas(target)) {
      setIsDragging(false);
      setDraggingResource(null);
      return undefined;
    }

    const roundToZero = (num) => (Math.abs(num) <= 1 ? 0 : num);

    // When dragging finishes, set the new properties based on the original + what moved meanwhile.
    const [deltaX, deltaY] = frame.translate;
    if (deltaX !== 0 || deltaY !== 0) {
      const properties = {
        x: roundToZero(selectedElement.x + editorToDataX(deltaX)),
        y: roundToZero(selectedElement.y + editorToDataY(deltaY)),
      };
      updateSelectedElements({ properties });
      if (isDropSource(selectedElement.type)) {
        handleDrop(selectedElement.resource, selectedElement.id);
      }
    }
    resetDragging(target);
    handleFullbleedMediaAsBackground(target);
    return undefined;
  };

  return {
    onDrag,
    throttleDrag: 0,
    onDragStart,
    onDragEnd,
  };
}

export default useSingleSelectionDrag;
