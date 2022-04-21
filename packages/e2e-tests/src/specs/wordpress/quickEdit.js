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
 * External dependencies
 */
import {
  createNewStory,
  publishStory,
  withUser,
  visitAdminPage,
} from '@web-stories-wp/e2e-test-utils';

describe('Quick Edit', () => {
  withUser('author', 'password');

  it('should save story without breaking markup', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    const storyTitle = 'Test quick edit';

    await page.type('input[placeholder="Add title"]', storyTitle);

    await publishStory();

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

    await Promise.all([
      expect(page).toClick(`#${elmId} a`, { text: 'View' }),
      page.waitForNavigation(),
    ]);

    await expect(page).toMatchElement('amp-story');
  });
});
