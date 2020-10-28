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

describe('Admin Menu', () => {
  it('should sync the WP nav with the dashboard nav', async () => {
    await visitDashboard();

    // Initial visit to `/` makes `My Stories` link current in WP
    await page.hover('#menu-posts-web-story');
    await expect(await page.$('#menu-posts-web-story .current a')).toMatch(
      'My Stories'
    );
    await page.hover('[aria-label="Main dashboard navigation"]');

    // Navigating through the application to a new page syncs the WP current page in Nav
    await expect(page).toClick('[aria-label="Main dashboard navigation"] a', {
      text: 'Explore Templates',
    });
    await page.hover('#menu-posts-web-story');
    await expect(await page.$('#menu-posts-web-story .current a')).toMatch(
      'Explore Templates'
    );
    await page.hover('[aria-label="Main dashboard navigation"]');

    // Navigating through WP to a new page syncs the WP current page in Nav
    await page.hover('#menu-posts-web-story');
    await expect(page).toClick('#menu-posts-web-story a', {
      text: 'Settings',
    });
    await expect(await page.$('#menu-posts-web-story .current a')).toMatch(
      'Settings'
    );
  });
});
