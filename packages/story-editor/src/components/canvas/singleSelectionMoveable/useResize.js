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
import classnames from 'classnames';
import { useUnits } from '@googleforcreators/units';
import { getDefinitionForType } from '@googleforcreators/elements';
import { useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import useElementOutOfCanvas from '../utils/useElementOutOfCanvas';
import useFullbleedMediaAsBackground from '../utils/useFullbleedMediaAsBackground';

const EMPTY_HANDLES = [];
const VERTICAL_HANDLES = ['n', 's'];
const HORIZONTAL_HANDLES = ['e', 'w'];
const DIAGONAL_HANDLES = ['nw', 'ne', 'sw', 'se'];

function getRenderDirections({ vertical, horizontal, diagonal }) {
  return [
    ...(vertical ? VERTICAL_HANDLES : EMPTY_HANDLES),
    ...(horizontal ? HORIZONTAL_HANDLES : EMPTY_HANDLES),
    ...(diagonal ? DIAGONAL_HANDLES : EMPTY_HANDLES),
  ];
}

function useSingleSelectionResize({
  resetMoveable,
  selectedElement,
  setTransformStyle,
  frame,
  isEditMode,
  pushTransform,
  classNames,
  forceLockRatio,
}) {
  const { updateSelectedElements } = useStory((state) => ({
    updateSelectedElements: state.actions.updateSelectedElements,
  }));

  const { handleElementOutOfCanvas } = useElementOutOfCanvas();
  const { handleFullbleedMediaAsBackground } = useFullbleedMediaAsBackground();

  const { editorToDataX, editorToDataY, dataToEditorY, dataToEditorX } =
    useUnits(
      ({
        actions: { editorToDataX, editorToDataY, dataToEditorY, dataToEditorX },
      }) => ({
        editorToDataX,
        editorToDataY,
        dataToEditorY,
        dataToEditorX,
      })
    );

  const { lockAspectRatio: elementLockRatio, type } = selectedElement;
  const isText = type === 'text';
  const [isResizingFromCorner, setIsResizingFromCorner] = useState(true);
  // Text element lock aspect ratio doesn't influence resizing.
  // See https://github.com/GoogleForCreators/web-stories-wp/issues/10466
  // We always lock the aspect ratio for text element when resizing from corners and never when resizing from edges.
  const lockAspectRatio =
    (!isText && (forceLockRatio || elementLockRatio)) ||
    (isText && isResizingFromCorner);
  const { resizeRules, updateForResizeEvent } = getDefinitionForType(type);

  const minWidth = dataToEditorX(resizeRules.minWidth);
  const minHeight = dataToEditorY(resizeRules.minHeight);
  const aspectRatio = selectedElement.width / selectedElement.height;

  const onResize = ({ target, direction, width, height, drag }) => {
    let newWidth = width;
    let newHeight = height;
    let updates = null;

    if (lockAspectRatio) {
      if (newWidth < minWidth) {
        newWidth = minWidth;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight < minHeight) {
        newHeight = minHeight;
        newWidth = minHeight * aspectRatio;
      }
    } else {
      newHeight = Math.max(newHeight, minHeight);
      newWidth = Math.max(newWidth, minWidth);
    }

    if (updateForResizeEvent) {
      updates = updateForResizeEvent(
        selectedElement,
        direction,
        editorToDataX(newWidth, false),
        editorToDataY(newHeight, false)
      );
    }
    if (updates && updates.height) {
      newHeight = dataToEditorY(updates.height);
    }
    if (updates && updates.marginOffset) {
      target.querySelector('.syncMargin').style.margin = `${
        -dataToEditorY(updates.marginOffset) / 2
      }px 0`;
    }

    target.style.width = `${newWidth}px`;
    target.style.height = `${newHeight}px`;
    frame.direction = direction;
    frame.resize = [newWidth, newHeight];
    frame.translate = drag.beforeTranslate;
    frame.updates = updates;
    setTransformStyle(target, frame);
  };

  const onResizeStart = ({ setOrigin, dragStart, direction }) => {
    setOrigin(['%', '%']);
    if (dragStart) {
      dragStart.set(frame.translate);
    }
    // Both `direction[]` values for diagonals are either 1 or -1. Non-diagonal
    // directions have 0s.
    const newResizingMode = direction[0] !== 0 && direction[1] !== 0;
    if (isResizingFromCorner !== newResizingMode && isText) {
      setIsResizingFromCorner(newResizingMode);
    }
    if (isEditMode) {
      // In edit mode, we need to signal right away that the action started.
      pushTransform(selectedElement.id, frame);
    }
  };

  const onResizeEnd = ({ target }) => {
    if (handleElementOutOfCanvas(target)) {
      return;
    }
    const [editorWidth, editorHeight] = frame.resize;
    let properties = {};
    if (editorWidth !== 0 && editorHeight !== 0) {
      const { direction } = frame;
      const [deltaX, deltaY] = frame.translate;
      const newWidth = editorToDataX(editorWidth);
      const newHeight = editorToDataY(editorHeight);
      properties = {
        width: newWidth,
        height: newHeight,
        x: selectedElement.x + editorToDataX(deltaX),
        y: selectedElement.y + editorToDataY(deltaY),
      };
      if (updateForResizeEvent) {
        Object.assign(
          properties,
          updateForResizeEvent(selectedElement, direction, newWidth, newHeight)
        );
      }
      updateSelectedElements({ properties });
    }
    setIsResizingFromCorner(true);
    resetMoveable(target);
    handleFullbleedMediaAsBackground({ ...selectedElement, ...properties });
  };

  const visuallyHideHandles =
    selectedElement.width <= resizeRules.minWidth ||
    selectedElement.height <= resizeRules.minHeight;

  return {
    onResize,
    onResizeStart,
    onResizeEnd,
    keepRatio: lockAspectRatio,
    renderDirections: getRenderDirections(resizeRules),
    className: classnames(classNames, {
      'visually-hide-handles': visuallyHideHandles,
    }),
  };
}

export default useSingleSelectionResize;
