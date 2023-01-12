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
import { __ } from '@googleforcreators/i18n';
import { forwardRef } from '@googleforcreators/react';
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { Checkmark } from '../../icons';
import { focusCSS } from '../../theme/helpers';

const CONTAINER_WIDTH = 24;
const BORDER_WIDTH = 1;

const Border = styled.div(
  ({ theme }) => css`
    position: absolute;
    height: ${CONTAINER_WIDTH}px;
    width: ${CONTAINER_WIDTH}px;
    border-radius: ${theme.borders.radius.small};
    border: ${BORDER_WIDTH}px solid ${theme.colors.border.defaultNormal};
    pointer-events: none;
  `
);

const StyledCheckmark = styled(Checkmark).attrs({ role: 'img' })`
  height: auto;
  width: 32px;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const CheckboxContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${CONTAINER_WIDTH}px;
    width: ${CONTAINER_WIDTH}px;
    min-height: ${CONTAINER_WIDTH}px;
    min-width: ${CONTAINER_WIDTH}px;

    /* Hide Checkbox */
    input[type='checkbox'] {
      position: absolute;
      width: ${CONTAINER_WIDTH + BORDER_WIDTH}px;
      height: ${CONTAINER_WIDTH + BORDER_WIDTH}px;
      margin: 0;
      padding: 0;
      opacity: 0;
      cursor: pointer;

      :disabled {
        ~ ${Border} {
          border-color: ${theme.colors.border.disable};
        }

        ~ ${StyledCheckmark} {
          color: ${theme.colors.fg.disable};
        }
      }

      &:focus-visible:not(:active) ~ ${Border} {
        ${focusCSS(theme.colors.border.focus)};
      }

      :active ~ ${Border} {
        border-color: ${theme.colors.border.defaultNormal};
        box-shadow: 0 0 0 8px ${theme.colors.shadow.active};
      }
    }
  `
);

type CheckboxProps = ComponentPropsWithoutRef<'input'>;

const Checkbox = forwardRef(
  (
    { checked, disabled, className = '', ...props }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <CheckboxContainer className={className}>
      <input
        type="checkbox"
        ref={ref}
        checked={Boolean(checked)}
        disabled={disabled}
        aria-checked={checked}
        {...props}
      />
      {checked && <StyledCheckmark aria-label={__('Checked', 'web-stories')} />}
      <Border />
    </CheckboxContainer>
  )
);

export default Checkbox;
