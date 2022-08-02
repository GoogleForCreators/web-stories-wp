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
  withUser,
  publishStory,
  insertStoryTitle,
  withPlugin,
} from '@web-stories-wp/e2e-test-utils';

async function goToAndExpandTaxonomyPanel() {
  await expect(page).toClick('li[role="tab"]', { text: 'Document' });
  await expect(page).toMatch('Taxonomies');

  const taxonomyPanel = await page.$('button[aria-label="Taxonomies"]');

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

  if (parent) {
    await expect(page).toClick('button[aria-label="Parent Category"]');
    await page.waitForSelector('li[role="option"]');
    await expect(page).toMatchElement('li[role="option"]', { text: parent });

    await expect(page).toClick('li[role="option"]', { text: parent });
    await expect(page).toMatchElement('button[aria-label="Parent Category"]', {
      text: parent,
    });
  }

  await expect(page).toFill('input[name="New Category Name"]', name);
  await page.keyboard.press('Enter');
  await expect(page).toMatchElement('label', {
    text: name,
  });
}

async function addTag(name) {
  // get number of input children before we add the token
  // so we have a metric to see when the new token renders
  const numChildren = await page.$eval(
    '#web_story_tag-input',
    (el) => el.parentNode.children.length
  );

  // Add the new token
  await page.focus('input#web_story_tag-input');
  await page.type('input#web_story_tag-input', name);
  await page.keyboard.press('Enter');

  // wait for token to render
  await page.waitForFunction(
    (originalNumChildren) =>
      document.getElementById('web_story_tag-input').parentNode.children
        .length > originalNumChildren,
    {},
    numChildren
  );

  const tokenNames = await page.$$eval(
    '[data-testid="flat-term-token"]',
    (nodes) => Array.from(nodes, (node) => node.innerText)
  );

  await expect(tokenNames).toContainValue(name);
}

describe('taxonomy', () => {
  // Create some categories and tags before running all tests so that they are available there.
  beforeAll(async () => {
    await createNewStory();
    await goToAndExpandTaxonomyPanel();

    await Promise.all([
      await addCategory('music genres'),
      await addCategory('rock', 'music genres'),

      await addTag('adventure'),
      await addTag('sci-fi'),
      await addTag('comedy'),
    ]);

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
      await page.reload({ waitUntil: 'networkidle2' });
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
    });

    it('should be able to add new tags and existing tags', async () => {
      await createNewStory();
      await insertStoryTitle('Taxonomies - Tags - Admin');

      await goToAndExpandTaxonomyPanel();

      // Add some new tags.
      await addTag('noir');
      await addTag('action');

      // Find an existing tag and select it.
      await page.focus('input#web_story_tag-input');
      await page.type('input#web_story_tag-input', 'adven');
      await page.waitForSelector('ul[data-testid="suggested_terms_list"]');
      await expect(page).toMatchElement(
        'ul[data-testid="suggested_terms_list"]'
      );
      await expect(page).toMatchElement('li[role="option"]', {
        text: 'adventure',
      });
      await expect(page).toClick('li[role="option"]', { text: 'adventure' });
      await page.focus('input#web_story_tag-input');

      const tokens = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('[data-testid="flat-term-token"]'),
          (element) => element.innerText
        )
      );

      await expect(tokens).toStrictEqual(
        expect.arrayContaining(['noir', 'action', 'adventure'])
      );

      await publishStory();

      // Refresh page to verify that the assignments persisted.
      await page.reload();
      await expect(page).toMatchElement('input[placeholder="Add title"]');

      await goToAndExpandTaxonomyPanel();

      // See that added tags persist.
      const tokens2 = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('[data-testid="flat-term-token"]'),
          (element) => element.innerText
        )
      );

      await expect(tokens2).toStrictEqual(
        expect.arrayContaining(['noir', 'action', 'adventure'])
      );
    });
  });

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
    });

    it('should be able to add new tags and existing tags', async () => {
      await createNewStory();
      await insertStoryTitle('Taxonomies - Tags - Contributor');

      await goToAndExpandTaxonomyPanel();

      // Add some new tags that won't stick on refresh
      await addTag('rom-com');
      await addTag('creature feature');

      // Find an existing tag and select it.
      await page.focus('input#web_story_tag-input');
      await page.type('input#web_story_tag-input', 'adven');
      await page.waitForSelector('ul[data-testid="suggested_terms_list"]');
      await expect(page).toMatchElement(
        'ul[data-testid="suggested_terms_list"]'
      );
      await expect(page).toMatchElement('li[role="option"]', {
        text: 'adventure',
      });
      await expect(page).toClick('li[role="option"]', { text: 'adventure' });
      await page.focus('input#web_story_tag-input');

      const tokens = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('[data-testid="flat-term-token"]'),
          (element) => element.innerText
        )
      );

      await expect(tokens).toStrictEqual(
        expect.arrayContaining(['rom-com', 'creature feature', 'adventure'])
      );

      await expect(page).toClick('button[aria-label="Save draft"]');
      await page.waitForSelector(
        'button[aria-label="Preview"]:not([disabled])'
      );

      // Refresh page to verify that the assignments persisted.
      await page.reload();
      await expect(page).toMatchElement('input[placeholder="Add title"]');

      await goToAndExpandTaxonomyPanel();

      // See that added tags persist.
      const tokens2 = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('[data-testid="flat-term-token"]'),
          (element) => element.innerText
        )
      );

      await expect(tokens2).toStrictEqual(
        expect.arrayContaining(['rom-com', 'creature feature', 'adventure'])
      );
    });
  });

  describe('Custom Taxonomy', () => {
    withPlugin('web-stories-test-plugin-taxonomies');

    describe('Administrator', () => {
      it('should see custom taxonomies', async () => {
        await createNewStory();
        await goToAndExpandTaxonomyPanel();

        await expect(page).toMatch('Add New Color');
        await expect(page).toMatch('Search Verticals');

        await expect(page).toMatchElement('button', {
          text: 'Add New Vertical',
        });
      });
    });

    describe('Contributor', () => {
      withUser('contributor', 'password');

      it('should see custom taxonomies', async () => {
        await createNewStory();
        await goToAndExpandTaxonomyPanel();

        await expect(page).toMatch('Add New Color');
        await expect(page).toMatch('Search Verticals');

        await expect(page).not.toMatchElement('button', {
          text: 'Add New Vertical',
        });
      });
    });
  });
});
