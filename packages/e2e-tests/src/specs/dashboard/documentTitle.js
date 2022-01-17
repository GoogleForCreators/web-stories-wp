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
import { visitDashboard } from '@web-stories-wp/e2e-test-utils';

describe('Document Title', () => {
  // Disable reason: broken by https://github.com/google/web-stories-wp/pull/7213, needs updating.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should update the document title during navigation', async () => {
    await visitDashboard();

    const dashboardNavigation = await expect(page).toMatchElement(
      '[aria-label="Main dashboard navigation"]'
    );

    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await expect(page.title()).resolves.toStartWith('Dashboard');

    await expect(dashboardNavigation).toClick('a', {
      text: 'Explore Templates',
    });
    await page.waitForTimeout(100);

    await expect(page).toMatch('Viewing all');
    await expect(page).toMatch('templates');
    await expect(page.title()).resolves.toStartWith('Explore Templates');

    const firstTemplate = await expect(page).toMatchElement(
      '[data-testid="template-grid-item-1"]'
    );
    await expect(firstTemplate).toClick('a', { text: 'See details' });
    await page.waitForTimeout(100);
    await expect(page.title()).resolves.toStartWith('Template: Beauty');

    await expect(page).toClick('a[aria-label="Go to Explore Templates"]');
    await page.waitForTimeout(100);
    await expect(page).toMatch('Viewing all');
    await expect(page).toMatch('templates');
    await expect(page.title()).resolves.toStartWith('Explore Templates');
  });
});
