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
import { useLiveRegion } from '../../utils';
import type { UseDropDownProps } from './types';

export default function useDropDown({
  options = [],
  selectedValue,
}: UseDropDownProps) {
  const [isOpen, _setIsOpen] = useState(false);
  const speak = useLiveRegion('assertive');

  const setIsOpen = useDebouncedCallback(_setIsOpen, 300, {
    leading: true,
    trailing: false,
  });

  const groups = useMemo(() => getGroups(options), [options]);

  const activeOption = useMemo(() => {
    if (!selectedValue || groups.length === 0) {
      return null;
    }

    return groups
      .flatMap((optionSet) => optionSet.options)
      .find(
        (option) =>
          String(option.value).toLowerCase() ===
          String(selectedValue).toLowerCase()
      );
  }, [selectedValue, groups]);

  /* Announce length on open and changes to the length of the list */
  useEffect(() => {
    if (isOpen) {
      const message = options.length
        ? sprintf(
            /* translators: %d number of options in dropdown */
            _n(
              '%d result found, use left and right or up and down arrow keys to navigate.',
              '%d results found, use left and right or up and down arrow keys to navigate.',
              options.length,
              'web-stories'
            ),
            options.length
          )
        : __('No results found.', 'web-stories');

      speak(message);
    }
  }, [isOpen, options.length, speak]);

  return { activeOption, groups, isOpen, setIsOpen };
}
