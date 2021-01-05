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
import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { editorToDataX, editorToDataY } from '../../../../units';
import Moveable from '../../../moveable';
import { useDropTargets } from '../../../dropTargets';
import { useLayout } from '../../../../app/layout';
import useInsertElement from '../../../canvas/useInsertElement';
import { useCanvas, useInsertTextSet } from '../../../canvas';
import isMouseUpAClick from '../../../../utils/isMouseUpAClick';
import InOverlay from '../../../overlay';
import isTargetOutOfContainer from '../../../../utils/isTargetOutOfContainer';
import { useKeyDownEffect } from '../../../keyboard';

const TargetBox = styled.div`
  position: absolute;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  max-width: 100%;
  max-height: 100%;
  top: 0;
  z-index: 1;
`;

function LibraryMoveable({
  type,
  elementProps = {},
  handleDrag,
  handleDragEnd,
  onClick,
  cloneElement,
  cloneProps,
  previewSize,
  elements = [],
  active = false,
}) {
  const CloneElement = cloneElement;

  const [isDragging, setIsDragging] = useState(false);
  const [didManuallyReset, setDidManuallyReset] = useState(false);
  const [hover, setHover] = useState(false);
  const cloneRef = useRef(null);
  const targetBoxRef = useRef(null);
  const overlayRef = useRef(null);

  const { pageSize } = useLayout(({ state }) => ({
    pageSize: state.canvasPageSize,
  }));

  const insertElement = useInsertElement();
  const { fullbleedContainer, pageContainer } = useCanvas((state) => ({
    fullbleedContainer: state.state.fullbleedContainer,
    pageContainer: state.state.pageContainer,
    nodesById: state.state.nodesById,
  }));

  const {
    state: { activeDropTargetId },
    actions: { setDraggingResource },
  } = useDropTargets();

  const frame = {
    translate: [0, 0],
  };

  const { insertTextSetByOffset } = useInsertTextSet();

  const eventTracker = useRef({});
  const startEventTracking = (evt) => {
    const { timeStamp, clientX, clientY } = evt;
    eventTracker.current = {
      timeStamp,
      clientX,
      clientY,
    };
  };

  const resetMoveable = useCallback(() => {
    targetBoxRef.current.style.transform = null;
    cloneRef.current.style.transform = null;
    // Hide the clone, too.
    cloneRef.current.style.opacity = 0;
    setIsDragging(false);
    setDraggingResource(null);
  }, [setDraggingResource]);

  // We only need to use this effect while dragging since the active element is document.body
  // and using just that interferes with other handlers.
  useKeyDownEffect(
    isDragging ? document.body : { current: null },
    'esc',
    () => {
      setDidManuallyReset(true);
      resetMoveable();
    },
    [isDragging, resetMoveable]
  );

  const onDrag = ({ beforeTranslate, inputEvent }) => {
    // This is needed if the user clicks "Esc" but continues dragging.
    if (didManuallyReset) {
      return false;
    }
    frame.translate = beforeTranslate;
    // Don't display the clone right away since otherwise it will be triggered for a click as well.
    if (
      cloneRef.current &&
      inputEvent.timeStamp - eventTracker.current.timeStamp > 300
    ) {
      if (cloneRef.current.style.opacity !== 1 && !activeDropTargetId) {
        // We're not doing it in `onDragStart` since otherwise on clicking it would appear, too.
        cloneRef.current.style.opacity = 1;
      } else if (activeDropTargetId) {
        // If there's an active drop target, let's hide the clone.
        cloneRef.current.style.opacity = 0;
      }
      cloneRef.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
      // We also have to move the original target ref for snapping to work.
      targetBoxRef.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }
    handleDrag?.(inputEvent);
    return undefined;
  };

  const getTargetOffset = useCallback(() => {
    const overlay = overlayRef.current;
    let offsetX = 0,
      offsetY = 0;
    for (
      let offsetNode = overlay;
      offsetNode;
      offsetNode = offsetNode.offsetParent
    ) {
      offsetX += offsetNode.offsetLeft;
      offsetY += offsetNode.offsetTop;
    }
    return {
      offsetX,
      offsetY,
    };
  }, [overlayRef]);

  const onDragStart = ({ set, inputEvent }) => {
    setDidManuallyReset(false);
    // Note: we can't set isDragging true here since a "click" is also considered dragStart.
    set(frame.translate);
    setIsDragging(true);
    startEventTracking(inputEvent);

    // Position the clone that's being dragged.
    const { offsetX, offsetY } = getTargetOffset();
    const targetBox = targetBoxRef.current.getBoundingClientRect();
    let x1 = targetBox.left - offsetX;
    let y1 = targetBox.top - offsetY;
    // In case of shapes, the clone is larger than the preview
    // so we position it to center.
    if ('shape' === type) {
      x1 = x1 - (cloneProps.width - targetBox.width) / 2;
      y1 = y1 - (cloneProps.height - targetBox.height) / 2;
    }
    cloneRef.current.style.left = `${x1}px`;
    cloneRef.current.style.top = `${y1}px`;
  };

  const onDragEnd = ({ inputEvent }) => {
    if (didManuallyReset) {
      return false;
    }
    if (isMouseUpAClick(inputEvent, eventTracker.current)) {
      resetMoveable();
      onClick();
      return false;
    }
    // We only skip Moveable onDragEnd handling if there's an active drop target ID.
    if (activeDropTargetId && handleDragEnd) {
      handleDragEnd();
      // Only continue if the clone is at least partially on the page.
    } else if (!isTargetOutOfContainer(cloneRef.current, fullbleedContainer)) {
      const {
        x,
        y,
        width: w,
        height: h,
      } = cloneRef.current.getBoundingClientRect();
      const { x: pageX, y: pageY } = pageContainer.getBoundingClientRect();

      if (type === 'textSet') {
        insertTextSetByOffset(elements, {
          offsetX: editorToDataX(x - pageX, pageSize.width),
          offsetY: editorToDataY(y - pageY, pageSize.height),
        });
      } else {
        insertElement(type, {
          ...elementProps,
          x: editorToDataX(x - pageX, pageSize.width),
          y: editorToDataY(y - pageY, pageSize.height),
          width: editorToDataX(w, pageSize.width),
          height: editorToDataY(h, pageSize.height),
        });
      }
    }
    resetMoveable();
    return undefined;
  };

  // @todo Add this back once all elements are using Moveable in the Library.
  /*const { offsetX: snappingOffsetX } = getTargetOffset();
  const snapProps = useSnapping({
    isDragging: true,
    canSnap: true,
    otherNodes: Object.values(objectWithout(nodesById, [backgroundElement.id])),
    snappingOffsetX,
  });*/

  const targetSize = previewSize ?? cloneProps;
  const { width, height } = targetSize;
  return (
    <>
      <TargetBox
        ref={targetBoxRef}
        width={width}
        height={height}
        onClick={onClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      />
      {(isDragging || active || hover) && (
        <>
          <InOverlay
            ref={overlayRef}
            zIndex={1}
            pointerEvents="initial"
            render={() => {
              return <CloneElement ref={cloneRef} {...cloneProps} />;
            }}
          />
          <Moveable
            className="default-moveable hide-handles"
            target={targetBoxRef.current}
            edge={true}
            draggable={true}
            origin={false}
            pinchable={true}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
          />
        </>
      )}
    </>
  );
}

LibraryMoveable.propTypes = {
  type: PropTypes.string.isRequired,
  handleDrag: PropTypes.func,
  handleDragEnd: PropTypes.func,
  elementProps: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  cloneElement: PropTypes.object.isRequired,
  cloneProps: PropTypes.object.isRequired,
  active: PropTypes.bool,
  previewSize: PropTypes.object,
  elements: PropTypes.array,
};

export default LibraryMoveable;
