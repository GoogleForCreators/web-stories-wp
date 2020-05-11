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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { DROPDOWN_TYPES } from '../../constants';
import { PILL_LABEL_TYPES } from '../../constants/components';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
import { ReactComponent as DropDownArrow } from '../../icons/dropDownArrow.svg';
import { ReactComponent as DropUpArrow } from '../../icons/dropUpArrow.svg';
import useFocusOut from '../../utils/useFocusOut';

import { ColorDot } from '../colorDot';
import PopoverMenu from '../popoverMenu';
import PopoverPanel from '../popoverPanel';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';

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
        ? theme.colors.blueLight
        : theme.dropdown[type][isOpen ? 'activeBackground' : 'background']
    };

    border-radius: ${theme.dropdown[type].borderRadius}px;
    border: ${theme.dropdown[type].border};
    color: ${theme.colors.gray600};
    cursor: ${disabled ? 'inherit' : 'pointer'};
    font-family: ${theme.fonts.dropdown.family};
    font-size: ${theme.fonts.dropdown.size}px;
    font-weight: ${theme.fonts.dropdown.weight};
    letter-spacing: ${theme.fonts.dropdown.letterSpacing}em;
    line-height: ${theme.fonts.dropdown.lineHeight}px;

    &:hover {
      background-color: ${
        hasSelectedItems
          ? theme.colors.blueLight
          : theme.dropdown[type].activeBackground
      };
    }

    &:focus {
      border: ${theme.borders.action};
    }

    &:disabled {
      color: ${theme.colors.gray400};
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
  color: ${({ theme }) => theme.colors.gray800};
`;

const DropdownIcon = styled.span`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: none;
  & > svg {
    color: ${({ theme }) => theme.colors.gray500};
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
  color: ${({ theme }) => theme.colors.gray600};
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
  const dropdownRef = useRef();

  const handleFocusOut = useCallback(() => {
    setShowMenu(false);
  }, []);

  useFocusOut(dropdownRef, handleFocusOut);

  const handleInnerDropdownClick = () => {
    if (!disabled) {
      setShowMenu(!showMenu);
    }
  };

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
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <DropdownContainer ref={dropdownRef} {...rest}>
      <Label aria-label={ariaLabel} alignment={alignment}>
        <InnerDropdown
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
                    __(' + %s', 'web-stories'),
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
