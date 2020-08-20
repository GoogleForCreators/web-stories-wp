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
 * Internal dependencies
 */
import useBatchingCallback from '../../../utils/useBatchingCallback';
import { useDropTargets } from '../../dropTargets';
import { useUnits } from '../../../units';

function useSingleSelectionDrag({
  handleElementOutOfCanvas,
  setIsDragging,
  resetMoveable,
  selectedElement,
  updateSelectedElements,
  setTransformStyle,
  frame,
}) {
  const {
    actions: { handleDrag, handleDrop, setDraggingResource, isDropSource },
  } = useDropTargets();

  const { editorToDataX, editorToDataY } = useUnits(
    ({ actions: { editorToDataX, editorToDataY } }) => ({
      editorToDataX,
      editorToDataY,
    })
  );

  const resetDragging = useBatchingCallback(
    (target) => {
      setIsDragging(false);
      setDraggingResource(null);
      resetMoveable(target);
    },
    [setIsDragging, setDraggingResource, resetMoveable]
  );

  const onDrag = ({ target, beforeTranslate, clientX, clientY }) => {
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
    set(frame.translate);
    return undefined;
  };

  const onDragEnd = ({ target }) => {
    if (handleElementOutOfCanvas(target)) {
      setIsDragging(false);
      setDraggingResource(null);
      return undefined;
    }
    // When dragging finishes, set the new properties based on the original + what moved meanwhile.
    const [deltaX, deltaY] = frame.translate;
    if (deltaX !== 0 || deltaY !== 0 || isDropSource(selectedElement.type)) {
      const properties = {
        x: selectedElement.x + editorToDataX(deltaX),
        y: selectedElement.y + editorToDataY(deltaY),
      };
      updateSelectedElements({ properties });
      if (isDropSource(selectedElement.type)) {
        handleDrop(selectedElement.resource, selectedElement.id);
      }
    }
    resetDragging(target);
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
