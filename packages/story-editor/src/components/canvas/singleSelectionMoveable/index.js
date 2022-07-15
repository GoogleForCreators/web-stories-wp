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
import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useMemo,
  useBatchingCallback,
  useCombinedRefs,
} from '@googleforcreators/react';
import classnames from 'classnames';
import {calcRotatedResizeOffset, useUnits} from '@googleforcreators/units';
import { useGlobalIsKeyPressed } from '@googleforcreators/design-system';
import { useTransform } from '@googleforcreators/transform';
import { Moveable } from '@googleforcreators/moveable';

/**
 * Internal dependencies
 */
import { useStory, useCanvas, useLayout } from '../../../app';
import objectWithout from '../../../utils/objectWithout';
import useSnapping from '../utils/useSnapping';
import useUpdateSelectionRectangle from '../utils/useUpdateSelectionRectangle';
import useWindowResizeHandler from '../useWindowResizeHandler';
import useDrag from './useDrag';
import useResize from './useResize';
import useRotate from './useRotate';

const SingleSelectionMoveable = forwardRef(function SingleSelectionMoveable(
  { selectedElement, targetEl, pushEvent, isEditMode, ...props },
  ref
) {
  const moveable = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const nodesById = useCanvas(({ state }) => state.nodesById);
  const getBox = useUnits(({ actions }) => actions.getBox);
  const pushTransform = useTransform(({ actions }) => actions.pushTransform);
  const { zoomSetting, scrollLeft, scrollTop } = useLayout(({ state }) => ({
    zoomSetting: state.zoomSetting,
    scrollLeft: state.scrollLeft,
    scrollTop: state.scrollTop,
  }));

  const { isLocked, rotationAngle } = selectedElement;
  const actionsEnabled = !selectedElement.isBackground && !isLocked;

  const latestEvent = useRef();

  const backgroundElementId = useStory(
    ({ state }) => state.currentPage?.elements[0]?.id
  );

  // ⇧ key throttles rotating 30 degrees at a time / forces locking ratio when resizing.
  const isShiftPressed = useGlobalIsKeyPressed('shift');

  useWindowResizeHandler(moveable);

  useEffect(() => {
    latestEvent.current = pushEvent;
  }, [pushEvent]);

  // If scroll ever updates, update rect now
  useEffect(() => {
    if (!moveable.current) {
      return;
    }
    moveable.current.updateRect();
  }, [scrollLeft, scrollTop]);

  // If zoom ever updates, update selection rect
  useUpdateSelectionRectangle(moveable, [zoomSetting]);

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
  const frame = useMemo(
    () => ({
      translate: [0, 0],
      rotate: box.rotationAngle,
      resize: [0, 0],
      updates: null,
    }),
    [box.rotationAngle]
  );

  const { border = {} } = selectedElement;
  const { left = 0, right = 0, top = 0, bottom = 0 } = border;
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

    // If the element has a border, we have to take it out of the resizing values
    // since the border is in pixels and thus not stored within width/height.
    let frameForEl = { ...frame };
    if (frame.resize[0] || frame.resize[1]) {
      const elWidth = frame.resize[0] - (left + right);
      const elHeight = frame.resize[1] - (top + bottom);
      frameForEl = {
        ...frame,
        resize: [elWidth, elHeight],
      };
    }
    pushTransform(selectedElement.id, frameForEl);
  };

  /**
   * Resets Moveable once the action is done, sets the initial values.
   *
   * @param {Object} target Target element.
   */
  const resetMoveable = useBatchingCallback(
    (target) => {
      if (!moveable.current) {
        return;
      }

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
      moveable.current.updateRect();
    },
    [frame, pushTransform, selectedElement.id]
  );

  const canSnap = !isEditMode;
  const hideHandles = isDragging;

  const classNames = classnames('default-moveable', {
    'hide-handles': hideHandles,
    'type-text': selectedElement.type === 'text',
    immoveable: isLocked,
  });
  const _dragProps = useDrag({
    setIsDragging,
    resetMoveable,
    selectedElement,
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
    resetMoveable,
    selectedElement,
    setTransformStyle,
    frame,
    isEditMode,
    pushTransform,
    classNames,
    forceLockRatio: isShiftPressed,
  });

  const rotateProps = useRotate({
    selectedElement,
    isEditMode,
    pushTransform,
    frame,
    setTransformStyle,
    resetMoveable,
    throttleRotation: isShiftPressed,
  });

  // Get a list of all the other non-bg nodes
  const otherNodes = Object.values(
    objectWithout(nodesById, [selectedElement.id, backgroundElementId])
  );

  const snapProps = useSnapping({
    otherNodes,
    canSnap: canSnap && actionsEnabled,
    isDragging,
  });

  const isResizable =
    actionsEnabled && !hideHandles && true !== selectedElement.lockDimensions;
  const isRotatable =
    actionsEnabled &&
    !hideHandles &&
    false !== selectedElement.supportsRotation;

  return (
    <Moveable
      {...props}
      className={classNames}
      zIndex={0}
      ref={useCombinedRefs(moveable, ref)}
      target={targetEl}
      edge
      draggable={actionsEnabled}
      resizable={isResizable}
      rotatable={isRotatable}
      {...dragProps}
      {...resizeProps}
      {...rotateProps}
      {...snapProps}
      origin={false}
      pinchable
    />
  );
});

SingleSelectionMoveable.propTypes = {
  selectedElement: PropTypes.object.isRequired,
  targetEl: PropTypes.object.isRequired,
  pushEvent: PropTypes.object,
  isEditMode: PropTypes.bool,
  editMoveableRef: PropTypes.object,
};

export default SingleSelectionMoveable;
