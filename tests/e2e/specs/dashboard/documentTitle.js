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
 * Internal dependencies
 */
import { visitDashboard } from '../../utils';

describe('Document Title', () => {
  it('should update the document title during navigation', async () => {
    await visitDashboard();

    const dashboardNavigation = await expect(page).toMatchElement(
      '[aria-label="Main dashboard navigation"]'
    );

    await expect(page).toMatch('My Stories');
    await expect(await page.title()).toStartWith('My Stories');

    await expect(dashboardNavigation).toClick('a', {
      text: 'Explore Templates',
    });

    await expect(page).toMatch('Viewing all templates');
    await expect(await page.title()).toStartWith('Explore Templates');

    const firstTemplate = await expect(page).toMatchElement(
      '[data-testid="template-grid-item-1"]'
    );
    await expect(firstTemplate).toClick('a', { text: 'See details' });
    await expect(await page.title()).toStartWith('Template Details');

    await expect(page).toClick('a', { text: 'Close' });

    await expect(page).toMatch('Viewing all templates');
    await expect(await page.title()).toStartWith('Explore Templates');
  });
});
