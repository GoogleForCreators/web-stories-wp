/*
 * Copyright 2022 Google LLC
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
 * Some menus have text or numeric inputs nested within them.
 * This pattern should be avoided, however sometimes it happens.
 * When it does, CONTEXT_MENU_SKIP_ELEMENT should be attached to
 * the nested natively focusable element (ie: an input)
 * so that in /menu.js `getFocusableChildren` can remove these nested elements
 * from its returned value. This allows a wrapper element (probably a button)
 * to handle when to focus the input
 * so that a keyboard user doesn't get trapped in the freeform input within a menu.
 * Currently, this is used from within story-editor floatingMenu (see FocusTrapButton).
 */
export const CONTEXT_MENU_SKIP_ELEMENT = 'context-menu-skip-element';
