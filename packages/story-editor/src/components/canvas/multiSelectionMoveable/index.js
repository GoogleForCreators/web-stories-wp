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
  useCombinedRefs,
  useEffect,
  useRef,
  useState,
} from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { useTransform } from '@googleforcreators/transform';
import { Moveable } from '@googleforcreators/moveable';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useCanvas, useLayout, useStory } from '../../../app';
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
  const [isDragging, setIsDragging] = useState(false);
  const isAnyLayerLocked = selectedElements.some((el) => el.isLocked);
  const actionsEnabled = !isAnyLayerLocked;

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

  /**
   * Set style to the element.
   *
   * @param {Object} element Target element's id.
   * @param {Object} target Target element node to update.
   * @param {Object} frame Properties from the frame for that specific element.
   */
  const setTransformStyle = (element, target, frame) => {
    const { id, border } = element;
    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;
    // If the element has a border, we have to take it out of the resizing values
    // since the border is in pixels and thus not stored within width/height.
    const { left = 0, right = 0, top = 0, bottom = 0 } = border || {};
    let frameForEl = { ...frame };
    if (frame.resize[0] || frame.resize[1]) {
      const elWidth = frame.resize[0] - (left + right);
      const elHeight = frame.resize[1] - (top + bottom);
      frameForEl = {
        ...frame,
        resize: [elWidth, elHeight],
      };
    }
    pushTransform(id, frameForEl);
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
        // We remove the border from the width/height before updating the element since border is not included in those.
        const { border } = element;
        const { left = 0, right = 0, top = 0, bottom = 0 } = border || {};
        const newWidth = editorToDataX(editorWidth - (left + right));
        const newHeight = editorToDataY(editorHeight - (top + bottom));
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

  const classNames = classnames('default-moveable', {
    'hide-handles': isDragging,
    immoveable: isAnyLayerLocked,
  });

  return (
    <Moveable
      {...props}
      className={classNames}
      ref={combinedRef}
      zIndex={0}
      target={targetList.map(({ node }) => node)}
      renderDirections={CORNER_HANDLES}
      {...dragProps}
      draggable={actionsEnabled}
      resizable={actionsEnabled}
      rotatable={actionsEnabled}
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
