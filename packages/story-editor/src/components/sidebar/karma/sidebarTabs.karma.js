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

describe('Sidebar Tabs integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Sidebar Tabs aXe tests', () => {
    it('should have no aXe violations', async () => {
      const { documentTab } = fixture.editor.sidebar;

      // Click document tab
      await fixture.events.click(documentTab);
      // actual color contrast of toggle is 7.1 however it's set on a child span absolutely positioned so aXe doesn't pick it up
      await expectAsync(
        fixture.editor.sidebar.documentPanel.node
      ).toHaveNoViolations();
    });
  });

  describe('keyboard navigation', () => {
    it('should return focus to current tab when pressing mod+alt+3', async () => {
      const { documentTab } = fixture.editor.sidebar;

      // Click document tab
      await fixture.events.click(documentTab);
      await waitFor(() => {
        if (!fixture.editor.sidebar.documentPanel) {
          throw new Error('panel not ready');
        }
        expect(fixture.editor.sidebar.documentPanel).toBeTruthy();
      });

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
});
