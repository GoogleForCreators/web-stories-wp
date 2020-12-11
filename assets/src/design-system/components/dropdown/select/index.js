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
import { forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectButton = styled.button``;

export const DropdownSelect = forwardRef(function DropdownSelect(
  {
    activeItemLabel,
    disabled,
    dropdownLabel,
    isOpen,
    onSelectClick,
    placeholder = '',
  },
  ref
) {
  return (
    <SelectButton
      aria-pressed={isOpen}
      aria-haspopup={true}
      aria-expanded={isOpen}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelectClick}
      ref={ref}
    >
      {activeItemLabel || placeholder}
      {dropdownLabel && <span>{dropdownLabel}</span>}
    </SelectButton>
  );
});

DropdownSelect.propTypes = {
  activeItemLabel: PropTypes.string,
  dropdownLabel: PropTypes.string,
  onSelectClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
};
