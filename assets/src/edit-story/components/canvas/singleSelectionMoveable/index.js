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
import { useRef, useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { useStory, useDropTargets } from '../../../app';
import Moveable from '../../moveable';
import objectWithout from '../../../utils/objectWithout';
import { useTransform } from '../../transform';
import { useUnits } from '../../../units';
import { getDefinitionForType } from '../../../elements';
import useBatchingCallback from '../../../utils/useBatchingCallback';
import isTargetOutOfContainer from '../../../utils/isTargetOutOfContainer';
import useCombinedRefs from '../../../utils/useCombinedRefs';
import useCanvas from '../useCanvas';
import useSnapping from '../utils/useSnapping';
import useDrag from './useDrag';
import useResize from './useResize';
import useRotate from './useRotate';

const EMPTY_HANDLES = [];
const VERTICAL_HANDLES = ['n', 's'];
const HORIZONTAL_HANDLES = ['e', 'w'];
const DIAGONAL_HANDLES = ['nw', 'ne', 'sw', 'se'];

function SingleSelectionMoveable({
  selectedElement,
  targetEl,
  pushEvent,
  isEditMode,
  editMoveableRef,
}) {
  const moveable = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingFromCorner, setIsResizingFromCorner] = useState(true);

  const { updateSelectedElements, deleteSelectedElements } = useStory(
    (state) => ({
      updateSelectedElements: state.actions.updateSelectedElements,
      deleteSelectedElements: state.actions.deleteSelectedElements,
    })
  );
  const { nodesById, fullbleedContainer } = useCanvas(
    ({ state: { nodesById, fullbleedContainer } }) => ({
      nodesById,
      fullbleedContainer,
    })
  );
  const { getBox } = useUnits(({ actions: { getBox } }) => ({
    getBox,
  }));
  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    state: { activeDropTargetId, draggingResource },
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

  const box = getBox(selectedElement);
  let frame = useMemo(
    () => ({
      translate: [0, 0],
      rotate: box.rotationAngle,
      resize: [0, 0],
      updates: null,
    }),
    [box.rotationAngle]
  );

  const setTransformStyle = (target, newFrame = frame) => {
    // Get the changes coming from each action type.
    frame.translate = newFrame.translate;
    frame.direction = newFrame.direction;
    frame.resize = newFrame.resize;
    frame.updates = newFrame.updates;
    frame.rotate = newFrame.rotate;
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
   * Resets Moveable once the action is done, sets the initial values.
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

  const { resizeRules = {} } = getDefinitionForType(selectedElement.type);

  const canSnap =
    !isEditMode && (!isDragging || (isDragging && !activeDropTargetId));
  const hideHandles = isDragging || Boolean(draggingResource);

  // Removes element if it's outside of canvas.
  const handleElementOutOfCanvas = (target) => {
    if (isTargetOutOfContainer(target, fullbleedContainer)) {
      deleteSelectedElements();
      return true;
    }
    return false;
  };

  const visuallyHideHandles =
    selectedElement.width <= resizeRules.minWidth ||
    selectedElement.height <= resizeRules.minHeight;

  const classNames = classnames('default-moveable', {
    'hide-handles': hideHandles,
    'visually-hide-handles': visuallyHideHandles,
    'type-text': selectedElement.type === 'text',
  });
  const _dragProps = useDrag({
    handleElementOutOfCanvas,
    setIsDragging,
    resetMoveable,
    selectedElement,
    updateSelectedElements,
    setTransformStyle,
    frame,
  });
  // No dragging in edit mode.
  const dragProps = isEditMode
    ? {
        onDrag: () => false,
        onDragEnd: () => false,
        onDragStart: () => false,
      }
    : _dragProps;

  const resizeProps = useResize({
    handleElementOutOfCanvas,
    resetMoveable,
    selectedElement,
    setTransformStyle,
    frame,
    isResizingFromCorner,
    setIsResizingFromCorner,
    isEditMode,
    pushTransform,
    updateSelectedElements,
  });

  const rotateProps = useRotate({
    handleElementOutOfCanvas,
    selectedElement,
    isEditMode,
    pushTransform,
    frame,
    setTransformStyle,
    resetMoveable,
    updateSelectedElements,
  });

  return (
    <Moveable
      className={classNames}
      zIndex={0}
      ref={useCombinedRefs(moveable, editMoveableRef)}
      target={targetEl}
      edge={true}
      draggable={actionsEnabled}
      resizable={actionsEnabled && !hideHandles}
      rotatable={actionsEnabled && !hideHandles}
      {...dragProps}
      {...resizeProps}
      {...rotateProps}
      origin={false}
      pinchable={true}
      keepRatio={isResizingFromCorner}
      renderDirections={getRenderDirections(resizeRules)}
      {...useSnapping({
        otherNodes,
        canSnap: canSnap && actionsEnabled,
      })}
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

SingleSelectionMoveable.propTypes = {
  selectedElement: PropTypes.object.isRequired,
  targetEl: PropTypes.object.isRequired,
  pushEvent: PropTypes.object,
  isEditMode: PropTypes.bool,
  editMoveableRef: PropTypes.object,
};

export default SingleSelectionMoveable;
