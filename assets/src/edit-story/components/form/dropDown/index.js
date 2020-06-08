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
import { Dropdown as DropdownIcon } from '../../../icons';
import Popup from '../../popup';
import DropDownList from './list';

const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.fg.v0};
  font-family: ${({ theme }) => theme.fonts.body1.font};
`;

const DropDownSelect = styled.div.attrs({ role: 'button', tabIndex: '0' })`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme, lightMode }) =>
    lightMode ? rgba(theme.colors.fg.v1, 0.1) : rgba(theme.colors.bg.v0, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      opacity: 0.3;
    `}

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme, lightMode }) =>
      lightMode ? theme.colors.fg.v1 : rgba(theme.colors.fg.v1, 0.3)};
  }
`;

const DropDownTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
`;

function DropDown({
  options,
  value,
  onChange,
  disabled,
  lightMode = false,
  placeholder,
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
        disabled={disabled}
        ref={selectRef}
        aria-disabled={disabled}
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
        placement={'bottom-end'}
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
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  lightMode: PropTypes.bool,
  placeholder: PropTypes.string,
  labelledBy: PropTypes.string,
};

DropDown.defaultProps = {
  disabled: false,
  value: '',
  onChange: () => {},
  options: [],
  placeholder: __('Select an Option', 'web-stories'),
};

export default DropDown;
