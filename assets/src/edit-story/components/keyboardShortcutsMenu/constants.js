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

export const TOGGLE_SHORTCUTS_MENU = 'mod+/';

export const KEY_SIZE = {
  NORMAL: 24,
  LARGE: 56,
};

export const SPECIAL_KEYS = {
  COMMAND: { symbol: '⌘', title: __('Command', 'web-stories') },
  CONTROL: { symbol: 'Ctrl', title: __('Control', 'web-stories') },
  ENTER: { symbol: '⏎', title: __('Enter', 'web-stories') },
  SHIFT: { symbol: '⇧', title: __('Shift', 'web-stories') },
  OPTION: { symbol: '⌥', title: __('Option', 'web-stories') },
  ALT: 'Alt',
  DELETE: __('Delete', 'web-stories'),
};
