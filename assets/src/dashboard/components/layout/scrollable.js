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

/**
 * Internal dependencies
 */
import useLayoutContext from './useLayoutContext';

const ScrollContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;

  /**
   * Adds inertial scrolling to iOS
   * devices like iPad
   */
  -webkit-overflow-scrolling: touch;
`;

const Inner = styled.div`
  position: relative;
  padding-top: ${(props) => props.paddingTop || 0}px;
  width: ${({ scrollbarWidth }) => `calc(100% + ${scrollbarWidth}px)`};
`;

Inner.propTypes = {
  paddingTop: PropTypes.number,
};

const Scrollable = ({ children }) => {
  const {
    state: { scrollFrameRef, squishContentHeight },
  } = useLayoutContext();

  const scrollbarWidth = scrollFrameRef?.current
    ? scrollFrameRef.current.offsetWidth - scrollFrameRef.current.clientWidth
    : 0;

  return (
    <ScrollContent ref={scrollFrameRef}>
      <Inner
        tabIndex={0}
        scrollbarWidth={scrollbarWidth}
        paddingTop={squishContentHeight}
      >
        {children}
      </Inner>
    </ScrollContent>
  );
};

Scrollable.propTypes = {
  children: PropTypes.node,
};

export default Scrollable;
