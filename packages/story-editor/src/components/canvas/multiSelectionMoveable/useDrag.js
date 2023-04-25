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
import { useRef } from '@googleforcreators/react';
import { areEventsDragging } from '@googleforcreators/moveable';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../../dropTargets';
import { useCanvas } from '../../../app';

function useMultiSelectionDrag({
  targetList,
  frames,
  setTransformStyle,
  onGroupEventStart,
  onGroupEventEnd,
  isDragging,
  setIsDragging,
}) {
  const { draggingResource } = useDropTargets(
    ({ state: { draggingResource } }) => ({
      draggingResource,
    })
  );
  const { nodesById, handleSelectElement } = useCanvas(
    ({ state: { nodesById }, actions: { handleSelectElement } }) => ({
      nodesById,
      handleSelectElement,
    })
  );

  const eventTracker = useRef({});

  // Let's check if we consider this a drag or a click, In case of a click handle click instead.
  // We are doing this here in Moveable selection since it takes over the mouseup event
  // and it can be captured here and not in the frame element.
  // @todo Add integration test for this!
  const clickHandled = (inputEvent) => {
    if (areEventsDragging(eventTracker.current, inputEvent)) {
      // No click was found/handled.
      return false;
    }

    const clickedElement = Object.keys(nodesById).find((id) =>
      nodesById[id].contains(inputEvent.target)
    );
    if (clickedElement) {
      handleSelectElement(clickedElement, inputEvent);
    }
    // Click was handled.
    return true;
  };

  const startEventTracking = (evt) => {
    const { timeStamp, clientX, clientY } = evt;
    eventTracker.current = {
      timeStamp,
      clientX,
      clientY,
    };
  };

  const hideHandles = isDragging || Boolean(draggingResource);

  const onDragGroup = ({ events }) => {
    events.forEach(({ target, beforeTranslate }, i) => {
      const sFrame = frames[i];
      const { element } = targetList[i];
      sFrame.translate = beforeTranslate;
      setTransformStyle(element, target, sFrame);
    });
  };
  const onDragGroupStart = ({ events, inputEvent }) => {
    startEventTracking(inputEvent);
    if (!isDragging) {
      setIsDragging(true);
    }
    onGroupEventStart({ events, isDrag: true });
  };
  const onDragGroupEnd = ({ targets, inputEvent }) => {
    setIsDragging(false);
    if (!clickHandled(inputEvent)) {
      onGroupEventEnd({ targets });
    }
  };

  // When dragging, let's disable resizing, rotating and handles.
  return {
    onDragGroup,
    onDragGroupEnd,
    onDragGroupStart,
    className: `default-moveable ${hideHandles ? 'hide-handles' : ''}`,
    resizable: !hideHandles,
    rotatable: !hideHandles,
  };
}

export default useMultiSelectionDrag;
