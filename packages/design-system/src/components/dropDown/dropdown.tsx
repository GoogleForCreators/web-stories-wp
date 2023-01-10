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
import { DropdownValue, Menu } from '../menu';
import { Popup, Placement } from '../popup';
import useForwardedRef from '../../utils/useForwardedRef';
import { DropDownContainer, Hint } from './components';
import DropDownSelect from './select';
import useDropDown from './useDropDown';
import type { DropDownProps } from './types';

export { DropDownSelect };

/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaLabel Specific label to use as select button's aria label only.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.dropDownLabel Text shown in button with selected value's label or placeholder. Will be used as aria label if no separate ariaLabel is passed in.
 * @param {boolean} props.hasError If true, input and hint (if present) will show error styles.
 * @param {string} props.emptyText If the array of options is empty this text will display when menu is expanded.
 * @param {string} props.hint Hint text to display below a dropdown (optional). If not present, no hint text will display.
 * @param {boolean} props.isKeepMenuOpenOnSelection If true, when a new selection is made the internal functionality to close the menu will not fire, by default is false.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding dropdown menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {number} props.popupFillWidth Allows for an override of how much of popup width to take up for dropDown.
 * @param {number} props.popupZIndex Allows for an override of the default popup z index (2).
 * @param {boolean} props.isInline If true, will show menu inline rather than in a popup.
 * @param {string} props.placement placement passed to popover for where menu should expand, defaults to "bottom_end".
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.selectedValue the selected value of the dropDown. Should correspond to a value in the options array of objects.
 * @param {string} props.className Class name.
 * @param {Object} ref An optional ref to pass to the dropdown
 * @return {*} The dropdown.
 */
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
