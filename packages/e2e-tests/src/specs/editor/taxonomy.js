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
  publishStory,
} from '@web-stories-wp/e2e-test-utils';

async function goToAndExpandTaxonomyPanel() {
  await expect(page).toClick('li[role="tab"]', { text: 'Document' });
  await expect(page).toMatch('Categories and Tags');

  const taxonomyPanel = await page.$(
    'button[aria-label="Categories and Tags"]'
  );

  const isCollapsed = await page.evaluate(
    (button) => button.getAttribute('aria-expanded') === 'false',
    taxonomyPanel
  );

  if (isCollapsed) {
    await taxonomyPanel.click();
  }
}

async function addCategory(name, parent) {
  await expect(page).toClick('button', { text: 'Add New Category' });
  await page.type('input[name="New Category Name"]', name);

  if (parent) {
    await expect(page).toClick('button', { text: 'Parent Category' });
    await expect(page).toClick('li[role="option"]', { text: parent });
  }

  await page.focus('button[data-testid="submit_add_new_hierarchical_term"]');

  await expect(page).toClick(
    'button[data-testid="submit_add_new_hierarchical_term"]',
    { text: 'Add New Category' }
  );

  // Todo: Investigate why this sometimes takes longer to appear.
  await expect(page).toMatchElement('label', { text: name });
}

describe('Taxonomy', () => {
  withExperimentalFeatures(['enableTaxonomiesSupport']);

  // Create some categories before running all tests so that they are available there.
  beforeAll(async () => {
    await createNewStory();
    await goToAndExpandTaxonomyPanel();

    await addCategory('music genres');
    await addCategory('rock', 'music genres');
  });

  it('should be able to add new categories', async () => {
    await createNewStory();
    await goToAndExpandTaxonomyPanel();
    await addCategory('jazz', 'music genres');
    await addCategory('industrial', 'music genres');
    await addCategory('electro-pop', 'music genres');
    await addCategory('funk', 'music genres');

    await publishStory();

    // Refresh page to verify that the assignments persisted.
    await page.reload();

    await goToAndExpandTaxonomyPanel();

    expect(page).toMatchElement('input[name="hierarchical_term_rock"]');
    expect(page).not.toMatchElement(
      'input[name="hierarchical_term_rock"][checked]'
    );
    expect(page).toMatchElement(
      'input[name="hierarchical_term_jazz"][checked]'
    );
  });

  it.todo('should be able to add new tags and existing tags');

  describe('Contributor User', () => {
    withUser('contributor', 'password');

    it('should be able to manage categories but not add new ones', async () => {
      await createNewStory();
      await goToAndExpandTaxonomyPanel();

      await expect(page).not.toMatchElement('button', {
        text: 'Add New Category',
      });

      await expect(page).toMatchElement('label', { text: 'rock' });
      await expect(page).toClick('label', { text: 'rock' });

      await publishStory();

      // Refresh page to verify that the assignments persisted.
      await page.reload();

      await goToAndExpandTaxonomyPanel();

      await expect(page).not.toMatchElement(
        'input[name="hierarchical_term_rock"][checked]'
      );
    });

    it.todo(
      'should be able to add tags that already exist but not create new tags'
    );
  });
});
