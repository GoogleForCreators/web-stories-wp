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
import { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { Z_INDEX } from '../../constants';
import useAddSquishVar from './useAddSquishVar';

const FixedContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${Z_INDEX.LAYOUT_FIXED};
  overflow: hidden;

  /**
   * This is an absolutley positioned full size
   * overlay over the scrollable content. being
   * such, we don't want it to block pointer
   * events to the scrollable and squishable
   * content.
   */
  pointer-events: none;

  /**
   * Not sure how much I like this because 
   * it will be a higher specifity than a 
   * styled declaration, but I don't want
   * devs to have to declare this on every
   * component in this view.
   */
  & > * {
    pointer-events: auto;
  }
`;

const Fixed = ({ children }) => {
  const rootRef = useRef(null);
  useAddSquishVar(rootRef);

  return <FixedContent ref={rootRef}>{children}</FixedContent>;
};

Fixed.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Fixed;
