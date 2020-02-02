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

/**
 * WordPress dependencies
 */
import { useRef, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Movable from '../movable';
import { useStory } from '../../app/story';
import objectWithout from '../../utils/objectWithout';
import calculateFitTextFontSize from '../../utils/calculateFitTextFontSize';
import { useUnits } from '../../units';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../constants';
import useCanvas from './useCanvas';

const CORNER_HANDLES = ['nw', 'ne', 'sw', 'se'];

function MultiSelectionMovable({ selectedElements }) {
  const moveable = useRef();

  const {
    actions: { updateElementsById },
  } = useStory();
  const {
    actions: { pushTransform },
    state: {
      pageSize: { width: canvasWidth, height: canvasHeight },
      nodesById,
    },
  } = useCanvas();
  const {
    actions: { dataToEditorY, editorToDataX, editorToDataY },
  } = useUnits();

  const [isDragging, setIsDragging] = useState(false);

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (moveable.current) {
      moveable.current.updateRect();
    }
  }, [selectedElements, moveable, nodesById]);

  const minMaxFontSize = {
    minFontSize: dataToEditorY(MIN_FONT_SIZE),
    maxFontSize: dataToEditorY(MAX_FONT_SIZE),
  };

  // Create targets list including nodes and also necessary attributes.
  const targetList = selectedElements.map((element) => ({
    node: nodesById[element.id],
    id: element.id,
    x: element.x,
    y: element.y,
    rotationAngle: element.rotationAngle,
    type: element.type,
    content: element.content,
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
    ? targetList.map((target) => ({
        translate: [0, 0],
        rotate: target.rotationAngle,
        resize: [0, 0],
      }))
    : [];

  /**
   * Resets Movable once the action is done, sets the initial values.
   */
  const resetMoveable = () => {
    targetList.forEach(({ id, node }, i) => {
      frames[i].translate = [0, 0];
      frames[i].resize = [0, 0];
      node.style.transform = '';
      node.style.width = '';
      node.style.height = '';
      pushTransform(id, null);
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
      const [editorWidth, editorHeight] = frame.resize;
      const properties = {
        x: targetList[i].x + editorToDataX(frame.translate[0]),
        y: targetList[i].y + editorToDataY(frame.translate[1]),
      };
      if (isRotate) {
        properties.rotationAngle = frame.rotate;
      }
      const didResize = editorWidth !== 0 && editorHeight !== 0;
      if (isResize && didResize) {
        properties.width = editorToDataX(editorWidth);
        properties.height = editorToDataY(editorHeight);
        const isText = 'text' === targetList[i].type;
        if (isText) {
          properties.fontSize = editorToDataY(
            calculateFitTextFontSize(
              target.firstChild,
              editorHeight,
              editorWidth,
              minMaxFontSize
            )
          );
        }
      }
      updateElementsById({ elementIds: [targetList[i].id], properties });
    });
    resetMoveable();
  };

  return (
    <Movable
      className="default-movable"
      ref={moveable}
      zIndex={0}
      target={targetList.map(({ node }) => node)}
      draggable={true}
      // Making resizable depend on state caused a bug where the
      // center of gravity for rotation moves to the top left,
      // see https://github.com/daybrush/moveable/issues/168
      // once fixed these should change to !isDragging
      resizable={true /** should be !isDragging */}
      rotatable={isDragging}
      onDragGroup={({ events }) => {
        events.forEach(({ target, beforeTranslate }, i) => {
          const sFrame = frames[i];
          sFrame.translate = beforeTranslate;
          setTransformStyle(targetList[i].id, target, sFrame);
        });
      }}
      onDragGroupStart={({ events }) => {
        setIsDragging(true);
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
          sFrame.rotate = beforeRotate;
          sFrame.translate = drag.beforeTranslate;
          setTransformStyle(targetList[i].id, target, sFrame);
        });
      }}
      onRotateGroupEnd={({ targets }) => {
        onGroupEventEnd({ targets, isRotate: true });
      }}
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
        events.forEach(({ target, width, height, drag }, i) => {
          const sFrame = frames[i];
          const isText = 'text' === targetList[i].type;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          if (isText) {
            // For text: update font size, too.
            target.style.fontSize = calculateFitTextFontSize(
              target.firstChild,
              height,
              width,
              minMaxFontSize
            );
          }
          sFrame.translate = drag.beforeTranslate;
          sFrame.resize = [width, height];
          setTransformStyle(targetList[i].id, target, sFrame);
        });
      }}
      onResizeGroupEnd={({ targets }) => {
        onGroupEventEnd({ targets, isResize: true });
      }}
      renderDirections={CORNER_HANDLES}
      snappable={true}
      snapElement={true}
      snapHorizontal={true}
      snapVertical={true}
      snapCenter={true}
      horizontalGuidelines={[0, canvasHeight / 2, canvasHeight]}
      verticalGuidelines={[0, canvasWidth / 2, canvasWidth]}
      elementGuidelines={otherNodes}
    />
  );
}

MultiSelectionMovable.propTypes = {
  selectedElements: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MultiSelectionMovable;
