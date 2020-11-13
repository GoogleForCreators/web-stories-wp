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
import { useState, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  isKeyboardUser,
  KEYBOARD_USER_SELECTOR,
} from '../../../utils/keyboardOnlyOutline';
import { Dropdown as DropdownIcon } from '../../../icons';
import Popup, { Placement } from '../../popup';
import DropDownList from './list';

/* same min-width as ListContainer */
const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: ${({ theme }) => theme.colors.fg.black};
  font-family: ${({ theme }) => theme.fonts.body1.font};
  border-radius: 4px;
  border: 1px solid transparent;
  ${KEYBOARD_USER_SELECTOR} &:focus-within {
    border-color: ${({ theme }) => theme.colors.whiteout};
  }
`;

export const DropDownSelect = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  border: 0;
  background-color: ${({ theme, lightMode }) =>
    lightMode
      ? rgba(theme.colors.fg.white, 0.1)
      : rgba(theme.colors.bg.black, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      opacity: 0.3;
    `}

  :focus {
    outline: none !important;
  }

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme, lightMode }) =>
      lightMode ? theme.colors.fg.white : rgba(theme.colors.fg.white, 0.3)};
  }
`;

export const DropDownTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
`;

function DropDown({
  value = '',
  onChange = () => {},
  options = [],
  disabled = false,
  lightMode = false,
  placement = Placement.BOTTOM_END,
  placeholder = __('Select an option', 'web-stories'),
  ...rest
}) {
  const selectRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const isNullOrUndefined = (item) => item === null || item === undefined;

  const activeItem = useMemo(
    () =>
      options.find(
        (item) =>
          !isNullOrUndefined(value) &&
          item.value.toString() === value.toString()
      ),
    [value, options]
  );

  const toggleOptions = useCallback(() => {
    setIsOpen(false);
    if (isKeyboardUser()) {
      // Return keyboard focus to button when closing dropdown
      selectRef.current.focus();
    }
  }, []);

  const handleCurrentValue = useCallback(
    (option) => {
      if (onChange) {
        onChange(option);
      }
      setIsOpen(false);
      selectRef.current.focus();
    },
    [onChange]
  );

  const handleSelectClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <DropDownContainer>
      <DropDownSelect
        onClick={handleSelectClick}
        aria-pressed={isOpen}
        aria-haspopup={true}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        disabled={disabled}
        ref={selectRef}
        lightMode={lightMode}
        {...rest}
      >
        <DropDownTitle>
          {(activeItem && activeItem.name) || placeholder}
        </DropDownTitle>
        <DropdownIcon />
      </DropDownSelect>
      <Popup
        anchor={selectRef}
        isOpen={isOpen}
        placement={placement}
        fillWidth={true}
      >
        <DropDownList
          handleCurrentValue={handleCurrentValue}
          value={activeItem && activeItem.value}
          options={options}
          toggleOptions={toggleOptions}
          {...rest}
        />
      </Popup>
    </DropDownContainer>
  );
}

DropDown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  lightMode: PropTypes.bool,
  placeholder: PropTypes.string,
  labelledBy: PropTypes.string,
  placement: PropTypes.string,
};

export default DropDown;
