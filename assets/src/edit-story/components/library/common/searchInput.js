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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as Close } from '../../../icons/close.svg';
import { TextInput } from '../../form';

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Search = styled(TextInput)`
  width: 100%;
  flex-grow: 1;
  border: none;
  border-radius: 4px;
  padding: 8px 16px 8px 16px;
`;

const CloseIcon = styled(Close)`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.fg.v1};
`;

/**
 * A Search Input component.
 *
 * @param {Object} obj The options for the component.
 * @param {string} obj.initialValue The initial value to populate the input with.
 * @param {string} obj.placeholder A placeholder text to show when it's empty.
 * @param {string } obj.onSearch Callback to call when a search is triggered.
 * @param {boolean} obj.disabled Whether the input should be shown as disabled.
 * @param {boolean} obj.autoSearch If `autoSearch` is false, a search is triggered
 * when the user presses enter, or when they clear the input.
 * If `autoSearch` is true, this occurs when the text changes, optionally
 * debounced via `delayMs`.
 * @param {number} obj.delayMs The number of milliseconds to debounce an autoSearch.
 * @return {SearchInput} The component.
 * @class
 */
export default function SearchInput({
  initialValue,
  placeholder,
  onSearch,
  disabled,
  autoSearch,
  delayMs,
}) {
  // Local state so that we can debounce triggering searches.
  const [localValue, setLocalValue] = useState(initialValue);

  /**
   * Effectively performs a search, triggered at most every 500ms.
   */
  const [changeSearchTermDebounced] = useDebouncedCallback(() => {
    onSearch(localValue);
  }, delayMs);

  /**
   * Handle search input changes. Triggers with every keystroke.
   *
   * @param {string} v the new search term.
   */
  const onChange = (v) => {
    setLocalValue(v);
    // When in non-autoSearch mode, we still trigger onSearch when the search
    // term is empty, so that the user doesn't need to press enter in that case.
    if (!autoSearch && v !== '') {
      return;
    }
    if (autoSearch && delayMs) {
      changeSearchTermDebounced();
    } else {
      onSearch(v);
    }
  };

  const onKeyDown = (e) => {
    if (!autoSearch && e.key === 'Enter') {
      onSearch(localValue);
    }
  };

  return (
    <SearchField>
      <Search
        value={localValue}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-label={__('Search from library', 'web-stories')}
        clear
        clearIcon={<CloseIcon />}
        showClearIconBackground={false}
      />
    </SearchField>
  );
}

SearchInput.propTypes = {
  initialValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  autoSearch: PropTypes.bool,
  delayMs: PropTypes.number,
};

SearchInput.defaultProps = {
  disabled: false,
  autoSearch: false,
  delayMs: 500,
};
