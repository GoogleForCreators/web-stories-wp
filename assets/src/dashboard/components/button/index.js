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
import { TypographyPresets } from '../typography';

const StyledButton = styled.button`
  ${TypographyPresets.Small};

  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.typography.weight.bold};
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.white};
  cursor: pointer;
  border: ${({ theme }) => theme.DEPRECATED_THEME.borders.transparent};
  border-radius: ${({ theme }) => theme.DEPRECATED_THEME.button.borderRadius}px;
  display: flex;
  min-width: 100px;
  opacity: 0.75;
  padding: 4px 12px;
  text-decoration: none;
  text-align: center;

  &:focus,
  &:active,
  &:hover {
    box-shadow: none;
    opacity: 1;
    outline: none;
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.white};
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.action};
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bluePrimary};
`;

export const DefaultButton = styled(StyledButton)`
  ${TypographyPresets.Medium};
  ${({ theme }) => `
    min-width: 50px;
    padding: 4px 14px;
    background: transparent;
    color: ${theme.DEPRECATED_THEME.colors.bluePrimary};
    border: ${theme.DEPRECATED_THEME.borders.transparent};
    border-radius: 5px;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 24px;
    opacity: 1;

    &:focus,
    &:active,
    &:hover {
      color: ${theme.DEPRECATED_THEME.colors.bluePrimary};
      border-color: ${theme.DEPRECATED_THEME.colors.blueLight};
      background-color: ${theme.DEPRECATED_THEME.colors.blueLight};
    }

    transition: background-color 0.6s ease 0s;
  `}
`;

// TODO: address CTA active styling
const CtaButton = styled(StyledButton)`
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bluePrimary};
  opacity: 1;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) => theme.DEPRECATED_THEME.borders.action};
  }
`;

const SecondaryButton = styled(StyledButton)`
  border-radius: 0px;
  background-color: transparent;
  text-shadow: ${({ theme }) => theme.DEPRECATED_THEME.text.shadow};

  &:focus,
  &:active,
  &:hover {
    text-shadow: ${({ theme }) => theme.DEPRECATED_THEME.text.shadow};
  }
`;

const StyledChildren = styled.span`
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: ${({ isSecondary }) =>
    isSecondary ? '0.1em solid currentColor' : 'none'};
`;

StyledChildren.propTypes = {
  isSecondary: PropTypes.bool,
};

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
    [BUTTON_TYPES.DEFAULT]: DefaultButton,
  };

  const StyledButtonByType = ButtonOptions[type];

  return (
    <StyledButtonByType
      as={isLink ? 'a' : 'button'}
      disabled={isDisabled}
      onClick={(e) => e.stopPropagation()} // this is here so that links stacked on containers that have click handlers don't bubble. if an onClick is present as a prop it'll override this with ...rest
      {...rest}
    >
      <StyledChildren isSecondary={type === BUTTON_TYPES.SECONDARY}>
        {children}
      </StyledChildren>
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
export { default as PaginationButton } from './paginationButton';
