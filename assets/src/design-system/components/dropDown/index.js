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
import { useCallback, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { MENU_OPTIONS } from './types';
import { DropDownSelect } from './select';
import useDropDown from './useDropDown';

const DropDownContainer = styled.div``;

/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaLabel Specific label to use as select button's aria label only.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.dropdownLabel Text shown in button with selected value's label or placeholder. Will be used as aria label if no separate ariaLabel is passed in.
 * @param {string} props.hint Hint text to display below a dropdown (optional). If not present, no hint text will display.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {string} props.selectedValue the selected value of the dropDown. Should correspond to a value in the options array of objects.
 *
 */

export const DropDown = ({
  ariaLabel,
  dropDownLabel,
  hint,
  disabled,
  options = [],
  selectedValue = '',
  ...rest
}) => {
  const selectRef = useRef();

  const { activeOption, isOpen } = useDropDown({
    options,
    selectedValue,
  });

  const handleSelectClick = useCallback(
    (event) => {
      event.preventDefault();
      isOpen.set((prevIsOpen) => !prevIsOpen);
    },
    [isOpen]
  );

  return (
    <DropDownContainer>
      <DropDownSelect
        activeItemLabel={activeOption?.label}
        ariaLabel={ariaLabel}
        dropDownLabel={dropDownLabel}
        isOpen={isOpen.value}
        disabled={disabled}
        onSelectClick={handleSelectClick}
        ref={selectRef}
        {...rest}
      />
      {hint && <p>{hint}</p>}
    </DropDownContainer>
  );
};

DropDown.propTypes = {
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  dropDownLabel: PropTypes.string,
  hint: PropTypes.string,
  options: MENU_OPTIONS,
  placeholder: PropTypes.string,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};
