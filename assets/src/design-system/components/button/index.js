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
import { TYPOGRAPHY_PRESET_SIZES } from '../../';
import { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './constants';

const Base = styled.button(
  ({ theme }) => `
  display: flex;
  align-items: center;
  box-sizing: content-box;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  box-shadow: 0 0 0 2px ${theme.colors.bg.primary};
  color: ${theme.colors.fg.primary};
  cursor: pointer;
  font-family: ${theme.typography.family.primary};
  font-size: ${
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL].size
  }px;
  font-weight: ${
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL].weight
  };
  letter-spacing: ${
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL].letterSpacing
  }px;
  line-height: ${
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL].lineHeight
  }px;
  text-decoration: none;

  &:disabled {
    pointer-events: none;
  }

  &:focus {
    box-shadow: 
      0 0 0 2px ${theme.colors.bg.primary}, 
      0 0 0 4px ${theme.colors.accent.secondary};
    outline: none;
  }

  &:active {
    outline: none;
  }

  transition: background-color 0.6s ease 0s;
`
);

const primaryColors = ({ theme }) => css`
  background-color: ${theme.colors.accent.primary};

  &:hover,
  &:focus,
  &:active {
    background-color: ${theme.colors.brandColors.violet[40]};
  }

  &:disabled {
    background-color: #efefef;
    color: ${theme.colors.brandColors.gray[20]};
  }
`;

const secondaryColors = ({ theme }) => css`
  background-color: #d1d1cc;

  &:hover,
  &:focus,
  &:active {
    background-color: ${theme.colors.brandColors.gray[20]};
  }

  &:disabled {
    background-color: #efefef;
    color: ${theme.colors.brandColors.gray[20]};
  }
`;

const tertiaryColors = ({ theme }) => css`
  background-color: ${theme.colors.standard.white};

  &:hover,
  &:focus,
  &:active {
    background-color: #efefef;
  }

  &:disabled {
    background-color: ${theme.colors.standard.white};
    color: ${theme.colors.brandColors.gray[20]};
  }
`;

const buttonColors = {
  [BUTTON_TYPES.PRIMARY]: primaryColors,
  [BUTTON_TYPES.SECONDARY]: secondaryColors,
  [BUTTON_TYPES.TERTIARY]: tertiaryColors,
};

const ButtonRectangle = styled(Base)`
  ${({ type }) => type && buttonColors[type]};
  min-width: 80px;
  height: 36px;
  padding: 8px 16px;
  border-radius: 4px;
`;

const ButtonCircle = styled(Base)`
  ${({ type }) => type && buttonColors?.[type]};

  ${({ size }) => `
  width: ${size === BUTTON_SIZES.SMALL ? 32 : 56}px;
  height:${size === BUTTON_SIZES.SMALL ? 32 : 56}px;
  border-radius: 50%;

  &:active {
    border-radius: 4px;
  }

  & > svg {
    width: ${size === BUTTON_SIZES.SMALL ? 14 : 20}px;
    height:${size === BUTTON_SIZES.SMALL ? 14 : 20}px;
    margin: 0 auto;
  }
  `}

  transition: border-radius 0.1s ease 0s;
`;

const ButtonIcon = styled(Base)`
  ${({ size }) => `
    width: ${size === BUTTON_SIZES.SMALL ? 14 : 20}px;
    height:${size === BUTTON_SIZES.SMALL ? 14 : 20}px;

    & > svg {
      width: 100%;
      height:100%;
    }
  `}
`;

// TODO incorporate tooltip as a label on hover per figma
export const Button = ({
  size = BUTTON_SIZES.MEDIUM,
  type = BUTTON_TYPES.PLAIN,
  variant = BUTTON_VARIANTS.RECTANGLE,
  children,
  ...rest
}) => {
  const ButtonOptions = {
    [BUTTON_VARIANTS.RECTANGLE]: ButtonRectangle,
    [BUTTON_VARIANTS.CIRCLE]: ButtonCircle,
    [BUTTON_VARIANTS.ICON]: ButtonIcon,
  };

  const isLink = rest.href !== undefined;

  const StyledButton = ButtonOptions[variant];

  return (
    <StyledButton
      as={isLink ? 'a' : 'button'}
      size={size}
      type={type}
      {...rest}
    >
      {children}
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
