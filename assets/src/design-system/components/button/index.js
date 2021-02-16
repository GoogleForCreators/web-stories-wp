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
import { THEME_CONSTANTS, themeHelpers } from '../../theme';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_TRANSITION_TIMING,
} from './constants';

const Base = styled.button(
  ({ size, theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
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

    &:disabled {
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
  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.brandHover};
    color: ${theme.colors.interactiveFg.brandHover};
  }
  &:active {
    background-color: ${theme.colors.interactiveBg.active};
    color: ${theme.colors.interactiveFg.active};
  }
`;

const secondaryColors = ({ theme }) => css`
  background-color: ${theme.colors.interactiveBg.secondaryNormal};

  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.secondaryHover};
  }
`;

const tertiaryColors = ({ theme }) => css`
  background-color: ${theme.colors.interactiveBg.tertiaryNormal};

  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.tertiaryHover};
  }

  &:disabled {
    background-color: ${theme.colors.interactiveBg.tertiaryNormal};
  }
`;

const buttonColors = {
  [BUTTON_TYPES.PRIMARY]: primaryColors,
  [BUTTON_TYPES.SECONDARY]: secondaryColors,
  [BUTTON_TYPES.TERTIARY]: tertiaryColors,
};

const ButtonRectangle = styled(Base)`
  ${({ type }) => type && buttonColors?.[type]};
  min-width: 1px;
  min-height: 1em;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  padding: ${({ size }) =>
    size === BUTTON_SIZES.SMALL ? '8px 16px' : '18px 32px'};
`;

const ButtonSquare = styled(Base)`
  ${({ type }) => type && buttonColors?.[type]};
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
  width: ${THEME_CONSTANTS.ICON_SIZE}px;
  height: ${THEME_CONSTANTS.ICON_SIZE}px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ButtonOptions = {
  [BUTTON_VARIANTS.RECTANGLE]: ButtonRectangle,
  [BUTTON_VARIANTS.CIRCLE]: ButtonCircle,
  [BUTTON_VARIANTS.SQUARE]: ButtonSquare,
  [BUTTON_VARIANTS.ICON]: ButtonIcon,
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
};

export { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS };
