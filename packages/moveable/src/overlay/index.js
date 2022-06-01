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
import styled, { css } from 'styled-components';
import { forwardRef, useContext, createPortal } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Context from './context';

const pointerEventsCss = css`
  ${({ pointerEvents }) => {
    if (pointerEvents && typeof pointerEvents === 'string') {
      return `pointer-events: ${pointerEvents};`;
    }
    return '';
  }}
`;

const Wrapper = styled.div`
  ${pointerEventsCss}
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  z-index: ${({ zIndex }) => `${zIndex}`};
`;

function InOverlayWithRef(
  { zIndex, pointerEvents, render, children = null, ...props },
  ref
) {
  const { container, overlay } = useContext(Context);
  if (!container || !overlay) {
    return null;
  }
  const slot = (
    /* eslint-disable-next-line styled-components-a11y/no-static-element-interactions -- No role required here. */
    <Wrapper
      {...props}
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

InOverlayWithRef.propTypes = {
  zIndex: PropTypes.number,
  pointerEvents: PropTypes.string,
  render: PropTypes.func,
  children: PropTypes.node,
};

export default InOverlay;
