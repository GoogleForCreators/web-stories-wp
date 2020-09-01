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
import styled, { css } from 'styled-components';
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
import { ReactComponent as SearchIcon } from '../../icons/search.svg';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
import { useFont } from '../../app/font';
import ScrollList from './scrollList';

const PickerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-width: 160px;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.bg.black};
  border-radius: ${({ theme }) => theme.border.radius.default};
  padding: 5px;
  margin-top: 16px;
`;

const List = styled(ScrollList)`
  width: 100%;
  max-height: 305px;
  padding: 0 0 10px 0;
  margin: 10px 0 0 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  scrollbar-width: thin;
  scrollbar-color: transparent
    ${({ theme }) => rgba(theme.colors.bg.white, 0.38)};

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    border: none;
    background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.38)};
  }
`;

const Divider = styled.div`
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.tab.family};
  font-weight: ${({ theme }) => theme.fonts.tab.weight};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  line-height: 14px;
  color: ${({ theme }) => theme.colors.accent.secondary};
  padding: 8px;
  margin: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const inputIconStyles = css`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  height: 14px;
  width: 30px;
  padding: 0;
  margin: 0;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;

  > svg {
    height: 100%;
    width: auto;
    color: ${({ theme }) => theme.colors.fg.white};
    fill: ${({ theme }) => theme.colors.fg.white};
  }
`;

const SearchIconContainer = styled.div`
  ${inputIconStyles}
  left: 0;
`;

const ClearButton = styled.button`
  ${inputIconStyles}
  right: 0;
  height: 100%;
  opacity: 0.4;
  cursor: pointer;

  > svg {
    height: 10px;
  }
`;

const SearchInput = styled.input.attrs({
  type: 'search',
  role: 'combobox',
  ['aria-autocomplete']: 'list',
  ['aria-owns']: 'editor-font-picker-list',
})`
  width: 100%;
  padding: 6px 20px 6px 30px;
  border-radius: ${({ theme }) => theme.border.radius.default};
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
  color: ${({ theme }) => theme.colors.fg.white};
  font-size: ${({ theme }) => theme.fonts.input.size};
  line-height: ${({ theme }) => theme.fonts.input.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.input.weight};
  font-family: ${({ theme }) => theme.fonts.input.family};

  &::-ms-clear {
    display: none;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    appearance: none;
  }

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
  padding: 8px 16px;
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
  display: inline-block;
  width: 8px;
  height: auto;
  margin-right: 8px;
`;

const NoResult = styled.div`
  width: 100%;
  padding: 13px 11px;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.75)};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  line-height: 14px;
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
        {dividerIndexTracker.current >= 0 && index === 0 && (
          <Divider>{__('Recently used', 'web-stories')}</Divider>
        )}
        {index === dividerIndexTracker.current + 1 && (
          <Divider>{__('Recommended', 'web-stories')}</Divider>
        )}
        <Item
          fontFamily={service.includes('google') ? `'${name}::MENU'` : name}
          onClick={() => onSelect(name)}
        >
          {name === value && (
            <Selected aria-label={__('Selected', 'web-stories')} />
          )}
          {name}
        </Item>
      </>
    ),
    [onSelect, value]
  );

  return (
    isOpen && (
      <PickerContainer role="dialog" ref={ref}>
        <SearchContainer>
          <SearchInput
            ref={inputRef}
            aria-expanded={Boolean(matchingFonts.length)}
            value={searchKeyword}
            onKeyDown={handleKeyPress}
            placeholder={__('Search', 'web-stories')}
            onChange={handleSearchInputChanged}
          />
          <SearchIconContainer>
            <SearchIcon />
          </SearchIconContainer>
          {searchKeyword.trim().length > 0 && (
            <ClearButton
              onClick={() =>
                handleSearchInputChanged({ target: { value: '' } })
              }
            >
              <CloseIcon />
            </ClearButton>
          )}
        </SearchContainer>
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
    )
  );
}

FontPickerContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FontPickerContainer;
