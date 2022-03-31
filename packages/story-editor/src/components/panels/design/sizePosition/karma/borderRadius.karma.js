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

describe('Border Radius', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('CUJ: Creator can Manipulate Shape: Border Radius', () => {
    it('should allow the user to add border radius for text element', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
      });
      // Choose Fill as background for visibility.
      await fixture.events.click(fixture.editor.sidebar.designTab);
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.textStyle.fill
      );

      const panel = fixture.editor.sidebar.designPanel.sizePosition;
      await fixture.events.click(panel.radius(), { clickCount: 3 });
      await fixture.events.keyboard.type('30');
      await fixture.events.keyboard.press('tab');

      const [element] = await getSelection();
      // Since the default state is locked, verify that all the values were set to 30.
      expect(element.borderRadius).toEqual(
        jasmine.objectContaining({
          topLeft: 30,
          topRight: 30,
          bottomLeft: 30,
          bottomRight: 30,
        })
      );

      // Take off lock.
      await fixture.events.click(panel.lockBorderRadius);

      await fixture.events.click(panel.radius('Top left'), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      // Verify the value change only for the top-left corner.
      const [updatedElement] = await getSelection();
      expect(updatedElement.borderRadius.topLeft).toBe(10);
      expect(updatedElement.borderRadius.topRight).toBe(30);

      await fixture.snapshot('Text element with border radius');
    });

    it('should allow user to add border radius for media', async () => {
      const mediaItem = fixture.editor.library.media.item(0);
      await fixture.events.mouse.clickOn(mediaItem, 20, 20);
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const panel = fixture.editor.sidebar.designPanel.sizePosition;

      // Take off lock.
      await fixture.events.click(panel.lockBorderRadius);
      // Focus the input first so that tooltip is not in the way of click.
      await fixture.events.focus(panel.radius('Bottom left'));
      await fixture.events.click(panel.radius('Bottom left'), {
        clickCount: 3,
      });
      await fixture.events.keyboard.type('50');
      await fixture.events.keyboard.press('tab');

      const [element] = await getSelection();
      const {
        borderRadius: { topLeft, topRight, bottomLeft, bottomRight },
      } = element;

      expect(topLeft).toBe(0);
      expect(topRight).toBe(0);
      expect(bottomLeft).toBe(50);
      expect(bottomRight).toBe(0);
      expect(element.borderRadius).toEqual(
        jasmine.objectContaining({
          topLeft: 0,
          topRight: 0,
          bottomLeft: 50,
          bottomRight: 0,
        })
      );

      await fixture.snapshot('Media element with bottom left corner radius');
    });
  });

  it('should allow user to add border radius for shape if rectangular', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    await fixture.events.click(fixture.editor.sidebar.designTab);
    const panel = fixture.editor.sidebar.designPanel.sizePosition;
    await fixture.events.click(panel.radius(), {
      clickCount: 3,
    });
    await fixture.events.keyboard.type('50');
    await fixture.events.keyboard.press('tab');

    const [element] = await getSelection();
    const {
      borderRadius: { topLeft },
    } = element;
    expect(topLeft).toBe(50);
    await fixture.snapshot('Shape element with locked border radius');
  });

  it('should not allow border radius for non-rectangular shape', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Circle'));
    // Verify that the radius input is not found.
    await fixture.events.click(fixture.editor.sidebar.designTab);
    expect(() =>
      fixture.editor.sidebar.designPanel.sizePosition.radius()
    ).toThrow();
  });
});
