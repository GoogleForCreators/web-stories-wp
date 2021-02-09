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
import styled from 'styled-components';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getDefinitionForType } from '../../elements';
import { useStory, useTransform, useCanvas } from '../../app';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '../../elements/shared';
import { useUnits } from '../../units';
import WithMask from '../../masks/frame';
import WithLink from '../elementLink/frame';
import { useTransformHandler } from '../transform';
import { getElementMask, MaskTypes } from '../../masks';
import useDoubleClick from '../../utils/useDoubleClick';

// @todo: should the frame borders follow clip lines?

// Pointer events are disabled in the display mode to ensure that selection
// can be limited to the mask.
const Wrapper = styled.div`
  ${elementWithPosition}
  ${elementWithSize}
	${elementWithRotation}
  pointer-events: ${({ maskDisabled }) => (maskDisabled ? 'initial' : 'none')};

  &:focus,
  &:active,
  &:hover {
    outline: ${({ theme, hasMask }) =>
      hasMask ? 'none' : `1px solid ${theme.colors.border.selection}`};
  }
`;

const EmptyFrame = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const NOOP = () => {};

function FrameElement({ element }) {
  const { setEditingElement } = useCanvas((state) => ({
    setEditingElement: state.actions.setEditingElement,
  }));
  const { id, type, flip } = element;
  const { Frame, isMaskable, Controls } = getDefinitionForType(type);
  const elementRef = useRef();
  const [hovering, setHovering] = useState(false);
  const {
    state: { isAnythingTransforming },
  } = useTransform();

  const onPointerEnter = () => setHovering(true);
  const onPointerLeave = () => setHovering(false);

  const { setNodeForElement, handleSelectElement, isEditing } = useCanvas(
    (state) => ({
      setNodeForElement: state.actions.setNodeForElement,
      handleSelectElement: state.actions.handleSelectElement,
      isEditing: state.state.isEditing,
    })
  );
  const { selectedElementIds, currentPage, isAnimating } = useStory(
    (state) => ({
      selectedElementIds: state.state.selectedElementIds,
      currentPage: state.state.currentPage,
    })
  );
  const { getBox } = useUnits((state) => ({
    getBox: state.actions.getBox,
  }));

  useLayoutEffect(() => {
    setNodeForElement(id, elementRef.current);
  }, [id, setNodeForElement]);
  const isSelected = selectedElementIds.includes(id);
  const isSingleElement = selectedElementIds.length === 1;
  const box = getBox(element);
  const isBackground = currentPage?.elements[0].id === id;

  const [isTransforming, setIsTransforming] = useState(false);

  useTransformHandler(id, (transform) => {
    const target = elementRef.current;
    if (transform?.dropTargets?.hover !== undefined) {
      target.style.opacity = transform.dropTargets.hover ? 0 : 1;
    }
    setIsTransforming(transform !== null);
  });

  // Media needs separate handler for double click.
  const { isMedia } = getDefinitionForType(type);
  const handleMediaDoubleClick = useCallback(
    (evt) => {
      if (!isSelected) {
        handleSelectElement(id, evt);
      }
      setEditingElement(id);
    },
    [id, setEditingElement, handleSelectElement, isSelected]
  );
  const handleMediaClick = useDoubleClick(NOOP, handleMediaDoubleClick);

  // For elements with no mask, handle events by the wrapper.
  const mask = getElementMask(element);
  const maskDisabled =
    !mask?.type || (isBackground && mask.type !== MaskTypes.RECTANGLE);
  const eventHandlers = {
    onMouseDown: (evt) => {
      if (isSelected) {
        elementRef.current.focus({ preventScroll: true });
      } else {
        handleSelectElement(id, evt);
      }
      if (!isBackground) {
        evt.stopPropagation();
      }
    },
    onFocus: (evt) => {
      if (!isSelected) {
        handleSelectElement(id, evt);
      }
    },
    onPointerEnter,
    onPointerLeave,
    onClick: isMedia ? handleMediaClick(id) : null,
  };

  return (
    <WithLink
      element={element}
      active={!isSelected && hovering && !isAnythingTransforming}
      anchorRef={elementRef}
    >
      {Controls && (
        <Controls
          isTransforming={isTransforming}
          isSelected={isSelected}
          isSingleElement={isSingleElement}
          isEditing={isEditing}
          box={box}
          elementRef={elementRef}
          element={element}
        />
      )}
      <Wrapper
        ref={elementRef}
        data-element-id={id}
        {...box}
        tabIndex="0"
        aria-labelledby={`layer-${id}`}
        hasMask={isMaskable}
        isAnimating={isAnimating}
        data-testid="frameElement"
        maskDisabled={maskDisabled}
        {...(maskDisabled ? eventHandlers : null)}
      >
        <WithMask
          element={element}
          fill={true}
          flip={flip}
          eventHandlers={!maskDisabled ? eventHandlers : null}
        >
          {Frame ? (
            <Frame wrapperRef={elementRef} element={element} box={box} />
          ) : (
            <EmptyFrame />
          )}
        </WithMask>
      </Wrapper>
    </WithLink>
  );
}

FrameElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default FrameElement;
