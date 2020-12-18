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
import { MENU_OPTIONS } from './types';
import useDropDown from './useDropDown';

const DropDownContainer = styled.div``;

/**
 *
 * @param {Object} props All props.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {string} props.selectedValue the selected value of the dropDown. Should correspond to a value in the options array of objects.
 *
 */

export const DropDown = ({ options = [], selectedValue = '' }) => {
  useDropDown({
    options,
    selectedValue,
  });

  return <DropDownContainer />;
};

DropDown.propTypes = {
  options: MENU_OPTIONS,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};
