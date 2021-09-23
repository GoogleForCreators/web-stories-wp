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
  withExperimentalFeatures,
  withUser,
} from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

describe.only('Taxonomy', () => {
  //   withExperimentalFeatures(['enableTaxonomiesSupport']);

  const addChildCategory = async ({ parent, child }) => {
    await expect(page).toClick('button#expand_add_new_hierarchical_term');
    await page.type('input[name="New Category Name"]', child);
    await expect(page).toClick('button[aria-label="Parent Category"]');
    await expect(page).toClick('li[role="option"]', { text: parent });
    await expect(page).toClick('#submit_add_new_hierarchical_term');
  };

  beforeEach(async () => {
    await createNewStory();
  });

  it('should be able to add new categories', async () => {
    await expect(page).toClick('li[role="tab"]', { text: 'Document' });
    await expect(page).toMatch('Categories and Tags');

    // Toggle the panel which is collapsed by default.
    await expect(page).toClick('[aria-label="Categories and Tags"]');
    await page.waitForSelector('button#expand_add_new_hierarchical_term');
    await expect(page).toClick('button#expand_add_new_hierarchical_term');
    await page.waitForSelector('input[name="New Category Name"]');
    // add a parent category
    await page.type('input[name="New Category Name"]', 'music genres');
    await expect(page).toClick('#submit_add_new_hierarchical_term');

    // add some child categories
    await addChildCategory({ parent: 'music genres', child: 'rock' });
    await addChildCategory({ parent: 'music genres', child: 'jazz' });
    await addChildCategory({ parent: 'music genres', child: 'industrial' });
    await addChildCategory({ parent: 'music genres', child: 'electro-pop' });
    await addChildCategory({ parent: 'music genres', child: 'funk' });

    await expect(page).toClick('input[name="rock"]');

    await percySnapshot(page, 'Admin Taxonomy');
  });

  describe('Contributor User', () => {
    withUser('contributor', 'password');
    it('should be able to manage categories but not add new ones', async () => {
      await expect(page).toClick('li[role="tab"]', { text: 'Document' });
      await expect(page).toMatch('Categories and Tags');

      await page.waitForSelector('input[name="rock"]');
      await expect(page).toClick('input[name="rock"]');

      await expect(page).not.toMatch('Add New Category');

      await percySnapshot(page, 'Contributor Taxonomy');
    });
  });
});
