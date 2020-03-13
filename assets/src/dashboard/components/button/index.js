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
import PropTypes from 'prop-types'; // import styled from 'styled-components';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { BUTTON_TYPES } from '../../constants';

const StyledButton = styled.button`
  align-items: center;
  background-color: ${({ theme, type }) =>
    type === BUTTON_TYPES.PRIMARY ? theme.colors.bluePrimary : 'transparent'};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: ${({ theme, type }) =>
    type === BUTTON_TYPES.PRIMARY ? theme.border.buttonRadius : 'none'};
  display: flex;
  height: 40px;
  min-width: 132px;
  opacity: ${({ isCta }) => (isCta ? '1' : '0.75')};
  padding: 0;
  text-shadow: ${({ theme, type }) =>
    type === BUTTON_TYPES.SECONDARY && theme.text.shadow};

  &:focus,
  &:active,
  &:hover {
    opacity: 1;
    text-shadow: ${({ theme, type }) =>
      type === BUTTON_TYPES.SECONDARY && theme.text.shadow};
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const StyledChildren = styled.span`
  font-family: ${({ theme }) => theme.fonts.button.family};
  font-size: ${({ theme }) => theme.fonts.button.size};
  font-weight: ${({ theme }) => theme.fonts.button.weight};
  line-height: ${({ theme }) => theme.fonts.button.lineHeight};
  margin: auto;
  padding: 10px 24px;
`;

const Button = ({
  children,
  isDisabled,
  isCta,
  onClick,
  type = BUTTON_TYPES.PRIMARY,
  ...rest
}) => {
  return (
    <StyledButton
      disabled={isDisabled}
      isCta={isCta}
      onClick={onClick}
      type={type}
      {...rest}
    >
      <StyledChildren>{children}</StyledChildren>
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isCta: PropTypes.bool,
  isDisabled: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
};

export default Button;
