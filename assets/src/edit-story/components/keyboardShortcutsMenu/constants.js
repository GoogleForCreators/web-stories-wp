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
import { __, _x } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { KeyArrowUp } from '../../icons';

export const TOP_MARGIN = 16;
export const BOTTOM_MARGIN = 8;

export const TOGGLE_SHORTCUTS_MENU = 'mod+/';

export const KEY_SIZE = {
  NORMAL: 24,
  LARGE: 52,
};

const Up = styled(KeyArrowUp)`
  width: 12px;
  transform-origin: 50% 50%;
`;

const Down = styled(Up)`
  transform: rotate(0.5turn);
`;

export const SPECIAL_KEYS = {
  COMMAND: {
    symbol: '⌘',
    title: _x('Command', 'The keyboard key "Command"', 'web-stories'),
  },
  CONTROL: {
    symbol: 'Ctrl',
    title: _x('Control', 'The keyboard key "Control"', 'web-stories'),
  },
  ENTER: {
    symbol: '⏎',
    title: _x('Enter', 'The keyboard key "Enter"', 'web-stories'),
  },
  SHIFT: {
    symbol: '⇧',
    title: _x('Shift', 'The keyboard key "Shift"', 'web-stories'),
  },
  OPTION: {
    symbol: '⌥',
    title: _x('Option', 'The keyboard key "Option"', 'web-stories'),
  },
  ALT: _x('Alt', 'The keyboard key "Alt"', 'web-stories'),
  DELETE: _x('Delete', 'The keyboard key "Delete"', 'web-stories'),
  UP: <Up aria-label={__('Up arrow', 'web-stories')} />,
  DOWN: <Down aria-label={__('Down arrow', 'web-stories')} />,
};
