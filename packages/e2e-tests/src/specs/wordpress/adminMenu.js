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

    await expect(page).toMatchElement('#menu-posts-web-story.wp-has-submenu');

    await expect(adminMenuItem).toMatchElement('a', {
      text: 'My Stories',
      visible: false,
    });
    await expect(adminMenuItem).toMatchElement('a', {
      text: 'Explore Templates',
      visible: false,
    });
    await expect(adminMenuItem).toMatchElement('a', {
      text: 'Settings',
      visible: false,
    });
  });

  it('should link to "My Stories"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );

    await expect(page).toMatchElement('#menu-posts-web-story.wp-has-submenu');

    // Hovering should theoretically be enough to make the submenu appear before clicking,
    // but it doesn't work in Firefox, hence first clicking on the top-level menu item.
    await expect(page).toClick('#menu-posts-web-story a', { text: 'Stories' });

    await expect(adminMenuItem).toClick('a', {
      text: 'My Stories',
    });
    await page.waitForNavigation();

    await expect(page).toMatch('My Stories');

    const currentPage = await page.evaluate('location.hash');

    // The dashboard redirects users to templates on first load if they have no stories,
    // hence checking for both just in case.
    // See https://github.com/google/web-stories-wp/pull/7213.
    expect(currentPage).toBeOneOf(['#/', '#/templates-gallery']);
  });

  it('should link to "Explore Templates"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );

    await expect(page).toMatchElement('#menu-posts-web-story.wp-has-submenu');

    // Hovering should theoretically be enough to make the submenu appear before clicking,
    // but it doesn't work in Firefox, hence first clicking on the top-level menu item.
    await expect(page).toClick('#menu-posts-web-story a', { text: 'Stories' });

    await expect(adminMenuItem).toClick('a', {
      text: 'Explore Templates',
    });
    await page.waitForNavigation();

    await expect(page).toMatch('Viewing all');
    await expect(page).toMatch('templates');

    const currentPage = await page.evaluate('location.hash');
    expect(currentPage).toStrictEqual('#/templates-gallery');
  });

  it('should link to "Settings"', async () => {
    await visitAdminPage('index.php');

    const adminMenuItem = await expect(page).toMatchElement(
      '#menu-posts-web-story'
    );

    await expect(page).toMatchElement('#menu-posts-web-story.wp-has-submenu');

    // Hovering should theoretically be enough to make the submenu appear before clicking,
    // but it doesn't work in Firefox, hence first clicking on the top-level menu item.
    await expect(page).toClick('#menu-posts-web-story a', { text: 'Stories' });

    await expect(adminMenuItem).toClick('a', {
      text: 'Settings',
    });
    await page.waitForNavigation();

    await expect(page).toMatch('Google Analytics Tracking ID');

    const currentPage = await page.evaluate('location.hash');
    expect(currentPage).toStrictEqual('#/editor-settings');
  });
});
