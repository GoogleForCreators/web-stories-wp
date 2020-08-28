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
import { useRef, useCallback, useState, useEffect } from 'react';
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
import { useDebouncedCallback } from 'use-debounce/lib';
import useFocusOut from '../../utils/useFocusOut';
import { ReactComponent as Checkmark } from '../../icons/checkmark.svg';
import { useFont } from '../../app/font';
import ScrollList from './scrollList';

const PickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-width: 160px;
  max-height: 355px;
  padding: 16px 0 0 0;
  box-shadow: 0px 8px 10px ${({ theme }) => rgba(theme.colors.bg.black, 0.15)};
  overflow: hidden;
`;

const List = styled(ScrollList)`
  width: 100%;
  max-height: 305px;
  padding: 5px 0;
  margin: 16px 0 0 0;
  background-color: ${({ theme }) => theme.colors.bg.black};
  font-size: 14px;
  text-align: left;
  list-style: none;
  border-radius: ${({ theme }) => theme.border.radius.default};
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
  scrollbar-width: thin;
  scrollbar-color: transparent
    ${({ theme }) => rgba(theme.colors.bg.white, 0.38)};

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
    background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.38)};
  }
`;

const Divider = styled.hr`
  margin: 5px 0;
  height: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.black, 0.1)};
  border-width: 1px 0 0;
`;

const SearchInput = styled.input.attrs({
  type: 'search',
  role: 'combobox',
  ['aria-autocomplete']: 'list',
  ['aria-owns']: 'editor-font-picker-list',
})`
  margin: 1px 1px 0;
  padding: 6px 12px 6px 26px;
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.default};
  background: ${({ theme }) => theme.colors.bg.panel};
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
  color: ${({ theme }) => theme.colors.fg.white};
  font-size: ${({ theme }) => theme.fonts.input.size};
  line-height: ${({ theme }) => theme.fonts.input.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.input.weight};
  font-family: ${({ theme }) => theme.fonts.input.family};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const Item = styled.div.attrs(({ fontFamily }) => ({
  style: {
    fontFamily,
  },
}))`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 8px 12px 8px 26px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.fg.white};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  line-height: 1;
  position: relative;
  cursor: pointer;
  background-clip: padding-box;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.1)};
    outline: none;
  }
`;

const Selected = styled(Checkmark)`
  position: absolute;
  left: 0;
  top: 3px;
  width: 28px;
  height: 28px;
`;

const NoResult = styled.div`
  width: 100%;
  padding: 18px 16px;
  margin: 16px 0 0 0;
  text-align: center;
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.75)};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  line-height: 20px;
  background-color: ${({ theme }) => theme.colors.bg.black};
  border-radius: ${({ theme }) => theme.border.radius.default};
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
`;

function FontPickerContainer({ value, onSelect, onClose, isOpen }) {
  const {
    state: { fonts, recentFonts, curatedFonts },
    actions: { ensureMenuFontsLoaded },
  } = useFont();

  const ref = useRef();
  const inputRef = useRef();
  const dividerIndexTracker = useRef(recentFonts.length - 1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [matchingFonts, setMatchingFonts] = useState([
    ...recentFonts,
    ...curatedFonts,
  ]);

  useEffect(() => {
    if (isOpen) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  const handleScroll = useCallback(
    (startIndex, endIndex) => {
      const startFrom = Math.max(0, startIndex - 2);
      // Slice does not include the last element, thus we use matchingFonts.length directly here.
      const endAt = Math.min(matchingFonts.length, endIndex + 2);
      const visibleFontNames = matchingFonts
        .slice(startFrom, endAt)
        .filter(({ service }) => service === 'fonts.google.com')
        .map(({ name }) => name);
      ensureMenuFontsLoaded(visibleFontNames);
    },
    [ensureMenuFontsLoaded, matchingFonts]
  );

  useFocusOut(ref, onClose, [onClose]);

  const [currentOffset, setCurrentOffset] = useState(0);

  const [updateMatchingFonts] = useDebouncedCallback(
    () => {
      // Restore default if less than 2 characters.
      if (searchKeyword.trim().length < 2) {
        dividerIndexTracker.current = recentFonts.length - 1;
        setMatchingFonts([...recentFonts, ...curatedFonts]);
        return;
      }
      const _fonts = fonts.filter(({ name }) =>
        name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      const _recentFonts = recentFonts.filter(({ name }) =>
        name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      dividerIndexTracker.current = _recentFonts.length - 1;
      setMatchingFonts([..._recentFonts, ..._fonts]);
    },
    250,
    {},
    [searchKeyword, fonts, curatedFonts]
  );

  const handleSearchInputChanged = useCallback(
    ({ target }) => {
      setSearchKeyword(target.value);
      updateMatchingFonts();
    },
    [updateMatchingFonts]
  );

  useEffect(() => {
    if (searchKeyword.trim().length > 0) {
      setCurrentOffset(-1);
    }
  }, [searchKeyword]);

  const handleKeyPress = useCallback(
    ({ key }) => {
      if (key === 'Escape') {
        onClose();
      } else if (key === 'Enter') {
        onSelect(matchingFonts[currentOffset].name);
      } else if (key === 'ArrowUp') {
        setCurrentOffset(Math.max(0, currentOffset - 1));
      } else if (key === 'ArrowDown') {
        setCurrentOffset(Math.min(matchingFonts.length - 1, currentOffset + 1));
      }
    },
    [currentOffset, matchingFonts, onClose, onSelect]
  );

  const itemRenderer = useCallback(
    ({ service, name }, index) => (
      <>
        <Item
          fontFamily={service.includes('google') ? `'${name}::MENU'` : name}
          onClick={() => onSelect(name)}
        >
          {name === value && (
            <Selected aria-label={__('Selected', 'web-stories')} />
          )}
          {name}
        </Item>
        {index === dividerIndexTracker.current && <Divider />}
      </>
    ),
    [onSelect, value]
  );

  return (
    <PickerContainer role="dialog" ref={ref}>
      <SearchInput
        ref={inputRef}
        aria-expanded={Boolean(matchingFonts.length)}
        value={searchKeyword}
        onKeyDown={handleKeyPress}
        placeholder={__('Search', 'web-stories')}
        onChange={handleSearchInputChanged}
      />
      {matchingFonts.length ? (
        <List
          id="editor-font-picker-list"
          onKeyDown={handleKeyPress}
          items={matchingFonts}
          onScroll={handleScroll}
          itemRenderer={itemRenderer}
          currentOffset={currentOffset}
        />
      ) : (
        <NoResult>{__('No matches found', 'web-stories')}</NoResult>
      )}
    </PickerContainer>
  );
}

FontPickerContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FontPickerContainer;
