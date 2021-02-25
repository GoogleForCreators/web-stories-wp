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
import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { SearchInput } from '../../../../design-system';

/**
 * A Search Input component.
 *
 * @param {Object} obj The options for the component.
 * @param {string} obj.initialValue The initial value to populate the input with.
 * @param {string} obj.placeholder A placeholder text to show when it's empty.
 * @param {Function} obj.onSearch Callback to call when a search is triggered.
 * @param {boolean} obj.disabled Whether the input should be shown as disabled.
 * @param {boolean} obj.incremental If `incremental` is false, a search is
 * triggered when the user presses enter, or when they clear the input.
 * If `incremental` is true, this occurs when the text changes, optionally
 * debounced via `delayMs`.
 * @param {number} obj.delayMs The number of milliseconds to debounce an autoSearch.
 * @return {SearchInput} The component.
 * @class
 */
function WrappedSearchInput({
  initialValue,
  placeholder,
  onSearch,
  disabled = false,
  incremental = false,
  delayMs = 500,
}) {
  // Local state so that we can debounce triggering searches.
  const [localValue, setLocalValue] = useState(initialValue);

  // Effectively performs a search, triggered at most every `delayMs`.
  const [changeSearchTermDebounced] = useDebouncedCallback(() => {
    onSearch(localValue);
  }, delayMs);

  const onNewValue = useCallback(
    (newValue) => {
      // Handle search input changes. Triggers with every keystroke.
      setLocalValue(newValue);
      if (incremental && delayMs) {
        changeSearchTermDebounced();
      } else {
        onSearch(newValue);
      }
    },
    [changeSearchTermDebounced, onSearch, delayMs, incremental]
  );

  const onChange = useCallback((evt) => onNewValue(evt.target.value), [
    onNewValue,
  ]);

  const onClear = useCallback(() => onNewValue(''), [onNewValue]);

  const hasContent = localValue.length > 0;

  return (
    <SearchInput
      inputValue={localValue}
      placeholder={placeholder}
      onChange={onChange}
      handleClearInput={onClear}
      disabled={disabled}
      ariaInputLabel={__('Search', 'web-stories')}
      ariaClearLabel={__('Clear search input', 'web-stories')}
      isOpen={hasContent}
      role="textbox"
    />
  );
}

WrappedSearchInput.propTypes = {
  initialValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  incremental: PropTypes.bool,
  delayMs: PropTypes.number,
};

export default WrappedSearchInput;
