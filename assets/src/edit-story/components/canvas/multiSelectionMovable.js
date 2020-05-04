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
import useCanvas from './useCanvas';

const CORNER_HANDLES = ['nw', 'ne', 'sw', 'se'];

function MultiSelectionMovable({ selectedElements }) {
  const moveable = useRef();

  const {
    actions: { updateElementsById },
  } = useStory();
  const {
    state: {
      pageSize: { width: canvasWidth, height: canvasHeight },
      nodesById,
    },
  } = useCanvas();
  const {
    actions: { editorToDataX, editorToDataY, dataToEditorY },
  } = useUnits();
  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    state: { draggingResource },
  } = useDropTargets();

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
    targets.forEach((target, i) => {
      // Update position in all cases.
      const frame = frames[i];
      const { direction } = frame;
      const { element, updateForResizeEvent } = targetList[i];
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
      updateElementsById({ elementIds: [element.id], properties });
    });
    resetMoveable();
  };

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
        });
      }}
      onDragGroupStart={({ events }) => {
        if (!isDragging) {
          setIsDragging(true);
        }
        onGroupEventStart({ events, isDrag: true });
      }}
      onDragGroupEnd={({ targets }) => {
        setIsDragging(false);
        onGroupEventEnd({ targets });
      }}
      onRotateGroupStart={({ events }) => {
        onGroupEventStart({ events, isRotate: true });
      }}
      onRotateGroup={({ events }) => {
        events.forEach(({ target, beforeRotate, drag }, i) => {
          const sFrame = frames[i];
          const { element } = targetList[i];
          sFrame.rotate = beforeRotate;
          sFrame.translate = drag.beforeTranslate;
          setTransformStyle(element.id, target, sFrame);
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
