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
import { __, TranslateWithMarkup, sprintf } from '@googleforcreators/i18n';
import {
  isPlatformMacOS,
  prettifyShortcut,
  Shortcut,
} from '@googleforcreators/design-system';

const isMacOS = isPlatformMacOS();

const LargeKey = (props) => <kbd className="large-key" {...props} />;

const ShiftKeyWrapper = (props) => {
  return isMacOS ? <kbd {...props} /> : <LargeKey {...props} />;
};

const shortcuts = {
  header: {
    label: __('Keyboard Shortcuts', 'web-stories'),
    shortcut: (
      <kbd>
        <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
        <kbd>{'/'}</kbd>
      </kbd>
    ),
  },
  landmarks: [
    {
      label: __('Element', 'web-stories'),
      shortcut: (
        <kbd>
          <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
          <kbd>{prettifyShortcut('alt')}</kbd>
          <kbd>{'1'}</kbd>
        </kbd>
      ),
    },
    {
      label: __('Workspace', 'web-stories'),
      shortcut: (
        <kbd>
          <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
          <kbd>{prettifyShortcut('alt')}</kbd>
          <kbd>{'2'}</kbd>
        </kbd>
      ),
    },
    {
      label: __('Design panels', 'web-stories'),
      shortcut: (
        <kbd>
          <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
          <kbd>{prettifyShortcut('alt')}</kbd>
          <kbd>{'3'}</kbd>
        </kbd>
      ),
    },
  ],
  sections: [
    {
      title: __('Basics', 'web-stories'),
      commands: [
        {
          label: __('Undo', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'Z'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Redo', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <ShiftKeyWrapper>{prettifyShortcut('shift')}</ShiftKeyWrapper>
              <kbd>{'Z'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Save', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'S'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Play / Stop', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <LargeKey>{'Space'}</LargeKey>
            </kbd>
          ),
        },
      ],
    },
    {
      title: __('Text', 'web-stories'),
      commands: [
        {
          label: __('Insert/edit link', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'K'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Bold', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'B'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Italic', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'I'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Underline', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'U'}</kbd>
            </kbd>
          ),
        },
      ],
    },
    {
      title: __('Element', 'web-stories'),
      commands: [
        {
          label: __('Copy', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'C'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Cut', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'X'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Duplicate', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'D'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Paste', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'V'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Copy Styles', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{prettifyShortcut('alt')}</kbd>
              <kbd>{'O'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Paste Styles', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{prettifyShortcut('alt')}</kbd>
              <kbd>{'P'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Select all', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'A'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Select multiple', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  lkbd: <LargeKey />,
                  shortcut: <Shortcut shortcut="shift" />,
                }}
              >
                {sprintf(
                  /* translators: 1: Shift key. */
                  __('<lkbd>%s</lkbd> <span>+ click</span>', 'web-stories'),
                  prettifyShortcut('shift')
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
        {
          label: __('Move forward or back', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  kbd: <kbd />,
                  lkbd: <LargeKey />,
                }}
              >
                {sprintf(
                  /* translators: 1: Cmd/Ctrl key. 2: Up key. 3: Down key. */
                  __(
                    '<lkbd>%1$s</lkbd> <kbd>%2$s</kbd> <span>or</span> <kbd>%3$s</kbd>',
                    'web-stories'
                  ),
                  prettifyShortcut('mod'),
                  prettifyShortcut('up'),
                  prettifyShortcut('down')
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
        {
          label: __('Move to front or back', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  kbd: <kbd />,
                  lkbd: <LargeKey />,
                }}
              >
                {sprintf(
                  /* translators: 1: Cmd/Ctrl key. 2: Shift key. 3: Up key. 4: Down key. */
                  __(
                    '<lkbd>%1$s</lkbd> <lkbd>%2$s</lkbd> <kbd>%3$s</kbd> <span>or</span> <kbd>%4$s</kbd>',
                    'web-stories'
                  ),
                  prettifyShortcut('mod'),
                  prettifyShortcut('shift'),
                  prettifyShortcut('up'),
                  prettifyShortcut('down')
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
        {
          label: __('Enter crop/edit mode', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  kbd: <kbd />,
                }}
              >
                {sprintf(
                  /* translators: %s: Enter key. */
                  __(
                    '<kbd>%s</kbd> <span>or double-click</span>',
                    'web-stories'
                  ),
                  prettifyShortcut('enter')
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
        {
          label: __('Delete', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('delete')}</kbd>
            </kbd>
          ),
        },
        {
          // Not yet implemented
          disabled: true,
          label: __('Insert/edit link', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd>{'A'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Disable snapping and drop targeting', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  lkbd: <LargeKey />,
                }}
              >
                {sprintf(
                  /* translators: %s: Cmd/Ctrl key. */
                  __('<span>Hold</span> <lkbd>%s</lkbd>', 'web-stories'),
                  prettifyShortcut('mod')
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
        {
          label: __('Access floating toolbar', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('ctrl')}</kbd>
              <kbd className="large-key">{prettifyShortcut('alt')}</kbd>
              <kbd>{'P'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Open context menu', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key">{prettifyShortcut('mod')}</kbd>
              <kbd className="large-key">{prettifyShortcut('alt')}</kbd>
              <kbd className="large-key">{prettifyShortcut('shift')}</kbd>
              <kbd>{'M'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Move element 1px', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  lkbd: <LargeKey />,
                  shortcut: <Shortcut shortcut="shift" />,
                }}
              >
                {sprintf(
                  /* translators: 1: Shift key. */
                  __(
                    '<lkbd>%s</lkbd> <span>+ arrow keys</span>',
                    'web-stories'
                  ),
                  prettifyShortcut('shift')
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
      ],
    },
  ],
};

export const header = shortcuts.header;
export const landmarks = shortcuts.landmarks.filter((o) => !o.disabled);
export const sections = shortcuts.sections.map((section) => ({
  ...section,
  commands: section.commands.filter((o) => !o.disabled),
}));
