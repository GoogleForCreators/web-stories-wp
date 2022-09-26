/*
 * Copyright 2021 Google LLC
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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import {
  NAVIGATION_WIDTH,
  DISTANCE_FROM_TOP,
  DISTANCE_FROM_BOTTOM,
} from './constants';

const NavigationWrapper = styled.div`
  position: absolute;
  ${({ alignRight = false }) => (alignRight ? 'right: 0' : 'left: 0')};
  bottom: 0;
  max-height: calc(100vh - ${DISTANCE_FROM_TOP + DISTANCE_FROM_BOTTOM}px);
  width: ${NAVIGATION_WIDTH + 2}px; /* account for border width */
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;

  ${({ isOpen }) =>
    !isOpen &&
    css`
      &,
      * {
        height: 0;
        visibility: hidden;
      }
    `}
`;
NavigationWrapper.propTypes = {
  alignRight: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default NavigationWrapper;
