/*
 * Copyright 2020 Google LLC
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

describe('CUJ: Page Templates: Creator can Apply a Page Template', () => {
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

  describe('Page templates Panel', () => {
    it('should navigate templates via keyboard', async () => {
      // Click templates layout icon
      await fixture.editor.library.pageTemplatesTab.click();

      await waitFor(() =>
        expect(
          fixture.editor.library.pageTemplatesPane.pageTemplateButtons.length
        ).toBeTruthy()
      );

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

  describe('Default page templates', () => {
    it('should add a new page when applying a template', async () => {
      await fixture.editor.library.pageTemplatesTab.click();

      await waitFor(() =>
        expect(
          fixture.editor.library.pageTemplatesPane.pageTemplateButtons.length
        ).toBeTruthy()
      );
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

      await waitFor(() =>
        expect(
          fixture.editor.library.pageTemplatesPane.pageTemplateButtons.length
        ).toBeTruthy()
      );

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

      await fixture.snapshot('applied page template');
    });
  });

  describe('Saved page templates', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.pageTemplatesTab);
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.dropDown
      );
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.dropDownOption(
          'Saved templates'
        )
      );
    });

    it('should allow saving a non-empty page as template', async () => {
      // Verify a template is not added for an empty page.
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );

      expect(
        () => fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toThrow();

      // Add an element and verify the template is added now.
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );
      await fixture.events.sleep(200);
      const message = await fixture.screen.getByRole('alert');
      expect(message.textContent).toBe('Page Template saved.');

      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);
    });

    it('should allow deleting a saved template', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );
      await fixture.events.sleep(200);
      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);

      // Hover the added template to reveal the delete button.
      await fixture.events.mouse.moveRel(
        fixture.editor.library.pageTemplatesPane.pageTemplates[0],
        40,
        40
      );
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.deleteTemplateBtn
      );
      await waitFor(() => {
        expect(fixture.screen.getByRole('dialog')).toBeTruthy();
      });
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: 'Delete' })
      );

      await fixture.events.sleep(200);
      const list = fixture.editor.getByRole('list', {
        name: 'Page Template Options',
      });
      expect(list.children.length).toBe(0);
    });

    it('should allow applying a template', async () => {
      // Add an element and verify the template is added now.
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );
      await fixture.events.sleep(200);
      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);

      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.pageTemplates[0]
      );
      await fixture.events.sleep(200);
      const { pages, currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => {
          return {
            currentPage: state.currentPage,
            pages: state.pages,
          };
        })
      );

      expect(pages.length).toEqual(2);
      // The dummy template has text as the first element.
      expect(currentPage.elements[1].type).toBe('text');
    });

    it('should allow manipulating custom templates using keyboard', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      await fixture.events.click(fixture.editor.library.pageTemplatesTab);
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Enter');

      await fixture.events.sleep(200);
      const message = await fixture.screen.getByRole('alert');
      expect(message.textContent).toBe('Page Template saved.');

      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);

      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Space');

      await fixture.events.sleep(200);

      await waitFor(() => {
        expect(fixture.screen.getByRole('dialog')).toBeTruthy();
      });

      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Enter');

      const list = fixture.editor.getByRole('list', {
        name: 'Page Template Options',
      });
      expect(list.children.length).toBe(0);
    });
  });
});
