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
import { KEYBOARD_USER_SELECTOR } from '../../constants';

const ToggleButtonGroup = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

ToggleButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

const ToggleButton = styled.button`
  ${({ theme, isActive }) => `

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  outline: none;
  border: none;
  padding-bottom: 0;
  font-size: ${theme.fonts.body1.size}px;
  font-family: ${theme.fonts.body1.family};
  font-weight: ${isActive ? 600 : theme.fonts.body1.weight}};
  line-height: ${theme.fonts.body1.lineHeight}px;
  letter-spacing: ${theme.fonts.body1.letterSpacing}em;
  color: ${isActive ? theme.colors.gray900 : theme.colors.gray600};

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border: 1px solid ${theme.colors.action};
  }

  &:after {
    content: '';
    width: 100%;
    display: inline-block;
    border-bottom: 3px solid
        ${isActive ? theme.colors.bluePrimary600 : 'transparent'};
  }
  `}
`;

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

export { ToggleButtonGroup, ToggleButton };
