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
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { Z_INDEX, KEYBOARD_USER_SELECTOR } from '../../../constants';
import { TypographyPresets } from '../../typography';

export const Menu = styled.ul`
  ${({ theme, isOpen }) => `
  width: 100%;
  max-height: 300px;
  overflow-y: scroll;
  align-items: flex-start;
  background-color: ${theme.DEPRECATED_THEME.colors.white};
  box-shadow: ${theme.DEPRECATED_THEME.expandedTypeahead.boxShadow};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin: 5px 0 0;
  opacity: ${isOpen ? 1 : 0};
  padding: 5px 0;
  pointer-events: ${isOpen ? 'auto' : 'none'};
  z-index: ${Z_INDEX.TYPEAHEAD_OPTIONS};
`}
`;
Menu.propTypes = {
  isOpen: PropTypes.bool,
};

export const MenuItem = styled.li`
  ${TypographyPresets.Small};
  ${({ theme, isDisabled, itemBgColor }) => `
  padding: 10px 20px;
  margin: 0; 
  background-color: ${
    itemBgColor ? theme.DEPRECATED_THEME.colors[itemBgColor] : 'none'
  };
  color: ${theme.DEPRECATED_THEME.colors.gray700};
  cursor: ${isDisabled ? 'default' : 'pointer'};
  width: 100%;
  border: ${theme.DEPRECATED_THEME.borders.transparent};
  border-width: 2px;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: none;
    border: 2px solid ${rgba(theme.DEPRECATED_THEME.colors.bluePrimary, 0.85)};
  }
`}
`;
MenuItem.propTypes = {
  isDisabled: PropTypes.bool,
  itemBgColor: PropTypes.oneOf(['gray25', 'gray50', false]),
};

export const MenuItemContent = styled.span`
  display: inline-block;
  height: 100%;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
