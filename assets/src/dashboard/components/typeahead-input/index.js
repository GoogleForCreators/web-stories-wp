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
import { useState, useRef, useCallback, useMemo } from 'react';

/**
 * Internal dependencies
 */
import useFocusOut from '../../utils/useFocusOut';
import { TypeaheadOptions } from '../';

const SearchContainer = styled.div`
  position: static;
`;

export const StyledInput = styled.input`
  position: static;

  & .search-dropdown-input {
    ${({ isOpen }) =>
      isOpen
        ? `
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
     `
        : ''}
  }
`;

const TypeaheadOptionsWrapper = styled(TypeaheadOptions)`
  ${({ hasError }) => hasError && 'margin-top: -2.4rem;'}
`;
TypeaheadOptionsWrapper.propTypes = {
  hasError: PropTypes.bool,
};

const TypeaheadInput = ({
  inputId,
  items,
  className,
  disabled,
  error,
  onChange,
  placeholder,
  value,
  ariaLabel,
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const menuIsOpen = useMemo(() => {
    return showMenu && items.length > 0 && !Boolean(error);
  }, [items, showMenu, error]);

  const searchRef = useRef();

  const handleFocusOut = useCallback(() => {
    setShowMenu(false);
  }, []);

  useFocusOut(searchRef, handleFocusOut);

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const handleInputChange = (item) => {
    setInputValue(item.label);
    onChange(item.value);
  };

  const handleMenuItemSelect = (item) => {
    if (!item.value) {
      return;
    }
    handleInputChange(item);
    setShowMenu(false);
  };

  const handleInputClear = () => {
    handleInputChange({ label: '', value: false });
    setShowMenu(false);
  };

  return (
    <SearchContainer ref={searchRef} className={className} {...rest}>
      <form autoComplete="off">
        <label aria-label={ariaLabel} htmlFor={inputId} />
        <StyledInput
          id={inputId}
          disabled={disabled}
          isOpen={menuIsOpen}
          value={inputValue}
          error={error}
          onChange={({ target }) =>
            handleInputChange({ label: target.value, value: target.value })
          }
          onClick={handleInputClick}
          placeholder={placeholder}
          inputClassName="search-dropdown-input"
        />
        <button onClick={handleInputClear}>{'x'}</button>
        <span>{Boolean(error) && error}</span>

        <TypeaheadOptions
          isOpen={menuIsOpen}
          items={items}
          onSelect={items && handleMenuItemSelect}
        />
      </form>
    </SearchContainer>
  );
};

TypeaheadInput.propTypes = {
  inputId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,

  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};
export default TypeaheadInput;
