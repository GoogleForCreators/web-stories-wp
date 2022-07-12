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
  takeSnapshot,
  createNewStory,
  publishStory,
  withPlugin,
} from '@web-stories-wp/e2e-test-utils';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Custom Meta Boxes', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Unavailable', () => {
    it('should not display button to toggle meta boxes', async () => {
      await createNewStory();
      await expect(page).toMatchElement('input[placeholder="Add title"]');
      await expect(page).not.toMatchElement(
        '[aria-label="Third-Party Meta Boxes"]'
      );
    });
  });

  describe('Available', () => {
    withPlugin('web-stories-test-plugin-meta-box');

    it('should display meta boxes and save their content', async () => {
      await createNewStory();

      await expect(page).toMatchElement('input[placeholder="Add title"]');
      await page.type('input[placeholder="Add title"]', 'Meta Box Test');

      await expect(page).not.toMatchElement(
        '#web-stories-editor #web_stories_test_meta_box_field',
        {
          visible: false,
        }
      );

      await expect(page).toClick('[aria-label="Third-Party Meta Boxes"]');

      await expect(page).toMatchElement(
        '#web-stories-editor #web_stories_test_meta_box_field',
        {
          visible: false,
        }
      );
      await page.type(
        '#web_stories_test_meta_box_field',
        'Meta Box Test Value'
      );

      await takeSnapshot(page, 'Custom Meta Boxes');

      // Verify that collapsing works via postbox.js from WordPress.

      await expect(page).toClick('button.handlediv[aria-expanded="true"]');
      await expect(page).toMatchElement(
        'button.handlediv[aria-expanded="false"]'
      );

      await expect(page).toClick('button.handlediv[aria-expanded="false"]');
      await expect(page).toMatchElement(
        'button.handlediv[aria-expanded="true"]'
      );

      await publishStory();

      // Refresh page to verify that the text has been persisted.
      await page.reload();
      await expect(page).toMatchElement('input[placeholder="Add title"]');

      await expect(page).not.toMatchElement(
        '#web-stories-editor #web_stories_test_meta_box_field',
        {
          visible: false,
        }
      );

      await expect(page).toClick('[aria-label="Third-Party Meta Boxes"]');

      await expect(page).toMatchElement(
        '#web-stories-editor #web_stories_test_meta_box_field',
        {
          visible: false,
        }
      );

      const metaBoxValue = await page.evaluate(
        () => document.getElementById('web_stories_test_meta_box_field').value
      );
      await expect(metaBoxValue).toBe('Meta Box Test Value');
    });
  });
});
