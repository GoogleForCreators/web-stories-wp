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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const BUTTON_TYPES = {
  CTA: 'cta',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
};

export const CHIP_TYPES = {
  STANDARD: 'standard',
  SMALL: 'small',
};

export const DROPDOWN_TYPES = {
  TRANSPARENT_MENU: 'transparentMenu',
  MENU: 'menu',
  PANEL: 'panel',
};

export const KEYS = {
  ENTER: 'Enter',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

export const KEYBOARD_USER_CLASS = `useskeyboard`;
export const KEYBOARD_USER_SELECTOR = `.${KEYBOARD_USER_CLASS}`;

export const Z_INDEX = {
  POPOVER_MENU: 10,
  TYPEAHEAD_OPTIONS: 10,
  POPOVER_PANEL: 10,
};

export const paths = [
  { value: '/', label: __('My Stories', 'web-stories') },
  {
    value: '/templates-gallery',
    label: __('Templates Gallery', 'web-stories'),
  },
  { value: '/my-bookmarks', label: __('My Bookmarks', 'web-stories') },
];

export const storiesFilters = [
  { label: 'All Stories', value: 'all-stories ' },
  { label: 'Drafts', value: 'drafts' },
  { label: 'Active Stories', value: 'active-stories ' },
  { label: 'My Templates', value: 'my-templates ' },
];
