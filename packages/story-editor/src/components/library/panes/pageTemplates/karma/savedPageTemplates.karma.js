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

describe('CUJ: Page Templates: Custom Saved Templates', () => {
  let fixture;
  let originalTimeout;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.restore();
  });

  describe('Saved page templates', () => {
    const openSavedTemplates = async () => {
      await fixture.events.click(fixture.editor.library.pageTemplatesTab);
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.dropDown
      );
      await fixture.events.sleep(500);
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.dropDownOption(
          'Saved templates'
        )
      );
    };

    it('should allow saving a non-empty page as template', async () => {
      await openSavedTemplates();
      // Verify a template is not added for an empty page.
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );

      expect(
        () => fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toThrow();

      // Add an element and verify the template is added now.
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });

      await openSavedTemplates();
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );
      await fixture.events.sleep(200);
      const message = await fixture.screen.getByRole('alert', { hidden: true });
      expect(message.textContent).toBe('Page Template saved.');

      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);
    });

    it('should allow deleting a saved template', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });

      await openSavedTemplates();

      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );
      await fixture.events.sleep(200);
      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);

      // Hover the added template to reveal the button.
      await fixture.events.hover(
        fixture.editor.library.pageTemplatesPane.pageTemplates[0]
      );
      // Choose the Delete button of the first item.
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.deleteBtnByIndex(0)
      );

      const dialog = await fixture.screen.findByRole('dialog', {
        name: 'Delete Page Template',
        timeout: 9000,
      });

      const deleteButton = await within(dialog).findByRole('button', {
        name: 'Delete',
      });

      await fixture.events.click(deleteButton);

      await fixture.events.sleep(200);
      const list = fixture.editor.getByRole('list', {
        name: 'Page Template Options',
      });
      expect(list.children.length).toBe(0);
    });

    it('should allow applying a template', async () => {
      // Add an element and verify the template is added now.
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });

      await openSavedTemplates();
      await fixture.events.click(
        fixture.editor.library.pageTemplatesPane.saveTemplateBtn
      );
      await fixture.events.sleep(200);
      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);

      const template =
        fixture.editor.library.pageTemplatesPane.pageTemplates[0];
      await fixture.events.click(template);
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
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });
      await fixture.events.click(fixture.editor.library.pageTemplatesTab);
      // navigate to Save current page a template button and save
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Enter');

      await fixture.events.sleep(200);
      const message = await fixture.screen.getByRole('alert', { hidden: true });
      expect(message.textContent).toBe('Page Template saved.');

      expect(
        fixture.editor.library.pageTemplatesPane.pageTemplates.length
      ).toBe(1);
      // navigate to newly saved template and open delete dialog
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Enter');

      await fixture.events.sleep(200);

      await waitFor(() => {
        expect(fixture.screen.getByRole('dialog')).toBeTruthy();
      });
      // navigate to delete button, and delete newly created template
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Enter');

      // add time buffer for templates to be removed
      await fixture.events.sleep(500);
      // there should no longer be any saved templates
      await waitFor(() => {
        expect(
          () => fixture.editor.library.pageTemplatesPane.pageTemplates
        ).toThrow();
      });
    });
  });
});
