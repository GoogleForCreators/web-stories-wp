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
import { useRef, useEffect } from 'react';

/**
 * Internal dependencies
 */
import Moveable from '../../moveable';
import { useStory } from '../../../app';
import objectWithout from '../../../utils/objectWithout';
import { useTransform } from '../../transform';
import { useUnits } from '../../../units';
import { getDefinitionForType } from '../../../elements';
import isTargetOutOfContainer from '../../../utils/isTargetOutOfContainer';
import useCanvas from '../useCanvas';
import useSnapping from '../utils/useSnapping';
import useDrag from './useDrag';
import useResize from './useResize';
import useRotate from './useRotate';

const CORNER_HANDLES = ['nw', 'ne', 'sw', 'se'];

function MultiSelectionMoveable({ selectedElements }) {
  const moveable = useRef();

  const { updateElementsById, deleteElementsById } = useStory((state) => ({
    updateElementsById: state.actions.updateElementsById,
    deleteElementsById: state.actions.deleteElementsById,
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

  const {
    actions: { pushTransform },
  } = useTransform();

  // Update moveable with whatever properties could be updated outside moveable
  // itself.
  useEffect(() => {
    if (moveable.current) {
      moveable.current.updateRect();
    }
  }, [selectedElements, moveable, nodesById]);

  // Create targets list including nodes and also necessary attributes.
  const targetList = selectedElements.map((element) => ({
    element,
    node: nodesById[element.id],
    updateForResizeEvent: getDefinitionForType(element.type)
      .updateForResizeEvent,
  }));

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
    updateElementsById({
      elementIds: Object.keys(updates),
      properties: (currentProperties) => updates[currentProperties.id],
    });
    if (toRemove.length > 0) {
      deleteElementsById({ elementIds: toRemove });
    }
    resetMoveable();
  };

  const snapProps = useSnapping({ canSnap: true, otherNodes });
  const dragProps = useDrag({
    targetList,
    frames,
    setTransformStyle,
    onGroupEventStart,
    onGroupEventEnd,
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

  // Not all targets have been defined yet.
  if (targetList.some(({ node }) => node === undefined)) {
    return null;
  }

  return (
    <Moveable
      className={'default-moveable'}
      ref={moveable}
      zIndex={0}
      target={targetList.map(({ node }) => node)}
      draggable={true}
      resizable={true}
      rotatable={true}
      renderDirections={CORNER_HANDLES}
      {...dragProps}
      {...rotateProps}
      {...resizeProps}
      {...snapProps}
    />
  );
}

MultiSelectionMoveable.propTypes = {
  selectedElements: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MultiSelectionMoveable;
