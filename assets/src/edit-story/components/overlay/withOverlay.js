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
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useCombinedRefs from '../../utils/useCombinedRefs';
import Context from './context';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  /*! @noflip */
  left: 0;
  width: 0;
  height: 0;
  z-index: ${({ zIndex }) => zIndex};
`;

function withOverlay(Comp) {
  function WithOverlay({ children, ...rest }, ref) {
    const [overlay, setOverlay] = useState(null);
    const [container, setContainer] = useState(null);
    const { zIndex = 1 } = rest;
    return (
      <Context.Provider value={{ container, overlay }}>
        <Comp ref={useCombinedRefs(ref, setContainer)} {...rest}>
          {children}
          <Overlay ref={setOverlay} zIndex={zIndex} />
        </Comp>
      </Context.Provider>
    );
  }

  const ReffedWithOverlay = forwardRef(WithOverlay);

  WithOverlay.propTypes = {
    children: PropTypes.node,
  };

  return ReffedWithOverlay;
}

export default withOverlay;
