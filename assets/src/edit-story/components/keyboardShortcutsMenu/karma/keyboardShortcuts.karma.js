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

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ showKeyboardShortcutsButton: true });

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: User can interact with menu using mouse: Click toggle button to open, click close button to close menu', () => {
    it('should be able to open menu by clicking on keyboard shortcut button', async () => {
      const hiddenMenu = await fixture.screen.queryByTestId(
        'keyboard-shortcuts-menu'
      );
      // Menu should be closed
      expect(hiddenMenu).toBeNull();

      const menuToggle = fixture.screen.getByTestId(
        'keyboard-shortcuts-toggle'
      );

      await fixture.events.click(menuToggle);

      const openMenu = await fixture.screen.queryByTestId(
        'keyboard-shortcuts-menu'
      );

      expect(openMenu).toBeTruthy();
    });

    describe('when menu is open', () => {
      beforeEach(async () => {
        const menuToggle = fixture.screen.getByTestId(
          'keyboard-shortcuts-toggle'
        );

        await fixture.events.click(menuToggle);
      });

      it('should be able to close menu by clicking on close button', async () => {
        const openMenu = await fixture.screen.getByTestId(
          'keyboard-shortcuts-menu'
        );
        expect(openMenu).toBeTruthy();

        const closeButton = fixture.screen.queryByRole('button', {
          name: /^Close menu$/,
        });
        await fixture.events.click(closeButton);
        // Give time for menu to close
        await fixture.events.sleep(100);

        const closedMenu = await fixture.screen.queryByTestId(
          'keyboard-shortcuts-menu'
        );

        expect(closedMenu).toBeNull();
      });

      it('should be able to close menu by clicking outside the menu', async () => {
        const openMenu = await fixture.screen.getByTestId(
          'keyboard-shortcuts-menu'
        );
        expect(openMenu).toBeTruthy();

        // Click outside menu
        await fixture.events.mouse.clickOn(openMenu, -10, -10);
        // Give time for menu to close
        await fixture.events.sleep(100);

        const closedMenu = await fixture.screen.queryByTestId(
          'keyboard-shortcuts-menu'
        );

        expect(closedMenu).toBeNull();
      });

      it('should not close menu when clicking inside the menu', async () => {
        const openMenu = await fixture.screen.getByTestId(
          'keyboard-shortcuts-menu'
        );
        expect(openMenu).toBeTruthy();

        // Click inside menu
        await fixture.events.mouse.clickOn(openMenu, 10, 10);

        const menuItem = await within(openMenu).queryAllByRole('listitem')[0];
        // Click on element inside menu
        await fixture.events.click(menuItem);
        // Give time for menu to process clicks
        await fixture.events.sleep(100);

        const menu = await fixture.screen.queryByTestId(
          'keyboard-shortcuts-menu'
        );

        // Menu should still be open
        expect(menu).toBeTruthy();
      });
    });
  });

  describe('CUJ: User can interact with menu using keyboard: Tab to menu, enter to open, esc to close', () => {
    it('should be able to tab to keyboard shortcuts button', async () => {
      const safeZone = fixture.screen.getByTestId('safe-zone-toggle');

      await fixture.events.focus(safeZone);

      await fixture.events.keyboard.down('Shift');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.up('Shift');

      const focusElement = document.activeElement;
      const keyboardShortcutsToggle = fixture.screen.getByTestId(
        'keyboard-shortcuts-toggle'
      );

      expect(focusElement).toEqual(keyboardShortcutsToggle);
    });

    it('should be able to toggle menu open with Enter key', async () => {
      const hiddenMenu = await fixture.screen.queryByTestId(
        'keyboard-shortcuts-menu'
      );
      // Menu should be closed
      expect(hiddenMenu).toBeNull();

      const menuToggle = fixture.screen.getByTestId(
        'keyboard-shortcuts-toggle'
      );

      await fixture.events.focus(menuToggle);
      await fixture.events.keyboard.press('Enter');

      const openMenu = await fixture.screen.queryByTestId(
        'keyboard-shortcuts-menu'
      );

      expect(openMenu).toBeTruthy();
    });

    describe('when menu is open', () => {
      beforeEach(async () => {
        const menuToggle = fixture.screen.getByTestId(
          'keyboard-shortcuts-toggle'
        );

        await fixture.events.focus(menuToggle);
        await fixture.events.keyboard.press('Enter');
      });

      it('should be able to close open menu using Esc key', async () => {
        const openMenu = fixture.screen.getByTestId('keyboard-shortcuts-menu');
        expect(openMenu).toBeTruthy();

        await fixture.events.keyboard.press('Escape');
        // Give time for menu to close
        await fixture.events.sleep(100);

        const closedMenu = await fixture.screen.queryByTestId(
          'keyboard-shortcuts-menu'
        );

        expect(closedMenu).toBeNull();
      });

      it('should place focus on close button when menu opens', () => {
        const openMenu = fixture.screen.getByTestId('keyboard-shortcuts-menu');
        expect(openMenu).toBeTruthy();

        const closeButton = fixture.screen.queryByRole('button', {
          name: /^Close menu$/,
        });

        expect(document.activeElement).toEqual(closeButton);
      });

      it('should be able to close menu with close button', async () => {
        const openMenu = fixture.screen.getByTestId('keyboard-shortcuts-menu');
        expect(openMenu).toBeTruthy();

        const closeButton = fixture.screen.queryByRole('button', {
          name: /^Close menu$/,
        });

        await fixture.events.focus(closeButton);
        await fixture.events.keyboard.press('Enter');
        // Give time for menu to close
        await fixture.events.sleep(100);

        const closedMenu = await fixture.screen.queryByTestId(
          'keyboard-shortcuts-menu'
        );

        expect(closedMenu).toBeNull();
      });
    });
  });
});
