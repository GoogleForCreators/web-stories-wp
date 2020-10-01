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
import { useEffect, useMemo, useState, useRef } from 'react';

export default function useTypeahead({ items, value }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuFocused, setMenuFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedValueIndex, setSelectedValueIndex] = useState(-1);

  const menuOpened = useRef(false);

  const isMenuOpen = showMenu && items.length > 0 && inputValue.length > 0;

  const isInputExpanded = menuFocused || inputValue.length > 0;

  useEffect(() => {
    if (!isMenuOpen && menuOpened.current) {
      menuOpened.current = false;
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && !menuOpened.current) {
      menuOpened.current = true;
      const selectionToCheckFor = value && value.toLowerCase().trim();
      const existingValueOnMenuOpen = selectionToCheckFor
        ? items.findIndex(
            (item) =>
              (item.value &&
                item.value.toLowerCase() === selectionToCheckFor) ||
              item.label.toLowerCase() === selectionToCheckFor
          )
        : 0;

      const indexToSet =
        existingValueOnMenuOpen > -1 ? existingValueOnMenuOpen : 0;
      setSelectedValueIndex(indexToSet);
    }
  }, [isMenuOpen, items, value]);

  return useMemo(
    () => ({
      isMenuOpen,
      isInputExpanded,
      inputValue: {
        value: inputValue,
        set: setInputValue,
      },
      showMenu: {
        value: showMenu,
        set: setShowMenu,
      },
      menuFocused: {
        value: menuFocused,
        set: setMenuFocused,
      },
      selectedValueIndex: {
        value: selectedValueIndex,
        set: setSelectedValueIndex,
      },
    }),
    [
      isMenuOpen,
      isInputExpanded,
      inputValue,
      menuFocused,
      showMenu,
      selectedValueIndex,
      setInputValue,
      setMenuFocused,
      setShowMenu,
      setSelectedValueIndex,
    ]
  );
}
