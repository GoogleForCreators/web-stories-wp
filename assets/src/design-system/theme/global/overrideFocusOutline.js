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
import { createGlobalStyle } from 'styled-components';
import 'focus-visible';

/**
 * Relies on https://github.com/WICG/focus-visible for polyfill
 * Focus styles are handled in helpers/outline because our focus style is a border it needs to have consistent spacing around it, which means a transparent border when not focused.
 * Having this override be in a global style will add confusion when spacing isn't lining up how developers think it should in their given component.
 * When helper is not used, default outline style will still show up to preserve accessibility.
 */

export const FOCUS_VISIBLE_SELECTOR = 'focus-visible';

export const OverrideFocusOutline = createGlobalStyle`
   /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
    */
    .js-focus-visible :focus:not(.${FOCUS_VISIBLE_SELECTOR}),
    .js-focus-visible :focus-visible:not(.${FOCUS_VISIBLE_SELECTOR}) {
        outline: none;
    }

`;
