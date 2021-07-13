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
import { __, TranslateWithMarkup, sprintf } from '@web-stories-wp/i18n';
import { isPlatformMacOS } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { SPECIAL_KEYS } from './constants';

const isMacOs = isPlatformMacOS();
const cmdOrCtrl = isMacOs ? SPECIAL_KEYS.COMMAND : SPECIAL_KEYS.CONTROL;
const optionOrAlt = isMacOs ? SPECIAL_KEYS.OPTION : SPECIAL_KEYS.ALT;

const LargeKey = (props) => <kbd className="large-key" {...props} />;

const shortcuts = {
  header: {
    label: __('Keyboard Shortcuts', 'web-stories'),
    shortcut: (
      <kbd>
        <kbd aria-label={cmdOrCtrl.title} className="large-key">
          {cmdOrCtrl.symbol}
        </kbd>
        <kbd>{'/'}</kbd>
      </kbd>
    ),
  },
  landmarks: [
    {
      label: __('Element', 'web-stories'),
      shortcut: (
        <kbd>
          <kbd aria-label={cmdOrCtrl.title} className="large-key">
            {cmdOrCtrl.symbol}
          </kbd>
          <kbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</kbd>
          <kbd>{'1'}</kbd>
        </kbd>
      ),
    },
    {
      label: __('Workspace', 'web-stories'),
      shortcut: (
        <kbd>
          <kbd aria-label={cmdOrCtrl.title} className="large-key">
            {cmdOrCtrl.symbol}
          </kbd>
          <kbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</kbd>
          <kbd>{'2'}</kbd>
        </kbd>
      ),
    },
    {
      label: __('Design panels', 'web-stories'),
      shortcut: (
        <kbd>
          <kbd aria-label={cmdOrCtrl.title} className="large-key">
            {cmdOrCtrl.symbol}
          </kbd>
          <kbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</kbd>
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
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'Z'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Redo', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd aria-label={SPECIAL_KEYS.SHIFT.title}>
                {SPECIAL_KEYS.SHIFT.symbol}
              </kbd>
              <kbd>{'Z'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Save', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'S'}</kbd>
            </kbd>
          ),
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
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'K'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Bold', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'B'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Italic', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'I'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Underline', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
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
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'C'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Cut', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'X'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Duplicate', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'D'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Paste', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'V'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Select all', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
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
                  kbd: <kbd />,
                  shift: SPECIAL_KEYS.SHIFT.symbol,
                }}
              >
                {sprintf(
                  /* translators: %s: Shift key. */
                  __('%s <span>+ click</span>', 'web-stories'),
                  sprintf(
                    '<kbd aria-label="%s"><shift /></kbd>',
                    SPECIAL_KEYS.SHIFT.title
                  )
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
                  cmdOrCtrlSymbol: cmdOrCtrl.symbol,
                  upSymbol: SPECIAL_KEYS.UP.symbol,
                  downSymbol: SPECIAL_KEYS.UP.symbol,
                }}
              >
                {sprintf(
                  /* translators: 1: Cmd/Ctrl key. 2: Up key. 3: Down key. */
                  __('%1$s %2$s <span>or</span> %3$s', 'web-stories'),
                  sprintf(
                    '<lkbd aria-label="%s"><cmdOrCtrlSymbol /></lkbd>',
                    cmdOrCtrl.title
                  ),
                  sprintf(
                    '<kbd aria-label="%s"><upSymbol /></kbd>',
                    SPECIAL_KEYS.UP.title
                  ),
                  sprintf(
                    '<kbd aria-label="%s"><downSymbol /></kbd>',
                    SPECIAL_KEYS.DOWN.title
                  )
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
                  cmdOrCtrlSymbol: cmdOrCtrl.symbol,
                  shiftSymbol: SPECIAL_KEYS.SHIFT.symbol,
                  upSymbol: SPECIAL_KEYS.UP.symbol,
                  downSymbol: SPECIAL_KEYS.DOWN.symbol,
                }}
              >
                {sprintf(
                  /* translators: 1: Cmd/Ctrl key. 2: Shift key. 3: Up key. 4: Down key. */
                  __('%1$s %2$s %3$s <span>or</span> %4$s', 'web-stories'),
                  sprintf(
                    '<lkbd aria-label="%s"><cmdOrCtrlSymbol /></lkbd>',
                    cmdOrCtrl.title
                  ),
                  sprintf(
                    '<kbd aria-label="%s"><shiftSymbol /></kbd>',
                    SPECIAL_KEYS.SHIFT.title
                  ),
                  sprintf(
                    '<kbd aria-label="%s"><upSymbol /></kbd>',
                    SPECIAL_KEYS.UP.title
                  ),
                  sprintf(
                    '<kbd aria-label="%s"><downSymbol /></kbd>',
                    SPECIAL_KEYS.DOWN.title
                  )
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
                  enterSymbol: SPECIAL_KEYS.ENTER.symbol,
                }}
              >
                {sprintf(
                  /* translators: %s: Enter key. */
                  __('%s <span>or double-click</span>', 'web-stories'),
                  sprintf(
                    '<kbd aria-label="%s"><enterSymbol /></kbd>',
                    SPECIAL_KEYS.ENTER.title
                  )
                )}
              </TranslateWithMarkup>
            </kbd>
          ),
        },
        {
          label: __('Delete', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd className="large-key" aria-label={SPECIAL_KEYS.DELETE.title}>
                {SPECIAL_KEYS.DELETE.symbol}
              </kbd>
            </kbd>
          ),
        },
        {
          // Not yet implemented
          disabled: true,
          label: __('Insert/edit link', 'web-stories'),
          shortcut: (
            <kbd>
              <kbd aria-label={cmdOrCtrl.title} className="large-key">
                {cmdOrCtrl.symbol}
              </kbd>
              <kbd>{'A'}</kbd>
            </kbd>
          ),
        },
        {
          label: __('Disable snapping', 'web-stories'),
          shortcut: (
            <kbd>
              <TranslateWithMarkup
                mapping={{
                  kbd: <LargeKey />,
                  cmdOrCtrlSymbol: cmdOrCtrl.symbol,
                }}
              >
                {sprintf(
                  /* translators: %s: Cmd/Ctrl key. */
                  __('<span>Hold</span> %s', 'web-stories'),
                  sprintf(
                    '<kbd aria-label="%s"><cmdOrCtrlSymbol /></kbd>',
                    cmdOrCtrl.title
                  )
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
