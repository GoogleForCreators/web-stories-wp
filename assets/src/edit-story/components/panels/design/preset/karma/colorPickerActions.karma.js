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

const ALL_STORIES = 'All stories';

describe('Saved Styles: Color Picker', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
    localStorage.clear();
  });

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('CUJ: Creator can Apply or Save a Color from/to Their Preset Library: Add Colors from Color Picker', () => {
    it('should allow adding local and global colors from the color picker', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const { fontColor } = fixture.editor.inspector.designPanel.textStyle;
      fontColor.button.scrollIntoView();
      await fixture.events.click(fontColor.button);
      await waitFor(() => fontColor.picker);

      await fixture.events.click(fontColor.picker.saveColor);
      // Default view is local color.
      expect(fontColor.picker.applySavedColor('local')).toBeTruthy();

      // Switch to global.
      await fixture.events.click(fontColor.picker.colorTypeSelect);
      await fixture.events.click(
        fixture.screen.getByRole('option', { name: ALL_STORIES })
      );
      await fixture.events.click(fontColor.picker.saveColor);
      expect(fontColor.picker.applySavedColor('global')).toBeTruthy();
    });

    it('should allow applying local colors', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const { fontColor } = fixture.editor.inspector.designPanel.textStyle;
      fontColor.button.scrollIntoView();

      // Set color
      await fixture.events.click(fontColor.hex, { clickCount: 3 });
      await fixture.events.keyboard.type('FFFFFF');
      await fixture.events.keyboard.press('Tab');

      await fixture.events.click(fontColor.button);
      await waitFor(() => fontColor.picker);
      await fixture.events.click(fontColor.picker.saveColor);

      await fixture.events.click(fixture.editor.library.textAdd);
      fontColor.button.scrollIntoView();
      await fixture.events.click(fontColor.button);
      await waitFor(() => fontColor.picker);
      await fixture.events.click(fontColor.picker.applySavedColor('local'));

      const [text] = await getSelection();
      expect(text.content).toEqual(
        '<span style="color: #fff">Fill in some text</span>'
      );
    });

    it('should allow applying global colors', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const { fontColor } = fixture.editor.inspector.designPanel.textStyle;
      fontColor.button.scrollIntoView();

      // Set color
      await fixture.events.click(fontColor.hex, { clickCount: 3 });
      await fixture.events.keyboard.type('FFFFFF');
      await fixture.events.keyboard.press('Tab');

      await fixture.events.click(fontColor.button);
      await waitFor(() => fontColor.picker);
      await fixture.events.click(fontColor.picker.colorTypeSelect);
      await fixture.events.click(
        fixture.screen.getByRole('option', { name: ALL_STORIES })
      );
      await fixture.events.click(fontColor.picker.saveColor);

      await fixture.events.click(fixture.editor.library.textAdd);
      fontColor.button.scrollIntoView();
      await fixture.events.click(fontColor.button);
      await waitFor(() => fontColor.picker);
      await fixture.events.click(fontColor.picker.colorTypeSelect);
      await fixture.events.click(
        fixture.screen.getByRole('option', { name: ALL_STORIES })
      );
      await fixture.events.click(fontColor.picker.applySavedColor('global'));

      const [text] = await getSelection();
      expect(text.content).toEqual(
        '<span style="color: #fff">Fill in some text</span>'
      );
    });
  });
});
