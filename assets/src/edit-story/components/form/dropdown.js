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
import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import onClickOutside from 'react-onclickoutside';

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
import { ReactComponent as DropDownIcon } from '../../icons/dropdown.svg';

const SelectWrapper = styled.div`
  width: 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.fg.v0};
  font-family: ${({ theme }) => theme.fonts.body1.font};
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      opacity: 0.3;
    `}

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
  }
`;

const SelectTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
`;

const ListWrapper = styled.ul`
  position: absolute;
  top: 32px;
  width: 100%;
  max-height: 150px;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  z-index: 1;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 2px 0;
  border-radius: 4px;
  overflow-y: scroll;
`;

const ListItem = styled.li`
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  padding: 16px;
  margin: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bg.v10};
  }
`;

function DropDown({ options, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  DropDown.handleClickOutside = () => setIsOpen(false);

  return (
    <SelectWrapper>
      <ListHeader
        disabled={disabled}
        onBlur={(evt) => {
          setIsOpen(false);
          evt.target.form.dispatchEvent(new window.Event('submit'));
        }}
        onClick={toggleList}
      >
        <SelectTitle>{value}</SelectTitle>
        <DropDownIcon />
      </ListHeader>
      {isOpen && (
        <ListWrapper>
          {options.map(({ name, value: optValue }) => (
            <ListItem
              key={optValue}
              onChange={() => onChange(optValue)}
              data-value={optValue}
            >
              {name}
            </ListItem>
          ))}
        </ListWrapper>
      )}
    </SelectWrapper>
  );
}

DropDown.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

DropDown.defaultProps = {
  disabled: false,
};

const clickOutsideConfig = {
  handleClickOutside: () => DropDown.handleClickOutside,
};

export default onClickOutside(DropDown, clickOutsideConfig);
