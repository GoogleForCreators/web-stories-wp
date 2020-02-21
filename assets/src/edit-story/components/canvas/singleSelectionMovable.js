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
import { useStory } from '../../app';
import Movable from '../movable';
import calculateFitTextFontSize from '../../utils/calculateFitTextFontSize';
import objectWithout from '../../utils/objectWithout';
import getAdjustedElementDimensions from '../../utils/getAdjustedElementDimensions';
import { useTransform } from '../transform';
import { useUnits } from '../../units';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../constants';
import { getDefinitionForType } from '../../elements';
import useCanvas from './useCanvas';

const ALL_HANDLES = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];

function SingleSelectionMovable({ selectedElement, targetEl, pushEvent }) {
  const moveable = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingFromCorner, setIsResizingFromCorner] = useState(true);

  const {
    actions: { updateSelectedElements },
    state: { currentPage },
  } = useStory();
  const {
    state: {
      pageSize: { width: canvasWidth, height: canvasHeight },
      nodesById,
    },
  } = useCanvas();
  const {
    actions: { getBox, dataToEditorY, editorToDataX, editorToDataY },
  } = useUnits();
  const {
    actions: { pushTransform },
  } = useTransform();

  const minMaxFontSize = {
    minFontSize: dataToEditorY(MIN_FONT_SIZE),
    maxFontSize: dataToEditorY(MAX_FONT_SIZE),
  };

  const otherNodes = Object.values(
    objectWithout(nodesById, [selectedElement.id])
  );

  const latestEvent = useRef();

  useEffect(() => {
    latestEvent.current = pushEvent;
  }, [pushEvent]);

  useEffect(() => {
    if (moveable.current) {
      // If we have persistent event then let's use that, ensuring the targets match.
      if (
        latestEvent.current &&
        targetEl.contains(latestEvent.current.target)
      ) {
        moveable.current.moveable.dragStart(latestEvent.current);
      }
      moveable.current.updateRect();
    }
  }, [targetEl, moveable]);

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (moveable.current) {
      moveable.current.updateRect();
    }
  });

  const box = getBox(selectedElement);
  const frame = {
    translate: [0, 0],
    rotate: box.rotationAngle,
    resize: [0, 0],
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
    frame.translate = [0, 0];
    frame.resize = [0, 0];
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

  const isTextElement = 'text' === selectedElement.type;
  const shouldAdjustFontSize =
    isTextElement && selectedElement.content.length && isResizingFromCorner;

  const { isMedia } = getDefinitionForType(selectedElement.type);
  const isBackgroundElement =
    selectedElement.id === currentPage.backgroundElementId;
  const actionsEnabled = !selectedElement.isFill && !isBackgroundElement;
  return (
    <Movable
      className="default-movable"
      zIndex={0}
      ref={moveable}
      target={targetEl}
      draggable={actionsEnabled}
      resizable={actionsEnabled && !isDragging}
      rotatable={actionsEnabled && !isDragging}
      onDrag={({ target, beforeTranslate }) => {
        frame.translate = beforeTranslate;
        setTransformStyle(target);
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
      onResize={({ target, width, height, drag, direction }) => {
        const isResizingWidth = direction[0] !== 0 && direction[1] === 0;
        const isResizingHeight = direction[0] === 0 && direction[1] !== 0;
        let newHeight = height;
        let newWidth = width;
        if (isTextElement && (isResizingWidth || isResizingHeight)) {
          const adjustedDimensions = getAdjustedElementDimensions({
            element: target,
            content: selectedElement.content,
            width,
            height,
            fixedMeasure: isResizingWidth ? 'width' : 'height',
          });
          newWidth = adjustedDimensions.width;
          newHeight = adjustedDimensions.height;
        }
        target.style.width = `${newWidth}px`;
        target.style.height = `${newHeight}px`;
        frame.resize = [newWidth, newHeight];
        frame.translate = drag.beforeTranslate;
        if (shouldAdjustFontSize) {
          target.style.fontSize = calculateFitTextFontSize(
            target.firstChild,
            height,
            width,
            minMaxFontSize
          );
        }
        setTransformStyle(target);
      }}
      onResizeEnd={({ target }) => {
        const [editorWidth, editorHeight] = frame.resize;
        const [deltaX, deltaY] = frame.translate;
        if (editorWidth !== 0 && editorHeight !== 0) {
          const properties = {
            width: editorToDataX(editorWidth),
            height: editorToDataY(editorHeight),
            x: selectedElement.x + editorToDataX(deltaX),
            y: selectedElement.y + editorToDataY(deltaY),
          };
          if (shouldAdjustFontSize) {
            properties.fontSize = editorToDataY(
              calculateFitTextFontSize(
                target.firstChild,
                editorHeight,
                editorWidth,
                minMaxFontSize
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
      keepRatio={isMedia && isResizingFromCorner}
      renderDirections={ALL_HANDLES}
      snappable={true}
      snapElement={true}
      snapHorizontal={true}
      snapVertical={true}
      snapCenter={true}
      horizontalGuidelines={
        actionsEnabled && [0, canvasHeight / 2, canvasHeight]
      }
      verticalGuidelines={actionsEnabled && [0, canvasWidth / 2, canvasWidth]}
      elementGuidelines={actionsEnabled && otherNodes}
    />
  );
}

SingleSelectionMovable.propTypes = {
  selectedElement: PropTypes.object,
  targetEl: PropTypes.object.isRequired,
  pushEvent: PropTypes.object,
};

export default SingleSelectionMovable;
