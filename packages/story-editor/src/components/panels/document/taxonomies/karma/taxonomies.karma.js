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
import { Fixture } from '../../../../../karma';

describe('Categories', () => {
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

  it('should add categories and remove categories', async () => {
    await openCategoriesAndTagsPanel();

    const categoriesAndTags =
      fixture.editor.inspector.documentPanel.categoriesAndTags;

    // click a checkbox
    expect(categoriesAndTags.categories[0].checked).toBe(true);
    await fixture.events.click(categoriesAndTags.categories[0]);
    expect(categoriesAndTags.categories[0].checked).toBe(false);

    // click a checkbox again
    await fixture.events.click(categoriesAndTags.categories[0]);
    expect(categoriesAndTags.categories[0].checked).toBe(true);
  });

  it('should add new categories', async () => {
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

    await fixture.events.click(categoriesAndTags.addNewCategoryButton);

    // validate new checkbox was added
    const finalCategories = categoriesAndTags.categories;
    initialCategories.map((checkbox) => expect(checkbox.name).not.toBe('deer'));
    expect(finalCategories.length).toBe(initialCategories.length + 1);
    expect(
      finalCategories.filter((category) => category.name === 'deer').length
    ).toBe(1);
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
    initialCategories.map((checkbox) => expect(checkbox.name).not.toBe('deer'));
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
  });
});
