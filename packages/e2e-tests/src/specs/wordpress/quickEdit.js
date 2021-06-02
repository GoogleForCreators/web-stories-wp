/*
 * Copyright 2021 Google LLC
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
  loginUser,
  switchUserToAdmin,
  visitAdminPage,
} from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import { createNewStory } from '@web-stories-wp/e2e-test-utils';

describe('Quick Edit', () => {
  beforeAll(async () => {
    await loginUser('author', 'password');
  });

  afterAll(async () => {
    await switchUserToAdmin();
  });

  it('should save story without breaking markup', async () => {
    await createNewStory();
    await expect(page).toMatch('Howdy, author');

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    const storyTitle = 'Test quick edit';

    await page.type('input[placeholder="Add title"]', storyTitle);

    // Publish story.
    await expect(page).toClick('button', { text: 'Publish' });
    // Bypass checklist
    await page.waitForSelector('.ReactModal__Content');
    await expect(page).toClick('button', {
      text: /Continue to publish/,
    });
    await expect(page).toMatchElement('button', { text: 'Dismiss' });

    await visitAdminPage('edit.php', 'post_type=web-story');

    await expect(page).toMatch(storyTitle);

    // Make row actions appear.
    const elmId = await page.evaluate((storytitle) => {
      return document
        .querySelector(`a[aria-label="“${storytitle}” (Edit)"]`)
        .closest('tr').id;
    }, storyTitle);

    await page.hover(`#${elmId}`);

    await expect(page).toClick('button', { text: 'Quick Edit' });

    await page.type('input[name="post_title"]', ' - updated.');
    await expect(page).toClick('button', { text: 'Update' });

    const storyTitleNew = 'Test quick edit – updated.';

    await expect(page).toMatch(storyTitleNew);

    await page.hover(`#${elmId}`);

    await Promise.all([
      expect(page).toClick(`#${elmId} a`, { text: 'View' }),
      page.waitForNavigation(),
    ]);

    await expect(page).toMatchElement('amp-story');
  });
});
