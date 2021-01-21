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

export const focusableOutlineCSS = (v) => {
  const accent = typeof v === 'string' ? v : v?.theme?.colors?.border?.focus;
  return css`
    border: solid 2px transparent;

    &.${FOCUS_VISIBLE_SELECTOR} {
      outline: none;
      border: solid 2px ${accent};
    }
  `;
};
