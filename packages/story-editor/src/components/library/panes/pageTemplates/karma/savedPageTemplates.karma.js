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

describe('CUJ: Page Templates: Custom Saved Templates', () => {
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

      await waitFor(() => {
        expect(
          fixture.screen.getByRole('list', {
            name: 'Page Template Options',
          }).children.length
        ).toBe(0);
      });
    });
  });
});
