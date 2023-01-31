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
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from '@googleforcreators/react';
import type { ForwardedRef, RefObject, UIEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Menu } from '../menu';
import type { DropdownValue } from '../menu';
import { Popup, Placement } from '../popup';
import useForwardedRef from '../../utils/useForwardedRef';
import { DropDownContainer, Hint } from './components';
import DropDownSelect from './select';
import useDropDown from './useDropDown';
import type { DropDownProps } from './types';

export { DropDownSelect };

const DropDown = forwardRef(function DropDown(
  {
    ariaLabel,
    disabled,
    dropDownLabel,
    hasError,
    hint,
    isKeepMenuOpenOnSelection,
    onMenuItemClick,
    options = [],
    placement = Placement.Bottom,
    popupFillWidth = true,
    popupZIndex,
    isInline = false,
    selectedValue = '',
    direction = 'down',
    className,
    ...rest
  }: DropDownProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const ref = useForwardedRef(forwardedRef);
  const [dynamicPlacement, setDynamicPlacement] = useState(placement);

  const { activeOption, setIsOpen, isOpen, groups } = useDropDown({
    options,
    selectedValue,
  });

  const positionPlacement = useCallback(
    (popupRef: RefObject<Element>) => {
      if (!popupRef.current) {
        return;
      }

      // check to see if there's an overlap with the window edge
      const { bottom, top } = popupRef.current.getBoundingClientRect();

      // if the popup was assigned as bottom we want to always check it
      if (
        dynamicPlacement.startsWith('bottom') &&
        bottom >= window.innerHeight
      ) {
        setDynamicPlacement(Placement.Top);
      }
      // if the popup was assigned as top we want to always check it
      if (dynamicPlacement.startsWith('top') && top <= 0) {
        setDynamicPlacement(Placement.Bottom);
      }
    },
    [dynamicPlacement]
  );

  const handleSelectClick = useCallback(
    (event: UIEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsOpen((prevIsOpen) => !prevIsOpen);
    },
    [setIsOpen]
  );

  const handleDismissMenu = useCallback(() => {
    setIsOpen(false);
    ref.current?.focus();
    setDynamicPlacement(placement);
  }, [setIsOpen, ref, placement]);

  const handleMenuItemClick = useCallback(
    (event: Event, menuItem: DropdownValue) => {
      onMenuItemClick?.(event, menuItem);

      if (!isKeepMenuOpenOnSelection) {
        handleDismissMenu();
      }
    },
    [handleDismissMenu, isKeepMenuOpenOnSelection, onMenuItemClick]
  );

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const selectButtonId = useMemo(() => `select-button-${uuidv4()}`, []);

  const menu = (
    <Menu
      activeValue={activeOption?.value}
      parentId={selectButtonId}
      listId={listId}
      menuAriaLabel={sprintf(
        /* translators: %s: dropdown aria label or general dropdown label if there is no specific aria label. */
        __('%s Option List Selector', 'web-stories'),
        ariaLabel || dropDownLabel
      )}
      onDismissMenu={handleDismissMenu}
      handleMenuItemSelect={handleMenuItemClick}
      groups={groups}
      isAbsolute={isInline}
      {...rest}
    />
  );

  return (
    <DropDownContainer className={className}>
      <DropDownSelect
        activeItemLabel={activeOption?.label}
        aria-pressed={isOpen}
        aria-disabled={disabled}
        aria-expanded={isOpen}
        aria-label={ariaLabel || dropDownLabel}
        aria-owns={listId}
        disabled={disabled}
        dropDownLabel={dropDownLabel}
        hasError={hasError}
        id={selectButtonId}
        isOpen={isOpen}
        onSelectClick={handleSelectClick}
        direction={direction}
        ref={ref}
        {...rest}
      />
      {!disabled && isInline ? (
        isOpen && menu
      ) : (
        <Popup
          anchor={ref}
          isOpen={isOpen}
          placement={dynamicPlacement}
          refCallback={positionPlacement}
          fillWidth={popupFillWidth}
          zIndex={popupZIndex}
          ignoreMaxOffsetY
        >
          {menu}
        </Popup>
      )}
      {hint && <Hint hasError={hasError}>{hint}</Hint>}
    </DropDownContainer>
  );
});

export default DropDown;
