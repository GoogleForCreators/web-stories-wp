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
 * WordPress dependencies
 */
import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe('Admin Menu', () => {
  it('should contain links to Dashboard sub-pages', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );

    await page.hover('#menu-posts-web-story a');
    await expect(page).toMatchElement('#menu-posts-web-story.opensub');

    await expect(adminMenuItem).toMatchElement('a', {
      text: 'My Stories',
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

  it('should link to "My Stories"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );
    await page.hover('#menu-posts-web-story a');
    await expect(page).toMatchElement('#menu-posts-web-story.opensub');

    await expect(adminMenuItem).toClick('a', {
      text: 'My Stories',
    });
    await page.waitForNavigation();

    await expect(page).toMatch('My Stories');
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

    await expect(page).toMatch('Viewing all templates');
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
