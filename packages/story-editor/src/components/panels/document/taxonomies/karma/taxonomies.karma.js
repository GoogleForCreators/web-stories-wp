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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app';
import { Fixture } from '../../../../../karma';

describe('Categories & Tags Panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableTaxonomiesSupport: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function openCategoriesAndTagsPanel() {
    // open document panel
    await fixture.events.click(fixture.editor.inspector.documentTab);

    // expand the categories and tags panel
    await fixture.events.click(
      fixture.editor.inspector.documentPanel.categoriesAndTags
        .categoriesAndTagsButton
    );
  }

  async function getStoryTerms() {
    const {
      state: {
        story: { terms },
      },
    } = await fixture.renderHook(() => useStory());

    return terms;
  }

  describe('Categories', () => {
    describe('cursor interactions', () => {
      it('should add categories and remove categories', async () => {
        await openCategoriesAndTagsPanel();

        const categoriesAndTags =
          fixture.editor.inspector.documentPanel.categoriesAndTags;

        // track initial story categories
        const initialStoryTerms = await getStoryTerms();

        // click a checkbox
        expect(categoriesAndTags.categories[0].checked).toBe(true);
        await fixture.events.click(categoriesAndTags.categories[0]);
        expect(categoriesAndTags.categories[0].checked).toBe(false);

        // verify category was removed from story
        let currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['story-categories'].length).toBe(
          initialStoryTerms['story-categories'].length - 1
        );

        // click a checkbox again
        await fixture.events.click(categoriesAndTags.categories[0]);
        expect(categoriesAndTags.categories[0].checked).toBe(true);

        // verify category was added to story
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['story-categories'].length).toBe(
          initialStoryTerms['story-categories'].length
        );
      });

      it('should add new categories', async () => {
        await openCategoriesAndTagsPanel();

        const categoriesAndTags =
          fixture.editor.inspector.documentPanel.categoriesAndTags;

        // track initial categories
        const initialCategories = categoriesAndTags.categories;

        // open the new category section
        await fixture.events.click(categoriesAndTags.addNewCategoryButton);

        // Add new category
        await fixture.events.focus(categoriesAndTags.newCategoryNameInput);
        await fixture.events.keyboard.type('deer');

        await fixture.events.click(categoriesAndTags.addNewCategoryButton);

        // validate new checkbox was added
        const finalCategories = categoriesAndTags.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter((category) => category.name === 'deer').length
        ).toBe(1);

        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });

      // TODO: #9063
      // disable reason: dropdown doesn't close unless the tests are slowed down
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should add a new category as a child of an existing category', async () => {
        await openCategoriesAndTagsPanel();

        const categoriesAndTags =
          fixture.editor.inspector.documentPanel.categoriesAndTags;

        // find initial categories
        const initialCategories = categoriesAndTags.categories;

        // open the new category section
        await fixture.events.click(categoriesAndTags.addNewCategoryButton);

        // Add new category
        await fixture.events.focus(categoriesAndTags.newCategoryNameInput);
        await fixture.events.keyboard.type('deer');
        await fixture.events.click(categoriesAndTags.parentDropdownButton);

        await waitFor(() =>
          fixture.screen.getByRole('option', {
            name: 'Booger',
          })
        );

        await fixture.events.click(
          fixture.screen.getByRole('option', {
            name: 'Booger',
          })
        );

        await waitFor(() =>
          fixture.screen
            .queryByRole('option', {
              name: 'Booger',
            })
            .toBeNull()
        );

        await fixture.events.click(categoriesAndTags.addNewCategoryButton);

        // validate new checkbox was added
        const finalCategories = categoriesAndTags.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter((category) => category.name === 'deer').length
        ).toBe(1);

        // validate new checkbox was added as a child
        // New checkbox will have been added directly after the parent option
        const boogerIndex = finalCategories.findIndex(
          (category) => category.name === 'Booger'
        );
        const deerIndex = finalCategories.findIndex(
          (category) => category.name === 'deer'
        );
        expect(deerIndex).toBe(boogerIndex + 1);

        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });
    });
  });

  describe('keyboard interactions', () => {
    it('should add categories and remove categories', async () => {
      await openCategoriesAndTagsPanel();

      const categoriesAndTags =
        fixture.editor.inspector.documentPanel.categoriesAndTags;

      // track initial story categories
      const initialStoryTerms = await getStoryTerms();

      // focus the panel button
      await fixture.events.focus(categoriesAndTags.categoriesAndTagsButton);

      // tab to first checkbox and un-check
      expect(categoriesAndTags.categories[0].checked).toBe(true);
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      expect(document.activeElement.type).toBe('checkbox');
      await fixture.events.keyboard.press('Space');
      expect(categoriesAndTags.categories[0].checked).toBe(false);

      // verify category was removed from story
      let currentStoryTerms = await getStoryTerms();
      expect(currentStoryTerms['story-categories'].length).toBe(
        initialStoryTerms['story-categories'].length - 1
      );

      // check the checkbox again
      await fixture.events.keyboard.press('Space');
      expect(categoriesAndTags.categories[0].checked).toBe(true);

      // verify category was added to story
      currentStoryTerms = await getStoryTerms();
      expect(currentStoryTerms['story-categories'].length).toBe(
        initialStoryTerms['story-categories'].length
      );
    });

    it('should add new categories', async () => {
      await openCategoriesAndTagsPanel();

      const categoriesAndTags =
        fixture.editor.inspector.documentPanel.categoriesAndTags;

      // focus the panel button
      await fixture.events.focus(categoriesAndTags.categoriesAndTagsButton);

      // track initial categories
      const initialCategories = categoriesAndTags.categories;

      // tab and to new category section
      let maxTabs = 0;
      while (
        maxTabs < 20 &&
        document.activeElement !== categoriesAndTags.addNewCategoryButton
      ) {
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('Tab');
        maxTabs++;
      }
      await fixture.events.keyboard.press('Space');

      // Input should be focused
      expect(document.activeElement).toBe(
        categoriesAndTags.newCategoryNameInput
      );

      // Enter name and submit
      await fixture.events.keyboard.type('deer');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      expect(document.activeElement).toBe(
        categoriesAndTags.addNewCategoryButton
      );
      await fixture.events.keyboard.press('Enter');

      // validate new checkbox was added
      const finalCategories = categoriesAndTags.categories;
      initialCategories.map((checkbox) =>
        expect(checkbox.name).not.toBe('deer')
      );
      expect(finalCategories.length).toBe(initialCategories.length + 1);
      expect(
        finalCategories.filter((category) => category.name === 'deer').length
      ).toBe(1);

      // TODO: 9058 - validate new category exists on story once category is checked when added.
    });

    it('should add a new category as a child of an existing category', async () => {
      await openCategoriesAndTagsPanel();

      const categoriesAndTags =
        fixture.editor.inspector.documentPanel.categoriesAndTags;

      // focus the panel button
      await fixture.events.focus(categoriesAndTags.categoriesAndTagsButton);

      // track initial categories
      const initialCategories = categoriesAndTags.categories;

      // tab and to new category section
      let maxTabs = 0;
      while (
        maxTabs < 20 &&
        document.activeElement !== categoriesAndTags.addNewCategoryButton
      ) {
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('Tab');
        maxTabs++;
      }
      await fixture.events.keyboard.press('Space');

      // Input should be focused
      expect(document.activeElement).toBe(
        categoriesAndTags.newCategoryNameInput
      );

      // Enter name
      await fixture.events.keyboard.type('deer');

      // Add parent
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Space');
      await fixture.events.keyboard.press('down');
      await fixture.events.keyboard.press('Enter');

      // Submit
      await fixture.events.keyboard.press('Tab');
      expect(document.activeElement).toBe(
        categoriesAndTags.addNewCategoryButton
      );
      await fixture.events.keyboard.press('Enter');

      // validate new checkbox was added
      const finalCategories = categoriesAndTags.categories;
      initialCategories.map((checkbox) =>
        expect(checkbox.name).not.toBe('deer')
      );
      expect(finalCategories.length).toBe(initialCategories.length + 1);
      expect(
        finalCategories.filter((category) => category.name === 'deer').length
      ).toBe(1);

      // validate new checkbox was added as a child
      // New checkbox will have been added directly after the parent option
      const boogerIndex = finalCategories.findIndex(
        (category) => category.name === 'Booger'
      );
      const deerIndex = finalCategories.findIndex(
        (category) => category.name === 'deer'
      );
      expect(deerIndex).toBe(boogerIndex + 1);

      // TODO: 9058 - validate new category exists on story once category is checked when added.
    });
  });
});
