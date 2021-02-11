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
import { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { FOCUS_VISIBLE_SELECTOR } from '../global';

/**
 * A css snippet that can be used for the focus styling.
 *
 * @param {string} accent the color of the focused border
 * @param {string} background the background color used in between
 * the edge of the element and the focused border.
 * @return {*} css snippet
 */
export const focusCSS = (accent, background) => css`
  outline: none;
  box-shadow: ${({ theme }) =>
    `0px 0px 0 2px ${background || theme.colors.bg.primary}, 0px 0px 0 4px ${
      accent || theme.colors.border.focus
    }`};
`;

export const focusableOutlineCSS = (colorOrProps, background) => {
  const accent =
    typeof colorOrProps === 'string'
      ? colorOrProps
      : colorOrProps?.theme?.colors?.border?.focus;
  return css`
    &.${FOCUS_VISIBLE_SELECTOR} {
      ${focusCSS(accent, background)};
    }
  `;
};
