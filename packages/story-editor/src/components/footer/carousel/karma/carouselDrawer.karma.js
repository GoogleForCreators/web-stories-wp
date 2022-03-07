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
import { Fixture } from '../../../../karma';

const TOGGLE_DURATION = 400;

describe('Carousel Drawer', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    // We add some content to the first page to make the thumbnail more interesting
    const mediaItem = fixture.editor.library.media.item(0);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);

    await waitFor(() => {
      if (fixture.editor.footer.carousel.pages.length === 0) {
        throw new Error('Carousel pages not loaded yet');
      }
    });
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('with a single-page story', () => {
    it('should show correctly', async () => {
      // 1 page
      expect(fixture.editor.footer.carousel.pages.length).toBe(1);

      // Toggle button exists
      expect(fixture.editor.footer.carousel.toggle).toBeTruthy();

      // No scroll buttons
      expect(fixture.editor.footer.carousel.next).toBeFalsy();
      expect(fixture.editor.footer.carousel.previous).toBeFalsy();

      await fixture.snapshot();
    });

    it('should collapse and expand', async () => {
      await fixture.events.click(fixture.editor.footer.carousel.toggle);
      await fixture.events.sleep(TOGGLE_DURATION);

      expect(fixture.editor.footer.carousel.pages.length).toBe(0);
      await fixture.snapshot('Collapsed');

      await fixture.events.click(fixture.editor.footer.carousel.toggle);
      await fixture.events.sleep(TOGGLE_DURATION);

      expect(fixture.editor.footer.carousel.pages.length).toBe(1);
      await fixture.snapshot('Re-expanded');
    });
  });

  describe('with a multi-page story', () => {
    const EXTRA_PAGES = 19;

    beforeEach(() => {
      // Let's add some extra pages
      let pagesToAdd = EXTRA_PAGES;

      const addPage = async () => {
        if (pagesToAdd <= 0) {
          return undefined;
        }

        // Add a page
        await fixture.events.click(fixture.editor.canvas.pageActions.addPage);

        // Add some media to it
        await fixture.events.click(
          fixture.editor.library.media.item(pagesToAdd % 8)
        );

        // Keep going
        pagesToAdd -= 1;
        return addPage();
      };

      return addPage();
    });

    it('should show correctly', async () => {
      // 20 pages
      expect(fixture.editor.footer.carousel.pages.length).toBe(1 + EXTRA_PAGES);

      // Toggle button exists
      expect(fixture.editor.footer.carousel.toggle).toBeTruthy();

      // Both scroll buttons exist
      expect(fixture.editor.footer.carousel.next).toBeTruthy();
      expect(fixture.editor.footer.carousel.previous).toBeTruthy();

      await fixture.snapshot();
    });

    it('should collapse and expand', async () => {
      await fixture.events.click(fixture.editor.footer.carousel.toggle);
      await fixture.events.sleep(TOGGLE_DURATION);

      expect(fixture.editor.footer.carousel.pages.length).toBe(0);
      await fixture.snapshot('Collapsed');

      await fixture.events.click(fixture.editor.footer.carousel.toggle);
      await fixture.events.sleep(TOGGLE_DURATION);

      expect(fixture.editor.footer.carousel.pages.length).toBe(1 + EXTRA_PAGES);
      await fixture.snapshot('Re-expanded');
    });

    it('should have no aXe violations while carousel is expanded', async () => {
      await expectAsync(
        fixture.editor.footer.carousel.node
      ).toHaveNoViolations();
    });

    it('should have no aXe violations while carousel is collapsed', async () => {
      await fixture.events.click(fixture.editor.footer.carousel.toggle);
      await fixture.events.sleep(TOGGLE_DURATION);
      await expectAsync(
        fixture.editor.footer.carousel.node
      ).toHaveNoViolations();
    });
  });
});
