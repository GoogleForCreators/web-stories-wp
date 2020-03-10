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
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import { useStory, useDropTargets } from '../../app';
import Movable from '../movable';
import objectWithout from '../../utils/objectWithout';
import { useTransform } from '../transform';
import { useUnits } from '../../units';
import { getDefinitionForType } from '../../elements';
import { useGlobalKeyDownEffect, useGlobalKeyUpEffect } from '../keyboard';
import useCanvas from './useCanvas';

const EMPTY_HANDLES = [];
const VERTICAL_HANDLES = ['n', 's'];
const HORIZONTAL_HANDLES = ['e', 'w'];
const DIAGONAL_HANDLES = ['nw', 'ne', 'sw', 'se'];

function SingleSelectionMovable({ selectedElement, targetEl, pushEvent }) {
  const moveable = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingFromCorner, setIsResizingFromCorner] = useState(true);
  const [snapDisabled, setSnapDisabled] = useState(true);

  const {
    actions: { updateSelectedElements },
  } = useStory();
  const {
    state: {
      pageSize: { width: canvasWidth, height: canvasHeight },
      nodesById,
    },
  } = useCanvas();
  const {
    actions: { getBox, editorToDataX, editorToDataY, dataToEditorY },
  } = useUnits();
  const {
    actions: { pushTransform },
  } = useTransform();

  const otherNodes = Object.values(
    objectWithout(nodesById, [selectedElement.id])
  );

  const actionsEnabled =
    !selectedElement.isFill && !selectedElement.isBackground;

  const latestEvent = useRef();

  useEffect(() => {
    latestEvent.current = pushEvent;
  }, [pushEvent]);

  useEffect(() => {
    if (moveable.current) {
      // If we have persistent event then let's use that, ensuring the targets match.
      if (
        latestEvent.current &&
        targetEl.contains(latestEvent.current.target) &&
        actionsEnabled
      ) {
        moveable.current.moveable.dragStart(latestEvent.current);
      }
      moveable.current.updateRect();
    }
  }, [targetEl, moveable, actionsEnabled]);

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (moveable.current) {
      moveable.current.updateRect();
    }
  });

  // ⌘ key disables snapping
  useGlobalKeyDownEffect('meta', () => setSnapDisabled(true), [
    setSnapDisabled,
  ]);
  useGlobalKeyUpEffect('meta', () => setSnapDisabled(false), [setSnapDisabled]);

  const box = getBox(selectedElement);
  const frame = {
    translate: [0, 0],
    rotate: box.rotationAngle,
    resize: [0, 0],
    updates: null,
  };

  const setTransformStyle = (target) => {
    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;
    if (frame.resize[0]) {
      target.style.width = `${frame.resize[0]}px`;
    }
    if (frame.resize[1]) {
      target.style.height = `${frame.resize[1]}px`;
    }
    pushTransform(selectedElement.id, frame);
  };

  /**
   * Resets Movable once the action is done, sets the initial values.
   *
   * @param {Object} target Target element.
   */
  const resetMoveable = (target) => {
    frame.direction = [0, 0];
    frame.translate = [0, 0];
    frame.resize = [0, 0];
    frame.updates = null;
    pushTransform(selectedElement.id, null);
    // Inline start resetting has to be done very carefully here to avoid
    // conflicts with stylesheets. See #3951.
    target.style.transform = '';
    target.style.width = '';
    target.style.height = '';
    setIsResizingFromCorner(true);
    if (moveable.current) {
      moveable.current.updateRect();
    }
  };

  const { resizeRules = {}, updateForResizeEvent } = getDefinitionForType(
    selectedElement.type
  );

  // Drop targets
  const {
    state: { activeDropTargetId },
    actions: { handleDrag, handleDrop },
  } = useDropTargets();

  const canSnap = !isDragging || (isDragging && !activeDropTargetId);

  return (
    <Movable
      className="default-movable"
      zIndex={0}
      ref={moveable}
      target={targetEl}
      draggable={actionsEnabled}
      resizable={actionsEnabled && !isDragging}
      rotatable={actionsEnabled && !isDragging}
      onDrag={({ target, beforeTranslate, clientX, clientY }) => {
        frame.translate = beforeTranslate;
        setTransformStyle(target);
        if (selectedElement.resource) {
          handleDrag(
            selectedElement.resource,
            clientX,
            clientY,
            selectedElement.id
          );
        }
      }}
      throttleDrag={0}
      onDragStart={({ set }) => {
        setIsDragging(true);
        set(frame.translate);
      }}
      onDragEnd={({ target }) => {
        setIsDragging(false);
        // When dragging finishes, set the new properties based on the original + what moved meanwhile.
        const [deltaX, deltaY] = frame.translate;
        if (deltaX !== 0 || deltaY !== 0) {
          const properties = {
            x: selectedElement.x + editorToDataX(deltaX),
            y: selectedElement.y + editorToDataY(deltaY),
          };
          updateSelectedElements({ properties });
          if (selectedElement.resource) {
            handleDrop(selectedElement.resource, selectedElement.id);
          }
        }
        resetMoveable(target);
      }}
      onResizeStart={({ setOrigin, dragStart, direction }) => {
        setOrigin(['%', '%']);
        if (dragStart) {
          dragStart.set(frame.translate);
        }
        // Lock ratio for diagonal directions (nw, ne, sw, se). Both
        // `direction[]` values for diagonals are either 1 or -1. Non-diagonal
        // directions have 0s.
        const newResizingMode = direction[0] !== 0 && direction[1] !== 0;
        if (isResizingFromCorner !== newResizingMode) {
          setIsResizingFromCorner(newResizingMode);
        }
      }}
      onResize={({ target, direction, width, height, drag }) => {
        const newWidth = width;
        let newHeight = height;
        let updates = null;
        if (updateForResizeEvent) {
          updates = updateForResizeEvent(
            selectedElement,
            direction,
            editorToDataX(newWidth),
            editorToDataY(newHeight)
          );
        }
        if (updates && updates.height) {
          newHeight = dataToEditorY(updates.height);
        }
        target.style.width = `${newWidth}px`;
        target.style.height = `${newHeight}px`;
        frame.direction = direction;
        frame.resize = [newWidth, newHeight];
        frame.translate = drag.beforeTranslate;
        frame.updates = updates;
        setTransformStyle(target);
      }}
      onResizeEnd={({ target }) => {
        const [editorWidth, editorHeight] = frame.resize;
        if (editorWidth !== 0 && editorHeight !== 0) {
          const { direction } = frame;
          const [deltaX, deltaY] = frame.translate;
          const newWidth = editorToDataX(editorWidth);
          const newHeight = editorToDataY(editorHeight);
          const properties = {
            width: newWidth,
            height: newHeight,
            x: selectedElement.x + editorToDataX(deltaX),
            y: selectedElement.y + editorToDataY(deltaY),
          };
          if (updateForResizeEvent) {
            Object.assign(
              properties,
              updateForResizeEvent(
                selectedElement,
                direction,
                newWidth,
                newHeight
              )
            );
          }
          updateSelectedElements({ properties });
        }
        resetMoveable(target);
      }}
      onRotateStart={({ set }) => {
        set(frame.rotate);
      }}
      onRotate={({ target, beforeRotate }) => {
        frame.rotate = beforeRotate;
        setTransformStyle(target);
      }}
      onRotateEnd={({ target }) => {
        const properties = { rotationAngle: Math.round(frame.rotate) };
        updateSelectedElements({ properties });
        resetMoveable(target);
      }}
      origin={false}
      pinchable={true}
      keepRatio={isResizingFromCorner}
      renderDirections={getRenderDirections(resizeRules)}
      snappable={canSnap && !snapDisabled}
      snapCenter={canSnap && !snapDisabled}
      horizontalGuidelines={
        canSnap && !snapDisabled && actionsEnabled
          ? [0, canvasHeight / 2, canvasHeight]
          : []
      }
      verticalGuidelines={
        canSnap && !snapDisabled && actionsEnabled
          ? [0, canvasWidth / 2, canvasWidth]
          : []
      }
      elementGuidelines={
        canSnap && !snapDisabled && actionsEnabled ? otherNodes : []
      }
      isDisplaySnapDigit={false}
    />
  );
}

function getRenderDirections({ vertical, horizontal, diagonal }) {
  return [
    ...(vertical ? VERTICAL_HANDLES : EMPTY_HANDLES),
    ...(horizontal ? HORIZONTAL_HANDLES : EMPTY_HANDLES),
    ...(diagonal ? DIAGONAL_HANDLES : EMPTY_HANDLES),
  ];
}

SingleSelectionMovable.propTypes = {
  selectedElement: PropTypes.object,
  targetEl: PropTypes.object.isRequired,
  pushEvent: PropTypes.object,
};

export default SingleSelectionMovable;
