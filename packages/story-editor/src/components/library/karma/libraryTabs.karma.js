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
} from '@googleforcreators/design-system';

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

  describe('library Tabs should have no aXe accessibility violations', () => {
    /* eslint-disable-next-line jasmine/no-disabled-tests --
     * aXe violations
     * TODO: https://github.com/googleforcreators/web-stories-wp/issues/9954
     */
    xit('Local Media Panel should have no aXe violations', async () => {
      const { mediaTab } = fixture.editor.library;
      expect(mediaTab).toBeDefined();
      await fixture.events.click(mediaTab);
      await expectAsync(mediaTab).toHaveNoViolations();
      await expectAsync(fixture.editor.library.media).toHaveNoViolations();
    });

    it('Media 3p Panel should have no aXe violations', async () => {
      // Set local storage to have accepted third party media terms to avoid interruption with dialog
      localStore.setItemByKey(LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P, true);
      const { media3pTab } = fixture.editor.library;
      expect(media3pTab).toBeDefined();
      // navigate to third party media panel
      await fixture.events.click(media3pTab);
      // check tab for violations
      await expectAsync(media3pTab).toHaveNoViolations();
      // check panel node for violations
      await expectAsync(
        fixture.editor.library.media3p.node
      ).toHaveNoViolations();
    });

    it('Text Panel should have no aXe violations', async () => {
      const { textTab } = fixture.editor.library;
      expect(textTab).toBeDefined();
      // navigate to text panel
      await fixture.events.click(textTab);
      await expectAsync(textTab).toHaveNoViolations();

      // check panel for violations
      await expectAsync(fixture.editor.library.text.node).toHaveNoViolations();
    });

    it('Shapes Panel should have no aXe violations', async () => {
      const { shapesTab } = fixture.editor.library;
      expect(shapesTab).toBeDefined();
      // navigate to shapes panel
      await fixture.events.click(shapesTab);
      // check tab for violations
      await expectAsync(shapesTab).toHaveNoViolations();
      // Just grab the shapes library in the shapes pane
      // there's some issues with clip path id repetition that
      // are giving false positives to aXe tests in stickers.
      const shapesLibrary = fixture.container.querySelector(
        '[data-testid="shapes-library-pane"]'
      );
      expect(shapesLibrary).toBeDefined();
      await expectAsync(shapesLibrary).toHaveNoViolations();
    });

    it('Page Templates Panel should have no aXe violations', async () => {
      const { pageTemplatesTab } = fixture.editor.library;
      expect(pageTemplatesTab).toBeDefined();
      // navigate to pageTemplates panel
      await fixture.events.click(pageTemplatesTab);
      // check tab for violations
      await expectAsync(pageTemplatesTab).toHaveNoViolations();

      // check pane for violations
      await expectAsync(
        fixture.editor.library.pageTemplatesPane.node
      ).toHaveNoViolations();
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      localStore.setItemByKey(LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P, true);
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
      await waitFor(() => {
        if (!fixture.editor.library.text) {
          throw new Error('text tab not ready');
        }
        expect(fixture.editor.library.text).toBeTruthy();
      });
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
