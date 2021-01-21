/*
 * Copyright 2021 Google LLC
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
 * This is an object containing styles to reset
 * native html styles.
 *
 * **structure:**
 * ```
 * const reset = {
 *   [element]: css`
 *      // ...styles
 *   ` || (styledProps) => css`
 *      // ...styles
 *    `,
 * }
 * ```
 *
 * **example:**
 * ```
 * const Button = styled.button`
 *   ${themeHelpers.reset.button}
 * `;
 * ```
 */
export const reset = {
  button: css`
    background-color: inherit;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  `,
};
