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
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import useBatchingCallback from '../../../utils/useBatchingCallback';
import { useDropTargets } from '../../dropTargets';
import { useUnits } from '../../../units';
import { useStory } from '../../../app';
import { useTransformHandler } from '../../transform';
import useElementOutOfCanvas from '../utils/useElementOutOfCanvas';

function getSnappingProperty(min, mid, max, dim) {
  if (min !== undefined) {
    return min;
  }
  if (mid !== undefined) {
    return mid - Math.floor(dim / 2);
  }
  if (max !== undefined) {
    return max - dim;
  }
  return null;
}

function getSnappingProperties(snapCoordinates, width, height) {
  if (!snapCoordinates) {
    return null;
  }

  const x = getSnappingProperty(
    snapCoordinates.left,
    snapCoordinates.center,
    snapCoordinates.right,
    width
  );
  const y = getSnappingProperty(
    snapCoordinates.top,
    snapCoordinates.middle,
    snapCoordinates.bottom,
    height
  );

  return {
    ...(x !== null ? { x } : {}),
    ...(y !== null ? { y } : {}),
  };
}

function useSingleSelectionDrag({
  setIsDragging,
  resetMoveable,
  selectedElement,
  setTransformStyle,
  frame,
}) {
  const {
    actions: { handleDrag, handleDrop, setDraggingResource, isDropSource },
  } = useDropTargets();

  const { handleElementOutOfCanvas } = useElementOutOfCanvas();

  const { updateSelectedElements } = useStory((state) => ({
    updateSelectedElements: state.actions.updateSelectedElements,
  }));

  const {
    editorToDataX,
    editorToDataY,
    dataToEditorX,
    dataToEditorY,
  } = useUnits(
    ({
      actions: { editorToDataX, editorToDataY, dataToEditorX, dataToEditorY },
    }) => ({
      editorToDataX,
      editorToDataY,
      dataToEditorX,
      dataToEditorY,
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

  const snapCoordinates = useRef();
  useTransformHandler(selectedElement.id, (transform) => {
    snapCoordinates.current = transform?.snap;
  });

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

    // When dragging finishes, set the new properties based on the original + what moved meanwhile.
    const [deltaX, deltaY] = frame.translate;
    if (deltaX !== 0 || deltaY !== 0) {
      // Here we convert the original coordinate to editor pixels, before adding delta and converting
      // back to data pixels - this ensures proper rounding!
      const properties = {
        x: editorToDataX(Math.round(dataToEditorX(selectedElement.x)) + deltaX),
        y: editorToDataY(Math.round(dataToEditorY(selectedElement.y)) + deltaY),
        // However, we then check to see if we get more accurate final coordinates from snapping
        ...getSnappingProperties(
          snapCoordinates.current,
          selectedElement.width,
          selectedElement.height
        ),
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
