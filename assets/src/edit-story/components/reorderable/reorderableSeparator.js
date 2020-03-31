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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import useReorderable from './useReorderable';

const Wrapper = styled.div`
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

function ReorderableSeparator({ position, ...props }) {
  const {
    actions: { setCurrentSeparator },
    state: { isReordering },
  } = useReorderable();
  const handlePointerEnter = useCallback(() => {
    setCurrentSeparator(position);
  }, [setCurrentSeparator, position]);

  if (!isReordering) {
    return null;
  }
  return (
    // Disable reason: This one does not need keyboard interactivity
    //  - there are better ways to reorder using keyboard.
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <Wrapper onMouseOver={handlePointerEnter} {...props}>
      <Line />
    </Wrapper>
  );
}

ReorderableSeparator.propTypes = {
  position: PropTypes.number.isRequired,
};

export default ReorderableSeparator;
