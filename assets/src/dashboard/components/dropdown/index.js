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
import { useEffect, useMemo, useRef, useState } from 'react';
/**
 * Internal dependencies
 */
import PopoverMenu from '../popover-menu';

const DropdownContainer = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

export const InnerDropdown = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray25};
  border-radius: 4px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.colors.gray600};
  cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
  display: flex;
  font-family: ${({ theme }) => theme.fonts.dropdown.family};
  font-size: ${({ theme }) => theme.fonts.dropdown.size};
  font-weight: ${({ theme }) => theme.fonts.dropdown.weight};
  height: 40px;
  justify-content: space-between;
  letter-spacing: ${({ theme }) => theme.fonts.dropdown.letterSpacing};
  line-height: ${({ theme }) => theme.fonts.dropdown.lineHeight};
  padding: 10px 16px;
  width: 100%;

  &:disabled {
    color: ${({ theme }) => theme.colors.gray400};
  }
`;
InnerDropdown.propTypes = {
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const InnerDropdownText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownIcon = styled.span``;

const Dropdown = ({
  ariaLabel,
  items,
  disabled,
  onChange,
  value,
  placeholder,
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef();

  const handleOutsideClick = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      showMenu === true
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  });

  const handleInnerDropdownClick = () => {
    if (!disabled) {
      setShowMenu(!showMenu);
    }
  };

  const handleMenuItemSelect = (item) => {
    if (!item.value) {
      return;
    }
    if (onChange) {
      onChange(item);
    }
    setShowMenu(false);
  };

  const currentLabel = useMemo(() => {
    const getCurrentLabel = () => {
      const grouping = [items.find((item) => item.value === value)];
      return grouping[0].label;
    };

    return value ? getCurrentLabel() : placeholder;
  }, [value, placeholder, items]);

  // TODO Add Icon and remove || placeholder
  return (
    <DropdownContainer ref={dropdownRef} {...rest}>
      <Label aria-label={ariaLabel}>
        <InnerDropdown
          onClick={handleInnerDropdownClick}
          isOpen={showMenu}
          disabled={disabled}
        >
          <InnerDropdownText>{currentLabel}</InnerDropdownText>
          <DropdownIcon>{'||'}</DropdownIcon>
        </InnerDropdown>
      </Label>

      <PopoverMenu
        isOpen={showMenu}
        items={items}
        onSelect={handleMenuItemSelect}
      />
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    })
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default Dropdown;
