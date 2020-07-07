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
import Movable from '../movable';
import { useStory, useDropTargets } from '../../app';
import objectWithout from '../../utils/objectWithout';
import { useTransform } from '../transform';
import { useUnits } from '../../units';
import { getDefinitionForType } from '../../elements';
import { useGlobalIsKeyPressed } from '../keyboard';
import isMouseUpAClick from '../../utils/isMouseUpAClick';
import isTargetOutOfContainer from '../../utils/isTargetOutOfContainer';
import useElementsWithLinks from '../../utils/useElementsWithLinks';
import useCanvas from './useCanvas';

const CORNER_HANDLES = ['nw', 'ne', 'sw', 'se'];

function MultiSelectionMovable({ selectedElements }) {
  const moveable = useRef();

  const eventTracker = useRef({});

  const { updateElementsById, deleteElementsById, currentPage } = useStory(
    (state) => ({
      updateElementsById: state.actions.updateElementsById,
      deleteElementsById: state.actions.deleteElementsById,
      currentPage: state.state.currentPage,
    })
  );
  const {
    canvasWidth,
    canvasHeight,
    nodesById,
    handleSelectElement,
    fullbleedContainer,
    setShowAttachmentBorder,
  } = useCanvas(
    ({
      state: {
        pageSize: { width: canvasWidth, height: canvasHeight },
        nodesById,
        fullbleedContainer,
      },
      actions: { handleSelectElement, setShowAttachmentBorder },
    }) => ({
      canvasWidth,
      canvasHeight,
      fullbleedContainer,
      nodesById,
      handleSelectElement,
      setShowAttachmentBorder,
    })
  );
  const { editorToDataX, editorToDataY, dataToEditorY } = useUnits((state) => ({
    editorToDataX: state.actions.editorToDataX,
    editorToDataY: state.actions.editorToDataY,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    state: { draggingResource },
  } = useDropTargets();

  const { isLinkInAttachmentArea } = useElementsWithLinks();

  const [isDragging, setIsDragging] = useState(false);

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (moveable.current) {
      moveable.current.updateRect();
    }
  }, [selectedElements, moveable, nodesById]);

  // ⌘ key disables snapping
  const canSnap = !useGlobalIsKeyPressed('meta');

  // ⇧ key rotates the element 30 degrees at a time
  const throttleRotation = useGlobalIsKeyPressed('shift');

  // Create targets list including nodes and also necessary attributes.
  const targetList = selectedElements.map((element) => ({
    element,
    node: nodesById[element.id],
    updateForResizeEvent: getDefinitionForType(element.type)
      .updateForResizeEvent,
  }));
  // Not all targets have been defined yet.
  if (targetList.some(({ node }) => node === undefined)) {
    return null;
  }
  const otherNodes = Object.values(
    objectWithout(
      nodesById,
      selectedElements.map((element) => element.id)
    )
  );

  /**
   * Set style to the element.
   *
   * @param {string} id Target element's id.
   * @param {Object} target Target element to update.
   * @param {Object} frame Properties from the frame for that specific element.
   */
  const setTransformStyle = (id, target, frame) => {
    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;
    pushTransform(id, frame);
  };

  const frames = targetList
    ? targetList.map(({ element }) => ({
        translate: [0, 0],
        rotate: element.rotationAngle,
        direction: [0, 0],
        resize: [0, 0],
        updates: null,
      }))
    : [];

  /**
   * Resets Movable once the action is done, sets the initial values.
   */
  const resetMoveable = () => {
    targetList.forEach(({ element, node }, i) => {
      frames[i].direction = [0, 0];
      frames[i].translate = [0, 0];
      frames[i].resize = [0, 0];
      frames[i].updates = null;
      node.style.transform = '';
      node.style.width = '';
      node.style.height = '';
      pushTransform(element.id, null);
    });
    if (moveable.current) {
      moveable.current.updateRect();
    }
  };

  const onGroupEventStart = ({ events, isDrag, isRotate }) => {
    events.forEach((ev, i) => {
      const sFrame = frames[i];
      if (isDrag) {
        ev.set(sFrame.translate);
      } else if (isRotate) {
        ev.set(sFrame.rotate);
      }
    });
  };

  // Update elements once the event has ended.
  const onGroupEventEnd = ({ targets, isRotate, isResize }) => {
    const updates = {};
    const toRemove = [];
    let hasLinkInAttachmentArea = false;
    targets.forEach((target, i) => {
      if (hasLinkInAttachmentArea) {
        return;
      }
      const { element, updateForResizeEvent } = targetList[i];
      if (element.link?.url && isLinkInAttachmentArea(target)) {
        hasLinkInAttachmentArea = true;
      }
      if (isTargetOutOfContainer(target, fullbleedContainer)) {
        toRemove.push(element.id);
        return;
      }
      // Update position in all cases.
      const frame = frames[i];
      const { direction } = frame;
      const properties = {
        x: element.x + editorToDataX(frame.translate[0]),
        y: element.y + editorToDataY(frame.translate[1]),
      };
      if (isRotate) {
        properties.rotationAngle = frame.rotate;
      }
      const [editorWidth, editorHeight] = frame.resize;
      const didResize = editorWidth !== 0 && editorHeight !== 0;
      if (isResize && didResize) {
        const newWidth = editorToDataX(editorWidth);
        const newHeight = editorToDataY(editorHeight);
        properties.width = newWidth;
        properties.height = newHeight;
        if (updateForResizeEvent) {
          Object.assign(
            properties,
            updateForResizeEvent(element, direction, newWidth, newHeight)
          );
        }
      }
      updates[element.id] = properties;
    });
    if (hasLinkInAttachmentArea) {
      resetMoveable();
      setShowAttachmentBorder(false);
      return;
    }
    updateElementsById({
      elementIds: Object.keys(updates),
      properties: (currentProperties) => updates[currentProperties.id],
    });
    if (toRemove.length > 0) {
      deleteElementsById({ elementIds: toRemove });
    }
    resetMoveable();
  };

  const startEventTracking = (evt) => {
    const { timeStamp, clientX, clientY } = evt;
    eventTracker.current = {
      timeStamp,
      clientX,
      clientY,
    };
  };

  // Let's check if we consider this a drag or a click, In case of a click handle click instead.
  // We are doing this here in Moveable selection since it takes over the mouseup event
  // and it can be captured here and not in the frame element.
  // @todo Add integration test for this!
  const clickHandled = (inputEvent) => {
    if (isMouseUpAClick(inputEvent, eventTracker.current)) {
      const clickedElement = Object.keys(nodesById).find((id) =>
        nodesById[id].contains(inputEvent.target)
      );
      if (clickedElement) {
        handleSelectElement(clickedElement, inputEvent);
      }
      // Click was handled.
      return true;
    }
    // No click was found/handled.
    return false;
  };

  const pageHasAttachment = Boolean(currentPage.pageAttachment?.url);
  const hideHandles = isDragging || Boolean(draggingResource);
  return (
    <Movable
      className={`default-movable ${hideHandles ? 'hide-handles' : ''}`}
      ref={moveable}
      zIndex={0}
      target={targetList.map(({ node }) => node)}
      draggable={true}
      resizable={!hideHandles}
      rotatable={!hideHandles}
      onDragGroup={({ events }) => {
        events.forEach(({ target, beforeTranslate }, i) => {
          const sFrame = frames[i];
          const { element } = targetList[i];
          sFrame.translate = beforeTranslate;
          setTransformStyle(element.id, target, sFrame);
          if (pageHasAttachment) {
            setShowAttachmentBorder(
              element.link?.url && isLinkInAttachmentArea(target)
            );
          }
        });
      }}
      onDragGroupStart={({ events, inputEvent }) => {
        startEventTracking(inputEvent);
        if (!isDragging) {
          setIsDragging(true);
        }
        onGroupEventStart({ events, isDrag: true });
      }}
      onDragGroupEnd={({ targets, inputEvent }) => {
        setIsDragging(false);
        if (!clickHandled(inputEvent)) {
          onGroupEventEnd({ targets });
        }
      }}
      onRotateGroupStart={({ events }) => {
        onGroupEventStart({ events, isRotate: true });
      }}
      onRotateGroup={({ events }) => {
        events.forEach(({ target, beforeRotate, drag }, i) => {
          const sFrame = frames[i];
          const { element } = targetList[i];
          sFrame.rotate = ((beforeRotate % 360) + 360) % 360;
          sFrame.translate = drag.beforeTranslate;
          setTransformStyle(element.id, target, sFrame);
          if (pageHasAttachment) {
            setShowAttachmentBorder(
              element.link?.url && isLinkInAttachmentArea(target)
            );
          }
        });
      }}
      onRotateGroupEnd={({ targets }) => {
        onGroupEventEnd({ targets, isRotate: true });
      }}
      throttleRotate={throttleRotation ? 30 : 0}
      onResizeGroupStart={({ events }) => {
        events.forEach((ev, i) => {
          const frame = frames[i];
          ev.setOrigin(['%', '%']);
          if (ev.dragStart) {
            ev.dragStart.set(frame.translate);
          }
        });
      }}
      onResizeGroup={({ events }) => {
        events.forEach(({ target, direction, width, height, drag }, i) => {
          const sFrame = frames[i];
          const { element, updateForResizeEvent } = targetList[i];
          let newHeight = height;
          const newWidth = width;
          let updates = null;
          if (updateForResizeEvent) {
            updates = updateForResizeEvent(
              element,
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
          sFrame.direction = direction;
          sFrame.resize = [newWidth, newHeight];
          sFrame.translate = drag.beforeTranslate;
          sFrame.updates = updates;
          setTransformStyle(element.id, target, sFrame);
          if (pageHasAttachment) {
            setShowAttachmentBorder(
              element.link?.url && isLinkInAttachmentArea(target)
            );
          }
        });
      }}
      onResizeGroupEnd={({ targets }) => {
        onGroupEventEnd({ targets, isResize: true });
      }}
      renderDirections={CORNER_HANDLES}
      snappable={canSnap}
      snapElement={canSnap}
      snapHorizontal={canSnap}
      snapVertical={canSnap}
      snapCenter={canSnap}
      horizontalGuidelines={canSnap ? [0, canvasHeight / 2, canvasHeight] : []}
      verticalGuidelines={canSnap ? [0, canvasWidth / 2, canvasWidth] : []}
      elementGuidelines={otherNodes}
      snapGap={canSnap}
      isDisplaySnapDigit={false}
    />
  );
}

MultiSelectionMovable.propTypes = {
  selectedElements: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MultiSelectionMovable;
