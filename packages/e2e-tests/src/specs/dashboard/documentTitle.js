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
  it('should update the document title during navigation', async () => {
    await visitDashboard();

    const dashboardNavigation = await expect(page).toMatchElement(
      '[aria-label="Main dashboard navigation"]'
    );

    // First visit to Dashboard my redirect to Explore Templates.
    // See https://github.com/googleforcreators/web-stories-wp/pull/7213, needs updating.
    // Work around this by explicitly clicking on dashboard again.

    await expect(dashboardNavigation).toClick('a', {
      text: 'Dashboard',
    });

    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await expect(page.title()).resolves.toStartWith('Dashboard');

    await expect(dashboardNavigation).toClick('a', {
      text: 'Explore Templates',
    });

    await expect(page).toMatchElement('h2', { text: 'Explore Templates' });
    await expect(page.title()).resolves.toStartWith('Explore Templates');

    await expect(dashboardNavigation).toClick('a', {
      text: 'Settings',
    });

    await expect(page).toMatchElement('h2', { text: 'Settings' });
    await expect(page.title()).resolves.toStartWith('Settings');
  });
});
