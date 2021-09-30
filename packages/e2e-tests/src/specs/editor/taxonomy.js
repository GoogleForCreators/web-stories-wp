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
  insertStoryTitle,
} from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

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

  // Small trick to ensure we scroll to this panel.
  await taxonomyPanel.focus();
}

async function addCategory(name, parent) {
  await expect(page).toClick('button', { text: 'Add New Category' });
  await expect(page).toFill('input[name="New Category Name"]', name);

  if (parent) {
    await expect(page).toClick('button[aria-label="Parent Category"]');
    await expect(page).toMatchElement('li[role="option"]', { text: parent });
    await expect(page).toClick('li[role="option"]', { text: parent });
    await expect(page).toMatchElement(
      'li[role="option"][aria-selected="true"]',
      { text: parent }
    );

    await expect(page).toMatchElement('button[aria-label="Parent Category"]', {
      text: parent,
    });

    // TODO: Add assertion here to verify the parent was chosen and the dropdown closed.
  }

  await page.keyboard.press('Enter');

  await expect(page).toMatchElement('label', {
    text: name,
  });
}

describe('Taxonomy', () => {
  withExperimentalFeatures(['enableTaxonomiesSupport']);

  // Create some categories before running all tests so that they are available there.
  beforeAll(async () => {
    await createNewStory();
    await goToAndExpandTaxonomyPanel();

    await addCategory('music genres');
    await addCategory('rock', 'music genres');

    // No need to save/publish the story, as the new categories will have been
    // created in the background via the REST API already.
  });

  describe('Administrator', () => {
    it('should be able to add new categories', async () => {
      await createNewStory();
      await insertStoryTitle('Taxonomies - Categories - Admin');

      await goToAndExpandTaxonomyPanel();

      // Add some new categories.
      await addCategory('jazz', 'music genres');
      await addCategory('industrial', 'music genres');
      await addCategory('electro-pop', 'music genres');
      await addCategory('funk', 'music genres');

      await publishStory();

      // Refresh page to verify that the assignments persisted.
      await page.reload();
      await expect(page).toMatchElement('input[placeholder="Add title"]');

      await goToAndExpandTaxonomyPanel();

      // See that category made in another story is available here.
      await expect(page).toMatchElement('input[name="hierarchical_term_rock"]');

      // categories added are checked automatically.
      await expect(page).toMatchElement(
        'input[name="hierarchical_term_funk"][checked]'
      );
      await expect(page).toMatchElement(
        'input[name="hierarchical_term_jazz"][checked]'
      );

      await percySnapshot(page, 'Taxonomies - Categories - Admin');
    });
  });

  it.todo('should be able to add new tags and existing tags');

  describe('Contributor', () => {
    withUser('contributor', 'password');

    it('should be able to manage categories but not add new ones', async () => {
      await createNewStory();
      await insertStoryTitle('Taxonomies - Categories - Contributor');

      await goToAndExpandTaxonomyPanel();

      await expect(page).not.toMatchElement('button', {
        text: 'Add New Category',
      });

      await expect(page).toMatchElement('input[name="hierarchical_term_rock"]');

      await expect(page).toClick('label', { text: 'rock' });

      await expect(page).toClick('button[aria-label="Save draft"]');
      await page.waitForSelector(
        'button[aria-label="Preview"]:not([disabled])'
      );

      // Refresh page to verify that the assignments persisted.
      await page.reload();
      await expect(page).toMatchElement('input[placeholder="Add title"]');
      await expect(page).toMatchElement('a.ab-item', { text: 'View Story' });

      await goToAndExpandTaxonomyPanel();

      await expect(page).toMatchElement(
        'input[name="hierarchical_term_rock"][checked]'
      );

      await percySnapshot(page, 'Taxonomies - Categories - Contributor');
    });

    it.todo(
      'should be able to add tags that already exist but not create new tags'
    );
  });
});
