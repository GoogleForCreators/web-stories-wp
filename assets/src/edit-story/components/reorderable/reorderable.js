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
import React from 'react';

/**
 * Internal dependencies
 */
import Context from './context';
import ReorderableScroller from './reorderableScroller';
import useScroll from './useScroll';
import useReordering from './useReordering';

const ReorderableContainer = styled.div.attrs({ role: 'listbox' })`
  display: flex;
`;

const Reorderable = React.forwardRef(
  (
    { children, onPositionChange = () => {}, getItemSize = () => 10, ...props },
    forwardedRef
  ) => {
    const {
      isReordering,
      currentSeparator,
      setCurrentSeparator,
      setIsReordering,
      handleStartReordering,
    } = useReordering(onPositionChange, children.length);

    const { startScroll, canScrollUp, canScrollDown } = useScroll(
      forwardedRef,
      isReordering
    );

    const state = {
      state: {
        isReordering,
        currentSeparator,
        canScrollUp,
        canScrollDown,
      },
      actions: {
        setCurrentSeparator,
        setIsReordering,
        handleStartReordering,
        startScroll,
      },
    };

    return (
      <Context.Provider value={state}>
        <ReorderableContainer ref={forwardedRef} {...props}>
          <ReorderableScroller direction={-1} size={getItemSize()} />

          {children}

          <ReorderableScroller direction={1} size={getItemSize()} />
        </ReorderableContainer>
      </Context.Provider>
    );
  }
);

Reorderable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onPositionChange: PropTypes.func.isRequired,
  getItemSize: PropTypes.func.isRequired,
};

export default Reorderable;
