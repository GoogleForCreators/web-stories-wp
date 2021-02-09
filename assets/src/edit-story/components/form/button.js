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
import { rgba } from 'polished';

// Class should contain "mousetrap" to enable keyboard shortcuts on buttons.
const Button = styled.button.attrs(({ type }) => ({
  type: type || 'button',
  className: 'mousetrap',
}))`
  background: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.1)};
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.86)};
  border: none;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ size = 14 }) => `${size}px`};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body2.letterSpacing};
  padding: ${({ size = 14 }) => `${(size - 2) / 2}px ${size}px`};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  ${({ fullWidth }) =>
    fullWidth &&
    `
      flex: 1;
      width: 100%;
    `}

  &:hover {
    background: ${({ theme }) =>
      rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.2)};
  }
`;

export default Button;
