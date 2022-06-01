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
import { getOptions } from '../menu/utils';
import { useLiveRegion } from '../../utils';

export default function useSearch({
  handleSearchValueChange,
  selectedValue,
  options,
}) {
  const speak = useLiveRegion('assertive');

  /**
   *Control when associated menu of search should be visible.
   */
  const [_isOpen, _setIsOpen] = useState(false);
  const setIsOpen = useDebouncedCallback(_setIsOpen, 100);

  const isOpen = useMemo(
    () => ({
      value: _isOpen,
      set: setIsOpen,
    }),
    [_isOpen, setIsOpen]
  );

  /**
   * Control whether focus is shifted to menu or input.
   */
  const [_isMenuFocused, _setIsMenuFocused] = useState(false);
  const setIsMenuFocused = useDebouncedCallback(_setIsMenuFocused, 300, {
    leading: true,
  });

  const isMenuFocused = useMemo(
    () => ({
      value: _isMenuFocused,
      set: setIsMenuFocused,
    }),
    [_isMenuFocused, setIsMenuFocused]
  );

  useEffect(() => {
    if (!isOpen.value) {
      setIsMenuFocused(false);
    }
  }, [isOpen, setIsMenuFocused]);

  /**
   * list of options to display in menu.
   */

  const normalizedOptions = useMemo(() => {
    if (!options || options.length === 0) {
      return [];
    }
    return getOptions(options);
  }, [options]);

  /**
   * the active option, if there is a selectedValue present that matches an option.
   */

  const getActiveOption = useCallback(
    (selectedVal) =>
      normalizedOptions
        .flatMap((optionSet) => optionSet.group)
        .find((option) => {
          return (
            option?.value?.toString().toLowerCase() ===
            selectedVal.toString().toLowerCase()
          );
        }),
    [normalizedOptions]
  );

  const activeOption = useMemo(() => {
    if (!selectedValue?.value || normalizedOptions.length === 0) {
      return null;
    }
    return getActiveOption(selectedValue.value);
  }, [selectedValue, normalizedOptions, getActiveOption]);

  /**
   * Monitor input value separate from selected value to respect user input while maintaining accurate results.
   */
  const [_inputState, setInputState] = useState(undefined);

  const inputState = useMemo(
    () => ({
      value: _inputState,
      set: setInputState,
    }),
    [_inputState]
  );

  useEffect(() => {
    if (inputState?.value === undefined && selectedValue?.value !== undefined) {
      inputState.set(selectedValue?.label || '');
    }
  }, [inputState, selectedValue]);
  /**
   * send the inputState when it changes back to the parent so that any results that need to change can be changed.
   */
  useEffect(() => {
    handleSearchValueChange?.(inputState.value);
  }, [handleSearchValueChange, inputState]);

  /* Announce changes to the length of the list */
  useEffect(() => {
    if (isOpen.value && inputState.value?.length) {
      const message = options.length
        ? sprintf(
            /* translators: %d number of results. */
            _n(
              '%d result found.',
              '%d results found.',
              options.length,
              'web-stories'
            ),
            options.length
          )
        : __('No results found.', 'web-stories');

      speak(message);
    }
  }, [inputState.value, isOpen.value, options.length, speak]);

  return {
    activeOption,
    getActiveOption,
    normalizedOptions,
    inputState,
    isMenuFocused,
    isOpen,
  };
}
