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
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import useFocusOut from '../../utils/useFocusOut';
import { useAPI } from '../../app/api';
import { TextInput } from '../form';

const PickerContainer = styled.div`
  float: right;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 160px;
  max-height: 355px;
  overflow: hidden;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  background-clip: padding-box;
  box-shadow: 0 6px 12px ${({ theme }) => rgba(theme.colors.bg.v0, 0.175)};
  padding: 8px;
  ${({ menuFonts }) => menuFonts};
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  max-height: 355px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
`;

const List = styled.ul.attrs({ role: 'listbox' })`
  width: 100%;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
`;

const Item = styled.li.attrs({ tabIndex: '0', role: 'option' })`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 16px;
  margin: 0;
  font-family: ${({ theme, fontFamily }) =>
    fontFamily ? fontFamily : theme.fonts.label.family};
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

const BoxedTextInput = styled(TextInput)`
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.colors.bg.v4};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  color: ${({ theme }) => theme.colors.fg.v0};
`;

const ExpandedTextInput = styled(BoxedTextInput)`
  flex-grow: 1;
`;

function FontPickerContainer({
  handleCurrentValue,
  value,
  ariaLabel,
  options,
  toggleOptions,
}) {
  const {
    actions: { getMenuFonts },
  } = useAPI();

  const pickerContainerRef = useRef();
  const listContainerRef = useRef();
  const listRef = useRef();
  const inputRef = useRef();

  const [searchValue, setSearchValue] = useState('');
  const [menuFonts, setMenuFonts] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileredOptions = useMemo(
    () =>
      searchValue && searchValue !== ''
        ? options.filter(({ name }) =>
            name.toLowerCase().includes(searchValue.toLowerCase())
          )
        : options,
    [searchValue, options]
  );

  useEffect(() => {
    inputRef.current.focus();
  });

  useLayoutEffect(() => {
    const listElement = listContainerRef.current;

    const handleScroll = () => {
      const { scrollTop } = listElement;
      const currentVisibleIndex = Math.floor(scrollTop / 50);
      if (currentVisibleIndex !== currentIndex) {
        setCurrentIndex(currentVisibleIndex);
      }
    };

    listElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      listElement.removeEventListener('scroll', handleScroll);
    };
  }, [currentIndex]);

  useEffect(() => {
    const limitFonts = fileredOptions
      .slice(currentIndex, currentIndex + 10)
      .map(({ name }) => name);
    getMenuFonts(limitFonts).then((result) => {
      setMenuFonts(result);
    });
  }, [currentIndex, getMenuFonts, fileredOptions]);

  useFocusOut(pickerContainerRef, toggleOptions);

  useKeyDownEffect(pickerContainerRef, { key: 'esc' }, toggleOptions, [
    toggleOptions,
  ]);

  const handleItemClick = (option) => {
    handleCurrentValue(option);
  };

  return (
    <PickerContainer ref={pickerContainerRef} menuFonts={menuFonts}>
      <ExpandedTextInput
        forwardedRef={inputRef}
        value={searchValue}
        onChange={setSearchValue}
        color="white"
        clear
      />
      <ListContainer ref={listContainerRef}>
        <List
          aria-multiselectable={false}
          aria-required={false}
          aria-activedescendant={value || ''}
          aria-labelledby={ariaLabel}
          ref={listRef}
        >
          {fileredOptions.map(({ name, value: optValue }, index) => (
            <Item
              id={`dropDown-${optValue}`}
              aria-selected={value === optValue}
              key={optValue}
              onClick={() => handleItemClick(optValue)}
              fontFamily={
                index < currentIndex + 10 && index >= currentIndex
                  ? name
                  : undefined
              }
            >
              {name}
            </Item>
          ))}
        </List>
      </ListContainer>
    </PickerContainer>
  );
}

FontPickerContainer.propTypes = {
  toggleOptions: PropTypes.func.isRequired,
  handleCurrentValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  ariaLabel: PropTypes.string,
  options: PropTypes.array.isRequired,
};

export default FontPickerContainer;
