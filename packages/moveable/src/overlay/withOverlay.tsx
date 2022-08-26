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
import {
  forwardRef,
  useCombinedRefs,
  useState,
} from '@googleforcreators/react';
import type { ElementType, ForwardedRef, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

interface OverlayProps {
  $zIndex: number;
}

interface WithOverlayProps {
  zIndex: number;
  children: ReactNode;
}

const Overlay = styled.div<OverlayProps>`
  position: absolute;
  top: 0;
  /*! @noflip */
  left: 0;
  width: 0;
  height: 0;
  z-index: ${({ $zIndex }) => $zIndex};
`;

function withOverlay(Comp: ElementType) {
  function WithOverlay(
    { children, ...rest }: WithOverlayProps,
    ref: ForwardedRef<HTMLElement>
  ) {
    const [overlay, setOverlay] = useState<HTMLElement | null>(null);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const { zIndex = 1 } = rest;
    return (
      <Context.Provider value={{ container, overlay }}>
        <Comp ref={useCombinedRefs(ref, setContainer)} {...rest}>
          {children}
          <Overlay ref={setOverlay} $zIndex={zIndex} />
        </Comp>
      </Context.Provider>
    );
  }

  return forwardRef(WithOverlay);
}

export default withOverlay;
