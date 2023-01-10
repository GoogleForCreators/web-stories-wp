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
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useDebouncedCallback,
} from '@googleforcreators/react';
import { sprintf, _n, __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { getGroups } from '../menu/utils';
import type { DropdownValue } from '../menu';
import { useLiveRegion } from '../../utils';
import type { UseSearchProps } from './types';

export default function useSearch({
  handleSearchValueChange,
  selectedValue,
  searchValue,
  options,
}: UseSearchProps) {
  const speak = useLiveRegion('assertive');

  /**
   *Control when associated menu of search should be visible.
   */
  const [isOpen, _setIsOpen] = useState(false);
  const setIsOpen = useDebouncedCallback(_setIsOpen, 100);

  /**
   * Control whether focus is shifted to menu or input.
   */
  const [isMenuFocused, _setIsMenuFocused] = useState(false);
  const setIsMenuFocused = useDebouncedCallback(_setIsMenuFocused, 300, {
    leading: true,
  });

  useEffect(() => {
    if (!isOpen) {
      setIsMenuFocused(false);
    }
  }, [isOpen, setIsMenuFocused]);

  /**
   * list of options to display in menu.
   */

  const groups = useMemo(() => getGroups(options), [options]);

  /**
   * the active option, if there is a selectedValue present that matches an option.
   */

  const getActiveOption = useCallback(
    (selectedVal: DropdownValue) =>
      groups
        .flatMap((group) => group.options)
        .find(
          (option) =>
            String(option.value).toLowerCase() ===
            String(selectedVal).toLowerCase()
        ),
    [groups]
  );

  const activeOption = useMemo(() => {
    const selected = selectedValue ? String(selectedValue.value) : searchValue;
    if (!selected || groups.length === 0) {
      return null;
    }
    return getActiveOption(selected);
  }, [selectedValue, searchValue, groups, getActiveOption]);

  /**
   * Monitor input value separate from selected value to respect user input while maintaining accurate results.
   */
  const [inputState, _setInputState] = useState<string | undefined>(
    searchValue
  );

  /**
   * send the inputState when it changes back to the parent so that any results that need to change can be changed.
   */
  const setInputState = useCallback(
    (value: string | undefined) => {
      _setInputState(value);
      if (value !== undefined) {
        handleSearchValueChange?.(value);
      }
    },
    [handleSearchValueChange]
  );

  useEffect(() => {
    if (inputState === undefined && selectedValue?.value !== undefined) {
      setInputState(selectedValue?.label || '');
    }
  }, [inputState, setInputState, selectedValue]);

  /* Announce changes to the length of the list */
  useEffect(() => {
    if (isOpen && inputState?.length) {
      const message = options.length
        ? sprintf(
            /* translators: %d: number of results. */
            _n(
              '%d result found.',
              '%d results found.',
              options.length,
              'web-stories'
            ),
            String(options.length)
          )
        : __('No results found.', 'web-stories');

      speak(message);
    }
  }, [inputState, isOpen, options.length, speak]);

  return {
    activeOption,
    getActiveOption,
    groups,
    inputState,
    setInputState,
    isMenuFocused,
    setIsMenuFocused,
    isOpen,
    setIsOpen,
  };
}
