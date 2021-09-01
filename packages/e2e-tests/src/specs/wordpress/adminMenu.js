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
import { visitAdminPage } from '@web-stories-wp/e2e-test-utils';

describe('Admin Menu', () => {
  it('should contain links to Dashboard sub-pages', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );

    await page.hover('#menu-posts-web-story a');
    await expect(page).toMatchElement('#menu-posts-web-story.opensub');

    await expect(adminMenuItem).toMatchElement('a', {
      text: 'Dashboard',
      visible: true,
    });
    await expect(adminMenuItem).toMatchElement('a', {
      text: 'Explore Templates',
      visible: true,
    });
    await expect(adminMenuItem).toMatchElement('a', {
      text: 'Settings',
      visible: true,
    });
  });

  it('should link to "Dashboard"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );
    await page.hover('#menu-posts-web-story a');
    await expect(page).toMatchElement('#menu-posts-web-story.opensub');

    await expect(adminMenuItem).toClick('a', {
      text: 'Dashboard',
    });
    await page.waitForNavigation();

    // Can be Explore Templates or My Stories depending on if user has 0
    // stories, so just check that we get navigated to the dashboard
    await expect(page).toMatchElement('#web-stories-dashboard');
  });

  it('should link to "Explore Templates"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );
    await page.hover('#menu-posts-web-story a');
    await expect(page).toMatchElement('#menu-posts-web-story.opensub');

    await expect(adminMenuItem).toClick('a', {
      text: 'Explore Templates',
    });
    await page.waitForNavigation();

    await expect(page).toMatch('Viewing all');
    await expect(page).toMatch('templates');
  });

  it('should link to "Settings"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );
    await page.hover('#menu-posts-web-story a');
    await expect(page).toMatchElement('#menu-posts-web-story.opensub');

    await expect(adminMenuItem).toClick('a', {
      text: 'Settings',
    });
    await page.waitForNavigation();

    await expect(page).toMatch('Google Analytics Tracking ID');
  });
});
