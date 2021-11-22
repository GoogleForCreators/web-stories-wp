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
import { waitFor } from '@testing-library/react';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';

describe('LibraryTabs integration', () => {
  let fixture;
  let libraryLayout;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    libraryLayout = fixture.container.querySelector(
      '[data-testid="libraryLayout"]'
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`, true);
      const textTab = fixture.container.querySelector('#library-tab-media');
      await fixture.events.focus(textTab);
    });

    async function expectActivePaneToBe(paneId) {
      const expandedPane = libraryLayout.querySelector(
        '[aria-expanded="true"]'
      );
      const expectedPane = fixture.container.querySelector(
        `#library-pane-${paneId}`
      );
      expect(expandedPane).toEqual(expectedPane);
      await fixture.waitOnScreen(expectedPane);
    }

    function expectFocusedTabToBe(tabId) {
      const focusedTab = libraryLayout.querySelector('[role="tab"]:focus');
      const expectedTab = fixture.container.querySelector(
        `#library-tab-${tabId}`
      );
      expect(focusedTab).toEqual(expectedTab);
    }

    it('should be on the media tab', async () => {
      await expectActivePaneToBe('media');
    });

    it('should focus tabs on navigation keys and change tabs with space/enter', async () => {
      // When pressing right key from media, expect media3p to have focus but pane unchanged
      await fixture.events.keyboard.press('ArrowRight');
      expectFocusedTabToBe('media3p');
      await expectActivePaneToBe('media');

      // Then press "enter" and expect media3p to be active pane
      await fixture.events.keyboard.press('Enter');
      await expectActivePaneToBe('media3p');

      // Press "end" to move focus to the last tab, "templates"
      await fixture.events.keyboard.press('End');
      expectFocusedTabToBe('pageTemplates');
      await expectActivePaneToBe('media3p');

      // Then press "space" to make templates active
      await fixture.events.keyboard.press('Space');
      await expectActivePaneToBe('pageTemplates');

      // Then press "left" to focus shapes tab
      await fixture.events.keyboard.press('ArrowLeft');
      expectFocusedTabToBe('shapes');
      await expectActivePaneToBe('pageTemplates');

      // Then press "home" to focus media tab
      await fixture.events.keyboard.press('Home');
      expectFocusedTabToBe('media');
      await expectActivePaneToBe('pageTemplates');

      // Then press "enter" and expect media to be active pane
      await fixture.events.keyboard.press('Enter');
      await expectActivePaneToBe('media');
    });

    it('should return focus to current tab when pressing mod+alt+1', async () => {
      const { textTab } = fixture.editor.library;

      // Click tab
      await fixture.events.mouse.clickOn(textTab, 5, 5);
      await waitFor(() => fixture.editor.library.text);
      expect(textTab).toHaveFocus();

      // Click elsewhere
      await fixture.events.click(fixture.editor.canvas.header.title);
      expect(textTab).not.toHaveFocus();

      // Return focus with shortcut
      await fixture.events.keyboard.shortcut('mod+alt+1');
      expect(textTab).toHaveFocus();
      await fixture.snapshot('text tab has focus');
    });
  });
});
