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
import useFocusOut from '../../utils/useFocusOut';
import { useFont } from '../../app/font';
import { TextInput } from '../form';

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
  ${({ menuFonts }) => menuFonts}
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

const Item = styled.li.attrs(({ fontFamily }) => ({
  tabIndex: '0',
  role: 'option',
  style: {
    fontFamily,
  },
}))`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 8px 12px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
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

const LIST_PADDING = 5;
const FONT_ROW_HEIGHT = 34;

function FontPickerContainer({ handleCurrentValue, toggleOptions }) {
  const {
    state: { fonts, recentUsedFontSlugs },
    actions: { addUsedFontSlug, getMenuFonts },
  } = useFont();

  const pickerContainerRef = useRef();
  const listContainerRef = useRef();
  const listRef = useRef();
  const inputRef = useRef();
  const currentActiveRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [menuFonts, setMenuFonts] = useState();

  // Recently used font options, clean up on refresh
  const recentUsedFonts = useMemo(() => {
    const fontsFromSlug = recentUsedFontSlugs.map((slug) =>
      fonts.find((font) => font.slug === slug)
    );
    return searchValue && searchValue !== ''
      ? fontsFromSlug.filter(({ name }) =>
          name.toLowerCase().includes(searchValue.toLowerCase())
        )
      : fontsFromSlug;
  }, [searchValue, recentUsedFontSlugs, fonts]);

  // Font options that start with search term
  const otherFonts = useMemo(
    () =>
      searchValue && searchValue !== ''
        ? fonts.filter(({ name }) =>
            name.toLowerCase().startsWith(searchValue.toLowerCase())
          )
        : fonts,
    [searchValue, fonts]
  );

  // Font options that include search term but not start with
  const includeSearchFonts = useMemo(
    () =>
      searchValue && searchValue !== ''
        ? fonts.filter(
            ({ name }) =>
              name.toLowerCase().indexOf(searchValue.toLowerCase()) > 0
          )
        : [],
    [searchValue, fonts]
  );

  useEffect(() => {
    const combinedFontList = [
      ...recentUsedFonts,
      ...otherFonts,
      ...includeSearchFonts,
    ]
      .slice(currentIndex, currentIndex + 10)
      .filter(({ service }) => service.includes('google'))
      .map(({ name }) => name);

    if (combinedFontList.length > 0) {
      getMenuFonts(combinedFontList).then(setMenuFonts);
    }
  }, [
    currentIndex,
    getMenuFonts,
    recentUsedFonts,
    otherFonts,
    includeSearchFonts,
  ]);

  useEffect(() => {
    inputRef.current.focus();
  });

  useEffect(() => {
    const listElement = listContainerRef.current;

    const handleScroll = () => {
      let { scrollTop } = listElement;
      scrollTop -= LIST_PADDING;
      let currentVisibleIndex = Math.floor(scrollTop / FONT_ROW_HEIGHT);
      if (
        recentUsedFonts.length > 0 &&
        currentVisibleIndex > recentUsedFonts.length
      ) {
        scrollTop -= LIST_PADDING * 2;
        currentVisibleIndex =
          Math.floor(scrollTop / FONT_ROW_HEIGHT) - recentUsedFonts.length;
      }
      if (otherFonts.length > 0 && currentVisibleIndex > otherFonts.length) {
        scrollTop -= LIST_PADDING * 2;
      }
      currentVisibleIndex = Math.floor(scrollTop / FONT_ROW_HEIGHT);
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

  useFocusOut(pickerContainerRef, toggleOptions, [toggleOptions]);

  const handleItemClick = (option, slug) => {
    handleCurrentValue(option);
    addUsedFontSlug(slug);
  };

  const renderListWithOptions = (options) => {
    if (options?.length > 0) {
      return (
        <List aria-multiselectable={false} aria-required={false} ref={listRef}>
          {options.map(({ name, value, slug, service }) => (
            <Item
              key={value}
              onClick={() => handleItemClick(value, slug)}
              fontFamily={service.includes('google') ? `'${name}::MENU'` : name}
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
        menuFonts={menuFonts}
      >
        {renderListWithOptions(recentUsedFonts)}
        {renderListWithOptions(otherFonts)}
        {renderListWithOptions(includeSearchFonts)}
        {!recentUsedFonts.length &&
          !otherFonts.length &&
          !includeSearchFonts.length && (
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
