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
import ReorderableContext from './context';

const Wrapper = styled.div`
  z-index: 2;
  position: sticky;
`;

function ReorderableScroller({ className, direction }) {
  const {
    state: { canScrollDown, canScrollUp },
    actions: { startScroll },
  } = useContext(ReorderableContext);
  const [isHovering, setIsHovering] = useState(false);
  const handlePointerEnter = useCallback(() => setIsHovering(true), []);
  const handlePointerLeave = useCallback(() => setIsHovering(false), []);
  useEffect(() => {
    if (!isHovering) {
      return undefined;
    }

    return startScroll(direction);
  }, [direction, startScroll, isHovering]);

  const isScrollingUp = direction === -1;
  const isScrollingDown = direction === 1;
  const isVisible =
    (isScrollingUp && canScrollUp) || (isScrollingDown && canScrollDown);

  // Make sure to clear hovering flag when hiding element
  // (pointerLeave won't trigger when element is removed)
  useEffect(() => {
    if (!isVisible) {
      setIsHovering(false);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Wrapper
      className={className}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
  );
}

ReorderableScroller.propTypes = {
  direction: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default ReorderableScroller;
