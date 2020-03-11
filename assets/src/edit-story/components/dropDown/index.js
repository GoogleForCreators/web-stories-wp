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
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as DropDownIcon } from '../../icons/dropdown.svg';
import { useKeyDownEffect } from '../keyboard';
import useFocusOut from '../../utils/useFocusOut';

const DropDownContainer = styled.div`
  width: 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.fg.v0};
  font-family: ${({ theme }) => theme.fonts.body1.font};
`;

const DropDownSelect = styled.div.attrs({ role: 'Listbox', tabIndex: '0' })`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
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
    color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
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

const DropDownList = styled.ul`
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
    background-color: ${({ theme }) => theme.colors.bg.v11};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.bg.v11};
    outline: none;
  }
`;

function DropDown({ options, value, onChange, disabled }) {
  DropDown.wrapperRef = useRef(null);
  DropDown.selectRef = useRef();
  DropDown.arrayOfOptionsRefs = [];

  const [openOptions, setOpenOptions] = useState(false);
  const [focusedOption, setFocusedOption] = useState(undefined);
  const [searchValue, setSearchValue] = useState('');
  const activeItem = useMemo(
    () => options.find((item) => item.value === value),
    [value, options]
  );
  const toggleOptions = useCallback(() => setOpenOptions(false), []);

  useFocusOut(DropDown.wrapperRef, toggleOptions);
  useKeyDownEffect(DropDown.wrapperRef, { key: 'esc' }, toggleOptions);

  const clearOptionsRefs = () => {
    DropDown.arrayOfOptionsRefs = [];
  };

  const handleOpenOptions = (event) => {
    switch (event.type) {
      case 'click':
        setOpenOptions(!openOptions);
        setFocusedOption(document.activeElement.id);
        break;
      case 'keydown':
        if (event.key === 'Enter' || event.key === ' ') {
          _handleOpenOptions(event);
        }
        break;
      default:
    }
  };

  const _handleOpenOptions = useCallback(() => {
    setOpenOptions(!openOptions);
  }, [openOptions]);

  const handleCurrentValue = useCallback(
    (option) => {
      if (onChange) {
        onChange(option);
      }
    },
    [onChange]
  );

  const handleSelectElement = (event, index) => {
    event.preventDefault();
    if (index >= 0 && index < DropDown.arrayOfOptionsRefs.length) {
      DropDown.arrayOfOptionsRefs[index].focus();
      setFocusedOption(document.activeElement.id);
    }
  };

  const handleOptionsEvents = (option, index, event) => {
    switch (event.type) {
      case 'click':
        handleCurrentValue(option);
        setOpenOptions(!openOptions);
        break;
      case 'keydown':
        if (event.key === 'Enter' || event.key === ' ') {
          handleCurrentValue(option);
          setOpenOptions(!openOptions);
          DropDown.selectRef.current.focus();
        } else if (event.key === 'ArrowUp') {
          handleSelectElement(event, index - 1);
        } else if (event.key === 'ArrowDown') {
          handleSelectElement(event, index + 1);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setOpenOptions(!openOptions);
          DropDown.selectRef.current.focus();
        } else {
          const searchTerm = searchValue + String.fromCharCode(event.keyCode);
          setSearchValue(searchTerm);
          clearSearchValue();
        }
        break;
      default:
    }
  };

  const clearSearchValue = useCallback(
    debounce(800, () => {
      setSearchValue('');
    })
  );

  useEffect(() => {
    if (searchValue !== '') {
      const searchIndex = options.findIndex((item) =>
        item.name.toLowerCase().startsWith(searchValue.toLowerCase())
      );
      if (searchIndex >= 0) {
        DropDown.arrayOfOptionsRefs[searchIndex].focus();
      }
    }
  }, [searchValue, options]);

  useEffect(() => {
    if (openOptions) {
      DropDown.arrayOfOptionsRefs[0].focus();
    }
  }, [openOptions]);

  const setOptionRef = (element) => {
    if (element !== null) {
      DropDown.arrayOfOptionsRefs.push(element);
    }
  };

  const setSize = options.length;

  return (
    <DropDownContainer ref={DropDown.wrapperRef} tabIndex={-1}>
      <DropDownSelect
        onClick={handleOpenOptions}
        onKeyDown={handleOpenOptions}
        aria-pressed={openOptions}
        aria-haspopup={true}
        aria-expanded={openOptions}
        disabled={disabled}
        ref={DropDown.selectRef}
        aria-disabled={disabled}
      >
        <DropDownTitle>
          {(activeItem && activeItem.name) ||
            __('Select an Option', 'web-stories')}
        </DropDownTitle>
        <DropDownIcon />
      </DropDownSelect>
      <DropDownListWrapper>
        {openOptions ? (
          <DropDownList>
            {options.map(({ name, value: optValue }, index) => {
              return (
                <DropDownItem
                  id={optValue}
                  aria-selected={focusedOption === optValue}
                  key={optValue}
                  onClick={(e) => handleOptionsEvents(optValue, index, e)}
                  onKeyDown={(e) => handleOptionsEvents(optValue, index, e)}
                  ref={setOptionRef}
                  aria-posinset={index}
                  aria-setsize={setSize}
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
};

DropDown.defaultProps = {
  disabled: false,
};

export default DropDown;
