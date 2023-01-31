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
import { forwardRef, useContext, createPortal } from '@googleforcreators/react';
import type { ReactNode, HTMLAttributes, ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

type PointerEventsValue = 'none' | 'auto' | 'initial';

interface WrapperProps {
  $zIndex: number;
  ref: ForwardedRef<HTMLDivElement>;
  pointerEvents?: PointerEventsValue;
}

const Wrapper = styled.div<WrapperProps>`
  pointer-events: ${({ pointerEvents }) => pointerEvents}
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  z-index: ${({ $zIndex }) => `${$zIndex}`};
`;

interface RenderProps {
  container: HTMLElement;
  overlay: Element;
}

interface InOverlayProps extends HTMLAttributes<HTMLDivElement> {
  pointerEvents: PointerEventsValue;
  children?: ReactNode;
  zIndex: number;
  render: (props: RenderProps) => JSX.Element;
}

function InOverlayWithRef(
  { zIndex, pointerEvents, render, children = null, ...props }: InOverlayProps,
  ref: ForwardedRef<HTMLDivElement>
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
      $zIndex={zIndex || 0}
      pointerEvents={pointerEvents}
      onMouseDown={(evt) => evt.stopPropagation()}
    >
      {render ? render({ container, overlay }) : children}
    </Wrapper>
  );
  return createPortal(slot, overlay);
}

const InOverlay = forwardRef<HTMLDivElement, InOverlayProps>(InOverlayWithRef);

export default InOverlay;
