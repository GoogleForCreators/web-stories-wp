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
import { THEME_CONSTANTS, themeHelpers, TextSize } from '../../theme';
import type { Theme } from '../../theme';
import {
  ButtonSize,
  ButtonType,
  ButtonVariant,
  BUTTON_TRANSITION_TIMING,
} from './constants';

interface WithTheme {
  theme: Theme;
}

interface ElementProps {
  size: ButtonSize;
  $type: ButtonType;
  isToggled?: boolean;
}

const base = css<ElementProps>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.primary};
  ${({ theme }) => themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
  ${({ theme, size }) =>
    themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.label[
          size === ButtonSize.Small ? TextSize.Small : TextSize.Medium
        ],
      },
      theme,
    })};

  &:active {
    background-color: ${({ theme }) => theme.colors.interactiveBg.active};
    color: ${({ theme }) => theme.colors.interactiveFg.active};
  }

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    background-color: ${({ theme }) => theme.colors.interactiveBg.disable};
    color: ${({ theme }) => theme.colors.fg.disable};
  }

  transition:
    background-color ${BUTTON_TRANSITION_TIMING},
    color ${BUTTON_TRANSITION_TIMING};
`;

const anchorBase = css`
  /* additional specifications for anchors are necessary for wordpress to override common css */
  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.interactiveFg.active};
  }
`;

const primaryColors = ({ theme }: WithTheme) => css`
  background-color: ${theme.colors.interactiveBg.brandNormal};
  color: ${theme.colors.interactiveFg.brandNormal};
  &:active {
    background-color: ${theme.colors.interactiveBg.active};
    color: ${theme.colors.interactiveFg.active};
  }

  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.brandHover};
    /* important is necessary for wordpress to override common css for anchors*/
    color: ${theme.colors.interactiveFg.brandHover} !important;
  }
`;

const secondaryColors = ({ theme }: WithTheme) => css`
  background-color: ${theme.colors.interactiveBg.secondaryNormal};

  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.secondaryHover};
  }

  &:disabled {
    &:hover,
    &:focus {
      background-color: ${theme.colors.interactiveBg.disable};
    }
  }
`;

const tertiaryColors = ({ theme }: WithTheme) => css`
  background-color: ${theme.colors.interactiveBg.tertiaryNormal};

  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.tertiaryHover};
  }

  &:disabled,
  &[aria-disabled='true'] {
    background-color: ${theme.colors.interactiveBg.tertiaryNormal};
    &:hover,
    &:focus {
      background-color: ${theme.colors.interactiveBg.tertiaryNormal};
    }
  }
`;

const quaternaryColors = ({ theme }: WithTheme) => css<ElementProps>`
  background-color: ${theme.colors.interactiveBg.quaternaryNormal};
  border: 1px solid ${theme.colors.border.defaultNormal};

  &:hover {
    border-color: ${theme.colors.border.quaternaryHover};
  }

  &:focus {
    box-shadow: none;
    border-color: ${theme.colors.border.quaternaryHover};
  }

  &:active {
    border-color: ${theme.colors.border.quaternaryActive};
    background-color: ${theme.colors.interactiveBg.quaternaryNormal};
  }

  ${themeHelpers.focusableOutlineCSS};

  ${({ isToggled }) =>
    isToggled &&
    css`
      border-color: ${theme.colors.border.defaultPress};
    `}

  &:disabled,
  &[aria-disabled='true'] {
    border-color: ${theme.colors.border.disable};
    background-color: ${theme.colors.interactiveBg.quaternaryNormal};
  }
`;

const buttonColors = {
  [ButtonType.Primary]: primaryColors,
  [ButtonType.Secondary]: secondaryColors,
  [ButtonType.Tertiary]: tertiaryColors,
  [ButtonType.Quaternary]: quaternaryColors,
  [ButtonType.Plain]: css``,
} as const;

const rectangle = css<ElementProps>`
  ${({ $type }) => $type && buttonColors[$type]};
  min-width: 1px;
  min-height: 1em;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  padding: ${({ size }) =>
    size === ButtonSize.Small ? '8px 16px' : '18px 32px'};
`;

const square = css<ElementProps>`
  ${({ $type }) => $type && buttonColors[$type]};
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${({ size }) => css`
    width: ${size === ButtonSize.Small
      ? THEME_CONSTANTS.ICON_SIZE
      : THEME_CONSTANTS.LARGE_BUTTON_SIZE}px;
    height: ${size === ButtonSize.Small
      ? THEME_CONSTANTS.ICON_SIZE
      : THEME_CONSTANTS.LARGE_BUTTON_SIZE}px;
  `}

  svg {
    width: ${THEME_CONSTANTS.ICON_SIZE}px;
    height: ${THEME_CONSTANTS.ICON_SIZE}px;
  }
