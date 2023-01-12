/*
 * Copyright 2021 Google LLC
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
import { forwardRef } from '@googleforcreators/react';
import type {
  ComponentPropsWithoutRef,
  ForwardedRef,
  PropsWithChildren,
} from 'react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { Theme, themeHelpers, TextSize } from '../../theme';
import { focusableOutlineCSS } from '../../theme/helpers';

const getChipBackgroundColor = ({
  theme,
  active,
  disabled,
}: {
  theme: Theme;
  active?: boolean;
  disabled?: boolean;
}) =>
  active && !disabled
    ? theme.colors.interactiveBg.secondaryNormal
    : 'transparent';

const Infix = styled.div<{ before?: boolean }>`
  display: inline-block;
  margin-right: ${({ before = false }) => (before ? '-8px' : '4px')};
  margin-left: ${({ before = false }) => (before ? '4px' : '-8px')};
  height: 28px;
`;

const StyledChip = styled.span`
  padding: 0 12px;
  background: transparent;
  border: none;
  &:focus {
    outline: none;
  }
`;

const ChipContainer = styled.button<{ active?: boolean; disabled?: boolean }>(
  ({ theme, disabled }) => css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    padding: 0;
    background-color: ${getChipBackgroundColor};
    border: 1px solid
      ${disabled
        ? theme.colors.border.disable
        : theme.colors.interactiveBg.secondaryNormal};
    border-radius: ${theme.borders.radius.x_large};
    transition: all 0.3s ease-in-out;
    transition-property: background-color, border-color, height, width,
      transform;
    cursor: ${disabled ? 'default' : 'pointer'};
    ${focusableOutlineCSS}
    :active {
      background-color: ${getChipBackgroundColor({
        theme,
        active: true,
        disabled,
      })};
    }
    :hover:not(:active) {
      border-color: ${disabled
        ? theme.colors.border.disable
        : theme.colors.border.defaultHover};
    }

    ${Infix}, ${StyledChip} {
      white-space: nowrap;
      cursor: ${disabled ? 'default' : 'pointer'};
      color: ${disabled ? theme.colors.fg.disable : theme.colors.fg.primary};
      ${themeHelpers.expandPresetStyles({
        preset: theme.typography.presets.paragraph[TextSize.Small],
        theme,
      })};
    }
  `
);

interface ChipProps extends ComponentPropsWithoutRef<'button'> {
  prefix?: string;
  suffix?: string;
  active?: boolean;
}

const Chip = forwardRef(
  (
    { children, prefix, suffix, ...props }: PropsWithChildren<ChipProps>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <ChipContainer ref={ref} {...props}>
        {prefix && <Infix before>{prefix}</Infix>}
        <StyledChip>{children}</StyledChip>
        {suffix && <Infix>{suffix}</Infix>}
      </ChipContainer>
    );
  }
);

Chip.displayName = 'Chip';

export default Chip;
