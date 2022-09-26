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
import { useCallback, useRef, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { NESTED_PX } from '../panels/layer/constants';
import useReorderable from './useReorderable';

const Wrapper = styled.div`
  opacity: 0;
  position: relative;
  z-index: ${({ isReordering, isNested }) =>
    isReordering ? (isNested ? 3 : 2) : -1};

  &:hover {
    opacity: ${({ isReordering }) => (isReordering ? 1 : 0)};
  }
`;

const Line = styled.div`
  height: 4px;
  margin: 0 0 -4px;
  background: ${({ theme }) => theme.colors.accent.secondary};
  width: 100%;
  ${({ isNested }) => isNested && `margin-left: ${NESTED_PX}px;`}
  width: ${({ isNested }) =>
    isNested ? `calc(100% - ${NESTED_PX}px)` : '100%'}
`;

function ReorderableSeparator({
  position,
  groupId = null,
  isNested = false,
  nestedOffset = false,
  nestedOffsetCalcFunc = () => {},
  children = null,
  ...props
}) {
  const separatorRef = useRef(null);
  const [isTempNested, setIsTempNested] = useState(false);

  const { isReordering, setCurrentSeparator } = useReorderable(
    ({ state, actions }) => ({
      isReordering: state.isReordering,
      setCurrentSeparator: actions.setCurrentSeparator,
    })
  );
  const handlePointerEnter = useCallback(() => {
    if (!isReordering) {
      return;
    }
    setCurrentSeparator({ position, data: { groupId } });
  }, [setCurrentSeparator, isReordering, position, groupId]);

  const handlePointerMove = (evt) => {
    if (!nestedOffset) {
      return;
    }
    setIsTempNested(nestedOffsetCalcFunc(evt.nativeEvent));
  };

  if (children === null) {
    children = <Line isNested={isNested || isTempNested} />;
  }

  return (
    <Wrapper
      onPointerOver={handlePointerEnter}
      onPointerMove={handlePointerMove}
      ref={separatorRef}
      isReordering={isReordering}
      isNested={isNested || isTempNested}
      {...props}
    >
      {children}
    </Wrapper>
  );
}

ReorderableSeparator.propTypes = {
  position: PropTypes.number.isRequired,
  groupId: PropTypes.string,
  isNested: PropTypes.string,
  nestedOffset: PropTypes.bool,
  nestedOffsetCalcFunc: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default ReorderableSeparator;
