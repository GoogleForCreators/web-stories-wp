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

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap.js';

describe('Quick Edit', () => {
  withUser('author', 'password');

  let removeResourceErrorMessage;

  beforeAll(() => {
    // A temporary known issue in AMP. The fix has not landed in production yet.
    // TODO: Remove after 2022-04-30 or so.
    removeResourceErrorMessage = addAllowedErrorMessage(
      'i.isSingleDoc is not a function'
    );
  });

  afterAll(() => {
    removeResourceErrorMessage();
  });

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

    // Wait for update to finish and for the Quick Edit form to close.
    await page.waitForResponse(
      (response) =>
        // eslint-disable-next-line jest/no-conditional-in-test -- False positive
        response.url().includes('admin-ajax.php') && response.status() === 200
    );
    await page.waitForSelector('.spinner', {
      visible: false,
    });

    // After updating, the row for this story in the table will be slowly fading in
    // using opacity set via the style attribute.
    // Once finished, the style attribute will be empty.
    await page.waitForSelector(`#${elmId}[style=""]`);

    // The "Quick Edit" link will be focused after successful editing.
    await expect(page).toMatchElement('button', { text: 'Quick Edit' });

    await expect(page).toMatch('Test quick edit – updated.');

    await Promise.all([
      expect(page).toClick(`#${elmId} a`, { text: 'View' }),
      page.waitForNavigation(),
    ]);

    // When the <amp-story> element exists we know that the output was not mangled.
    await expect(page).toMatchElement('amp-story');
  });
});
