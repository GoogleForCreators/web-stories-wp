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
import percySnapshot from '@percy/puppeteer';
import { visitDashboard } from '@web-stories-wp/e2e-test-utils';

describe('Template', () => {
  it('should be able to use existing template for new story', async () => {
    await visitDashboard();

    const dashboardNavigation = await expect(page).toMatchElement(
      '[aria-label="Main dashboard navigation"]'
    );

    await expect(dashboardNavigation).toClick('a', {
      text: 'Explore Templates',
    });
    await page.waitForTimeout(100);

    await expect(page).toMatch('Viewing all');
    await expect(page).toMatch('templates');

    const firstTemplate = await expect(page).toMatchElement(
      '[data-testid="template-grid-item-1"]'
    );

    await percySnapshot(page, 'Explore Templates');

    await expect(firstTemplate).toClick('a', { text: 'See details' });
    // Get count of template colors to compare to 'saved colors' in the editor.
    const templateColorCount = await page.evaluate(() => {
      return document.querySelectorAll(
        'div[data-testid="detail-template-color"]'
      ).length;
    });

    await expect(page).toClick('button', { text: 'Use template' });
    await page.waitForNavigation();

    // Wait for media elements to load before continuing.
    await page.waitForSelector('[data-testid="mediaElement-image"]');
    await expect(page).toMatch('Layers');
    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await expect(page).toMatchElement('[data-element-id]');

    await percySnapshot(page, 'Story From Template');

    // Select a text layer so 'Saved Colors' panel is present
    await expect(page).toClick('button[data-testid="layer-option"]', {
      text: 'Fresh',
    });

    // Toggle open 'Saved Colors'
    await expect(page).toClick('button', { text: 'Saved Colors' });

    // Get all saved story colors and subtract 1 button for adding other colors
    const savedStoryColorCount = await page.evaluate(() => {
      return (
        document.querySelectorAll(
          'div[data-testid="saved-story-colors"] button'
        ).length - 1
      );
    });

    expect(savedStoryColorCount).toStrictEqual(templateColorCount);
  });
});
