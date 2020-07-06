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
  box-shadow: 0px 8px 10px ${({ theme }) => rgba(theme.colors.bg.v0, 0.15)};
  overflow: hidden;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.bg.v14};
  background-clip: padding-box;
  padding: 0;
`;

const List = styled(ScrollList)`
  width: 100%;
  max-height: 305px;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  scrollbar-width: thin;
  scrollbar-color: transparent ${({ theme }) => rgba(theme.colors.bg.v1, 0.38)};

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
    background-color: ${({ theme }) => rgba(theme.colors.bg.v1, 0.38)};
  }
`;

const Divider = styled.hr`
  margin: 5px 0;
  height: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
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
  border-radius: 4px 4px 0 0;
  background: ${({ theme }) => theme.colors.bg.v15};
  border: none;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: ${({ theme }) => theme.fonts.input.size};
  line-height: ${({ theme }) => theme.fonts.input.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.input.weight};
  font-family: ${({ theme }) => theme.fonts.input.family};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.selection};
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
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  position: relative;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.bg.v15};
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

const NoResult = styled.span`
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
  padding: 15px 12px 15px 26px;
  margin: 0;
  font-style: italic;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
`;

function FontPickerContainer({ value, onSelect, onClose, isOpen }) {
  const {
    state: { fonts, recentFonts },
    actions: { ensureMenuFontsLoaded },
  } = useFont();

  const ref = useRef();
  const inputRef = useRef();
  const dividerIndexTracker = useRef(recentFonts.length - 1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [matchingFonts, setMatchingFonts] = useState([
    ...recentFonts,
    ...fonts,
  ]);

  useEffect(() => {
    if (isOpen) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  const handleScroll = useCallback(
    (startIndex, endIndex) => {
      const startFrom = Math.max(0, startIndex - 2);
      const endAt = Math.min(matchingFonts.length - 1, endIndex + 2);
      const visibleFontNames = matchingFonts
        .slice(startFrom, endAt)
        .filter(({ service }) => service === 'fonts.google.com')
        .map(({ name }) => name);
      ensureMenuFontsLoaded(visibleFontNames);
    },
    [ensureMenuFontsLoaded, matchingFonts]
  );

  useFocusOut(ref, onClose, [onClose]);

  // Scroll to offset for current value
  const [currentOffset, setCurrentOffset] = useState(
    fonts.findIndex(({ name }) => name === value)
  );

  const [updateMatchingFonts] = useDebouncedCallback(
    () => {
      if (searchKeyword.trim() === '') {
        dividerIndexTracker.current = recentFonts.length - 1;
        setMatchingFonts([...recentFonts, ...fonts]);
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
    [searchKeyword, fonts]
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
