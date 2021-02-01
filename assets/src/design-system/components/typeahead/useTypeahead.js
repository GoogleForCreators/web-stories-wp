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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
/**
 * Internal dependencies
 */
import { getOptions } from '../menu/utils';

export default function useTypeahead({
  handleTypeaheadValueChange,
  selectedValue,
  options,
}) {
  /**
   *Control when associated menu of typeahead should be visible.
   */
  const [_isOpen, _setIsOpen] = useState(false);
  const [setIsOpen] = useDebouncedCallback(_setIsOpen, 300);

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
  const [setIsMenuFocused] = useDebouncedCallback(_setIsMenuFocused, 300);

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
    if (!options || options.length == 0) {
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

  /**
   * Monitor input value separate from selected value to respect user input while maintaining accurate results.
   */
  const [_inputValue, setInputValue] = useState('');

  const handleOptionSetAsInputValue = useCallback(
    (newValue = '') => {
      const newInputVal = getActiveOption(newValue)?.label;
      setInputValue(newInputVal);
    },
    [getActiveOption]
  );

  const inputValue = useMemo(
    () => ({
      value: _inputValue,
      set: setInputValue,
      updateToOption: handleOptionSetAsInputValue,
    }),
    [_inputValue, handleOptionSetAsInputValue]
  );

  const activeOption = useMemo(() => {
    if (!selectedValue || normalizedOptions.length === 0) {
      return null;
    }
    return getActiveOption(selectedValue);
  }, [selectedValue, normalizedOptions, getActiveOption]);

  /**
   * send the inputValue when it changes back to the parent so that any results that need to change can be changed.
   */
  useEffect(() => handleTypeaheadValueChange?.(inputValue.value), [
    handleTypeaheadValueChange,
    inputValue,
  ]);

  return { activeOption, normalizedOptions, inputValue, isMenuFocused, isOpen };
}
