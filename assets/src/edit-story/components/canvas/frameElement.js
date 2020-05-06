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
import { useLayoutEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getDefinitionForType } from '../../elements';
import { useStory, useDropTargets } from '../../app';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '../../elements/shared';
import { useUnits } from '../../units';
import WithMask from '../../masks/frame';
import WithLink from '../link/frame';
import { useTransformHandler } from '../transform';
import useCanvas from './useCanvas';

// @todo: should the frame borders follow clip lines?

// Pointer events are disabled in the display mode to ensure that selection
// can be limited to the mask.
const Wrapper = styled.div`
	${elementWithPosition}
	${elementWithSize}
	${elementWithRotation}
  pointer-events: initial;

	&:focus,
	&:active,
	&:hover {
		outline: ${({ theme, hasMask }) =>
      hasMask ? 'none' : `1px solid ${theme.colors.selection}`};
	}
`;

const EmptyFrame = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

function FrameElement({ element }) {
  const { id, type } = element;
  const { Frame, isMaskable } = getDefinitionForType(type);
  const elementRef = useRef();

  const {
    actions: { setNodeForElement, handleSelectElement },
  } = useCanvas();
  const {
    state: { selectedElementIds, currentPage },
  } = useStory();
  const {
    actions: { getBox },
  } = useUnits();
  const {
    state: { activeDropTargetId },
  } = useDropTargets();

  useLayoutEffect(() => {
    setNodeForElement(id, elementRef.current);
  }, [id, setNodeForElement]);
  const isSelected = selectedElementIds.includes(id);
  const box = getBox(element);
  const isBackground = currentPage?.backgroundElementId === id;

  useTransformHandler(id, (transform) => {
    const target = elementRef.current;
    if (transform?.dropTargets?.hover !== undefined) {
      target.style.opacity = transform.dropTargets.hover ? 0 : 1;
    }
  });

  return (
    <Wrapper
      ref={elementRef}
      data-testid="frame"
      data-element-id={id}
      {...box}
      onMouseDown={(evt) => {
        if (isSelected) {
          elementRef.current.focus();
        } else {
          handleSelectElement(id, evt);
        }
        if (!isBackground) {
          evt.stopPropagation();
        }
      }}
      onFocus={(evt) => {
        if (!isSelected) {
          handleSelectElement(id, evt);
        }
      }}
      tabIndex="0"
      aria-labelledby={`layer-${id}`}
      hasMask={isMaskable}
    >
      <WithLink
        element={element}
        active={selectedElementIds.length === 1 && isSelected}
        dragging={Boolean(activeDropTargetId)}
      >
        <WithMask element={element} fill={true}>
          {Frame ? (
            <Frame wrapperRef={elementRef} element={element} box={box} />
          ) : (
            <EmptyFrame />
          )}
        </WithMask>
      </WithLink>
    </Wrapper>
  );
}

FrameElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default FrameElement;
