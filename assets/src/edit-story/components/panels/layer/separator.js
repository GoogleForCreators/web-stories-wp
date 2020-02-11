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

/**
 * WordPress dependencies
 */
import { useContext, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { LAYER_HEIGHT } from './constants';
import LayerContext from './context';

const Wrapper = styled.div`
  height: ${LAYER_HEIGHT}px;
  margin: -${LAYER_HEIGHT / 2}px 0;
  padding: ${LAYER_HEIGHT / 2}px 0;
  width: 100%;
  opacity: 0;
  position: relative;
  z-index: 1;

  &:hover {
    opacity: 1;
  }
`;

const Line = styled.div`
  height: 4px;
  margin: 0 0 -4px;
  background: ${({ theme }) => theme.colors.action};
  width: 100%;
`;

function LayerSeparator({ position }) {
  const {
    actions: { setCurrentSeparator },
  } = useContext(LayerContext);
  const handlePointerEnter = useCallback(() => {
    setCurrentSeparator(position);
  }, [setCurrentSeparator, position]);
  return (
    <Wrapper onPointerEnter={handlePointerEnter}>
      <Line />
    </Wrapper>
  );
}

LayerSeparator.propTypes = {
  position: PropTypes.number.isRequired,
};

export default LayerSeparator;
