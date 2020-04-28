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
import { useState, useEffect, useRef, useMemo } from 'react';
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
import { useKeyDownEffect } from '../keyboard';
import useFocusOut from '../../utils/useFocusOut';
import { useFont } from '../../app/font';
import { TextInput } from '../form';
import { GlobalFontFaces } from './util';

const PickerContainer = styled.div`
  float: right;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-width: 160px;
  max-height: 355px;
  overflow: hidden;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  background-clip: padding-box;
  box-shadow: 0 6px 12px ${({ theme }) => rgba(theme.colors.bg.v0, 0.175)};
  padding: 0;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  max-height: 305px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
  padding-bottom: 8px;
`;

const List = styled.ul.attrs({ role: 'listbox' })`
  width: 100%;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  border-bottom: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
`;

const Item = styled.li.attrs({ tabIndex: '0', role: 'option' })`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 8px 12px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
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

const NoItem = styled.span`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 8px 12px 0 12px;
  margin: 0;
  font-style: italic;
  color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.54)};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
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
  margin: 8px;
`;

function FontPickerContainer({ handleCurrentValue, toggleOptions }) {
  const {
    state: { fonts, fontFaces, recentUsedFontSlugs },
    actions: { addUsedFont },
  } = useFont();

  const pickerContainerRef = useRef();
  const listContainerRef = useRef();
  const listRef = useRef();
  const inputRef = useRef();
  const currentActiveRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  // Font options with fontFace as property
  const optionsWithFontFaces = useMemo(
    () =>
      fonts.map((option) => {
        option.fontFace = fontFaces.find((fontFace) =>
          fontFace.includes(`'${option.name}'`)
        );
        return option;
      }),
    [fonts, fontFaces]
  );

  // Recently used font options, clean up on refresh
  const recentUsedFonts = useMemo(
    () =>
      searchValue && searchValue !== ''
        ? recentUsedFontSlugs
            .map((slug) =>
              optionsWithFontFaces.find((font) => font.slug === slug)
            )
            .filter(({ name }) =>
              name.toLowerCase().includes(searchValue.toLowerCase())
            )
        : recentUsedFontSlugs.map((slug) =>
            optionsWithFontFaces.find((font) => font.slug === slug)
          ),
    [searchValue, recentUsedFontSlugs, optionsWithFontFaces]
  );

  // Font options that start with search term
  const fileredFonts = useMemo(
    () =>
      searchValue && searchValue !== ''
        ? optionsWithFontFaces.filter(({ name }) =>
            name.toLowerCase().startsWith(searchValue.toLowerCase())
          )
        : optionsWithFontFaces,
    [searchValue, optionsWithFontFaces]
  );

  // Font options that include search term but not start with
  const includeSearchFonts = useMemo(
    () =>
      searchValue && searchValue !== ''
        ? optionsWithFontFaces.filter(
            ({ name }) =>
              name.toLowerCase().indexOf(searchValue.toLowerCase()) > 0
          )
        : [],
    [searchValue, optionsWithFontFaces]
  );

  useEffect(() => {
    inputRef.current.focus();
  });

  useEffect(() => {
    const listElement = listContainerRef.current;

    const handleScroll = () => {
      let { scrollTop } = listElement;
      scrollTop -= 5;
      let currentVisibleIndex = Math.floor(scrollTop / 34);
      if (
        recentUsedFonts.length > 0 &&
        currentVisibleIndex > recentUsedFonts.length
      ) {
        scrollTop -= 10;
        currentVisibleIndex =
          Math.floor(scrollTop / 34) - recentUsedFonts.length;
      }
      if (
        fileredFonts.length > 0 &&
        currentVisibleIndex > fileredFonts.length
      ) {
        scrollTop -= 10;
      }
      currentVisibleIndex = Math.floor(scrollTop / 34);
      if (currentVisibleIndex < 0) {
        currentVisibleIndex = 0;
      }
      if (currentVisibleIndex !== currentActiveRef.current) {
        currentActiveRef.current = currentVisibleIndex;
        setCurrentIndex(currentVisibleIndex);
      }
    };
    listElement.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
      listElement.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusOut(pickerContainerRef, toggleOptions);

  useKeyDownEffect(pickerContainerRef, { key: 'esc' }, toggleOptions, [
    toggleOptions,
  ]);

  const getVisibleFontFaces = () => {
    let combinedFontList = []
      .concat(recentUsedFonts)
      .concat(fileredFonts)
      .concat(includeSearchFonts)
      .slice(currentIndex, currentIndex + 10);

    return combinedFontList.map((font) => font.fontFace).join('');
  };

  const handleItemClick = (option, slug) => {
    handleCurrentValue(option);
    addUsedFont(slug);
  };

  const renderListWithOptions = (options, offset = 0) => {
    if (options?.length > 0) {
      return (
        <List aria-multiselectable={false} aria-required={false} ref={listRef}>
          {options.map(({ name, value, slug }, index) => (
            <Item
              key={value}
              onClick={() => handleItemClick(value, slug)}
              fontFamily={
                index < currentIndex + 10 - offset &&
                index >= currentIndex - offset
                  ? name
                  : undefined
              }
            >
              {name}
            </Item>
          ))}
        </List>
      );
    }
    return null;
  };

  return (
    <PickerContainer ref={pickerContainerRef}>
      <ExpandedTextInput
        forwardedRef={inputRef}
        value={searchValue}
        onChange={setSearchValue}
        color="white"
        clear
      />
      <ListContainer
        ref={listContainerRef}
        aria-labelledby={__('FontPicker', 'web-stories')}
      >
        <GlobalFontFaces menuFonts={getVisibleFontFaces} />
        {renderListWithOptions(recentUsedFonts)}
        {renderListWithOptions(fileredFonts, recentUsedFonts.length)}
        {renderListWithOptions(
          includeSearchFonts,
          fileredFonts.length + recentUsedFonts.length
        )}
        {recentUsedFonts.length === 0 &&
          fileredFonts.length === 0 &&
          includeSearchFonts.length === 0 && (
            <NoItem>{__('No matches found', 'web-stories')}</NoItem>
          )}
      </ListContainer>
    </PickerContainer>
  );
}

FontPickerContainer.propTypes = {
  toggleOptions: PropTypes.func.isRequired,
  handleCurrentValue: PropTypes.func.isRequired,
};

export default FontPickerContainer;
