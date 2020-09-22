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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { forwardRef, useRef } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';
import useReordering from './useReordering';
import ReorderableScroller from './reorderableScroller';
import useScroll from './useScroll';

const ReorderableContainer = styled.div.attrs({ role: 'listbox' })`
  display: flex;
`;

const Reorderable = forwardRef(function Reorderable(
  {
    children,
    onPositionChange = () => {},
    getItemSize = () => 10,
    mode = 'horizontal',
    ...props
  },
  forwardedRef
) {
  const ref = useRef(null);
  const containerRef = forwardedRef || ref;
  const {
    isReordering,
    currentSeparator,
    setCurrentSeparator,
    handleStartReordering,
  } = useReordering(onPositionChange, children.length);

  const { startScroll, canScrollEnd, canScrollStart } = useScroll(
    mode,
    isReordering,
    containerRef,
    getItemSize()
  );

  const state = {
    state: {
      isReordering,
      currentSeparator,
      containerRef,
      mode,
      canScrollEnd,
      canScrollStart,
    },
    actions: {
      setCurrentSeparator,
      handleStartReordering,
      startScroll,
    },
  };

  return (
    <Context.Provider value={state}>
      <ReorderableContainer ref={containerRef} {...props}>
        <ReorderableScroller direction={-1} size={getItemSize()} />
        {children}
        <ReorderableScroller direction={1} size={getItemSize()} />
      </ReorderableContainer>
    </Context.Provider>
  );
});

Reorderable.propTypes = {
  children: PropTypes.node,
  onPositionChange: PropTypes.func.isRequired,
  getItemSize: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

export default Reorderable;
