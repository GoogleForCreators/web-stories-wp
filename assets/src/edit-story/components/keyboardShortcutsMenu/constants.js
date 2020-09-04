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

/**
 * Internal dependencies
 */
import { KeyboardShortcut as KeyboardShortcutIcon } from '../../icons';

export const KEY_SIZE = {
  NORMAL: 24,
  LARGE: 56,
};

const SPECIAL_KEYS = {
  COMMAND: (
    <KeyboardShortcutIcon
      aria-label={__('Command key', 'web-stories')}
      width="10"
      height="10"
    />
  ),
  ENTER: 'Enter',
  SHIFT: 'Shift',
  DELETE: 'Delete',
};

export const KEYBOARD_SHORTCUTS = {
  headers: [
    {
      label: __('Keyboard Shortcuts', 'web-stories'),
      shortcut: [SPECIAL_KEYS.COMMAND, '/'],
    },
  ],
  panels: [
    {
      // This shortcut panel should remain disabled until
      // this ticket has been completed:
      // https://github.com/google/web-stories-wp/issues/4241
      disabled: true,
      label: __(
        'Switch between element, workspace and design panels',
        'web-stories'
      ),
      shortcut: [
        SPECIAL_KEYS.COMMAND,
        SPECIAL_KEYS.SHIFT,
        '<',
        { label: __('or', 'web-stories') },
        '>',
      ],
    },
  ],
  sections: [
    {
      title: __('Basics', 'web-stories'),
      commands: [
        {
          label: __('Undo', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'Z'],
        },
        {
          label: __('Redo', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, SPECIAL_KEYS.SHIFT, 'Z'],
        },
        {
          label: __('Save', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'S'],
        },
      ],
    },
    {
      title: __('Text', 'web-stories'),
      commands: [
        {
          // Not yet implemented
          disabled: true,
          label: __('Insert/edit link', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'K'],
        },
        {
          label: __('Bold', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'B'],
        },
        {
          label: __('Italic', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'I'],
        },
        {
          label: __('Underline', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'U'],
        },
      ],
    },
    {
      title: __('Element', 'web-stories'),
      commands: [
        {
          label: __('Copy', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'C'],
        },
        {
          label: __('Cut', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'X'],
        },
        {
          label: __('Duplicate', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'D'],
        },
        {
          label: __('Paste', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'V'],
        },
        {
          label: __('Select all', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'A'],
        },
        {
          label: __('Select multiple', 'web-stories'),
          shortcut: [
            SPECIAL_KEYS.SHIFT,
            { label: __('+ click', 'web-stories') },
          ],
        },
        {
          label: __('Enter crop/edit mode', 'web-stories'),
          shortcut: [SPECIAL_KEYS.ENTER],
        },
        {
          label: __('Delete', 'web-stories'),
          shortcut: [SPECIAL_KEYS.DELETE],
        },
        {
          // Not yet implemented
          disabled: true,
          label: __('Insert/edit link', 'web-stories'),
          shortcut: [SPECIAL_KEYS.COMMAND, 'K'],
        },
        {
          label: __(
            'Disable snapping during move/rotate/resize',
            'web-stories'
          ),
          shortcut: [SPECIAL_KEYS.COMMAND],
        },
      ],
    },
  ],
};
