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
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as DropDownIcon } from '../../../icons/dropdown.svg';
import { useKeyDownEffect } from '../../keyboard';
import useFocusOut from '../../../utils/useFocusOut';

const DropDownContainer = styled.div`
  width: 100px;
  position: relative;
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

const DropDownListWrapper = styled.div``;

const DropDownList = styled.ul.attrs({ role: 'listbox' })`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  float: left;
  min-width: 160px;
  width: 100%;
  padding: 5px 0;
  margin: 2px 0 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 6px 12px ${({ theme }) => rgba(theme.colors.bg.v0, 0.175)};
`;

const DropDownItem = styled.li.attrs({ tabIndex: '0', role: 'option' })`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 16px;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bg.v12};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.bg.v12};
    outline: none;
  }
`;

const availableKeysForSearch = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];

function DropDown({
  options,
  value,
  onChange,
  disabled,
  ariaLabel,
  lightMode = false,
}) {
  DropDown.wrapperRef = useRef(null);
  DropDown.selectRef = useRef();
  DropDown.arrayOfOptionsRefs = [];

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [focusedValue, setFocusedValue] = useState(null);
  const isNullOrUndefined = (item) => item === null || item === undefined;
  const focusedIndex = useMemo(
    () =>
      options.findIndex(
        (item) =>
          !isNullOrUndefined(focusedValue) &&
          item.value.toString() === focusedValue.toString()
      ),
    [focusedValue, options]
  );
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
    setFocusedValue(null);
  }, []);

  const handleMoveFocus = useCallback(
    (offset) => {
      if (
        focusedIndex + offset >= 0 &&
        focusedIndex + offset < options.length
      ) {
        setFocusedValue(options[focusedIndex + offset].value);
      }
    },
    [focusedIndex, options]
  );

  const handleUpDown = useCallback(
    ({ key }) => {
      if (!isOpen) {
        setIsOpen(true);
        setFocusedValue(value);
      } else if (key === 'ArrowUp' && focusedIndex !== 0) {
        handleMoveFocus(-1);
      } else if (key === 'ArrowDown' && focusedIndex < options.length - 1) {
        handleMoveFocus(1);
      }
    },
    [isOpen, value, focusedIndex, options, handleMoveFocus]
  );

  const [clearSearchValue] = useDebouncedCallback(() => {
    setSearchValue('');
  }, 800);

  const handleKeyDown = useCallback(
    ({ keyCode }) => {
      if (isOpen) {
        const searchTerm = searchValue + String.fromCharCode(keyCode);
        setSearchValue(searchTerm);
        const searchIndex = options.findIndex((item) =>
          item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        if (searchIndex >= 0) {
          setFocusedValue(options[searchIndex].value);
        }
        clearSearchValue();
      }
    },
    [clearSearchValue, searchValue, options, isOpen]
  );

  const handleCurrentValue = useCallback(
    (option) => {
      if (onChange) {
        onChange(option);
      }
      setIsOpen(false);
      setFocusedValue(null);
      DropDown.selectRef.current.focus();
    },
    [onChange]
  );

  const handleEnter = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      setFocusedValue(value);
    } else {
      handleCurrentValue(focusedValue);
    }
  }, [isOpen, focusedValue, handleCurrentValue, value]);

  useFocusOut(DropDown.wrapperRef, toggleOptions);
  useKeyDownEffect(DropDown.wrapperRef, { key: 'esc' }, toggleOptions, [
    toggleOptions,
  ]);
  useKeyDownEffect(
    DropDown.wrapperRef,
    { key: ['up', 'down'], shift: true },
    handleUpDown,
    [handleUpDown]
  );
  useKeyDownEffect(
    DropDown.wrapperRef,
    { key: availableKeysForSearch, shift: true },
    handleKeyDown,
    [handleKeyDown]
  );
  useKeyDownEffect(
    DropDown.wrapperRef,
    { key: ['space', 'enter'], shift: true },
    handleEnter,
    [handleEnter]
  );

  const clearOptionsRefs = () => {
    DropDown.arrayOfOptionsRefs = [];
  };

  useEffect(() => {
    if (!isNullOrUndefined(focusedValue)) {
      if (focusedIndex < 0) return;
      DropDown.arrayOfOptionsRefs[focusedIndex].focus();
    }
  }, [focusedValue, options, focusedIndex]);

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
    setFocusedValue(isOpen ? null : value);
  };

  const handleItemClick = (option) => {
    handleCurrentValue(option);
  };

  const setOptionRef = (element) => {
    if (element !== null) {
      DropDown.arrayOfOptionsRefs.push(element);
    }
  };

  return (
    <DropDownContainer ref={DropDown.wrapperRef} tabIndex={-1}>
      <DropDownSelect
        onClick={handleSelectClick}
        aria-pressed={isOpen}
        aria-haspopup={true}
        aria-expanded={isOpen}
        disabled={disabled}
        ref={DropDown.selectRef}
        aria-disabled={disabled}
        lightMode={lightMode}
      >
        <DropDownTitle>
          {(activeItem && activeItem.name) ||
            __('Select an Option', 'web-stories')}
        </DropDownTitle>
        <DropDownIcon />
      </DropDownSelect>
      <DropDownListWrapper>
        {isOpen ? (
          <DropDownList
            aria-multiselectable={false}
            aria-required={false}
            aria-activedescendant={activeItem ? activeItem.value : ''}
            aria-labelledby={ariaLabel}
          >
            {options.map(({ name, value: optValue }) => {
              return (
                <DropDownItem
                  id={`dropDown-${optValue}`}
                  aria-selected={activeItem && activeItem.value === optValue}
                  key={optValue}
                  onClick={() => handleItemClick(optValue)}
                  ref={setOptionRef}
                >
                  {name}
                </DropDownItem>
              );
            })}
          </DropDownList>
        ) : (
          [clearOptionsRefs(), null]
        )}
      </DropDownListWrapper>
    </DropDownContainer>
  );
}

DropDown.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  lightMode: PropTypes.bool,
};

DropDown.defaultProps = {
  disabled: false,
  ariaLabel: __('DropDown', 'web-stories'),
  value: '',
  options: [],
};

export default DropDown;
