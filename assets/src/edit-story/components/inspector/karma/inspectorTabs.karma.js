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

describe('Inspector Tabs integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('keyboard navigation', () => {
    it('should return focus to current tab when pressing mod+alt+3', async () => {
      const { documentTab } = fixture.editor.inspector;

      // Click document tab
      await fixture.events.mouse.clickOn(documentTab);
      await waitFor(() => fixture.editor.inspector.documentPanel);
      expect(documentTab).toHaveFocus();

      // Click elsewhere
      await fixture.events.click(fixture.editor.canvas.header.title);
      expect(documentTab).not.toHaveFocus();

      // Return focus with shortcut
      await fixture.events.keyboard.shortcut('mod+alt+3');
      expect(documentTab).toHaveFocus();
      await fixture.snapshot('document tab has focus');
    });
  });

  describe('CUJ: Creator can View and Modify Document: Author', () => {
    it('should allow choosing author', async () => {
      const { documentTab } = fixture.editor.inspector;

      // Click document tab
      await fixture.events.mouse.clickOn(documentTab);
      await waitFor(() => fixture.editor.inspector.documentPanel);
      await waitFor(() =>
        expect(fixture.editor.inspector.documentPanel.author.textContent).toBe(
          'John Doe'
        )
      );
      fixture.events.click(fixture.editor.inspector.documentPanel.author);
      // Ensure the debounced callback has taken effect.
      await fixture.events.sleep(300);

      const options = fixture.screen
        .getByRole('listbox', {
          name: /Option List Selector/,
        })
        .querySelectorAll('li[role="option"]');
      expect(options.length).toBe(2);
      fixture.events.click(options[1]);

      await fixture.events.sleep(300);
      await waitFor(() =>
        expect(fixture.editor.inspector.documentPanel.author.textContent).toBe(
          'Jane Doe'
        )
      );
    });

    it('should allow searching authors', async () => {
      const { documentTab } = fixture.editor.inspector;

      // Click document tab
      await fixture.events.mouse.clickOn(documentTab);
      await waitFor(() =>
        expect(fixture.editor.inspector.documentPanel.author.textContent).toBe(
          'John Doe'
        )
      );
      fixture.events.click(fixture.editor.inspector.documentPanel.author);
      // Ensure the debounced callback has taken effect.
      await fixture.events.sleep(300);
      await fixture.events.keyboard.type('Jane');

      const options = fixture.screen
        .getByRole('listbox', {
          name: /Option List Selector/,
        })
        .querySelectorAll('li[role="option"]');

      expect(options.length).toBe(1);
      expect(options[0].textContent).toBe('Jane Doe');
    });
  });

  describe('Checklist Panel', function () {
    it('should show high priority items open in checklist by default', async () => {
      const { checklistTab } = fixture.editor.inspector;

      await fixture.events.mouse.clickOn(checklistTab);

      await waitFor(() => {
        expect(
          fixture.editor.inspector.checklistPanel.node.querySelector(
            '[class^="checklistTab__Row-"]'
          )
        ).not.toBeNull();
      });
    });
  });
});
