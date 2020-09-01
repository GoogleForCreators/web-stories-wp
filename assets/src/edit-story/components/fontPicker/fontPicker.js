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
import { useState, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
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
import { ReactComponent as DropDownIcon } from '../../icons/dropdown.svg';
import Popup from '../popup';
import FontPickerContainer from './pickerContainer';

const DEFAULT_WIDTH = 240;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.fg.black};
  font-family: ${({ theme }) => theme.fonts.body1.font};
`;

const FontPickerSelect = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme, lightMode }) =>
    lightMode
      ? rgba(theme.colors.fg.white, 0.1)
      : rgba(theme.colors.bg.black, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;
  border: 0;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme, lightMode }) =>
      lightMode ? theme.colors.fg.white : rgba(theme.colors.fg.white, 0.3)};
  }
`;

const FontPickerTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
`;

function FontPicker({ onChange, lightMode = false, placeholder, value }) {
  const ref = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const closeFontPicker = useCallback(() => {
    setIsOpen(false);
    // Restore focus
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  const toggleFontPicker = useCallback(() => setIsOpen((val) => !val), []);
  // Must be debounced to account for clicking the select box again
  // (closing in useFocusOut and then opening again in onClick)
  const [debouncedCloseFontPicker] = useDebouncedCallback(closeFontPicker, 100);

  const handleSelect = useCallback(
    (option) => {
      onChange(option);
      setIsOpen(false);
      ref.current.focus();
    },
    [onChange]
  );

  const handleKeyPress = useCallback(
    ({ key }) => {
      if (
        !isOpen &&
        key === 'ArrowDown' &&
        document.activeElement === ref.current
      ) {
        setIsOpen(true);
      }
    },
    [isOpen]
  );

  return (
    <Container onKeyDown={handleKeyPress}>
      <FontPickerSelect
        onClick={toggleFontPicker}
        aria-pressed={isOpen}
        aria-haspopup
        aria-expanded={isOpen}
        ref={ref}
        lightMode={lightMode}
        aria-label={__('Edit: Font family', 'web-stories')}
      >
        <FontPickerTitle>{value || placeholder}</FontPickerTitle>
        <DropDownIcon />
      </FontPickerSelect>
      <Popup anchor={ref} isOpen={isOpen} fillWidth={DEFAULT_WIDTH}>
        <FontPickerContainer
          isOpen={isOpen}
          value={value}
          onSelect={handleSelect}
          onClose={debouncedCloseFontPicker}
        />
      </Popup>
    </Container>
  );
}

FontPicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  lightMode: PropTypes.bool,
  placeholder: PropTypes.string,
};

FontPicker.defaultProps = {
  value: '',
  lightMode: false,
  placeholder: __('Select an Option', 'web-stories'),
};

export default FontPicker;
