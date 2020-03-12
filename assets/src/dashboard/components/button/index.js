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
  border-radius: 100px;
  border: 1px solid transparent;
  display: flex;
  min-width: 132px;
  min-height: 40px;
  align-items: center;
  cursor: pointer;
  padding: 0;
  background-color: ${({ theme, type }) =>
    type === BUTTON_TYPES.PRIMARY ? theme.colors.bluePrimary : 'transparent'};
  color: ${({ theme }) => theme.colors.white};
  opacity: ${({ isCta }) => (isCta ? '1' : '0.75')};
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
    pointer-events: none;
    opacity: 0.3;
  }
`;

const StyledChildren = styled.span`
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  align-self: center;
  margin: auto;
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
      onClick={onClick}
      type={type}
      isCta={isCta}
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
