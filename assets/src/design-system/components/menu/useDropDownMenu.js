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

/**
 * Internal dependencies
 */
import useFocusOut from '../../utils/useFocusOut';
import isNullOrUndefinedOrEmptyString from '../../utils/isNullOrUndefinedOrEmptyString';
import { useKeyDownEffect } from '../keyboard';
import {
  KEYS,
  KEYS_CLOSE_MENU,
  KEYS_SELECT_ITEM,
  KEYS_SHIFT_FOCUS,
} from './constants';

export default function useDropDownMenu({
  activeValue,
  handleMenuItemSelect,
  handleReturnToParent,
  isRTL,
  options = [],
  listRef,
  onDismissMenu,
}) {
  const allOptions = useMemo(
    () => options.flatMap((optionSet) => optionSet.group),
    [options]
  );

  const listLength = allOptions.length;
  const [focusedValue, setFocusedValue] = useState(activeValue);

  const getFocusedIndex = useCallback(
    () =>
      allOptions.findIndex(
        (option) => option?.value?.toString() === focusedValue.toString()
      ),
    [allOptions, focusedValue]
  );

  // there's an edge case in this menu when the activeValue given to a menu isn't present
  // in the options passed to it that we want to check against when this first renders.

  useEffect(() => {
    if (isNullOrUndefinedOrEmptyString(focusedValue)) {
      return;
    }
    const validFocusedIndex = getFocusedIndex();

    if (validFocusedIndex === -1) {
      setFocusedValue(null);
    }
  }, [focusedValue, getFocusedIndex]);

  const focusedIndex = useMemo(() => {
    if (isNullOrUndefinedOrEmptyString(focusedValue)) {
      return 0;
    }
    const foundIndex = getFocusedIndex();

    return foundIndex;
  }, [focusedValue, getFocusedIndex]);

  const handleMoveFocus = useCallback(
    (offset) => setFocusedValue(allOptions[focusedIndex + offset].value),
    [allOptions, focusedIndex]
  );

  const handleFocusChange = useCallback(
    ({ key }) => {
      if (
        [KEYS.ARROW_UP, isRTL ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT].includes(
          key
        ) &&
        focusedIndex !== 0
      ) {
        handleMoveFocus(-1);
      } else if (
        [KEYS.ARROW_DOWN, isRTL ? KEYS.ARROW_LEFT : KEYS.ARROW_RIGHT].includes(
          key
        ) &&
        focusedIndex < listLength - 1
      ) {
        handleMoveFocus(1);
      } else if (
        [KEYS.ARROW_UP, isRTL ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT].includes(
          key
        ) &&
        focusedIndex === 0
      ) {
        handleReturnToParent?.();
      }
    },
    [focusedIndex, handleMoveFocus, handleReturnToParent, isRTL, listLength]
  );

  const handleMenuItemEnter = useCallback(
    (event) => {
      const isDisabledItem = allOptions[focusedIndex]?.disabled;
      if (isDisabledItem) {
        return () => {};
      }
      const selectedValue = focusedValue || allOptions[focusedIndex].value;
      return handleMenuItemSelect(event, { value: selectedValue });
    },
    [allOptions, focusedIndex, focusedValue, handleMenuItemSelect]
  );

  useKeyDownEffect(
    listRef,
    { key: KEYS_SELECT_ITEM, shift: true },
    handleMenuItemEnter,
    [handleMenuItemEnter]
  );

  useKeyDownEffect(
    listRef,
    { key: KEYS_CLOSE_MENU },
    (event) => onDismissMenu?.(event),
    [onDismissMenu]
  );

  useKeyDownEffect(listRef, { key: KEYS_SHIFT_FOCUS }, handleFocusChange, [
    handleFocusChange,
  ]);

  useFocusOut(listRef, (event) => onDismissMenu?.(event), []);

  return useMemo(
    () => ({
      focusedValue,
      focusedIndex,
      listLength,
    }),
    [focusedIndex, focusedValue, listLength]
  );
}
