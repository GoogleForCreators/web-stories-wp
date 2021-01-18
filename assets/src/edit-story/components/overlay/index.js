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
import { createPortal } from 'react-dom';
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import { useContext } from '../../../design-system';

/**
 * Internal dependencies
 */
import pointerEventsCss from '../../utils/pointerEventsCss';
import Context from './context';

const Wrapper = styled.div`
  ${pointerEventsCss}
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  z-index: ${({ zIndex }) => `${zIndex}`};
`;

function InOverlayWithRef({ zIndex, pointerEvents, render, children }, ref) {
  const { container, overlay } = useContext(Context);
  if (!container || !overlay) {
    return null;
  }
  const slot = (
    <Wrapper
      ref={ref}
      zIndex={zIndex || 0}
      pointerEvents={pointerEvents}
      onMouseDown={(evt) => evt.stopPropagation()}
    >
      {render ? render({ container, overlay }) : children}
    </Wrapper>
  );
  return createPortal(slot, overlay);
}

const InOverlay = forwardRef(InOverlayWithRef);

export default InOverlay;
