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

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import localStore, { LOCAL_STORAGE_PREFIX } from '../../../utils/localStore';

describe('LibraryTabs integration', () => {
  let fixture;
  let libraryLayout;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    libraryLayout = fixture.container.querySelector(
      '[data-testid="libraryLayout"]'
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('keyboad navigation', () => {
    beforeEach(async () => {
      localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`, true);
      const textTab = fixture.container.querySelector('#library-tab-media');
      await fixture.events.focus(textTab);
    });

    function getExpandedPanes() {
      return Array.from(
        libraryLayout.querySelectorAll('[aria-expanded="true"]')
      );
    }

    it('should be on the media tab', async () => {
      const mediaPane = fixture.container.querySelector('#library-pane-media');
      expect(getExpandedPanes()).toEqual([mediaPane]);
      await fixture.waitOnScreen(mediaPane);
      await fixture.snapshot();
    });

    it('should switch tabs on left and right keys', async () => {
      // Next: media3p pane.
      await fixture.events.keyboard.press('ArrowRight');
      // @todo: what's the best way to confirm switching of a tab?
      const textPane = fixture.container.querySelector('#library-pane-media3p');
      expect(getExpandedPanes()).toEqual([textPane]);
      await fixture.waitOnScreen(textPane);
      await fixture.snapshot('on text pane');

      // Next: text pane.
      await fixture.events.keyboard.press('ArrowRight');
      const shapesPane = fixture.container.querySelector('#library-pane-text');
      expect(getExpandedPanes()).toEqual([shapesPane]);
      await fixture.waitOnScreen(shapesPane);
      await fixture.snapshot('on text pane');

      // Back: media3p pane.
      await fixture.events.keyboard.press('ArrowLeft');
      expect(getExpandedPanes()).toEqual([textPane]);
      await fixture.waitOnScreen(
        fixture.container.querySelector('#library-pane-media3p')
      );

      // Back: media pane.
      await fixture.events.keyboard.press('ArrowLeft');
      const mediaPane = fixture.container.querySelector('#library-pane-media');
      expect(getExpandedPanes()).toEqual([mediaPane]);
      await fixture.waitOnScreen(mediaPane);
    });

    it('should return focus to current tab when pressing mod+alt+1', async () => {
      const { textTab } = fixture.editor.library;

      // Click tab
      await fixture.events.mouse.clickOn(textTab);
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
