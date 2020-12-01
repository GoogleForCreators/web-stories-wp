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

/**
 * Internal dependencies
 */
import { editorToDataX, editorToDataY } from '../../../../units';
import Moveable from '../../../moveable';
import useSnapping from '../../../canvas/utils/useSnapping';
import resourceList from '../../../../utils/resourceList';
import { useDropTargets } from '../../../dropTargets';
import { useLayout } from '../../../../app/layout';
import useInsertElement from '../../../canvas/useInsertElement';
import { useCanvas } from '../../../canvas';
import isMouseUpAClick from '../../../../utils/isMouseUpAClick';
import InOverlay from '../../../overlay';

function LibraryMoveable({
  overlayRef,
  targetBoxRef,
  mediaBaseColor,
  resource,
  thumbnailURL,
  onClick,
  cloneElement,
  cloneProps,
}) {
  const CloneElement = cloneElement;

  const [isDragging, setIsDragging] = useState(false);
  const cloneRef = useRef(null);

  const { pageSize } = useLayout(({ state }) => ({
    pageSize: state.canvasPageSize,
  }));

  const insertElement = useInsertElement();
  const { pageContainer } = useCanvas((state) => ({
    pageContainer: state.state.pageContainer,
  }));

  const {
    state: { activeDropTargetId, draggingResource },
    actions: { handleDrag, handleDrop, setDraggingResource },
  } = useDropTargets();

  const frame = {
    translate: [0, 0],
  };

  const eventTracker = useRef({});
  const startEventTracking = (evt) => {
    const { timeStamp, clientX, clientY } = evt;
    eventTracker.current = {
      timeStamp,
      clientX,
      clientY,
    };
  };

  const onDrag = ({ beforeTranslate, inputEvent }) => {
    if (!draggingResource) {
      // Drop-targets handling.
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      setDraggingResource(resource);
    }
    frame.translate = beforeTranslate;
    if (cloneRef.current) {
      cloneRef.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
      // We also have to move the original target ref for snapping to work.
      targetBoxRef.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }
    handleDrag(resource, inputEvent.clientX, inputEvent.clientY);
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
    // Note: we can't set isDragging true here since a "click" is also considered dragStart.
    set(frame.translate);
    setIsDragging(true);
    startEventTracking(inputEvent);

    // Position the clone that's being dragged.
    const { offsetX, offsetY } = getTargetOffset();
    const mediaBox = targetBoxRef.current.getBoundingClientRect();
    const x1 = mediaBox.left - offsetX;
    const y1 = mediaBox.top - offsetY;
    cloneRef.current.style.left = `${x1}px`;
    cloneRef.current.style.top = `${y1}px`;
  };

  const onDragEnd = ({ inputEvent }) => {
    if (isMouseUpAClick(inputEvent, eventTracker.current)) {
      resetMoveable();
      onClick();
      return false;
    }
    if (activeDropTargetId) {
      handleDrop({
        ...resource,
        baseColor: mediaBaseColor.current,
      });
    } else {
      const {
        x,
        y,
        width: w,
        height: h,
      } = cloneRef.current.getBoundingClientRect();
      const { x: pageX, y: pageY } = pageContainer.getBoundingClientRect();

      // @todo Don't add if dragging out of canvas.
      insertElement(resource.type, {
        resource,
        x: editorToDataX(x - pageX, pageSize.width),
        y: editorToDataY(y - pageY, pageSize.height),
        width: editorToDataX(w, pageSize.width),
        height: editorToDataY(h, pageSize.height),
      });
    }
    resetMoveable();
    return undefined;
  };

  const { offsetX: snappingOffsetX } = getTargetOffset();
  const snapProps = useSnapping({
    isDragging: true,
    canSnap: true,
    otherNodes: [],
    snappingOffsetX,
  });

  const resetMoveable = () => {
    targetBoxRef.current.style.transform = null;
    cloneRef.current.style.transform = null;
    setIsDragging(false);
    setDraggingResource(null);
  };

  // @todo Add 'hide-handles' classname, too.
  return (
    <>
      {isDragging && (
        <InOverlay
          ref={overlayRef}
          zIndex={3}
          pointerEvents="initial"
          render={() => {
            return <CloneElement ref={cloneRef} {...cloneProps} />;
          }}
        />
      )}
      <Moveable
        className="default-moveable"
        zIndex={10}
        target={targetBoxRef.current}
        edge={true}
        draggable={true}
        origin={false}
        pinchable={true}
        {...snapProps}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
    </>
  );
}

LibraryMoveable.propTypes = {
  overlayRef: PropTypes.object,
  targetBoxRef: PropTypes.object,
  mediaBaseColor: PropTypes.object,
  resource: PropTypes.object,
  thumbnailURL: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  cloneElement: PropTypes.object,
  cloneProps: PropTypes.object,
};

export default LibraryMoveable;
