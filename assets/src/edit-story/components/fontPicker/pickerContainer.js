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
import { useRef, useCallback } from 'react';
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
import ScrollList from './scrollList';

const PickerContainer = styled.div`
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

const List = styled(ScrollList)`
  width: 100%;
  max-height: 305px;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
`;

const Divider = styled.hr`
  margin: 5px 0;
  height: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  border-width: 1px 0 0;
`;

const Item = styled.div.attrs(({ fontFamily }) => ({
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

const NoResult = styled.span`
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

function FontPickerContainer({ onSelect, onClose }) {
  const {
    state: { fonts },
    actions: { ensureMenuFontsLoaded },
  } = useFont();

  const ref = useRef();

  const handleScroll = useCallback(
    (startIndex, endIndex) => {
      const startFrom = Math.max(0, startIndex - 2);
      const endAt = Math.min(fonts.length - 1, endIndex + 2);
      const visibleFontNames = fonts
        .slice(startFrom, endAt)
        .map(({ name }) => name)
        .filter((name) => Boolean(name));
      ensureMenuFontsLoaded(visibleFontNames);
    },
    [ensureMenuFontsLoaded, fonts]
  );

  useFocusOut(ref, onClose, [onClose]);

  const matchingFonts = fonts.map((font, index) => ({
    ...font,
    hasDivider: index % 10 === 9,
  }));

  const itemRenderer = useCallback(
    (item) => {
      const { service, name, hasDivider } = item;
      return (
        <>
          <Item
            fontFamily={service.includes('google') ? `'${name}::MENU'` : name}
            onClick={() => onSelect(item)}
          >
            {name}
          </Item>
          {hasDivider && <Divider />}
        </>
      );
    },
    [onSelect]
  );

  return (
    <PickerContainer ref={ref}>
      <ExpandedTextInput
        ariaLabel={__('Search Fonts', 'web-stories')}
        placeholder={__('Search fonts', 'web-stories')}
        color="white"
        clear
      />
      {matchingFonts.length ? (
        <List
          items={matchingFonts}
          onScroll={handleScroll}
          itemRenderer={itemRenderer}
        />
      ) : (
        <NoResult>{__('No matches found', 'web-stories')}</NoResult>
      )}
    </PickerContainer>
  );
}

FontPickerContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FontPickerContainer;
