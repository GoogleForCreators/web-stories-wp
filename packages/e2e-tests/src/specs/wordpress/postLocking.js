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
import {
  activatePlugin,
  deactivatePlugin,
  visitAdminPage,
} from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import {
  withExperimentalFeatures,
  visitDashboard,
  createNewStory,
  insertStoryTitle,
} from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

const percyCSS = `.dashboard-grid-item-date { display: none; }`;

const storyTitle = 'Test post lock';

describe('Post locking', () => {
  withExperimentalFeatures(['enablePostLocking']);
  beforeAll(async () => {
    await createNewStory();

    await insertStoryTitle(storyTitle);

    // Publish story.
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(page).toClick('button', { text: 'Publish' });

    // Bypass checklist
    await page.waitForSelector('.ReactModal__Content');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(page).toClick('button', {
      text: /Continue to publish/,
    });

    // eslint-disable-next-line jest/no-standalone-expect
    await expect(page).toMatchElement('button', { text: 'Dismiss' });

    await activatePlugin('e2e-tests-post-lock-mock');
  });

  afterAll(async () => {
    await deactivatePlugin('e2e-tests-post-lock-mock');
  });

  it('should be able to open the dashboard with locked story', async () => {
    await visitDashboard();

    await expect(page).toMatch('test_locker is currently editing');

    await percySnapshot(page, 'Stories Dashboard with lock', { percyCSS });
  });

  it('should be able to open the editor with locked story', async () => {
    await visitAdminPage('edit.php', 'post_type=web-story');

    await expect(page).toMatch(storyTitle);

    await Promise.all([
      page.waitForNavigation(),
      expect(page).toClick('a', { text: storyTitle }),
    ]);

    await page.waitForSelector('.ReactModal__Content');

    await expect(page).toMatch('Story is locked');

    await percySnapshot(page, 'Stories editor with lock dialog');
  });
});
