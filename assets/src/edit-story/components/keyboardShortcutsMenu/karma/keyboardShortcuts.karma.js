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

  const getKeyboardShortcutsMenu = () => {
    return fixture.screen.queryByRole('list', {
      name: /^Keyboard Shortcuts$/,
    });
  };

  const getKeyboardShortcutsToggle = () => {
    return fixture.editor.getByRole('button', {
      name: /^Keyboard Shortcuts$/,
    });
  };

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: User can interact with menu using mouse: Click toggle button to open, click close button to close menu', () => {
    it('should be able to open menu by clicking on keyboard shortcut button', async () => {
      const hiddenMenu = getKeyboardShortcutsMenu();
      // Menu should be closed
      expect(hiddenMenu).toBeNull();

      const menuToggle = getKeyboardShortcutsToggle();

      await fixture.events.click(menuToggle);
      await fixture.events.sleep(openDelay);

      const openMenu = getKeyboardShortcutsMenu();

      expect(openMenu).toBeTruthy();

      await fixture.snapshot('shortcuts dialog open');
    });

    describe('when menu is open', () => {
      beforeEach(async () => {
        const menuToggle = getKeyboardShortcutsToggle();

        await fixture.events.click(menuToggle);
      });

      it('should be able to close menu by clicking on close button', async () => {
        const openMenu = getKeyboardShortcutsMenu();
        expect(openMenu).toBeTruthy();

        const menu = within(openMenu);
        const closeButton = menu.getByRole('button', {
          name: /^Close menu$/,
        });
        await fixture.events.click(closeButton);
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        const closedMenu = getKeyboardShortcutsMenu();

        expect(closedMenu).toBeNull();
      });

      it('should be able to close menu by clicking outside the menu', async () => {
        const openMenu = getKeyboardShortcutsMenu();
        expect(openMenu).toBeTruthy();

        // Click outside menu
        await fixture.events.mouse.clickOn(openMenu, -10, -10);
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        const closedMenu = getKeyboardShortcutsMenu();

        expect(closedMenu).toBeNull();
      });

      it('should not close menu when clicking inside the menu', async () => {
        const openMenu = getKeyboardShortcutsMenu();
        expect(openMenu).toBeTruthy();

        // Click inside menu
        await fixture.events.mouse.clickOn(openMenu, 10, 10);

        const menu = within(openMenu);
        const menuItem = await menu.queryAllByRole('listitem')[0];
        // Click on element inside menu
        await fixture.events.click(menuItem);
        // Give time for menu to process clicks
        await fixture.events.sleep(closeDelay);

        const stillOpenMenu = getKeyboardShortcutsMenu();

        // Menu should still be open
        expect(stillOpenMenu).toBeTruthy();
      });
    });
  });

  describe('CUJ: User can interact with menu using keyboard: Tab to menu, enter to open, esc to close', () => {
    it('should be able to toggle menu open with Enter key', async () => {
      const hiddenMenu = getKeyboardShortcutsMenu();
      // Menu should be closed
      expect(hiddenMenu).toBeNull();

      const menuToggle = getKeyboardShortcutsToggle();

      await fixture.events.focus(menuToggle);
      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(openDelay);

      const openMenu = getKeyboardShortcutsMenu();

      expect(openMenu).toBeTruthy();
    });

    describe('when menu is open', () => {
      beforeEach(async () => {
        const menuToggle = getKeyboardShortcutsToggle();

        await fixture.events.focus(menuToggle);
        // Tab back and forth to trigger app to think we're a keyboard user
        await fixture.events.keyboard.press('tab');
        await fixture.events.keyboard.shortcut('shift+tab');
        await fixture.events.keyboard.press('Enter');
        await fixture.events.sleep(openDelay);
      });

      it('should be able to close open menu using Esc key', async () => {
        const openMenu = getKeyboardShortcutsMenu();
        expect(openMenu).toBeTruthy();

        await fixture.events.keyboard.press('Escape');
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        const closedMenu = getKeyboardShortcutsMenu();

        expect(closedMenu).toBeNull();
      });

      it('should place focus on close button when menu opens', () => {
        const openMenu = getKeyboardShortcutsMenu();
        expect(openMenu).toBeTruthy();

        const menu = within(openMenu);
        const closeButton = menu.getByRole('button', {
          name: /^Close menu$/,
        });

        expect(document.activeElement).toEqual(closeButton);
      });

      it('should be able to close menu with close button', async () => {
        const openMenu = getKeyboardShortcutsMenu();
        expect(openMenu).toBeTruthy();

        const menu = within(openMenu);
        const closeButton = menu.getByRole('button', {
          name: /^Close menu$/,
        });

        await fixture.events.focus(closeButton);
        await fixture.events.keyboard.press('Enter');
        // Give time for menu to close
        await fixture.events.sleep(closeDelay);

        const closedMenu = getKeyboardShortcutsMenu();

        expect(closedMenu).toBeNull();
      });
    });
  });
});
