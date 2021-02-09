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
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import useReorderable from './useReorderable';

const Wrapper = styled.div`
  opacity: 0;
  position: relative;
  z-index: ${({ isReordering }) => (isReordering ? 2 : -1)};

  &:hover {
    opacity: ${({ isReordering }) => (isReordering ? 1 : 0)};
  }
`;

const Line = styled.div`
  height: 4px;
  margin: 0 0 -4px;
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.accent.primary};
  width: 100%;
`;

function ReorderableSeparator({ position, children = <Line />, ...props }) {
  const separatorRef = useRef(null);

  const {
    actions: { setCurrentSeparator },
    state: { isReordering },
  } = useReorderable();
  const handlePointerEnter = useCallback(() => {
    if (!isReordering) {
      return;
    }
    setCurrentSeparator(position);
  }, [setCurrentSeparator, isReordering, position]);

  return (
    <Wrapper
      onMouseOver={handlePointerEnter}
      ref={separatorRef}
      isReordering={isReordering}
      {...props}
    >
      {children}
    </Wrapper>
  );
}

ReorderableSeparator.propTypes = {
  position: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default ReorderableSeparator;
