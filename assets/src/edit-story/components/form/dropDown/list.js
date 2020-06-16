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
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../keyboard';
import useFocusOut from '../../../utils/useFocusOut';

const ListContainer = styled.div`
  float: right;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-width: 160px;
  max-height: 370px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.fg.v1};
`;

const List = styled.ul.attrs({ role: 'listbox' })`
  width: 100%;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  background-clip: padding-box;
  box-shadow: 0 6px 12px ${({ theme }) => rgba(theme.colors.bg.v0, 0.175)};
`;

const Item = styled.li.attrs({ tabIndex: '0', role: 'option' })`
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

const availableKeysForSearch = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

function DropDownList({
  handleCurrentValue,
  value,
  options,
  toggleOptions,
  ...rest
}) {
  const listContainerRef = useRef();
  const listRef = useRef();

  const [searchValue, setSearchValue] = useState('');
  const [focusedValue, setFocusedValue] = useState(value);
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

  useEffect(() => {
    // If the menu has more than a couple options it will shift into view
    // which will immediately dismiss the menu making it unusable.
    if (options.length > 4) {
      return undefined;
    }
    // Hide dropdown menu on scroll.
    document.addEventListener('scroll', toggleOptions, true);
    return () => document.removeEventListener('scroll', toggleOptions, true);
  }, [toggleOptions, options]);

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
      if (key === 'ArrowUp' && focusedIndex !== 0) {
        handleMoveFocus(-1);
      } else if (key === 'ArrowDown' && focusedIndex < options.length - 1) {
        handleMoveFocus(1);
      }
    },
    [focusedIndex, options, handleMoveFocus]
  );

  const [clearSearchValue] = useDebouncedCallback(() => {
    setSearchValue('');
  }, 800);

  const handleKeyDown = useCallback(
    ({ keyCode }) => {
      const searchTerm = searchValue + String.fromCharCode(keyCode);
      setSearchValue(searchTerm);
      const searchIndex = options.findIndex((item) =>
        item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      if (searchIndex >= 0) {
        setFocusedValue(options[searchIndex].value);
      }
      clearSearchValue();
    },
    [clearSearchValue, searchValue, options]
  );

  const handleEnter = useCallback(() => {
    handleCurrentValue(focusedValue);
  }, [focusedValue, handleCurrentValue]);

  useFocusOut(listContainerRef, toggleOptions);

  useKeyDownEffect(listContainerRef, { key: 'esc' }, toggleOptions, [
    toggleOptions,
  ]);
  useKeyDownEffect(
    listContainerRef,
    { key: ['up', 'down'], shift: true },
    handleUpDown,
    [handleUpDown]
  );
  // Empty handler to be consistent with up/down.
  useKeyDownEffect(listContainerRef, ['left', 'right'], () => {}, []);
  useKeyDownEffect(
    listContainerRef,
    { key: availableKeysForSearch, shift: true },
    handleKeyDown,
    [handleKeyDown]
  );
  useKeyDownEffect(
    listContainerRef,
    { key: ['space', 'enter'], shift: true },
    handleEnter,
    [handleEnter]
  );

  useEffect(() => {
    if (!isNullOrUndefined(focusedValue)) {
      if (focusedIndex < 0) {
        return;
      }
      listRef.current.children[focusedIndex].focus();
    }
  }, [focusedValue, options, focusedIndex, listRef]);

  const handleItemClick = (option) => {
    handleCurrentValue(option);
  };

  return (
    <ListContainer ref={listContainerRef}>
      <List
        {...rest}
        aria-multiselectable={false}
        aria-required={false}
        aria-activedescendant={value || ''}
        ref={listRef}
      >
        {options.map(({ name, value: optValue }) => (
          <Item
            id={`dropDown-${optValue}`}
            aria-selected={value === optValue}
            key={optValue}
            onClick={() => handleItemClick(optValue)}
          >
            {name}
          </Item>
        ))}
      </List>
    </ListContainer>
  );
}

DropDownList.propTypes = {
  toggleOptions: PropTypes.func.isRequired,
  handleCurrentValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
};

export default DropDownList;
