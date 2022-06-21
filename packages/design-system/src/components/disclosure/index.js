/*
 * Copyright 2022 Google LLC
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
import { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { ChevronDownSmall } from '../../icons';

const rotate = {
  up: ['0', '180deg'],
  down: ['180deg', '0'],
  left: ['-90deg', '90deg'],
  right: ['90deg', '-90deg'],
};

/**
 * Simple component that shows a chevron icon when and rotates 180 degrees
 * when controlled contents are shown (open)
 *
 * @param {Object} [props] All props.
 * @param {string} [props.direction] Initial direction of chevron icon
 * @param {number|string} [props.duration] Transition duration
 * @param {boolean} [props.isOpen] Rotates icon when true
 * @return {*} Disclosure icon
 */
export const Disclosure = ({
  direction = 'down',
  duration = 0,
  isOpen = false,
  ...rest
}) => {
  const [whenOpen, whenClosed] = rotate[direction];

  const iconStyle = css`
    height: ${THEME_CONSTANTS.ICON_SIZE}px;
    width: auto;
    margin: 0 -10px;
    color: ${({ theme }) => theme.colors.fg.secondary};
    transition: transform ${duration};
    transform: rotate(${isOpen ? whenOpen : whenClosed});
  `;

  return <ChevronDownSmall css={iconStyle} {...rest} />;
};

Disclosure.propTypes = {
  direction: PropTypes.oneOf(Object.keys(rotate)),
  duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isOpen: PropTypes.bool,
};
