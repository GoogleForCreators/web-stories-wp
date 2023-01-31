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
import { themeHelpers, TextSize } from '../../theme';

const StyledPill = styled.button<{
  isActive?: boolean;
  styleOverride?: string;
}>(
  ({ isActive, theme, styleOverride }) => css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 6px 16px;
    height: 32px;

    background-color: ${isActive
      ? theme.colors.interactiveBg.primaryNormal
      : theme.colors.opacity.footprint};
    border: none;
    border-radius: ${theme.borders.radius.x_large};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

    color: ${isActive ? theme.colors.bg.primary : theme.colors.fg.secondary};
    cursor: pointer;
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.label[TextSize.Small],
      theme,
    })};

    &:disabled {
      pointer-events: none;
      color: ${isActive ? theme.colors.bg.primary : theme.colors.fg.disable};
    }

    transition: color 0.3s ease 0s;
    transition: background-color 0.3s ease 0s;

    ${styleOverride};
  `
);

interface PillProps extends ComponentPropsWithoutRef<'button'> {
  isActive?: boolean;
  pillStyleOverride?: string;
}

const Pill = forwardRef(function Pill(
  {
    children,
    isActive,
    onClick,
    pillStyleOverride,
    ...rest
  }: PropsWithChildren<PillProps>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <StyledPill
      ref={ref}
      isActive={isActive}
      onClick={onClick}
      styleOverride={pillStyleOverride}
      {...rest}
    >
      {children}
    </StyledPill>
  );
});

export default Pill;