`;

const circle = css`
  border-radius: ${({ theme }) => theme.borders.radius.round};
`;

const icon = css<ElementProps>`
  ${({ $type }) => $type && buttonColors[$type]};
  width: ${THEME_CONSTANTS.ICON_SIZE}px;
  height: ${THEME_CONSTANTS.ICON_SIZE}px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

function getTextSize(size: ButtonSize): TextSize.Medium | TextSize.Small {
  switch (size) {
    case ButtonSize.Small:
      return TextSize.Small;
    case ButtonSize.Medium:
    default:
      return TextSize.Medium;
  }
}

const link = css<ElementProps>`
  ${({ theme, size }) => css`
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.link[getTextSize(size)],
      theme,
    })};

    color: ${theme.colors.fg.linkNormal};
    border-radius: 0;

    :hover {
      color: ${theme.colors.fg.linkHover};
    }
    &:active,
    &:disabled,
    &[aria-disabled='true'] {
      background-color: ${theme.colors.opacity.footprint};
    }
  `}
`;

const ButtonRectangle = styled.button<ElementProps>`
  ${base} ${rectangle}
`;
const AnchorRectangle = styled.a<ElementProps>`
  ${base} ${anchorBase} ${rectangle}
`;

const ButtonSquare = styled.button<ElementProps>`
  ${base} ${square}
`;
const AnchorSquare = styled.a<ElementProps>`
  ${base} ${anchorBase} ${square}
`;

// Note that circle extends square
const ButtonCircle = styled.button<ElementProps>`
  ${base} ${square} ${circle}
`;
const AnchorCircle = styled.a<ElementProps>`
  ${base} ${anchorBase} ${square} ${circle}
`;

const ButtonIcon = styled.button<ElementProps>`
  ${base} ${icon}
`;
const AnchorIcon = styled.a<ElementProps>`
  ${base} ${anchorBase} ${icon}
`;

const ButtonLink = styled.button<ElementProps>`
  ${base} ${link}
`;
const AnchorLink = styled.a<ElementProps>`
  ${base} ${anchorBase} ${link}
`;

type Props = PropsWithChildren<{
  size?: ButtonSize;
  type?: ButtonType;
  variant?: ButtonVariant;
  isToggled?: boolean;
}>;

const Button = forwardRef(function Button(
  {
    size = ButtonSize.Medium,
    type = ButtonType.Plain,
    variant = ButtonVariant.Rectangle,
    children,
    ...rest
  }: Props & Omit<ComponentPropsWithoutRef<'button'>, 'type'>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const elementProps = { ref, size, $type: type, ...rest } as const;

  switch (variant) {
    case ButtonVariant.Rectangle:
      return <ButtonRectangle {...elementProps}>{children}</ButtonRectangle>;
    case ButtonVariant.Circle:
      return <ButtonCircle {...elementProps}>{children}</ButtonCircle>;
    case ButtonVariant.Square:
      return <ButtonSquare {...elementProps}>{children}</ButtonSquare>;
    case ButtonVariant.Icon:
      return <ButtonIcon {...elementProps}>{children}</ButtonIcon>;
    case ButtonVariant.Link:
      return <ButtonLink {...elementProps}>{children}</ButtonLink>;
    default:
      return null;
  }
});

const ButtonAsLink = forwardRef(function ButtonAsLink(
  {
    size = ButtonSize.Medium,
    type = ButtonType.Plain,
    variant = ButtonVariant.Rectangle,
    children,
    ...rest
  }: Props & ComponentPropsWithoutRef<'a'>,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const elementProps = { ref, size, $type: type, ...rest } as const;

  switch (variant) {
    case ButtonVariant.Rectangle:
      return <AnchorRectangle {...elementProps}>{children}</AnchorRectangle>;
    case ButtonVariant.Circle:
      return <AnchorCircle {...elementProps}>{children}</AnchorCircle>;
    case ButtonVariant.Square:
      return <AnchorSquare {...elementProps}>{children}</AnchorSquare>;
    case ButtonVariant.Icon:
      return <AnchorIcon {...elementProps}>{children}</AnchorIcon>;
    case ButtonVariant.Link:
      return <AnchorLink {...elementProps}>{children}</AnchorLink>;
    default:
      return null;
  }
});

export { Button, ButtonAsLink };
