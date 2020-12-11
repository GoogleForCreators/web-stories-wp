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

/**
 * Internal dependencies
 */
import { DEFAULT_ANCHOR_HEIGHT, DEFAULT_DROPDOWN_HEIGHT } from '../constants';

export const MenuContainer = styled.div(
  ({
    anchorHeight = DEFAULT_ANCHOR_HEIGHT,
    dropdownHeight = DEFAULT_DROPDOWN_HEIGHT,
    styleOverride = '',
  }) => `
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    max-height: ${dropdownHeight}px;
    overflow-y: scroll;
    z-index: 2; 
    margin-top: ${anchorHeight + 8}px;
    ${styleOverride}`
);
MenuContainer.propTypes = {
  anchorHeight: PropTypes.number,
  dropdownHeight: PropTypes.number,
  styleOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const ListItem = styled.li`
  width: 100%;
`;
