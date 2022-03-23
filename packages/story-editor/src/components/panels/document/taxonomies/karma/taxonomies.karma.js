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
import { waitFor, within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app';
import { Fixture } from '../../../../../karma';

describe('Taxonomies Panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function openTaxonomiesPanel() {
    // open document panel
    await fixture.events.click(fixture.editor.sidebar.documentTab);

    // expand the taxonomies panel
    await fixture.events.click(
      fixture.editor.sidebar.documentPanel.taxonomies.taxonomiesButton
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

  it('should have no aXe accessibility violations', async () => {
    await openTaxonomiesPanel();
    const { taxonomies } = fixture.editor.sidebar.documentPanel;
    await expectAsync(taxonomies.node).toHaveNoViolations();
  });

  describe('Categories', () => {
    describe('cursor interactions', () => {
      it('should add categories and remove categories', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // track initial story categories
        const initialStoryTerms = await getStoryTerms();

        // click a checkbox
        expect(taxonomies.categories[0].checked).toBe(true);
        await fixture.events.click(taxonomies.categories[0]);
        expect(taxonomies.categories[0].checked).toBe(false);

        // verify category was removed from story
        let currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_category'].length).toBe(
          initialStoryTerms['web_story_category'].length - 1
        );

        // click a checkbox again
        await fixture.events.click(taxonomies.categories[0]);
        expect(taxonomies.categories[0].checked).toBe(true);

        // verify category was added to story
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_category'].length).toBe(
          initialStoryTerms['web_story_category'].length
        );
      });

      it('should add new categories', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // track initial categories
        const initialCategories = taxonomies.categories;

        // open the new category section
        await fixture.events.click(taxonomies.addNewCategoryButton);

        // Add new category
        await fixture.events.focus(taxonomies.newCategoryNameInput);
        await fixture.events.keyboard.type('deer');

        await fixture.events.click(taxonomies.addNewCategoryButton);

        // validate new checkbox was added
        const finalCategories = taxonomies.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('hierarchical_term_deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter(
            (category) => category.name === 'hierarchical_term_deer'
          ).length
        ).toBe(1);

        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });

      it('should add a new category as a child of an existing category', async () => {
        await openTaxonomiesPanel();
        const { taxonomies } = fixture.editor.sidebar.documentPanel;
        // find initial categories
        const initialCategories = taxonomies.categories;

        // open the new category section
        await fixture.events.click(taxonomies.addNewCategoryButton);
        // Input should be focused
        expect(document.activeElement).toBe(taxonomies.newCategoryNameInput);
        // Add new category
        await fixture.events.focus(taxonomies.newCategoryNameInput);
        await fixture.events.keyboard.type('deer');
        await fixture.events.click(taxonomies.parentDropdownButton);

        await fixture.events.click(
          fixture.screen.getByRole('option', {
            name: 'Booger',
          })
        );

        await fixture.events.click(taxonomies.addNewCategoryButton);
        // validate new checkbox was added
        const finalCategories = taxonomies.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter(
            (category) => category.name === 'hierarchical_term_deer'
          ).length
        ).toBe(1);
        // validate new checkbox was added as a child
        // New checkbox will have been added directly after the parent option
        const boogerIndex = finalCategories.findIndex(
          (category) => category.name === 'hierarchical_term_Booger'
        );
        const deerIndex = finalCategories.findIndex(
          (category) => category.name === 'hierarchical_term_deer'
        );
        expect(deerIndex).toBe(boogerIndex + 1);
        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });
    });

    describe('keyboard interactions', () => {
      // TODO(#9226): Fix flaky test.
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should add categories and remove categories', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // track initial story categories
        const initialStoryTerms = await getStoryTerms();

        // focus the panel button
        await fixture.events.focus(taxonomies.taxonomiesButton);

        // tab to first checkbox and un-check
        expect(taxonomies.categories[0].checked).toBe(true);
        await fixture.events.keyboard.press('Tab');
        await fixture.events.keyboard.press('Tab');
        expect(document.activeElement.type).toBe('checkbox');
        await fixture.events.keyboard.press('Space');
        expect(taxonomies.categories[0].checked).toBe(false);

        // verify category was removed from story
        let currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_category'].length).toBe(
          initialStoryTerms['web_story_category'].length - 1
        );

        // check the checkbox again
        await fixture.events.keyboard.press('Space');
        expect(taxonomies.categories[0].checked).toBe(true);

        // verify category was added to story
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_category'].length).toBe(
          initialStoryTerms['web_story_category'].length
        );
      });

      it('should add new categories', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // focus the panel button
        await fixture.events.focus(taxonomies.taxonomiesButton);

        // track initial categories
        const initialCategories = taxonomies.categories;

        // tab and to new category section
        let maxTabs = 0;
        while (
          maxTabs < 20 &&
          document.activeElement !== taxonomies.addNewCategoryButton
        ) {
          // eslint-disable-next-line no-await-in-loop
          await fixture.events.keyboard.press('Tab');
          maxTabs++;
        }
        await fixture.events.keyboard.press('Space');

        // Input should be focused
        expect(document.activeElement).toBe(taxonomies.newCategoryNameInput);

        // Enter name and submit
        await fixture.events.keyboard.type('deer');
        await fixture.events.keyboard.press('Tab');
        await fixture.events.keyboard.press('Tab');
        expect(document.activeElement).toBe(taxonomies.addNewCategoryButton);
        await fixture.events.keyboard.press('Enter');

        // validate new checkbox was added
        const finalCategories = taxonomies.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('hierarchical_term_deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter(
            (category) => category.name === 'hierarchical_term_deer'
          ).length
        ).toBe(1);

        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });

      it('should add a new category as a child of an existing category', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // focus the panel button
        await fixture.events.focus(taxonomies.taxonomiesButton);

        // track initial categories
        const initialCategories = taxonomies.categories;

        // tab and to new category section
        let maxTabs = 0;
        while (
          maxTabs < 20 &&
          document.activeElement !== taxonomies.addNewCategoryButton
        ) {
          // eslint-disable-next-line no-await-in-loop
          await fixture.events.keyboard.press('Tab');
          maxTabs++;
        }
        await fixture.events.keyboard.press('Space');

        // Input should be focused
        expect(document.activeElement).toBe(taxonomies.newCategoryNameInput);

        // Enter name
        await fixture.events.keyboard.type('deer');

        // Add parent
        await fixture.events.keyboard.press('Tab');
        await fixture.events.keyboard.press('Space');
        await fixture.events.keyboard.press('down');
        await fixture.events.keyboard.press('Enter');

        // Submit
        await fixture.events.keyboard.press('Tab');
        expect(document.activeElement).toBe(taxonomies.addNewCategoryButton);
        await fixture.events.keyboard.press('Enter');

        // validate new checkbox was added
        const finalCategories = taxonomies.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter(
            (category) => category.name === 'hierarchical_term_deer'
          ).length
        ).toBe(1);

        // validate new checkbox was added as a child
        // New checkbox will have been added directly after the parent option
        const boogerIndex = finalCategories.findIndex(
          (category) => category.name === 'hierarchical_term_Booger'
        );
        const deerIndex = finalCategories.findIndex(
          (category) => category.name === 'hierarchical_term_deer'
        );
        expect(deerIndex).toBe(boogerIndex + 1);

        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });

      it('should submit new categories with Enter button', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // focus the panel button
        await fixture.events.focus(taxonomies.taxonomiesButton);

        // track initial categories
        const initialCategories = taxonomies.categories;

        // tab to `Add New Category` button / section
        let maxTabs = 0;
        while (
          maxTabs < 20 &&
          document.activeElement !== taxonomies.addNewCategoryButton
        ) {
          // eslint-disable-next-line no-await-in-loop
          await fixture.events.keyboard.press('Tab');
          maxTabs++;
        }
        // Toggle `Add New Category`
        await fixture.events.keyboard.press('Space');

        // Input should be focused
        expect(document.activeElement).toBe(taxonomies.newCategoryNameInput);

        // Enter name and submit
        await fixture.events.keyboard.type('deer');
        await fixture.events.keyboard.press('Enter');

        // validate new checkbox was added
        const finalCategories = taxonomies.categories;
        initialCategories.map((checkbox) =>
          expect(checkbox.name).not.toBe('hierarchical_term_deer')
        );
        expect(finalCategories.length).toBe(initialCategories.length + 1);
        expect(
          finalCategories.filter(
            (category) => category.name === 'hierarchical_term_deer'
          ).length
        ).toBe(1);

        // TODO: 9058 - validate new category exists on story once category is checked when added.
      });

      it('should focus toggle on cancel', async () => {
        await openTaxonomiesPanel();

        const { taxonomies } = fixture.editor.sidebar.documentPanel;

        // focus the panel button
        await fixture.events.focus(taxonomies.taxonomiesButton);

        // tab to `Add New Category` section
        let maxTabs = 0;
        while (
          maxTabs < 20 &&
          document.activeElement !== taxonomies.addNewCategoryButton
        ) {
          // eslint-disable-next-line no-await-in-loop
          await fixture.events.keyboard.press('Tab');
          maxTabs++;
        }
        // Toggle `Add New Category`
        await fixture.events.keyboard.press('Space');

        // Input should be focused
        expect(document.activeElement).toBe(taxonomies.newCategoryNameInput);

        // Enter name and submit
        await fixture.events.keyboard.type('deer');
        // Tab to Cancel button
        await fixture.events.keyboard.press('Tab');
        await fixture.events.keyboard.press('Tab');
        await fixture.events.keyboard.press('Tab');
        // Hit Cancel button
        await fixture.events.keyboard.press('Enter');

        // The toggle `Add New Category` should be focused
        expect(document.activeElement).toBe(taxonomies.addNewCategoryButton);
      });
    });
  });

  describe('Tags', () => {
    it('populates the tags correctly from the story', async () => {
      await openTaxonomiesPanel();
      const currentStoryTerms = await getStoryTerms();
      const renderedTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(renderedTokens.length).toEqual(
        currentStoryTerms['web_story_tag'].length
      );
    });

    it('can add tags with input', async () => {
      await openTaxonomiesPanel();
      const tag1Name = 'new tag';
      const tag2Name = 'another tag';
      let currentStoryTerms = await getStoryTerms();
      const initialTagsLength = currentStoryTerms['web_story_tag'].length;
      const { taxonomies } = fixture.editor.sidebar.documentPanel;
      const tagsInput = taxonomies.tagsInput;
      // enter in the first tag
      await fixture.events.focus(tagsInput);
      await fixture.events.keyboard.type(tag1Name);
      await fixture.events.keyboard.press('Enter');
      let tags = await fixture.screen.findAllByTestId(/^flat-term-token/);
      await expect(tags.length).toBe(initialTagsLength + 1);
      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_tag'].length).toEqual(
          initialTagsLength + 1
        );
      });
      // enter in a second tag
      await fixture.events.keyboard.type(tag2Name);
      await fixture.events.keyboard.press('Enter');
      tags = await fixture.screen.findAllByTestId(/^flat-term-token/);
      await expect(tags.length).toBe(initialTagsLength + 2);
      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_tag'].length).toEqual(
          initialTagsLength + 2
        );
      });
      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[initialTagsLength].innerText).toBe(tag1Name);
      expect(tagTokens[initialTagsLength + 1].innerText).toBe(tag2Name);
    });

    it('can add tags with Most Used', async () => {
      await openTaxonomiesPanel();
      const initialTagsLength = (await getStoryTerms())['web_story_tag'].length;

      // get all most used terms
      const storyTagsMostUsed = fixture.screen.getByTestId(
        /^web_story_tag-most-used/
      );
      const mostUsedButtons = within(storyTagsMostUsed).getAllByRole('button');

      // click on the first most used term
      await fixture.events.click(mostUsedButtons[0]);

      // see that the term appears in the input
      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[tagTokens.length - 1].innerText).toBe(
        // most used buttons have comma separators in them
        mostUsedButtons[0].innerText.split(',')[0]
      );

      // see that the term id is associated with the story
      const currentStoryTerms = await getStoryTerms();
      expect(currentStoryTerms['web_story_tag'].length).toEqual(
        initialTagsLength + 1
      );
    });

    it('can delete tags with keyboard', async () => {
      await openTaxonomiesPanel();
      let currentStoryTerms = await getStoryTerms();
      const initialTagsLength = currentStoryTerms['web_story_tag'].length;
      const { tagsInput } = fixture.editor.sidebar.documentPanel.taxonomies;
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
        expect(currentStoryTerms['web_story_tag'].length).toEqual(
          initialTagsLength - 1
        );
      });
      // See that the right tag was deleted
      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[0].innerText).toEqual(initialTokens[0].innerText);
      expect(tagTokens[1].innerText).toEqual(initialTokens[2].innerText);
    });

    it('can delete tags with mouse', async () => {
      await openTaxonomiesPanel();
      let currentStoryTerms = await getStoryTerms();
      const { taxonomies } = fixture.editor.sidebar.documentPanel;
      const initialTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      const initialTagsLength = currentStoryTerms['web_story_tag'].length;
      // delete tag with mouse
      const removeTagButtons = taxonomies.tagTokenRemoveButtons;
      await fixture.events.click(removeTagButtons[0]);
      await waitFor(
        () =>
          fixture.screen.getAllByTestId(/^flat-term-token/).length ===
          initialTagsLength - 1
      );
      // See that terms are persisted on the story
      await waitFor(async () => {
        currentStoryTerms = await getStoryTerms();
        expect(currentStoryTerms['web_story_tag'].length).toEqual(
          initialTagsLength - 1
        );
      });
      // see that the correct token was removed
      const tagTokens = fixture.screen.getAllByTestId(/^flat-term-token/);
      expect(tagTokens[0].innerText).toEqual(initialTokens[1].innerText);
      expect(tagTokens[1].innerText).toEqual(initialTokens[2].innerText);
    });
  });
});
