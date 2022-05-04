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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';

describe('Keyboard Shortcuts Menu', () => {
  let fixture;
  // Delay 100 ms when opening, but 300ms when closing. Even though animations
  // are disabled, we apparently still need quite a bit of time to makes sure
  // the dialog is actually gone.
  const openDelay = 100;
  const closeDelay = 300;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: User can interact with menu using mouse: Click toggle button to open, click close button to close menu', () => {
    it('should be able to open menu by clicking on keyboard shortcut button', async () => {
      const { keyboardShortcutsToggle } = fixture.editor.footer;

      // Menu should be closed
      await expect(
        fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
      ).toBeNull();

      await fixture.events.click(keyboardShortcutsToggle);
      await fixture.events.sleep(openDelay);

      await expect(
        fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
      ).toBeTruthy();

      await fixture.snapshot('shortcuts dialog open');
    });

    describe('when menu is open', () => {
      beforeEach(async () => {
        const { keyboardShortcutsToggle } = fixture.editor.footer;

        await fixture.events.click(keyboardShortcutsToggle);
      });

      it('should be able to close menu by clicking on close button', async () => {
        const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;
        expect(keyboardShortcutsMenu).toBeTruthy();

        const menu = within(keyboardShortcutsMenu);
        const closeButton = menu.getByRole('button', {
          name: /^Close Menu$/,
        });
        await fixture.events.click(closeButton);
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        expect(
          fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
        ).toBeNull();
      });

      it('should be able to close menu by clicking outside the menu', async () => {
        const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;
        expect(keyboardShortcutsMenu).toBeTruthy();

        // Click outside menu
        await fixture.events.mouse.clickOn(keyboardShortcutsMenu, -10, -10);
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        expect(
          fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
        ).toBeNull();
      });

      it('should not close menu when clicking inside the menu', async () => {
        const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;
        expect(keyboardShortcutsMenu).toBeTruthy();

        const menu = within(keyboardShortcutsMenu);
        const scrollableMenuArea = menu.queryByRole('presentation');
        // Click inside menu
        await fixture.events.click(scrollableMenuArea);
        // Give time for menu to process clicks
        await fixture.events.sleep(closeDelay);

        // Menu should still be open
        expect(
          fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
        ).toBeTruthy();
      });
    });
  });

  describe('CUJ: User can interact with menu using keyboard: Tab to menu, enter to open, esc to close', () => {
    it('should be able to toggle menu open with Enter key', async () => {
      const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;

      // Menu should be closed
      expect(keyboardShortcutsMenu).toBeNull();

      const { keyboardShortcutsToggle } = fixture.editor.footer;

      await fixture.events.focus(keyboardShortcutsToggle);
      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(openDelay);

      expect(
        fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
      ).toBeTruthy();
    });

    describe('when menu is open', () => {
      beforeEach(async () => {
        const { keyboardShortcutsToggle } = fixture.editor.footer;

        await fixture.events.focus(keyboardShortcutsToggle);
        // Tab back and forth to trigger app to think we're a keyboard user
        await fixture.events.keyboard.press('tab');
        await fixture.events.keyboard.shortcut('shift+tab');
        await fixture.events.keyboard.press('Enter');
        await fixture.events.sleep(openDelay);
      });

      it('should be able to close open menu using Esc key', async () => {
        const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;
        expect(keyboardShortcutsMenu).toBeTruthy();

        await fixture.events.keyboard.press('Escape');
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        expect(
          fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
        ).toBeNull();
      });

      it('should place focus on close button when menu opens', () => {
        const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;
        expect(keyboardShortcutsMenu).toBeTruthy();

        const menu = within(keyboardShortcutsMenu);
        const closeButton = menu.getByRole('button', {
          name: /^Close Menu$/,
        });

        expect(document.activeElement).toEqual(closeButton);
      });

      it('should be able to close menu with close button', async () => {
        const { keyboardShortcutsMenu } = fixture.editor.keyboardShortcuts;
        expect(keyboardShortcutsMenu).toBeTruthy();

        const menu = within(keyboardShortcutsMenu);
        const closeButton = menu.getByRole('button', {
          name: /^Close Menu$/,
        });

        await fixture.events.focus(closeButton);
        await fixture.events.keyboard.press('Enter');
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        expect(
          fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
        ).toBeNull();
      });
    });
  });

  describe('Keyboard Shortcuts Menu should have no aXe accessibility violations', () => {
    it('should have no aXe violations with an open menu', async () => {
      const { keyboardShortcutsToggle } = fixture.editor.footer;

      await fixture.events.click(keyboardShortcutsToggle);
      await fixture.events.sleep(openDelay);

      await expectAsync(
        fixture.editor.keyboardShortcuts.keyboardShortcutsMenu
      ).toHaveNoViolations();
    });
  });
});
