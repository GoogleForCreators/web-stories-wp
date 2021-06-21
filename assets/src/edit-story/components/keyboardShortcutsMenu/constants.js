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
import { _x } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { KeyArrowUp } from '../../icons';

export const TOP_MARGIN = 16;
export const BOTTOM_MARGIN = 8;

export const TOGGLE_SHORTCUTS_MENU = 'mod+/';

const Up = styled(KeyArrowUp)`
  width: 12px;
  transform-origin: 50% 50%;
`;
const Down = styled(Up)`
  transform: rotate(0.5turn);
`;
const Cmd = () => '⌘';
const Ctrl = () => 'ctrl';
const Enter = () => '⏎';
const Shift = () => '⇧';
const Option = () => '⌥';
const Alt = () => _x('alt', 'The keyboard key "Alt"', 'web-stories');
const Delete = () => _x('Delete', 'The keyboard key "Delete"', 'web-stories');

export const SPECIAL_KEYS = {
  COMMAND: {
    symbol: <Cmd />,
    title: _x('Command', 'The keyboard key "Command"', 'web-stories'),
  },
  CONTROL: {
    symbol: <Ctrl />,
    title: _x('Control', 'The keyboard key "Control"', 'web-stories'),
  },
  ENTER: {
    symbol: <Enter />,
    title: _x('Enter', 'The keyboard key "Enter"', 'web-stories'),
  },
  SHIFT: {
    symbol: <Shift />,
    title: _x('Shift', 'The keyboard key "Shift"', 'web-stories'),
  },
  OPTION: {
    symbol: <Option />,
    title: _x('Option', 'The keyboard key "Option"', 'web-stories'),
  },
  ALT: {
    symbol: <Alt />,
    title: _x('alt', 'The keyboard key "Alt"', 'web-stories'),
  },
  DELETE: {
    symbol: <Delete />,
    title: _x('Delete', 'The keyboard key "Delete"', 'web-stories'),
  },
  UP: {
    symbol: <Up />,
    title: _x('Up arrow', 'The keyboard key "Up"', 'web-stories'),
  },
  DOWN: {
    symbol: <Down />,
    title: _x('Down arrow', 'The keyboard key "Down"', 'web-stories'),
  },
};
