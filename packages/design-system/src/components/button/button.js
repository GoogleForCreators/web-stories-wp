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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../theme';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_TRANSITION_TIMING,
} from './constants';

const Base = styled.button(
  ({ as, size, theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    color: ${theme.colors.fg.primary};
    cursor: pointer;
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.label[
          size === BUTTON_SIZES.SMALL
            ? THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
            : THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM
        ],
      },
      theme,
    })};

    &:active {
      background-color: ${theme.colors.interactiveBg.active};
      color: ${theme.colors.interactiveFg.active};
    }

    /* additional specifications for anchors are necessary for wordpress to override common css */
    ${as === 'a' &&
    css`
      &:hover,
      &:focus {
        color: ${theme.colors.interactiveFg.active};
      }
    `}

    &:disabled,
    &[aria-disabled="true"] {
      pointer-events: none;
      background-color: ${theme.colors.interactiveBg.disable};
      color: ${theme.colors.fg.disable};
    }

    transition: background-color ${BUTTON_TRANSITION_TIMING},
      color ${BUTTON_TRANSITION_TIMING};
  `
);

const primaryColors = ({ theme }) => css`
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

const secondaryColors = ({ theme }) => css`
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

const tertiaryColors = ({ theme }) => css`
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

const quaternaryColors = ({ theme }) => css`
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
  [BUTTON_TYPES.PRIMARY]: primaryColors,
  [BUTTON_TYPES.SECONDARY]: secondaryColors,
  [BUTTON_TYPES.TERTIARY]: tertiaryColors,
  [BUTTON_TYPES.QUATERNARY]: quaternaryColors,
};

const ButtonRectangle = styled(Base)`
  ${({ type }) => type && buttonColors[type]};
  min-width: 1px;
  min-height: 1em;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  padding: ${({ size }) =>
    size === BUTTON_SIZES.SMALL ? '8px 16px' : '18px 32px'};
`;

const ButtonSquare = styled(Base)`
  ${({ type }) => type && buttonColors[type]};
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${({ size }) => css`
    width: ${size === BUTTON_SIZES.SMALL
      ? THEME_CONSTANTS.ICON_SIZE
      : THEME_CONSTANTS.LARGE_BUTTON_SIZE}px;
    height: ${size === BUTTON_SIZES.SMALL
      ? THEME_CONSTANTS.ICON_SIZE
      : THEME_CONSTANTS.LARGE_BUTTON_SIZE}px;
  `}

  svg {
    width: ${THEME_CONSTANTS.ICON_SIZE}px;
    height: ${THEME_CONSTANTS.ICON_SIZE}px;
  }
`;

const ButtonCircle = styled(ButtonSquare)`
  border-radius: ${({ theme }) => theme.borders.radius.round};
`;

const ButtonIcon = styled(Base)`
  ${({ type }) => type && buttonColors[type]};
  width: ${THEME_CONSTANTS.ICON_SIZE}px;
  height: ${THEME_CONSTANTS.ICON_SIZE}px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ButtonLink = styled(Base)`
  ${({ theme, size }) => css`
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.link[size],
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

const ButtonOptions = {
  [BUTTON_VARIANTS.RECTANGLE]: ButtonRectangle,
  [BUTTON_VARIANTS.CIRCLE]: ButtonCircle,
  [BUTTON_VARIANTS.SQUARE]: ButtonSquare,
  [BUTTON_VARIANTS.ICON]: ButtonIcon,
  [BUTTON_VARIANTS.LINK]: ButtonLink,
};

const Button = forwardRef(function Button(
  {
    size = BUTTON_SIZES.MEDIUM,
    type = BUTTON_TYPES.PLAIN,
    variant = BUTTON_VARIANTS.RECTANGLE,
    children,
    ...rest
  },
  ref
) {
  const isLink = rest.href !== undefined;
  const StyledButton = ButtonOptions[variant];

  return (
    <StyledButton
      ref={ref}
      as={isLink ? 'a' : 'button'}
      size={size}
      type={type}
      {...rest}
    >
      {children}
    </StyledButton>
  );
});

Button.propTypes = {
  size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
  type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
  variant: PropTypes.oneOf(Object.values(BUTTON_VARIANTS)),
  children: PropTypes.node.isRequired,
  activeLabelText: PropTypes.string,
  isToggled: PropTypes.bool,
};

export { Button };
