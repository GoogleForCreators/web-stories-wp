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
import { createNewStory, withUser } from '@web-stories-wp/e2e-test-utils';

describe('Taxonomy', () => {
  it('should be able to add new categories', async () => {
    await createNewStory();
    await expect(page).toClick('li[role="tab"]', { text: 'Document' });
    await expect(page).toMatch('Categories and Tags');

    // Toggle the panel which is collapsed by default.
    await expect(page).toClick('[aria-label="Categories and Tags"]');

    await expect(page).toClick('#expand_add_new_hierarchical_term');
    await page.waitForSelector('input[name="New Category Name"]');
    // add a parent category
    await page.type('input[name="New Category Name"]', 'genres');
    await expect(page).toClick('#submit_add_new_hierarchical_term');

    // add a child category
    // await expect(page).toClick('#expand_add_new_hierarchical_term');
    // await page.type('input[name="New Category Name"]', 'electronic');

    //   await expect(page).toClick('button[aria-label="Parent Category"]');
    // TODO: dropdown won't target
    //   await page.waitForSelector('li[name="genre"]');
    //   await expect(page).toClick('li[name="genre"]');
    //   await expect(page).toClick('#submit_add_new_hierarchical_term');

    await page.waitForSelector('input[name="electronic"]');
    await expect(page).toClick('input[name="electronic"]');
  });

  describe('Contributor User', () => {
    withUser('contributor', 'password');
    it('should be able to manage categories but not add new ones', async () => {
      await createNewStory();
      await expect(page).toClick('li[role="tab"]', { text: 'Document' });
      await expect(page).toMatch('Categories and Tags');

      await page.waitForSelector('input[name="electronic"]');
      await expect(page).toClick('input[name="electronic"]');
    });
  });
});
