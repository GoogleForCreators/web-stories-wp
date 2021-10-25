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
import { Fixture } from '../../../../../karma/fixture';
import { useStory } from '../../../../../app/story';
import formattedTemplatesArray from '../../../../../dataUtils/formattedTemplatesArray';
import objectWithout from '../../../../../utils/objectWithout';

const expectPageTemplateEqual = (currentPage, template) => {
  expect(currentPage.id).not.toEqual(template.id);
  expect(currentPage.elements.length).toEqual(template.elements.length);
  template.elements.forEach((element, index) => {
    expect(
      objectWithout(currentPage.elements[index], ['id', 'basedOn'])
    ).toEqual(objectWithout(element, ['id', 'basedOn']));
  });
  expect(currentPage.animations.length).toEqual(
    (template.animations || []).length
  );
};

describe('CUJ: Page Templates: Creator can Apply a Default Page Template', () => {
  let fixture;
  let originalTimeout;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.restore();
  });

  const expectAllTemplatesLoaded = () => {
    expect(fixture.screen.getAllByRole('listitem').length).toBe(
      fixture.editor.library.pageTemplatesPane.pageTemplateButtons.length
    );
  };

  describe('Filtering chips', () => {
    it('should show all filtering chips', async () => {
      await fixture.editor.library.pageTemplatesTab.click();
      await waitFor(() => expectAllTemplatesLoaded);

      const filteringList = fixture.screen.getByRole('listbox', {
        name: 'List of filtering options',
      });

      const filterOptions = within(filteringList).getAllByRole('option');

      const expectedFilterOptions = [
        'All',
        'Cover',
        'Section',
        'Quote',
        'Editorial',
        'List',
        'Table',
        'Steps',
      ];

      filterOptions.map((option, index) =>
        expect(option).toHaveTextContent(expectedFilterOptions[index])
      );
    });

    it('should filter templates by type', async () => {
      await fixture.editor.library.pageTemplatesTab.click();
      await waitFor(() => expectAllTemplatesLoaded);

      const filteringList =
        fixture.editor.library.pageTemplatesPane.filteringOptions;

      // filter by editorial
      await fixture.events.click(
        within(filteringList).getByRole('option', {
          name: 'Editorial',
        })
      );

      const editorialTemplates = formattedTemplatesArray.flatMap((template) => {
        return template.pages.filter((page) => {
          return page.pageTemplateType === 'editorial';
        });
      });

      expect(fixture.screen.getAllByRole('listitem').length).toBe(
        editorialTemplates.length
      );
      // filter back to all by clicking 'editorial' again
      await fixture.events.click(
        within(filteringList).getByRole('option', {
          name: 'Editorial',
        })
      );

      await waitFor(() => expectAllTemplatesLoaded);
    });
  });

  describe('Creator can apply a template', () => {
    it('should add a new page when applying a template', async () => {
      await fixture.editor.library.pageTemplatesTab.click();

      await waitFor(() => expectAllTemplatesLoaded);

      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.pageTemplateButton(
          'Cooking Cover'
        )
      );

      // check that all elements have been applied
      const { pages, currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => {
          return {
            currentPage: state.currentPage,
            pages: state.pages,
          };
        })
      );

      expect(pages.length).toEqual(2);
      const cookingTemplate = formattedTemplatesArray.find(
        (t) => t.title === 'Cooking'
      );
      const coverPage = cookingTemplate.pages.find(
        (p) => p.pageTemplateType === 'cover'
      );
      expectPageTemplateEqual(currentPage, coverPage);

      await fixture.snapshot('applied page template');
    });

    it('should apply page template to an empty page using keyboard', async () => {
      await fixture.editor.library.pageTemplatesTab.click();

      await waitFor(() => expectAllTemplatesLoaded);

      const { pageTemplateButtons } = fixture.editor.library.pageTemplatesPane;

      await fixture.events.focus(pageTemplateButtons[0]);

      await fixture.events.keyboard.press('right');

      await fixture.events.keyboard.press('right');

      const activeTextSetId =
        pageTemplateButtons[2].getAttribute('data-testid');
      const documentTestId = document.activeElement.getAttribute('data-testid');
      expect(activeTextSetId).toBe(documentTestId);
      await fixture.events.keyboard.press('Enter');

      // check that all elements have been applied
      const currentPage = await fixture.renderHook(() =>
        useStory(({ state }) => state.currentPage)
      );
      const cookingTemplate = formattedTemplatesArray.find(
        (t) => t.title === 'Cooking'
      );
      const coverPage = cookingTemplate.pages.find(
        (p) => p.pageTemplateType === 'cover'
      );
      expectPageTemplateEqual(currentPage, coverPage);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate templates via keyboard', async () => {
      // Click templates layout icon
      await fixture.editor.library.pageTemplatesTab.click();

      await waitFor(() => expectAllTemplatesLoaded);

      // tab to "Save current page as template" button
      await fixture.events.keyboard.press('tab');
      expect(fixture.editor.library.pageTemplatesPane.saveTemplateBtn).toBe(
        document.activeElement
      );

      // tab to default templates dropdown button
      await fixture.events.keyboard.press('tab');
      expect(fixture.editor.library.pageTemplatesPane.dropDown).toBe(
        document.activeElement
      );

      // tab to filtering buttons
      await fixture.events.keyboard.press('tab');
      // filter templates by "section"
      await fixture.events.keyboard.press('right');
      await fixture.events.keyboard.press('right');
      await fixture.events.keyboard.press('Enter');
      // expect templates titles to not contain "cover", there will still be one filter button containing "cover"
      await waitFor(() => {
        expect(fixture.screen.getAllByText(/cover/i).length).toBe(1);
      });
      // navigate to and add "Fresh & Bright" template
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('Enter');

      // check that all elements have been applied
      const { pages, currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => {
          return {
            currentPage: state.currentPage,
            pages: state.pages,
          };
        })
      );

      expect(pages.length).toEqual(2);
      const cookingTemplate = formattedTemplatesArray.find(
        (t) => t.title === 'Cooking'
      );
      const sectionPage = cookingTemplate.pages.find(
        (p) => p.pageTemplateType === 'section'
      );

      expectPageTemplateEqual(currentPage, sectionPage);

      // make next template "Entertainment Section" active before leaving template list
      await fixture.events.keyboard.press('right');
      await fixture.events.keyboard.press('tab');
      // expect focus to leave templates
      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates[1]
      ).not.toBe(document.activeElement);

      // return to template list
      await fixture.events.keyboard.shortcut('shift+tab');
      // expect focus to be on last focused element
      expect(
        fixture.screen.getByRole('button', { name: 'Entertainment Section' })
      ).toBe(document.activeElement);

      // return to filters
      await fixture.events.keyboard.shortcut('shift+tab');
      await fixture.events.keyboard.shortcut('shift+tab');

      // filter by all
      await fixture.events.keyboard.press('left');
      await fixture.events.keyboard.press('left');
      await fixture.events.keyboard.press('Enter');

      // expect template titles to contain "cover"
      expect(
        fixture.screen.getAllByText(/cover/i).length
      ).toBeGreaterThanOrEqual(1);
    });
  });
});
