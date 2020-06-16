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
  padding: 8px 12px 8px 26px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  position: relative;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.bg.v12};
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
  padding: 8px 12px 0 12px;
  margin: 0;
  font-style: italic;
  color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.54)};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
`;

function FontPickerContainer({ value, onSelect, onClose }) {
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
        .filter(({ service }) => service === 'fonts.google.com')
        .map(({ name }) => name);
      ensureMenuFontsLoaded(visibleFontNames);
    },
    [ensureMenuFontsLoaded, fonts]
  );

  useFocusOut(ref, onClose, [onClose]);

  // Scroll to offset for current value
  const currentOffset = fonts.findIndex(({ name }) => name === value);

  // This is static for now, but with search and used fonts, this will change later
  const matchingFonts = fonts;

  const itemRenderer = useCallback(
    ({ service, name, hasDivider }) => (
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
        {hasDivider && <Divider />}
      </>
    ),
    [onSelect, value]
  );

  return (
    <PickerContainer ref={ref}>
      {matchingFonts.length ? (
        <List
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
  value: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FontPickerContainer;
