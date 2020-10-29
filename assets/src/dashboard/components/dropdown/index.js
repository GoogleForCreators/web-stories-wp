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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DROPDOWN_TYPES } from '../../constants';
import { PILL_LABEL_TYPES } from '../../constants/components';
import { DropDownArrow, DropUpArrow, Close as CloseIcon } from '../../icons';
import useFocusOut from '../../utils/useFocusOut';

import { ColorDot } from '../colorDot';
import PopoverMenu from '../popoverMenu';
import PopoverPanel from '../popoverPanel';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';
import { TypographyPresets } from '../typography';

const dropdownLabelType = {
  [DROPDOWN_TYPES.PANEL]: PILL_LABEL_TYPES.DEFAULT,
  [DROPDOWN_TYPES.COLOR_PANEL]: PILL_LABEL_TYPES.SWATCH,
};

const StyledPopoverMenu = styled(PopoverMenu)`
  left: 50%;
  transform: translateX(-50%);
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: ${({ alignment }) => alignment};
`;

export const InnerDropdown = styled.button`
  ${TypographyPresets.Small};
  ${({ theme, disabled, type, isOpen, hasSelectedItems }) => `
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: auto;
    padding: 3px 20px;
    padding-left: ${hasSelectedItems ? '10px' : '20px'};
    margin: 0;
    background-color: ${
      hasSelectedItems
        ? theme.internalTheme.colors.blueLight
        : theme.internalTheme.dropdown[type][
            isOpen ? 'activeBackground' : 'background'
          ]
    };
    border-radius: ${theme.internalTheme.dropdown[type].borderRadius}px;
    border: ${theme.internalTheme.dropdown[type].border};
    color: ${theme.internalTheme.colors.gray600};
    cursor: ${disabled ? 'inherit' : 'pointer'};

    &:hover {
      background-color: ${
        hasSelectedItems
          ? theme.internalTheme.colors.blueLight
          : theme.internalTheme.dropdown[type].activeBackground
      };
    }

    &:focus {
      border: ${theme.internalTheme.borders.action};
    }

    &:disabled {
      color: ${theme.internalTheme.colors.gray400};
    }
  `}
`;
InnerDropdown.propTypes = {
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(DROPDOWN_TYPES)),
  hasSelectedItems: PropTypes.bool,
};

const InnerDropdownText = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  color: ${({ theme }) => theme.internalTheme.colors.gray800};
`;

const DropdownIcon = styled.span`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: none;
  & > svg {
    color: ${({ theme }) => theme.internalTheme.colors.gray500};
    width: 10px;
    height: 5px;
  }
`;

const ClearButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.internalTheme.colors.gray600};
  margin: 0 8px 0 0;
  padding: 0;
`;

const Dropdown = ({
  alignment = 'center',
  ariaLabel,
  items,
  disabled,
  onChange,
  value,
  placeholder,
  onClear,
  type = DROPDOWN_TYPES.MENU,
  children,
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  const handleFocusOut = useCallback(() => {
    setShowMenu(false);
  }, []);

  useFocusOut(dropdownRef, handleFocusOut);

  const handleInnerDropdownClick = () => {
    if (!disabled) {
      setShowMenu(!showMenu);
    }
  };

  useEffect(() => {
    if (showMenu && dropdownRef.current) {
      // we need to maintain focus of the dropdown component as a whole
      // but the button should lose focus as menu is open and focus moves there
      dropdownButtonRef.current.blur();
    }
  }, [showMenu]);

  const handleMenuItemSelect = (item) => {
    if (type === DROPDOWN_TYPES.PANEL || type === DROPDOWN_TYPES.COLOR_PANEL) {
      onChange(item);
      return;
    }
    if (!item.value) {
      return;
    }

    if (onChange) {
      onChange(item);
    }
    setShowMenu(false);
  };

  const selectedItems = useMemo(
    () => items.filter((item) => item.value !== 'all' && item.selected),
    [items]
  );

  const currentLabel = useMemo(() => {
    const getCurrentLabel = () => {
      const grouping = [items.find((item) => item.value === value)];
      return grouping[0]?.label;
    };
    return value && getCurrentLabel();
  }, [value, items]);

  const currentValueIndex = useMemo(() => {
    const activeItem = items.find((item) => {
      return item.value === value;
    });
    return items.indexOf(activeItem);
  }, [items, value]);

  const hasSelectedItems = selectedItems.length > 0;

  return (
    <DropdownContainer ref={dropdownRef} {...rest}>
      <Label aria-label={ariaLabel} alignment={alignment}>
        <InnerDropdown
          ref={dropdownButtonRef}
          onClick={handleInnerDropdownClick}
          isOpen={showMenu}
          disabled={disabled}
          type={type}
          hasSelectedItems={hasSelectedItems}
        >
          <InnerDropdownText>
            {currentLabel || (
              <>
                {hasSelectedItems && (
                  <ClearButton
                    tab-index={0}
                    data-testid="dropdown-clear-btn"
                    aria-label="Clear Button"
                    onClick={onClear}
                  >
                    <CloseIcon width={10} height={10} />
                  </ClearButton>
                )}
                {selectedItems[0]?.hex ? (
                  <ColorDot color={selectedItems[0].hex} />
                ) : (
                  selectedItems[0]?.label || placeholder
                )}
                {selectedItems.length > 1 &&
                  sprintf(
                    /* translators: %s: number selected */
                    _n(
                      ' + %s',
                      ' + %s',
                      (selectedItems.length - 1).toString(10),
                      'web-stories'
                    ),
                    (selectedItems.length - 1).toString(10)
                  )}
              </>
            )}
          </InnerDropdownText>
          <DropdownIcon type={type}>
            {showMenu ? <DropUpArrow /> : <DropDownArrow />}
          </DropdownIcon>
        </InnerDropdown>
      </Label>

      {type === DROPDOWN_TYPES.PANEL || type === DROPDOWN_TYPES.COLOR_PANEL ? (
        <PopoverPanel
          isOpen={showMenu}
          title={placeholder}
          labelType={dropdownLabelType[type]}
          items={items}
          onClose={() => setShowMenu(false)}
          onSelect={(_, selectedValue) => {
            handleMenuItemSelect(selectedValue);
          }}
        />
      ) : (
        <StyledPopoverMenu
          currentValueIndex={currentValueIndex}
          isOpen={showMenu}
          items={items}
          onSelect={handleMenuItemSelect}
        />
      )}
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  alignment: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  ariaLabel: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(Object.values(DROPDOWN_TYPES)),
  children: PropTypes.node,
};

export default Dropdown;
