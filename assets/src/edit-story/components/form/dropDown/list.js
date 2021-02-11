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
import { useKeyDownEffect } from '../../../../design-system';
import useFocusOut from '../../../utils/useFocusOut';

const ListContainer = styled.div`
  float: right;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  max-height: 370px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.black};
`;

const List = styled.ul`
  width: 100%;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  background-clip: padding-box;
  box-shadow: 0 6px 12px
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.175)};
`;

const Item = styled.li.attrs({ tabIndex: '0' })`
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.label.letterSpacing};
  padding: 8px 16px;
  margin: 0;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.weight};
  line-height: 1;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};

  &:hover,
  &:focus {
    background-color: ${({ theme }) =>
      rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.1)};
    outline: none;
  }
`;

const availableKeysForSearch = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

function DropDownList({
  handleCurrentValue,
  value,
  options,
  toggleOptions,
  hasMenuRole = false,
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

  const handleEnter = useCallback(
    (evt) => {
      handleCurrentValue(focusedValue, evt);
    },
    [focusedValue, handleCurrentValue]
  );

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

  const handleItemClick = (option, evt) => {
    handleCurrentValue(option, evt);
  };

  return (
    <ListContainer ref={listContainerRef}>
      <List
        {...rest}
        aria-activedescendant={value || ''}
        ref={listRef}
        role={hasMenuRole ? 'menu' : 'listbox'}
      >
        {options.map(({ name, value: optValue }) => (
          <Item
            id={`dropDown-${optValue}`}
            key={optValue}
            onClick={(evt) => handleItemClick(optValue, evt)}
            role={hasMenuRole ? 'menuitem' : 'option'}
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array.isRequired,
  hasMenuRole: PropTypes.bool,
};

export default DropDownList;
