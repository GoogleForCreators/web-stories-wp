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
import { ReactComponent as DropDownArrow } from '../../icons/dropDownArrow.svg';
import { ReactComponent as DropUpArrow } from '../../icons/dropUpArrow.svg';
import useFocusOut from '../../utils/useFocusOut';
import { DROPDOWN_TYPES } from '../../constants';
import PopoverMenu from '../popoverMenu';
import PopoverPanel from '../popoverPanel';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';
import { ColorDot } from '../colorDot';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';

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
  align-items: center;
`;

export const InnerDropdown = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: ${({ theme, type }) => theme.dropdown[type].height}px;
  width: auto;
  padding: 10px 16px;
  margin: 0;
  background-color: ${({ theme, type, isOpen }) =>
    theme.dropdown[type][isOpen ? 'activeBackground' : 'background']};
  border-radius: ${({ theme, type }) => theme.dropdown[type].borderRadius}px;
  border: ${({ theme, type }) => theme.dropdown[type].border};
  color: ${({ theme }) => theme.colors.gray600};
  cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
  font-family: ${({ theme }) => theme.fonts.dropdown.family};
  font-size: ${({ theme }) => theme.fonts.dropdown.size}px;
  font-weight: ${({ theme }) => theme.fonts.dropdown.weight};
  letter-spacing: ${({ theme }) => theme.fonts.dropdown.letterSpacing}em;
  line-height: ${({ theme }) => theme.fonts.dropdown.lineHeight}px;

  &:hover {
    background-color: ${({ theme, type }) =>
      theme.dropdown[type].activeBackground};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.gray400};
  }
`;
InnerDropdown.propTypes = {
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
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
    color: ${({ theme, type }) => theme.dropdown[type].arrowColor};
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
  color: ${({ theme }) => theme.colors.bluePrimary600};
  margin: 0 8px 0 0;
  padding: 0;
`;

const Dropdown = ({
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
    if (type === DROPDOWN_TYPES.PANEL) {
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

  return (
    <DropdownContainer ref={dropdownRef} {...rest}>
      <Label aria-label={ariaLabel}>
        <InnerDropdown
          onClick={handleInnerDropdownClick}
          isOpen={showMenu}
          disabled={disabled}
          type={type}
        >
          <InnerDropdownText>
            {currentLabel || (
              <>
                {selectedItems.length > 0 && (
                  <ClearButton
                    tab-index={0}
                    data-testid="dropdown-clear-btn"
                    aria-label="Clear Button"
                    onClick={onClear}
                  >
                    <CloseIcon width={13} height={13} />
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

      {type === DROPDOWN_TYPES.PANEL ? (
        <PopoverPanel
          isOpen={showMenu}
          title={placeholder}
          onClose={() => setShowMenu(false)}
          items={items}
          onSelect={(_, selectedValue) => {
            handleMenuItemSelect(selectedValue);
          }}
        />
      ) : (
        <StyledPopoverMenu
          isOpen={showMenu}
          items={items}
          onSelect={handleMenuItemSelect}
          framelessButton={type === DROPDOWN_TYPES.TRANSPARENT_MENU}
        />
      )}
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
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
