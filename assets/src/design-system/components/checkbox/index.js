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
import propTypes from 'prop-types';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { Checkmark } from '../../icons';

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Border = styled.div(
  ({ disabled }) => css`
    ${!disabled &&
    css`
      margin: 2px;

      :focus-within {
        border: 2px solid #5d96eb;
        border-radius: 6px;
        margin: 0;
      }

      :active {
        border: 2px solid rgb(0 0 0 / 0.1);
        box-shadow: 0 0 0 8px rgb(0 0 0 / 0.1);
        border-radius: 6px;
        margin: 2px;

        ${CheckboxContainer} {
          margin: 0;
        }
      }
    `}
  `
);

const CheckboxContainer = styled.div(
  ({ disabled, theme }) => css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
    margin: 2px;
    border: 1px solid ${theme.colors.gray['20']};
    border-radius: 4px;

    ${disabled &&
    css`
      opacity: 0.5;
    `}

    /* Hide Checkbox */
    input[type='checkbox'] {
      position: absolute;
      width: 24px;
      height: 24px;
      margin: 0;
      padding: 0;
      visibility: hidden;
    }
  `
);

const StyledCheckmark = styled(Checkmark)`
  height: 12px;
  width: 16px;
`;

const Checkbox = ({ checked, disabled, ...props }) => (
  <FlexContainer>
    <Border disabled={disabled}>
      <CheckboxContainer disabled={disabled}>
        {checked && <StyledCheckmark data-testid="checkbox-checkmark" />}
        <input type="checkbox" disabled={disabled} {...props} />
      </CheckboxContainer>
    </Border>
  </FlexContainer>
);

Checkbox.propTypes = {
  checked: propTypes.bool,
  disabled: propTypes.bool,
};

export { Checkbox };
