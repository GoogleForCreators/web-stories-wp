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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../';
import { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './constants';

const Base = styled.button(
  ({ size, theme }) => css`
    position: relative;
    display: block;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    color: ${theme.colors.fg.primary};
    cursor: pointer;
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.button[
          size === BUTTON_SIZES.SMALL
            ? THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL
            : THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.MEDIUM
        ],
      },
      theme,
    })};

    &:focus,
    &:active {
      outline: none;
    }
    &:active {
      background-color: ${theme.colors.interactiveBg.active};
    }

    &:disabled {
      pointer-events: none;
      background-color: ${theme.colors.interactiveBg.disable};
      color: ${theme.colors.fg.disable};
    }

    transition: background-color 0.6s ease 0s;
  `
);

const primaryColors = ({ theme }) => css`
  background-color: ${theme.colors.interactiveBg.brandNormal};

  &:hover,
  &:focus {
    background-color: ${theme.colors.interactiveBg.brandHover};
  }
  &:active {
    background-color: ${theme.colors.interactiveBg.active};
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
  border-radius: 4px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: ${({ size }) =>
      size === BUTTON_SIZES.SMALL ? '8px 16px' : '16px 32px'};
    height: 100%;
  }
`;

const ButtonSquare = styled(Base)`
  ${({ type }) => type && buttonColors?.[type]};
  border-radius: 4px;
  ${({ size }) => css`
    width: ${(size === BUTTON_SIZES.SMALL ? 32 : 56) + 8}px;
    height: ${(size === BUTTON_SIZES.SMALL ? 32 : 56) + 8}px;

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 10px 10px;
      height: 100%;
      width: 100%;
    }

    svg {
      width: ${size === BUTTON_SIZES.SMALL ? 16 : 20}px;
      height: ${size === BUTTON_SIZES.SMALL ? 16 : 20}px;
      margin: 0 auto;
    }
  `}
`;

const ButtonCircle = styled(ButtonSquare)`
  border-radius: 50%;
`;

const ButtonIcon = styled(Base)`
  ${({ size }) => css`
    width: ${(size === BUTTON_SIZES.SMALL ? 16 : 20) + 8}px;
    height: ${(size === BUTTON_SIZES.SMALL ? 16 : 20) + 8}px;

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 100%;
      width: 100%;
    }

    svg {
      width: 100%;
      height: auto;
      margin: 0 auto;
    }
  `}
`;

// TODO incorporate tooltip as a label on hover per figma
const ButtonOptions = {
  [BUTTON_VARIANTS.RECTANGLE]: ButtonRectangle,
  [BUTTON_VARIANTS.CIRCLE]: ButtonCircle,
  [BUTTON_VARIANTS.SQUARE]: ButtonSquare,
  [BUTTON_VARIANTS.ICON]: ButtonIcon,
};

export const Button = ({
  size = BUTTON_SIZES.MEDIUM,
  type = BUTTON_TYPES.PLAIN,
  variant = BUTTON_VARIANTS.RECTANGLE,
  children,
  ...rest
}) => {
  const isLink = rest.href !== undefined;
  const StyledButton = ButtonOptions[variant];

  return (
    <StyledButton
      as={isLink ? 'a' : 'button'}
      size={size}
      type={type}
      {...rest}
    >
      <div>{children}</div>
    </StyledButton>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
  type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
  variant: PropTypes.oneOf(Object.values(BUTTON_VARIANTS)),
  children: PropTypes.node.isRequired,
  activeLabelText: PropTypes.string,
};

export { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS };
