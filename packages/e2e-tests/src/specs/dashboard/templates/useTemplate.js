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
import { percySnapshot } from '@percy/puppeteer';
import { visitDashboard } from '@web-stories-wp/e2e-test-utils';

const percyCSS = `.dashboard-media-element { background-color: transparent !important; }`;

describe('Template', () => {
  it('should be able use existing template for new story', async () => {
    await visitDashboard();

    const dashboardNavigation = await expect(page).toMatchElement(
      '[aria-label="Main dashboard navigation"]'
    );

    await expect(dashboardNavigation).toClick('a', {
      text: 'Explore Templates',
    });

    await expect(page).toMatch('Viewing all templates');

    const firstTemplate = await expect(page).toMatchElement(
      '[data-testid="template-grid-item-1"]'
    );

    await percySnapshot(page, 'Explore Templates', { percyCSS });

    await expect(firstTemplate).toClick('button', { text: 'Use template' });
    await page.waitForNavigation();

    // Wait for media elements to load before continuing.
    await page.waitForSelector('[data-testid="mediaElement-image"]');

    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await expect(page).toMatchElement('[data-element-id]');

    await percySnapshot(page, 'Story From Template');
  });
});
