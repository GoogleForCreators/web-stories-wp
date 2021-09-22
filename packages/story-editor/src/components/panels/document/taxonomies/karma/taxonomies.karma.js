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

  describe('Tags', () => {
    it('populates the tags correctly from the story', async () => {
      await openCategoriesAndTagsPanel();
      const currentStoryTerms = await getStoryTerms();
      const renderedTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(renderedTokens.length).toEqual(
        currentStoryTerms['story-tags'].length
      );
    });

    it('can add tags', async () => {
      await openCategoriesAndTagsPanel();
      const tag1Name = 'new tag';
      const tag2Name = 'another tag';

      let currentStoryTerms = await getStoryTerms();
      const initialTagsLength = currentStoryTerms['story-tags'].length;

      const taxonomyPanel =
        fixture.editor.inspector.documentPanel.categoriesAndTags;
      const tagsInput = taxonomyPanel.tagsInput;

      // enter in the first tag
      await fixture.events.focus(tagsInput);
      await fixture.events.keyboard.type(tag1Name);
      await fixture.events.keyboard.press('Enter');
      await waitFor(
        () =>
          fixture.screen.getAllByTestId(/^flat-term-token/).length ===
          initialTagsLength + 1
      );

      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['story-tags'].length).toEqual(
          initialTagsLength + 1
        );
      });

      // enter in a second tag
      await fixture.events.keyboard.type(tag2Name);
      await fixture.events.keyboard.press('Enter');
      await waitFor(
        () =>
          fixture.screen.getAllByTestId(/^flat-term-token/).length ===
          initialTagsLength + 2
      );

      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['story-tags'].length).toEqual(
          initialTagsLength + 2
        );
      });

      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[initialTagsLength].innerText).toBe(tag1Name);
      expect(tagTokens[initialTagsLength + 1].innerText).toBe(tag2Name);
    });

    it('can delete tags with keyboard', async () => {
      await openCategoriesAndTagsPanel();
      let currentStoryTerms = await getStoryTerms();
      const initialTagsLength = currentStoryTerms['story-tags'].length;

      const tagsInput =
        fixture.editor.inspector.documentPanel.categoriesAndTags.tagsInput;

      const initialTokens = await fixture.screen.getAllByTestId(
        /^flat-term-token/
      );

      // delete the first tag with keyboard navigation
      await fixture.events.focus(tagsInput);
      await fixture.events.keyboard.press('ArrowLeft');
      await fixture.events.keyboard.press('Backspace');
      await waitFor(
        () =>
          fixture.screen.getAllByTestId(/^flat-term-token/).length ===
          initialTagsLength - 1
      );

      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['story-tags'].length).toEqual(
          initialTagsLength - 1
        );
      });

      // See that the right tag was deleted
      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[0]).toBe(initialTokens[0]);
      expect(tagTokens[1]).toBe(initialTokens[2]);
    });

    it('can delete tags with mouse', async () => {
      await openCategoriesAndTagsPanel();
      let currentStoryTerms = await getStoryTerms();
      const taxonomyPanel =
        fixture.editor.inspector.documentPanel.categoriesAndTags;
      const initialTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      const initialTagsLength = currentStoryTerms['story-tags'].length;

      // delete tag with mouse
      const removeTagButtons = taxonomyPanel.tagTokenRemoveButtons;
      await fixture.events.click(removeTagButtons[0]);
      await waitFor(
        () =>
          fixture.screen.getAllByTestId(/^flat-term-token/).length ===
          initialTagsLength - 1
      );

      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['story-tags'].length).toEqual(
          initialTagsLength - 1
        );
      });

      // see that thee correct token was removed
      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[0]).toBe(initialTokens[1]);
      expect(tagTokens[1]).toBe(initialTokens[2]);
    });
  });
});
