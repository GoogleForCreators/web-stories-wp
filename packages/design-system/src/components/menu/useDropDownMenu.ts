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
  useFocusOut,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { isNullOrUndefinedOrEmptyString } from '../../utils';
import { useKeyDownEffect } from '../keyboard';
import {
  KEYS_CLOSE_MENU,
  KEYS_SELECT_ITEM,
  KEYS_SHIFT_FOCUS,
} from './constants';
import type { DropdownValue, UseDropDownMenuProps } from './types';

export default function useDropDownMenu({
  activeValue,
  handleMenuItemSelect,
  handleReturnToParent,
  isRTL,
  groups = [],
  listRef,
  onDismissMenu,
}: UseDropDownMenuProps) {
  const allOptions = useMemo(
    () => groups.flatMap(({ options }) => options),
    [groups]
  );

  const listLength = allOptions.length;
  const [focusedValue, setFocusedValue] = useState<
    DropdownValue | null | undefined
  >(activeValue);

  const getFocusedIndex = useCallback(
    () =>
      allOptions.findIndex(
        (option) => String(option?.value) === String(focusedValue)
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
    (offset: number) =>
      setFocusedValue(allOptions[focusedIndex + offset].value),
    [allOptions, focusedIndex]
  );

  const handleFocusChange = useCallback(
    ({ key }: KeyboardEvent) => {
      const forward = isRTL ? 'ArrowRight' : 'ArrowLeft';
      const isForward = ['ArrowUp', forward].includes(key);
      const backward = isRTL ? 'ArrowLeft' : 'ArrowRight';
      const isBackward = ['ArrowDown', backward].includes(key);

      if (isForward) {
        if (focusedIndex === 0) {
          handleReturnToParent?.();
        } else {
          handleMoveFocus(-1);
        }
      } else if (isBackward && focusedIndex < listLength - 1) {
        handleMoveFocus(1);
      }
    },
    [focusedIndex, handleMoveFocus, handleReturnToParent, isRTL, listLength]
  );

  const handleMenuItemEnter = useCallback(
    (event: Event) => {
      const isDisabledItem = allOptions[focusedIndex]?.disabled;
      if (isDisabledItem) {
        return () => undefined;
      }
      const selectedValue = focusedValue || allOptions[focusedIndex].value;
      return handleMenuItemSelect(event, selectedValue);
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
