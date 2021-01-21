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
import propTypes from 'prop-types';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { Checkmark } from '../../icons';

const CheckboxContainer = styled.div(
  ({ disabled, theme }) => css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
    margin: 8px;
    border-radius: ${theme.borders.radius.small};
    border: 2px solid ${theme.colors.border.defaultNormal};

    :focus-within {
      border: 2px solid ${theme.colors.border.focus};
    }

    :active {
      border: 2px solid ${theme.colors.border.defaultNormal};
      box-shadow: 0 0 0 8px ${theme.colors.shadows.active};
    }

    ${disabled &&
    css`
      border: 2px solid ${theme.colors.border.disable};
    `}

    /* Hide Checkbox */
    input[type='checkbox'] {
      position: absolute;
      width: 26px;
      height: 26px;
      margin: 0;
      padding: 0;
      opacity: 0;
    }
  `
);

const StyledCheckmark = styled(Checkmark)`
  height: auto;
  width: 16px;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.fg.disable : theme.colors.fg.primary};
`;

const BaseCheckbox = ({ checked, disabled, ...props }, ref) => (
  <CheckboxContainer disabled={disabled}>
    {checked && (
      <StyledCheckmark data-testid="checkbox-checkmark" disabled={disabled} />
    )}
    <input type="checkbox" ref={ref} disabled={disabled} {...props} />
  </CheckboxContainer>
);

export const Checkbox = forwardRef(BaseCheckbox);

BaseCheckbox.propTypes = {
  checked: propTypes.bool,
  disabled: propTypes.bool,
};
