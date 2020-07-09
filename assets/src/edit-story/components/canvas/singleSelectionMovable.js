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
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { useStory, useDropTargets } from '../../app';
import Movable from '../movable';
import objectWithout from '../../utils/objectWithout';
import { useTransform } from '../transform';
import { useUnits } from '../../units';
import { getDefinitionForType } from '../../elements';
import { useGlobalIsKeyPressed } from '../keyboard';
import useBatchingCallback from '../../utils/useBatchingCallback';
import isTargetOutOfContainer from '../../utils/isTargetOutOfContainer';
import useElementsWithLinks from '../../utils/useElementsWithLinks';
import useCanvas from './useCanvas';

const EMPTY_HANDLES = [];
const VERTICAL_HANDLES = ['n', 's'];
const HORIZONTAL_HANDLES = ['e', 'w'];
const DIAGONAL_HANDLES = ['nw', 'ne', 'sw', 'se'];

function SingleSelectionMovable({ selectedElement, targetEl, pushEvent }) {
  const moveable = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingFromCorner, setIsResizingFromCorner] = useState(true);

  const {
    updateSelectedElements,
    deleteSelectedElements,
    currentPage,
  } = useStory((state) => ({
    currentPage: state.state.currentPage,
    updateSelectedElements: state.actions.updateSelectedElements,
    deleteSelectedElements: state.actions.deleteSelectedElements,
  }));
  const {
    canvasWidth,
    canvasHeight,
    nodesById,
    fullbleedContainer,
    setHasLinkInAttachmentArea,
  } = useCanvas(
    ({
      state: {
        pageSize: { width: canvasWidth, height: canvasHeight },
        nodesById,
        fullbleedContainer,
      },
      actions: { setHasLinkInAttachmentArea },
    }) => ({
      canvasWidth,
      canvasHeight,
      nodesById,
      fullbleedContainer,
      setHasLinkInAttachmentArea,
    })
  );
  const {
    getBox,
    editorToDataX,
    editorToDataY,
    dataToEditorY,
    dataToEditorX,
  } = useUnits(
    ({
      actions: {
        getBox,
        editorToDataX,
        editorToDataY,
        dataToEditorY,
        dataToEditorX,
      },
    }) => ({
      getBox,
      editorToDataX,
      editorToDataY,
      dataToEditorY,
      dataToEditorX,
    })
  );
  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    state: { activeDropTargetId, draggingResource },
    actions: { handleDrag, handleDrop, setDraggingResource, isDropSource },
  } = useDropTargets();

  const otherNodes = Object.values(
    objectWithout(nodesById, [selectedElement.id])
  );

  const actionsEnabled = !selectedElement.isBackground;

  const latestEvent = useRef();

  useEffect(() => {
    latestEvent.current = pushEvent;
  }, [pushEvent]);

  useEffect(() => {
    if (!moveable.current) {
      return;
    }
    // If we have persistent event then let's use that, ensuring the targets match.
    if (
      latestEvent.current &&
      targetEl.contains(latestEvent.current.target) &&
      actionsEnabled
    ) {
      moveable.current.moveable.dragStart(latestEvent.current);
    }
    moveable.current.updateRect();
  }, [targetEl, moveable, actionsEnabled]);

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (!moveable.current) {
      return;
    }
    moveable.current.updateRect();
  });

  const { isLinkInAttachmentArea } = useElementsWithLinks();
  const isLink = Boolean(selectedElement.link?.url);
  const pageHasAttachment = Boolean(
    currentPage.pageAttachment?.url?.length > 0
  );

  const linkFoundInAttachmentArea = (target) => {
    if (!pageHasAttachment || !isLink) {
      return false;
    }
    if (isLinkInAttachmentArea(target)) {
      if (isDragging) {
        resetDragging(target);
      } else {
        resetMoveable(target);
      }
      setHasLinkInAttachmentArea(false);
      return true;
    }
    return false;
  };

  // ⌘ key disables snapping
  const snapDisabled = useGlobalIsKeyPressed('meta');

  // ⇧ key rotates the element 30 degrees at a time
  const throttleRotation = useGlobalIsKeyPressed('shift');

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
  const resetMoveable = useBatchingCallback(
    (target) => {
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
    },
    [frame, pushTransform, setIsResizingFromCorner, selectedElement.id]
  );

  const resetDragging = useBatchingCallback(
    (target) => {
      setIsDragging(false);
      setDraggingResource(null);
      resetMoveable(target);
    },
    [setIsDragging, setDraggingResource, resetMoveable]
  );

  const { resizeRules = {}, updateForResizeEvent } = getDefinitionForType(
    selectedElement.type
  );

  const canSnap =
    !snapDisabled && (!isDragging || (isDragging && !activeDropTargetId));
  const hideHandles = isDragging || Boolean(draggingResource);

  // Removes element if it's outside of canvas.
  const handleElementOutOfCanvas = (target) => {
    if (isTargetOutOfContainer(target, fullbleedContainer)) {
      setIsDragging(false);
      setDraggingResource(null);
      deleteSelectedElements();
      return true;
    }
    return false;
  };

  const minWidth = dataToEditorX(resizeRules.minWidth);
  const minHeight = dataToEditorY(resizeRules.minHeight);
  const aspectRatio = selectedElement.width / selectedElement.height;

  const visuallyHideHandles =
    selectedElement.width <= resizeRules.minWidth ||
    selectedElement.height <= resizeRules.minHeight;

  const classNames = classnames('default-movable', {
    'hide-handles': hideHandles,
    'visually-hide-handles': visuallyHideHandles,
    'type-text': selectedElement.type === 'text',
  });

  return (
    <Movable
      className={classNames}
      zIndex={0}
      ref={moveable}
      target={targetEl}
      edge={true}
      draggable={actionsEnabled}
      resizable={actionsEnabled && !hideHandles}
      rotatable={actionsEnabled && !hideHandles}
      onDrag={({ target, beforeTranslate, clientX, clientY }) => {
        setIsDragging(true);
        if (isDropSource(selectedElement.type)) {
          setDraggingResource(selectedElement.resource);
        }
        frame.translate = beforeTranslate;
        setTransformStyle(target);
        if (isDropSource(selectedElement.type)) {
          handleDrag(
            selectedElement.resource,
            clientX,
            clientY,
            selectedElement.id
          );
        }
        if (pageHasAttachment) {
          setHasLinkInAttachmentArea(isLink && isLinkInAttachmentArea(target));
        }
      }}
      throttleDrag={0}
      onDragStart={({ set }) => {
        set(frame.translate);
      }}
      onDragEnd={({ target }) => {
        if (handleElementOutOfCanvas(target)) {
          return;
        }
        if (linkFoundInAttachmentArea(target)) {
          return;
        }
        // When dragging finishes, set the new properties based on the original + what moved meanwhile.
        const [deltaX, deltaY] = frame.translate;
        if (
          deltaX !== 0 ||
          deltaY !== 0 ||
          isDropSource(selectedElement.type)
        ) {
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
        let newWidth = width;
        let newHeight = height;
        let updates = null;

        if (isResizingFromCorner) {
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
        if (pageHasAttachment) {
          setHasLinkInAttachmentArea(isLink && isLinkInAttachmentArea(target));
        }
      }}
      onResizeEnd={({ target }) => {
        if (handleElementOutOfCanvas(target)) {
          return;
        }
        if (linkFoundInAttachmentArea(target)) {
          return;
        }
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
        frame.rotate = ((beforeRotate % 360) + 360) % 360;
        setTransformStyle(target);
        if (pageHasAttachment) {
          setHasLinkInAttachmentArea(isLink && isLinkInAttachmentArea(target));
        }
      }}
      onRotateEnd={({ target }) => {
        if (handleElementOutOfCanvas(target)) {
          return;
        }
        if (linkFoundInAttachmentArea(target)) {
          return;
        }
        const properties = { rotationAngle: Math.round(frame.rotate) };
        updateSelectedElements({ properties });
        resetMoveable(target);
      }}
      throttleRotate={throttleRotation ? 30 : 0}
      origin={false}
      pinchable={true}
      keepRatio={isResizingFromCorner}
      renderDirections={getRenderDirections(resizeRules)}
      snappable={canSnap}
      snapCenter={canSnap}
      horizontalGuidelines={
        canSnap && actionsEnabled ? [0, canvasHeight / 2, canvasHeight] : []
      }
      verticalGuidelines={
        canSnap && actionsEnabled ? [0, canvasWidth / 2, canvasWidth] : []
      }
      elementGuidelines={canSnap && actionsEnabled ? otherNodes : []}
      snapGap={canSnap}
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
  selectedElement: PropTypes.object.isRequired,
  targetEl: PropTypes.object.isRequired,
  pushEvent: PropTypes.object,
};

export default SingleSelectionMovable;
