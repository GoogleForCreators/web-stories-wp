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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Library: Saved Styles', () => {
  let fixture;

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
    localStorage.clear();
  });

  describe('User can apply style and create new styled texts from Saved Styles panel in Library', () => {
    it('should allow adding new styled text element and applying style from the same button', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });

      // Click to add a style and verify it was added.
      await fixture.events.click(fixture.editor.library.text.addStyleButton);
      expect(fixture.editor.library.text.applyStyleButtons.length).toBe(1);

      // Add a shape element to select a different type of element.
      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
      await fixture.editor.library.textTab.click();

      const addTextButton =
        fixture.editor.library.text.addTextWithStyleButtons[0];
      await fixture.events.click(addTextButton);

      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[3].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[3].node).toBeTruthy();
      });

      // Verify the new paragraph was added with the same style as the saved style from Title 1.
      const [lastAdded] = await getSelection();
      expect(lastAdded.type).toBe('text');
      expect(lastAdded.fontSize).toBe(36);
      expect(lastAdded.content).toBe(
        '<span style="font-weight: 700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>'
      );

      // Select background for being able to insert another text.
      await fixture.events.mouse.clickOn(
        fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );
      // Add a Label and click the same button again with selected text element now.
      await fixture.events.click(fixture.editor.library.text.preset('LABEL'));
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[4].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[4].node).toBeTruthy();
      });
      // Verify original size.
      const [originalLabel] = await getSelection();
      expect(originalLabel.fontSize).toBe(12);

      // Apply style.
      const applyStyleButton = fixture.editor.library.text.applyStyleButtons[0];
      await fixture.events.click(applyStyleButton);

      // Verify the style was applied here, too.
      const [label] = await getSelection();
      expect(label.fontSize).toBe(36);
    });
  });
});
