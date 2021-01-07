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
import { useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies
 */
import { getOptions } from '../menu/utils';

export default function useDropDown({ options = [], selectedValue }) {
  const [_isOpen, _setIsOpen] = useState(false);

  const [setIsOpen] = useDebouncedCallback(_setIsOpen, 300, {
    leading: true,
    trailing: false,
  });

  const isOpen = useMemo(
    () => ({
      value: _isOpen,
      set: setIsOpen,
    }),
    [_isOpen, setIsOpen]
  );

  const normalizedOptions = useMemo(() => {
    if (!options || options.length == 0) {
      return [];
    }
    return getOptions(options);
  }, [options]);

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

  return { activeOption, normalizedOptions, isOpen };
}
