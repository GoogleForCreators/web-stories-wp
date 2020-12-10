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
 * Internal dependencies
 */
import { isPlatformMacOS } from './isPlatformMacOS';

/**
 * Prettifies keyboard shortcuts in a platform-agnostic way.
 *
 * @param {string} shortcut Keyboard shortcut combination, e.g. 'shift+mod+z'.
 * @return {string} Prettified keyboard shortcut.
 */
export function prettifyShortcut(shortcut) {
  const isMacOS = isPlatformMacOS();

  const replacementKeyMap = {
    alt: isMacOS ? '⌥' : 'Alt',
    ctrl: isMacOS ? '^' : 'Ctrl',
    mod: isMacOS ? '⌘' : 'Ctrl',
    cmd: '⌘',
    shift: isMacOS ? '⇧' : 'Shift',
  };

  const delimiter = isMacOS ? '' : '+';

  return shortcut
    .toLowerCase()
    .replace('alt', replacementKeyMap.alt)
    .replace('ctrl', replacementKeyMap.ctrl)
    .replace('mod', replacementKeyMap.mod)
    .replace('cmd', replacementKeyMap.cmd)
    .replace('shift', replacementKeyMap.shift)
    .replace('left', '←')
    .replace('up', '↑')
    .replace('right', '→')
    .replace('down', '↓')
    .replace('delete', '⌫')
    .split('+')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(delimiter);
}
