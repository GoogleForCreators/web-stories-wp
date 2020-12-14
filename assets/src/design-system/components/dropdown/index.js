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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies
 */
import { Popup, PLACEMENT } from '../popup';
import { DropdownSelect } from './select';
import { DropdownMenu } from './menu';
import { DROPDOWN_ITEMS } from './types';

const DropdownContainer = styled.div``;

// isKeepMenuOpenOnSelection boolean to override closing dropdown on selection made
// add proper aria labeling
export const Dropdown = ({
  hint,
  isKeepMenuOpenOnSelection,
  disabled,
  items = [],
  onMenuItemClick,
  placement = PLACEMENT.BOTTOM_END,
  selectedValue = '',
  ...rest
}) => {
  const selectRef = useRef();

  const [isOpen, _setIsOpen] = useState(true);
  const [anchorHeight, setAnchorHeight] = useState(null);

  const [setIsOpen] = useDebouncedCallback(_setIsOpen, 300, {
    leading: true,
    trailing: false,
  });

  const handleSelectClick = useCallback(
    (event) => {
      event.preventDefault();
      setIsOpen((prevIsOpen) => !prevIsOpen);
    },
    [setIsOpen]
  );

  const handleDismissMenu = useCallback(() => {
    setIsOpen(false);
    selectRef.current.focus();
  }, [setIsOpen]);

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      onMenuItemClick && onMenuItemClick(event, menuItem);

      if (!isKeepMenuOpenOnSelection) {
        handleDismissMenu();
      }
    },
    [handleDismissMenu, isKeepMenuOpenOnSelection, onMenuItemClick]
  );

  const activeItem = useMemo(
    () =>
      selectedValue &&
      items.find((item) => item?.value.toString() === selectedValue.toString()),
    [items, selectedValue]
  );

  useEffect(() => {
    if (selectRef?.current) {
      setAnchorHeight(selectRef?.current?.getBoundingClientRect().height);
    }
  }, []);

  return (
    <DropdownContainer>
      <DropdownSelect
        activeItemLabel={activeItem?.label}
        isOpen={isOpen}
        disabled={disabled}
        onSelectClick={handleSelectClick}
        ref={selectRef}
        {...rest}
      />
      {!disabled && (
        <Popup
          anchor={selectRef}
          isOpen={isOpen}
          placement={placement}
          fillWidth={240}
        >
          <DropdownMenu
            activeValue={activeItem?.value}
            anchorHeight={anchorHeight}
            items={items}
            onDismissMenu={handleDismissMenu}
            onMenuItemClick={handleMenuItemClick}
            {...rest}
          />
        </Popup>
      )}
      {hint && <p>{hint}</p>}
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  disabled: PropTypes.bool,
  dropdownLabel: PropTypes.string,
  hint: PropTypes.string,
  isKeepMenuOpenOnSelection: PropTypes.bool,
  isRTL: PropTypes.bool,
  items: DROPDOWN_ITEMS,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onMenuItemClick: PropTypes.func,
  placeholder: PropTypes.string,
  placement: PropTypes.string,
  renderItem: PropTypes.func,
  selectedValue: PropTypes.string,
};
