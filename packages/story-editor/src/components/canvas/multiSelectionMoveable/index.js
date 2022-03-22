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
  useCombinedRefs,
} from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { useTransform } from '@googleforcreators/transform';
import { Moveable } from '@googleforcreators/moveable';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory, useCanvas, useLayout } from '../../../app';
import objectWithout from '../../../utils/objectWithout';
import isTargetOutOfContainer from '../../../utils/isTargetOutOfContainer';
import useSnapping from '../utils/useSnapping';
import useUpdateSelectionRectangle from '../utils/useUpdateSelectionRectangle';
import useWindowResizeHandler from '../useWindowResizeHandler';
import useDrag from './useDrag';
import useResize from './useResize';
import useRotate from './useRotate';

const CORNER_HANDLES = ['nw', 'ne', 'sw', 'se'];

const MultiSelectionMoveable = forwardRef(function MultiSelectionMoveable(
  { selectedElements, ...props },
  ref
) {
  const moveable = useRef();

  const { updateElementsById, deleteElementsById, backgroundElement } =
    useStory((state) => ({
      updateElementsById: state.actions.updateElementsById,
      deleteElementsById: state.actions.deleteElementsById,
      backgroundElement: state.state.currentPage.elements[0] ?? {},
    }));
  const { nodesById, fullbleedContainer } = useCanvas(
    ({ state: { nodesById, fullbleedContainer } }) => ({
      fullbleedContainer,
      nodesById,
    })
  );
  const { editorToDataX, editorToDataY } = useUnits((state) => ({
    editorToDataX: state.actions.editorToDataX,
    editorToDataY: state.actions.editorToDataY,
  }));
  const { zoomSetting, scrollLeft, scrollTop } = useLayout(
    ({ state: { zoomSetting, scrollLeft, scrollTop } }) => ({
      zoomSetting,
      scrollLeft,
      scrollTop,
    })
  );

  const {
    actions: { pushTransform },
  } = useTransform();

  useWindowResizeHandler(moveable);

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (moveable.current) {
      moveable.current.updateRect();
    }
  }, [selectedElements, moveable, nodesById, scrollLeft, scrollTop]);

  // If zoom ever updates, update selection rect
  useUpdateSelectionRectangle(moveable, [zoomSetting]);

  // Create targets list including nodes and also necessary attributes.
  const targetList = selectedElements.map((element) => ({
    element,
    node: nodesById[element.id],
    updateForResizeEvent: getDefinitionForType(element.type)
      .updateForResizeEvent,
  }));

  const [isDragging, setIsDragging] = useState(false);

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
   * Resets Moveable once the action is done, sets the initial values.
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
    targets.forEach((target, i) => {
      const { element, updateForResizeEvent } = targetList[i];
      if (isTargetOutOfContainer(target, fullbleedContainer)) {
        toRemove.push(element.id);
        return;
      }
      // Update position in all cases.
      const frame = frames[i];
      const { direction } = frame;

      const roundToZero = (num) => (Math.abs(num) <= 1 ? 0 : num);
      const properties = {
        x: roundToZero(element.x + editorToDataX(frame.translate[0])),
        y: roundToZero(element.y + editorToDataY(frame.translate[1])),
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
    updateElementsById({
      elementIds: Object.keys(updates),
      properties: (currentProperties) => updates[currentProperties.id],
    });
    if (toRemove.length > 0) {
      deleteElementsById({ elementIds: toRemove });
    }
    resetMoveable();
  };

  // Get a list of all the other non-bg nodes
  const otherNodes = Object.values(
    objectWithout(nodesById, [
      ...selectedElements.map((element) => element.id),
      backgroundElement.id,
    ])
  );

  const snapProps = useSnapping({
    canSnap: true,
    otherNodes,
  });
  const dragProps = useDrag({
    targetList,
    frames,
    setTransformStyle,
    onGroupEventStart,
    onGroupEventEnd,
    isDragging,
    setIsDragging,
  });
  const resizeProps = useResize({
    onGroupEventEnd,
    targetList,
    setTransformStyle,
    frames,
  });
  const rotateProps = useRotate({
    onGroupEventStart,
    setTransformStyle,
    onGroupEventEnd,
    targetList,
    frames,
  });

  const combinedRef = useCombinedRefs(moveable, ref);

  // Not all targets have been defined yet.
  if (targetList.some(({ node }) => node === undefined)) {
    return null;
  }

  return (
    <Moveable
      {...props}
      className="default-moveable"
      ref={combinedRef}
      zIndex={0}
      target={targetList.map(({ node }) => node)}
      draggable
      resizable
      rotatable
      renderDirections={CORNER_HANDLES}
      {...dragProps}
      {...rotateProps}
      {...resizeProps}
      {...snapProps}
    />
  );
});

MultiSelectionMoveable.propTypes = {
  selectedElements: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MultiSelectionMoveable;
