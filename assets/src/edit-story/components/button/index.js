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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { ArrowDown as ArrowDownIcon, More as MoreIcon } from '../../icons';

const Base = styled.button.attrs(({ isDisabled }) => ({
  disabled: isDisabled,
}))`
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  background: transparent;
  display: block;
  min-width: ${({ isIcon }) => (isIcon ? 'initial' : '63px')};
  max-height: 30px;
  padding: 0 10px;
  cursor: pointer;
  text-decoration: none;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: 28px;

  &:active {
    outline: none;
  }

  svg {
    width: 1em;
  }

  ${({ disabled }) =>
    disabled &&
    `
		pointer-events: none;
		opacity: .3;
	`}
`;

const StyledButton = styled(Base)`
  border: none;
  padding: 0;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  min-width: initial;
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};

  svg {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    display: block;
  }
`;

export const ArrowDown = (props) => (
  <StyledButton {...props}>
    <ArrowDownIcon />
  </StyledButton>
);

export const More = forwardRef(function More(props, ref) {
  return (
    <StyledButton {...props} ref={ref}>
      <MoreIcon />
    </StyledButton>
  );
});
