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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Chevron } from '../../../icons';
import { THEME_CONSTANTS, themeHelpers } from '../../../theme';
import { Text } from '../../typography';

const SelectButton = styled.button(
  ({ theme, hasError, isOpen }) => css`
    width: 208px;
    height: 36px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: ${theme.borders.radius.small};
    background-color: ${theme.colors.bg.primary};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
    border-color: ${theme.colors.border[
      isOpen ? 'defaultActive' : 'defaultNormal'
    ]};
    padding: 8px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    ${hasError &&
    css`
      ${themeHelpers.focusableOutlineCSS(
        theme.colors.interactiveBg.negativeNormal
      )};
      border-color: ${theme.colors.interactiveBg.negativeNormal};

      &:active,
      &:focus {
        border-color: ${theme.colors.interactiveBg.negativeNormal};
      }
    `}

    &:disabled {
      pointer-events: none;

      label,
      span,
      svg {
        color: ${theme.colors.fg.disable};
      }
    }
  `
);
SelectButton.propTypes = {
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const StyledChevron = styled(Chevron)(
  ({ theme, isOpen }) => css`
    color: ${theme.colors.fg.secondary};
    width: 8px;
    height: 8px;
    /* padding: 2.5px 0.5px; */
    ${isOpen &&
    css`
      transform: rotate(180deg);
    `}
  `
);
StyledChevron.propTypes = {
  isOpen: PropTypes.bool,
};

const Value = styled(Text)`
  max-width: 100%;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LabelText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: hidden;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.secondary};
  cursor: pointer;
`;

const DropDownSelect = (
  {
    activeItemLabel,
    ariaLabel,
    disabled,
    dropDownLabel,
    hasError,
    isOpen,
    onSelectClick,
    placeholder = '',
  },
  ref
) => (
  <SelectButton
    aria-label={ariaLabel || dropDownLabel}
    aria-pressed={isOpen}
    aria-haspopup={true}
    aria-expanded={isOpen}
    aria-disabled={disabled}
    disabled={disabled}
    onClick={onSelectClick}
    ref={ref}
  >
    <Value as="span" size={THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES.SMALL}>
      {activeItemLabel || placeholder}
    </Value>

    <Label>
      {dropDownLabel && (
        <LabelText as="span" size={THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES.SMALL}>
          {dropDownLabel}
        </LabelText>
      )}

      <StyledChevron isOpen={isOpen} />
    </Label>
  </SelectButton>
);

export default forwardRef(DropDownSelect);

DropDownSelect.propTypes = {
  activeItemLabel: PropTypes.string,
  ariaLabel: PropTypes.string,
  dropDownLabel: PropTypes.string,
  onSelectClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};
