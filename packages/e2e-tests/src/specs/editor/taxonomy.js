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
  withExperimentalFeatures,
  withUser,
} from '@web-stories-wp/e2e-test-utils';

describe('Taxonomy', () => {
  withExperimentalFeatures(['enableTaxonomiesSupport']);

  const goToAndExpandTaxonomyPanel = async () => {
    await expect(page).toClick('li[role="tab"]', { text: 'Document' });
    await expect(page).toMatch('Categories and Tags');

    const taxonomyPanel = await page.$(
      'button[aria-label="Categories and Tags"]'
    );

    const isCollapsed = await page.evaluate(
      (button) => button.getAttribute('aria-expanded') == 'false',
      taxonomyPanel
    );
    if (isCollapsed) {
      await taxonomyPanel.click();
    }
  };

  const addChildCategory = async ({ parent, child }) => {
    await expect(page).toClick(
      'button[data-testid="expand_add_new_hierarchical_term"]'
    );
    await page.type('input[name="New Category Name"]', child);
    await expect(page).toClick('button[aria-label="Parent Category"]');
    await expect(page).toClick('li[role="option"]', { text: parent });
    await expect(page).toClick(
      'button[data-testid="submit_add_new_hierarchical_term"]'
    );
  };

  it('should be able to add new categories', async () => {
    await createNewStory();
    await goToAndExpandTaxonomyPanel();

    await expect(page).toMatch('Add New Category');
    await expect(page).toClick(
      'button[data-testid="expand_add_new_hierarchical_term"]'
    );
    await page.waitForSelector('input[name="New Category Name"]');
    // add a parent category
    await page.type('input[name="New Category Name"]', 'music genres');
    await expect(page).toClick(
      'button[data-testid="submit_add_new_hierarchical_term"]'
    );

    // add some child categories
    await addChildCategory({ parent: 'music genres', child: 'rock' });
    await addChildCategory({ parent: 'music genres', child: 'jazz' });
    await addChildCategory({ parent: 'music genres', child: 'industrial' });
    await addChildCategory({ parent: 'music genres', child: 'electro-pop' });
    await addChildCategory({ parent: 'music genres', child: 'funk' });
    // Save terms so that they are available to contributor
    await publishStory();
  });

  describe('Contributor User', () => {
    withUser('contributor', 'password');
    // right now enabling the taxonomy experiment is needed to make this test at all worthwhile
    // TODO https://github.com/google/web-stories-wp/issues/8833
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should be able to manage categories but not add new ones', async () => {
      await goToAndExpandTaxonomyPanel();
      await page.waitForSelector('input[name="rock"]');
      await expect(page).toClick('input[name="rock"]');

      const addNewCategoryButton = await page.$(
        'button[aria-label="Add New Category"]'
      );
      expect(addNewCategoryButton).toBeNull();
    });
  });
});
