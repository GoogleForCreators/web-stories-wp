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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
/**
 * Internal dependencies
 */
import { getOptions } from '../menu/utils';

export default function useTypeahead({
  handleTypeaheadValueChange,
  isFlexibleValue,
  selectedValue,
  options,
}) {
  // Refs here act as a control for when to force an update to the visible input value
  const activeOptionRef = useRef();
  const inputValueRef = useRef();
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
   * Monitor input value separate from selected value to respect user input while maintaining accurate results.
   */
  const [_inputValue, setInputValue] = useState('');

  const inputValue = useMemo(
    () => ({
      value: _inputValue,
      set: setInputValue,
    }),
    [_inputValue]
  );

  useEffect(() => {
    if (!isFlexibleValue && isOpen?.value) {
      setInputValue('');
    }
  }, [isFlexibleValue, isOpen]);

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
  const activeOption = useMemo(() => {
    if (!selectedValue || normalizedOptions.length === 0) {
      return null;
    }

    return normalizedOptions
      .flatMap((optionSet) => optionSet.group)
      .find((option) => {
        return (
          option?.value?.toString().toLowerCase() ===
          selectedValue.toString().toLowerCase()
        );
      });
  }, [selectedValue, normalizedOptions]);

  /**
   * send the inputValue when it changes back to the parent so that any results that need to change can be changed.
   */
  useEffect(() => handleTypeaheadValueChange?.(inputValue.value), [
    handleTypeaheadValueChange,
    inputValue,
  ]);

  useEffect(() => (inputValueRef.current = inputValue.value), [inputValue]);

  /**
   * When selectedValue updates we want to update input value too but only if it's different from the previously set inputValue.
   * This prevents reseting the input preemptively on clearing the input
   */
  useEffect(() => {
    if (
      activeOption?.label &&
      activeOption.label !== activeOptionRef?.current
    ) {
      activeOptionRef.current = activeOption.label;
      if (isFlexibleValue || inputValueRef?.current.length > 0) {
        setInputValue(activeOption.label);
      }
    }

    return () => {
      activeOptionRef.current = undefined;
      inputValueRef.current = undefined;
    };
  }, [activeOption, isFlexibleValue]);

  return { activeOption, normalizedOptions, inputValue, isMenuFocused, isOpen };
}
