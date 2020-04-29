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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { BUTTON_TYPES, KEYBOARD_USER_SELECTOR } from '../../constants';

const StyledButton = styled.button`
  font-family: ${({ theme }) => theme.fonts.button.family};
  font-size: ${({ theme }) => theme.fonts.button.size}px;
  font-weight: ${({ theme }) => theme.fonts.button.weight};
  line-height: ${({ theme }) => theme.fonts.button.lineHeight}px;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  border: ${({ theme }) => theme.borders.transparent};
  border-radius: ${({ theme }) => theme.button.borderRadius}px;
  display: flex;
  height: 40px;
  min-width: 100px;
  opacity: 0.75;
  padding: 0 10px;
  text-decoration: none;

  &:focus,
  &:active,
  &:hover {
    opacity: 1;
    outline: none;
    color: ${({ theme }) => theme.colors.white};
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) => theme.colors.action};
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: ${({ theme }) => theme.colors.bluePrimary};
`;

// TODO: address CTA active styling
const CtaButton = styled(StyledButton)`
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  opacity: 1;
`;

const SecondaryButton = styled(StyledButton)`
  background-color: transparent;
  text-shadow: ${({ theme }) => theme.text.shadow};

  &:focus,
  &:active,
  &:hover {
    text-shadow: ${({ theme }) => theme.text.shadow};
  }
`;

const StyledChildren = styled.span`
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = ({
  children,
  isDisabled,
  isLink,
  type = BUTTON_TYPES.PRIMARY,
  ...rest
}) => {
  const ButtonOptions = {
    [BUTTON_TYPES.PRIMARY]: PrimaryButton,
    [BUTTON_TYPES.SECONDARY]: SecondaryButton,
    [BUTTON_TYPES.CTA]: CtaButton,
  };

  const StyledButtonByType = ButtonOptions[type];

  return (
    <StyledButtonByType
      as={isLink ? 'a' : 'button'}
      disabled={isDisabled}
      {...rest}
    >
      <StyledChildren>{children}</StyledChildren>
    </StyledButtonByType>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  isCta: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLink: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
};

export default Button;
