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
import { Fixture } from '../../../karma';
import { MESSAGES } from '../../../app/prepublish/constants';
import { useStory } from '../../../app';

describe('Pre-publish checklist select offending elements onClick', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Prepublish checklist tab', () => {
    it('should select the offending elements', async () => {
      const { checklistTab } = fixture.editor.inspector;

      await fixture.editor.library.textTab.click();

      await waitFor(() =>
        expect(fixture.editor.library.text.textSets.length).toBeTruthy()
      );

      // four paragraphs will cause the "too much text on page" error
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );

      // Click prepublish tab
      await fixture.events.mouse.clickOn(checklistTab);
      await waitFor(() => fixture.editor.inspector.checklistTab);
      expect(checklistTab).toHaveFocus();
      await fixture.events.mouse.clickOn(
        fixture.editor.inspector.checklistPanel.recommended
      );
      await fixture.events.sleep(500);
      const tooMuchTextOnPage = fixture.screen.getByText(
        MESSAGES.TEXT.TOO_MUCH_PAGE_TEXT.MAIN_TEXT
      );
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      await fixture.events.mouse.clickOn(tooMuchTextOnPage);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(4);
    });
  });
});
