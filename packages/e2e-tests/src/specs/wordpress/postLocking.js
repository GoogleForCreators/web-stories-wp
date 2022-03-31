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
import {
  visitDashboard,
  createNewStory,
  insertStoryTitle,
  publishStory,
  editStoryWithTitle,
  activatePlugin,
  deactivatePlugin,
  takeSnapshot,
} from '@web-stories-wp/e2e-test-utils';

const percyCSS = `.dashboard-grid-item-date { display: none; }`;

const storyTitle = 'Test post lock';

describe('Post Locking', () => {
  beforeAll(async () => {
    await createNewStory();

    await insertStoryTitle(storyTitle);

    await publishStory();

    // Not using the withPlugin() here because this plugin
    // needs to be activated *after* creating this story.
    await activatePlugin('e2e-tests-post-lock-mock');
  });

  afterAll(async () => {
    await deactivatePlugin('e2e-tests-post-lock-mock');
  });

  it('should be able to open the dashboard with locked story', async () => {
    await visitDashboard();

    await expect(page).toMatch('Test post lock');
    await page.hover('[data-test-id="lock-user-avatar"]');
    await expect(page).toMatch('test_locker is currently editing this story');
    await takeSnapshot(page, 'Stories Dashboard with lock', { percyCSS });
  });

  it('should be able to open the editor with locked story', async () => {
    await editStoryWithTitle(storyTitle);

    await page.waitForSelector('.ReactModal__Content');

    await expect(page).toMatch('Story is locked');

    await takeSnapshot(page, 'Stories editor with lock dialog');
  });
});
