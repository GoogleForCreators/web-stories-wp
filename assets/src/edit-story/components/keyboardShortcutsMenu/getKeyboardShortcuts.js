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
import { isPlatformMacOS } from '../keyboard';
import { SPECIAL_KEYS } from './constants';

function getKeyboardShortcuts() {
  const isMacOs = isPlatformMacOS();
  const cmdOrCtrl = isMacOs ? SPECIAL_KEYS.COMMAND : SPECIAL_KEYS.CONTROL;

  return {
    headers: [
      {
        label: __('Keyboard Shortcuts', 'web-stories'),
        shortcut: [cmdOrCtrl, '/'],
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
          cmdOrCtrl,
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
            shortcut: [cmdOrCtrl, 'Z'],
          },
          {
            label: __('Redo', 'web-stories'),
            shortcut: [cmdOrCtrl, SPECIAL_KEYS.SHIFT, 'Z'],
          },
          {
            label: __('Save', 'web-stories'),
            shortcut: [cmdOrCtrl, 'S'],
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
            shortcut: [cmdOrCtrl, 'K'],
          },
          {
            label: __('Bold', 'web-stories'),
            shortcut: [cmdOrCtrl, 'B'],
          },
          {
            label: __('Italic', 'web-stories'),
            shortcut: [cmdOrCtrl, 'I'],
          },
          {
            label: __('Underline', 'web-stories'),
            shortcut: [cmdOrCtrl, 'U'],
          },
        ],
      },
      {
        title: __('Element', 'web-stories'),
        commands: [
          {
            label: __('Copy', 'web-stories'),
            shortcut: [cmdOrCtrl, 'C'],
          },
          {
            label: __('Cut', 'web-stories'),
            shortcut: [cmdOrCtrl, 'X'],
          },
          {
            label: __('Duplicate', 'web-stories'),
            shortcut: [cmdOrCtrl, 'D'],
          },
          {
            label: __('Paste', 'web-stories'),
            shortcut: [cmdOrCtrl, 'V'],
          },
          {
            label: __('Select all', 'web-stories'),
            shortcut: [cmdOrCtrl, 'A'],
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
            shortcut: [cmdOrCtrl, 'K'],
          },
          {
            label: __(
              'Disable snapping during move/rotate/resize',
              'web-stories'
            ),
            shortcut: [cmdOrCtrl],
          },
        ],
      },
    ],
  };
}

export default getKeyboardShortcuts;
