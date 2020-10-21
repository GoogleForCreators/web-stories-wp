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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TYPOGRAPHY_PRESET_SIZES } from '../../theme/typography';

export const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  PLAIN: 'plain',
  ICON: 'icon',
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
};

export const BUTTON_VARIANTS = {
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
};

const Base = styled.button.attrs(({ isDisabled }) => ({
  disabled: isDisabled,
}))`
  cursor: pointer;
  text-decoration: none;
  font-family: ${({ theme }) => theme.typography.family.primary};
  font-size: ${({ theme }) =>
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL].size}px;
  font-weight: ${({ theme }) =>
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL].weight};
  line-height: ${({ theme }) =>
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL]
      .lineHeight}px;
  letter-spacing: ${({ theme }) =>
    theme.typography.presets.button[TYPOGRAPHY_PRESET_SIZES.SMALL]
      .letterSpacing}px;
  border: ${({ theme }) => `2px solid ${theme.colors.bg.primary}`};

  &:focus {
    outline: ${({ theme }) => `2px solid ${theme.colors.accent.secondary}`};
  }

  ${({ disabled }) =>
    disabled &&
    `
		pointer-events: none;
	`}
`;

const PrimaryButton = styled(Base)``;
const SecondaryButton = styled(Base)``;
const TertiaryButton = styled(Base)``;
const PlainButton = styled(Base)``;
const IconButton = styled(Base)``; // should this be separate?

export const Button = ({
  size = BUTTON_SIZES.MEDIUM,
  type = BUTTON_TYPES.PLAIN,
  variant = BUTTON_VARIANTS.RECTANGLE,
  //   activeLabelText = '',
  children,
  ...rest
}) => {
  const ButtonOptions = {
    [BUTTON_VARIANTS.CIRCLE]: {
      [BUTTON_TYPES.PRIMARY]: PrimaryButton,
      [BUTTON_TYPES.SECONDARY]: SecondaryButton,
      [BUTTON_TYPES.TERTIARY]: TertiaryButton,
      [BUTTON_TYPES.PLAIN]: PlainButton,
      [BUTTON_TYPES.ICON]: IconButton,
    },
    [BUTTON_VARIANTS.RECTANGLE]: {
      [BUTTON_TYPES.PRIMARY]: PrimaryButton,
      [BUTTON_TYPES.SECONDARY]: SecondaryButton,
      [BUTTON_TYPES.TERTIARY]: TertiaryButton,
      [BUTTON_TYPES.PLAIN]: PlainButton,
      [BUTTON_TYPES.ICON]: IconButton,
    },
  };

  const isLink = rest.href !== undefined;

  const StyledButton = ButtonOptions[variant][type];

  return (
    <StyledButton as={isLink ? 'a' : 'button'} size={size} {...rest}>
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
