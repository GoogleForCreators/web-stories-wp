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
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

function CompactIndicatorWithRef({ onClick, isActive, ariaLabel }, ref) {
  return (
    <Indicator
      onClick={onClick}
      isActive={isActive}
      aria-label={ariaLabel}
      role="option"
      ref={ref}
    />
  );
}

const Indicator = styled.button`
  display: block;
  width: 48px;
  height: 4px;
  margin: 0 8px 0 0;
  &:last-of-type {
    margin: 0;
  }
  border: 0;
  background: #ffffff;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.28)};
  cursor: pointer;
`;

const CompactIndicator = forwardRef(CompactIndicatorWithRef);

CompactIndicator.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
};

CompactIndicatorWithRef.propTypes = CompactIndicator.propTypes;

export default CompactIndicator;
