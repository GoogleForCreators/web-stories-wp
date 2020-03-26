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
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useContext } from 'react';

/**
 * Internal dependencies
 */
import LayerContext from './context';
import { LAYER_HEIGHT } from './constants';

const Wrapper = styled.div`
  height: ${LAYER_HEIGHT}px;
  opacity: 0;
  z-index: 2;
  position: sticky;
  ${({ isTop }) =>
    isTop
      ? `
    top: 0px;
    margin-bottom: -${LAYER_HEIGHT}px`
      : `
    bottom: 0px;
    margin-top: -${LAYER_HEIGHT}px;`}
`;

function LayerScroller({ direction }) {
  const {
    actions: { startScroll },
  } = useContext(LayerContext);
  const [isHovering, setIsHovering] = useState(false);
  const handlePointerEnter = useCallback(() => setIsHovering(true), []);
  const handlePointerLeave = useCallback(() => setIsHovering(false), []);
  useEffect(() => {
    if (!isHovering) {
      return undefined;
    }

    return startScroll(direction);
  }, [direction, startScroll, isHovering]);
  return (
    <Wrapper
      isTop={direction === -1}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
  );
}

LayerScroller.propTypes = {
  direction: PropTypes.number.isRequired,
};

export default LayerScroller;
